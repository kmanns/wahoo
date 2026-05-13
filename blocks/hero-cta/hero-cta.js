import { createOptimizedPicture } from '../../scripts/aem.js';

const DEFAULT_INTERVAL = 5000;

function normalizePosition(value, fallback) {
  const val = (value || '').toLowerCase();
  if (
    [
      'top-left',
      'top-center',
      'top-right',
      'middle-left',
      'middle-center',
      'middle-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ].includes(val)
  ) return val;
  return fallback;
}

function normalizeSize(value, fallback) {
  const val = (value || '').toLowerCase();
  if (['short', 'medium', 'tall', 'fullscreen'].includes(val)) return val;
  return fallback;
}

function normalizeButtonStyle(value, fallback) {
  const val = (value || '').toLowerCase();
  if (
    [
      'outline',
      'solid',
      'elevated',
      'glass',
      'soft',
      'soft-glow',
      'neo',
      'ribbon',
      'stamp',
      'link',
      'inset',
      'underline',
      'quiet',
      'strong',
      'halo',
      'bevel',
      'tab',
      'rail',
      'outline-double',
      'compact',
      'corner-pins',
      'ticket',
      'capsule-cut',
      'brace',
      'double-notch',
      'frame-gap',
      'split-edge',
      'fold',
      'badge',
      'pixel-step',
    ].includes(val)
  ) return val;
  return fallback;
}

function normalizeButtonCorner(value, fallback = '') {
  const val = (value || '').toLowerCase();
  if (!val) return fallback;
  if (['default', 'soft', 'rounded-lg', 'pill', 'none'].includes(val)) return val;
  return fallback;
}

function normalizeButtonWidth(value, fallback) {
  const val = (value || '').toLowerCase();
  if (['auto', 'narrow', 'medium', 'wide', 'fluid', 'fit-content'].includes(val)) return val;
  return fallback;
}

function normalizeSidebar(value) {
  const val = (value || '').toLowerCase();
  if (
    [
      'left',
      'right',
      'overlay-left',
      'overlay-right',
      'sticky-left',
      'sticky-right',
    ].includes(val)
  ) {
    return val;
  }
  return '';
}

function normalizeLayoutWidth(value, fallback = 'full-width') {
  const val = (value || '').toLowerCase();
  if (['default', 'full-width'].includes(val)) return val;
  return fallback;
}

function normalizeImageMaxWidth(value, fallback = 2400) {
  const allowed = [1200, 1600, 2000, 2400, 3000, 3600];
  const parsed = Number.parseInt(value, 10);
  if (allowed.includes(parsed)) return parsed;
  return fallback;
}

function normalizeOverlayInset(value, fallback = 'medium') {
  const val = (value || '').toLowerCase();
  if (['xsmall', 'small', 'medium', 'large', 'xlarge'].includes(val)) return val;
  return fallback;
}

function normalizeContentMaxWidth(value, fallback = 520) {
  const allowed = [360, 420, 520, 640];
  const parsed = Number.parseInt(value, 10);
  if (allowed.includes(parsed)) return parsed;
  return fallback;
}

function normalizeCtaLayout(value, fallback = 'inline') {
  const val = (value || '').toLowerCase();
  if (['stack', 'inline', 'split'].includes(val)) return val;
  return fallback;
}

function normalizeCtaGap(value, fallback = 'medium') {
  const val = (value || '').toLowerCase();
  if (['xsmall', 'small', 'medium', 'large'].includes(val)) return val;
  return fallback;
}

function normalizeCtaTextTransform(value, fallback = 'uppercase') {
  const val = (value || '').toLowerCase();
  if (['none', 'uppercase', 'capitalize'].includes(val)) return val;
  return fallback;
}

function normalizeCtaFontSize(value, fallback = 'md') {
  const val = (value || '').toLowerCase();
  if (['default', 'sm', 'md', 'lg'].includes(val)) return val;
  return fallback;
}

function normalizeSlideTransition(value, fallback = 'fade') {
  const val = (value || '').toLowerCase();
  if (['fade', 'slide', 'none'].includes(val)) return val;
  return fallback;
}

function normalizeImageFrameStyle(value, fallback = 'default') {
  const val = (value || '').toLowerCase();
  if (
    [
      'default',
      'soft-small',
      'soft-medium',
      'soft-large',
      'outline',
      'double-stroke',
      'glass-ring',
      'floating-panel',
      'halo-ring',
      'photo-matte',
      'edge-rails',
      'topline-accent',
      'duo-effect',
    ].includes(val)
  ) return val;
  return fallback;
}

function normalizeButtonTextColor(value, fallback = '') {
  const raw = (value || '').toString().trim();
  if (!raw) return fallback;
  const val = raw.toLowerCase();
  if (['white', 'dark', 'brand', 'accent', 'inherit'].includes(val)) return val;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) return raw;
  if (/^rgba?\(/i.test(raw)) return raw;
  return fallback;
}

function normalizeButtonBorderColor(value, fallback = '') {
  const raw = (value || '').toString().trim();
  if (!raw) return fallback;
  const val = raw.toLowerCase();
  if (['transparent', 'light', 'neutral', 'dark', 'brand', 'accent', 'white', 'black'].includes(val)) return val;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) return raw;
  if (/^rgba?\(/i.test(raw)) return raw;
  return fallback;
}

function normalizeButtonFillColor(value, fallback = '') {
  const raw = (value || '').toString().trim();
  if (!raw) return fallback;
  const val = raw.toLowerCase();
  if (['transparent', 'light', 'neutral', 'dark', 'brand', 'accent', 'white', 'black'].includes(val)) return val;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) return raw;
  if (/^rgba?\(/i.test(raw)) return raw;
  return fallback;
}

function normalizeButtonHoverStyle(value, fallback = 'pop') {
  const val = (value || '').toLowerCase();
  if (['none', 'lift', 'press', 'pop', 'nudge', 'tilt', 'swing', 'pulse'].includes(val)) return val;
  return fallback;
}

function normalizeButtonBorderWidth(value, fallback = '0') {
  const val = (value || '').toString().trim();
  if (['0', '1', '2', '3', '4'].includes(val)) return val;
  return fallback;
}

function sanitizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('//')) return '';
  if (['#', '/', './', '../', '?'].some((token) => trimmed.startsWith(token))) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    return '';
  }

  return '';
}

