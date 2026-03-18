import Page from '@src/core/Page'
import Header from '@src/components/Header/Header'
import Contact from '@src/components/Contact/Contact'
import Footer from '@src/components/Footer/Footer'

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
