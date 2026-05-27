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
  const heroBadge = document.getElementById('hero-badge');
  const heroTitle = document.getElementById('hero-title');
  const heroCopy = document.getElementById('hero-copy');
  const heroGithub = document.getElementById('hero-github');
  const profileOutput = document.getElementById('profile-output');

  if (heroBadge && profile.availability) {
    heroBadge.textContent = profile.availability;
  }

  if (heroTitle && profile.name) {
    heroTitle.textContent = profile.name;
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

function renderCollection(elementId, items) {
  const container = document.getElementById(elementId);

  if (!container) {
    return;
  }

  container.innerHTML = items.map(renderCard).join('');
  applyReveal(container);
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
    const [profile, projects, games] = await Promise.all([
      loadJson('./data/profile.json'),
      loadJson('./data/projects.json'),
      loadJson('./data/games.json'),
    ]);

    renderProfile(profile);
    renderCollection('projects-grid', projects);
    renderCollection('games-grid', games);
    await hydrateProjectPreviews();
  } catch (error) {
    console.error('Unable to load site data.', error);
  }
}

applyReveal();
initSiteData();
