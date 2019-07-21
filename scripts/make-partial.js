const fs = require('fs')

function getComponent (file) {
  const text = fs.readFileSync(file, 'utf8')
  let script = text.match(/<script>[\s\S]+<\/script>/gmi)[0]
  script = script.replace(/<\/?script>/g,'')
  return script
}

// const files = fs.readdirSync('./components/rule_partials')

// for(let i = 0; i < files.length; i++) {
//   const file = files[i]
//   const fn = file.replace('.vue','.js')
//   const script = getComponent(`./../masseffect-5e/components/rule_partials/${file}`)
//   fs.writeFileSync(`./scripts/.components/${fn}`, script)
// }

const file = 'AbilityScoreModifiers'
const component = require(`./../masseffect-5e/components/${file}`)
const data = component.default.data()

let text = ''

// for tables
const keys = data.headers.map(h => h.value)
text += data.headers.map(h => h.text).join(' | ')
text += '\n'
for (let i = 0; i < data.headers.length - 1; i++) {
  text += '--- | '
}
text += '---\n'
const rows = data.items.map((i) => {
  const columns = []
  for (let j = 0; j < keys.length; j++) {
    columns.push(i[keys[j]])
  }
  return columns.join(' | ')
})
text += rows.join('\n')
fs.writeFileSync(`./scripts/.partials/${file}.md`, text)











