import rimraf from 'rimraf'
import { log } from './logger'

export function cleanFolder(dir) {
    return new Promise((resolve, reject) => {
        rimraf(dir, err => {
            if(err) {
                reject(err)
            }
            
            log.vinfo('Deleting output directory: %s', dir)
            resolve(dir)
        })
    })
}
