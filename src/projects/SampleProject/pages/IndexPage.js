import Page from '@src/core/Page'
import Header from '@src/components/Header/Header'
import Hero from '@src/components/Hero/Hero'
import SimpleCards from '@src/components/SimpleCards/SimpleCards'
import Footer from '@src/components/Footer/Footer'

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
