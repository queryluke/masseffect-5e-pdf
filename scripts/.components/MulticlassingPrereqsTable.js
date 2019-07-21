
  export default {
    data () {
      return {
        prereqs: {
          headers: [
            { text: 'Class', value: 'name', sortable: false, align: 'left' },
            { text: 'Ability Score Minimum', value: 'prereq', sortable: false, align: 'left' }
          ],
          items: [
            {
              name: 'Adept',
              prereq: 'Wisdom 13'
            },
            {
              name: 'Engineer',
              prereq: 'Intelligence 13'
            },
            {
              name: 'Infiltrator',
              prereq: 'Dexterity 13 and Intelligence 13'
            },
            {
              name: 'Sentinel',
              prereq: 'Intelligence 13 or Wisdom 13'
            },
            {
              name: 'Soldier',
              prereq: 'Strength 13 or Dexterity 13'
            },
            {
              name: 'Vanguard',
              prereq: 'Strength 13 and Wisdom 13'
            }
          ]
        }
      }
    }
  }
