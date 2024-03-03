#! /usr/bin/env node

const { program } = require('commander')
const inquirer = require('inquirer')
const downloadGitRepo = require('download-git-repo')
const path = require('path')
const fs = require('fs-extra')
const ora = require('ora')

const pkg = require('../package.json')

program.version(`v${pkg.version}`)

program
  .command('create')
  .description('create a new project')
  .action(async () => {
    const { projectName, template } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'input your project name',
      },
      {
        type: 'list',
        name: 'template',
        message: 'choose a template',
        choices: [
          {
            name: 'vue',
            value: 'https://github.com:PanJiaChen/vue-element-admin'
          },
          {
            name: 'react',
            value: 'https://github.com:marmelab/react-admin'
          }
        ]
      },
    ])

    /* -------------------------------- 判断文件夹是否存在 ------------------------------- */
    const dest = path.join(process.cwd(), projectName)
    if (fs.existsSync(dest)) {
      const { isExist } = await inquirer.prompt({
        type: 'confirm',
        name: 'isExist',
        message: `The folder ${projectName} is already exist, do you want to overwrite it?`,
        default: false,
      })

      isExist ? fs.removeSync(dest) : process.exit(1)
    }

    const loading = ora('downloading template...')
    loading.start()

    /* --------------------------------- 获取目标文件夹 -------------------------------- */
    downloadGitRepo(template, dest, (err) => {
      if (err) {
        console.log(`download failed: ${err}`)
        return
      }
      console.log(`download successfully!`)
    })

    /* ----------------------------- 修改package.json ----------------------------- */
    const pkgPath = path.join(process.cwd(), projectName, 'package.json')
    const pkgContent = fs.readFileSync(pkgPath, 'utf-8')
    const pkgJson = JSON.parse(pkgContent)

    pkgJson.name = projectName
    pkgJson.version = '1.0.0'

    fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2))
  })

program.parse(process.argv)
