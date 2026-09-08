const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function storageArea(data = {}) {
  return {
    data,
    async get(keys) {
      if (keys === null) return structuredClone(data);
      if (typeof keys === 'string') return { [keys]: structuredClone(data[keys]) };
      return structuredClone({ ...keys, ...Object.fromEntries(Object.keys(keys).filter(k => k in data).map(k => [k, data[k]])) });
    },
    async set(values) { Object.assign(data, structuredClone(values)); },
    async remove(keys) { for (const key of Array.isArray(keys) ? keys : [keys]) delete data[key]; }
  };
}
function environment(local = storageArea(), sync = storageArea()) {
  const noop = () => {};
  const context = vm.createContext({ URL, URLSearchParams, TextDecoder, AbortController, Response, ReadableStream, console: {warn:noop,error:noop}, setTimeout, clearTimeout,
    chrome: { storage: { local, sync }, runtime: { onMessage: {addListener:noop}, onInstalled:{addListener:noop}, onStartup:{addListener:noop} }, action:{onClicked:{addListener:noop}}, contextMenus:{onClicked:{addListener:noop}} } });
  context.importScripts = (...files) => files.forEach(file => vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'), context, {filename:file}));
  context.importScripts('background.js');
  return context;
}
const tests=[];
const test=(name,run)=>tests.push({name,run});
const rss=(title='Titular de prueba', link='https://news.test/a')=>`<rss version="2.0"><channel><item><title>${title}</title><link>${link}</link><description><![CDATA[<p>Resumen</p><img src="/photo.jpg">]]></description></item></channel></rss>`;
const feed={id:'test',name:'Medio',url:'https://news.test/rss',enabled:true};
test('Sintaxis de todo el JavaScript propio',()=>{for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});});
test('Atom: atributos invertidos, namespaces, entidades y xml:base',()=>{
 const e=environment();const [item]=e.parseFeedXml('<a:feed xmlns:a="http://www.w3.org/2005/Atom" xml:base="https://news.test/"><a:entry><a:title>Hola &#x1F600;</a:title><a:link href="/api" rel="self"/><a:link href="story?a=1&amp;b=2" rel="alternate"/><a:category term="Economía"/></a:entry></a:feed>');
 assert.equal(item.link,'https://news.test/story?a=1&b=2');assert.equal(item.title,'Hola 😀');assert.equal(item.category,'Economía');assert.equal(item.imageUrl,'');
});
test('RSS: CDATA, resumen sin HTML e imagen relativa',()=>{
 const [item]=environment().parseFeedXml(rss(),'https://news.test/rss');assert.equal(item.description,'Resumen');assert.equal(item.imageUrl,'https://news.test/photo.jpg');
});
test('XML inválido y DTD rechazados',()=>{const e=environment();assert.throws(()=>e.parseFeedXml('<rss><item></rss>'));assert.throws(()=>e.parseFeedXml('<!DOCTYPE rss><rss/>'));});
test('No acepta enlaces ejecutables ni credenciales; conserva query y mayúsculas',()=>{const e=environment();assert.equal(e.BarRSS.httpUrl('javascript:alert(1)'), '');assert.equal(e.BarRSS.httpUrl('https://u:p@news.test'), '');assert.notEqual(e.BarRSS.normalizeFeedUrl('https://news.test/feed?a=1'),e.BarRSS.normalizeFeedUrl('https://news.test/feed?a=2'));assert.notEqual(e.BarRSS.normalizeFeedUrl('https://news.test/A'),e.BarRSS.normalizeFeedUrl('https://news.test/a'));assert.equal(e.parseFeedXml(rss('Ataque','javascript:alert(1)')).length,0);});
test('Migración conserva canales y selección vacía',async()=>{const sync=storageArea({feeds:[feed]});const local=storageArea();const e=environment(local,sync);const migrated=await e.BarRSSSettings.get({feeds:[]});assert.equal(migrated.feeds[0].url,feed.url);await e.BarRSSSettings.set({feeds:[],enabled:false});assert.equal((await e.BarRSSSettings.get({feeds:null})).feeds.length,0);assert.equal(sync.data.feeds,undefined);});
test('Catálogo grande se guarda localmente, preferencias se sincronizan',async()=>{const e=environment();await e.BarRSSSettings.set({feeds:e.ALL_PRESET_FEEDS,enabled:true});assert.ok(JSON.stringify(e.chrome.storage.local.data.feeds).length>8192);assert.equal(e.chrome.storage.sync.data.feeds,undefined);assert.equal(e.chrome.storage.sync.data.enabled,true);});
test('Migraciones de URL preservan fuente y feeds temáticos',()=>{const e=environment();assert.equal(e.getCanonicalFeedUrl('https://www.pagina12.com.ar/rss/portada.xml'),'https://www.pagina12.com.ar/rss/portada');assert.equal(e.getCanonicalFeedUrl('https://www.infobae.com/rss/economia/'),'https://www.infobae.com/rss/economia/');});
test('Caché sobrevive reinicio del worker y permite lectura sin red',async()=>{const local=storageArea();const e=environment(local);e.fetch=async()=>new Response(rss());await e.fetchSingleFeedData(feed,true);const restarted=environment(local);restarted.fetch=async()=>{throw new Error('Sin red')};const stale=await restarted.fetchSingleFeedData({...feed,name:'Nuevo nombre'},true);assert.equal(stale.state,'stale');assert.equal(stale.items[0].feedName,'Nuevo nombre');await restarted.clearFeedCache();assert.equal(Object.keys(local.data).length,0);});
test('Pedidos simultáneos comparten descarga, sin mezclar metadatos',async()=>{const e=environment();let calls=0;e.fetch=async()=>{calls++;await new Promise(r=>setTimeout(r,10));return new Response(rss());};const [a,b]=await Promise.all([e.fetchSingleFeedData(feed),e.fetchSingleFeedData({...feed,name:'Segundo'})]);assert.equal(calls,1);assert.equal(a.items[0].feedName,'Medio');assert.equal(b.items[0].feedName,'Segundo');});
test('Resultados parciales incluyen estado por canal',async()=>{const e=environment();e.fetch=async url=>{if(url.includes('bad'))throw new Error('HTTP 500');return new Response(rss());};const result=await e.handleFetchMultipleRss([feed,{...feed,url:'https://bad.test/rss'}]);assert.equal(result.success,true);assert.equal(result.activeFeedsCount,1);assert.equal(result.feedStatuses[1].state,'error');});
test('Badge cuenta solo noticias posteriores a la primera carga y se limpia al abrir',async()=>{
 const e=environment();const badge=[];
 e.chrome.action.setBadgeText=async({text})=>badge.push(text);
 e.chrome.action.setBadgeBackgroundColor=async()=>{};
 e.chrome.action.setTitle=async()=>{};
 e.fetch=async()=>new Response(rss('Primera noticia','https://news.test/1'));
 await e.handleFetchMultipleRss([feed],true);
 assert.equal(badge.at(-1),'');
 e.fetch=async()=>new Response(rss('Nueva noticia','https://news.test/2'));
 await e.handleFetchMultipleRss([feed],true);
 assert.equal(badge.at(-1),'1');
 await e.markAllNewsAsSeen();
 assert.equal(badge.at(-1),'');
});
test('Todos los canales fallidos conservan diagnósticos',async()=>{const e=environment();e.fetch=async()=>{throw new Error('Sin red')};const result=await e.handleFetchMultipleRss([feed]);assert.equal(result.success,false);assert.equal(result.feedStatuses.length,1);});
test('Timeout cubre el cuerpo tras recibir cabeceras',async()=>{const e=environment();e.setTimeout=(fn)=>setTimeout(fn,15);e.fetch=async(_url,{signal})=>new Response(new ReadableStream({start(controller){signal.addEventListener('abort',()=>controller.error(new DOMException('aborted','AbortError')));}}));await assert.rejects(e.fetchSingleFeedData(feed,true),/8 segundos/);});
test('Descargas limitadas a seis en paralelo',async()=>{const e=environment();let active=0,max=0;e.fetch=async()=>{active++;max=Math.max(max,active);await new Promise(r=>setTimeout(r,5));active--;return new Response(rss());};await e.handleFetchMultipleRss(Array.from({length:20},(_,i)=>({...feed,url:`https://news.test/${i}`})));assert.equal(max,6);});
test('Feed demasiado grande rechazado',async()=>{const e=environment();e.fetch=async()=>new Response('x',{headers:{'content-length':String(3*1024*1024)}});await assert.rejects(e.fetchSingleFeedData(feed),/2 MB/);});
test('Filtro por país no incorpora otros países guardados',()=>{const e=environment();const source=fs.readFileSync(path.join(root,'reader.js'),'utf8');vm.runInContext(source.slice(source.indexOf('function mergeMemoryWithPresets('),source.indexOf('async function handleFeedToggle(')),e);e.drawerFeedsMemory=e.getDefaultFeedsForCountry('Argentina');assert.ok(e.mergeMemoryWithPresets(e.ALL_PRESET_FEEDS.filter(f=>f.country==='Brasil')).every(f=>f.country==='Brasil'));});
(async()=>{let failed=0;for(const {name,run}of tests){try{await run();console.log('PASS',name)}catch(error){failed++;console.error('FAIL',name,error)}}console.log(`${tests.length-failed}/${tests.length} pruebas aprobadas`);process.exitCode=failed?1:0;})();
