const fs = require('fs')
const fm = require('front-matter')
const _ = require('lodash')
import listOfChoices from './../../plugins/filters/listOfChoices'
import ordinal from './../../plugins/filters/ordinal'

// potentially rerun certain sections
const limit = process.argv[2]

function mdFiles(dir) {
  const path = `./static/data/${dir}`
  const files = fs.readdirSync(path)

  return files.map((file) => {
    const fc = fm(fs.readFileSync(`${path}/${file}`, 'utf8'))
    let item = Object.assign(fc.attributes, {})
    item.body = fc.body
    switch (dir) {
      case 'rules':
        const fileParts = file.split('-')
        item.section = Number.parseInt(fileParts[0])
        item.subSection = Number.parseInt(fileParts[1])
        item.id = file.replace(/\.md$/g, '')
        item.hash = fileParts.splice(2).join('-').replace(/\.md$/g, '')
        break
      case 'class_spellcasting':
      case 'vehicles':
        item.id = file.replace(/.md$/, '')
        break
      default:
        break
    }
    return item
  })
}

function simplePart(collection, section, subSection) {
  const part = collection.find(c => c.section === section && c.subSection === subSection)
  return `## ${part.title}\n${part.body}\n\n`
}

function write(file, text) {
  fs.writeFileSync(`./.manual/parts/${file}.md`, text)
}

const rules = mdFiles('rules')
let text = ''


// Introduction
if (limit === 'introduction') {
  const intro = rules.filter(r => r.section === 1 && r.subSection !== 1);
  text = "# Introduction\n"
  for(let i = 0; i < intro.length; i++) {
    text += `## ${intro[i].title}\n${intro[i].body}\n\n`
  }
  write('introduction', text)
}

// Chapter 1
if (limit === 'chapter1') {
  const chapter = rules.filter(r => (r.section === 2 && ![6,7,8,9,10].includes(r.subSection))|| (r.section === 3 && r.subSection === 1));
  text = "# Chapter 1: Step-by-Step Characters\n"
  for(let i = 0; i < chapter.length; i++) {
    text += `## ${chapter[i].title}\n${chapter[i].body}\n\n`
  }
  write('01/01-step-by-step-characters', text)
}

// Chapter 2
if (limit === 'chapter2') {
  const races = mdFiles('races')
  const traits = mdFiles('traits')
  const variants = mdFiles('subraces')
  for(const race of races) {
    let text = [`## ${race.name}`]
    text.push(`${race.body.replace(/##/g,'###')}`)
    text.push(`### ${race.name} Traits`)

    // classes
    text.push(`__Available Classes__. ${race.availableClasses.length === 6 ? 'All classes' : race.availableClasses.map(c => _.startCase(c)).join(', ')}`)

    // ability score
    if (race.id === 'human') {
      text.push(`__Ability Score Increase__. Your ability scores each increase by 1.`)
    } else {
      const absParts = []
      for(const [index, value] of race.abilityScoreIncrease.entries()) {
        let lead = index === 0 ? 'Your' : index === race.abilityScoreIncrease.length - 1 ? 'and your' : 'your'
        absParts.push(`${lead} ${_.startCase(value.ability)} score increases by ${value.amount}`)
      }
      text.push(`__Ability Score Increase__. ${absParts.join(', ')}.`)
    }

    // basic traits
    for (const key of ['age','alignment','size','speed','startingCredits']) {
      text.push(`__${_.startCase(key)}__. ${race[key]}`)
    }
    // traits
    if (race.traits) {
      for (const traitId of race.traits) {
        const trait = traits.find(t => t.id === traitId)
        if (!trait) {
          console.log(`Could not find ${traitId}`)
          continue
        }
        text.push(`__${trait.name}__. ${trait.body}`)
      }
    }

    // variants
    if (race.variants) {
      for(const variantId of race.variants) {
        const variant = variants.find(v => _.kebabCase(v.name) === variantId)
        if (!variant) {
          console.log(`Could not find ${variantId}`)
          continue
        }
        text.push(`#### ${variant.name}\n${variant.body}`)
      }
    }
    write(`02/${race.name}`, text.join('\n\n'))
  }
}

