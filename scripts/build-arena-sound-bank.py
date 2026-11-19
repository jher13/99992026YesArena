"""Build the original mono battle foley. Development only: Python, NumPy and SciPy."""
import base64
import json
from pathlib import Path

import numpy as np
from scipy import signal

RATE = 24000
rng = np.random.default_rng(82846)
bank = {}


def time(seconds):
    return np.arange(round(seconds * RATE)) / RATE


def shape(t, attack, decay):
    return np.minimum(1, t / max(attack, .0001)) * np.exp(-t / decay)


def tone(d, high, low, decay, attack=.003, harmonics=(1,), fm=0, ratio=2, wobble=0, trem=0):
    t = time(d)
    f = high * (low / high) ** (t / d)
    phase = 2 * np.pi * np.cumsum(f * (1 + .02 * wobble * np.sin(2*np.pi*6*t))) / RATE
    mod = fm * np.sin(phase * ratio) * np.exp(-t / max(.05, d*.65))
    wave = sum(v * np.sin((i+1)*phase + mod) for i, v in enumerate(harmonics))
    return wave * shape(t, attack, decay) * (1 - .38*trem + .38*trem*np.cos(2*np.pi*22*t))


def noise(d, low, high, decay, attack=.002, flutter=0):
    t = time(d)
    bands = signal.butter(2, [low, high], btype='bandpass', fs=RATE, output='sos')
    wave = signal.sosfilt(bands, rng.standard_normal(len(t)))
    wave /= max(.001, np.sqrt(np.mean(wave*wave))*2.5)
    return wave * shape(t, attack, decay) * (.64+.36*np.cos(2*np.pi*flutter*t) if flutter else 1)


def mix(*parts):
    # Each layer is (onset in seconds, relative amplitude, waveform).
    out = np.zeros(max(round(at*RATE)+len(wave) for at, _, wave in parts))
    for at, gain, wave in parts:
        start = round(at * RATE)
        out[start:start+len(wave)] += gain * wave
    return out


def metal(pitch, d, modes, decay=.3):
    return mix(*[(0, level, tone(d, pitch*r, pitch*r*.996, decay/(1+i*.31)))
                 for i, (r, level) in enumerate(modes)])


def grains(count, span, make, spread=.3):
    return mix(*[(i*span/max(1,count-1), rng.uniform(1-spread,1), make(i)) for i in range(count)])


def throat(d, pitch, end, formants, attack=.02, trem=0):
    t = time(d)
    phase = 2*np.pi*np.cumsum(np.linspace(pitch,end,len(t))*(1+.036*np.sin(2*np.pi*7*t)))/RATE
    voice = .62*signal.sawtooth(phase,.17)+.17*rng.standard_normal(len(t))
    resonant = np.zeros(len(t))
    for hz, q, gain in formants:
        b,a = signal.iirpeak(hz,q,fs=RATE)
        resonant += gain * signal.lfilter(b,a,voice)
    return resonant * shape(t,attack,d*.6) * (1-.38*np.sin(2*np.pi*t*trem)**2)


