"""Import the remaining National Dex and regional forms from PokeAPI CSV data.

Run from the project root. Downloads are cached; existing species and save IDs
are preserved. Regional forms receive stable, separate storage IDs after 1025.
"""
from pathlib import Path
import csv, json, re, urllib.request
from collections import defaultdict

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path('/tmp/poke69-source')
CACHE.mkdir(exist_ok=True)
SOURCE = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'
FILES = ['pokemon.csv', 'pokemon_species.csv', 'pokemon_species_names.csv',
         'pokemon_stats.csv', 'pokemon_types.csv', 'pokemon_abilities.csv',
         'ability_names.csv', 'pokemon_moves.csv', 'moves.csv', 'pokemon_evolution.csv']
def rows(file):
    path = CACHE / file
    if not path.exists():
        with urllib.request.urlopen(SOURCE + file, timeout=40) as response:
            path.write_bytes(response.read())
    return list(csv.DictReader(path.open()))
tables = {file: rows(file) for file in FILES}
path = ROOT / 'index.html'
source = path.read_text()
def data(name):
    return json.loads(re.search(r'^const ' + name + r'\s*=\s*(.+);$', source, re.M)[1])
def replace(name, value):
    global source
    line = 'const ' + name + '=' + json.dumps(value, ensure_ascii=False, separators=(',', ':')) + ';'
    pattern = r'^const ' + name + r'\s*=\s*.+;$'
    source, count = re.subn(pattern, lambda _: line, source, count=1, flags=re.M)
    assert count, name

dex = data('dex')
old_names = {value[0]: name for name, value in dex.items() if value[0] <= 1025}
species = {int(row['id']): row for row in tables['pokemon_species.csv']}
english = {int(row['pokemon_species_id']): row for row in tables['pokemon_species_names.csv'] if row['local_language_id'] == '9'}
pokemon = {int(row['id']): row for row in tables['pokemon.csv']}
defaults = {int(row['species_id']): row for row in tables['pokemon.csv'] if row['is_default'] == '1'}
regional = [row for row in tables['pokemon.csv']
            if any(part in row['identifier'] for part in ['-alola', '-galar', '-hisui', '-paldea', 'basculin-white'])
            and not any(part in row['identifier'] for part in ['-cap', '-totem', '-zen'])]
regional.sort(key=lambda row: int(row['id']))
assert len(regional) == 58
names = {number: old_names.get(number, english[number]['name']) for number in range(1, 1026)}
entries = [(number, defaults[number], names[number], None) for number in range(981, 1026)]
forms = {}
regional_names = {}
for storage_id, row in enumerate(regional, 1026):
    slug = row['identifier']; number = int(row['species_id'])
    region = next((part for part in ['alola', 'galar', 'hisui', 'paldea'] if '-' + part in slug), 'hisui')
    adjective = {'alola': 'Alolan', 'galar': 'Galarian', 'hisui': 'Hisuian', 'paldea': 'Paldean'}[region]
    label = adjective + ' ' + names[number]
    if 'basculin-white' in slug: label = 'White-Striped Basculin'
    if number == 128:
        label = 'Paldean Tauros (' + ('Blaze' if 'blaze' in slug else 'Aqua' if 'aqua' in slug else 'Combat') + ' Breed)'
    generation = {'alola': 7, 'galar': 8, 'hisui': 8, 'paldea': 9}[region]
    forms[str(storage_id)] = {'dex': number, 'base': names[number], 'region': region,
                              'generation': generation, 'encounterRegion': {'alola': 'Alola', 'galar': 'Galar', 'hisui': 'Sinnoh', 'paldea': 'Paldea'}[region],
                              'api': int(row['id'])}
    regional_names[number, region] = label
    entries.append((storage_id, row, label, forms[str(storage_id)]))

stat_order = [1, 2, 3, 6, 5, 4]
stats = defaultdict(dict); effort = defaultdict(dict); types = defaultdict(dict); abilities = defaultdict(list)
for row in tables['pokemon_stats.csv']:
    stats[int(row['pokemon_id'])][int(row['stat_id'])] = int(row['base_stat'])
    effort[int(row['pokemon_id'])][int(row['stat_id'])] = int(row['effort'])
type_names = ['Normal','Fighting','Flying','Poison','Ground','Rock','Bug','Ghost','Steel','Fire','Water','Grass','Electric','Psychic','Ice','Dragon','Dark','Fairy']
for row in tables['pokemon_types.csv']:
    types[int(row['pokemon_id'])][int(row['slot'])] = type_names[int(row['type_id']) - 1]
