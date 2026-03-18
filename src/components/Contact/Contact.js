import './Contact.css'
import Component from '../../core/Component'

class Contact extends Component {

    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------

    build() {
        this.el = this._createElement('section', 'contact')
        this.el.innerHTML = `
            <h2 class="contact__title">Get in touch</h2>
            <form class="contact__form" novalidate>
                <input type="text"  name="name"    placeholder="Your name"    required>
                <input type="email" name="email"   placeholder="Your email"   required>
                <textarea           name="message" placeholder="Your message" required></textarea>
                <button type="submit">Send</button>
            </form>
        `
        return this.el
    }

    init() {
        this._form = this.el.querySelector('.contact__form')
        this._onSubmit = this._handleSubmit.bind(this)
        this._form.addEventListener('submit', this._onSubmit)
    }

    destroy() {
        if (this._form) this._form.removeEventListener('submit', this._onSubmit)
    }

    //----------------------------------------------
    // PRIVATE:
    //----------------------------------------------

    _handleSubmit(e) {
        e.preventDefault()
        console.log('Form submitted:', Object.fromEntries(new FormData(this._form)))
    }
}

export default Contact