// Chapter 3
if (limit === 'chapter3') {
  const classes = require('../../static/data/classes')
  const feats = mdFiles('class_features')
  const spellcasting = mdFiles('class_spellcasting')

  let classTable = [
    'Class | Description | Hit Die | Primary Ability | Saving Throw Proficiencies | Armor and Weapon Proficiencies',
    '--- | --- | --- | --- | --- | --- '
  ]

  for(const c of classes) {

    let text = [
      `## ${c.name}`,
      '[placeholder for narrative description]',
      '### History-placeholder',
      '### Specificity-placeholder',
      `### Creating a ${c.name}`,
      '#### Quick build',
      '## Class Features',
      `As a ${c.name.toLowerCase()}, you gain the following class features`
    ]

    let armorProfs = ''
    let fullArmorProfs = ''
    switch (c.armorProficiencies.length) {
      case 2:
        armorProfs = 'Light and medium armor'
        fullArmorProfs = 'Light armor, medium armor'
        break
      case 3:
        armorProfs = 'All armor'
        fullArmorProfs = 'Light armor, medium armor, heavy armor'
        break
      default:
        armorProfs = 'Light armor'
    }
    const weapProfs = listOfChoices(c.weaponProficiencies, c.weaponProficiencyChoices)

    // class table
    const classRow = `${c.name} | ${c.snippet} | d${c.hitDie} | ${c.primaryAbility} | ${c.savingThrows.join(' & ')} | ${armorProfs}, ${weapProfs}`
    classTable.push(classRow)

    // hit points
    text.push('#### Hit Points')
    text.push(`__Hit Dice__: 1d${c.hitDie} per ${c.name.toLowerCase()} level`)
    text.push(`__Hit Points at 1st Level__: ${c.hitDie} + your Constitution modifier`)
    text.push(`__Hit Points at Higher Levels__: 1d${c.hitDie} (or ${c.minHitDieRoll}) + your Constitution modifier per ${c.name.toLowerCase()} level after 1st`)

    // proficiencies
    text.push('#### Proficiencies')
    text.push(`__Armor__: ${fullArmorProfs}`)
    text.push(`__Weapons__: ${weapProfs}`)
    text.push(`__Tools__: None`)
    text.push(`__Saving Throws__: ${c.savingThrows.join(', ')}`)
    text.push(`__Skills__: ${listOfChoices(c.skillProficiencies, c.skillChoices)}`)

    // Equipment
    text.push('#### Equipment')
    text.push('You start with the following equipment, in addition to the equipment granted by your background:')
    text.push(`- ${listOfChoices(c.startingRangedWeapons, c.startingRangedWeaponChoices)}\n- ${listOfChoices(c.startingMeleeWeapons, c.startingMeleeWeaponChoices)}\n- ${listOfChoices(c.startingArmor)}`)

    // Features
    if(c.id === 'soldier') {
      text.push('### Combat Cantrips')
    } else {
      text.push('### Spellcasting')
    }
    const scText = spellcasting.find(sc => sc.id === c.id).body.replace('###', '####')
    text.push(scText)

    const subclassLevels = []
    for(const lvl of c.progression) {
      const level = ordinal(lvl.level)
      for (const featId of lvl.features) {
        if (featId === 'subclass') {
          subclassLevels.push(level)
          continue
        }
        const feature = feats.find(f => f.id === featId)
        if (!feature) {
          console.log(`could not find ${featId}`)
          continue
        }
        text.push(`### ${feature.name}`)
        text.push(feature.body.replace(/{{ level }}/g, level))
      }
    }

    // Subclasses
    text.push('## Subclasses')
    for(const sub of c.subclasses) {
      if (sub.source) {
        continue
      }
      text.push(`### ${sub.name}`)
      text.push(sub.description)
      for (let i = 0; i < sub.features.length; i++) {
        const sublevel = subclassLevels[i]
        for (const featId of sub.features[i]) {
          const feature = feats.find(f => f.id === featId)
          if (!feature) {
            console.log(`could not find ${featId}`)
            continue
          }
          text.push(`#### ${feature.name}`)
          text.push(feature.body.replace(/{{ level }}/g, sublevel))
        }
      }
    }

    // Progression Table
    const pTable = []
    const headers = c.progressionHeaders.map(ph => ph.title)
    if (c.spellSlots) {
      for(let i = 1; i <= c.maxSpellSlot; i++) {
        headers.push(ordinal(i))
      }
    }
    pTable.push(headers.join(' | '))
    pTable.push(headers.map(h => '---').join(' | '))
    for (const lvl of c.progression) {
      const row = []
      for (const header of c.progressionHeaders) {
        const key = header.key ? header.key : _.camelCase(header.title)
        if (key === 'features') {
          const names = lvl.features.map((featId) => {
            if (featId === 'subclass') {
              return 'Subclass Feature'
            }
            const feature = feats.find(f => f.id === featId)
            if (!feature) {
              console.log(`could not find ${featId}`)
            } else {
              return feature.name
            }
          })
          row.push(names.join(', '))
        } else {
          row.push(lvl[key])
        }
      }
      if (c.spellSlots) {
        for(let i = 1; i <= c.maxSpellSlot; i++) {
          const numslots = lvl.spellSlots[`${i}`]
          row.push(numslots ? numslots : '-')
        }
      }
      pTable.push(row.join(' | '))
    }

    text.push(pTable.join('\n'))

    write(`03/${c.name}`, text.join('\n\n'))
  }

  write('03/_classes', classTable.join('\n'))
}

// Chapter 4
if (limit === 'chapter4') {
  const chapter = rules.filter(r => r.section === 2 && [6,7,9,10].includes(r.subSection))
  text = "# Chapter 4: Personality and Background\n"
  text += 'Characters are defined by much more than their race and class. They’re ' +
    'individuals with their own stories, interests, connections, and capabilities ' +
    'beyond those that class and race define. This chapter expounds on the details ' +
    'that distinguish characters from one another, including the basics of name ' +
    'and physical description, the rules of backgrounds and languages, and the ' +
    'finer points of personality and alignment.'

  for(let i = 0; i < chapter.length; i++) {
    text += `### ${chapter[i].title}\n${chapter[i].body}\n\n`
  }

  write('04/01-character-details', text)

  text = simplePart(rules, 3, 3)
  text += simplePart(rules, 3, 4)
  write('04/02-inspiration', text)

  text = simplePart(rules, 2, 8)
  const backgrounds = mdFiles('backgrounds')
  for (const background of backgrounds) {
    text += `### ${background.name}\n${background.body}\n\n`
  }
  write('04/03-backgrounds', text)
}


