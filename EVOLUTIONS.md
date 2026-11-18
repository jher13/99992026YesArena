# Arena evolutions — 0.22.69

The roster now contains all **1,025 National Dex species**, plus **58 regional
forms** with separate PC profiles, stats, abilities and learnsets. Regional forms
retain their National Dex number. Alolan forms appear in Alola, Galarian forms
in Galar, Hisuian forms in Sinnoh, and Paldean forms in Paldea.

New evolution goals:

| Pokémon | Evolution | Arena requirements |
|---|---|---|
| Girafarig | Farigiraf | Lv. 32; equip Twin Beam |
| Dunsparce | Dudunsparce | Lv. 32; equip Hyper Drill |
| Bisharp | Kingambit | Lv. 52; 5 participating battle wins; 10 Dark skill uses |
| Frigibax | Arctibax | Lv. 35 |
| Arctibax | Baxcalibur | Lv. 54 |
| Gimmighoul | Gholdengo | Lv. 35; 5 participating battle wins |
| Applin | Dipplin | Lv. 25; 1 Leaf Stone |
| Dipplin | Hydrapple | Lv. 45; equip Dragon Cheer |
| Poltchageist | Sinistcha | Lv. 30; 3 participating battle wins |
| Duraludon | Archaludon | Lv. 50; 15 Steel skill uses |

Regional evolution choices appear in **PC → Evolution**. Set an automatic path
when a base Pokémon can evolve into multiple regional forms. The pre-existing
Arena training paths remain available for existing Pokémon; regional forms now
also evolve into their appropriate regional successors.

Directional PMDCollab animations are bundled where available. The remaining
43 species/forms use bundled offline icons. Sprite attribution records are in
`assets/roster-sprite-credits.json`.

Open a Pokémon in **PC → Evolution** to see its requirements and training progress.
The same section appears when you select a stored copy.

- **Evolve into…** evolves that exact individual when its requirements are met, including at level 100. A stored copy does not have to become active first.
- **Automatic evolution path** reserves your preferred branch for future automatic evolution. Leave it on Automatic when one path is ready, or choose Keep current form to evolve manually later.
- When multiple branches are ready, choose one in the PC. Automatic battles continue while the choice waits.
- Bond wins and skill practice count in Pokébattle, Trainer Battles and Campaign. The Pokémon must enter the field. Normal attacks do not count as skill practice; each skill activation counts once.
- New training counters begin when you play after this update. Levels, IVs, EVs, Nature, ability, shiny state and trading identity carry through evolution.
- The existing **Linking Cord** in Item Shop replaces trading requirements. Use it from the PC evolution section, or equip it for automatic evolution after a victory. Items equipped by other active Pokémon are reserved and cannot be consumed.
- Existing evolution stones still work. Equipping an evolution item takes priority over an automatic level evolution unless you explicitly reserve another path.
- Regional evolutions use **Galar / Hisui / Paldea training paths** from the base species available in Arena. These are adaptations rather than hardware, location, gender or clock requirements.
- Cosmoem has both Solgaleo and Lunala paths at level 53.
- Nincada evolves into Ninjask at level 20. A spare Poké Ball creates one additional Shedinja in the PC and is consumed. Without a spare ball, Ninjask still evolves normally.

All 513 primary evolution routes and 10 legacy training paths have a method.
Regional forms use separate storage identities, so evolving or trading one does
not overwrite the original form’s profile.

## New and adapted requirements

The table covers the 111 newly adapted routes. Existing level and stone routes
remain available and are shown in the PC alongside these requirements.

