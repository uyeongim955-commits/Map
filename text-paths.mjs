import { GLYPHS, UNITS } from './glyphs.mjs';

export function outlineText(svg) {
  const used = new Set();
  const out = svg.replace(/<text\b([^>]*)>([^<]*)<\/text>/g, (_, raw, encoded) => {
    const a = Object.fromEntries([...raw.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
    const text = encoded.replace(/&(amp|lt|gt|quot|apos);/g, (_, x) => ({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[x]));
    const size = Number(a['font-size'] || 16), scale = size / UNITS;
    const width = [...text].reduce((n, ch) => n + (GLYPHS[ch]?.[0] || 0), 0);
    let x = Number(a.x || 0);
    if (a['text-anchor'] === 'middle') x -= width * scale / 2;
    if (a['text-anchor'] === 'end') x -= width * scale;
    let cursor = 0;
    const letters = [...text].map(ch => {
      const glyph = GLYPHS[ch];
      if (!glyph) return '';
      const id = 'g' + ch.codePointAt(0).toString(16);
      used.add(ch);
      const s = `<use href="#${id}" xlink:href="#${id}" x="${cursor}"/>`;
      cursor += glyph[0];
      return s;
    }).join('');
    const fill = a.fill || '#242424';
    const bold = Number(a['font-weight'] || 400) >= 700 ? ` stroke="${fill}" stroke-width="9" stroke-linejoin="round"` : '';
    return `<g fill="${fill}"${bold} transform="translate(${x.toFixed(2)} ${Number(a.y || 0)}) scale(${scale} ${-scale})">${letters}</g>`;
  });
  const definitions = [...used].map(ch => `<path id="g${ch.codePointAt(0).toString(16)}" d="${GLYPHS[ch][1]}"/>`).join('');
  return out.replace(/(<svg\b[^>]*>)/, '$1<defs>' + definitions + '</defs>');
}
