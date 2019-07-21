
  export default {
    props: {
      pages: {
        type: String,
        default: ''
      },
      source: {
        type: String,
        default: 'srd'
      },
      additional: {
        type: Array,
        default: () => { return [] }
      }
    },
    data () {
      return {
        sources: {
          srd: {
            link: 'http://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf',
            title: 'Dungeons & Dragons System Reference Document 5.1'
          },
          basic: {
            link: 'http://media.wizards.com/2016/downloads/DND/PlayerBasicRulesV03.pdf',
            title: 'Dungeons & Dragons: Player\'s Basic Rules Version 0.3'
          },
          races: {
            link: 'https://www.gmbinder.com/share/-L7HA1pIhxcx3bVb8vqf',
            title: 'Races from the Relay'
          },
          wiki: {
            link: 'https://masseffect.fandom.com/wiki/',
            title: 'Mass Effect Wiki'
          }
        }
      }
    },
    computed: {
      link () {
        return this.generateLink(this.source)
      },
      title () {
        return this.generateTitle(this.source)
      },
      pageText () {
        return this.generatePageText(this.source, this.pages)
      }
    },
    methods: {
      generateLink (source) {
        if (source === 'wiki') {
          return `${this.sources[source].link}/${this.pages}`
        }
        return this.sources[source].link
      },
      generateTitle (source) {
        return this.sources[source].title
      },
      generatePageText (source, pages) {
        return source === 'wiki' ? '' : `, p. ${pages}`
      }
    }
  }
