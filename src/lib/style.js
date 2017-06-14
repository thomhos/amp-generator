import fs from 'fs'
import stylus from 'stylus'
import glob from 'glob'
import autoprefixer from 'autoprefixer-stylus'
import { log } from './logger'

/**
 * Grab the style file from a directory and return the css
 */
export function getStyle(dir, opts) {
    return new Promise((resolve, reject) => {   
        const { name, prod } = opts     
        
        // Grab the styl file
        const stylePath = glob.sync(`${dir}/*.styl`)[0]

        // If the file exists, compile it with stylus
        if(fs.existsSync(stylePath)) {
            stylus(fs.readFileSync(stylePath, 'utf-8'))
                .set('paths', [dir])
                .set('compress', prod)
                .use(autoprefixer({ browsers: ['last 2 versions', 'ios 8', 'ie 10'] }))
                .render((err, css) => {
                    if(err) {
                        reject(err)
                    } else {
                        resolve(css)
                    }
                })
        } else {
            log.warning('No .styl provided for: %s', name || dir)
            resolve()
        }
    })
}
