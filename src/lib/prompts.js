import inquirer from 'inquirer'

export function askForConfirmationOnOutputDir() {
    return new Promise((resolve, reject) => {
        const prompt = inquirer.createPromptModule()
        const question = {
            type: 'list',
            name: 'build',
            message: `The provided output dir is outside of this project. Be careful because it will be removed on build. Did you check the path?`,
            choices: ['Yes', 'No'],
            default: 1
        }
    
        prompt(question).then(({ build }) => {
            if(build) {
                resolve()
            } else {
                reject()
            }
        })
    })
}