import * as sanitizeHtml from 'sanitize-html';

export function cleanHTML(text: string) {
  const clean = sanitizeHtml(text, {
    allowedTags: ['i', 'code', 'strong', 'a'],
    allowedAttributes: {
      a: ['href', 'title'],
    },
  });

  return clean;
}
