const fs = require('fs')
const fm = require('front-matter')
const _ = require('lodash')
import listOfChoices from './../../masseffect-5e/plugins/filters/listOfChoices'
import ordinal from './../../masseffect-5e/plugins/filters/ordinal'

const xpByCr = [
  {cr: 0, xp: 10},
  {cr: '1/8', xp: 25},
  {cr: '1/4', xp: 50},
  {cr: '1/2', xp: 100},
  {cr: 1, xp: 200},
  {cr: 2, xp: 450},
  {cr: 3, xp: 700},
  {cr: 4, xp: 1100},
  {cr: 5, xp: 1800},
  {cr: 6, xp: 2300},
  {cr: 7, xp: 2900},
  {cr: 8, xp: 3900},
  {cr: 9, xp: 5000},
  {cr: 10, xp: 5900},
  {cr: 11, xp: 7200},
  {cr: 12, xp: 8400},
  {cr: 13, xp: 10000},
  {cr: 14, xp: 11500},
  {cr: 15, xp: 13000},
  {cr: 16, xp: 15000},
  {cr: 17, xp: 18000},
  {cr: 18, xp: 20000},
  {cr: 19, xp: 22000},
  {cr: 20, xp: 25000},
  {cr: 21, xp: 33000},
  {cr: 22, xp: 41000},
  {cr: 23, xp: 50000},
  {cr: 24, xp: 62000},
  {cr: 25, xp: 75000},
  {cr: 26, xp: 90000},
  {cr: 27, xp: 105000},
  {cr: 28, xp: 120000},
  {cr: 29, xp: 135000},
  {cr: 30, xp: 155000}
]


// potentially rerun certain sections
const limit = process.argv[2]

