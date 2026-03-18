import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Router from './core/Router'
import Transition from './utils/Transition'

gsap.registerPlugin(ScrollTrigger)

class App {
    constructor(ProjectClass) {
        this.project     = new ProjectClass()
        this.currentPage = null
        this.appEl       = document.getElementById('app')
        this.transition  = new Transition()
        this.router      = new Router(this._onNavigate.bind(this))
        this._init()
    }

    //----------------------------------------------
    // PRIVATE:
    //----------------------------------------------

    _init() {
        this.transition.hidePreloader()
        this.router.start()
    }

    _onNavigate(hash) {
        if (this.currentPage?.name === hash) return
        this._changePage(hash)
    }

    async _changePage(hash) {
        await this.transition.coverScreen()

        if (this.currentPage) this.currentPage.destroy()

        const newPage = this.project.getPage(hash)
        this.appEl.appendChild(newPage.build())
        this.currentPage = newPage

        await this.transition.revealScreen()

        this.currentPage.init()
    }
}

export default App