def add(name, wave):
    assert name not in bank
    wave = np.asarray(wave, dtype=float)
    wave -= np.mean(wave)
    wave[:24] *= np.linspace(0,1,24)
    tail = min(len(wave)//3,round(RATE*.018))
    wave[-tail:] *= np.linspace(1,0,tail)
    # Soft-knee transients and a consistent reference peak. Scores set the mix.
    wave = np.tanh(1.45 * wave/max(np.max(abs(wave)),.001))
    wave *= .92/max(np.max(abs(wave)),.001)
    companded = np.sign(wave)*np.log1p(255*abs(wave))/np.log(256)
    codes = (128 + np.rint(127*companded)).astype(np.uint8)
    bank[name] = base64.b64encode(codes).decode('ascii')


# Foley: weight, contact, motion and animal sounds.
add('tap',mix((0,1,tone(.09,365,165,.017)),(0,.38,noise(.06,1100,5400,.011))))
add('thud',mix((0,1,tone(.20,142,49,.060)),(0,.34,noise(.11,130,900,.026))))
add('punch',mix((0,.95,noise(.115,540,4400,.020)),(.006,1,tone(.16,205,64,.039)),(.024,.24,noise(.12,130,810,.035))))
add('kick',mix((0,1,tone(.205,295,50,.052)),(.012,.6,noise(.15,230,1300,.037))))
add('stomp',mix((0,.4,noise(.07,320,3700,.014)),(.009,1,tone(.26,107,44,.08)),(.034,.46,noise(.23,90,900,.063))))
add('slam',mix((0,.9,noise(.14,180,5800,.027)),(.006,.95,tone(.28,185,46,.066)),(.067,.35,noise(.21,80,1060,.065))))
add('clap',grains(3,.023,lambda i:noise(.13,770,4800,.017+i*.008)))
add('snap',mix((0,1,noise(.046,1600,8100,.007)),(.009,.55,tone(.065,880,234,.014))))
add('crunch',grains(6,.10,lambda i:noise(.08,420+160*i,5700-i*220,.014)))
add('tear',mix((0,.8,noise(.19,900,7800,.072,.009,82)),(.045,.5,noise(.17,270,3100,.055,.014,47))))
add('swish',mix((0,.7,noise(.20,290,1800,.088,.046)),(.045,1,noise(.15,1850,7600,.045,.031))))
add('slice',mix((0,1,noise(.16,2300,9700,.043,.017)),(.023,.28,tone(.13,2000,520,.041,.004,(1,.20)))))
add('rush',mix((0,.7,noise(.25,150,1900,.095,.050)),(.055,1,noise(.22,490,5800,.055,.035)),(.083,.25,tone(.19,740,120,.066))))
add('spin',grains(4,.21,lambda i:noise(.10,480+i*190,4700,.031,.019)))
add('whip',mix((0,.54,noise(.13,520,4700,.10,.060)),(.079,1,noise(.06,1250,10000,.010)),(.088,.39,tone(.09,1190,230,.025))))
add('flap',mix((0,1,noise(.18,110,1650,.052,.019)),(.032,.7,noise(.12,1200,4500,.035)),(.088,.40,noise(.12,190,1900,.040,.017))))
add('feather',grains(3,.11,lambda i:noise(.13,2300+i*240,8900,.045,.019)))
add('wind',mix((0,.8,noise(.48,250,2300,.26,.090)),(.09,.58,noise(.38,1250,5300,.17,.084))))
add('gale',mix((0,1,noise(.60,95,1900,.28,.085,9)),(.08,.62,noise(.51,650,5700,.22,.12)),(.14,.30,tone(.36,640,307,.19,.06,(1,.15),.47))))
add('bite',mix((0,.66,noise(.06,690,5600,.012)),(.026,1,noise(.12,240,2850,.028,flutter=61)),(.035,.5,tone(.11,225,86,.03))))
add('paw',mix((0,.55,tone(.085,320,130,.022)),(0,1,noise(.07,350,2030,.022,.004)),(.04,.22,noise(.06,1200,4000,.014))))
add('squeak',tone(.135,910,1560,.054,.007,(1,.24),.72,1.53,1))
add('growl',throat(.39,91,65,[(460,2.1,2),(940,4,1),(1550,3,.72)],.032,21))
add('roar',mix((0,1,throat(.61,136,72,[(490,2.1,2),(1110,3.3,2),(2170,3.1,1)],.055,18)),(.045,.24,noise(.51,240,3600,.24,.09))))
add('howl',throat(.62,270,432,[(830,3.7,2),(1450,4,1),(2440,5,.7)],.085))
add('chirp',tone(.18,1420,2320,.066,.012,(1,.31),1.1,2.4,1))
add('whisper',mix((0,1,noise(.35,1450,6500,.16,.074)),(.14,.63,noise(.24,630,2550,.078,.048))))
add('breath',mix((0,1,noise(.37,290,2300,.18,.09)),(.105,.40,noise(.27,950,5100,.15,.05))))
add('yawn',throat(.57,185,103,[(650,2,1),(1110,4,.75),(1800,6,.28)],.09))

# Terrain, vegetation, projectiles, sand and minerals.
add('gravel',grains(9,.17,lambda i:mix((0,1,noise(.055,480,3900,.012)),(0,.35,tone(.05,500+39*i,210+i*11,.014)))))
add('sand',noise(.34,1450,7400,.13,.031,29))
add('rock',mix((0,1,noise(.10,220,2300,.024)),(0,.67,metal(142,.18,[(1,1),(1.48,.5),(2.65,.38)],.037))))
add('boulder',mix((0,.9,tone(.44,122,40,.14)),(0,1,noise(.24,140,1800,.067)),(.085,.43,noise(.33,80,1200,.1,flutter=18))))
add('quake',mix((0,1,noise(.72,36,290,.40,.075,11)),(.03,.6,tone(.65,75,44,.31,.015,(1,.35))),(.10,.38,noise(.48,230,1540,.23,.035,16))))
add('drill',mix((0,.76,tone(.34,138,305,.25,.025,(1,.40,.22),1.6,2,0,1)),(.018,.56,noise(.32,600,3900,.18,.025,41))))
add('bone',metal(397,.175,[(1,1),(1.65,.8),(2.73,.43),(4.04,.15)],.037))
add('wood',mix((0,1,metal(205,.21,[(1,1),(1.58,.78),(3.32,.48)],.043)),(0,.42,noise(.085,700,3400,.019))))
add('leaf',grains(5,.13,lambda i:noise(.067,1700+100*i,8100,.024,.010)))
add('branch',mix((0,.9,noise(.072,700,6600,.012)),(.018,1,metal(333,.16,[(1,1),(2.2,.5),(3.62,.3)],.026)),(.055,.34,noise(.10,1800,5200,.024))))
add('vine',mix((0,.58,tone(.17,190,530,.09,.025,(1,.45),.7)),(.053,.64,noise(.12,700,4600,.043,.023)),(.11,1,noise(.065,700,7300,.014))))
add('seed',mix((0,1,tone(.09,615,285,.025)),(.005,.52,noise(.045,900,3800,.009))))
add('pollen',grains(6,.20,lambda i:mix((0,1,noise(.075,3100,8800,.023,.012)),(0,.42,tone(.071,1520+95*i,1320+80*i,.020)))))
add('sprout',mix((0,1,tone(.23,250,690,.095,.015,(1,.32),.62)),(.062,.41,noise(.12,1350,5500,.048))))
add('root',mix((0,.67,noise(.32,140,780,.13,.035,16)),(.062,.85,noise(.18,460,3100,.045,flutter=38)),(.12,.35,tone(.19,176,81,.065))))
add('pebble',metal(524,.135,[(1,1),(1.76,.53),(2.9,.33)],.026))

# Water and ice: multiple pressures, droplet sizes, resonances and grains.
add('drop',tone(.165,1240,530,.041,.002,(1,.19),.52,1.58))
add('bubble',tone(.14,229,798,.055,.004,(1,.12),.53,1.8))
add('splash',mix((0,1,noise(.24,660,6100,.073,.006)),(.032,.55,grains(5,.105,lambda i:tone(.10,290+73*i,640+148*i,.028)))))
add('wave',mix((0,.82,noise(.66,80,1800,.32,.14)),(.16,1,noise(.53,760,6900,.19,.087)),(.24,.45,noise(.42,2600,9400,.19,.10))))
add('torrent',mix((0,1,noise(.51,190,2380,.30,.034,16)),(.018,.70,noise(.45,1300,6900,.22,.055))))
add('jet',mix((0,.9,noise(.32,570,4900,.18,.014)),(.012,.45,tone(.27,825,270,.14,.016,(1,.18),1.46)),(.053,.52,noise(.27,210,1590,.12,.04))))
add('rain',grains(16,.38,lambda i:mix((0,.55,noise(.055,1200,6800,.014)),(0,.4,tone(.059,960+(i*151)%860,460+i*7,.014)))))
add('ripple',mix((0,1,tone(.29,427,306,.11,.009,(1,.29))),(.052,.54,tone(.22,646,473,.071,.013))))
add('gulp',grains(2,.067,lambda i:tone(.12,275-i*60,123+i*33,.042,.006,(1,.32),.83,1.63)))
add('steam',mix((0,1,noise(.45,1960,10400,.21,.029)),(.04,.49,noise(.32,670,4000,.14,.024,37))))
add('frost',mix((0,.85,noise(.41,2300,8500,.19,.062)),(.037,.36,tone(.32,2210,1680,.145,.06,(1,.14),.38))))
add('snow',grains(7,.19,lambda i:noise(.094,720+i*82,6600,.027,.008)))
add('ice',metal(1145,.32,[(1,1),(1.44,.69),(2.77,.41),(4.33,.25)],.095))
add('shard',metal(1664,.22,[(1,1),(2.09,.45),(2.84,.66),(4.12,.28)],.056))
add('shatter',grains(9,.145,lambda i:metal(490+(i*479)%1800,.21,[(1,1),(1.49,.70),(2.73,.45)],.039)))
add('blizzard',mix((0,.84,noise(.58,520,4800,.28,.085,9)),(.035,.68,noise(.48,2500,9600,.24,.08)),(.1,.23,tone(.41,1470,770,.19,.07,(1,.2),.44))))

# Fire, explosions, electrical discharges and sustained energy.
add('ember',grains(5,.16,lambda i:noise(.044,1100+i*240,9100,.008)))
add('flame',mix((0,1,noise(.37,115,1900,.17,.025,14)),(.027,.74,noise(.27,925,5300,.12,.022,39))))
add('fireball',mix((0,.85,tone(.26,268,71,.091,.006,(1,.16),.51)),(.012,1,noise(.30,210,3400,.10,.03,19))))
add('inferno',mix((0,1,noise(.61,86,1800,.29,.09,8)),(.048,.78,noise(.51,460,4900,.23,.082,24)),(.095,.40,noise(.39,2600,9400,.14,.03,53))))
add('blast',mix((0,.86,noise(.095,780,8100,.018)),(.004,1,noise(.44,100,2110,.132)),(.012,.85,tone(.41,129,42,.115))))
add('boom',mix((0,1,tone(.60,110,38,.185)),(.012,.82,noise(.51,56,940,.19)),(.10,.33,noise(.39,170,1370,.15,.035))))
add('fuse',mix((0,.7,noise(.30,2400,8900,.18,.018,37)),(0,.24,tone(.26,480,740,.17,.03,(1,.2)))))
add('spark',grains(3,.029,lambda i:noise(.032,1400+800*i,10400,.005)))
add('arc',mix((0,1,noise(.18,510,7800,.052,flutter=93)),(.007,.65,tone(.16,255,87,.058,.002,(1,.32,.23),3.5,2.17))))
add('zap',tone(.18,1560,176,.068,.002,(1,.20),2.3,1.66))
add('static',grains(10,.20,lambda i:noise(.037,500+(i*383)%2300,9000,.006)))
add('coil',tone(.31,134,517,.23,.036,(1,.29,.17),2.4,2.06,0,1))
add('thundercrack',mix((0,1,noise(.13,430,9600,.021)),(.017,.82,noise(.27,160,4000,.069)),(.041,.70,tone(.25,136,52,.075))))
add('thunderroll',mix((0,1,noise(.91,42,590,.45,.041,6)),(.055,.47,tone(.75,83,40,.33)),(.19,.4,noise(.61,160,1450,.22,.095,10))))
add('plasma',mix((0,1,tone(.34,365,95,.135,.007,(1,.21),2.15,1.51,0,.5)),(.022,.41,noise(.28,800,5800,.11,.018))))
add('beam',mix((0,1,tone(.51,332,182,.34,.036,(1,.38,.20,.09),1.72,1.98,0,.44)),(.016,.48,tone(.47,501,273,.27,.04,(1,.29),1.22)),(.032,.27,noise(.43,850,5700,.23,.065))))
add('laser',tone(.27,2010,240,.093,.003,(1,.15),1.48,2.3))
add('ray',tone(.34,560,918,.19,.025,(1,.35,.08),.97,1.51,1))
add('charge',mix((0,1,tone(.49,98,732,.52,.18,(1,.32),1.45,2.01)),(.10,.48,noise(.36,1520,6400,.33,.20))))
add('core',tone(.41,90,61,.21,.018,(1,.50,.22),.46,2,.2,.38))

# Metal, mechanisms, traps, insects, toxins and sticky materials.
add('clang',metal(276,.52,[(1,1),(1.47,.83),(2.72,.59),(3.91,.36),(5.57,.28)],.16))
add('steel',metal(657,.31,[(1,1),(1.39,.65),(2.32,.47),(3.88,.31),(5.34,.16)],.080))
add('gong',metal(148,.75,[(1,1),(1.46,.52),(2.08,.71),(2.84,.47),(3.76,.24)],.31))
add('gear',grains(6,.185,lambda i:mix((0,1,noise(.055,700,3900,.010)),(0,.6,metal(465,.074,[(1,1),(2.67,.45)],.018)))))
add('coin',metal(1690,.30,[(1,1),(1.51,.73),(2.57,.38),(3.91,.23)],.091))
add('spring',tone(.27,295,655,.13,.003,(1,.24),3.8,1.12,1,1))
add('chain',grains(5,.14,lambda i:metal(610+83*i,.15,[(1,1),(1.36,.68),(2.87,.49)],.038)))
add('shield',mix((0,.60,noise(.085,420,3300,.016)),(.004,1,metal(254,.42,[(1,1),(1.51,.61),(2.33,.53),(3.56,.29)],.115))))
add('latch',mix((0,.80,noise(.055,570,3820,.011)),(.04,1,tone(.105,970,246,.027,.002,(1,.32)))))
add('string',tone(.37,405,395,.102,.002,(1,.46,.22,.15,.08),.19,1.82))
add('sting',tone(.14,1540,510,.045,.003,(1,.28),2.3,2.75))
add('buzz',tone(.34,184,217,.24,.025,(1,.4,.23,.13),3.25,2.02,1,1))
add('swarm',mix((0,1,tone(.51,158,239,.34,.08,(1,.42,.18),2.2,2,1,.7)),(.032,.75,tone(.45,218,168,.29,.063,(1,.38,.15),2.9,2.1,1)),(.07,.28,noise(.35,460,3000,.19,.06))))
add('silk',mix((0,1,tone(.21,950,367,.084,.016,(1,.3),.8)),(.01,.55,noise(.18,1600,7500,.072,.016))))
add('acid',mix((0,.8,noise(.28,1400,7800,.12,.014,46)),(.013,.58,grains(5,.15,lambda i:tone(.1,750+i*92,280+i*40,.027,.004,(1,.16))))))
add('ooze',tone(.27,126,292,.13,.012,(1,.39,.21),1.93,1.48,1,.4))
add('sludge',mix((0,.70,noise(.15,140,1760,.035)),(.008,1,tone(.26,340,84,.089,.003,(1,.33),1.71,1.64)),(.056,.54,grains(4,.12,lambda i:tone(.09,200+i*44,420,.029)))))
add('gas',mix((0,1,noise(.45,440,3150,.23,.065,10)),(.06,.5,noise(.32,2110,8150,.14,.04))))
add('drip',tone(.19,701,250,.054,.003,(1,.14),1.15,1.63))
add('siphon',mix((0,1,tone(.34,167,592,.25,.061,(1,.34),.62,1.51)),(.056,.40,noise(.27,550,3500,.18,.13))))

# Pitched and vocal colours. Musical note patterns are authored per move in the score.
add('haunt',mix((0,1,tone(.56,520,263,.28,.085,(1,.16),.63,1.47,1.8)),(.052,.39,tone(.48,397,197,.22,.09,(1,.20),.55,1.58,1.2))))
add('moan',throat(.52,234,138,[(421,3.8,1.4),(841,4.8,1.3),(1800,4,.8)],.082,5))
add('void',mix((0,1,tone(.49,125,48,.25,.028,(1,.38,.25),1.15,1.49)),(.018,.33,noise(.39,270,2210,.18,.08))))
add('portal',mix((0,1,tone(.37,261,920,.22,.036,(1,.21),2.35,1.41,1.1)),(.026,.63,tone(.33,987,262,.19,.04,(1,.13),1.2,1.65))))
add('pulse',tone(.25,273,118,.088,.008,(1,.21),.71,1.49))
add('mind',mix((0,1,tone(.40,438,472,.22,.033,(1,.13),1.58,1.52,1.1)),(.013,.41,tone(.33,649,626,.17,.045,(1,.16),.52))))
add('shimmer',metal(793,.56,[(1,1),(1.253,.52),(1.5,.63),(2.512,.38),(3.004,.30)],.22))
add('chime',metal(660,.49,[(1,1),(2.003,.50),(2.992,.23),(4.17,.13)],.17))
add('star',metal(1288,.29,[(1,1),(2.51,.4),(3.78,.23),(4.99,.19)],.089))
add('bell',metal(524,.68,[(1,1),(2.38,.64),(3.02,.40),(4.19,.28),(5.56,.17)],.255))
add('harp',tone(.40,392,389,.135,.003,(1,.52,.24,.11,.06)))
add('flute',mix((0,1,tone(.37,519,523,.23,.041,(1,.13,.08),.12,1.5,.43)),(0,.18,noise(.26,2000,7500,.11,.016))))
add('hum',throat(.42,198,202,[(400,3.5,1.7),(805,5,1),(1250,6,.5)],.055))
add('choir',mix((0,1,throat(.50,262,265,[(790,3,2),(1120,4,1.3),(2220,4,.7)],.066)),(.023,.61,throat(.45,329,332,[(840,3.5,1.5),(1250,4,1),(2050,4,.3)],.075))))
add('drum',mix((0,1,tone(.24,232,106,.073,.003,(1,.38,.12))),(.003,.48,noise(.15,180,2390,.028))))
add('taiko',mix((0,1,tone(.40,153,64,.132,.005,(1,.35,.18))),(.012,.58,metal(211,.21,[(1,1),(1.51,.48)],.065)),(0,.37,noise(.11,400,2650,.023))))
add('rattle',grains(7,.19,lambda i:noise(.045,800+(i%3)*500,7400,.010)))
add('whistle',tone(.34,1220,1740,.22,.032,(1,.09),.15,1.9,.72))
add('horn',throat(.43,184,193,[(440,3.3,1.2),(908,4.7,1.6),(1540,5,.9)],.033))
add('choop',tone(.135,450,195,.048,.005,(1,.29),1.38,1.79))
add('ping',tone(.22,1025,1023,.066,.003,(1,.23),.42,2.52))
add('scan',tone(.26,596,1120,.21,.013,(1,.15),.87,2,0,1))
add('digital',grains(4,.105,lambda i:tone(.055,415*(1.17**i),414*(1.17**i),.025,.002,(1,.26,.13))))
add('sweep',mix((0,1,tone(.34,1370,244,.16,.025,(1,.19),.70,1.99)),(.036,.33,noise(.23,1790,7380,.08,.032))))
add('tick',mix((0,1,metal(796,.073,[(1,1),(1.9,.6),(3.1,.25)],.011)),(.002,.46,noise(.032,1300,5200,.006))))
add('kiss',mix((0,.65,noise(.079,800,3700,.048,.029)),(.039,1,tone(.102,735,340,.024,.002,(1,.25)))))
add('snip',mix((0,1,noise(.06,2400,8800,.013)),(.027,.78,metal(874,.09,[(1,1),(1.66,.69)],.024))))
add('plink',metal(934,.20,[(1,1),(2.018,.41),(3.21,.24)],.056))
add('heartbeat',mix((0,1,tone(.14,122,64,.046)),(.085,.62,tone(.14,109,67,.040))))
add('cloth',mix((0,1,noise(.21,530,3600,.077,.032)),(.055,.49,noise(.17,1620,6900,.06,.025))))
add('whorl',mix((0,1,tone(.36,377,452,.23,.033,(1,.22),1.57,1.46,.9,.8)),(.024,.4,noise(.30,400,2700,.13,.05,16))))
add('crystal',metal(816,.47,[(1,1),(1.334,.51),(2.51,.34),(3.88,.23)],.175))
add('drone',mix((0,1,tone(.53,156,132,.35,.065,(1,.31,.19),.36)),(.015,.49,tone(.45,237,206,.29,.065,(1,.18),.44))))
add('gonglet',metal(441,.34,[(1,1),(1.489,.57),(2.15,.36),(3.57,.16)],.107))
add('bounce',tone(.195,153,633,.080,.004,(1,.26),1.05,1.19))
add('pop',tone(.075,780,152,.018,.002,(1,.25),.66,1.53))
add('snare',mix((0,.72,tone(.16,234,152,.040)),(0,1,noise(.19,620,7400,.050))))
add('hiss',noise(.28,2490,9800,.115,.010))
add('wing',mix((0,.5,noise(.15,260,2650,.07,.038)),(.045,.85,noise(.13,1240,6600,.046,.020))))
add('flint',mix((0,1,noise(.07,1200,6000,.011)),(.012,.50,metal(810,.15,[(1,1),(1.82,.58),(3.15,.33)],.031))))
add('pad',tone(.48,262,261,.33,.077,(1,.26,.10),.31,2,.36))
add('sonar',mix((0,1,tone(.30,906,874,.105,.008)),(.078,.32,tone(.25,906,874,.084,.015))))
add('whirr',mix((0,.74,tone(.30,269,562,.20,.032,(1,.38,.21),.52,1.99,0,.7)),(.02,.50,noise(.25,760,4200,.14,.041,63))))

add('flare',mix((0,.7,noise(.16,980,7700,.038,.013)),(.016,1,tone(.32,184,345,.18,.037,(1,.37),1.17)),(.063,.64,noise(.28,150,2240,.13,.05))))
add('blossom',mix((0,.68,noise(.13,1800,7400,.045,.017)),(.021,1,metal(822,.27,[(1,1),(1.26,.62),(2.51,.27)],.09))))
add('thorn',mix((0,1,metal(653,.095,[(1,1),(2.39,.51)],.018)),(.015,.7,noise(.06,1400,7800,.012))))
add('hoof',mix((0,1,metal(188,.18,[(1,1),(1.53,.8),(2.39,.42)],.037)),(.032,.70,noise(.14,150,1730,.034))))
add('shell',mix((0,1,metal(482,.21,[(1,1),(1.57,.72),(3.73,.41)],.040)),(.023,.59,noise(.12,810,4950,.029))))
add('slash',mix((0,1,noise(.205,840,6220,.061,.033)),(.043,.65,noise(.14,3000,10200,.032)),(.062,.34,tone(.13,950,255,.045))))
add('metalBend',mix((0,1,tone(.35,623,347,.20,.039,(1,.32),2.65,1.43,1.3)),(.055,.46,noise(.26,480,3650,.13,.043,35))))
add('toneOff',tone(.195,868,179,.081,.008,(1,.31),.65,2))
add('flake',grains(4,.17,lambda i:mix((0,1,noise(.065,2800,8050,.020,.012)),(0,.5,tone(.097,1725+i*93,1660+i*79,.025)))))
add('sparkle',grains(4,.135,lambda i:metal(1250*2**(i/5),.145,[(1,1),(2.51,.45)],.034)))

out = Path(__file__).resolve().parents[1] / 'assets' / 'arena-sound-bank.js'
with out.open('w', encoding='utf-8', newline='\n') as f:
    f.write('// Original battle foley. Regenerate with scripts/build-arena-sound-bank.py.\n')
    f.write("globalThis.ArenaSoundBank={sampleRate:24000,clips:{\n")
    for name, data in bank.items():
        f.write('  '+name+':'+json.dumps(data)+',\n')
    f.write('}};\n')
print(f'{len(bank)} mono instruments, {out.stat().st_size:,} bytes')
