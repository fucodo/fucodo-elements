/**
 * highlightJson(text) -> HTML-String mit <span class="tok-*">-Markup.
 *
 * Reiner Regex-Lexer (kein Parser, kein eval) – funktioniert daher auch auf
 * (noch) ungültigem JSON während des Tippens und liefert dann einfach
 * unklassifizierten Text zurück. Aller Text wird vor dem Einsetzen ins
 * innerHTML escaped, es entsteht kein XSS-Risiko durch Nutzereingaben.
 */
const TOKEN_PATTERN =
  /"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b|[{}[\],:]/g;

const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };

function escapeHtml(value) {
  return value.replace(/[&<>]/g, (char) => ESCAPE_MAP[char]);
}

function classify(token, textAfterToken) {
  if (token.charCodeAt(0) === 34 /* " */) {
    return /^\s*:/.test(textAfterToken) ? 'tok-key' : 'tok-string';
  }
  if (token === 'true' || token === 'false') return 'tok-boolean';
  if (token === 'null') return 'tok-null';
  if (token === '{' || token === '}' || token === '[' || token === ']' || token === ':' || token === ',') {
    return 'tok-punct';
  }
  return 'tok-number';
}

export function highlightJson(text) {
  TOKEN_PATTERN.lastIndex = 0;
  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = TOKEN_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const cls = classify(token, text.slice(TOKEN_PATTERN.lastIndex));
    result += `<span class="${cls}">${escapeHtml(token)}</span>`;
    lastIndex = TOKEN_PATTERN.lastIndex;
  }

  result += escapeHtml(text.slice(lastIndex));
  return result;
}
