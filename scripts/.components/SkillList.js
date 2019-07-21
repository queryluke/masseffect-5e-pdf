
  import skills from '~/static/data/skills.json'
  export default {
    props: {
      abilityLimit: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        skills
      }
    },
    computed: {
      items () {
        if (this.abilityLimit) {
          return this.skills.filter(s => s.link === this.abilityLimit)
        }
        return this.skills
      }
    }
  }
