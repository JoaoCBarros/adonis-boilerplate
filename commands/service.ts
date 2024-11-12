import { BaseCommand, args } from '@adonisjs/core/ace'
import { promises as fs } from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export default class Service extends BaseCommand {
  // Nome do comando e descrição
  public static commandName = 'make:serviceTemplate'
  public static description = 'Create a new service file'

  // Definir os argumentos do comando
  @args.string()
  declare name: string

  // Função de execução do comando
  public async run() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const __filename = fileURLToPath(import.meta.url)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const __dirname = dirname(__filename)

    const servicePath = path.join('app', 'services', `${this.name.toLowerCase()}_service.ts`)

    const templateFilePath = path.join(__dirname, 'templates', 'service.txt')

    try {
      await fs.access(servicePath)
      this.logger.action('create').skipped(servicePath)
      return
    } catch (err) {}

    const templateContent = await fs.readFile(templateFilePath, 'utf-8')

    const fileContent = templateContent.replace(/{{serviceName}}/g, this.name)

    await fs.writeFile(servicePath, fileContent)

    await this.kernel.exec('make:serviceFactory', [this.name])

    this.logger.action('create').succeeded()
  }
}
