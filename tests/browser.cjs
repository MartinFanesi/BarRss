/* Integration tests: actual MV3 worker/storage/CSP, deterministic RSS responses. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '..');
const feed = { id:'fixture',name:'Canal de prueba',url:'https://fixture.test/rss',country:'Argentina',category:'General',enabled:true,isCustom:true };
(async()=>{
 const context = await chromium.launchPersistentContext('', {channel:'chromium',headless:true,viewport:{width:1280,height:900},args:[`--disable-extensions-except=${root}`,`--load-extension=${root}`]});
 const errors=[];const passed=[];
 const check=async(name,fn)=>{await fn();passed.push(name);console.log('PASS',name);};
 try {
  const worker=context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  await worker.evaluate(async feed=>{
   await chrome.storage.sync.clear();await chrome.storage.local.clear();
   await chrome.storage.sync.set({onboardingSeen:true,userCountry:'Argentina',enabled:false,feeds:[feed]});
   globalThis.testOffline=false;
   globalThis.fetch=async url=>{
    if(globalThis.testOffline || url.includes('broken.test'))throw new Error('Sin conexión de prueba');
    return new Response(`<rss version="2.0"><channel>${Array.from({length:12},(_,i)=>`<item><title>Noticia de prueba ${i+1}</title><link>https://fixture.test/noticia/${i+1}</link><description><![CDATA[Resumen de la noticia ${i+1}. <img src="https://fixture.test/missing.jpg">]]></description><category>General</category></item>`).join('')}</channel></rss>`);
   };
  },feed);
  await context.route(/^https?:/,route=>route.fulfill({status:404,body:''}));
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error'&&/Content Security Policy|Refused to execute/.test(msg.text()))errors.push(msg.text());});
  const base=worker.url().split('/').slice(0,3).join('/');
  await page.goto(base+'/reader.html');
  await check('Lector carga noticias mediante worker real',async()=>{await page.locator('.hero-title').waitFor();assert.match(await page.locator('.hero-title').innerText(),/Noticia de prueba/);});
  await check('Migración real de storage.sync a local conserva canal',async()=>{assert.equal(await worker.evaluate(async()=> (await chrome.storage.local.get('feeds')).feeds[0].name),'Canal de prueba');});
  await check('Badge rojo muestra nuevas noticias y se limpia al abrir el lector',async()=>{
   const text=await worker.evaluate(async()=>{
    await updateNewsBadge([{link:'https://fixture.test/novedad-1'}],false);
    return chrome.action.getBadgeText({});
   });
   assert.equal(text,'1');
   await page.evaluate(()=>loadNewspaperStories(false));
   assert.equal(await worker.evaluate(()=>chrome.action.getBadgeText({})),'');
  });
  await check('Marcar leída, ocultar y recuperar',async()=>{
   await page.locator('.hero-story-card .btn-read-state').click();
   assert.match(await page.locator('.hero-story-card .btn-read-state').innerText(),/Leída/);
   await page.locator('#hideReadStories').check();assert.doesNotMatch(await page.locator('.hero-title').innerText(),/prueba 1$/);
   await page.locator('#hideReadStories').uncheck();assert.match(await page.locator('.hero-title').innerText(),/prueba 1$/);
  });
  await check('Favoritos conserva noticia y estado de lectura tras recarga',async()=>{
   await page.locator('.hero-story-card .btn-bookmark:not(.btn-read-state)').click();
   await page.reload();await page.locator('.hero-title').waitFor();assert.match(await page.locator('.hero-story-card .btn-read-state').innerText(),/Leída/);
   await page.locator('#catPillSaved').click();assert.match(await page.locator('.hero-title').innerText(),/prueba 1$/);
   await page.locator('[data-cat="all"]').click();
  });
  await check('Búsqueda filtra titulares',async()=>{await page.locator('#searchInput').fill('prueba 12');assert.match(await page.locator('.hero-title').innerText(),/prueba 12$/);await page.locator('#searchInput').fill('');});
  await check('Imágenes rotas tienen fallback sin handlers inline',async()=>{await page.waitForFunction(()=>document.querySelector('.hero-image-wrapper img')?.hidden);assert.equal(await page.locator('[onerror]').count(),0);});
  await check('Caché persistente y estado visible cuando falla la red',async()=>{
   await worker.evaluate(()=>{globalThis.testOffline=true;});await page.evaluate(()=>loadNewspaperStories(true));
   await page.locator('#feedStatusSummary').click();assert.match(await page.locator('#feedStatusList').innerText(),/Mostrando copia guardada/);
  });
  await check('Reintento de un canal recupera estado disponible',async()=>{await worker.evaluate(()=>{globalThis.testOffline=false;});await page.getByRole('button',{name:'Reintentar',exact:true}).click();await page.waitForFunction(()=>document.getElementById('feedStatusList').textContent.includes('Disponible'));});
  fs.mkdirSync(path.join(root,'reports'),{recursive:true});await page.screenshot({path:path.join(root,'reports','reader-1.3.0.png'),fullPage:true,animations:'disabled'});
  await check('Desactivar todos no reactiva canales',async()=>{await page.evaluate(()=>BarRSSSettings.set({feeds:[]}));await page.getByText('No hay canales activos',{exact:true}).waitFor();assert.equal(await worker.evaluate(async()=> (await chrome.storage.local.get('feeds')).feeds.length),0);});
  await check('Favoritos siguen accesibles sin canales activos',async()=>{await page.locator('#catPillSaved').click();await page.locator('.hero-title').waitFor();});
  await page.evaluate(feed=>BarRSSSettings.set({feeds:[feed]}),feed);
  await check('Selección por país y acción masiva persisten una sola lista',async()=>{
   await page.evaluate(()=>openSettingsDrawer());await page.locator('.country-pill-btn').filter({hasText:'Brasil'}).click();
   assert.equal(await page.evaluate(()=>[...document.querySelectorAll('.drawer-feed-checkbox')].some(c=>c.dataset.url==='https://fixture.test/rss')),false);
   await page.evaluate(()=>toggleCountryFeeds(true));const stored=await worker.evaluate(async()=> (await chrome.storage.local.get('feeds')).feeds);
   assert.ok(stored.some(f=>f.country==='Brasil'&&f.enabled));assert.ok(stored.some(f=>f.id==='fixture'));await page.evaluate(()=>closeSettingsDrawer());
  });
  await page.evaluate(feed=>BarRSSSettings.set({feeds:[feed]}),feed);
  await check('Configuración conserva canales del lector',async()=>{const popup=await context.newPage();popup.on('pageerror',e=>errors.push(e.message));await popup.goto(base+'/popup.html');await popup.getByText('Canal de prueba',{exact:true}).waitFor();await popup.close();});
  await check('Panel lateral carga y ticker vacío no muestra noticias anteriores',async()=>{
   const panel=await context.newPage();panel.on('pageerror',e=>errors.push(e.message));await panel.goto(base+'/sidepanel.html');await panel.locator('.news-card').first().waitFor();await panel.locator('#btnViewTicker').click();await panel.locator('#searchInput').fill('sin coincidencias xyz');assert.equal(await panel.locator('#tickerVerticalTrack .news-card').count(),0);await panel.close();
  });
  await check('Exportación OPML escapa ampersands y genera XML válido',async()=>{
   await page.evaluate(feed=>{drawerFeedsMemory=[{...feed,name:'Noticias & ciencia',url:'https://fixture.test/rss?a=1&b=2'}];},feed);
   const downloadPromise=page.waitForEvent('download');await page.evaluate(()=>handleExportOpml());const download=await downloadPromise;
   const xml=fs.readFileSync(await download.path(),'utf8');assert.match(xml,/Noticias &amp; ciencia/);assert.match(xml,/a=1&amp;b=2/);
   assert.equal(await page.evaluate(xml=>new DOMParser().parseFromString(xml,'text/xml').querySelector('parsererror')===null,xml),true);
  });
  await check('Importación OPML conserva dos feeds con distinta query',async()=>{
   await page.evaluate(()=>{drawerFeedsMemory=[];});
   await page.locator('#drawerImportOpmlInput').setInputFiles({name:'feeds.opml',mimeType:'text/xml',buffer:Buffer.from('<opml version="2.0"><body><outline text="Uno" xmlUrl="https://fixture.test/feed?channel=1"/><outline text="Dos" xmlUrl="https://fixture.test/feed?channel=2"/></body></opml>')});
   await page.waitForFunction(async()=> (await chrome.storage.local.get('feeds')).feeds.length===2);
   await page.evaluate(feed=>BarRSSSettings.set({feeds:[feed]}),feed);
  });
  await check('Cambios de lectura se actualizan entre ventanas',async()=>{
   const other=await context.newPage();await other.goto(base+'/reader.html');await other.locator('.hero-title').waitFor();
   await page.evaluate(()=>setStoryRead('https://fixture.test/noticia/1',false));
   await other.waitForFunction(()=>document.querySelector('.hero-story-card .btn-read-state')?.getAttribute('aria-pressed')==='false');
   await page.evaluate(()=>setStoryRead('https://fixture.test/noticia/1',true));
   await other.waitForFunction(()=>document.querySelector('.hero-story-card .btn-read-state')?.getAttribute('aria-pressed')==='true');await other.close();
  });
  await check('Barra flotante carga noticias y respeta apagado',async()=>{
   await page.evaluate(()=>BarRSSSettings.set({enabled:true,rssDiscoveryEnabled:false}));
   await context.route('https://content.fixture.test/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html><body><h1>Sitio de prueba</h1></body></html>'}));
   const site=await context.newPage();site.on('pageerror',e=>errors.push(e.message));await site.goto('https://content.fixture.test/');
   await site.locator('#barrss-root-host .barrss-link').first().waitFor();
   await page.evaluate(()=>BarRSSSettings.set({enabled:false}));await site.locator('#barrss-root-host').waitFor({state:'detached'});await site.close();
  });
  await check('Sin excepciones JavaScript ni infracciones CSP',async()=>assert.deepEqual(errors,[]));
  console.log(`${passed.length}/${passed.length} pruebas de navegador aprobadas`);
  fs.writeFileSync(path.join(root,'reports','browser-results.json'),JSON.stringify({passed,errors,browser:context.browser()?.version(),date:new Date().toISOString()},null,2));
 } finally {await context.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
