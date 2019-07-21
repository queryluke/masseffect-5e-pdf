
  import characterProgression from './../../../masseffect-5e/static/data/character_progression.json'

  export default {
    data () {
      return {
        headers: [
          { text: 'Experience Points', value: 'xp', sortable: false, align: 'left' },
          { text: 'Level', value: 'level', sortable: false, align: 'left' },
          { text: 'Proficiency Bonus', value: 'bonus', sortable: false, align: 'left' }
        ],
        items: characterProgression
      }
    }
  }