| Pokémon | Evolution | Arena requirements |
|---|---|---|
| Pichu | Pikachu | Lv. 15; 3 participating battle wins |
| Cleffa | Clefairy | Lv. 15; 3 participating battle wins |
| Igglybuff | Jigglypuff | Lv. 15; 3 participating battle wins |
| Kadabra | Alakazam | 1 Linking Cord |
| Machoke | Machamp | 1 Linking Cord |
| Graveler | Golem | 1 Linking Cord |
| Tyrogue | Hitmonlee | Lv. 20; ATK > DEF |
| Tyrogue | Hitmonchan | Lv. 20; ATK < DEF |
| Mime Jr. | Mr. Mime | Lv. 20; Equip Mimic |
| Munchlax | Snorlax | Lv. 30; 3 participating battle wins |
| Golbat | Crobat | Lv. 30; 3 participating battle wins |
| Togepi | Togetic | Lv. 20; 3 participating battle wins |
| Azurill | Marill | Lv. 15; 3 participating battle wins |
| Bonsly | Sudowoodo | Lv. 20; Equip Mimic |
| Poliwhirl | Politoed | 1 Linking Cord |
| Eevee | Espeon | Lv. 25; 3 participating battle wins |
| Eevee | Umbreon | Lv. 25; 3 participating battle wins |
| Slowpoke | Slowking | 1 Linking Cord |
| Onix | Steelix | 1 Linking Cord |
| Scyther | Scizor | 1 Linking Cord |
| Mantyke | Mantine | Lv. 20; Remoraid on battle team |
| Seadra | Kingdra | 1 Linking Cord |
| Porygon | Porygon2 | 1 Linking Cord |
| Tyrogue | Hitmontop | Lv. 20; ATK = DEF |
| Chansey | Blissey | Lv. 35; 3 participating battle wins |
| Wurmple | Silcoon | Lv. 7 |
| Wurmple | Cascoon | Lv. 7 |
| Nincada | Shedinja | Bonus when Nincada evolves into Ninjask at Lv. 20+; 1 spare Poké Ball |
| Budew | Roselia | Lv. 20; 3 participating battle wins |
| Feebas | Milotic | Lv. 40; 3 participating battle wins |
| Chingling | Chimecho | Lv. 20; 3 participating battle wins |
| Clamperl | Huntail | 1 Linking Cord |
| Clamperl | Gorebyss | 1 Linking Cord |
| Burmy | Wormadam | Lv. 20 |
| Burmy | Mothim | Lv. 20 |
| Combee | Vespiquen | Lv. 21 |
| Shellos | Gastrodon | Lv. 30 |
| Aipom | Ambipom | Lv. 32; Equip Double Hit |
| Buneary | Lopunny | Lv. 25; 3 participating battle wins |
| Riolu | Lucario | Lv. 25; 3 participating battle wins |
| Sneasel | Weavile | Lv. 35; 10 Dark skill uses |
| Lickitung | Lickilicky | Lv. 33; Equip Rollout |
| Rhydon | Rhyperior | 1 Linking Cord |
| Tangela | Tangrowth | Lv. 34; Equip Ancient Power |
| Electabuzz | Electivire | 1 Linking Cord |
| Magmar | Magmortar | 1 Linking Cord |
| Yanma | Yanmega | Lv. 33; Equip Ancient Power |
| Gligar | Gliscor | Lv. 35; 10 Flying skill uses |
| Piloswine | Mamoswine | Lv. 33; Equip Ancient Power |
| Porygon2 | Porygon-Z | 1 Linking Cord |
| Dusclops | Dusknoir | 1 Linking Cord |
| Boldore | Gigalith | 1 Linking Cord |
| Woobat | Swoobat | Lv. 20; 3 participating battle wins |
| Gurdurr | Conkeldurr | 1 Linking Cord |
| Swadloon | Leavanny | Lv. 30; 3 participating battle wins |
| Deerling | Sawsbuck | Lv. 34 |
| Karrablast | Escavalier | 1 Linking Cord |
| Shelmet | Accelgor | 1 Linking Cord |
| Scatterbug | Spewpa | Lv. 9 |
| Spewpa | Vivillon | Lv. 12 |
| Flabébé | Floette | Lv. 19 |
| Pancham | Pangoro | Lv. 32; Another Dark Pokémon on battle team |
| Espurr | Meowstic | Lv. 25 |
| Spritzee | Aromatisse | 1 Linking Cord |
| Swirlix | Slurpuff | 1 Linking Cord |
| Inkay | Malamar | Lv. 30 |
| Tyrunt | Tyrantrum | Lv. 39; 3 participating battle wins |
| Amaura | Aurorus | Lv. 39; 3 participating battle wins |
| Eevee | Sylveon | Lv. 25; 3 participating battle wins; Equip a Fairy move |
| Sliggoo | Goodra | Lv. 50; 10 Water skill uses |
| Phantump | Trevenant | 1 Linking Cord |
| Pumpkaboo | Gourgeist | 1 Linking Cord |
| Yungoos | Gumshoos | Lv. 20; 3 participating battle wins |
| Rockruff | Lycanroc | Lv. 25; 3 participating battle wins |
| Fomantis | Lurantis | Lv. 34; 10 Grass skill uses |
| Salandit | Salazzle | Lv. 33 |
| Steenee | Tsareena | Lv. 29; Equip Stomp |
| Type: Null | Silvally | Lv. 50; 3 participating battle wins |
| Poipole | Naganadel | Lv. 40; Equip Dragon Pulse |
| Meltan | Melmetal | Lv. 40; 3 participating battle wins; 20 Steel skill uses |
| Applin | Flapple | Lv. 20; 1 Leaf Stone |
| Applin | Appletun | Lv. 20; 1 Sun Stone |
| Toxel | Toxtricity | Lv. 30 |
| Clobbopus | Grapploct | Lv. 35; Equip Taunt |
| Sinistea | Polteageist | Lv. 30; 3 participating battle wins |
| Linoone | Obstagoon | Lv. 30; 3 participating battle wins; Galar training |
| Meowth | Perrserker | Lv. 28; 3 participating battle wins; Galar training |
| Corsola | Cursola | Lv. 35; 3 participating battle wins; Galar training |
| Farfetch’d | Sirfetch’d | Lv. 35; 3 participating battle wins; Galar training |
| Mr. Mime | Mr. Rime | Lv. 42; 3 participating battle wins; Galar training |
| Yamask | Runerigus | Lv. 35; 3 participating battle wins; Galar training |
| Milcery | Alcremie | Lv. 30; 3 participating battle wins |
| Snom | Frosmoth | Lv. 35; 3 participating battle wins |
| Kubfu | Urshifu | Lv. 50; 10 Fighting skill uses |
| Stantler | Wyrdeer | Lv. 31; 10 Psychic skill uses; Hisui training |
| Scyther | Kleavor | Lv. 35; 3 participating battle wins; Hisui training |
| Ursaring | Ursaluna | Lv. 40; 10 Ground skill uses; Hisui training |
| Basculin | Basculegion | Lv. 35; 10 Water skill uses; Hisui training |
| Sneasel | Sneasler | Lv. 35; 10 Fighting skill uses; Hisui training |
| Qwilfish | Overqwil | Lv. 35; 10 Dark skill uses; Hisui training |
| Lechonk | Oinkologne | Lv. 18 |
| Pawmo | Pawmot | Lv. 25; 3 participating battle wins |
| Tandemaus | Maushold | Lv. 25; 1 participating battle wins |
| Charcadet | Armarouge | Lv. 30; 10 Fire skill uses |
| Charcadet | Ceruledge | Lv. 30; 10 Fire skill uses |
| Bramblin | Brambleghast | Lv. 25; 3 participating battle wins |
| Rellor | Rabsca | Lv. 25; 3 participating battle wins |
| Finizen | Palafin | Lv. 38; 3 participating battle wins; 2 other Pokémon on battle team |
| Greavard | Houndstone | Lv. 30; 10 Ghost skill uses |
| Primeape | Annihilape | Lv. 35; 10 Ghost skill uses |
| Wooper | Clodsire | Lv. 20; 3 participating battle wins; Paldea training |
