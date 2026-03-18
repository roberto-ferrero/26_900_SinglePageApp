import Page from '../core/Page'
import Header from '../components/Header/Header'
import Contact from '../components/Contact/Contact'
import Footer from '../components/Footer/Footer'

class ContactPage extends Page {
    constructor() {
        super([
            new Header(),
            new Contact(),
            new Footer()
        ])
    }

    get name() { return 'contact' }
}

export default ContactPage
