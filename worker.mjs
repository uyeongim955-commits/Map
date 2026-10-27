import { renderMap, resolveLocations } from './map-svg.mjs';
import { outlineText } from './text-paths.mjs';

const SVG_ORIGIN = 'https://map.a202214421.workers.dev';
const VERSION = 'parchment-random-v5';
const PNG_HEADERS = {
  'Content-Type': 'image/png',
  'Cache-Control': 'public, max-age=86400',
  'Access-Control-Allow-Origin': '*',
  'Cross-Origin-Resource-Policy': 'cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow',
};
export default {
  async fetch(request, env, ctx) {
    if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405});
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/([123])(?:\.(png|svg))?\/?$/);
    if (!match) return new Response('Aster PNG map: /1.png?p=0,0,0,0,0  /2.png?p=0,0,0,0,0  /3.png?p=0,0,0,0,0',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
    const page = Number(match[1]);
    const positions = resolveLocations(page, url.searchParams.get('p'));
    if (match[2] === 'svg') {
      return new Response(request.method === 'HEAD' ? null : outlineText(renderMap(page,positions)),{headers:{'Content-Type':'image/svg+xml; charset=utf-8','Cache-Control':'public, max-age=86400','Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff'}});
    }
    if (request.method === 'HEAD') return new Response(null,{headers:PNG_HEADERS});
    const source = new URL('/'+page+'.svg',SVG_ORIGIN);
    source.searchParams.set('v',VERSION);
    source.searchParams.set('p',positions.join(','));
    const proxy = new URL('https://wsrv.nl/');
    proxy.searchParams.set('url',source.href);
    proxy.searchParams.set('output','png');
    proxy.searchParams.set('af','1');
    const key = new Request(SVG_ORIGIN+'/_png_cache/'+VERSION+'/'+page+'/'+positions.join(','));
    const cache = globalThis.caches?.default;
    const hit = cache && await cache.match(key);
    if (hit) return hit;
    // Only the fixed source URL and five numeric location codes are sent.
    // No incoming cookies, authorization, user IP headers, or referrer are forwarded.
    const upstream = await fetch(proxy.href);
    if (!upstream.ok || !upstream.headers.get('Content-Type')?.toLowerCase().startsWith('image/png')) {
      return new Response('PNG conversion unavailable. Open the .svg endpoint to verify deployment.',{status:502,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
    }
    const response = new Response(upstream.body,{headers:{...PNG_HEADERS,'Content-Disposition':'inline; filename="aster-map-'+page+'.png"'}});
    if (cache && ctx?.waitUntil) ctx.waitUntil(cache.put(key,response.clone()));
    return response;
  },
};
