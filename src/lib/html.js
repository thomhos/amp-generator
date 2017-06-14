import fs from 'fs'
import glob from 'glob'
import nunjucks from 'nunjucks'
import { log } from './logger'

/**
 * Grab the HTML page and return the compiled html
 */
export function getHtml(dir, context, opts) {
    return new Promise((resolve, reject) => {
        const { name, cwd } = opts
        // Add the project root as resolvable dir for nunjucks.
        nunjucks.configure(cwd, { noCache: true })
        
        // Grab the first matching tpl file for this page
        const htmlPath = glob.sync(`${dir}/*.tpl`)[0]
        
        // If the path is a valid file, render it
        if(fs.existsSync(htmlPath)) {
            nunjucks.render(htmlPath, context, (err, res) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        } else {
            log.warning('No .tpl found for: %s', name || dir)
            resolve()
        }
    })
}
