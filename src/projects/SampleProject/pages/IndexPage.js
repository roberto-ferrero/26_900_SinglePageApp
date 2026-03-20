import Page from '@src/core/Page'
import Header from '@src/components/Header/Header'
import ImprovedHero from '@src/components/ImprovedHero/ImprovedHero'
import SimpleCards from '@src/components/SimpleCards/SimpleCards'
import Footer from '@src/components/Footer/Footer'

class IndexPage extends Page {
    constructor() {
        super([
            new Header(),
            new ImprovedHero(),
            new SimpleCards(),
            new Footer()
        ])
    }

    get name() { return 'index' }
}

export default IndexPage