ability_names = {row['ability_id']: row['name'] for row in tables['ability_names.csv'] if row['local_language_id'] == '9'}
for row in tables['pokemon_abilities.csv']:
    abilities[int(row['pokemon_id'])].append((int(row['slot']), ability_names[row['ability_id']], row['is_hidden'] == '1'))
refs = data('moveReferences'); catalog = data('moveCatalog')
by_slug = {row[0]: name for name, row in refs.items() if name in catalog}
move_names = {row['id']: by_slug.get(row['identifier']) for row in tables['moves.csv']}
learn_rows = defaultdict(list)
relevant = {int(row['id']) for _, row, _, _ in entries}
for row in tables['pokemon_moves.csv']:
    if int(row['pokemon_id']) in relevant and move_names.get(row['move_id']):
        learn_rows[int(row['pokemon_id'])].append(row)
evolution_rows = defaultdict(list)
for row in tables['pokemon_evolution.csv']:
    evolution_rows[int(row['evolved_species_id'])].append(row)

values = {key: data(key) for key in ['dexStats','dexDimensions','pokemonEVYields','pokemonLearnsets','levelUpMoves','iconBounds','evolutionData','speciesAbilities','hiddenAbilities','dexDescriptions','arenaEvolutionSpecs']}
manifest = []
for storage_id, row, name, form in entries:
    api_id = int(row['id']); national = int(row['species_id']); info = species[national]
    stat = [stats[api_id][i] for i in stat_order]
    primary, secondary = types[api_id][1], types[api_id].get(2)
    dex[name] = [storage_id, primary, secondary, stat[0], stat[1], stat[3]]
    for key, value in [('dexStats', stat), ('dexDimensions', [int(row['height']), int(row['weight'])]), ('iconBounds', [0,0,40,30])]:
        while len(values[key]) < storage_id: values[key].append(None)
        values[key][storage_id - 1] = value
    values['pokemonEVYields'][str(storage_id)] = [effort[api_id][i] for i in stat_order]
    learned = learn_rows[api_id]
    versions = {int(r['version_group_id']) for r in learned}
    chosen = next((v for v in [27,26,25,24,22,21,20,18,17,16,15] if v in versions), max(versions))
    learned = [r for r in learned if int(r['version_group_id']) == chosen]
    learned.sort(key=lambda r: (int(r['pokemon_move_method_id']) != 1, int(r['level']), int(r['move_id'])))
    values['pokemonLearnsets'][str(storage_id)] = list(dict.fromkeys(move_names[r['move_id']] for r in learned))
    levelup = {}
    for r in learned:
        if r['pokemon_move_method_id'] == '1':
            move = move_names[r['move_id']]; levelup[move] = min(levelup.get(move,100), max(1,int(r['level'])))
    values['levelUpMoves'][str(storage_id)] = levelup
    parent = int(info['evolves_from_species_id'] or 0)
    parent_name = regional_names.get((parent, form['region'])) if form else None
    parent_id = next((dex[n][0] for n in [parent_name] if n in dex), parent)
    # New forms with an earlier regional parent use that form's separate save ID.
    if parent_name and parent_name not in dex:
        parent_id = next(i for i, _, label, _ in entries if label == parent_name)
    level = next((int(r['minimum_level']) for r in evolution_rows[national] if r['minimum_level'] and r['is_default'] == '1'), 0)
    values['evolutionData'][str(storage_id)] = [parent_id, int(info['capture_rate']), level]
    normal = [ability for _, ability, hidden in sorted(abilities[api_id]) if not hidden]
    hidden = next((ability for _, ability, yes in abilities[api_id] if yes), None)
    values['speciesAbilities'][str(storage_id)] = [normal, hidden]
    if hidden: values['hiddenAbilities'][str(storage_id)] = hidden
    else: values['hiddenAbilities'].pop(str(storage_id), None)
    values['dexDescriptions'][str(storage_id)] = [english[national]['genus'], int(info['color_id'])]
    manifest.append({'id': storage_id, 'dex': national, 'name': name, 'api': api_id, 'region': form['region'] if form else None,
                     'slug': row['identifier']})

# Hardware/location/trade conditions become visible Arena training goals.
specs = values['arenaEvolutionSpecs']
specs.update({'Farigiraf': {'level':32,'move':'Twin Beam'}, 'Dudunsparce': {'level':32,'move':'Hyper Drill'},
              'Kingambit': {'level':52,'wins':5,'castsType':'Dark','casts':10},
              'Gholdengo': {'level':35,'wins':5}, 'Dipplin': {'level':25,'item':'Leaf Stone'},
              'Sinistcha': {'level':30,'wins':3}, 'Archaludon': {'level':50,'castsType':'Steel','casts':15},
              'Hydrapple': {'level':45,'move':'Dragon Cheer'}})
