import './Footer.css'
import Component from '../../core/Component'

class Footer extends Component {

    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------

    build() {
        this.el = this._createElement('footer', 'footer')
        this.el.innerHTML = `
            <p class="footer__copy">&copy; 2026 MySite. All rights reserved.</p>
        `
        return this.el
    }
}

export default Footer
