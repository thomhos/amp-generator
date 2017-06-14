import path from 'path'
import chokidar from 'chokidar'
import { log } from './logger'

global.watchers = {}

/**
 * Add watchers for each page, 
 */
export function addWatchers(arrayofPagePaths, sourcePath, callbacks ) {
    // Add watchers for each page
    arrayofPagePaths.forEach((pagePath) => {
        addWatcher(pagePath, callbacks)
    })

    // Add watcher for other files
    if(!global.mainWatcher) {
        addMainWatcher(arrayofPagePaths, sourcePath, callbacks)
    }
}

/**
 * Watch other files, and adding / deleting files
 */
export function addMainWatcher(arrayofPagePaths, sourcePath, cbs) {
    const { outputPath } = global.session
    const resolvedSourceParentPath = path.resolve(sourcePath, '../')
    
    const mainWatcher = chokidar.watch(resolvedSourceParentPath, {
        ignored: [outputPath],
        persistent: true,
        ignoreInitial: true
    })

    mainWatcher.on('change', p => {
        const changeToAsset = p.indexOf(sourcePath) === -1
        log.vinfo('change detected at %s', p)

        if(changeToAsset) {
            log.vinfo('Change is for an asset, so all pages rebuild')
            cbs.renderAll(arrayofPagePaths)
        } else {
            log.vinfo('Change is for page, will be handled by own watcher')
        }
    })

    mainWatcher.on('addDir', p => {
        const addedPage = p.indexOf(sourcePath) === 0

        if(addedPage) {
            log.vinfo('New page directory: %s', p)
            cbs.render(p)
            addWatcher(p, cbs)
        } else {
            log.vinfo('New directory %s is not a page, so ignore it', p)
        }
    })

    mainWatcher.on('unlinkDir', p => {
        const removedPage = p.indexOf(sourcePath) === 0

        if(removedPage) {
            log.vinfo('Directory removed from watchers: %s', p)
            if(global.watchers[p]) global.watchers[p].close()
        }
    })

    global.mainWatcher = mainWatcher
}

/**
 * Watch pages, so we only compile a page when we need to
 */
export function addWatcher(pagePath, cbs) {    
    if(!global.watchers[pagePath]) {
        const watcher = chokidar.watch(pagePath, {
            persistent: true
        })
        
        log.vinfo('Monitoring changes for %s', pagePath)
        watcher.on('change', () => cbs.render(pagePath))

        global.watchers[pagePath] = watcher
    }
}