function mdFiles(dir) {
  const path = `./../masseffect-5e/static/data/${dir}`
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
  fs.writeFileSync(`./scripts/parts/${file}.md`, text)
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

// Vehicle List

if (limit === 'vehicles') {
  const vehicles = mdFiles('vehicles')
  const text = []
  for (const v of vehicles) {
    const vt = []
    vt.push('___\n___')
    vt.push(`> ## ${v.name}`)
    const subtype = v.vehicle.subtype ? ` (${v.vehicle.subtype})` : ''
    vt.push(`> *${_.startCase(v.size)} ${v.vehicle.type}${subtype}*`)
    vt.push('> ___')
    vt.push(`> - **Armor Class** ${v.ac}`)
    vt.push(`> - **Hull Points** ${v.hp.toLocaleString()}`)
    vt.push(`> - **Shield Points** ${v.sp.toLocaleString()}`)
    vt.push(`> - **Speed** ${v.speed}`)
    vt.push('> ___')
    vt.push(`> - **Range** ${_.parseInt(v.range.replace(/\D/g, '')).
        toLocaleString()} ${v.range.replace(/[^A-Za-z]/g, '')}`)
    vt.push(`> - **Crew** Minimum ${v.crew.min}. Maximum ${v.crew.max}`)
    const cost = _.isInteger(v.cost) ? v.cost.toLocaleString() : v.cost
    vt.push(`> - **Cost** ${cost}`)
    vt.push(`> - **Cargo Capacity** ${v.cargo} tonnes`)
    const crXp = xpByCr.find(c => c.cr.toString() === v.cr.toString().replace(/\D/g,''))
    if (crXp) {
      vt.push(`> - **Challenge** ${v.cr} (${crXp.xp.toLocaleString()} XP)`)
    } else {
      console.log(`could not find cr: ${v.cr}`)
    }
    vt.push('>')
    vt.push('> ### Systems')
    for (const s of v.systems) {
      if (s.type === 'combined') {
        vt.push(`> ***Combined (${s.systems.join(', ')}).*** ${s.crew} crew`)
      } else {
        vt.push(`> ***${s.type}.*** ${s.crew} crew`)
      }
      vt.push('>')
    }
    const addSystems = v.body.match(/__Additional Systems__:(.*)/gm)
    if (addSystems) {
      const addSystemsText = addSystems[0].replace(/__Additional Systems__: /g, '')
      vt.push(`> ***Additional Systems.*** ${addSystemsText}`)
    }
    if (v.weapons) {
      vt.push('> ### Weapons')
      for (const w of v.weapons) {
        vt.push(`> ***${w.name}.*** ${w.damage}`)
        vt.push('>')
      }
    }
    vt.push(`\n ${v.body}`)
    if (v.image) {
      vt.push(`\n <img src='${v.image}' style='width:325px' />`)
    }
    text.push(vt.join('\n'))
  }
  write('vehicles',text.join('\n\n'))
}


// Spell list

if (limit === 'spelllist') {
  const spells = mdFiles('spells')
  const classes = require('./../../masseffect-5e/static/data/classes')
  let text = ''
  for(const c of classes) {
    text += `\n\n<div class='spellList'>\n### ${c.name}`
    const cs = spells.filter(s => s.availableClasses.includes(c.id))
    for(const lvl of [0,1,2,3,4,5]) {
      const lvls = cs.filter(s => s.level === lvl)
      if (lvls.length > 0) {
        if (lvl === 0) {
          text += `\n##### Cantrips (0 Level)`
        } else {
          text += `\n##### ${ordinal(lvl)} Level`
        }
        const names = lvls.map(s => `- ${s.name}`)
        text += `\n${names.join('\n')}\n`
      }
    }
    text += '</div>'
  }
  write('spell-list',text)
}

// spells

if (limit === 'spells') {
  const spells = mdFiles('spells')

  let text = ''

  for (const s of spells) {
    text += `#### ${s.name}\n`
    text += s.level === 0 ? `*${_.startCase(s.type)} cantrip*\n` : `*${ordinal(s.level)}-level ${s.type}*\n`
    text += '___\n'
    text += `- **Casting Time:** ${s.castingTime}\n`
    text += `- **Range:** ${s.distance.range}\n`
    text += `- **Duration:** ${s.concentration ? `Concentration, up to ${s.duration}` : s.duration}\n`
    text += '\n'
    const body = s.body.replace(/__At Higher Levels__:?\.?/i,'___At Higher Levels.___').replace(/<condition id="(.*?)"\/?>/g, function(m,p1) {
      return `*${p1}*`
    })
    text += body
    text += '\n'
    text += '___\n- __Advancements__\n'
    for (const adv of s.advancementOptions) {
      text += `- *${adv.name}.* ${adv.description}\n`
    }
    text += '\n\n\n\n'
  }

  write('spells', text)
}

// armor sets

if (limit === 'armorsets') {
  const sets = _.sortBy(require('./../../masseffect-5e/static/data/armor_sets'), ['name'])

  let text = ''

  for (const s of sets) {
    text += `#### ${s.name}\n`
    const ado = s.andromeda ? ', Andromeda-only' : ''
    text += `*${s.armorType} ${_.lowerCase(s.type)}, ${_.lowerCase(s.rarity)}${ado}*\n`
    text += '___\n'
    text += `- **Cost:** ${_.parseInt(s.cost).toLocaleString()}\n`
    if (s.feature) {
      text += '\n'
      text += `${s.feature.split('--').join(' ')}\n`
    }
    if (s.setBonus) {
      const bonuses = s.setBonus.split('--').map((b) => {
        return b.trim().replace(/set bonus \((\d) of (\d)\):/gi, function(match, p1, p2) {
          return `___Set Bonus (${p1} of ${p2}).___`
        })
      })
      text += `\n${bonuses.join('\n\n')}`
    }
    text += '\n\n\n\n'
  }
  write('armor-sets', text)
}

// armor mods

if (limit === 'armormods') {
  const sets = _.sortBy(require('./../../masseffect-5e/static/data/armor_mods'), ['name'])

  let text = ''

  for (const s of sets) {
    text += `#### ${s.name}\n`
    text += `*${s.type}, ${_.lowerCase(s.rarity)}*\n`
    text += '___\n'
    text += `- **Cost:** ${_.parseInt(s.cost).toLocaleString()}\n`
    text += '\n'
    text += `${s.feature}\n`
    text += '\n\n\n\n'
  }
  write('armor-mods', text)
}

// weapons

if (limit === 'weapons') {
  const sets = _.groupBy(_.sortBy(require('./../../masseffect-5e/static/data/weapons'), ['name']), 'type')
  let text = ''

  _.forEach(sets, function(value, key) {
    text += `### ${key}\n\n`

    for (const s of value) {
      text += `#### ${s.name}\n`
      const ado = s.andromeda ? ', Andromeda-only' : ''
      const props = s.properties ? `, ${s.properties.map(p => _.lowerCase(p)).join(', ')}`:''
      text += `*${s.rarity} ${_.lowerCase(s.type)}${props}${ado}*\n`
      text += '___\n'
      text += `- **Cost:** ${_.parseInt(s.cost).toLocaleString()}\n`
      text += `- **Damage:** ${s.damage} ${s.dmgType}\n`
      if (s.type !== 'Melee') {
        const addRange = s.type === 'Heavy Weapon' ? '' : `/${_.parseInt(s.range) * 3}`
        text += `- **Range:** ${s.range}${addRange}m\n`
        text += `- **${s.type === 'Heavy Weapon' ? 'Charges' : 'Heat'}:** ${s.heat}\n`
      }
      text += `- **Weight:** ${s.weight}\n`
      if (s.notes) {
        text += '\n'
        text += `${s.notes}\n`
      }
      text += '\n\n\n\n'
    }
  })


  write('weapons', text)
}

// weapon mods

if (limit === 'weaponmods') {
  const sets = _.sortBy(require('./../../masseffect-5e/static/data/weapon_mods'), ['name'])

  let text = ''

  for (const s of sets) {
    let availability = 'all ranged weapons'
    if (s.availability.length < 5) {
      if (s.availability[0] === 'Melee') {
        availability = 'melee weapons'
      } else {
        availability = s.availability.map(a => `${a.toLowerCase()}s`).join(', ')
      }
    }
    text += `#### ${s.name}\n`
    text += `*${s.rarity} ${s.placement.toLowerCase()} mod, available for ${availability}*\n`
    text += '___\n'
    text += `- **Cost:** ${_.parseInt(s.cost).toLocaleString()}\n`
    text += '\n'
    text += `${s.feature}\n`
    text += '\n\n\n\n'
  }
  write('weapon-mods', text)
}

// grenades

if (limit === 'grenades') {
  const grenades = mdFiles('grenades')

  let text = ''

  for (const g of grenades) {
    text += `#### ${g.name}\n`
    text += '\n'
    const body = g.body.replace(/__At higher marks__:?\.?/i,'___At Higher Marks.___').replace(/<condition id="(.*?)"\/?>/g, function(m,p1) {
      return `*${p1}*`
    })
    text += body
    text += '\n'
    text += '\n\n\n\n'
  }

  write('grenades', text)
}