document.getElementById('current-year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function applyReveal(root = document) {
  root.querySelectorAll('.reveal').forEach((element, index) => {
    if (element.dataset.revealBound === 'true') {
      return;
    }

    element.dataset.revealBound = 'true';
    element.style.transitionDelay = `${Math.min(index * 0.04, 0.28)}s`;
    observer.observe(element);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function renderTags(tags = []) {
  return tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
}

function renderSocialIcon(platform) {
  switch ((platform || '').toLowerCase()) {
    case 'github':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>';
    case 'x':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>';
    case 'linkedin':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>';
    default:
      return '';
  }
}

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url);
}

function renderCard(item) {
  const rawUrl = item.url || item.href || '#';
  const url = escapeHtml(rawUrl);
  const title = escapeHtml(item.title || 'Untitled');
  const description = escapeHtml(item.description || '');
  const mediaLabel = escapeHtml(item.mediaLabel || 'No Image Provided');
  const emoji = item.emoji ? `<span class="project-media-emoji" aria-hidden="true">${escapeHtml(item.emoji)}</span>` : '';
  const image = item.image
    ? `<img src="${escapeHtml(item.image)}" alt="${title} preview" loading="lazy" decoding="async">`
    : `${emoji || `<span>${mediaLabel}</span>`}`;
  const shouldOpenExternally = item.external || isExternalUrl(rawUrl);
  const external = shouldOpenExternally ? ' target="_blank" rel="noopener noreferrer"' : '';
  const previewSource = !item.image && shouldOpenExternally ? ` data-preview-url="${url}"` : '';

  return `
    <a class="project-card reveal" href="${url}"${external}${previewSource}>
      <div class="project-media">${image}</div>
      <div class="project-body">
        <div class="project-title-row"><h3>${title}</h3><span class="arrow-icon">&nearr;</span></div>
        <p>${description}</p>
        <div class="tag-row">${renderTags(item.tags)}</div>
      </div>
    </a>
  `;
}

function renderProfile(profile) {
  const socialLinks = document.getElementById('social-links');
  const heroBadge = document.getElementById('hero-badge');
  const heroTitle = document.getElementById('hero-title');
  const heroRealName = document.getElementById('hero-real-name');
  const heroCopy = document.getElementById('hero-copy');
  const heroGithub = document.getElementById('hero-github');
  const profileOutput = document.getElementById('profile-output');

  if (socialLinks && Array.isArray(profile.socialLinks)) {
    socialLinks.innerHTML = profile.socialLinks.map((link) => (
      `<a href="${escapeHtml(link.url || '#')}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(link.label || link.platform || 'Social link')}">${renderSocialIcon(link.platform)}</a>`
    )).join('');
  }

  if (heroBadge && profile.availability) {
    heroBadge.textContent = profile.availability;
  }

  if (heroTitle && profile.name) {
    heroTitle.textContent = profile.name;
  }

  if (heroRealName && profile.realName) {
    heroRealName.textContent = profile.realName;
  }

  if (heroCopy && profile.headline) {
    heroCopy.textContent = profile.headline;
  }

  if (heroGithub && profile.githubUrl) {
    heroGithub.href = profile.githubUrl;
  }

  if (profileOutput) {
    const fields = [
      ['name', profile.name],
      ['role', profile.role],
      ['mission', profile.mission],
    ].filter(([, value]) => Boolean(value));

    profileOutput.innerHTML = fields.map(([key, value]) => (
      `<p><span>"${escapeHtml(key)}"</span><b>:</b> <em>"${escapeHtml(value)}"</em>${key === fields[fields.length - 1][0] ? '' : ','}</p>`
    )).join('');
  }
}

function renderTechnologies(technologies = []) {
  const techRow = document.getElementById('tech-row');

  if (!techRow) {
    return;
  }

  techRow.innerHTML = technologies.map((technology) => (
    `<span class="tech-pill ${escapeHtml(technology.className || '')}">${escapeHtml(technology.name || '')}</span>`
  )).join('');
}

function renderCollection(elementId, items) {
  const container = document.getElementById(elementId);

  if (!container) {
    return;
  }

  container.innerHTML = items.map(renderCard).join('');
  applyReveal(container);
}

function renderProjectGroups(elementId, groups) {
  const container = document.getElementById(elementId);

  if (!container) {
    return;
  }

  container.innerHTML = groups.map(({ title, description, items }) => `
    <section class="project-group reveal">
      <div class="project-group-heading">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
      </div>
      <div class="card-grid three-up">${items.map(renderCard).join('')}</div>
    </section>
  `).join('');

  applyReveal(container);
}

function buildProjectGroups(items) {
  const categoryMeta = {
    Production: 'Shipped applications and product-focused work.',
    Mini: 'Smaller experiments, games, and interactive builds.',
  };
  const order = ['Production', 'Mini'];
  const buckets = new Map();

  items.forEach((item) => {
    const category = item.category || 'Other';
    const bucket = buckets.get(category) || [];
    bucket.push(item);
    buckets.set(category, bucket);
  });

  return order
    .filter((category) => buckets.has(category))
    .concat(Array.from(buckets.keys()).filter((category) => !order.includes(category)))
    .map((category) => ({
      title: category,
      description: categoryMeta[category] || 'Additional work.',
      items: buckets.get(category) || [],
    }));
}

async function fetchSocialPreview(projectUrl) {
  const requestUrl = `https://api.microlink.io/?url=${encodeURIComponent(projectUrl)}&filter=image.url`;
  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch social preview for ${projectUrl}: ${response.status}`);
  }

  const payload = await response.json();
  return payload?.data?.image?.url || null;
}

async function hydrateProjectPreviews() {
  const projectCards = document.querySelectorAll('#projects-grid [data-preview-url]');

  await Promise.all(Array.from(projectCards, async (card) => {
    const projectUrl = card.dataset.previewUrl;

    if (!projectUrl || !isExternalUrl(projectUrl)) {
      return;
    }

    try {
      const previewImage = await fetchSocialPreview(projectUrl);

      if (!previewImage) {
        return;
      }

      const media = card.querySelector('.project-media');

      if (!media) {
        return;
      }

      media.innerHTML = `<img src="${escapeHtml(previewImage)}" alt="${escapeHtml(card.querySelector('h3')?.textContent || 'Project')} preview" loading="lazy" decoding="async">`;
      delete card.dataset.previewUrl;
    } catch (error) {
      console.warn(`Unable to fetch social preview for ${projectUrl}.`, error);
    }
  }));
}

async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }

  return response.json();
}

async function initSiteData() {
  try {
    const [profile, technologies, projects] = await Promise.all([
      loadJson('./data/profile.json'),
      loadJson('./data/technologies.json'),
      loadJson('./data/projects.json'),
    ]);

    renderProfile(profile);
    renderTechnologies(technologies);
    renderProjectGroups('projects-grid', buildProjectGroups(projects));
    await hydrateProjectPreviews();
  } catch (error) {
    console.error('Unable to load site data.', error);
  }
}

applyReveal();
initSiteData();
