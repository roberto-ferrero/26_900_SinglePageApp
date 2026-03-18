import './Header.css'
import Component from '../../core/Component'

class Header extends Component {

    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------

    build() {
        this.el = this._createElement('header', 'header')
        this.el.innerHTML = `
            <div class="header__logo">MySite</div>
            <nav class="header__nav">
                <a href="#index">Home</a>
                <a href="#contact">Contact</a>
            </nav>
        `
        return this.el
    }

    init() {
        const hash = window.location.hash.replace('#', '') || 'index'
        this.el.querySelectorAll('.header__nav a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${hash}`)
        })
    }
}

export default Header
