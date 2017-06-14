import glob from 'glob'

export function getModule(dirPath) {    
    let mod;

    glob.sync(`${dirPath}/*.js`).map(jsFile => {
        delete require.cache[require.resolve(jsFile)]
        mod = require(jsFile)
    })

    return mod
}