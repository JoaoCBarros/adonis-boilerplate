import { BaseCommand, args } from '@adonisjs/core/ace'
import { promises as fs } from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export default class Controller extends BaseCommand {
  // Nome do comando e descrição
  public static commandName = 'make:controllerTemplate'
  public static description = 'Create a new controller file'

  // Definir os argumentos do comando
  @args.string()
  declare name: string

  // Função de execução do comando
  public async run() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const __filename = fileURLToPath(import.meta.url)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const __dirname = dirname(__filename)

    const entityPath = path.join('app', 'controllers', `${this.name.toLowerCase()}_controller.ts`)

    const templateFilePath = path.join(__dirname, 'templates', 'controller.txt')

    try {
      await fs.access(entityPath)
      this.logger.action('create').skipped(entityPath)
      return
    } catch (err) {}

    const templateContent = await fs.readFile(templateFilePath, 'utf-8')

    const fileContent = templateContent.replace(/{{entityName}}/g, this.name)

    await fs.writeFile(entityPath, fileContent)

    this.logger.action('create').succeeded()
  }
}
