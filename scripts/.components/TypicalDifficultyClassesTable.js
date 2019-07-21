
  export default {
    data () {
      return {
        headers: [
          { text: 'Task Difficulty', value: 'difficulty', sortable: false, align: 'left' },
          { text: 'DC', value: 'dc', sortable: false, align: 'left' }
        ],
        items: [
          { difficulty: 'Very Easy', dc: 5 },
          { difficulty: 'Easy', dc: 10 },
          { difficulty: 'Medium', dc: 15 },
          { difficulty: 'Hard', dc: 20 },
          { difficulty: 'Very Hard', dc: 25 },
          { difficulty: 'Nearly impossible', dc: 30 }
        ]
      }
    }
  }
