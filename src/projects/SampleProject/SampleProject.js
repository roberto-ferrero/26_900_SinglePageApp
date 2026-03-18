import './SampleProject.css'
import Project from '../../core/Project'
import IndexPage from './pages/IndexPage'
import ContactPage from './pages/ContactPage'

class SampleProject extends Project {
    constructor() {
        super()
        this.pages = {
            index:   IndexPage,
            contact: ContactPage
        }
        this.defaultHash = 'index'
    }
}

export default SampleProject
