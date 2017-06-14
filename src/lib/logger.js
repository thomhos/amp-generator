import chalk from 'chalk'
import moment from 'moment'

function time() {
    const now = moment().format('HH:mm:ss')
    return chalk.grey(`[${now}]`)
}

const errorColor    = chalk.red
const warningColor  = chalk.yellow
const infoColor     = chalk.cyan
const successColor  = chalk.green

const print = (msg, args) => {
    args = args.map(a => chalk.bold(`'${a}'`))
    console.log(`${time()} ${msg}`, ...args) // eslint-disable-line no-console
}

function vinfo(msg, ...args) {
    const { verbose } = global.session || {}

    if(verbose) {
        print(infoColor(msg), args)
    }
}

function info(msg, ...args) {
    print(infoColor(msg), args)
}

function success(msg, ...args) {
    print(successColor(msg), args)
}

function warning(msg, ...args) {
    print(warningColor(msg), args)
}

function error(msg, ...args) {
    print(errorColor(msg), args)
    
    if(msg.message) {
        print(chalk.grey(msg.message))
    }
    if(msg.stack) {
        print(chalk.grey(msg.stack))
    }
}

export const log =  {
    success,
    error,
    warning,
    info,
    vinfo
}
