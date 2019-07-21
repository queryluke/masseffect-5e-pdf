
  import items from '~/static/data/commonplace_items.json'

  export default {
    data () {
      return {
        headers: [
          { text: 'Item', value: 'item', align: 'left', sortable: false },
          { text: 'Credits', value: 'credits', sortable: false, align: 'left' }
        ],
        items
      }
    }
  }
