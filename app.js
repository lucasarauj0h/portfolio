"use strict";

(() => {
  const content = window.portfolioContent;
  if (!content) return;

  const icon = '<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>';
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  const safeURL = (value) => {
    const url = new URL(value, window.location.href);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('URL de projeto inválida');
    return url.href;
  };

  document.querySelectorAll('[data-profile]').forEach((element) => {
    const key = element.dataset.profile;
    if (!(key in content.profile)) return;
    if (key === 'bio') {
      element.replaceChildren(...content.profile.bio.map(text => { const p = document.createElement('p'); p.textContent = text; return p; }));
    } else if (['github', 'linkedin'].includes(key)) element.href = safeURL(content.profile[key]);
    else element.textContent = content.profile[key];
  });

  // Dados curriculares editáveis em content.js; nenhuma data ou credencial é inferida.
  const resume = content.resume;
  if (resume) {
    const decorativeIcon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
    const awardCard = (heading = 'h4') => {
      const article = document.createElement('article');
      article.className = 'highlight-card highlight-award';
      article.innerHTML = `<span class="award-rank" aria-hidden="true">1º<span>LUGAR</span></span><div><span class="highlight-label">PESQUISA PREMIADA</span><${heading}>${escapeHTML(resume.award.title)}</${heading}><p class="highlight-organization">${escapeHTML(resume.award.organization)}</p><p>${escapeHTML(resume.award.description)}</p></div>${decorativeIcon('trophy')}`;
      return article;
    };
    const courseCard = (course, compact = false) => {
      const article = document.createElement('article');
      article.className = compact ? 'highlight-card' : `course-card${course.highlight ? ' course-featured' : ''}`;
      const certificate = course.certificate ? `<a class="text-link" href="${escapeHTML(safeURL(course.certificate))}" target="_blank" rel="noopener noreferrer" aria-label="Certificado de ${escapeHTML(course.title)} (abre em nova aba)">Certificado ↗</a>` : '';
      const courseLink = !compact && course.url ? `<a class="text-link" href="${escapeHTML(safeURL(course.url))}" target="_blank" rel="noopener noreferrer">Sobre o curso ↗</a>` : '';
      article.innerHTML = `${compact ? '<span class="highlight-label">FORMAÇÃO EM DESTAQUE</span>' : ''}<h4>${escapeHTML(course.title)}</h4><p class="course-organization">${escapeHTML(course.organization)}</p>${course.status ? `<span class="course-status">${escapeHTML(course.status)}</span>` : ''}<p>${escapeHTML(course.description)}</p>${certificate || courseLink ? `<div class="course-links">${certificate}${courseLink}</div>` : ''}`;
      return article;
    };
    const fillTimeline = (selector, entries) => {
      document.querySelector(selector).replaceChildren(...entries.map(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="timeline-marker"></span>${entry.period ? `<span class="timeline-date">${escapeHTML(entry.period)}</span>` : ''}<h4>${escapeHTML(entry.title)}</h4><p class="organization">${escapeHTML(entry.organization)}</p><p>${escapeHTML(entry.description)}</p>${entry.result ? `<p class="career-result">${escapeHTML(entry.result)}</p>` : ''}`;
        return li;
      }));
    };
    document.querySelector('#profile-highlights').replaceChildren(awardCard(), ...resume.courses.filter(course => course.highlight).map(course => courseCard(course, true)));
    document.querySelector('#resume-award').replaceChildren(awardCard('h3'));
    fillTimeline('#resume-experience', resume.experience);
    fillTimeline('#resume-education', resume.education);
    fillTimeline('#resume-volunteering', resume.volunteering);
    document.querySelector('#resume-courses').replaceChildren(...resume.courses.map(course => courseCard(course)));
    document.querySelector('#resume-skills').replaceChildren(...resume.skills.map(group => {
      const article = document.createElement('article');
      article.className = 'skill-group';
      article.innerHTML = `<h4>${escapeHTML(group.title)}</h4><ul class="tech-list">${group.items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
      return article;
    }));
    document.querySelector('#resume-languages').replaceChildren(...resume.languages.map(language => {
      const article = document.createElement('article');
      article.className = 'language-card';
      article.innerHTML = `<h4>${escapeHTML(language.title)}</h4><p>${escapeHTML(language.description)}</p>`;
      return article;
    }));
  }

  // Ilustrações próprias em SVG: não dependem de imagens ou logos de terceiros.
  function artwork(type) {
    const grid = '<g stroke="#ffffff09" stroke-width="1"><path d="M0 60h440M0 110h440M0 160h440M70 0v240M140 0v240M210 0v240M280 0v240M350 0v240"/></g>';
    let art = '';
    if (type === 'charts') art = '<g fill="#cc092f"><rect x="68" y="133" width="23" height="52" rx="3"/><rect x="102" y="107" width="23" height="78" rx="3"/><rect x="136" y="79" width="23" height="106" rx="3"/><rect x="170" y="117" width="23" height="68" rx="3"/></g><path d="M238 175c17 0 24-113 55-113s39 113 65 113" fill="none" stroke="#ff718b" stroke-width="3"/><path d="M238 175c17 0 24-113 55-113s39 113 65 113" fill="#cc092f20"/><path d="M55 188h148m27 0h138" stroke="#b3718355"/><g fill="#ffb9c7"><circle cx="76" cy="81" r="3"/><circle cx="111" cy="66" r="3"/><circle cx="150" cy="48" r="3"/></g><path d="m76 81 35-15 39-18" stroke="#ffb9c7" stroke-width="1.5" fill="none"/>';
    if (type === 'math') art = '<g fill="none" stroke="#b34e64" stroke-width="1.4"><path d="M65 177h137M84 190V54"/><path d="M89 160Q145 160 183 58" stroke="#ff718b" stroke-width="3"/><circle cx="156" cy="121" r="34"/><path d="M278 164 329 68l51 96z" stroke="#ff718b" stroke-width="2"/><path d="M329 68v96" stroke-dasharray="4 5"/></g><g fill="#edd1d9" font-family="Georgia,serif" font-style="italic"><text x="224" y="71" font-size="24">ƒ(x)</text><text x="250" y="206" font-size="22">a² + b² = c²</text></g>';
    if (type === 'rag') art = '<g stroke="#75414e" stroke-width="1.5" fill="none"><path d="M122 86h73l37 35h63M122 151h73l37-30" stroke-dasharray="5 5"/></g><g fill="#2d1d25" stroke="#a0455c"><rect x="59" y="55" width="65" height="54" rx="8"/><rect x="59" y="130" width="65" height="54" rx="8"/><rect x="192" y="89" width="59" height="63" rx="12"/><rect x="295" y="73" width="91" height="96" rx="12"/></g><g stroke="#ff899f" stroke-width="2" stroke-linecap="round"><path d="M75 73h32M75 83h23M75 93h28M75 148h32M75 158h25M75 168h28M311 96h55M311 109h39M311 122h48M311 135h27"/></g><g fill="#ff718b"><circle cx="211" cy="109" r="4"/><circle cx="232" cy="109" r="4"/><circle cx="222" cy="133" r="4"/></g><path d="m211 109 21 0-10 24z" fill="none" stroke="#ff718b"/>';
    if (type === 'islp') art = '<g fill="none" stroke="#8f3c51" stroke-width="1"><path d="M65 185V48M65 185h150M236 185V48M236 185h150"/><path d="m75 169 123-98" stroke="#ff718b" stroke-width="2"/><path d="M247 165c32 0 24-102 61-102s28 102 68 102" stroke="#ff718b" stroke-width="2"/></g><g fill="#df718b"><circle cx="85" cy="154" r="4"/><circle cx="100" cy="163" r="3"/><circle cx="115" cy="131" r="4"/><circle cx="135" cy="139" r="3"/><circle cx="148" cy="105" r="4"/><circle cx="171" cy="104" r="3"/><circle cx="185" cy="87" r="4"/></g><g fill="#cc092f50"><rect x="258" y="147" width="15" height="38" rx="2"/><rect x="281" y="116" width="15" height="69" rx="2"/><rect x="304" y="85" width="15" height="100" rx="2"/><rect x="327" y="127" width="15" height="58" rx="2"/><rect x="350" y="155" width="15" height="30" rx="2"/></g>';
    if (type === 'llm') {
      const points = [[83,76],[83,122],[83,168],[180,53],[180,99],[180,145],[180,191],[277,76],[277,122],[277,168],[365,122]];
      art = '<g stroke="#84404f" stroke-width="1" opacity=".6">';
      for (let x = 0; x < 3; x++) for (const p of points.filter(p => p[0] === [83,180,277][x])) for (const q of points.filter(p => p[0] === [180,277,365][x])) art += `<path d="M${p[0]} ${p[1]} ${q[0]} ${q[1]}"/>`;
      art += '</g><g fill="#421e2c" stroke="#e46d89" stroke-width="1.5">' + points.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="9"/>`).join('') + '</g><path d="m83 122 97-23 97 69 88-46" fill="none" stroke="#ff718b" stroke-width="2"/>';
    }
    return `<svg viewBox="0 0 440 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="440" height="240" fill="#20161c"/>${grid}<circle cx="389" cy="13" r="147" fill="#cc092f0a"/>${art}<text x="22" y="224" fill="#b67e8e" font-family="monospace" font-size="8" letter-spacing="2">${{charts:'EXPLORE / DISCOVER',math:'LEARN / PRACTICE',rag:'RETRIEVE / GENERATE',islp:'MODEL / UNDERSTAND',llm:'TOKENS / REPRESENTATIONS'}[type] || ''}</text></svg>`;
  }

  function projectCard(project) {
    const link = document.createElement('a');
    link.className = 'project-card';
    link.href = safeURL(project.url);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${project.title} — ${project.linkLabel} (abre em nova aba)`);
    link.innerHTML = `<div class="project-image">${project.media?.[0] ? `<img src="${escapeHTML(safeURL(project.media[0].src))}" alt="" width="${project.media[0].width}" height="${project.media[0].height}" loading="lazy">` : artwork(project.artwork)}<span class="project-visit">${icon}</span></div><div class="project-copy"><span class="project-label">${escapeHTML(project.label)}</span><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description)}</p><ul class="tag-list">${project.tags.map(tag=>`<li>${escapeHTML(tag)}</li>`).join('')}</ul><span class="project-action">${escapeHTML(project.linkLabel)} ${icon}</span></div>`;
    return link;
  }

  document.querySelector('#featured-projects').replaceChildren(...content.projects.filter(project => project.featured).map(projectCard));

  const projectJourney = document.querySelector('#project-journey');
  const projectList = document.querySelector('#project-list');
  const lightbox = document.querySelector('#project-lightbox');
  let lightboxMedia = [];
  let lightboxIndex = 0;
  const mediaImage = (media, lazy = true) => `<img src="${escapeHTML(safeURL(media.src))}" alt="${escapeHTML(media.alt)}" width="${media.width}" height="${media.height}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
  function renderLightbox() {
    const media = lightboxMedia[lightboxIndex];
    const img = lightbox.querySelector('img');
    img.src = safeURL(media.src);
    img.alt = media.alt;
    lightbox.querySelector('h2').textContent = media.title;
    lightbox.querySelector('[data-lightbox-count]').textContent = `${lightboxIndex + 1} / ${lightboxMedia.length}`;
    lightbox.querySelector('[data-lightbox-previous]').hidden = lightboxMedia.length < 2;
    lightbox.querySelector('[data-lightbox-next]').hidden = lightboxMedia.length < 2;
    lightbox.classList.remove('is-zoomed');
    lightbox.querySelector('[data-lightbox-zoom]').setAttribute('aria-pressed', 'false');
    lightbox.querySelector('[data-lightbox-zoom]').textContent = 'Ampliar';
  }
  function openProjectImage(media, index) {
    lightboxMedia = media;
    lightboxIndex = index;
    renderLightbox();
    lightbox.showModal();
    document.body.classList.add('image-open');
  }
  function stepLightbox(step) {
    lightboxIndex = (lightboxIndex + step + lightboxMedia.length) % lightboxMedia.length;
    renderLightbox();
  }
  lightbox.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('close', () => document.body.classList.remove('image-open'));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  lightbox.querySelector('[data-lightbox-previous]').addEventListener('click', () => stepLightbox(-1));
  lightbox.querySelector('[data-lightbox-next]').addEventListener('click', () => stepLightbox(1));
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); stepLightbox(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); stepLightbox(1); }
  });
  lightbox.querySelector('[data-lightbox-zoom]').addEventListener('click', event => {
    const zoom = lightbox.classList.toggle('is-zoomed');
    event.currentTarget.setAttribute('aria-pressed', String(zoom));
    event.currentTarget.textContent = zoom ? 'Enquadrar' : 'Ampliar';
  });
  function projectFigure(project, index) {
    const media = project.media[index];
    const figure = document.createElement('figure');
    figure.className = 'story-figure';
    figure.innerHTML = `<button class="story-image" type="button" aria-label="Ampliar: ${escapeHTML(media.title)}">${mediaImage(media)}<span class="image-expand" aria-hidden="true">Ampliar ↗</span></button><figcaption><strong>${escapeHTML(media.title)}</strong><span>${escapeHTML(media.caption)}</span></figcaption>`;
    figure.querySelector('button').addEventListener('click', () => openProjectImage(project.media, index));
    return figure;
  }
  function projectGallery(project) {
    const gallery = document.createElement('div');
    gallery.className = 'story-gallery';
    const stage = document.createElement('div');
    stage.className = 'gallery-stage';
    stage.setAttribute('aria-live','polite');
    const choices = document.createElement('div');
    choices.className = 'gallery-choices';
    choices.setAttribute('role','group');
    choices.setAttribute('aria-label', `Experimentos de ${project.title}`);
    function select(index) {
      stage.replaceChildren(projectFigure(project, index));
      [...choices.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    }
    project.media.forEach((media, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-choice';
      button.setAttribute('aria-label', `Mostrar: ${media.title}`);
      button.innerHTML = `${mediaImage(media)}<span><small>0${index + 1}</small>${escapeHTML(media.title)}</span>`;
      button.addEventListener('click', () => select(index));
      choices.append(button);
    });
    gallery.append(stage, choices);
    select(0);
    return gallery;
  }
  const detailsDialog = document.querySelector('#project-details');
  const detailsBody = document.querySelector('#project-details-body');
  detailsDialog.querySelector('[data-details-close]').addEventListener('click', () => detailsDialog.close());
  detailsDialog.addEventListener('close', () => document.body.classList.remove('project-details-open'));
  detailsDialog.addEventListener('click', event => { if (event.target === detailsDialog) detailsDialog.close(); });
  function openProjectDetails(project) {
    document.querySelector('#project-details-title').textContent = project.title;
    detailsBody.innerHTML = `<span class="story-kicker">${escapeHTML(project.label)}</span><p class="details-intro">${escapeHTML(project.description)}</p><div class="story-context">${project.details.map(text => `<p>${escapeHTML(text)}</p>`).join('')}</div><ul class="tag-list story-tags">${project.tags.map(tag => `<li>${escapeHTML(tag)}</li>`).join('')}</ul><div class="story-actions"><a class="story-link" href="${escapeHTML(safeURL(project.url))}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.linkLabel)} ↗</a>${project.repository ? `<a class="story-source" href="${escapeHTML(safeURL(project.repository))}" target="_blank" rel="noopener noreferrer">Repositório no GitHub ↗</a>` : ''}</div><div class="story-media"></div>`;
    const media = detailsBody.querySelector('.story-media');
    if (project.gallery) media.append(projectGallery(project));
    else project.media.forEach((_, index) => {
      if (project.question && index === (project.questionBeforeMedia ?? 1)) {
        const question = document.createElement('div');
        question.className = 'story-question';
        question.innerHTML = `<span class="story-kicker">Da pergunta à apresentação</span><h3>Um exemplo de consulta</h3><blockquote lang="en">${escapeHTML(project.question)}</blockquote><p>Um dos slides gerados para essa pergunta, com as referências às evidências utilizadas.</p>`;
        media.append(question);
      }
      media.append(projectFigure(project,index));
    });
    detailsDialog.showModal();
    document.body.classList.add('project-details-open');
    detailsBody.scrollTop = 0;
  }

  let activeProject = 0;
  let projectFrame;
  const projectSheets = [];
  const routeButtons = [];
  const projectCounter = document.querySelector('#project-counter');
  const previousProject = document.querySelector('[data-project-previous]');
  const nextProject = document.querySelector('[data-project-next]');
  const projectPreviews = document.querySelector('#project-preview-grid');
  function renderProjectPreviews() {
    const others = content.projects.map((project,index) => ({project,index})).filter(entry => entry.index !== activeProject);
    projectPreviews.replaceChildren(...others.map(({project,index},position) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'project-preview';
      button.style.setProperty('--preview-tilt', `${[-.6,.7,.45,-.5][position]}deg`);
      button.setAttribute('aria-label', `Explorar as fases de ${project.title}`);
      button.innerHTML = `<span class="preview-art">${mediaImage(project.media[0])}<span class="preview-number" aria-hidden="true">0${index + 1}</span></span><span class="preview-copy"><span class="preview-category">${escapeHTML(project.label)}</span><strong class="preview-title">${escapeHTML(project.title)}</strong><span class="preview-summary">${escapeHTML(project.description)}</span><span class="preview-action">Explorar as fases <span aria-hidden="true">↗</span></span></span>`;
      button.addEventListener('click', () => {
        showProject(index);
        const heading = projectSheets[index].querySelector('h3');
        heading.setAttribute('tabindex','-1');
        heading.focus({preventScroll:true});
        projectSheets[index].scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
      });
      return button;
    }));
    document.querySelector('#project-discovery-count').textContent = `${String(others.length).padStart(2,'0')} projetos`;
  }
  function showProject(index) {
    if (index < 0 || index >= content.projects.length) return;
    const direction = index >= activeProject ? 'next' : 'previous';
    activeProject = index;
    projectSheets.forEach((sheet, i) => {
      sheet.hidden = i !== index;
      sheet.dataset.direction = direction;
    });
    routeButtons.forEach((button,i) => {
      if (i === index) button.setAttribute('aria-current','step');
      else button.removeAttribute('aria-current');
    });
    projectCounter.textContent = `Projeto ${String(index + 1).padStart(2,'0')} de ${String(content.projects.length).padStart(2,'0')}`;
    previousProject.disabled = index === 0;
    nextProject.disabled = index === content.projects.length - 1;
    renderProjectPreviews();
    scheduleProjects();
  }
  content.projects.forEach((project, index) => {
    const item = document.createElement('li');
    item.className = 'project-sheet';
    item.hidden = index !== 0;
    item.id = `projeto-${project.id}`;
    item.innerHTML = `<article aria-labelledby="${item.id}-title"><header class="sheet-header"><span class="story-kicker">${escapeHTML(project.label)}</span><h3 id="${item.id}-title">${escapeHTML(project.title)}</h3></header><div class="phase-tabs" role="group" aria-label="Fases de ${escapeHTML(project.title)}"></div><div class="project-phase-stage" tabindex="0" role="region" aria-label="Conteúdo das fases de ${escapeHTML(project.title)}. Use as setas para navegar."></div><div class="phase-navigation"><button type="button" class="phase-arrow" data-phase-previous aria-label="Fase anterior de ${escapeHTML(project.title)}">←</button><span class="phase-position" aria-live="polite"></span><button type="button" class="phase-arrow" data-phase-next aria-label="Próxima fase de ${escapeHTML(project.title)}">→</button></div><footer class="sheet-footer"><button type="button" class="project-detail-button">Conhecer o projeto <span aria-hidden="true">↗</span></button><a href="${escapeHTML(safeURL(project.url))}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.linkLabel)} ↗</a></footer></article>`;
    const stage = item.querySelector('.project-phase-stage');
    const tabs = item.querySelector('.phase-tabs');
    const back = item.querySelector('[data-phase-previous]');
    const forward = item.querySelector('[data-phase-next]');
    let phaseIndex = 0;
    function selectPhase(next) {
      if (next < 0 || next >= project.phases.length) return;
      const direction = next >= phaseIndex ? 'next' : 'previous';
      phaseIndex = next;
      const phase = project.phases[next];
      const page = document.createElement('div');
      page.className = `project-phase-page${phase.question ? ' has-question' : ''}`;
      page.dataset.direction = direction;
      page.innerHTML = `<div class="phase-copy"><h4>${escapeHTML(phase.title)}</h4>${phase.question ? `<blockquote lang="en">${escapeHTML(project.question)}</blockquote>` : ''}<p>${escapeHTML(phase.text)}</p></div><button type="button" class="phase-image story-image" aria-label="Ampliar: ${escapeHTML(project.media[phase.media].title)}">${mediaImage(project.media[phase.media],false)}<span class="image-expand" aria-hidden="true">Ampliar ↗</span></button>`;
      page.querySelector('button').addEventListener('click', () => openProjectImage(project.media,phase.media));
      stage.replaceChildren(page);
      [...tabs.children].forEach((button,i) => button.setAttribute('aria-pressed',String(i === next)));
      item.querySelector('.phase-position').textContent = `${next + 1} / ${project.phases.length}`;
      back.disabled = next === 0;
      forward.disabled = next === project.phases.length - 1;
    }
    project.phases.forEach((phase, phaseNumber) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `${project.shortLabel}: fase ${phaseNumber + 1}, ${phase.title}`);
      button.innerHTML = `<span class="phase-tab-number">0${phaseNumber + 1}</span>`;
      button.addEventListener('click', () => selectPhase(phaseNumber));
      tabs.append(button);
    });
    back.addEventListener('click', () => selectPhase(phaseIndex - 1));
    forward.addEventListener('click', () => selectPhase(phaseIndex + 1));
    stage.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); selectPhase(phaseIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); selectPhase(phaseIndex + 1); }
    });
    let pointerStart;
    let swiped = false;
    stage.addEventListener('pointerdown', event => {
      swiped = false;
      pointerStart = event.pointerType === 'touch' || event.pointerType === 'pen' ? {x:event.clientX,y:event.clientY} : null;
    });
    stage.addEventListener('pointerup', event => {
      if (!pointerStart) return;
      const dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        swiped = true;
        selectPhase(phaseIndex + (dx < 0 ? 1 : -1));
      }
      pointerStart = null;
    });
    stage.addEventListener('pointercancel', () => { pointerStart = null; });
    stage.addEventListener('click', event => { if (swiped) { event.preventDefault(); event.stopPropagation(); swiped = false; } },true);
    item.querySelector('.project-detail-button').addEventListener('click', () => openProjectDetails(project));
    selectPhase(0);
    projectList.append(item);
    projectSheets.push(item);

    const routeButton = document.createElement('button');
    routeButton.type = 'button';
    routeButton.className = 'project-waypoint';
    routeButton.style.setProperty('--waypoint-index',String(index));
    routeButton.style.top = `${[57,15,68,8,53][index]}px`;
    routeButton.setAttribute('aria-label',`Projeto ${index + 1}: ${project.title}`);
    routeButton.innerHTML = `<span class="waypoint-dot">0${index + 1}</span><span class="waypoint-label">${escapeHTML(project.shortLabel)}</span>`;
    routeButton.addEventListener('click', () => showProject(index));
    document.querySelector('#project-index').append(routeButton);
    routeButtons.push(routeButton);
  });
  previousProject.addEventListener('click', () => showProject(activeProject - 1));
  nextProject.addEventListener('click', () => showProject(activeProject + 1));
  function layoutProjects() {
    const map = projectJourney.querySelector('.project-map');
    if (!map.offsetWidth) return;
    const bounds = map.getBoundingClientRect();
    const points = [...map.querySelectorAll('.waypoint-dot')].map(node => { const box = node.getBoundingClientRect(); return {x:box.left - bounds.left + box.width / 2,y:box.top - bounds.top + box.height / 2}; });
    const svg = map.querySelector('.project-route');
    svg.setAttribute('viewBox',`0 0 ${map.clientWidth} ${map.clientHeight}`);
    let path = '';
    points.forEach((point,index) => {
      if (!index) { path = `M ${point.x} ${point.y}`; return; }
      const prev = points[index - 1], distance = point.x - prev.x;
      path += ` C ${prev.x + distance * .55} ${prev.y}, ${point.x - distance * .55} ${point.y}, ${point.x} ${point.y}`;
    });
    svg.querySelectorAll('path').forEach(node => node.setAttribute('d',path));
  }
  function scheduleProjects() { cancelAnimationFrame(projectFrame); projectFrame = requestAnimationFrame(layoutProjects); }
  new ResizeObserver(scheduleProjects).observe(projectJourney);
  showProject(0);

  // Etapas explícitas e um eixo curvo contínuo; edições e fontes ficam em content.js.
  const readingGroups = [
    {status: 'completed', label: 'Lidos', title: 'Leituras concluídas', caption: 'Fundamentos que já fazem parte da minha formação.', marker: '✓'},
    {status: 'reading', label: 'Lendo', title: 'Lendo agora', caption: 'Os temas que estão na minha mesa de estudos.', marker: '●'},
    {status: 'planned', label: 'A ler', title: 'Próximas leituras', caption: 'Novas perguntas e os próximos caminhos.', marker: '○'}
  ];
  const journey = document.querySelector('#reading-journey');
  const stops = document.querySelector('#journey-stops');
  let journeyFrame;
  function bookStop(book, index, group) {
    const progress = Math.max(0, Math.min(100, Number(book.progress) || 0));
    const percentage = `${book.status === 'reading' ? '≈ ' : ''}${progress}%`;
    const item = document.createElement('li');
    item.className = `book-stop book-${book.status}${index % 2 ? ' book-right' : ''}`;
    item.id = `book-${book.id}`;
    item.style.setProperty('--bend', `${[-18, 23, -30, 12, 27, -9][index % 6]}px`);
    item.style.setProperty('--nudge', `${[0, 15, -6, 10, 4][index % 5]}px`);
    const cover = book.cover ? `<img src="${escapeHTML(book.cover)}" alt="" width="110" height="160" loading="lazy">` : `<span class="catalog-type-cover"><span>${escapeHTML(book.publisher)}</span><strong>${book.id === 'attention' ? 'Attention<br>Is All<br>You Need' : escapeHTML(book.title)}</strong><small>${book.id === 'attention' ? 'RESEARCH PAPER' : 'EDIÇÃO DIGITAL'}</small></span>`;
    const authors = book.id === 'islp-book' ? 'Gareth James et al.' : book.authors;
    const status = book.status === 'reading' ? `Capítulo ${book.chapter}` : group.label;
    // Only the owner's personal study repositories receive a GitHub badge.
    const repository = book.repository ? new URL(safeURL(book.repository)) : null;
    const personalRepository = repository?.hostname === 'github.com' && repository.pathname.toLowerCase().startsWith('/lucasarauj0h/');
    item.innerHTML = `<div class="catalog-card"><button type="button" class="book-turn" aria-label="Ver descrição de ${escapeHTML(book.title)}" aria-expanded="false" aria-controls="description-${escapeHTML(book.id)}"><span class="book-flipper"><span class="catalog-face catalog-front"><span class="catalog-main"><span class="catalog-cover">${cover}</span><span class="catalog-copy"><span class="catalog-publisher">${escapeHTML(book.publisher)}</span><span class="catalog-title" title="${escapeHTML(book.title + (book.subtitle ? ": " + book.subtitle : ""))}">${escapeHTML(book.title)}</span><span class="catalog-authors">${escapeHTML(authors)}</span><span class="catalog-edition">${escapeHTML(book.edition)}</span></span></span><span class="catalog-progress-label"><span>${escapeHTML(status)}</span><strong>${percentage}</strong></span><span class="catalog-progress" role="progressbar" aria-label="Avanço de ${escapeHTML(book.title)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span style="width:${progress}%"></span></span></span><span class="catalog-face catalog-back" id="description-${escapeHTML(book.id)}" aria-hidden="true"><span class="catalog-publisher">${escapeHTML(book.topic)}</span><span class="catalog-description">${escapeHTML(book.description)}</span><span class="catalog-edition">${escapeHTML(book.edition)}</span></span></span></button><div class="catalog-links"><span class="catalog-state">${group.marker} ${group.label}</span><a href="${escapeHTML(safeURL(book.source))}" target="_blank" rel="noopener noreferrer" aria-label="Edição e título oficial de ${escapeHTML(book.title)} (abre em nova aba)">Edição ↗</a>${personalRepository ? `<a class="book-repository" href="${escapeHTML(safeURL(book.repository))}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(book.repositoryLabel)} de ${escapeHTML(book.title)} (abre em nova aba)"><svg class="icon" aria-hidden="true"><use href="#i-github"/></svg>Meus estudos ↗</a>` : ''}</div></div><span class="journey-node" aria-hidden="true">${group.marker}</span>`;
    const button = item.querySelector('.book-turn');
    let pinned = false;
    function flip(open) {
      item.classList.toggle('is-flipped', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', `${open ? 'Ver título' : 'Ver descrição'} de ${book.title}`);
      item.querySelector('.catalog-front').setAttribute('aria-hidden', String(open));
      item.querySelector('.catalog-back').setAttribute('aria-hidden', String(!open));
    }
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') flip(true); });
    button.addEventListener('pointerleave', () => { if (!pinned) flip(false); });
    button.addEventListener('click', () => { pinned = !pinned; flip(pinned); });
    button.addEventListener('keydown', event => { if (event.key === 'Escape') { pinned = false; flip(false); } });
    return item;
  }
  stops.replaceChildren(...readingGroups.map((group, index) => {
    const books = (content.readings || []).filter(book => book.status === group.status);
    const section = document.createElement('section');
    section.className = `reading-phase phase-${group.status}`;
    section.id = `phase-${group.status}`;
    section.setAttribute('aria-labelledby', `${section.id}-title`);
    section.innerHTML = `<header class="phase-header"><span class="phase-number">0${index + 1}</span><div><span class="phase-kicker">${group.label} · ${String(books.length).padStart(2,'0')} leituras</span><h3 id="${section.id}-title">${group.title}</h3><p>${group.caption}</p></div><span class="phase-point" aria-hidden="true">${group.marker}</span></header><ol class="phase-books"></ol>`;
    section.querySelector('ol').replaceChildren(...books.map((book, index) => bookStop(book, index, group)));
    return section;
  }));
  document.querySelector('#reading-summary').replaceChildren(...readingGroups.map(group => {
    const count = (content.readings || []).filter(book => book.status === group.status).length;
    const link = document.createElement('a');
    link.className = `legend-${group.status}`;
    link.href = `#phase-${group.status}`;
    link.innerHTML = `<span class="legend-dot"></span>${group.label}<small>${String(count).padStart(2,'0')}</small>`;
    link.addEventListener('click', event => { event.preventDefault(); document.querySelector(link.getAttribute('href')).scrollIntoView({block: 'start'}); });
    return link;
  }));
  function layoutJourney() {
    if (!journey.offsetWidth) return;
    const width = journey.clientWidth;
    journey.classList.toggle('journey-compact', width < 660);
    const bounds = journey.getBoundingClientRect();
    const points = [...journey.querySelectorAll('.phase-point,.journey-node')].map(node => {
      const box = node.getBoundingClientRect();
      return {x: box.left - bounds.left + box.width / 2, y: box.top - bounds.top + box.height / 2, status: node.closest('.reading-phase').classList.contains('phase-planned') ? 'planned' : node.closest('.reading-phase').classList.contains('phase-reading') ? 'reading' : 'completed', node};
    });
    if (!points.length) return;
    const svg = journey.querySelector('.journey-route');
    svg.setAttribute('viewBox', `0 0 ${width} ${journey.clientHeight}`);
    let all = '';
    const segments = [];
    points.forEach((point, i) => {
      if (!i) { all = `M ${point.x} ${point.y}`; return; }
      const previous = points[i - 1];
      const distance = point.y - previous.y;
      const bend = (i % 2 ? 1 : -1) * (width < 660 ? 10 : 30);
      const segment = `M ${previous.x} ${previous.y} C ${previous.x + bend} ${previous.y + distance * .4}, ${point.x - bend} ${point.y - distance * .4}, ${point.x} ${point.y}`;
      all += segment.replace(/^M [^C]+/, '');
      segments.push(`<path class="route-${point.status}" d="${segment}"/>`);
    });
    svg.querySelector('.route-glow').setAttribute('d', all);
    svg.querySelector('.route-segments').innerHTML = segments.join('');
    svg.querySelector('.route-branches').innerHTML = points.filter(point => point.node.classList.contains('journey-node')).map(point => {
      const card = point.node.parentElement.querySelector('.catalog-card').getBoundingClientRect();
      const compact = width < 660;
      const end = compact || point.node.parentElement.classList.contains('book-right') ? card.left - bounds.left : card.right - bounds.left;
      return `<path d="M ${point.x} ${point.y} Q ${(point.x + end) / 2} ${point.y - 8} ${end} ${point.y}"/>`;
    }).join('');
  }
  function scheduleJourney() { cancelAnimationFrame(journeyFrame); journeyFrame = requestAnimationFrame(layoutJourney); }
  new ResizeObserver(scheduleJourney).observe(journey);

  const pages = [...document.querySelectorAll('.page')];
  const navigation = [...document.querySelectorAll('.navigation a')];
  let activePage;
  function navigate(focus = false) {
    const requested = window.location.hash.slice(1) || 'sobre';
    const id = requested === 'contato' ? 'estudos' : requested;
    const selected = pages.find(page => page.id === id) || pages[0];
    pages.forEach(page => { page.hidden = page !== selected; });
    document.body.dataset.page = selected.id;
    navigation.forEach(link => {
      if (link.hash === `#${selected.id}`) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    document.title = "portfólio | lucasarauj0h";
    if (focus && activePage !== selected.id) {
      selected.querySelector('h2').focus({preventScroll: true});
      const showProfile = selected.id === 'sobre' && window.matchMedia('(max-width:850px)').matches;
      document.querySelector(showProfile ? '.layout' : '.main-panel').scrollIntoView({block: 'start'});
    }
    activePage = selected.id;
    if (selected.id === 'estudos') scheduleJourney();
    if (selected.id === 'projetos') scheduleProjects();
  }
  window.addEventListener('hashchange', () => navigate(true));
  navigate();
})();
