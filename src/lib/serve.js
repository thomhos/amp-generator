import { create } from 'browser-sync'
import { log } from './logger'

/**
 * Serve the output folder
 */
export function serve(output) {
    const bs    = create('server')
    const port  = 3000

    bs.init({
        server: {
            baseDir: output,
            directory: true
        },
        port,
        logLevel: 'silent'
    }, () => {
        log.info('Pages served on port: %s', port)
    })

    bs.watch(output)
        .on('change', bs.reload)
        .on('add', bs.reload)
}