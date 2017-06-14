#!/usr/bin/env node

import 'babel-polyfill'
import commander from 'commander'
import perfy from 'perfy'
import AmpBuilder from './amp-builder'
import { createSession, log } from './lib'

/**
 * Start timing process
 */
perfy.start('build')

/**
 *  Configuration of cli
 */
const userSession = commander
    .version('0.0.1')
    .option('-s, --source [source]', 'Path where the page files are stored', './src')
    .option('-o, --output [output]', 'Output dir for the static pages', './build')
    .option('-v, --verbose [verbose]', 'Output more information', false)
    .option('-p, --prod [prod-mode]', 'Prod mode: no watchers and optimisation', false)
    .parse(process.argv)

/**
 * Create a session from the CLI input and kick off the builder
 */
createSession(userSession).then(session => {
    const builder = new AmpBuilder(session)
    
    if(session.prod) {
        builder.start()
            .then(() => {
                log.info('Finished build in %s', perfy.end('build').time + 's')
            })
            .catch(log.error)
    } else {
        builder.watch()
            .catch(log.error)
    }
})
