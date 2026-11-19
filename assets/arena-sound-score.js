/* Original move scores. Each row contains the move, release, impact and optional wind-up.
   A note is instrument[:semitones][@milliseconds][*gain]. Notes without an onset sound together. */
(() => {
  'use strict';
  const scores = new Map();
  // Moves with a visible telegraph supply their own warning in the fourth column.
  function section(windup, sheet) {
    for(const row of sheet.trim().split('\n')){
      const [move,release,impact,warning]=row.trim().split('|');
      if(scores.has(move))throw Error('Duplicate Arena sound score: '+move);
      scores.set(move,{release,impact,warning:warning||windup});
    }
  }

  section('leaf:-3 sprout@48*.5', `
Absorb|siphon:-3 ripple@106|drop:-6
Apple Acid|seed:-4 bite@42 acid@73|acid drip:-2@93
Aromatherapy|breath:2 harp@35 harp:4@116 harp:7@204 leaf@140*.45|chime:7
Branch Poke|leaf:-4 wood:4@39|tap:2
Bullet Seed|seed:3 leaf@18*.4|seed:7 tap@13*.5
Chloroblast|sprout charge:2@44 flare@145 beam:3@160|blast:3 leaf@72|charge:4 sprout@168
Cotton Guard|cloth:-3 pollen@51 cloth:4@122|pad:5
Cotton Spore|pollen leaf:6@82 pollen:4@174|feather:5|cloth:6 pollen:5@72
Drum Beating|wood:-2 drum@36 drum:-3@138 taiko@253|root thud@28
Energy Ball|hum:3 plasma:3@44 sprout:4@90|pulse:2 leaf@34|sprout mind:5@65
Flower Trick|leaf:2 pop@45 blossom@92|seed:7 star:5@24
Forest's Curse|root branch:-4@68 moan:-3@136|vine:-5
Frenzy Plant|root:-4 quake@62 vine@108 branch@169 vine:-3@233|wood:-5 gravel@52|root quake:2@110
Giga Drain|siphon:-7 hum:-4@49 harp@170 harp:7@265|pulse:-2 drop@63
Grass Knot|vine:-3 cloth@57 latch:-4@109|thud:2
Grass Pledge|root:1 sprout@63 leaf@124|branch:1
Grass Whistle|flute whistle:-7@108 flute:7@209|flute:-3
Grassy Glide|leaf:2 rush:3@28 leaf:5@94|swish:-2
Grassy Terrain|root:-3 wind:3@58 sprout@126 harp:7@240|leaf:-1
Grav Apple|whistle:-9 wood:2@106 seed:-3@142|stomp:2
Horn Leech|wood:3 siphon@33 gulp@158|bite:-4
Ingrain|root wood:-5@56 branch:-4@117 sprout:-4@177|thud:-4
Ivy Cudgel|vine:1 rush:-3@34 wood:-3@106|wood:-5 slam@24
Jungle Healing|rain:4 leaf@45 flute@82 flute:5@180 chime:7@265|drop:3
Leaf Blade|leaf slice:4@35 vine@68*.48|snip:-2|leaf:4 snip:-2@85
Leaf Storm|gale:1 leaf@58 leaf:-3@134 slice@207|tear leaf:4@45|wind leaf@90
Leaf Tornado|spin:2 leaf@44 wind:2@95|leaf:-3
Leafage|leaf:5 seed@37 feather@65*.48|tap:5
Leech Seed|seed:1 vine:-3@51 siphon:3@117|root:5
Magical Leaf|harp:5 leaf@26 chime:7@85 leaf:4@136|plink:2
Matcha Gotcha|splash:-4 ooze:4@55 harp:2@142|gulp:3
Mega Drain|siphon:1 hum@77 harp:4@166|ripple:3
Needle Arm|branch:1 sting:2@38 punch@73|snap:2
Petal Blizzard|gale:3 pollen@37 leaf:3@122 chime:7@188*.55|leaf:4|leaf:5 wind:3@63 blossom@103
Petal Dance|leaf:1 harp:2@38 leaf:5@103 harp:7@163 spin@207|swish:3
Power Whip|vine:-5 whip:-2@63 branch@101|slam:1
Razor Leaf|leaf:3 slice:6@43 slice:3@102|snip:5|leaf:2 leaf:6@34 snip:4@88
Sappy Seed|seed:-4 ooze:5@40 sprout@120|sludge:5
Seed Bomb|seed:-3 rush@24 pop:-5@118|blast:5 seed@35|seed:-3 seed:5@62 spring:1@102
Seed Flare|seed:5 sprout:8@39 star:5@89 blast:4@135|shimmer:3
Sleep Powder|pollen:-3 flute:-5@61 breath@156|pad:-5
Snap Trap|vine:-4 latch@99 snap:-3@110|bite:-5
Solar Beam|ray:5 beam:5@23 shimmer@130|blast:4 chime:7@64|charge:2 shimmer@129
Solar Blade|ray:4 slice:-2@49 steel:3@86|clang:3|charge:3 string:5@119
Spicy Extract|drop:3 spring:4@51 ember@119|choop:5
Spiky Shield|root:2 shield@53 thorn@91|branch:5
Spore|pollen:-5 breath:2@55 seed:6@148|pad:-2
Strength Sap|vine:1 siphon:-3@48 heartbeat@171|gulp:1
Stun Spore|pollen:4 static@82 spark@176|zap:6
Synthesis|sprout:-2 harp@55 harp:4@145 chime:7@218|shimmer:5
Syrup Bomb|gulp:-4 ooze:-5@52 pop:1@141|sludge:-2
Trailblaze|leaf:-1 rush@44 ember@114|wood:3|paw:2 branch:-3@60 leaf:4@101
Trop Kick|leaf:4 kick@47 seed:4@80|thud:3
Vine Whip|vine:4 whip:2@60|snap:3
Wood Hammer|wood:-6 swish:-3@41 taiko:-3@85|slam:-3 branch@43
Worry Seed|seed:6 sprout:3@65 mind:4@134|plink:3
`);
  section('gravel:-2 core@64*.45', `
Accelerock|rush:5 pebble@31 flint@72|rock:4|gravel:3 pebble:6@42 rush:4@88
Ancient Power|drone:-2 gravel@52 crystal:-4@122 boulder:4@174|rock:-3
Diamond Storm|crystal:5 wind@51 shard:3@96 shatter:3@174|shard:1|crystal:-3 crystal:4@55 shimmer:1@113
Head Smash|rush:-4 stomp@58 rock:-5@110|boulder:-3|rock:-3 gravel:2@54 breath:-2@106
Meteor Beam|core:-2 ray:3@39 beam:1@104 gravel@180|blast:-1|charge:-2 gravel@79 crystal@158
Mighty Cleave|rock:1 swish@46 steel:-3@89|shatter:-7
Power Gem|crystal:3 ray@42 star:4@137|plink:-1
Rock Blast|rock:3 rush:5@31|pebble:-2 gravel:5@26|pebble:-3 pebble:4@49 rock:2@102
Rock Polish|sand:2 steel:6@70 shimmer:5@156|flint:4
Rock Slide|boulder:2 gravel@42 rock:4@97 gravel:-2@167|rock:-2|gravel:4 gravel:-1@56 boulder:3@101*.45
Rock Throw|swish:-2 pebble:2@52|rock:1
Rock Tomb|gravel:-2 boulder@75 latch:-5@195|rock:-4
Rock Wrecker|drill:-5 boulder:-2@61 rush:-4@113|blast:-4 gravel@74|rock:-4 metalBend:-1@60
Rollout|spin:-5 gravel@39 gravel:-4@132|rock:-1
Salt Cure|sand:6 crystal:6@57 hiss:2@145|flint:3
Sandstorm|wind:-2 sand@35 gale@132 gravel:4@229*.5|sand:-3
Smack Down|swish:2 rock:2@65 stomp:2@126|thud:-3
Stealth Rock|flint:3 pebble@48 pebble:4@105 rock:2@167|rock:3 gravel:3@35
Stone Axe|wood:2 swish:1@46 rock:-1@93|flint:-2
Stone Edge|root:-3 rock@62 shard:-4@113 rock:4@165|crunch:-2
Tar Shot|gulp:-2 ooze:-6@32 sludge:1@98|sludge:-4
Wide Guard|rock:-3 shield:-4@51 gonglet@131|shield:-3
`);
  section('gas:3 drip@62*.5', `
Acid|drip acid@42|hiss:-2|bubble:3 acid:5@80*.5
Acid Armor|ooze:-1 drip@54 shield:-4@127|sludge:1
Acid Spray|hiss:3 acid:4@29 drip@108|acid:2|gulp:1 hiss:3@90
Baneful Bunker|gas:-4 shield:-2@68 bubble:-2@144|acid:-2
Barb Barrage|sting:2 silk@34|sting:-1 pop@23
Belch|gulp:-6 growl:3@41 gas:-6@102|sludge:1
Clear Smog|gas:3 wind:4@76 ping@184|hiss:4
Coil|vine:-4 ooze:-1@54 string:-3@125|latch:1
Corrosive Gas|gas:-1 acid@70 hiss:-1@154|acid:-4|hiss:-3 gas:2@76
Cross Poison|slice:2 acid@31 slice:-2@95|snip:1
Dire Claw|tear:-2 slice@45 drip:-2@103|crunch:2
Gastro Acid|gulp:-2 acid:-3@55 drip:2@158|ooze:3
Gunk Shot|ooze:-5 jet:-4@62 sludge:-2@134|sludge:-6
Malignant Chain|chain:-4 haunt:-2@65 latch@139|clang:-5
Mortal Spin|spin:3 acid@51 slice:1@126|drip:2|ooze:-2 spin:4@83
Noxious Torque|whirr:-4 gas:-2@75 rush:-2@139|slam:2
Poison Fang|hiss:-1 bite@40 drip:-4@85|crunch:-1
Poison Gas|breath:-3 gas@55|hiss:-3|bubble:-5 gas:-3@86
Poison Jab|swish:3 punch:2@37 drip@80|sting:-2
Poison Powder|pollen:-3 gas:3@84|hiss:1
Poison Sting|sting:5 silk:3@29|tap:5
Poison Tail|whip:-1 ooze:4@55|sludge:3
Purify|drop:3 hiss:3@46 chime@104 chime:7@185|chime:5
Shell Side Arm|latch:-2 jet:2@42 acid:-1@84|sludge:2
Sludge|ooze:-3 sludge@65|drip:-3
Sludge Bomb|gulp:-5 sludge:-3@48 blast:6@122|sludge:-2 acid@66|bubble:-4 gulp:-2@67 ooze:2@104
Sludge Wave|wave:-4 ooze:-5@75 gas@192|sludge:-5|sludge:-3 wave:3@106*.42
Smog|breath:-6 gas:-4@48|hiss:-5
Toxic|bubble:-4 acid:-2@49 drip:-4@136 drip:-7@208|ooze:-4
Toxic Spikes|flint:3 sting@54 drip:-1@99|sting:1 acid@28
Toxic Thread|silk:-2 ooze@49 hiss@115|latch:3
Venom Drench|splash:-3 acid@47 drip:2@129|sludge:4|drip:-2 drip:4@42 hiss:-1@99
Venoshock|acid:4 zap:-4@68 bubble:5@128|arc:-3
`);
  section('wind:2 wing@58*.55', `
Acrobatics|wing:4 spin:2@67 feather:5@140|swish:4
Aerial Ace|wing:4 rush:6@36 slice:3@78|snap:3|feather:4 wing:3@66
Aeroblast|gale:2 jet:-1@51 beam:1@102|blast:3
Air Cutter|wind:4 slice:4@64 slice:7@118|snip:4|wind:4 snip:5@72
Air Slash|wind:2 swish:6@43 slice:2@91|tear:2
Beak Blast|flint:2 charge:3@34 wing@87|blast:1|ember:2 breath@71
Bleakwind Storm|blizzard:-2 gale@76 moan:3@150|snow:-2|howl:-4 gale:2@97*.55
Bounce|spring:3 rush:4@54 bounce@149|stomp:4|spring:-3 bounce:6@78
Brave Bird|flap:-2 rush:-1@51 roar:3@106|slam:-1|flap:-2 chirp:4@48 wing:3@116
Chatter|chirp:2 squeak:4@79 chirp:7@145 chirp:3@202|chirp:-1
Defog|breath:4 wind:3@55 shimmer:4@191|feather:2
Dragon Ascent|roar:2 wing:-4@52 rush:-4@122|boulder:3|growl:-2 wing:-3@69 rush:2@122
Drill Peck|wing:2 drill:5@44 tap:6@98|wood:3
Dual Wingbeat|flap:2 wing@51|flap:-3 punch:3@24
Feather Dance|feather:2 harp:7@49 wing:4@107 feather@182|cloth:5
Floaty Fall|whistle:3 feather:2@50 bounce:-3@156|thud:5
Fly|flap:1 flap:4@105 rush:3@200|stomp:1|feather:1 flap:-2@54 flap:4@128
Gust|wind:4 wing:2@76|swish:2
Hurricane|gale:-1 whorl:2@94 gale:2@201|wind:-2|wind:-4 whistle:-10@128
Mirror Move|chime:4 feather:2@63 sweep:2@127|ping:1
Oblivion Wing|flap:-3 haunt@60 siphon:-4@122|void:2
Peck|wing:4 tap:5@37|wood:6
Pluck|feather:4 snap:4@42|bite:3
Roost|feather:1 cloth:-2@76 flute:-5@138|pad:2
Sky Attack|wing:-1 ray:4@60 rush:5@122|blast:2|charge:3 wind@95
Sky Drop|flap:-1 whistle:-3@66 rush:-3@166|stomp:-2
Tailwind|flap:2 wind:4@51 flute:7@183|wing:4
Wing Attack|flap:3 swish:2@50|punch:3
`);
  section('breath:1 tap@62*.45', `
Acupressure|tap:5 string:5@48 ping:7@101|chime:4
After You|tick:4 harp:4@45 harp:9@110|ping:7
Assist|paw:4 paw:7@48 chirp:4@112|tap:4
Attract|kiss harp:4@46 chime:9@143|pad:5
Barrage|swish:2 wood:5@37|wood:2 pebble@23
Baton Pass|wood:4 swish@45 latch:4@104|tap:7
Belly Drum|drum:-2 drum:3@118 drum@211 taiko@356 drum:5@440|drum:-3
Bestow|cloth:3 chime:3@62 latch:3@142|plink:7
Bide|heartbeat:-2 hum:-3@80 pulse@201|core:2
Bind|cloth:-2 vine:-2@63 string:-5@135|thud:1
Block|stomp:-3 latch:-5@58 wood:-3@98|shield:-6
Blood Moon|moan:-4 core:-4@70 beam:-3@135|boom:1|drone:-4 haunt@169
Body Slam|rush:-3 cloth:-6@56 stomp:-4@105|slam:-4|stomp:-1 cloth:-3@68
Boomburst|blast:2 gong:-6@20 quake:1@75|boom:-1|core:-4 breath:-5@75
Camouflage|cloth:-1 leaf:-2@57 scan:-3@132|pad:-1
Captivate|harp:3 chirp:5@61 harp:10@152|chime:8|kiss:3 harp:8@76
Celebrate|pop:3 whistle:5@33 clap@95 chime:7@165 clap:4@220|star:7
Chip Away|flint:4 wood:3@40 gravel:4@98|rock:4
Comet Punch|rush:1 sparkle@35|punch:3 star:3@21
Confide|breath:2 whisper:-2@57 tap:7@203|hum:4
Constrict|string:-4 vine:-4@72 cloth:-2@115|thud:-2
Conversion|digital ping:4@52 digital:7@118|scan:3
Conversion 2|scan:4 digital:7@57 digital:-3@132|ping:2
Copycat|paw:5 paw:2@58 chirp:7@139|tap:6
Court Change|whistle:1 rush:2@55 whistle:-4@145 latch:2@211|ping:1
Covet|cloth:3 coin:2@56 kiss@124|plink:6
Crush Claw|tear:-3 crunch:-3@51 rock:-2@115|crunch:-4
Crush Grip|cloth:-5 root:-4@70 crunch:-7@137|slam:-5
Cut|swish:4 snip@38|slice:2|cloth:3 snip:-4@79
Defense Curl|cloth:-3 spin:-4@55 wood@124|shield:1
Disable|scan:-3 latch:1@72 toneOff@120|void:5
Dizzy Punch|punch:2 spring:-3@36 star@122|thud:1
Doodle|sand:5 string:5@62 snip:4@126|tick:4
Double Edge|rush:-2 stomp@58 whip:-1@125|slam:-3|paw:-1 hoof:3@48 breath:-1@97
Double Hit|swish:1 snap@30|thud:2
Double Slap|cloth:2 swish:4@42|clap:4
Double Team|rush:3 rush:6@83 digital:4@157|swish:6
Echoed Voice|hum:4 horn:3@38 horn:5@156*.54 horn:7@270*.31|pulse:4
Egg Bomb|pop:3 rush@44 shell@95|blast:4 shatter:2@41|shell:3 latch:4@68
Encore|clap:2 clap:4@96 whistle:3@173 clap:7@228|chime:5
Endeavor|heartbeat:3 breath:-2@75 punch:-1@163|thud:-1
Endure|breath:-2 core@54 shield:2@155|drum:-1
Entrainment|drum:3 harp:2@50 drum:3@128 harp:7@179|ping:5
Explosion|thundercrack:-5 blast:-4@15 boom:-5@94 gravel:-3@242|boulder:-4|tick:-6 fuse:-2@42 tick@166 tick:5@283
Extreme Speed|snap:3 rush:7@13 whip:5@48|punch:4|rush:7 swish:5@24
Facade|cloth:1 punch@41 horn:-4@91|thud:3
Fake Out|clap:6 snap:4@23|tap:7
False Swipe|swish:4 slice:4@39 cloth:2@88|tap:3
Feint|paw:4 swish:-1@31 tap:4@71|snap:1
Fillet Away|slice:-2 shell:2@52 gulp@121|snip:2
Flail|cloth:-1 thud:2@38 swish:4@92 thud:-1@149|tap:-2
Flash|star:5 ping:7@34 shimmer:2@111|chime:9
Focus Energy|breath:1 pulse:2@60 charge:3@143|ping:4
Follow Me|whistle:2 tap:6@78 whistle:7@141|chirp:5
Foresight|sonar:2 scan:2@106 ping:6@226|chime:7
Frustration|growl:4 stomp:2@64 crunch@134|punch:-2
Fury Attack|swish:5 sting@36|tap:4 wood@12
Fury Swipes|paw:3 slice:5@25|tear:4
Giga Impact|core:-4 rush:-5@44 boom:2@133|slam:-4 quake:2@43|heartbeat:-3 charge:-1@114
Glare|hiss:3 mind:-4@45 snap:4@141|latch:4
Growl|growl:-1 breath:-3@112|pulse:-1|growl:-5 breath:-4@84
Growth|sprout:1 harp:4@68 sprout:5@155|wood:5
Guillotine|latch:-2 rush:-4@76 steel:-2@133|snap:-4 clang@22
Happy Hour|coin coin:4@55 coin:7@119 chime:12@204|coin:7
Harden|rock:3 shield:2@37 flint@108|rock:2
Head Charge|hoof rush:-4@35 horn:-3@111|stomp:-1
Headbutt|swish:-3 bone:-3@48|thud:-1|breath:1 paw:-4@81
Heal Bell|bell bell:7@195 bell:12@355*.60|chime:7
Helping Hand|clap:3 harp:4@53 harp:7@128|tap:4
Hidden Power|mind:1 crystal:-1@43 pulse:4@126|plasma:3
Hold Back|swish:-1 cloth:3@48 tap@86|paw:4
Hold Hands|paw:1 paw:4@54 harp:7@135|chime:4
Horn Attack|swish:2 bone:2@47|wood:-2|hoof:3 horn:-4@70*.45
Horn Drill|horn:-3 drill:2@52 flint:-3@160|rock:-3
Howl|breath:3 howl:1@39 howl:5@184*.33|horn:3
Hyper Beam|beam:-3 core@6*.68 laser:1@25 beam:4@145*.56|blast:-2 plasma:-2@48|charge:-4 coil:-3@93 charge:4@178
Hyper Drill|drill:-3 gear:3@60 rush:-2@130|steel:-2
Hyper Fang|growl:2 bite:-4@45 bone:-2@84|crunch:-2
Hyper Voice|breath:2 horn:4@42 choir:-2@75 horn:7@181|pulse:-1|breath:-2 hum:5@92
Judgment|bell:-3 choir@67 ray:4@128 gong@239|blast:3 shimmer@42|choir:-4 chime@120
Laser Focus|scan:5 tick:7@74 ping:6@151|laser:3
Last Resort|heartbeat:-1 horn:2@68 rush:-3@152|slam:-2
Leer|hiss:-1 scan:-5@73 mind:1@146|tick:3|hiss:2 mind:-3@84*.55
Lock-On|sonar:1 tick:3@85 tick:7@156 latch:4@218|ping:4
Lovely Kiss|kiss:1 harp:4@49 flute:-5@137|pad:4
Lucky Chant|choir:1 harp:4@48 chime:7@134 harp:12@236|bell:4
Me First|tick:7 whistle:6@32 rush:4@89|tap:5
Mean Look|growl:-3 mind:-5@68 latch:-4@151|void:2
Mega Kick|rush:1 kick:-4@65 thud:-3@110|stomp:-3
Mega Punch|breath:-1 punch:-4@53 taiko:-2@89|slam:-2
Metronome|tick tick:3@141 tick@275 digital:7@345|chime:3
Milk Drink|gulp:1 gulp:3@115 drop@208|harp:2
Mimic|chirp:3 digital:3@65 chirp:7@145|ping:3
Mind Reader|sonar:-3 mind@79 shimmer:3@181|ping:2
Minimize|sweep:5 plink:7@78 plink:12@135|pop:7
Morning Sun|pad:2 harp:4@64 chime:7@171 star:12@276|shimmer:7
Multi-Attack|digital:2 slash@37 plasma:4@113|clang:1
Natural Gift|leaf:3 seed:4@46 chime:7@123|wood:2
Nature Power|root:2 mind:4@65 ray:3@132|pulse:5
Noble Roar|horn:-1 roar@43 gonglet:-3@171|thud:1
Odor Sleuth|breath:4 breath:6@86 sonar:3@182|snip:3
Pain Split|heartbeat:1 pulse:-4@55 pulse:4@134|mind:-1
Pay Day|coin:2 coin:5@56 coin:9@119|coin:4
Perish Song|bell:-9 choir:-5@70 flute:0@152 flute:-2@294 flute:-5@436|gong:-4
Play Nice|paw:3 harp:4@49 chirp:5@130|chime:3
Population Bomb|paw:3 rattle:5@21 rush:4@47|paw:4 squeak:5@12*.45|paw:5 paw:7@56
Pound|swish:-2 thud:2@38|tap:1
Power Shift|core:2 sweep:2@54 pulse:5@125|ping:1
Present|cloth:4 latch:3@48 pop@98 chime:7@154|pop:4
Protect|hum:1 shield:2@36 chime:7@138|shield:4
Psych Up|hum:2 mind:3@57 harp:7@148|pulse:4
Quick Attack|paw:4 rush:5@18|snap:4|paw:5 swish:6@46
Rage|growl:3 heartbeat:4@47 drum:-2@132|punch:1
Raging Bull|hoof:-3 hoof@78 roar:-4@115 rush:-2@194|stomp:-5|hoof:-3 hoof:-1@60 growl:2@114
Rapid Spin|spin:3 swish:3@61 whirr:4@129|tap:2
Razor Wind|wind:3 slice:5@78 gale:3@144|tear:3|gale:1 slice:5@120
Recover|harp harp:4@85 harp:7@172 chime:12@272|shimmer:4
Recycle|latch:1 spin:3@45 digital:3@127|chime:5
Reflect Type|crystal:2 mind:3@66 digital:4@138|shimmer:3
Refresh|drop:4 chime:4@56 chime:9@148|shimmer:7
Relic Song|gonglet:-2 flute:2@32 flute:5@157 choir:2@280|bell:2|flute:-3 harp:2@78 choir:3@143*.45
Retaliate|roar:4 rush:1@44 punch:-3@113|thud:-3
Return|harp:5 rush:2@62 thud:1@127|punch:2
Revelation Dance|harp:3 drum:4@61 ray:5@130 shimmer:7@216|pulse:4
Revival Blessing|bell:-2 choir@99 harp:7@208 chime:12@341|bell:7
Roar|breath:-5 roar:-2@40 breath:-3@144*.3|horn:-4
Rock Climb|gravel:2 wood:3@50 gravel:5@115 stomp@184|rock:2
Round|hum:2 flute:5@70 hum:7@154|pulse:3
Safeguard|shimmer:2 shield:4@75 choir:2@181|chime:7
Scary Face|growl:-5 snap:-2@67 moan:1@130|void:1
Scratch|paw:3 tear:5@33|snip:3|paw:3 snip:5@53
Screech|steel:7 whistle:5@40 sting:5@98|hiss:5
Secret Power|whisper:-2 mind:3@75 plasma:2@151|pulse:1
Self-Destruct|snap:-4 blast:-1@11 boom:1@47 shatter:-6@152|boulder:-2|fuse:1 tick@74 tick:7@200
Sharpen|sand:3 steel:4@62 flint:5@128|snip:4
Shed Tail|whip:-2 cloth:-3@57 pop:-4@109 rush:4@164|snap:2
Shell Smash|shell:-3 crunch:-2@34 shatter:-4@85 gravel:3@156|rock:-2
Simple Beam|ray:5 ping:7@73 beam:5@115*.55|pulse:3
Sing|flute choir:4@120 flute:7@250 flute:5@385|pad:3
Sketch|sand:4 snip:3@56 string:4@122|tick:6
Skull Bash|bone:-2 rush:-3@69 stomp@143|slam:-3|shell:-3 breath:-4@100
Slack Off|yawn:3 cloth:2@95 hum:-2@175|pad:2
Slam|swish:-2 slam:2@56|thud:-2
Slash|swish:3 slice@41|tear:1|snip:1 swish:-1@67
Sleep Talk|yawn:-2 whisper:3@139 digital:2@248|hum:2
Smelling Salts|sand:3 breath:5@58 pop:5@125|tap:4
Smokescreen|pop:-3 gas:-4@45 wind:-2@152|hiss:-2
Snore|growl:4 breath:-4@80 growl:2@166|pulse:-1
Soft Boiled|shell:4 pop:3@61 harp:5@162|chime:7
Sonic Boom|whistle:3 snap:-2@47 blast:5@83|thud:4
Spike Cannon|latch:3 whirr:4@40|sting:4 flint@13
Spit Up|gulp:-2 jet:5@42 pop:-3@99|splash:-3
Splash|drop:-1 splash:5@69|bubble:6
Spotlight|latch:4 shimmer:5@51 chime:7@145|ping:7
Stockpile|wood:2 seed:1@57 wood:4@113 harp:4@176|tap:2
Stomp|hoof:-2 stomp:1@45|thud:-4
Strength|breath:-3 core:-1@53 thud:-3@153|slam:1
Stuff Cheeks|bite:4 crunch:4@47 gulp:4@118|pop:4
Substitute|cloth:-2 pop:-1@50 wood:3@99|thud:2
Super Fang|bite:3 snap:-3@42 crunch:-1@75|bone:-1
Supersonic|sonar:4 whistle:3@66 sonar:7@153|mind:4
Swagger|horn:2 stomp:3@66 horn:5@165|tap:4
Swallow|gulp:-2 gulp:2@131 harp:2@209|drop:-2
Sweet Scent|breath:3 pollen@73 harp:7@169|chime:7|blossom:4 breath:5@110
Swift|star:2 swish:4@33 star:7@86 star:10@129|plink:5|star:2 star:7@56
Swords Dance|steel:2 swish:2@68 steel:7@131 steel:9@231|clang:2
Tackle|paw:1 rush:-1@23|thud:1|paw:-2 cloth:1@57
Tail Slap|whip:4 cloth:3@32|clap:1
Tail Whip|cloth:3 whip:5@53|swish:3|cloth:5 whip:4@64*.45
Take Down|rush:-1 kick:-1@54 thud:-3@94|slam:2|hoof:-2 breath:1@91
Tearful Look|drop:4 drop@91 flute:-2@159|ripple:3
Teatime|plink:1 gulp@71 plink:5@170 harp:4@210|bell:5
Techno Blast|digital:1 gear:2@57 plasma:1@113|blast:3|scan gear@70 charge:3@118
Teeter Dance|drum:2 spring:3@65 drum:-2@139 spring:-2@218|mind:3|tap:5 tap:2@95 rattle:4@145
Tera Blast|crystal:1 ray:3@68 beam:3@133|shatter:1|crystal charge:3@75
Tera Starstorm|star:3 shimmer@47 crystal:7@118 blast:3@178|shatter:4|crystal:1 star:5@74 crystal:8@151
Terrain Pulse|root:1 pulse:3@55 ripple:1@137|pulse:2
Thrash|growl:3 swish:2@57 punch:-1@102 stomp:1@179|slam:1
Tickle|feather:6 squeak:6@45 feather:4@115|paw:6
Tidy Up|cloth:1 sand:2@68 swish:3@139 ping:7@222|chime:6
Transform|ooze:1 digital:3@49 portal:3@127 chime:5@215|mind:4
Tri Attack|spark:1 ember@61 shard:3@125 ray@198|plasma:2
Trump Card|cloth:3 snap:4@48 star:7@123|tap:3
Uproar|growl:4 horn:2@48 roar:5@139 clap@230|pulse:1
Veevee Volley|paw:3 squeak:3@52 paw:7@117 bounce:4@179|thud:3
Vise Grip|latch:-3 steel:-3@44 crunch:-2@104|thud:-2
Weather Ball|wind:1 bubble@42 plasma:2@109|pop:-2|wind:3 ripple:2@63 core:4@127
Whirlwind|spin:1 wind:-1@72 gale:1@149|swish:-2
Wish|star:2 harp:5@52 harp:9@138 shimmer:6@243|star:9 harp:7@66 harp:4@157
Work Up|breath:2 drum:2@66 horn:3@155|pulse:1
Wrap|cloth:2 vine:-2@48 cloth:-2@128|thud:-1
Wring Out|cloth:-3 ooze:-4@67 drip:-3@149|sludge:1
Yawn|breath:-1 yawn:1@51 flute:-5@236*.45|hum:-3
`);
  section('mind:2 sonar@72*.45', `
Agility|tick:4 paw:6@40 rush:7@88|ping:7
Ally Switch|portal:2 rush@45 portal:7@131|pop:2
Amnesia|mind:-2 sweep:3@74 plink:-3@179|pad:-2
Barrier|crystal:1 shield:4@73 ping:7@137|shield:5
Calm Mind|breath:1 pad@78 bell:7@202|shimmer:5
Confusion|mind:3 whorl:2@76 chime:-1@158|pulse:3
Cosmic Power|drone:2 star:4@77 star:7@159 choir:5@246|chime:7
Dream Eater|yawn:-3 haunt:2@66 siphon:-3@151|gulp:-1
Eerie Spell|whisper:-3 bell:-3@72 choir:-4@160|void:4
Esper Wing|feather:2 ray:4@54 wing:5@119|slice:3
Expanding Force|pulse:1 mind:5@64 gonglet:3@136|boom:4
Extrasensory|sonar:3 ray:3@63 mind:7@155|pulse:2
Freezing Glare|mind:-3 frost:3@65 ice:1@144|shard:3
Future Sight|tick:-3 sonar:1@89 bell:3@195|pulse:-2 crystal@47|tick:3 tick:7@122 mind:-2@229
Glitzy Glow|star:4 shimmer:7@54 ray:5@123|chime:9
Gravity|core:-4 sweep:-4@65 quake:-1@149|thud:-5
Guard Split|shield:2 mind@68 shield:-2@143|ping:4
Guard Swap|steel:3 portal:-1@66 steel:-3@139|gonglet:1
Heal Block|chime:3 latch:-2@59 toneOff:-1@141|void:4|heartbeat:-2 latch:-3@93
Heal Pulse|harp:2 pulse:5@37 harp:7@125 chime:9@228|chime:7
Healing Wish|bell:3 harp:4@79 choir:3@156 star:9@275|shimmer:7
Heart Stamp|heartbeat:4 pop:4@83 tap:4@145|thud:4
Heart Swap|heartbeat:2 portal:3@70 heartbeat:7@172|chime:3
Hyperspace Hole|portal:-3 void:1@59 snap:-1@156|boom:4
Hypnosis|sonar:-1 flute:-2@98 sonar:-4@211 pad:-5@286|hum:-3
Imprison|chain:2 latch:-3@76 mind:-5@144|latch:-2
Instruct|tick:2 ping:4@63 ping:9@132|tap:7
Kinesis|string:2 spring:-2@71 metalBend@135|ping:1
Light Screen|ray:3 crystal:3@77 shield:5@144|chime:6
Lumina Crash|star:2 beam:4@61 shatter:4@152|blast:4
Lunar Blessing|bell:-3 harp:2@77 choir:5@157 chime:9@279|shimmer:4
Lunar Dance|harp:2 harp:5@89 whorl:3@151 choir:2@254|bell:7
Luster Purge|shimmer:2 ray:2@66 hiss:4@141|crystal:4
Magic Coat|cloth:4 crystal:3@62 shimmer:5@139|shield:5
Magic Powder|pollen:5 star:5@65 plink:7@145|chime:6
Magic Room|portal:1 bell:1@74 pad:4@163|ping:3
Meditate|breath:2 hum:2@74 bell:4@184|pad:5
Miracle Eye|sonar:4 star:7@83 choir:4@150|ping:7
Mirror Coat|steel:4 crystal:4@59 ray:-2@149|shard:3
Mist Ball|gas:4 mind:4@55 ripple:4@143|pulse:5|breath:6 mind:1@79
Mystical Power|choir:3 mind:2@81 ray:7@142|shimmer:3
Photon Geyser|ray:5 jet:3@62 beam:5@120|blast:4|ray:2 ping:4@75 charge:6@139
Power Split|core:3 pulse:2@48 pulse:-2@127|thud:2
Power Swap|pulse:-3 portal:3@61 pulse:5@143|ping:4
Power Trick|tick:4 spring:-2@49 tick:-3@123|pop:2
Prismatic Laser|crystal:2 ray:7@49 laser:4@92 beam:5@147|shatter:3|charge:4 crystal:7@120
Psybeam|mind:4 beam:6@42 ray:-1@124|pulse:4|mind:4 sonar:6@92
Psyblade|mind:2 steel:4@49 slice:4@102|snip:2
Psychic|sonar:-2 mind:1@66 pulse:-2@152|thud:3
Psychic Fangs|mind:2 bite:3@54 crystal:-2@115|crunch:1
Psychic Noise|sonar:4 static:3@47 mind:1@104|pulse:3
Psychic Terrain|drone:1 mind:2@73 chime:5@157 pad:3@237|hum:4
Psycho Boost|core:2 charge:5@51 pulse:5@133|blast:4
Psycho Cut|mind:3 swish:3@44 slice:5@85|steel:4
Psycho Shift|hum:-1 portal:2@66 whisper:4@153|mind:2
Psyshield Bash|shield:3 rush:1@50 clang:2@117|slam:1|shield:2 mind:-2@76
Psyshock|mind:-1 arc:-1@52 pulse:3@113|snap:2
Psystrike|mind:-3 rock:5@53 pulse:-4@115 quake:3@173|rock:1
Psywave|whorl:2 pulse:1@73 pulse:5@199|ripple:3
Reflect|crystal:2 steel:3@58 shimmer:4@139|shield:4
Rest|yawn:-1 flute:-5@86 pad:-3@209|chime:2
Role Play|cloth:3 mind:5@68 harp:4@156|ping:4
Skill Swap|digital:2 portal:-2@65 digital:7@138|chime:3
Speed Swap|rush:4 sweep:3@63 rush:-2@130|tick:6
Stored Power|hum:-3 core:3@61 plasma:5@135|blast:4
Synchronoise|sonar:2 horn:5@68 sonar:7@131|mind:3|sonar:-2 sonar:3@69 hum:5@123
Take Heart|heartbeat:4 choir:1@88 chime:7@188|pad:4
Telekinesis|mind:5 string:2@68 ray:4@137|pulse:3
Teleport|portal:5 pop:6@78 shimmer:5@134|ping:7
Trick|cloth:5 snap:4@47 portal:-2@104|latch:4
Trick Room|tick gonglet:-2@67 tick:7@139 portal:-4@203|ping:-1
Twin Beam|ray:4 laser:3@50|pulse:5
Wonder Room|bell:2 whorl:4@77 shimmer:2@173|crystal:5
Zen Headbutt|hum:2 bone:1@59 pulse:1@112|thud:1|bell:-3 breath:2@87
`);
  section('harp:5 shimmer@70*.48', `
Alluring Voice|choir:3 flute:4@76 flute:9@189|pulse:6
Aromatic Mist|pollen:4 breath:5@65 harp:7@164|chime:6
Baby Doll Eyes|plink:5 plink:9@82 kiss:3@158|harp:7
Charm|harp:4 kiss:5@62 star:7@138|chime:9
Crafty Shield|star:4 shield:5@59 harp:9@142|shield:6
Dazzling Gleam|shimmer:5 star:7@65 star:12@146|chime:7|shimmer:4 chime:8@74
Decorate|pop:4 harp:4@47 star:7@122 chime:12@190|plink:8
Disarming Voice|choir:5 flute:7@69 harp:5@157|pulse:4|breath:4 choir:6@89
Draining Kiss|kiss:4 siphon:5@62 harp:4@167|drop:5
Fairy Lock|chain:5 latch:5@71 star:8@140|ping:6
Fairy Wind|wind:5 star:4@47 feather:6@117|shimmer:5
Fleur Cannon|blossom:4 ray:5@50 beam:2@110|blast:4|blossom:-2 latch:3@55 ray:2@119
Floral Healing|blossom:2 harp:2@47 harp:5@137 chime:9@238|chime:7
Flower Shield|leaf:3 blossom@62 shield:5@137|chime:5|sprout:3 blossom:2@79 shield:5@124*.45
Geomancy|root:-2 crystal:2@77 crystal:7@159 shimmer:5@239|gonglet:5
Light of Ruin|choir:4 ray:7@63 beam:4@129 blast:5@207|shatter:3|charge:3 bell:2@127
Magical Torque|whirr:4 star:5@61 rush:3@126|clang:3
Misty Explosion|gas:3 star:3@35 blast:3@68 shimmer:2@158|boom:2|fuse:4 chime:5@110
Misty Terrain|breath:3 pad:4@66 shimmer:2@171|harp:5
Moonblast|bell:2 star:4@57 plasma:4@119|blast:4 shimmer@46|harp:1 star:-1@86 shimmer:4@142
Moonlight|harp:-2 bell:2@102 harp:7@218|chime:7
Nature's Madness|root:-1 choir:-3@67 quake:1@174|boulder:2
Play Rough|paw:3 cloth:5@36 thud:3@92 squeak:4@151|punch:3
Sparkly Swirl|whorl:5 star:4@52 star:9@133 harp:7@190|shimmer:7
Spirit Break|choir:-1 snap:1@65 shatter:-1@138|gonglet:-3
Springtide Storm|wind:2 blossom@48 rain:3@113 gale:3@194|splash:3|flute:4 whorl:2@74 wind:6@122
Strange Steam|steam:4 mind:2@55 whorl:-1@147|hiss:3
Sweet Kiss|kiss:6 plink:5@40 harp:9@124|chime:7
`);
  section('gear:1 steel@57*.43', `
Anchor Shot|chain:-4 rush@53 clang:-3@117|latch:-4
Autotomize|steel:3 snip:3@52 gear:4@116|flint:5
Behemoth Bash|shield:-3 rush:-3@62 gong:-2@143|slam:-4
Behemoth Blade|steel:-2 swish:-3@69 slice:-3@129|clang:-3
Bullet Punch|latch:3 rush:5@22 steel:3@57|punch:4|gear:6 latch:4@38
Doom Desire|gong:-3 drone:-2@84 ray:3@186|blast:-2|tick:-4 bell:-4@152
Double Iron Bash|gear:-2 swish:-1@49|clang:-3 thud@24
Flash Cannon|steel:3 charge:3@51 laser:2@116|blast:3|gear:2 charge:4@71 ping:7@123
Gear Grind|gear:1 drill:3@44|steel:1 crunch@22
Gear Up|gear:-1 latch:2@62 gear:5@138|ping:4
Gigaton Hammer|clang:-5 swish:-6@63 gong:-7@119|slam:-5 boulder:-3@39|gear:-6 core:-2@99
Gyro Ball|gear:-2 spin:-3@55 whirr:1@128|clang:-2|gear:-2 gear:2@54 whirr:5@101
Hard Press|gear:-4 metalBend:-4@72 thud:-4@143|crunch:-4
Heavy Slam|metalBend:-2 rush:-5@68 clang:-4@143|stomp:-5|metalBend:-4 chain:-3@93
Iron Defense|steel:-1 shield:-2@64 latch:-3@141|clang:1
Iron Head|steel:1 swish:-2@54 bone:-2@111|clang:-2|steel:-3 cloth:1@82
Iron Tail|chain:1 whip:-1@62 steel:1@122|clang:-1
Kings Shield|gonglet:-1 steel:2@68 shield:2@137|gong:1
Magnet Bomb|coil:-2 latch:1@58 plasma:3@109|blast:2 steel@47
Make It Rain|coin:2 coin:7@42 coin:4@89 coin:10@147 coin:5@209 coin:12@264|coin:5 clang:5@53*.4|coin:-2 coin:2@96
Metal Burst|steel:2 shatter:-1@54 clang:2@115|shard:1
Metal Claw|steel:4 tear:2@47 slice:2@96|snip:4
Metal Sound|metalBend:5 steel:7@69 whistle:4@152|hiss:5
Meteor Mash|rush:1 clang:-2@68 star:3@121|slam:-2
Mirror Shot|crystal:3 steel:3@40 laser:3@99|shard:4
Shelter|shell:-3 shield:-2@65 latch:1@140|rock:-1
Shift Gear|gear:1 latch@67 gear:7@132|steel:4
Smart Strike|scan:3 steel:3@48 sting:3@96|snap:3
Spin Out|gear:2 spin:4@57 metalBend:1@132|clang:2
Steel Beam|clang:1 beam:3@23 steel:4@142|blast:1 clang@53|charge:1 steel:2@110
Steel Roller|gear:-5 quake:2@54 steel:-2@147|boulder:1
Steel Wing|wing:2 steel:3@48 flap:1@115|clang:2
Sunsteel Strike|shimmer:3 rush:2@56 steel:-1@115|blast:1
Tachyon Cutter|digital:7 steel:5@41 laser:7@70|slice:5
`);
  section('ripple:1 breath@65*.45', `
Aqua Cutter|jet:5 slice:4@51 splash:5@94|snip:4
Aqua Jet|rush:4 jet:6@19 splash:3@78|splash:4|bubble:4 jet:5@63*.56
Aqua Ring|ripple:3 drop:4@67 ripple:7@161|chime:4
Aqua Step|drop:2 paw:4@46 splash:4@103 harp:7@166|tap:5|drop:3 tap:4@59 drop:7@118
Aqua Tail|wave:3 whip:2@66 splash:2@127|thud:2
Bouncy Bubble|bubble:1 bounce:3@55 bubble:7@130|pop:5
Brine|sand:5 splash:2@62 hiss:2@130|splash:1
Bubble|bubble bubble:4@78 bubble:7@162|pop:4|gulp:3 bubble:6@94
Bubble Beam|bubble:2 bubble:5@39 jet:5@67 bubble:9@114|pop:6|bubble:-1 bubble:3@51 bubble:7@109
Chilling Water|drop:1 jet:2@52 frost:3@107|splash:2
Clamp|shell:1 latch:-2@51 gulp:-2@115|crunch:-1
Crabhammer|shell:-2 swish:-2@55 splash:-2@122|slam:-2
Dive|splash:-1 ripple:-3@97 jet:3@209|splash:3
Fishious Rend|splash:-3 bite:-3@58 tear:-2@126|crunch:-2
Flip Turn|splash:3 spin:3@46 rush:4@112|tap:3|ripple:3 spin:4@70
Hydro Cannon|jet:-3 boom:1@35 torrent:-2@70|blast:1 splash@50|core:1 torrent:3@106
Hydro Pump|jet:1 torrent:1@41 jet:4@147|splash:-2|ripple:-3 jet:-4@93
Hydro Steam|jet:2 steam:1@48 hiss:3@132|splash:1
Jet Punch|jet:4 rush:2@33 punch:2@74|thud:3|splash:3 cloth:2@60 jet:4@96*.5
Life Dew|drop:3 drop:7@86 ripple:4@159 chime:7@244|drop:5
Liquidation|torrent:2 swish:-1@59 splash:1@117|slam:2
Muddy Water|wave:-3 sludge:2@67 gravel:4@168|sludge:1|ooze:-4 torrent:1@105*.5
Octazooka|gulp:-2 pop:-3@52 jet:3@80|sludge:2|gulp:-4 drip:5@55 latch:-1@96
Origin Pulse|ripple:-3 pulse:-2@57 torrent:1@115|boom:3 splash:2@45|sonar:-4 ripple:-3@78 core:1@143
Rain Dance|rain:1 drum:3@80 drop:5@141 rain:4@203|ripple:4
Razor Shell|shell:3 swish:2@42 slice:3@88|snip:3
Scald|jet:3 steam:3@44 splash:4@125|hiss:4
Snipe Shot|tick:5 jet:7@21 snap:5@47|drop:2|sonar:4 latch:4@83
Soak|rain:-1 splash:1@60 drop:2@144|ripple:2
Sparkling Aria|choir:2 bubble:4@60 flute:7@150 shimmer:7@255|splash:4|breath:5 harp:5@75 flute:8@139
Splishy Splash|bounce:4 splash:4@65 bubble:6@138|pop:5|drop:5 splash:5@69 ripple:5@130
Steam Eruption|steam:-3 boom:2@69 torrent:2@131|blast:2 hiss@79|bubble:-2 steam:4@82
Surf|wave:-2 torrent:1@123 splash:2@288 rain:3@372*.5|splash:-2|wind:-3 ripple:-4@83
Surging Strikes|wave:2 rush:3@55|punch:2 splash:5@24
Triple Dive|jet:3 ripple:2@53|splash:3 thud@28
Water Gun|jet:7 drop:3@69|splash:5
Water Pledge|ripple:2 jet:1@65 rain:3@128|splash:2
Water Pulse|ripple:1 pulse:3@59 bubble:5@137|drop:3|ripple:-1 sonar:3@67
Water Shuriken|slice:5 jet:5@29|drop:6 snip@16
Water Sport|splash:6 rain:3@61 ripple:2@143|drop:6
Water Spout|bubble:-3 torrent:1@75 jet:-2@148|splash:-3|gulp:-3 jet:-3@91*.55
Waterfall|torrent:-1 rain:2@86 splash:-3@201|stomp:3
Wave Crash|wave:1 rush:-3@75 blast:4@163|slam:-2 splash@42|wave:1 rush:2@87
Whirlpool|ripple:-2 whorl:-1@58 wave:-2@151|gulp:-2
Withdraw|shell:2 ripple:-2@60 latch:2@124|shield:2
`);
  section('breath:-2 drum@62*.52', `
Arm Thrust|cloth:1 swish:3@31|punch:2
Aura Sphere|hum:1 pulse:4@50 plasma:3@104|pulse:-2 thud@28|hum:-2 pulse:3@66 shimmer:5@121*.5
Axe Kick|swish:1 kick:-2@65 wood:-3@127|slam:-1
Body Press|cloth:-5 rush:-4@52 stomp:-3@121|thud:-4
Brick Break|snap:1 punch:-1@51 rock:-2@91|shatter:-6 gravel@53
Bulk Up|heartbeat:-2 breath:-3@69 taiko:1@160|thud:1
Circle Throw|cloth:2 spin:1@58 rush:-2@121|stomp:-2
Close Combat|breath:3 swish:2@33 punch:2@60 kick@130 clap:2@182|thud:-2
Coaching|whistle:1 clap@72 drum:5@159|ping:5
Collision Course|whirr:1 rush:-2@59 slam:-3@144|boulder:1|whirr:-3 gear:4@64 rush:1@120
Combat Torque|whirr:2 kick:1@64 rush@126|punch:1
Counter|shield:1 snap@63 punch:-2@104|thud:2
Cross Chop|swish:3 wood:-1@38 swish:-2@92|punch:-2
Detect|breath:4 sonar:4@52 tick:7@124|ping:6
Double Kick|paw:2 swish:2@31|kick:3
Drain Punch|siphon:3 punch:1@66 gulp@127|thud:2
Dynamic Punch|spring:-2 rush:2@44 punch:-3@115|blast:4
Final Gambit|heartbeat:-4 rush:-3@80 drum:-2@155|slam:-4
Flying Press|flap:1 rush:-2@68 stomp:-2@151|thud:-3|flap:-2 cloth:1@58 breath:2@101
Focus Blast|hum:-2 pulse:-2@57 plasma:-1@115|blast:-1|charge:-2 breath@95
Focus Punch|breath:-4 core:-2@64 punch:-3@136|thud:-4|heartbeat:-2 hum@112
Force Palm|cloth:1 pulse:3@54 clap:-1@107|punch:2
Hammer Arm|swish:-4 taiko:-3@57 punch:-3@113|stomp:-2
High Jump Kick|bounce:2 rush:5@54 kick:-3@132|slam:-3|spring:-1 swish:3@77
Jump Kick|spring:1 swish:2@57 kick:2@123|thud:2|paw:2 spring:3@59
Karate Chop|cloth:3 swish:3@38 wood:-1@72|snap:2
Low Kick|paw:-2 swish:-2@38 kick:-1@80|thud:-2
Low Sweep|sand:1 swish:-3@54 kick:-2@104|thud:-1
Mach Punch|snap:3 rush:5@14 punch:3@49|tap:3|cloth:2 rush:5@43
Mat Block|cloth:-4 wood:-1@60 latch:2@106|shield:1
Meteor Assault|horn:1 rush:-1@62 steel:-1@112 star:4@167|slam:-1
No Retreat|stomp:-1 taiko@70 horn:-1@160|gong:-2
Octolock|sludge:1 vine:-2@72 latch:-3@142|gulp:-2
Power Up Punch|drum:2 sprout:5@45 punch:1@101|thud:3
Quick Guard|swish:5 shield:5@52 tick:6@107|clap:3
Revenge|growl:1 breath:-3@65 punch:-2@126|thud:-1
Reversal|heartbeat:3 sweep:-1@55 kick:-2@116|slam:2
Rock Smash|punch:1 rock:-1@52 gravel:1@96|rock:-2 gravel@27
Rolling Kick|spin:1 swish:2@68 kick@127|thud:2
Sacred Sword|bell:2 steel:3@59 slice:1@123|clang:1
Secret Sword|whisper:3 mind:2@57 steel:4@102|slice:3
Seismic Toss|cloth:-4 rush:-3@64 quake:-2@167|stomp:-4
Sky Uppercut|swish:-2 punch:4@53 rush:6@91|thud:2
Storm Throw|gale:2 cloth:1@52 rush:-2@109|slam:-2
Submission|cloth:-3 vine:-3@65 thud:-2@133|crunch:-2
Superpower|heartbeat:-2 roar:-2@72 stomp:-3@162|slam:-3
Thunderous Kick|arc:2 kick:-3@56 thunderroll:5@119|stomp:-2
Triple Arrows|string:1 swish:4@33|sting:2 wood@21
Triple Kick|paw:3 spin:2@48|kick:2 thud@22*.6
Upper Hand|clap:5 swish:3@34 punch:3@80|tap:4
Vacuum Wave|siphon:2 wind:3@47 pulse:4@107|thud:4
Victory Dance|taiko:2 clap:3@70 drum:5@149 horn:4@225|chime:6
Vital Throw|breath:-2 cloth:1@60 rush:-3@141|stomp:-2
Wake Up Slap|clap:4 bell:5@58 tap:4@119|punch:3
`);
  section('ember:1 breath:-1@74*.45', `
Armor Cannon|latch:-4 flame:1@43 blast:-1@93|clang:-2 boom@41|metalBend:-2 latch:4@73 ember:4@139
Bitter Blade|haunt:-1 steel:2@52 flame:3@95|slice:-1
Blast Burn|flame:-2 blast:-3@42 inferno:-2@116 boom@205|boom:-2|fuse:-2 charge:-3@103
Blaze Kick|ember:2 rush@39 kick:-1@94|flame:2
Blazing Torque|whirr:2 flame:1@56 inferno:3@128|slam:2
Blue Flare|plasma:2 flame:4@55 inferno:3@130|blast:3
Burn Up|inferno:1 ember:2@111 hiss:2@212|blast:2
Burning Bulwark|flame:-2 shield:-2@54 ember:3@149|flame:2
Burning Jealousy|growl:-2 ember:-1@51 flame:2@142|hiss:-1|hiss:-3 ember:-2@70 flare:4@141
Ember|flint:4 ember:4@28 ember:7@91|pop:3
Eruption|quake:-3 boom:-3@75 inferno:-2@125 gravel@263|blast:-2|quake:-3 ember:-2@93 fuse:1@161
Fiery Dance|ember:3 drum:2@51 flame:3@122 harp:7@207|flame:3
Fire Blast|fireball:-1 snap:1@51 blast:1@86 flame:2@157|boom:3|flame:-2 fuse@84
Fire Fang|flame:3 bite@48 ember:4@93|crunch:1
Fire Lash|flame:3 whip:1@65 ember:5@114|snap:2
Fire Pledge|ember:2 root@54 flame:1@124|fireball:3
Fire Punch|ember:3 punch:-1@43 flame:2@83|thud:1
Fire Spin|spin:2 flame:1@56 ember:6@140|hiss:1
Flame Burst|fireball:3 pop:-1@65 ember:3@123|blast:4|ember:3 pop:4@76
Flame Charge|flame:3 rush:3@50 ember:4@111|thud:2|paw:3 ember:5@64
Flame Wheel|spin:3 ember:2@63 flame:1@129|thud:1|spin:1 ember:-1@55 spin:5@117
Flamethrower|flint:2 flame:1@23 inferno:2@87 ember:3@267|hiss:2|breath:-3 fuse:3@89
Flare Blitz|flame:1 rush:-1@53 blast:2@127|slam:1|ember:4 rush:3@67 flame:5@116*.5
Fusion Flare|plasma:-1 fireball:-1@61 inferno:2@125|boom:2
Heat Crash|inferno:-2 rush:-4@61 stomp:-3@135|slam:-3|stomp:-2 steam:2@84
Heat Wave|gale:1 flame:-1@56 inferno:2@145|hiss:-1|wind:-1 ember:2@66 wind:3@129
Incinerate|flint:1 flame:5@40 hiss:3@138|ember:4|breath:-2 flint:3@67 hiss:3@118
Inferno|flame:-3 inferno:-1@64 boom:3@191|blast:1
Lava Plume|bubble:-7 quake:1@59 fireball:-2@123 inferno:3@199|boom:3|bubble:-5 core:-2@76 ember:2@132
Magma Storm|boulder:1 flame:-2@59 gale:-2@141 ember:3@238|blast:-1
Mind Blown|pop:6 chime:7@42 blast:3@88 shatter:5@151|boom:3|spring:2 fuse:4@91
Mystical Fire|harp:4 ember:3@53 flame:4@120|hiss:4
Overheat|inferno:1 plasma:2@84 hiss:-2@213|blast:-2
Pyro Ball|ember:5 kick:3@44 fireball:2@88|blast:2|tap:2 flint:1@43 ember:5@106
Raging Fury|roar:-1 flame:2@56 punch:1@132|fireball:1
Sacred Fire|bell:2 flame:1@68 choir:2@151|blast:2
Searing Shot|latch:3 fireball:3@42 snap:3@95|blast:4|fuse:3 latch:5@77
Shell Trap|shell:-2 latch:1@49 fuse:3@117|blast:1|shell:-2 tick:3@72 fuse:-2@127
Sizzly Slide|swish:4 ember:2@45 flame:4@109|hiss:3
Sunny Day|shimmer:3 harp:4@73 chime:9@163|star:8
Temper Flare|growl:3 ember@45 fireball:2@115|flame:1
Torch Song|flute:2 flame:3@61 choir:4@120 flute:7@226|ember:4
V Create|ray:3 slice:1@43 flame:2@85 blast:-1@163|boom:1
Will O Wisp|whisper:2 ember:5@66 haunt:5@145|hiss:3
`);
  section('whisper:-3 core@75*.42', `
Assurance|paw:-2 snap:-2@58 punch:-2@109|thud:-2
Baddy Bad|growl:3 void:1@62 shield:-1@129|pulse:-1
Beat Up|paw:-1 growl:2@38|punch:-1 tap@19
Bite|bite:1 snap:2@36|crunch:2
Brutal Swing|chain:-2 swish:-3@61 thud:-4@119|slam:-2|cloth:-4 swish:-3@88
Ceaseless Edge|steel:-2 slice:-1@59 gravel:3@124|flint:1
Comeuppance|shield:-1 growl:1@68 punch:-2@137|thud:-3
Crunch|bite:-3 crunch:-4@34 bone:-3@86|snap:-2
Dark Pulse|void:-2 pulse:-2@70 moan:2@156|pulse:-3|drone:-2 void:2@78
Dark Void|haunt:-3 portal:-5@79 void:-5@170|moan:-2|whisper:2 portal:-4@104
Darkest Lariat|roar:-1 spin:-2@56 cloth:-3@115|slam:-2
Embargo|chain:-1 latch:-2@59 toneOff:-2@132|tick:-2
Fake Tears|drop:5 drop:2@78 squeak:1@132|ripple:4
False Surrender|cloth:2 paw:-1@66 whip:2@121|punch:3
Feint Attack|whisper:3 rush:3@53 snap@101|thud:2
Fiery Wrath|roar:-4 flame:-2@61 haunt:-1@131|blast:-2|growl:-2 ember:-3@71 haunt:4@141
Flatter|harp:2 whisper:5@63 chime:5@127|mind:2
Fling|cloth:1 swish:4@41 rush@78|rock:3
Foul Play|latch:1 cloth:-2@48 thud:2@110|punch:1
Hone Claws|steel:4 sand:4@61 snip:4@130|flint:4
Hyperspace Fury|portal:-3 rush:-2@70 punch:-3@119 void@180|boom:2
Jaw Lock|bite:-3 latch:-4@42 growl:-3@132|crunch:-3
Knock Off|swish:2 clap:-1@56 coin:4@111|thud:1
Kowtow Cleave|cloth:-2 gonglet:-3@62 slice:-3@141|steel:-2
Lash Out|growl:1 whip:-2@54 tear:-2@112|snap:-1
Memento|whisper:-4 heartbeat:-3@76 void:-3@167|moan:-1
Nasty Plot|whisper:2 mind:-2@75 plink:2@163|hum:-2
Night Daze|void:-2 whorl:-3@58 pulse:2@143|boom:3
Night Slash|haunt:3 swish:-1@49 slice:2@83|tear:2|whisper:-1 snip:2@78
Obstruct|stomp:-3 shield:-4@54 snap:-3@121|clang:-4
Parting Shot|whistle:-4 rush:3@66 pop:-2@119|pulse:1
Payback|heartbeat:-1 latch:-1@64 punch:-3@126|thud:-2
Power Trip|drone:2 growl:1@57 rush:2@123|punch:1
Punishment|chain:-1 whip:-1@66 slam:1@122|thud:-3
Pursuit|paw:3 paw:5@44 rush:3@96|bite:1
Quash|tick:2 toneOff:-3@40 thud:-3@111|latch:-2
Ruination|gong:-4 void:-3@87 quake:-2@164|boom:-3
Snarl|growl:2 tear:-2@59 breath@121|pulse:-2|breath:-4 growl:3@72
Snatch|cloth:3 whip:3@39 latch:4@91|snap:3
Sucker Punch|whisper:2 snap:3@42 punch:3@68|thud:2
Switcheroo|cloth:3 coin:4@46 swish:-1@107 latch:3@163|plink:4
Taunt|whistle:-3 snap:3@61 growl:4@143|tap:3
Thief|paw:2 cloth:3@52 coin:3@121|tap:2
Throat Chop|breath:-1 swish:2@48 wood:-2@87|punch:-1
Topsy-Turvy|whorl:-3 spring:2@68 sweep:-2@143|pop:3
Torment|moan:-2 whisper:1@75 mind:-4@161|void:1
Wicked Blow|growl:-2 rush:-2@53 punch:-4@108|slam:-2
Wicked Torque|whirr:-3 void:2@62 rush:-1@124|thud:-2
`);
  section('haunt:2 whisper@67*.45', `
Astonish|whisper:3 snap:5@78 squeak:2@108|pop:4
Astral Barrage|haunt:-2 star:2@42 void:1@109 star:5@165|pulse:-2|hoof:-2 haunt:3@69 star:-2@128
Bitter Malice|moan:-3 frost:2@71 haunt:-1@143|ice:-2
Confuse Ray|mind:4 ray:4@65 whorl:3@150|ping:5
Curse|bell:-8 whisper:-3@77 chain:-4@180|void:-3
Destiny Bond|string:-3 heartbeat:-3@66 moan:-2@166|gong:-3
Grudge|growl:-2 whisper:-4@81 haunt:-4@153|void:-1
Hex|bell:-4 haunt:3@55 snap:2@128|pulse:-1
Infernal Parade|taiko:-4 flame:1@61 moan:-1@133 drum:-3@211|blast:2
Last Respects|bell:-7 paw:-4@93 choir:-6@201|gong:-3
Lick|gulp:3 ooze:4@37 pop:5@93|drip:4
Moongeist Beam|bell:-4 haunt:-1@51 beam:1@104|void:-1|haunt:-4 charge:1@116
Night Shade|whisper:-2 moan:1@66 void:3@148|pulse:1
Nightmare|yawn:-6 whisper:-3@91 moan:-2@179|void:-3
Ominous Wind|wind:-4 haunt:1@65 whisper:2@183|breath:-3
Phantom Force|portal:-2 rush:1@92 thud:-2@167|void:2
Poltergeist|chain:2 wood:-2@56 clang:-2@127|slam:-1
Rage Fist|roar:1 haunt:-2@55 punch:-3@116|thud:-3
Shadow Ball|hum:-3 void:2@42 plasma:-2@101|pulse:-2|whisper:-3 void:-1@83
Shadow Bone|bone:-2 haunt:1@49 swish:1@115|wood:-2
Shadow Claw|whisper:-1 tear:1@49 slice:-1@93|snip:1
Shadow Force|void:-3 portal:-3@75 rush:-3@157|boom:-2
Shadow Punch|whisper:1 rush:2@41 punch:1@82|thud:1
Shadow Sneak|paw:3 whisper:3@42 snap:3@105|tap:3
Spectral Thief|cloth:-1 haunt:3@59 siphon:2@132|pulse:3
Spirit Shackle|string:-2 swish:2@44 chain:-2@111|latch:-3
Spite|whisper:4 bell:-3@58 toneOff:-2@143|void:3
Trick-or-Treat|pop:2 bell:-2@55 moan:4@148|chime:3
`);
  section('buzz:2 leaf@59*.45', `
Attack Order|chirp:2 swarm:1@59 sting:2@129|bite:3
Bug Bite|buzz:4 bite:4@51 snap:5@98|crunch:4
Bug Buzz|buzz:-1 swarm:3@43 pulse:3@152|buzz:4
Defend Order|chirp:4 swarm:2@56 shield:3@139|shield:4
Fell Stinger|buzz:2 rush:4@49 sting:3@93|snap:4
First Impression|snap:4 wing:5@32 rush:4@78|punch:4|buzz:5 paw:5@48
Fury Cutter|buzz:2 slice:5@33 snip:5@99|tear:4
Heal Order|swarm:4 bubble:4@80 harp:7@141|chime:5
Infestation|swarm:-1 rattle:3@64 bite:5@151|buzz:2
Leech Life|bite:4 siphon:1@68 gulp:2@158|drop:3
Lunge|paw:3 rush:2@53 thud:3@110|punch:3|spring:2 cloth:3@66
Megahorn|buzz:-3 horn:2@55 rush:-2@120|wood:-3|shell:-2 hoof:-1@84
Pin Missile|sting:5 swish:5@27|flint:5
Pollen Puff|pollen:3 bubble:4@53 pop:5@117|pollen:5|pollen:5 pop:7@97
Pounce|paw:5 spring:2@47 rush:3@98|thud:4|paw:4 spring:5@68
Powder|pollen:2 hiss:4@88|ember:3
Quiver Dance|wing:4 string:4@61 harp:7@137 buzz:5@207|chime:7
Rage Powder|pollen:1 buzz:3@57 growl:4@136|hiss:2
Signal Beam|digital:3 buzz:4@49 beam:4@98|pulse:4|digital:-1 ping:3@72 buzz:5@131
Silk Trap|silk:-2 string:2@53 latch:3@134|snap:4
Silver Wind|feather:4 shimmer:4@48 wind:4@139|chime:6
Skitter Smack|rattle:4 paw:5@49 wood:4@112|thud:4
Spider Web|silk:3 string:3@56 string:7@140|latch:4
Steamroller|gear:-3 buzz:-3@69 quake:3@126|stomp:-3|shell:1 spin:-3@71 whirr:2@123
Sticky Web|silk:-2 ooze:2@58 string:-3@137|latch:1
String Shot|string:4 silk:4@42 pop:4@118|silk:2|silk:5 spring:-1@70
Struggle Bug|buzz:3 paw:4@66 whorl:4@132|tap:4|rattle:3 buzz:1@66
Tail Glow|buzz:5 star:7@70 shimmer:9@166|chime:9
Twineedle|wing:3 sting:3@39|sting:5 tick@12
U Turn|wing:2 rush:3@44 sweep:4@122|punch:3
X Scissor|snip:1 slash:3@36 snip:-2@89|steel:3
`);
  section('static:3 coil@52*.58', `
Aura Wheel|coil:2 spin:2@48 arc:2@136|zap:3
Bolt Beak|wing:2 spark:4@39 bone:4@91|arc:2
Bolt Strike|arc:-2 rush:2@52 thundercrack:2@123|boom:4
Buzzy Buzz|buzz:5 spark:6@56 zap:6@130|arc:5
Charge|static:2 coil:1@60 charge:2@143|ping:5
Charge Beam|coil:4 ray:3@62 laser:3@121|arc:3|coil:1 coil:5@84
Discharge|coil:-1 arc:3@43 static:4@111 arc:-2@180|thundercrack:3|static:-2 arc:2@74*.5
Double Shock|arc:2 snap:-1@34 zap:-2@104 arc:5@201|thud:2
Eerie Impulse|static:3 mind:-2@65 zap:2@134|pulse:1
Electric Terrain|coil:-2 static:1@69 hum:3@146 spark:4@208|arc:4
Electrify|spark:5 coil:5@47 zap:6@125|ping:5
Electro Ball|coil:3 plasma:4@48 bubble:7@131|arc:3|coil:3 whirr:3@58 spark:8@121
Electro Drift|whirr:4 arc:2@51 rush:3@121|thundercrack:4|whirr:1 static:4@67 whirr:5@118
Electro Shot|charge:3 latch:3@78 laser:1@139|arc:1|rain:3 coil:4@75
Electroweb|silk:4 spark:3@56 static:4@135|latch:3|silk:3 static:4@79
Fusion Bolt|plasma:1 arc:1@55 thundercrack@125|boom:2
Ion Deluge|static:2 rain:4@57 coil:4@143|spark:6
Magnet Rise|coil:-1 hum:3@59 ray:5@154|ping:4
Magnetic Flux|coil:2 clang:4@55 coil:7@136|ping:5
Nuzzle|cloth:4 spark:6@44 squeak:5@98|zap:5
Overdrive|string:-4 buzz:2@41 arc:-1@96 gonglet:2@151|pulse:1|string:-2 hum:2@62 coil:2@117
Parabolic Charge|coil:2 whorl:4@52 siphon:4@131|arc:3|sonar:2 coil:6@84
Pika Papow|squeak:5 spark:3@57 zap:3@131 thundercrack:4@197|arc:4
Plasma Fists|plasma:2 punch:2@51 arc:2@97|thud:2
Rising Voltage|coil:-2 coil:5@79 zap:3@153|arc:3
Shock Wave|arc:3 ripple:5@58 pulse:4@131|spark:4
Spark|spark:3 snap:3@23 arc:5@64|tap:5
Supercell Slam|thunderroll:3 rush:-2@61 thundercrack:-1@132|slam:-3
Thunder|thundercrack thunderroll:-2@62 thunderroll:3@233*.44|arc:-2|static:-3 thunderroll:2@59*.47
Thunder Cage|chain:2 arc:2@58 static:1@116 latch:2@187|zap:2
Thunder Fang|spark:4 bite:1@45 arc:2@82|crunch:2
Thunder Punch|coil:2 punch:1@44 arc:-1@75|thud:1
Thunder Shock|spark:5 zap:5@32|static:4
Thunder Wave|coil:5 static:6@62 sonar:4@139|zap:4
Thunderbolt|spark:2 arc:4@21 zap:1@63 arc:-1@125|thundercrack:4|coil:4 static@65
Thunderclap|clap:-1 spark@17 thundercrack:2@41|arc:3
Volt Switch|zap:3 rush:4@41 sweep:4@119|spark:4
Volt Tackle|coil:1 rush:2@48 arc:2@104|slam:2|paw:1 static:2@58 paw:4@101
Wild Charge|static:2 rush:1@49 thundercrack:3@129|punch:1|growl:1 spark:4@73 static:2@119
Wildbolt Storm|gale:1 arc:2@61 thunderroll:1@146|thundercrack:2|gale:-2 static:4@70 thunderroll:4@126*.45
Zap Cannon|latch:1 coil:-1@63 plasma:-2@119|blast:1 arc@39|latch:-1 coil:-2@55 charge:4@131
Zing Zap|spring:3 spark:4@58 zap:6@119|arc:4|spark:5 paw:5@49 spark:8@88
Zippy Zap|paw:6 spark:7@19 rush:7@45|zap:7
`);
  section('frost:2 ice@77*.48', `
Aurora Beam|shimmer:3 ray:5@48 beam:5@112|ice:3|shimmer:3 frost:4@77 ray:3@132
Aurora Veil|frost:3 shimmer:4@65 shield:4@158|crystal:4
Avalanche|snow:-4 boulder:1@78 shatter:-2@163|stomp:-3
Blizzard|blizzard:-1 snow:3@71 gale:2@153 shard:4@239|frost:2|gale:-2 frost:2@112
Chilly Reception|whistle:-2 snow:3@81 frost@152|flake:3|wind:-2 flake:2@81
Freeze Dry|frost:3 hiss:4@48 ice:4@133|shatter:5
Freeze Shock|ice:1 coil:2@56 zap:2@142|arc:2 shard@38|frost coil@95
Freezy Frost|frost:5 star:6@57 ice:5@130|shard:4
Frost Breath|breath:-1 frost:1@49 shard:3@155|ice:2
Glacial Lance|ice:-3 rush:-1@59 shard:-2@141|shatter:-2|ice:-4 metalBend:3@74 shard:4@134
Glaciate|frost:-3 quake:2@71 ice:-2@142|shatter:2|frost:-3 crystal:1@97
Hail|ice:3 pebble:5@71 ice:6@144 rain:4@201|shard:5
Haze|breath:3 frost:4@80 gas:5@156|frost:3|breath:3 frost:-2@108
Ice Ball|ice:2 spin:3@56 snow:3@119|shatter:4|snow:2 spin:-1@67 ice:5@112
Ice Beam|crystal:3 beam:5@26 frost:2@72 ice:4@168|shard:3|frost:3 ray:4@97
Ice Burn|frost:-1 flame:2@63 steam:1@144|shatter:2|frost:-1 fuse:3@93
Ice Fang|frost:2 bite:1@53 ice:3@92|crunch:2
Ice Hammer|ice:-3 swish:-2@57 clang:-2@117|shatter:-2
Ice Punch|frost:2 punch:1@46 shard:1@91|thud:2
Ice Shard|ice:4 swish:6@29|shard:5
Ice Spinner|ice:2 spin:4@56 shatter:5@139|crunch:4
Icicle Crash|whistle:-3 ice:1@63 shatter:1@139|rock:3
Icicle Spear|ice:5 swish:5@35|shard:6
Icy Wind|wind:4 frost:4@47 snow:5@137|frost:4|wind:3 frost:3@71
Mist|breath:4 frost:5@62 shimmer:5@167|pad:5
Mountain Gale|gale:-3 boulder:2@78 blizzard@158|stomp:1
Powder Snow|snow:5 pollen:5@62 frost:4@146|flake:4|snow:5 breath:4@78
Sheer Cold|frost:-3 void:-2@77 shatter:1@170|ice:-3
Snowscape|snow:2 wind:4@69 shimmer:4@191|flake:2
Triple Axel|spin:5 ice:4@49|kick:4 shard:5@17
`);
  section('gravel:-1 quake@64*.42', `
Bone Club|bone:-1 swish:-1@41 wood:-2@78|thud:1
Bone Rush|bone:2 rush:3@30|bone:3 tap@17
Bonemerang|bone:2 spin:3@46 swish:3@117|bone:1
Bulldoze|quake:1 gear:-4@52 gravel:-1@145|stomp:-2|stomp:1 gravel:-3@85
Dig|sand:-2 gravel:-2@62 root:-1@143|rock:2
Drill Run|drill:-2 rush:1@65 gravel:3@142|rock:-1|drill:-2 drill:3@78
Earth Power|core:-2 root:-2@78 quake:2@149|boulder:1
Earthquake|quake:-3 boulder:-3@79 gravel:-2@181|stomp:-3|quake:3 gravel:1@108
Fissure|root:-3 snap:-3@66 quake:-4@130|boulder:-4
Headlong Rush|hoof:2 rush:-2@57 boulder:2@132|slam:-3
High Horsepower|hoof:-2 hoof:2@78 rush:-3@147|stomp:-3|hoof:-3 hoof:1@79
Land's Wrath|quake:-2 root:-3@69 boulder:-4@148|boom:-2|drone:-3 rock:2@76 quake:2@141*.45
Magnitude|quake:2 gravel@79 taiko:-3@167|rock:-3|quake:2 gravel:4@79
Mud Bomb|bubble:-4 sludge:1@48 blast:5@117|sludge:-1|ooze:-2 gulp:-3@87
Mud Shot|ooze:-3 jet:4@49|sludge:3
Mud Slap|sludge:2 clap:2@47 sand:3@109|splash:-2
Mud Sport|sludge:3 splash:-1@69 gulp:-3@146|ooze:2
Precipice Blades|quake:-2 rock:2@61 slice:-3@117|boulder:-2|boulder:-2 shard:-4@81 rock:3@145
Rototiller|gear:-2 root:2@67 gravel:2@135 sprout:3@202|wood:3|gear:-3 drill:-3@67 root:2@127
Sand Attack|sand:3 swish:4@49 flint:6@107|sand:4
Sand Tomb|sand:-1 spin:-2@62 rock:-3@153|thud:-2
Sandsear Storm|gale:-2 sand:2@57 ember:2@133|gravel:2|sand:1 flint:3@73 gale:3@134*.5
Scorching Sands|sand:2 flame:3@54 steam:2@137|hiss:2
Shore Up|sand:-2 rock:3@79 harp:2@163|wood:2
Spikes|flint:2 steel:4@54 pebble:4@118|sting:1 thud@30
Stomping Tantrum|stomp:1 stomp:-2@101 growl:-1@157|boulder:1
Thousand Arrows|string:-1 swish:2@39 gravel:2@111|wood:-1|string:-4 string:3@62 sand:4@124
Thousand Waves|quake:1 wave:-3@68 gravel:-2@166|boulder:2|sand:-2 ripple:-4@72 quake:3@138*.42
`);
  section('growl:1 core@74*.52', `
Breaking Swipe|roar:2 whip:-2@59 tear:-1@129|thud:1|growl:-3 whip:-2@85*.55
Clanging Scales|chain:3 clang:2@51 steel:5@123 gonglet:2@195|clang:1|rattle:-2 gonglet:1@68 steel:4@122
Clangorous Soul|taiko:2 chain@61 gong:2@128 horn:3@221|gonglet:4
Core Enforcer|core:-3 beam:-1@62 plasma:-1@132|blast:1|core:-3 pulse:-1@65 scan:4@140
Draco Meteor|whistle:-4 fireball:-2@75 boulder:-1@157 blast:2@254|boom:-1|roar:-2 core@102
Dragon Breath|growl:2 breath:-2@48 flame:1@111|pulse:2|breath:-5 growl:1@91
Dragon Cheer|horn:3 clap:3@66 roar:4@158|chime:5
Dragon Claw|growl:2 swish:1@42 tear:-1@88|slice:1
Dragon Dance|drum:2 whorl:2@66 horn:4@151 drum:5@218|chime:5
Dragon Darts|wing:5 whistle:4@38|sting:4 snap@14
Dragon Energy|roar:-2 core:1@70 plasma:2@144|boom:3|heartbeat:-1 growl:-2@77 core:3@139
Dragon Hammer|growl:-1 wood:-3@60 taiko:-4@131|slam:-3
Dragon Pulse|hum:-2 pulse:1@51 horn:-1@122|plasma:2|hum:-4 pulse:1@65 roar:4@126*.4
Dragon Rage|growl:-1 roar:2@46 fireball:2@137|blast:3
Dragon Rush|roar:1 rush:-2@53 thud:-1@138|slam:-2|growl:2 paw:1@57 wing:-1@122
Dragon Tail|swish:-2 whip:-3@64 growl:1@137|thud:-2
Dual Chop|swish:3 wood:1@36|punch:1 bone@15
Dynamax Cannon|core:-4 charge:1@69 beam:-2@152|boom:-2|drone:-3 charge:-2@117
Eternabeam|beam:-3 ray:3@29 plasma:-3@67 beam:4@171 thunderroll:3@267|blast:-3 shard@49|charge:-4 mind:-2@97 coil:5@181
Fickle Beam|ray:2 digital:3@61 beam:2@111|plasma:2
Glaive Rush|steel:-1 rush:-3@60 growl:1@136|slam:-2
Order Up|whistle:1 gulp:3@62 horn:3@153|pulse:2
Outrage|growl:2 roar:1@54 stomp:-1@151|slam:2
Roar Of Time|tick:-5 roar:-3@94 gong:-5@176 beam:-3@242|boom:-3|tick:-3 tick:2@140 charge:-1@188
Scale Shot|chain:3 snip:3@41|shard:-1 tap@18
Spacial Rend|portal:-1 slice:-3@73 shatter:1@142|void:-2|mind:-2 tear@100
Twister|spin:2 wind:2@53 whorl:1@122|gale:3|whorl:2 wind:4@76
`);
  // The engine also uses a basic action outside the selectable move catalog.
  section('cloth:2', `
Normal Attack|swish:3*.48|tap:1
Struggle|cloth:-2 thud:3@48|punch:2
`);
  globalThis.ArenaMoveScores=scores;
})();
