import './Hero.css'
import Component from '../../core/Component'
import gsap from 'gsap'

class Hero extends Component {

    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------

    build() {
        this.el = this._createElement('section', 'hero')
        this.el.innerHTML = `
            <h1 class="hero__title">Welcome</h1>
            <p class="hero__subtitle">A clean SPA built with vanilla JS.</p>
        `
        return this.el
    }

    init() {
        gsap.from(this.el.querySelectorAll('.hero__title, .hero__subtitle'), {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        })
    }

    destroy() {
        gsap.killTweensOf(this.el.querySelectorAll('*'))
    }
}

export default Hero
