
  import stats from '~/static/data/random_height_weight'
  export default {
    data () {
      return {
        stats,
        tables: [
          {
            name: 'Metric',
            headers: [
              {key: 'race', display: 'Race'},
              {key: 'baseCm', display: 'Base Height (cm)'},
              {key: 'heightModifierCm', display: 'Height Modifier'},
              {key: 'weightKg', display: 'Base Weight (kg)'},
              {key: 'weightModifierKg', display: 'Weight Modifier'},
            ]
          },
          {
            name: 'Imperial',
            headers: [
              {key: 'race', display: 'Race'},
              {key: 'base', display: 'Base Height'},
              {key: 'heightModifier', display: 'Height Modifier'},
              {key: 'baseWeight', display: 'Base Weight'},
              {key: 'weightModifier', display: 'Weight Modifier'},
            ]
          }
        ]
      }
    }
  }
