/* XML parsed by vendored sax-js 1.6.1; no remote code or external entities. */
function parseFeedXml(xml, baseUrl) {
  if (!xml) return [];
  const parser = sax.parser(true, { xmlns: true });
  const root = { children: [], text: '', base: baseUrl };
  const stack = [root];
  parser.ondoctype = () => { throw new Error('El feed contiene un DOCTYPE no admitido.'); };
  parser.onopentag = tag => {
    if (stack.length > 64) throw new Error('XML demasiado profundo.');
    const parent = stack[stack.length - 1];
    const attrs = Object.fromEntries(Object.values(tag.attributes).map(a => [a.name, a.value]));
    const node = { name: tag.local, uri: tag.uri, attrs, children: [], text: '',
      base: BarRSS.httpUrl(attrs['xml:base'], parent.base) || parent.base };
    parent.children.push(node);
    stack.push(node);
  };
  parser.ontext = parser.oncdata = text => { stack[stack.length - 1].text += text; };
  parser.onclosetag = () => {
    const node = stack.pop();
    stack[stack.length - 1].text += ' ' + node.text;
  };
  parser.write(xml).close();
  const entries = [];
  function walk(node) {
    if (node.name === 'item' || node.name === 'entry') entries.push(node);
    else node.children.forEach(walk);
  }
  walk(root);
  return entries.slice(0, 30).map(node => {
    const child = (...names) => node.children.find(n => names.includes(n.name));
    const atom = node.name === 'entry';
    const links = node.children.filter(n => n.name === 'link');
    const linkNode = atom ? links.find(n => !n.attrs.rel || n.attrs.rel === 'alternate') : links[0];
    const guid = child('guid');
    const rawLink = atom ? linkNode?.attrs.href : linkNode?.text || (guid?.attrs.isPermaLink !== 'false' ? guid?.text : '');
    const link = BarRSS.httpUrl(rawLink, linkNode?.base || node.base);
    const descriptionNode = child('description', 'summary', 'encoded', 'content');
    const rawDescription = descriptionNode?.text || '';
    const media = node.children.find(n => (n.name === 'thumbnail' || n.name === 'content') && n.attrs.url && (/image/.test(n.attrs.type || '') || /search.yahoo.com\/mrss/.test(n.uri || '') || n.name === 'thumbnail'));
    const enclosure = node.children.find(n => n.name === 'enclosure' && /^image\//.test(n.attrs.type || ''));
    const htmlImage = decodeHtmlEntities(rawDescription).match(/<img[^>]+src=["']([^"']+)["']/i);
    const redditImage = decodeHtmlEntities(rawDescription).match(/href=["'](https?:\/\/(?:preview\.redd\.it|i\.redd\.it|external-preview\.redd\.it)[^"']+)["']/i);
    const category = child('category');
    return {
      title: cleanXmlText(child('title')?.text || '').slice(0, 500), link,
      description: cleanXmlText(rawDescription).slice(0, 260),
      imageUrl: BarRSS.httpUrl(media?.attrs.url || enclosure?.attrs.url || htmlImage?.[1] || redditImage?.[1], media?.base || descriptionNode?.base || node.base),
      pubDate: cleanXmlText(child('pubDate', 'published', 'updated', 'date')?.text || ''),
      category: cleanXmlText(category?.attrs.term || category?.text || '')
    };
  }).filter(item => item.title && item.link);
}
