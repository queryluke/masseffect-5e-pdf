
  export default {
    data () {
      return {
        profs: {
          headers: [
            { text: 'Equipment', value: 'equipment', sortable: false, align: 'left' },
            { text: 'Yield', value: 'y', sortable: false, align: 'left' }
          ],
          items: [
            {
              equipment: 'Armor & Weapon Mods, Tools & Kits',
              y: '1'
            },
            {
              equipment: 'Heavy Pistols, SMGs, and Head, Leg, and Arm armor',
              y: '3'
            },
            {
              equipment: 'Assault Rifles, Shotguns, Sniper Rifles, and Chest Armor',
              y: '6'
            },
            {
              equipment: 'Heavy Weapon',
              y: '10'
            }
          ]
        }
      }
    }
  }
