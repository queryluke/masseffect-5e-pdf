
  import items from '~/static/data/ship_upgrades'
  export default {
    data () {
      return {
        headers: [
          { text: 'Name', value: 'name', align: 'left', sortable: true },
          { text: 'System', value: 'system', sortable: true, align: 'left' },
          { text: 'Cost', value: 'cost', sortable: true, align: 'left' },
          { text: 'Prerequisite', value: 'prerequisite', sortable: false, align: 'left' },
          { text: 'Effect', value: 'effect', sortable: false, align: 'left' }
        ],
        items
      }
    }
  }
