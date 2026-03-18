import Page from '../core/Page'
import Header from '../components/Header/Header'
import Hero from '../components/Hero/Hero'
import SimpleCards from '../components/SimpleCards/SimpleCards'
import Footer from '../components/Footer/Footer'

class IndexPage extends Page {
    constructor() {
        super([
            new Header(),
            new Hero(),
            new SimpleCards(),
            new Footer()
        ])
    }

    get name() { return 'index' }
}

export default IndexPage
