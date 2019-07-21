
  export default {
    data () {
      return {
        profs: {
          headers: [
            { text: 'Size', value: 'size', sortable: false, align: 'left' },
            { text: 'Space', value: 'space', sortable: false, align: 'left' }
          ],
          items: [
            {
              size: 'Tiny',
              space: '1m by 1m'
            },
            {
              size: 'Small',
              space: '2m by 2m'
            },
            {
              size: 'Medium',
              space: '2m by 2m'
            },
            {
              size: 'Large',
              space: '4m by 4m'
            },
            {
              size: 'Huge',
              space: '8m by 8m'
            },
            {
              size: 'Gargantuan',
              space: '10m by 10m'
            }
          ]
        }
      }
    }
  }
