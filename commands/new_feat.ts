import { BaseCommand, args } from '@adonisjs/core/ace'

export default class Repository extends BaseCommand {
  public static commandName = 'make:newFeat'
  public static description = 'Create a new feature file'

  @args.string()
  declare name: string

  public async run() {
    await this.kernel.exec('make:repository', [this.name])
    await this.kernel.exec('make:serviceTemplate', [this.name])
    await this.kernel.exec('make:controllerTemplate', [this.name])
    this.logger.action('create').succeeded()
  }
}
