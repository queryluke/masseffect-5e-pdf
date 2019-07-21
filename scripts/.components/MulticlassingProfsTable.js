
  export default {
    data () {
      return {
        profs: {
          headers: [
            { text: 'Class', value: 'name', sortable: false, align: 'left' },
            { text: 'Proficiencies Gained', value: 'prof', sortable: false, align: 'left' }
          ],
          items: [
            {
              name: 'Adept',
              prof: 'SMGs'
            },
            {
              name: 'Engineer',
              prof: 'Assault Rifles, Medium Armor'
            },
            {
              name: 'Infiltrator',
              prof: 'Sniper Rifles and Melee Weapons'
            },
            {
              name: 'Sentinel',
              prof: 'Medium Armor, Heavy Armor, and choose 1 weapon type from Assault Rifles, Melee, Shotguns, or SMGS'
            },
            {
              name: 'Soldier',
              prof: '2 weapon types, Medium Armor, Heavy Armor'
            },
            {
              name: 'Vanguard',
              prof: 'Shotguns, Medium Armor'
            }
          ]
        }
      }
    }
  }
