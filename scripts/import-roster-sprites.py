"""Bundle PMDCollab directional sheets and offline fallback icons for roster 69."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import defaultdict
from PIL import Image
import json, re, urllib.request, urllib.error, xml.etree.ElementTree as ET, hashlib, io

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path('/tmp/poke69-sprites'); CACHE.mkdir(exist_ok=True)
BASE = 'https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/'
manifest = json.loads((ROOT/'assets/roster-expansion.json').read_text())
tracker_path = Path('/tmp/poke-pmd-current-tracker.json')
if not tracker_path.exists():
    with urllib.request.urlopen(BASE+'tracker.json',timeout=40) as response: tracker_path.write_bytes(response.read())
tracker = json.loads(tracker_path.read_text())
source = (ROOT/'index.html').read_text()
pmd = json.loads(re.search(r'^const pmdData=(.+);$',source,re.M)[1])
variants_path = ROOT/'assets/variant-sprites.js'
variants = json.loads(variants_path.read_text().split('=',1)[1].strip().rstrip(';'))
names = list(dict.fromkeys(pmd['names']+['SpAttack']))
selected = set(names)
def fetch(url, key, optional=False):
    path = CACHE/key.replace('/','_')
    if path.exists():return path.read_bytes()
    try:
        with urllib.request.urlopen(url,timeout=30) as response: raw=response.read()
        path.write_bytes(raw);return raw
    except urllib.error.HTTPError as error:
        if optional and error.code == 404:return None
        raise
def sprite_path(entry):
    path = str(entry['dex']).zfill(4);row=tracker[path]
    if entry['region']:
        if entry['slug']=='basculin-white-striped': wanted='White'
        elif entry['dex']==128: wanted='Paldea_Blaze' if 'blaze' in entry['slug'] else 'Paldea_Aqua' if 'aqua' in entry['slug'] else 'Paldea'
        else:wanted=entry['region'].title()
        found=next(((key,child) for key,child in row.get('subgroups',{}).items() if child['name']==wanted),None)
        if not found:return None,None
        key,row=found;path+='/'+key
    return path,row
def extract(entry, shiny=False):
    path,row=sprite_path(entry)
    if not path:return None
    if shiny:
        # Root species use a default-form node; regional forms store shinies directly.
        root=row if entry['region'] else row.get('subgroups',{}).get('0000',{})
        row=root.get('subgroups',{}).get('0001',{})
        path+=('/0001' if entry['region'] else '/0000/0001')
    if not row.get('sprite_files'):return None
    raw=fetch(BASE+'sprite/'+path+'/AnimData.xml',path+'_AnimData.xml',True)
    if not raw:return None
    xml=ET.fromstring(raw);animations={a.findtext('Name'):a for a in xml.findall('./Anims/Anim')}
    result={};images={};unique={};frames=[]
    def motion(name,seen=()):
        if name not in animations or name in seen:return None
        a=animations[name];copy=a.findtext('CopyOf')
        if copy:return motion(copy,(*seen,name))
        w,h=int(a.findtext('FrameWidth')),int(a.findtext('FrameHeight'))
        durations=[int(d.text) for d in a.findall('./Durations/Duration')]
        if name not in images:
            png=fetch(BASE+'sprite/'+path+'/'+name+'-Anim.png',path+'_'+name+'-Anim.png')
            images[name]=Image.open(io.BytesIO(png)).convert('RGBA')
        image=images[name];directions=[]
        for direction in range(8):
            if direction*h>=image.height:directions.append(None);continue
            output=[]
            for i,ticks in enumerate(durations):
                if (i+1)*w>image.width:break
                cell=image.crop((i*w,direction*h,(i+1)*w,(direction+1)*h));box=cell.getbbox()
                if not box:continue
                sprite=cell.crop(box);key=(sprite.size,hashlib.sha256(sprite.tobytes()).digest())
                if key not in unique:unique[key]=len(frames);frames.append(sprite)
                output.append([unique[key],box[0]-w//2,box[1]-h//2,max(1,ticks)])
            directions.append(output or None)
        return directions
    for name in names:
        if name in animations:
            result[name]=motion(name)
    if not result:return None
    credits=fetch(BASE+'sprite/'+path+'/credits.txt',path+'_credits.txt',True)
    return {'entry':entry,'key':path.replace('/','-'),'shiny':shiny,'motions':result,'frames':frames,
            'credits':credits.decode().strip() if credits else '', 'source':BASE+'sprite/'+path+'/'}

tasks=[]
for entry in manifest['species']:
    tasks.append((entry,False))
    if entry['region']:tasks.append((entry,True))
results=[]
with ThreadPoolExecutor(max_workers=32) as pool:
    futures={pool.submit(extract,*task):task for task in tasks}
    for future in as_completed(futures):
        value=future.result()
        if value:results.append(value)
print('Downloaded',len(results),'base/regional/shiny animation sets.',flush=True)

# Shelf-pack new frames without moving any existing atlas rectangle.
pmd['pages']=pmd['pages'][:18];pmd['rects']=pmd['rects'][:56620];pmd['names']=names
page_size=1536;pages=[];image=Image.new('RGBA',(page_size,page_size));x=y=row_height=0;dedup={}
def pack(sprite):
    global image,x,y,row_height
    key=(sprite.size,hashlib.sha256(sprite.tobytes()).digest())
    if key in dedup:return dedup[key]
    w,h=sprite.size
    if x+w>page_size:x=0;y+=row_height+1;row_height=0
    if y+h>page_size:pages.append(image);image=Image.new('RGBA',(page_size,page_size));x=y=row_height=0
    rectangle=[18+len(pages),x,y,w,h];image.alpha_composite(sprite,(x,y));x+=w+1;row_height=max(row_height,h)
    dedup[key]=len(pmd['rects']);pmd['rects'].append(rectangle);return dedup[key]
credits=[]
for result in sorted(results,key=lambda r:(r['entry']['id'],r['shiny'])):
    ids={i:pack(frame) for i,frame in enumerate(result['frames'])}
    motions={name:[[[ids[rect],x,y,t] for rect,x,y,t in row] if row else None for row in directions] for name,directions in result['motions'].items()}
    entry=result['entry'];id=str(entry['id'])
    if result['shiny']:
        # Numeric page references use the same global atlas loader in variants.
        variants['entries'][result['key']]=[pmd['rects'],motions]
        variants['forms'].setdefault(id,{'mega':{}})['shiny']=result['key']
    else:
        pmd['motions'][id]={str(names.index(name)):directions for name,directions in motions.items()}
        pmd.setdefault('paths',{})[id]=result['source'].split('/sprite/')[1].rstrip('/')
        pmd['credits'][id]=list(dict.fromkeys(line.split('\t')[1] for line in result['credits'].splitlines() if '\t' in line))
    credits.append({'name':entry['name'],'shiny':result['shiny'],'source':result['source'],'record':result['credits']})
pages.append(image)
for i,page in enumerate(pages):
    file=f'sprite-expansion-{i:02}.webp';page.save(ROOT/'assets'/file,'WEBP',lossless=True,method=6)
    pmd['pages'].append('./assets/'+file)
# Keep only the referenced rectangles in each new shiny entry.
for result in results:
    if not result['shiny']:continue
    entry=variants['entries'][result['key']];used=sorted({frame[0] for directions in entry[1].values() for row in directions if row for frame in row});mapping={old:i for i,old in enumerate(used)}
    entry[0]=[pmd['rects'][i] for i in used]
    entry[1]={name:[[[mapping[rect],x,y,t] for rect,x,y,t in row] if row else None for row in directions] for name,directions in entry[1].items()}

# A bundled, deterministic fallback exists even when no PMD sheet is ready.
bounds=json.loads(re.search(r'^const iconBounds\s*=\s*(.+);$',source,re.M)[1]);sheet=Image.open(ROOT/'assets/pokemon-icons.png').convert('RGBA')
def icon(entry):
    url='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+str(entry['api'])+'.png'
    raw=fetch(url,'icon-'+str(entry['api'])+'.png')
    image=Image.open(io.BytesIO(raw)).convert('RGBA');box=image.getbbox();image=image.crop(box)
    image.thumbnail((38,28),Image.Resampling.NEAREST)
    return entry,image
with ThreadPoolExecutor(max_workers=24) as pool:
    for entry,icon_image in pool.map(icon,manifest['species']):
        i=entry['id'];left=(40-icon_image.width)//2;top=(30-icon_image.height)//2
        sx=i%12*40;sy=i//12*30
        sheet.paste((0,0,0,0),(sx,sy,sx+40,sy+30));sheet.alpha_composite(icon_image,(sx+left,sy+top))
        bounds[i-1]=[left,top,icon_image.width,icon_image.height]
sheet.save(ROOT/'assets/pokemon-icons.png',optimize=True)
for name,value in [('pmdData',pmd),('iconBounds',bounds)]:
    source=re.sub(r'^const '+name+r'\s*=\s*.+;$',lambda _:'const '+name+'='+json.dumps(value,separators=(',',':'))+';',source,count=1,flags=re.M)
(ROOT/'index.html').write_text(source)
variants_path.write_text('const pmdVariants = '+json.dumps(variants,separators=(',',':'))+';\n')
(ROOT/'assets/roster-sprite-credits.json').write_text(json.dumps({'repository':BASE,'licenses':BASE+'LICENSE.md','fallback':'https://github.com/PokeAPI/sprites','credits':credits},ensure_ascii=False,indent=2)+'\n')
print('Bundled',len(pages),'new atlases;',len(manifest['species']),'fallback icons.',flush=True)
