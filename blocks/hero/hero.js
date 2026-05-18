import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero block — full-width image with text overlay.
 *
 * Expected block structure (1 row, 1 or 2 columns):
 *   Col 1: picture / image
 *   Col 2 (optional): heading, body copy, CTA links
 *
 * If all content is in a single column the block attempts to split
 * picture elements from text nodes automatically.
 */
export default function decorate(block) {
  // Collect all direct div children (rows / cells)
  const rows = [...block.children];

  let pictureSrc = null;
  let picAlt = '';
  const textNodes = [];

  if (rows.length === 1 && rows[0].children.length >= 2) {
    // Two-column layout: [image | text]
    const [imageCell, textCell] = [...rows[0].children];
    const img = imageCell.querySelector('img');
    if (img) {
      pictureSrc = img.getAttribute('src') || img.src;
      picAlt = img.getAttribute('alt') || '';
    }
    [...textCell.children].forEach((node) => textNodes.push(node));
  } else {
    // Single-column or flat layout: extract picture then text
    rows.forEach((row) => {
      [...row.children].forEach((cell) => {
        const img = cell.querySelector('img');
        if (!pictureSrc && img) {
          pictureSrc = img.getAttribute('src') || img.src;
          picAlt = img.getAttribute('alt') || '';
        } else {
          [...cell.children].forEach((node) => textNodes.push(node));
        }
      });
    });
  }

  // Build DOM
  block.innerHTML = '';

  // Background image
  if (pictureSrc) {
    const picture = createOptimizedPicture(pictureSrc, picAlt, true, [
      { media: '(min-width: 1920px)', width: '2400' },
      { media: '(min-width: 1200px)', width: '2000' },
      { media: '(min-width: 768px)', width: '1500' },
      { width: '900' },
    ]);
    const mediaDiv = document.createElement('div');
    mediaDiv.className = 'hero-media';
    mediaDiv.append(picture);
    block.append(mediaDiv);
  }

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';

  // Dark gradient tint (improves legibility)
  const tint = document.createElement('div');
  tint.className = 'hero-tint';
  overlay.append(tint);

  // Text content wrapper
  if (textNodes.length > 0) {
    const content = document.createElement('div');
    content.className = 'hero-content';

    // Mark CTA links as buttons
    textNodes.forEach((node) => {
      if (node.tagName === 'P') {
        const anchors = node.querySelectorAll('a');
        anchors.forEach((a) => a.classList.add('button'));
      }
      content.append(node);
    });

    overlay.append(content);
  }

  block.append(overlay);
}
