
  export default {
    data () {
      const items = []
      for (let x = 0; x <= 30; x += 2) {
        const score = x === 0 ? 1 : x === 30 ? x : `${x} - ${x + 1}`
        items.push({ score, mod: Math.ceil((x - 10) / 2) })
      }

      return {
        headers: [
          { text: 'Score', value: 'score', sortable: false, align: 'left' },
          { text: 'Modifier', value: 'mod', sortable: false, align: 'left' }
        ],
        items
      }
    }
  }
