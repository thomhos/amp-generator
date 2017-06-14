import path from 'path'
import fs from 'fs'

export function readDir(dirPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if(err) reject(err)
            resolve(files.map(file => path.resolve(dirPath, file)))
        })
    })
}

export function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, file) => {
            if(err) reject(err)
            resolve(path.resolve(filePath, file))
        })
    })
}
