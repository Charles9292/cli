#! /usr/bin/env node

const { program } = require('commander')
const inquirer = require('inquirer')
const pkg = require('../package.json')

program.version(`v${pkg.version}`)

program
  .command('create')
  .description('create a new project')
  .action(async () => {
    const { projectName } = await inquirer.prompt({
      type: 'input',
      name: 'projectName',
      message: 'input your project name',
    })

    console.log(projectName)
  })

program.parse(process.argv)