function sanitizeTarget(target) {
  const normalized = (target || '').trim().toLowerCase();
  if (['_blank', '_self', '_parent', '_top'].includes(normalized)) return normalized;
  return '';
}

function setLinkTargetAttributes(anchor, target) {
  if (!target || target === '_self') return;
  anchor.target = target;
  if (target === '_blank') {
    anchor.rel = 'noopener noreferrer';
  }
}

function readCellLink(cell) {
  const anchor = cell?.querySelector('a[href]');
  if (!anchor) return { label: '', href: '', target: '' };
  return {
    label: anchor.textContent.trim(),
    href: sanitizeUrl(anchor.getAttribute('href') || ''),
    target: sanitizeTarget(anchor.getAttribute('target') || ''),
  };
}

function resolveButtonTextColor(colorValue) {
  const key = (colorValue || '').toLowerCase();
  const tokenMap = {
    white: 'var(--color-neutral-50)',
    dark: 'var(--color-neutral-900)',
    brand: 'var(--color-brand-500)',
    accent: 'var(--color-informational-500)',
    inherit: 'inherit',
  };
  return tokenMap[key] || colorValue;
}

function resolveSurfaceColor(colorValue) {
  const key = (colorValue || '').toLowerCase();
  const tokenMap = {
    transparent: 'transparent',
    light: 'var(--color-neutral-100)',
    neutral: 'var(--color-neutral-200)',
    dark: 'var(--color-neutral-900)',
    brand: 'var(--color-brand-500)',
    accent: 'var(--color-informational-500)',
    white: 'var(--color-neutral-50)',
    black: '#000',
  };
  return tokenMap[key] || colorValue;
}

function getConfigValue(blockValue, sectionData, keys, fallback) {
  if (blockValue) return blockValue;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (sectionData?.[key]) return sectionData[key];
  }
  return fallback;
}

function hasConfigValue(blockValue, sectionData, keys) {
  if (typeof blockValue === 'string' && blockValue.trim()) return true;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (typeof sectionData?.[key] === 'string' && sectionData[key].trim()) return true;
  }
  return false;
}

function warnOnInvalidConfig(name, rawValue, normalizedValue, fallback) {
  if (!rawValue) return;
  const raw = rawValue.toString().trim().toLowerCase();
  const normalized = normalizedValue.toString().trim().toLowerCase();
  const fallbackValue = fallback.toString().trim().toLowerCase();
  if (raw !== normalized && normalized === fallbackValue) {
    console.warn(`hero-cta: invalid ${name} "${rawValue}". Using "${fallback}".`);
  }
}

function warnOnNoOpConfig(name, rawValue, reason) {
  if (!rawValue || !rawValue.toString().trim()) return;
  console.warn(`hero-cta: ${name} "${rawValue}" has no effect. ${reason}`);
}

function cloneLabelContent(cell, fallbackLabel = '') {
  const fragment = document.createDocumentFragment();
  if (!cell) {
    if (fallbackLabel) fragment.append(document.createTextNode(fallbackLabel));
    return fragment;
  }

  const children = [...cell.childNodes];
  if (!children.length) {
    if (fallbackLabel) fragment.append(document.createTextNode(fallbackLabel));
    return fragment;
  }

  children.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (tag === 'a' || tag === 'button') {
        const span = document.createElement('span');
        span.textContent = node.textContent?.trim() || '';
        fragment.append(span);
        return;
      }
    }
    fragment.append(node.cloneNode(true));
  });

  return fragment;
}

