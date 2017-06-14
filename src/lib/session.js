import path from 'path'
import { log } from '../lib'

/**
 * Validates the user session,
 * Kills it if not valid,
 * Provided defaults for other settings
 */

export async function createSession(session) {
    return new Promise((resolve) => {
        let { source, output, prod, verbose } = session
        const cwd = process.cwd()

        if(!source) {
            log.info('No source path provided, defaulting to ./src')
        } else {
            source = path.resolve(source)
        }

        if(!output) {
            log.info('No output path provided, defaulting to ./build')
        } else {
            output = path.resolve(output)
        }

        const outputInCwd = output.indexOf(cwd) === 0
        
        global.session = { source, output, outputInCwd, prod, verbose }

        log.vinfo('Source is set to: %s', source)
        log.vinfo('Output is set to: %s', output)
        log.vinfo('Build mode: %s', prod ? 'prod' : 'dev')

        resolve(global.session)
    })
}