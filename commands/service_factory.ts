import { BaseCommand, args } from '@adonisjs/core/ace'
import { promises as fs } from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export default class ServiceFactory extends BaseCommand {
  // Nome do comando e descrição
  public static commandName = 'make:serviceFactory'
  public static description = 'Create a new service factory file'

  // Definir os argumentos do comando
  @args.string()
  declare name: string

  // Função de execução do comando
  public async run() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const __filename = fileURLToPath(import.meta.url)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const __dirname = dirname(__filename)

    const modulePath = path.join('app', 'factories', `${this.name.toLowerCase()}_service`)
    try {
      await fs.access(modulePath)
    } catch (err) {
      await fs.mkdir(modulePath, { recursive: true })
    }

    const entityPath = path.join(
      'app',
      `factories/${this.name.toLowerCase()}_service`,
      `${this.name.toLowerCase()}_factory.ts`
    )

    const templateFilePath = path.join(__dirname, 'templates', 'service-factory.txt')

    try {
      await fs.access(entityPath)
      this.logger.action('create').skipped(entityPath)
      return
    } catch (err) {}

    const templateContent = await fs.readFile(templateFilePath, 'utf-8')

    const fileContent = templateContent
      .replace(/{{entityName}}/g, this.name)
      .replace(/{{entityNameLowerCase}}/g, this.name.toLowerCase())

    await fs.writeFile(entityPath, fileContent)

    this.logger.action('create').succeeded()
  }
}