function parseTypedRows(rows) {
  const slideRows = [];
  const navEntries = [];
  let interval = DEFAULT_INTERVAL;

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const type = (cells[0]?.textContent || '').trim().toLowerCase();
    const rowNum = index + 1;

    if (!type) {
      console.warn(`hero-cta: row ${rowNum} missing row type. Expected "slide", "nav", or "interval".`);
      return;
    }

    if (type === 'slide') {
      slideRows.push(row);
      return;
    }

    if (type === 'interval') {
      const raw = cells[1]?.textContent?.trim() || '';
      const ms = Number.parseInt(raw, 10);
      if (!Number.isNaN(ms) && ms > 0) {
        interval = ms;
      } else {
        console.warn(`hero-cta: row ${rowNum} interval "${raw}" is invalid. Using "${DEFAULT_INTERVAL}".`);
      }
      return;
    }

    if (type === 'nav') {
      const mode = (cells[1]?.textContent || '').trim().toLowerCase() || 'item';
      const labelCell = cells[2];
      const hrefCell = cells[3];
      const labelLink = readCellLink(labelCell);
      const hrefLink = readCellLink(hrefCell);
      const label = labelLink.label || labelCell?.textContent?.trim() || '';
      const href = labelLink.href || hrefLink.href || sanitizeUrl(hrefCell?.textContent?.trim() || '');
      const target = labelLink.target || hrefLink.target || '';

      if (!label) {
        console.warn(`hero-cta: row ${rowNum} nav entry has no label.`);
        return;
      }

      if (mode === 'header') {
        navEntries.push({
          type: 'header',
          label,
          labelCell: labelCell?.cloneNode(true) || null,
        });
        return;
      }

      navEntries.push({
        type: 'item',
        label,
        href,
        target,
        labelCell: labelCell?.cloneNode(true) || null,
      });
      return;
    }

    console.warn(`hero-cta: row ${rowNum} has unsupported type "${type}".`);
  });

  return {
    slideRows,
    navEntries,
    interval,
  };
}

/**
 * Build sidebar navigation from typed nav entries.
 * `header` renders non-clickable heading rows.
 */
function buildSidebar(navEntries) {
  const nav = document.createElement('nav');
  nav.className = 'hero-cta-sidebar';
  nav.setAttribute('aria-label', 'Hero navigation');

  const list = document.createElement('ul');
  list.className = 'hero-cta-sidebar-list';

  navEntries.forEach((entry) => {
    const li = document.createElement('li');
    li.className = 'hero-cta-sidebar-item';

    if (entry.type === 'header') {
      const header = document.createElement('div');
      header.className = 'hero-cta-sidebar-header';
      header.append(cloneLabelContent(entry.labelCell, entry.label));
      li.append(header);
    } else {
      const link = document.createElement('a');
      link.className = 'hero-cta-sidebar-link';
      link.append(cloneLabelContent(entry.labelCell, entry.label));
      if (entry.href) {
        link.href = entry.href;
        setLinkTargetAttributes(link, entry.target);
      } else {
        link.href = '#';
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('tabindex', '-1');
      }

      li.append(link);
    }

    list.append(li);
  });

  nav.append(list);
  return nav;
}

function extractImageSource(cell) {
  if (!cell) {
    console.warn('hero-cta: No image cell found');
    return null;
  }

  // Check for existing picture element
  const picture = cell.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img && img.src && !img.src.includes('error')) {
      return { src: img.src, alt: img.alt || '' };
    }
  }

  // Check for img element
  const img = cell.querySelector('img');
  if (img && img.src && !img.src.includes('error')) {
    return { src: img.src, alt: img.alt || '' };
  }

  // Check for link to image (a[href])
  const link = cell.querySelector('a');
  if (link && link.href) {
    const { href } = link;
    // Check if link points to an image file
    if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(href)) {
      return { src: href, alt: link.textContent || '' };
    }
  }

  // Check for plain text URL
  const text = cell.textContent.trim();
  if (text && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(text)) {
    return { src: text, alt: '' };
  }

  console.warn('hero-cta: No valid image source found in image cell.');
  return null;
}

/**
 * Extract headline text from the CTA label cell.
 * If the cell contains multiple paragraphs/lines, the first one is the headline
 * and the rest become a subtitle paragraph — UNLESS they look like button labels
 * (short single-word or "Shop Now" / "Learn More" style strings).
 * If only one item, it's used as a button label only (no heading generated).
 */
