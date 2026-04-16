/**
 * Repara Portable Text mal migrado desde WordPress:
 * - Bloques h2 con múltiples líneas se rompen en encabezado + lista
 * - Bloques h2 largos que son párrafos se convierten a "normal"
 * - Párrafos "normal" cortos sin puntuación final se promueven a h3 (subtítulos)
 */

function isLikelySubheading(text: string): boolean {
  const t = text.trim();
  if (!t || t.length === 0 || t.length > 80) return false;
  if (t.includes('\n')) return false;
  if (/[.?!,:;]$/.test(t)) return false;
  const words = t.split(/\s+/).length;
  return words <= 10;
}

function cleanLine(line: string): string {
  return line.replace(/\s+/g, ' ').trim();
}

function randKey(): string {
  return Math.random().toString(36).slice(2, 12);
}

function makeBlock(
  text: string,
  style: string = 'normal',
  listItem?: string
): any {
  const block: any = {
    _type: 'block',
    _key: randKey(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: randKey(), text, marks: [] }],
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = 1;
  }
  return block;
}

function getBlockText(block: any): string {
  if (!block?.children) return '';
  return block.children
    .map((c: any) => (typeof c.text === 'string' ? c.text : ''))
    .join('');
}

function fixBlock(block: any): any[] {
  if (!block || block._type !== 'block') return [block];

  const text = getBlockText(block);
  const style: string = block.style || 'normal';
  const isHeading = /^h[1-6]$/.test(style);

  // CASE 1: Encabezado con múltiples líneas → título + items
  if (isHeading && text.includes('\n')) {
    const lines = text
      .split(/\n+/)
      .map(cleanLine)
      .filter((l) => l.length > 0);

    if (lines.length >= 2) {
      const heading = lines[0];
      const rest = lines.slice(1);

      const result: any[] = [makeBlock(heading, style)];

      rest.forEach((line) => {
        result.push(makeBlock(line, 'normal', 'bullet'));
      });

      return result;
    }
  }

  // CASE 2: H2/H3 largo con puntuación → realmente un párrafo
  if (isHeading && text.length > 150 && /[.!?]/.test(text)) {
    return [{ ...block, style: 'normal' }];
  }

  // CASE 3: Párrafo "normal" corto sin puntuación → subtítulo H3
  if (style === 'normal' && isLikelySubheading(text)) {
    return [{ ...block, style: 'h3' }];
  }

  return [block];
}

export function fixPortableText(blocks: any[]): any[] {
  if (!Array.isArray(blocks)) return blocks;
  return blocks.flatMap(fixBlock);
}