form_rules = {
 'Alolan Raticate': {'level':20,'wins':3}, 'Alolan Raichu': {'item':'Thunder Stone'},
 'Alolan Sandslash': {'item':'Ice Stone'}, 'Alolan Ninetales': {'item':'Ice Stone'},
 'Alolan Persian': {'level':28,'wins':3}, 'Alolan Golem': {'item':'Linking Cord'},
 'Alolan Exeggutor': {'item':'Leaf Stone'}, 'Alolan Marowak': {'level':28,'wins':3},
 'Galarian Slowbro': {'level':37,'wins':3}, 'Galarian Slowking': {'level':37,'item':'Linking Cord'},
 'Galarian Weezing': {'level':35,'wins':3}, 'Galarian Mr. Mime': {'level':20,'move':'Mimic'},
 'Galarian Darmanitan': {'item':'Ice Stone'},
 'Hisuian Arcanine': {'item':'Fire Stone'}, 'Hisuian Electrode': {'item':'Leaf Stone'},
 'Hisuian Typhlosion': {'level':36,'castsType':'Ghost','casts':10},
 'Hisuian Samurott': {'level':36,'castsType':'Dark','casts':10}, 'Hisuian Lilligant': {'item':'Sun Stone'},
 'Hisuian Braviary': {'level':54,'castsType':'Psychic','casts':10},
 'Hisuian Sliggoo': {'level':40,'castsType':'Steel','casts':10},
 'Hisuian Goodra': {'level':50,'castsType':'Water','casts':10},
 'Hisuian Avalugg': {'level':37,'castsType':'Rock','casts':10},
 'Hisuian Decidueye': {'level':36,'castsType':'Fighting','casts':10}}
for name, rule in form_rules.items():
    assert name in dex, name
    specs[name] = rule
    values['evolutionData'][str(dex[name][0])][2] = 0
extras = {}
for origin, target in [('Galarian Meowth','Perrserker'),('Galarian Farfetch\'d','Sirfetch\'d'),('Galarian Corsola','Cursola'),
                       ('Galarian Linoone','Obstagoon'),('Galarian Mr. Mime','Mr. Rime'),('Galarian Yamask','Runerigus'),
                       ('Hisuian Qwilfish','Overqwil'),('Hisuian Sneasel','Sneasler'),('White-Striped Basculin','Basculegion'),('Paldean Wooper','Clodsire')]:
    origin = origin.replace("Farfetch'd", names[83])
    target = target.replace("Sirfetch'd", names[865])
    assert origin in dex and target in dex, (origin,target)
    previous_parent = {862:264,863:52,864:222,865:83,866:122,867:562,902:550,903:215,904:211,980:194}[dex[target][0]]
    previous_name = names[previous_parent]
    values['evolutionData'][str(dex[target][0])][0] = dex[origin][0]
    # Keep the pre-regional Arena training path for existing collections.
    extras[previous_name] = extras.get(previous_name, []) + [{'name':target, **specs[target]}]

replace('dex', dex)
for key, value in values.items(): replace(key, value)
for key, value, anchor in [('speciesForms', forms, 'const dexDimensions'), ('arenaEvolutionExtraRoutes', extras, 'const arenaEvolutionRoutes=')]:
    if re.search(r'^const ' + key + r'=', source, re.M): replace(key,value)
    else: source = source.replace(anchor, 'const '+key+'='+json.dumps(value,ensure_ascii=False,separators=(',',':'))+';\n'+anchor, 1)
rare = json.loads(re.search(r'const legendarySpecies=new Set\((\[.*?\])\);', source)[1])
rare += [i for i in range(981,1026) if species[i]['is_legendary']=='1' or species[i]['is_mythical']=='1']
rare += [int(key) for key, form in forms.items() if form['dex'] in rare]
source = re.sub(r'const legendarySpecies=new Set\(\[.*?\]\);', lambda _: 'const legendarySpecies=new Set('+json.dumps(sorted(set(rare)))+');', source)
path.write_text(source)
(ROOT/'assets/roster-expansion.json').write_text(json.dumps({'version':'0.22.69','source':SOURCE,'species':manifest,'nationalSpecies':1025,'regionalForms':58},ensure_ascii=False,indent=2)+'\n')
print('Imported 45 National Dex species and 58 regional forms; total',len(dex),'selectable entries.')
