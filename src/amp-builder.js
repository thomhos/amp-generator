import perfy from 'perfy'
import {
    readDir, cleanFolder, writeFile,
    askForConfirmationOnOutputDir,
    getModule, getStyle, getHtml,
    addWatchers, log, serve
} from './lib'

export default class AmpBuilder {

    /**
     * set the session
     */
    constructor(session) {
        global.session = session
    }

    /**
     * Start will read the dir, clean the output, render all pages
     */
    async start() {
        const { source, output, outputInCwd } = global.session
        const cleanOutput = !outputInCwd ? await askForConfirmationOnOutputDir(output) : true
        const pages  = await readDir(source)
        
        global.session.outputPath = cleanOutput ? await cleanFolder(output) : output
        
        await this.renderAll(pages)
        
        return pages
    }

    /**
     * Watch will call start, and add watchers to all pages
     */
    async watch() {
        const pages = await this.start()
        const { source, outputPath } = global.session

        serve(outputPath)

        addWatchers(pages, source, {
            render: this.render.bind(this),
            renderAll: this.renderAll.bind(this)
        })

        return Promise.resolve()
    }
    
    /**
     * Renders all pages at once
     */
    async renderAll(pages) {
        const { outputPath } = global.session
        return await Promise.all(pages.map(page => this.render(page, outputPath)))
    }

    /**
     * Renders a page directory, also writes it immediately
     */
    async render(pageDir) {
        const { prod, cwd, outputPath }  = global.session
        
        perfy.start(pageDir)
        
        log.vinfo('Starting render for: %s', pageDir)
        
        const data = await getModule(pageDir)

        let style, html

        if(data) {
            style = await getStyle(pageDir, { prod, name: data.name })
            html  = await getHtml(pageDir, { style, ...data }, { cwd, name: data.name })

            if(html) {
                log.vinfo('Successfully rendered %s', data.name)
                return await writeFile(outputPath, data.name, html, pageDir)
            } else {
                log.error('Failed to compile %s', pageDir)
                return Promise.resolve()    
            }
        } else {
            log.error('No js module found for %s', pageDir)
            return Promise.resolve()
        }
    }
}