function extractHeadlineAndSubtitle(ctaTextCell, imageAlt) {
  if (!ctaTextCell) {
    // Fall back to image alt text as headline
    const alt = (imageAlt || '').trim();
    if (alt) return { headline: alt, subtitle: '' };
    return { headline: '', subtitle: '' };
  }

  const rawText = ctaTextCell.textContent.trim();
  if (!rawText) {
    const alt = (imageAlt || '').trim();
    return { headline: alt, subtitle: '' };
  }

  // Collect all paragraphs / list items / text nodes as lines
  const lines = [];
  const blocks = [...ctaTextCell.querySelectorAll('p, li, h1, h2, h3, h4')];
  if (blocks.length > 0) {
    blocks.forEach((el) => {
      const t = el.textContent.trim();
      if (t) lines.push(t);
    });
  } else {
    rawText.split('\n').forEach((line) => {
      const t = line.trim();
      if (t) lines.push(t);
    });
  }

  if (lines.length === 0) {
    return { headline: (imageAlt || '').trim(), subtitle: '' };
  }

  // Button-label heuristic: short (≤ 4 words) or matches common CTA phrases
  const isButtonLabel = (text) => {
    const words = text.split(/\s+/);
    const ctaPhrases = /^(shop|buy|learn|explore|discover|get|view|see|find|order|start|try|join|sign|register|watch|read|download|grab)\b/i;
    return words.length <= 4 || ctaPhrases.test(text);
  };

  // If only one line and it looks like a button label, use image alt as headline
  if (lines.length === 1 && isButtonLabel(lines[0])) {
    return { headline: (imageAlt || '').trim(), subtitle: '' };
  }

  // If first line is NOT a button label, use it as headline
  if (!isButtonLabel(lines[0])) {
    const headline = lines[0];
    const subtitleLines = lines.slice(1).filter((l) => !isButtonLabel(l));
    return { headline, subtitle: subtitleLines.join(' ') };
  }

  // All lines look like button labels — fall back to alt text
  return { headline: (imageAlt || '').trim(), subtitle: '' };
}

function buildSlide(row, isFirstSlide = false, config = {}) {
  const cells = [...row.children];
  const ctaTextCell = cells[2];
  const ctaLinkCell = cells[3];

  const slide = document.createElement('div');
  slide.className = 'hero-cta-slide';

  // Column 1: Image (flexible format support)
  const imageData = extractImageSource(cells[1]);
  if (imageData) {
    // Optimized breakpoints based on configured max width
    const maxWidth = config.imageMaxWidth || 2400;
    const breakpoints = [
      { media: '(min-width: 1920px)', width: Math.min(maxWidth, 2400).toString() },
      { media: '(min-width: 1200px)', width: Math.min(maxWidth, 2000).toString() },
      { media: '(min-width: 768px)', width: Math.min(maxWidth, 1500).toString() },
      { width: '1200' },
    ];

    const optimized = createOptimizedPicture(
      imageData.src,
      imageData.alt,
      isFirstSlide, // Eager load first slide for LCP optimization
      breakpoints,
    );
    const media = document.createElement('div');
    media.className = 'hero-cta-media';
    media.append(optimized);
    slide.append(media);
  }

  // CTA surface
  const content = document.createElement('div');
  content.className = 'hero-cta-content';

  // --- Headline + subtitle ---
  const { headline, subtitle } = extractHeadlineAndSubtitle(
    ctaTextCell,
    imageData?.alt || '',
  );

  if (headline) {
    const heading = document.createElement('h2');
    heading.className = 'hero-cta-heading';
    heading.textContent = headline;
    content.appendChild(heading);
  }

  if (subtitle) {
    const subEl = document.createElement('p');
    subEl.className = 'hero-cta-subtitle';
    subEl.textContent = subtitle;
    content.appendChild(subEl);
  }

  // --- CTA buttons ---
  const ctaLabels = [];
  const ctaLinks = [];

  if (ctaTextCell) {
    const linkedLabels = [...ctaTextCell.querySelectorAll('a')].map((link) => link.textContent.trim()).filter(Boolean);
    if (linkedLabels.length) {
      ctaLabels.push(...linkedLabels);
    } else {
      const blockLabels = [...ctaTextCell.querySelectorAll('p, li')].map((el) => el.textContent.trim()).filter(Boolean);
      if (blockLabels.length) {
        ctaLabels.push(...blockLabels);
      } else {
        const fallbackLabels = ctaTextCell.textContent
          .split('\n')
          .map((text) => text.trim())
          .filter(Boolean);
        ctaLabels.push(...fallbackLabels);
      }
    }
  }

  if (ctaLinkCell) {
    const linkedHrefs = [...ctaLinkCell.querySelectorAll('a[href]')]
      .map((link) => sanitizeUrl(link.getAttribute('href') || ''))
      .filter(Boolean);
    if (linkedHrefs.length) {
      ctaLinks.push(...linkedHrefs);
    } else {
      const blockHrefs = [...ctaLinkCell.querySelectorAll('p, li')]
        .map((el) => sanitizeUrl(el.textContent.trim()))
        .filter(Boolean);
      if (blockHrefs.length) {
        ctaLinks.push(...blockHrefs);
      } else {
        const fallbackHrefs = ctaLinkCell.textContent
          .split('\n')
          .map((text) => sanitizeUrl(text.trim()))
          .filter(Boolean);
        ctaLinks.push(...fallbackHrefs);
      }
    }
  }

  // Build CTA buttons from Column 2 text, map URLs from Column 3 by index.
  const buttonGroups = [];
  ctaLabels.forEach((label, index) => {
    const buttonWrapper = document.createElement('p');
    const button = document.createElement('a');
    const href = ctaLinks[index] || ctaLinks[0] || '#';

    button.href = href;
    button.textContent = label;
    button.setAttribute('aria-label', label);
    if (href === '#') {
      button.setAttribute('role', 'button');
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('tabindex', '-1');
    }
    // First button is primary (filled), additional buttons are secondary (outline)
    button.className = index === 0 ? 'button button-primary' : 'button button-secondary';

    buttonWrapper.append(button);
    buttonGroups.push({ button: buttonWrapper });
  });

  // Build button groups
  if (buttonGroups.length > 0) {
    const actionsWrapper = document.createElement('div');
    actionsWrapper.className = 'hero-cta-actions';

    buttonGroups.forEach(({ button }) => {
      actionsWrapper.appendChild(button);
    });

    content.appendChild(actionsWrapper);
  }

  const overlay = document.createElement('div');
  overlay.className = 'hero-cta-overlay';
  overlay.append(content);

  slide.append(overlay);
  return slide;
}

