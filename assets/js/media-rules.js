/* Shared asset rules: never load an external URL from a photo record. */
(() => {
  'use strict';
  const safeImagePath = value => typeof value === 'string'
    && /^assets\/images\/[A-Za-z0-9_./-]+\.(?:webp|png|jpe?g|svg)$/i.test(value)
    && !value.includes('..');
  const safePosition = value => typeof value === 'string'
    && /^(?:left|right|center|top|bottom|\d+(?:\.\d+)?%)(?: (?:left|right|center|top|bottom|\d+(?:\.\d+)?%))?$/.test(value);
  function normalise(input) {
    return Object.fromEntries(Object.entries(input || {}).filter(([key,m]) =>
      /^[A-Za-z0-9_-]+$/.test(key) && m && safeImagePath(m.src)
    ).map(([key,m]) => [key, {
      ...m,
      thumb: safeImagePath(m.thumb) ? m.thumb : m.src,
      width: Number.isInteger(m.width) && m.width > 0 && m.width <= 20000 ? m.width : 1600,
      height: Number.isInteger(m.height) && m.height > 0 && m.height <= 20000 ? m.height : 1200,
      fit: m.fit === 'contain' ? 'contain' : 'cover',
      position: safePosition(m.position) ? m.position : 'center',
      category: ['community','poster','evidence'].includes(m.category) ? m.category : 'evidence'
    }]));
  }
  window.HOTWIND_MEDIA_RULES = Object.freeze({safeImagePath,normalise});
})();
