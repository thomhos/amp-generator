import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'
import perfy from 'perfy'
import { log } from './logger'

export function writeFile(outputPath, fileName, data, pageDir) {
    return new Promise((resolve, reject) => {
        const fileNameIncExt = `${fileName}.html`
        const resolvedFilePath = path.resolve(outputPath, fileNameIncExt)
        
        mkdirp(outputPath, err => {
            if (err) reject(err)
            
            fs.writeFile(resolvedFilePath, data, { flag: 'w' }, error => {
                if (error) reject(error)

                log.success('Successfully rendered %s in %s', fileNameIncExt, perfy.end(pageDir).time + 's')
                resolve(resolvedFilePath)
            })

        })

    })
}

export async function writeAll(output, pages) {
    const writePromises = pages.map(p => writeFile(output, p.name, p.html))
    return await Promise.all(writePromises)
}