/**
 * Build slide indicator dots for multi-slide carousels.
 */
function buildDots(slideCount, onDotClick) {
  const dotsWrapper = document.createElement('div');
  dotsWrapper.className = 'hero-cta-dots';
  dotsWrapper.setAttribute('aria-label', 'Slide navigation');
  dotsWrapper.setAttribute('role', 'tablist');

  for (let i = 0; i < slideCount; i += 1) {
    const dot = document.createElement('button');
    dot.className = 'hero-cta-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.dataset.index = i;
    dot.addEventListener('click', () => onDotClick(i));
    dotsWrapper.append(dot);
  }

  return dotsWrapper;
}

function startRotation(slides, interval, dotsEl) {
  if (slides.length <= 1) return;

  // Respect user's motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    slides[0].classList.add('is-active');
    return;
  }

  const dots = dotsEl ? [...dotsEl.querySelectorAll('.hero-cta-dot')] : [];

  const activate = (index) => {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  };

  let index = 0;
  activate(0);

  const timer = setInterval(() => {
    index = (index + 1) % slides.length;
    activate(index);
  }, interval);

  // Dot click: jump to slide and reset timer
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      index = Number(dot.dataset.index);
      activate(index);
    });
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Show loading state
  block.dataset.loading = 'true';

  // Get section element for metadata fallback
  const section = block.closest('.section');
  const sectionData = section?.dataset || {};
  const hasButtonWidthOverride = hasConfigValue(
    block.dataset.heroctaBtnwidth,
    sectionData,
    ['heroctaBtnwidth', 'dataHeroctaBtnwidth'],
  );

  const hasExplicitConfig = {
    sidebar: hasConfigValue(
      block.dataset.heroctaSidebar,
      sectionData,
      ['heroctaSidebar', 'dataHeroctaSidebar'],
    ),
    ctaLayout: hasConfigValue(
      block.dataset.heroctaCtalayout,
      sectionData,
      ['heroctaCtalayout', 'dataHeroctaCtalayout'],
    ),
    buttonCorner: hasConfigValue(
      block.dataset.heroctaBtncorner,
      sectionData,
      ['heroctaBtncorner', 'dataHeroctaBtncorner'],
    ),
    buttonBorderWidth: hasConfigValue(
      block.dataset.heroctaBtnborder,
      sectionData,
      ['heroctaBtnborder', 'dataHeroctaBtnborder'],
    ),
    buttonBorderColor: hasConfigValue(
      block.dataset.heroctaBtncolor,
      sectionData,
      ['heroctaBtncolor', 'dataHeroctaBtncolor'],
    ),
    buttonFillColor: hasConfigValue(
      block.dataset.heroctaBtnfill,
      sectionData,
      ['heroctaBtnfill', 'dataHeroctaBtnfill'],
    ),
  };

  // Read configuration from block data attributes or section metadata
  // Note: DA.live Section Metadata may add double prefix (data-data-*)
  const config = {
    // Default position is now bottom-left (text on the left, Wahoo-style)
    position: getConfigValue(
      block.dataset.heroctaPosition,
      sectionData,
      ['heroctaPosition', 'dataHeroctaPosition'],
      'bottom-left',
    ),
    size: getConfigValue(block.dataset.heroctaSize, sectionData, ['heroctaSize', 'dataHeroctaSize'], 'tall'),
    buttonStyle: getConfigValue(
      block.dataset.heroctaBtnstyle,
      sectionData,
      ['heroctaBtnstyle', 'dataHeroctaBtnstyle'],
      'solid',
    ),
    imageMaxWidthRaw: getConfigValue(
      block.dataset.heroctaImgmax,
      sectionData,
      ['heroctaImgmax', 'dataHeroctaImgmax'],
      '2400',
    ),
    imageMaxWidth: normalizeImageMaxWidth(
      getConfigValue(
        block.dataset.heroctaImgmax,
        sectionData,
        ['heroctaImgmax', 'dataHeroctaImgmax'],
        '2400',
      ),
      2400,
    ),
    buttonWidth: getConfigValue(
      block.dataset.heroctaBtnwidth,
      sectionData,
      ['heroctaBtnwidth', 'dataHeroctaBtnwidth'],
      'auto',
    ),
    buttonCorner: getConfigValue(
      block.dataset.heroctaBtncorner,
      sectionData,
      ['heroctaBtncorner', 'dataHeroctaBtncorner'],
      '',
    ),
    buttonHoverStyle: getConfigValue(
      block.dataset.heroctaBtnhover,
      sectionData,
      ['heroctaBtnhover', 'dataHeroctaBtnhover'],
      'pop',
    ),
    buttonBorderWidth: getConfigValue(
      block.dataset.heroctaBtnborder,
      sectionData,
      ['heroctaBtnborder', 'dataHeroctaBtnborder'],
      '0',
    ),
    overlayInset: getConfigValue(
      block.dataset.heroctaInset,
      sectionData,
      ['heroctaInset', 'dataHeroctaInset'],
      'large',
    ),
    contentMaxWidthRaw: getConfigValue(
      block.dataset.heroctaContentwidth,
      sectionData,
      ['heroctaContentwidth', 'dataHeroctaContentwidth'],
      '520',
    ),
    contentMaxWidth: normalizeContentMaxWidth(
      getConfigValue(
        block.dataset.heroctaContentwidth,
        sectionData,
        ['heroctaContentwidth', 'dataHeroctaContentwidth'],
        '520',
      ),
      520,
    ),
    // Default CTA layout is inline (primary + secondary side by side)
    ctaLayout: getConfigValue(
      block.dataset.heroctaCtalayout,
      sectionData,
      ['heroctaCtalayout', 'dataHeroctaCtalayout'],
      'inline',
    ),
    ctaGap: getConfigValue(
      block.dataset.heroctaCtagap,
      sectionData,
      ['heroctaCtagap', 'dataHeroctaCtagap'],
      'medium',
    ),
    ctaTextTransform: getConfigValue(
      block.dataset.heroctaCtacase,
      sectionData,
      ['heroctaCtacase', 'dataHeroctaCtacase'],
      'uppercase',
    ),
    ctaFontSize: getConfigValue(
      block.dataset.heroctaCtasize,
      sectionData,
      ['heroctaCtasize', 'dataHeroctaCtasize'],
      '',
    ),
    slideTransition: getConfigValue(
      block.dataset.heroctaTransition,
      sectionData,
      ['heroctaTransition', 'dataHeroctaTransition'],
      'fade',
    ),
    imageFrameStyle: getConfigValue(
      block.dataset.heroctaFrame,
      sectionData,
      ['heroctaFrame', 'dataHeroctaFrame'],
      'default',
    ),
    buttonTextColor: getConfigValue(
      block.dataset.heroctaBtntext,
      sectionData,
      ['heroctaBtntext', 'dataHeroctaBtntext'],
      'white',
    ),
    buttonBorderColor: getConfigValue(
      block.dataset.heroctaBtncolor,
      sectionData,
      ['heroctaBtncolor', 'dataHeroctaBtncolor'],
      'transparent',
    ),
    // Primary button fill: Wahoo blue
    buttonFillColor: getConfigValue(
      block.dataset.heroctaBtnfill,
      sectionData,
      ['heroctaBtnfill', 'dataHeroctaBtnfill'],
      '#009FE3',
    ),
    sidebar: getConfigValue(
      block.dataset.heroctaSidebar,
      sectionData,
      ['heroctaSidebar', 'dataHeroctaSidebar'],
      '',
    ),
    // Default to full-width for edge-to-edge hero look
    layoutWidth: getConfigValue(
      block.dataset.heroctaWidth,
      sectionData,
      ['heroctaWidth', 'dataHeroctaWidth'],
      'full-width',
    ),
  };

  const {
    interval,
    slideRows,
    navEntries,
  } = parseTypedRows(rows);

  const wrapper = document.createElement('div');
  wrapper.className = 'hero-cta-slides';

  slideRows.forEach((row, index) => {
    wrapper.append(buildSlide(row, index === 0, config));
  });

  // Build slide dots if more than one slide
  let dotsEl = null;
  if (slideRows.length > 1) {
    dotsEl = buildDots(slideRows.length, () => {});
    wrapper.append(dotsEl);
  }

  // Build sidebar if enabled and nav rows exist
  const sidebarPosition = normalizeSidebar(config.sidebar);
  if (sidebarPosition && navEntries.length > 0) {
    const sidebar = buildSidebar(navEntries);
    const layout = document.createElement('div');
    layout.className = 'hero-cta-layout';

    if (['left', 'overlay-left', 'sticky-left'].includes(sidebarPosition)) {
      layout.append(sidebar, wrapper);
    } else {
      layout.append(wrapper, sidebar);
    }

    block.replaceChildren(layout);
  } else {
    block.replaceChildren(wrapper);
  }

  // Resolve by precedence tiers.
  // Tier 1: Layout
  const layoutConfig = {
    position: normalizePosition(config.position, 'bottom-left'),
    size: normalizeSize(config.size, 'tall'),
    sidebarPosition: normalizeSidebar(config.sidebar),
    layoutWidthRaw: normalizeLayoutWidth(config.layoutWidth, 'full-width'),
    overlayInset: normalizeOverlayInset(config.overlayInset, 'large'),
    contentMaxWidth: normalizeContentMaxWidth(config.contentMaxWidthRaw, 520),
    imageMaxWidth: normalizeImageMaxWidth(config.imageMaxWidthRaw, 2400),
  };
  layoutConfig.layoutWidth = layoutConfig.sidebarPosition ? 'default' : layoutConfig.layoutWidthRaw;

  // Tier 2: CTA/content structure
  const structureConfig = {
    ctaLayout: normalizeCtaLayout(config.ctaLayout, 'inline'),
    ctaGap: normalizeCtaGap(config.ctaGap, 'medium'),
    ctaTextTransform: normalizeCtaTextTransform(config.ctaTextTransform, 'uppercase'),
    ctaFontSize: normalizeCtaFontSize(config.ctaFontSize, 'default'),
    buttonWidthRaw: normalizeButtonWidth(config.buttonWidth, 'auto'),
  };
  structureConfig.buttonWidth = (
    !hasButtonWidthOverride && layoutConfig.size === 'short'
      ? 'medium'
      : structureConfig.buttonWidthRaw
  );

  // Tier 3: Style and shape
  const styleConfig = {
    buttonStyle: normalizeButtonStyle(config.buttonStyle, 'solid'),
    buttonCorner: normalizeButtonCorner(config.buttonCorner, ''),
    buttonBorderWidth: normalizeButtonBorderWidth(config.buttonBorderWidth, '0'),
  };

  // Tier 4: Explicit color overrides
  const colorConfig = {
    buttonBorderColor: normalizeButtonBorderColor(config.buttonBorderColor, 'transparent'),
    buttonFillColor: normalizeButtonFillColor(config.buttonFillColor, '#009FE3'),
    buttonTextColor: normalizeButtonTextColor(config.buttonTextColor, 'white'),
  };

  // Tier 5: Media and motion
  const motionConfig = {
    slideTransition: normalizeSlideTransition(config.slideTransition, 'fade'),
    imageFrameStyle: normalizeImageFrameStyle(config.imageFrameStyle, 'default'),
    buttonHoverStyle: normalizeButtonHoverStyle(config.buttonHoverStyle, 'pop'),
  };

  warnOnInvalidConfig('herocta-position', config.position, layoutConfig.position, 'bottom-left');
  warnOnInvalidConfig('herocta-size', config.size, layoutConfig.size, 'tall');
  warnOnInvalidConfig('herocta-btnstyle', config.buttonStyle, styleConfig.buttonStyle, 'solid');
  warnOnInvalidConfig('herocta-btnwidth', config.buttonWidth, structureConfig.buttonWidthRaw, 'auto');
  warnOnInvalidConfig('herocta-btncolor', config.buttonBorderColor, colorConfig.buttonBorderColor, 'transparent');
  warnOnInvalidConfig('herocta-btnfill', config.buttonFillColor, colorConfig.buttonFillColor, '#009FE3');
  warnOnInvalidConfig('herocta-btnhover', config.buttonHoverStyle, motionConfig.buttonHoverStyle, 'pop');
  warnOnInvalidConfig('herocta-btnborder', config.buttonBorderWidth, styleConfig.buttonBorderWidth, '0');
  warnOnInvalidConfig('herocta-inset', config.overlayInset, layoutConfig.overlayInset, 'large');
  warnOnInvalidConfig('herocta-contentwidth', config.contentMaxWidthRaw, layoutConfig.contentMaxWidth, '520');
  warnOnInvalidConfig('herocta-ctalayout', config.ctaLayout, structureConfig.ctaLayout, 'inline');
  warnOnInvalidConfig('herocta-ctagap', config.ctaGap, structureConfig.ctaGap, 'medium');
  warnOnInvalidConfig('herocta-ctacase', config.ctaTextTransform, structureConfig.ctaTextTransform, 'uppercase');
  warnOnInvalidConfig('herocta-ctasize', config.ctaFontSize, structureConfig.ctaFontSize, 'default');
  warnOnInvalidConfig('herocta-transition', config.slideTransition, motionConfig.slideTransition, 'fade');
  warnOnInvalidConfig('herocta-frame', config.imageFrameStyle, motionConfig.imageFrameStyle, 'default');
  warnOnInvalidConfig('herocta-btntext', config.buttonTextColor, colorConfig.buttonTextColor, 'white');
  warnOnInvalidConfig('herocta-sidebar', config.sidebar, layoutConfig.sidebarPosition || 'off', 'off');
  warnOnInvalidConfig('herocta-width', config.layoutWidth, layoutConfig.layoutWidthRaw, 'full-width');
  warnOnInvalidConfig('herocta-imgmax', config.imageMaxWidthRaw, layoutConfig.imageMaxWidth, '2400');
  if (layoutConfig.sidebarPosition && layoutConfig.layoutWidthRaw === 'full-width') {
    console.warn('hero-cta: herocta-width "full-width" is ignored when herocta-sidebar is enabled. Using "default".');
  }
  if (layoutConfig.sidebarPosition && navEntries.length === 0 && hasExplicitConfig.sidebar) {
    warnOnNoOpConfig(
      'herocta-sidebar',
      config.sidebar,
      'No typed nav rows are authored (Column 1 must be "nav"), so sidebar cannot render.',
    );
  }
  if (styleConfig.buttonStyle === 'link') {
    if (hasExplicitConfig.buttonCorner) {
      warnOnNoOpConfig(
        'herocta-btncorner',
        config.buttonCorner,
        'Link style uses underline treatment and ignores corner radius.',
      );
    }
    if (hasExplicitConfig.buttonBorderWidth) {
      warnOnNoOpConfig(
        'herocta-btnborder',
        config.buttonBorderWidth,
        'Link style does not render a button border width.',
      );
    }
    if (hasExplicitConfig.buttonBorderColor) {
      warnOnNoOpConfig(
        'herocta-btncolor',
        config.buttonBorderColor,
        'Link style does not render a button border color.',
      );
    }
    if (hasExplicitConfig.buttonFillColor) {
      warnOnNoOpConfig(
        'herocta-btnfill',
        config.buttonFillColor,
        'Link style does not render a button fill color.',
      );
    }
  }
  const maxButtonsPerSlide = Math.max(
    0,
    ...[...wrapper.querySelectorAll('.hero-cta-slide')]
      .map((slide) => slide.querySelectorAll('.hero-cta-actions .button').length),
  );
  if (structureConfig.ctaLayout === 'split' && maxButtonsPerSlide < 2 && hasExplicitConfig.ctaLayout) {
    warnOnNoOpConfig(
      'herocta-ctalayout',
      config.ctaLayout,
      'Split layout needs at least 2 CTA buttons per slide.',
    );
  }

  block.dataset.position = layoutConfig.position;
  block.dataset.size = layoutConfig.size;
  block.dataset.interval = interval;
  block.dataset.buttonStyle = styleConfig.buttonStyle;
  if (styleConfig.buttonCorner) {
    block.dataset.buttonCorner = styleConfig.buttonCorner;
  } else {
    delete block.dataset.buttonCorner;
  }
  block.dataset.buttonWidth = structureConfig.buttonWidth;
  block.dataset.layoutWidth = layoutConfig.layoutWidth;
  block.dataset.buttonHoverStyle = motionConfig.buttonHoverStyle;
  block.dataset.buttonBorderWidth = styleConfig.buttonBorderWidth;
  block.dataset.overlayInset = layoutConfig.overlayInset;
  block.dataset.ctaLayout = structureConfig.ctaLayout;
  block.dataset.ctaGap = structureConfig.ctaGap;
  block.dataset.ctaTextTransform = structureConfig.ctaTextTransform;
  block.dataset.ctaFontSize = structureConfig.ctaFontSize;
  block.dataset.slideTransition = motionConfig.slideTransition;
  block.dataset.imageFrameStyle = motionConfig.imageFrameStyle;
  block.dataset.imageMaxWidth = layoutConfig.imageMaxWidth.toString();

  block.style.setProperty('--hero-cta-content-max-width', `${layoutConfig.contentMaxWidth}px`);

  block.style.setProperty('--hero-cta-button-bg', resolveSurfaceColor(colorConfig.buttonFillColor));
  block.style.setProperty('--hero-cta-button-border', resolveSurfaceColor(colorConfig.buttonBorderColor));
  block.style.setProperty('--hero-cta-button-text-color', resolveButtonTextColor(colorConfig.buttonTextColor));
  block.style.setProperty('--hero-cta-button-border-width', `${styleConfig.buttonBorderWidth}px`);

  block.dataset.buttonColor = colorConfig.buttonBorderColor;
  block.dataset.buttonFill = colorConfig.buttonFillColor;
  block.dataset.buttonTextColor = colorConfig.buttonTextColor;

  if (layoutConfig.sidebarPosition) {
    block.dataset.sidebar = layoutConfig.sidebarPosition;
  } else {
    delete block.dataset.sidebar;
  }

  const slides = [...block.querySelectorAll('.hero-cta-slide')];
  if (slides.length) slides[0].classList.add('is-active');

  // Activate first dot
  const firstDot = block.querySelector('.hero-cta-dot');
  if (firstDot) firstDot.classList.add('is-active');

  startRotation(slides, interval, block.querySelector('.hero-cta-dots'));

  // Remove loading state when first image loads
  const firstImage = block.querySelector('.hero-cta-media img');
  if (firstImage) {
    if (firstImage.complete) {
      delete block.dataset.loading;
    } else {
      firstImage.addEventListener('load', () => {
        delete block.dataset.loading;
      });
      // Fallback: remove loading after 3 seconds
      setTimeout(() => {
        delete block.dataset.loading;
      }, 3000);
    }
  } else {
    // No images, remove loading immediately
    delete block.dataset.loading;
  }
}
