document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------- MOBILE NAV ---------------- */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  const open = nav.classList.contains('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', false);
}));

/* ---------------- REVEAL ON SCROLL ---------------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
function observeReveal(root) { (root || document).querySelectorAll('.reveal').forEach(el => io.observe(el)); }

/* ---------------- CV PLACEHOLDER ---------------- */
document.getElementById('cvLink').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Add a link to your CV file here — replace the #cvLink href in index.html with your uploaded PDF URL.');
});

/* ---------------- TECHNOLOGIES I WORK WITH ---------------- */
const techs = [
  { name: 'Python', abbr: 'Py', color: '#3776AB' },
  { name: 'JavaScript', abbr: 'JS', color: '#F2C94C' },
  { name: 'TypeScript', abbr: 'TS', color: '#4C8FE0' },
  { name: 'React', abbr: '⚛', color: '#61DAFB' },
  { name: 'Django', abbr: 'Dj', color: '#4CB05A' },
  { name: 'Django REST', abbr: 'DRF', color: '#4CB05A' },
  { name: 'Convex', abbr: 'Cvx', color: '#A78BFA' },
  { name: 'MySQL', abbr: 'SQL', color: '#4E85C5' },
  { name: 'Docker', abbr: '🐳', color: '#4C9BE0' },
  { name: 'Redis', abbr: 'Rds', color: '#E0554C' },
  { name: 'Git', abbr: 'Git', color: '#E0654C' },
];
document.getElementById('techRow').innerHTML = techs.map(t => `
  <div class="tech-chip">
    <span class="tech-badge" style="background:${t.color}">${t.abbr}</span>
    <span class="tech-name">${t.name}</span>
  </div>
`).join('');

/* ---------------- PROJECT DATA ---------------- */
const projects = [
  {
    name: 'PayKit',
    cats: ['fullstack', 'backend', 'saas'],
    catLabels: ['Full Stack', 'Backend', 'SaaS'],
    status: 'dev', statusLabel: 'In Development',
    desc: 'A multi-tenant subscription billing platform with M-Pesa Daraja integration, JWT + Google OAuth, and real-time updates over WebSockets.',
    built: 'Backend APIs, JWT auth with token blacklisting, M-Pesa Daraja integration, async billing jobs, rate limiting.',
    tags: ['Django', 'React', 'JWT', 'OAuth', 'WebSockets', 'Docker', 'M-Pesa Daraja'],
    github: 'https://github.com/Trixiemacharia/PayKit',
    featured: true,
    case: {
      overview: 'PayKit is a subscription billing platform built to handle multiple tenants on one system — the kind of infrastructure a SaaS company needs to charge customers on a recurring basis, with local payment rails built in from the start rather than bolted on.',
      problem: 'Most billing tutorials assume Stripe and a single tenant. Building for the Kenyan market means integrating M-Pesa\'s Daraja API directly, handling asynchronous payment callbacks reliably, and keeping tenants\' data and permissions cleanly separated.',
      solution: 'A Django backend handles auth, tenant isolation, and billing logic, with Celery workers processing payment callbacks and scheduled billing jobs asynchronously via Redis. A React admin dashboard gives visibility into subscriptions and payment status in real time via WebSockets.',
      features: ['Multi-tenant data model with role-based access control', 'JWT authentication with token blacklisting on logout/revoke', 'Google OAuth as an alternate login path', 'M-Pesa Daraja API integration for payment initiation and callbacks', 'Async job processing for billing cycles via Celery + Redis', 'Real-time dashboard updates over WebSockets', 'API rate limiting', 'Dockerized for consistent local and deployment environments'],
      stack: { Frontend: ['React'], Backend: ['Django', 'Celery'], Database: ['Redis (jobs/queue)', 'MySQL'], Authentication: ['JWT', 'Google OAuth'], Infrastructure: ['Docker'], APIs: ['M-Pesa Daraja API'], DevOps: ['Docker Compose'] },
      arch: { frontend: 'React Admin Dashboard', backend: 'Django + Celery Workers', database: 'Redis (queue) + App DB', external: ['M-Pesa Daraja API', 'Google OAuth'] },
      challenges: ['Integrating M-Pesa\'s Daraja API — handling STK push initiation and asynchronous payment confirmation callbacks correctly', 'Designing JWT auth that supports real token revocation via a blacklist, not just expiry', 'Keeping billing jobs idempotent when running asynchronously through Celery', 'Structuring the data model so tenants stay isolated without duplicating schema logic'],
      learned: 'Hands-on experience with payment gateway integration in a market where card rails aren\'t the default, plus the operational realities of async job processing — retries, idempotency, and failure handling — that don\'t show up when everything runs synchronously.'
    }
  },
  {
    name: 'FaceGuard',
    cats: ['fullstack', 'backend'],
    catLabels: ['Full Stack', 'Backend'],
    status: 'source', statusLabel: 'Source Available',
    desc: 'A real-world face recognition access control system with a live guard dashboard, enrolment flow, and real-time alerting.',
    built: 'Django backend, recognition pipeline, WebSocket-based live dashboard, alerting, and the enrolment/guard-facing views.',
    tags: ['Django', 'DeepFace', 'OpenCV', 'Django Channels', 'Celery', 'Chart.js'],
    github: 'https://github.com/Trixiemacharia/FaceGuard',
    featured: true,
    case: {
      overview: 'FaceGuard is an access-control system that recognizes enrolled faces at an entry point and logs access events in real time, giving a guard-facing dashboard visibility into who came through and when.',
      problem: 'Manual access logs and badge systems are easy to bypass or forget to update. The goal was a system where enrolment, recognition, and logging happen automatically, with alerts when something looks wrong.',
      solution: 'A Django backend runs the recognition pipeline using DeepFace and OpenCV, with Django Channels pushing live events over WebSockets to a dashboard. Celery handles background work like alerting, and Chart.js visualizes access activity over time.',
      features: ['Face enrolment flow for adding new authorized users', 'Real-time recognition and access logging', 'Live guard dashboard over WebSockets (Django Channels)', 'Admin dashboard with access-log charts (Chart.js)', 'Zone management for multi-entry-point setups', 'Email/SMS alerting on flagged events', 'Optional Redis-backed Celery for background alert processing'],
      stack: { Frontend: ['Django templates'], Backend: ['Django', 'Django Channels', 'Celery'], Database: ['SQLite (default) / MySQL (optional)'], Authentication: ['Django auth'], Infrastructure: ['Redis (optional, for Channels/Celery)'], APIs: ['DeepFace / OpenCV (recognition)'], Other: ['Chart.js'] },
      arch: { frontend: 'Guard Dashboard (Django templates + WS)', backend: 'Django + Channels + Celery', database: 'SQLite / MySQL', external: ['DeepFace / OpenCV pipeline', 'Email/SMS alert provider'] },
      challenges: ['Getting real-time recognition events onto a live dashboard without polling, using Django Channels over WebSockets', 'Structuring zone management so the same pipeline supports multiple entry points', 'Wiring alerting (email/SMS) into the recognition pipeline without blocking the request cycle'],
      learned: 'This project surfaced a real constraint worth being upfront about: extended recognition sessions can strain RAM and inference stability, which shaped how I think about running ML inference inside a web request/response cycle versus offloading it to a dedicated worker.',
      note: 'Known limitation: extended live-recognition sessions can cause RAM and inference instability — a good candidate for offloading inference to a separate worker process in a future pass.'
    }
  },
  {
    name: 'Moonlite Café',
    cats: ['fullstack', 'frontend'],
    catLabels: ['Full Stack', 'Frontend'],
    status: 'source', statusLabel: 'Source Available',
    desc: 'A restaurant website focused on menu showcasing and reservation booking. Previously deployed on Render.',
    built: 'Full-stack build across Django backend and React frontend, containerized with Docker Compose.',
    tags: ['Django', 'React', 'Docker Compose', 'Render'],
    github: 'https://github.com/Trixiemacharia/Moonlight-Website',
    featured: true,
    case: {
      overview: 'Moonlite Café is a restaurant site built around two jobs: showing off the menu clearly, and making it easy to book a table without a phone call.',
      problem: 'Small restaurant sites are often either a static PDF menu or an over-engineered booking system. The goal was something in between — a real booking flow backed by an actual database, without unnecessary complexity.',
      solution: 'A Django backend serves the menu and reservation data through an API consumed by a React frontend. The whole stack was containerized with Docker Compose so the dev and deployment environments matched, and it was deployed to Render for a period before being taken down.',
      features: ['Menu showcase with categorized items', 'Reservation booking flow', 'Django backend API', 'React frontend', 'Docker Compose for local + deployment parity'],
      stack: { Frontend: ['React'], Backend: ['Django'], Database: ['(Django ORM-backed)'], Infrastructure: ['Docker Compose'], DevOps: ['Previously deployed on Render'] },
      arch: { frontend: 'React (menu + booking UI)', backend: 'Django REST API', database: 'Django ORM-backed DB', external: ['Render (previous deployment target)'] },
      challenges: ['Designing a reservation data model that avoids double-booking a table', 'Getting Docker Compose to mirror the deployed environment closely enough that deployment wasn\'t a surprise'],
      learned: 'First project taken all the way to a live deployment — the operational side (environment variables, container orchestration, actually shipping) taught more than the code itself did.',
      note: 'This project was live on Render for a period and has since been taken down — it is not currently deployed. Source is available and runnable locally.'
    }
  },
  {
    name: 'FitTrack',
    cats: ['fullstack', 'backend'],
    catLabels: ['Full Stack', 'Backend'],
    status: 'source', statusLabel: 'Source Available',
    desc: 'A fitness tracking capstone project with workout logging, progress charts, and Kenyan food nutrition data.',
    built: 'Django REST API, data model for workouts/nutrition, and Chart.js progress visualizations.',
    tags: ['Django', 'DRF', 'MySQL', 'Chart.js'],
    github: 'https://github.com/Trixiemacharia/Fitness_project',
    featured: true,
    case: {
      overview: 'FitTrack is a fitness tracking app for logging workouts and nutrition, with progress visualized over time.',
      problem: 'Most fitness app tutorials use generic, US-centric food databases. The goal was a tracker that actually reflects what users are eating, using Kenyan food fixture data.',
      solution: 'Django REST Framework powers the API for logging workouts and meals, backed by MySQL, with Chart.js rendering progress over time on the frontend.',
      features: ['Workout logging', 'Nutrition tracking with Kenyan food fixture data', 'Progress charts (Chart.js)', 'REST API via Django REST Framework'],
      stack: { Backend: ['Django', 'Django REST Framework'], Database: ['MySQL'], Other: ['Chart.js'] },
      arch: { frontend: 'Chart.js dashboard', backend: 'Django REST Framework API', database: 'MySQL', external: [] },
      challenges: ['Building a food/nutrition fixture dataset relevant to Kenyan diets instead of relying on a generic international database', 'Structuring the API so workout and nutrition logs could be queried efficiently for chart rendering'],
      learned: 'Practical DRF serializer and viewset design, and the value of localizing reference data rather than defaulting to whatever dataset is easiest to find.'
    }
  }
];

const moreRepos = [
  { name: 'Laundry-managent-system', desc: 'Order tracking & service workflow app — coursework project.', url: 'https://github.com/Trixiemacharia/Laundry-managent-system' },
  { name: 'egerton_laundry', desc: 'Earlier iteration of the laundry management system.', url: 'https://github.com/Trixiemacharia/egerton_laundry' },
  { name: 'Demo', desc: 'Role-based access control demo — Python decorators.', url: 'https://github.com/Trixiemacharia/Demo' },
  { name: 'url-shortener', desc: 'View source on GitHub.', url: 'https://github.com/Trixiemacharia/url-shortener' },
  { name: 'movieApp', desc: 'View source on GitHub.', url: 'https://github.com/Trixiemacharia/movieApp' },
  { name: 'CRM', desc: 'View source on GitHub.', url: 'https://github.com/Trixiemacharia/CRM' },
  { name: '+ more repositories →', desc: 'Full list on GitHub.', url: 'https://github.com/Trixiemacharia?tab=repositories' },
];

/* Screenshot data lives here (before project cards render) so cards can
   check which projects have a gallery. `src` stays empty until a real
   screenshot is added — nothing here is a generated or stock image.
   Drop a file path into `src` and the placeholder frame becomes a real image. */
const screenshotSets = {
  PayKit: [
    { src: 'assets/screenshot/paykit-landing-page.png', title: 'Landing page', caption: 'Account creation and login flow.' },
    { src: 'assets/screenshot/paykit-dashboard.png', title: 'Dashboard', caption: 'Subscription and tenant overview for the React dashboard.' },
    { src: '', title: 'M-Pesa Billing Flow', caption: 'STK push initiation and payment status during a billing cycle.' },
    { src: '', title: 'Tenant Management', caption: 'Multi-tenant view with role-based access control in action.' },
  ],
  FaceGuard: [
    { src: '', title: 'Guard Dashboard', caption: 'Live recognition events streamed over WebSockets via Django Channels.' },
    { src: '', title: 'Enrolment Flow', caption: 'Adding a new authorized face to the recognition pipeline.' },
    { src: '', title: 'Access Log Charts', caption: 'Chart.js visualization of access activity over time.' },
  ],
  'Moonlite Café': [
    { src: '', title: 'Menu Page', caption: 'Categorized menu showcase on the React frontend.' },
    { src: '', title: 'Reservation Booking', caption: 'The table-booking flow backed by the Django API.' },
  ],
  FitTrack: [
    { src: 'assets/screenshot/fittrack-workout-logging.png', title: 'Workout Logging', caption: 'Logging a workout session through the DRF-backed API.' },
    { src: 'assets/screenshot/fittrack-google-login.png', title: 'Google Login', caption: 'Integrating Google authentication into the frontend.' },
    { src: 'assets/screenshot/fittrack-admin-dashboard.png', title: 'Admin Dashboard', caption: 'Overview of the admin interface.' },
    { src: 'assets/screenshot/fittrack-nutritionlog.png', title: 'Nutrition Log', caption: 'Tracking nutritional intake over time.' },
    { src: 'assets/screenshot/fittrack-exercises.png', title: 'Workouts', caption: 'Catalog of available exercises.' },
  ],
};

const filterBar = document.getElementById('filterBar');
const grid = document.getElementById('projectGrid');
const statusClass = { live: 'status-live', source: 'status-source', dev: 'status-dev' };

function stackGroupsHTML(stack) {
  return `<div class="stack-groups">` + Object.entries(stack).map(([k, v]) =>
    `<div class="stack-group"><h5>${k}</h5>${v.map(x => `<span>${x}</span>`).join('')}</div>`
  ).join('') + `</div>`;
}
function archHTML(a) {
  let out = `<div class="arch">
    <div class="arch-node">User</div>
    <div class="arch-connector"></div>
    <div class="arch-node">${a.frontend}</div>
    <div class="arch-connector"></div>
    <div class="arch-node">${a.backend}</div>
    <div class="arch-connector"></div>
    <div class="arch-node">${a.database}</div>`;
  if (a.external && a.external.length) {
    out += `<div class="arch-connector"></div><div class="arch-row">` +
      a.external.map(e => `<div class="arch-ext">${e}</div>`).join('') + `</div>`;
  }
  out += `</div>`;
  return out;
}
function projectCard(p, i) {
  const cs = p.case;
  return `
  <div class="card" data-cats="${p.cats.join(' ')}">
    <div class="card-cover">
      <span class="card-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="status-pill ${statusClass[p.status]}"><span class="status-dot"></span>${p.statusLabel}</span>
    </div>
    <div class="card-body">
      <div class="card-top"><span class="card-title">${p.name}</span></div>
      <div class="card-cats">${p.catLabels.map(c => `<span class="cat-chip">${c}</span>`).join('')}</div>
      <p class="card-desc">${p.desc}</p>
      <div class="card-built"><strong>What I built:</strong> ${p.built}</div>
      <div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <div class="card-actions">
        <a class="card-link primary" href="${p.github}" target="_blank" rel="noopener">View Project ↗</a>
        <a class="card-link" href="${p.github}" target="_blank" rel="noopener">GitHub ↗</a>
        ${screenshotSets[p.name] ? `<button type="button" class="card-link" data-gallery="${p.name}">Screenshots</button>` : ''}
      </div>
      <details class="case">
        <summary>View Case Study</summary>
        <div class="case-body">
          <div class="case-block"><h4>Overview</h4><p>${cs.overview}</p></div>
          <div class="case-block"><h4>Problem</h4><p>${cs.problem}</p></div>
          <div class="case-block"><h4>Solution</h4><p>${cs.solution}</p></div>
          <div class="case-block"><h4>Key Features</h4><ul>${cs.features.map(f => `<li>${f}</li>`).join('')}</ul></div>
          <div class="case-block"><h4>Technology Stack</h4>${stackGroupsHTML(cs.stack)}</div>
          <div class="case-block"><h4>Architecture</h4>${archHTML(cs.arch)}</div>
          <div class="case-block"><h4>Engineering Challenges</h4><ul>${cs.challenges.map(c => `<li>${c}</li>`).join('')}</ul></div>
          <div class="case-block"><h4>What I Learned</h4><p>${cs.learned}</p></div>
          ${cs.note ? `<div class="case-block"><h4>Note</h4><p>${cs.note}</p></div>` : ''}
        </div>
      </details>
    </div>
  </div>`;
}
function renderProjects(filter) {
  const filtered = projects.filter(p => filter === 'all' || p.cats.includes(filter));
  grid.innerHTML = filtered.map((p, i) => projectCard(p, i)).join('');
}
renderProjects('all');
filterBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProjects(btn.dataset.filter);
});
grid.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-gallery]');
  if (!btn) return;
  goToGallery(btn.dataset.gallery);
});

document.getElementById('repoGrid').innerHTML = moreRepos.map(r => `
  <a class="repo-chip" href="${r.url}" target="_blank" rel="noopener">
    <span class="rname">${r.name}</span>
    <span class="rdesc">${r.desc}</span>
  </a>
`).join('');

/* ---------------- SCREENSHOTS / VISUAL EVIDENCE ---------------- */
const galleryProjectNames = Object.keys(screenshotSets);

const galleryTabsEl = document.getElementById('galleryTabs');
const galleryGridEl = document.getElementById('galleryGrid');
let activeGalleryProject = galleryProjectNames[0];
let activeShotIndex = 0;

function placeholderHTML() {
  return `
    <div class="shot-placeholder">
      <span class="shot-placeholder-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="m3 14 5-5 4 4 3-3 6 6"/><circle cx="8" cy="8" r="1.5"/></svg>
      </span>
      <span class="shot-placeholder-text">Screenshot pending</span>
    </div>`;
}

function renderGalleryTabs() {
  galleryTabsEl.innerHTML = galleryProjectNames.map(name => `
    <button class="gallery-tab ${name === activeGalleryProject ? 'active' : ''}" role="tab" data-project="${name}">${name}</button>
  `).join('');
}
function renderGalleryGrid() {
  const shots = screenshotSets[activeGalleryProject] || [];
  galleryGridEl.innerHTML = shots.map((s, i) => `
    <button class="shot" data-index="${i}" aria-label="View screenshot: ${s.title}">
      <div class="shot-frame">
        <div class="shot-chrome"><span></span><span></span><span></span></div>
        ${s.src ? `<img src="${s.src}" alt="${s.title} — ${activeGalleryProject}" loading="lazy">` : placeholderHTML()}
      </div>
      <div class="shot-caption"><strong>${s.title}</strong>${s.caption}</div>
    </button>
  `).join('');
  galleryGridEl.querySelectorAll('.shot').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(parseInt(btn.dataset.index, 10)));
  });
}
function switchGalleryProject(name) {
  activeGalleryProject = name;
  renderGalleryTabs();
  renderGalleryGrid();
}
galleryTabsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.gallery-tab');
  if (!btn) return;
  switchGalleryProject(btn.dataset.project);
});
renderGalleryTabs();
renderGalleryGrid();

/* jump to a project's gallery tab from its project card */
function goToGallery(name) {
  if (screenshotSets[name]) switchGalleryProject(name);
  document.getElementById('screenshots').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------------- LIGHTBOX ---------------- */
const lightbox = document.getElementById('lightbox');
const lightboxStage = document.getElementById('lightboxStage');
const lightboxCaption = document.getElementById('lightboxCaption');
let lastFocusedEl = null;

function renderLightboxStage() {
  const shots = screenshotSets[activeGalleryProject] || [];
  const s = shots[activeShotIndex];
  if (!s) return;
  lightboxStage.innerHTML = s.src
    ? `<img src="${s.src}" alt="${s.title} — ${activeGalleryProject}">`
    : placeholderHTML();
  lightboxCaption.textContent = `${activeGalleryProject} — ${s.title}: ${s.caption}`;
}
function openLightbox(index) {
  activeShotIndex = index;
  lastFocusedEl = document.activeElement;
  renderLightboxStage();
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('lightboxClose').focus();
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  if (lastFocusedEl) lastFocusedEl.focus();
}
function stepLightbox(delta) {
  const shots = screenshotSets[activeGalleryProject] || [];
  activeShotIndex = (activeShotIndex + delta + shots.length) % shots.length;
  renderLightboxStage();
}
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => stepLightbox(-1));
document.getElementById('lightboxNext').addEventListener('click', () => stepLightbox(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') stepLightbox(-1);
  if (e.key === 'ArrowRight') stepLightbox(1);
});

/* ---------------- SECURITY LABS DATA ---------------- */
const labs = [
  {
    icon: '01', name: 'SQL Injection Exploitation', sub: 'PortSwigger Web Security Academy · Burp Suite',
    objective: 'Understand and exploit UNION-based and blind SQL injection vulnerabilities in deliberately vulnerable web applications.',
    environment: 'PortSwigger Web Security Academy labs, Burp Suite, the FoxyProxy browser extension, and Burp Intruder.',
    method: 'Solved multiple labs progressing from UNION-based attacks — extracting data through crafted UNION SELECT queries — to blind SQL injection, where Burp Intruder was used to automate character-by-character extraction of database values, including a full password extraction with no visible query output.',
    findings: 'Confirmed injectable parameters, enumerated database structure, and extracted complete credential values purely from boolean/response-based inference — no direct output required.',
    skills: ['Burp Suite (Intruder, Repeater)', 'UNION-based SQLi', 'Blind SQLi', 'Database enumeration']
  },
  {
    icon: '02', name: 'DNS Tunneling Detection', sub: 'Kali Linux (host + attacker VM) · Wireshark',
    objective: 'Investigate DNS tunneling as a covert data-exfiltration and C2 channel, and learn to spot it at the network layer.',
    environment: 'A Kali Linux desktop as the host machine, a second Kali Linux VM configured as the attacker, and Wireshark for packet capture and log analysis.',
    method: 'Generated DNS tunneling traffic from the attacker VM directed at the host, captured the traffic with Wireshark, and reviewed DNS query patterns and volume in the resulting logs.',
    findings: 'Identified the traffic signatures that distinguish tunneling from normal DNS activity — unusual query patterns and volume — directly in the packet captures.',
    skills: ['Wireshark', 'Packet analysis', 'DNS-based threat detection', 'Network security monitoring']
  },
  {
    icon: '03', name: 'Cyber Kill Chain Exercises', sub: 'Hack The Box',
    objective: 'Practice mapping real attack activity onto the stages of the Cyber Kill Chain — from reconnaissance through to actions on objectives.',
    environment: 'Hack The Box labs.',
    method: 'Worked through kill-chain-oriented exercises on HTB, tying each step of an attack to its corresponding kill chain stage.',
    findings: 'Reinforced how the stages connect in practice, not just on paper — useful groundwork for later threat-hunting and detection work.',
    skills: ['Attack lifecycle analysis', 'Cyber Kill Chain', 'Hands-on labs (HTB)']
  },
  {
    icon: '04', name: 'SIEM Setup with Splunk', sub: 'In progress',
    objective: 'Build practical log-analysis and monitoring capability using a real SIEM tool.',
    environment: 'Splunk, installed locally.',
    method: 'Currently setting up Splunk for SIEM-style log ingestion and analysis — this lab is in progress, not yet complete.',
    findings: 'In progress.',
    skills: ['Splunk (learning)', 'Log analysis', 'SIEM fundamentals']
  },
  {
    icon: '05', name: 'MITRE ATT&CK Study', sub: 'Ongoing',
    objective: 'Build a working knowledge of adversary tactics and techniques as catalogued by the MITRE ATT&CK framework, to inform detection and investigation work.',
    environment: 'MITRE ATT&CK framework documentation.',
    method: 'Ongoing, self-directed study — mapping techniques encountered in labs (like the SQLi and DNS tunneling work above) back to the framework.',
    findings: 'Ongoing.',
    skills: ['MITRE ATT&CK', 'Threat intelligence fundamentals']
  }
];
const labList = document.getElementById('labList');
labList.innerHTML = labs.map((l, i) => `
  <div class="lab" data-i="${i}">
    <div class="lab-head">
      <div class="lab-title">
        <span class="lab-icon">${l.icon}</span>
        <div>
          <div class="lab-name">${l.name}</div>
          <div class="lab-sub">${l.sub}</div>
        </div>
      </div>
    </div>
    <div class="lab-body">
      <div class="lab-grid">
        <div class="lab-field"><h5>Objective</h5><p>${l.objective}</p></div>
        <div class="lab-field"><h5>Environment</h5><p>${l.environment}</p></div>
        <div class="lab-field"><h5>Investigation</h5><p>${l.method}</p></div>
        <div class="lab-field"><h5>Findings</h5><p>${l.findings}</p></div>
      </div>
      <div class="skill-tags">${l.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
    </div>
  </div>
`).join('');
labList.querySelectorAll('.lab-head').forEach(head => {
  head.addEventListener('click', () => head.closest('.lab').classList.toggle('open'));
});
labList.querySelector('.lab')?.classList.add('open');

/* ---------------- SKILLS DATA (categorized, no fake percentages) ---------------- */
const skillGroups = [
  { title: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Bash'] },
  { title: 'Frontend', items: ['React', 'Vite', 'HTML', 'CSS', 'Chart.js'] },
  { title: 'Backend', items: ['Django', 'Django REST Framework', 'Convex', 'Celery', 'Django Channels / WebSockets'] },
  { title: 'Databases', items: ['MySQL', 'PostgreSQL', 'SQLite', 'Redis'] },
  { title: 'Cloud / DevOps', items: ['Docker', 'Docker Compose', 'Render', 'Git'] },
  { title: 'Cybersecurity', items: ['Linux (Kali)', 'Burp Suite', 'Wireshark', 'Splunk (learning)', 'MITRE ATT&CK'] },
];
document.getElementById('skillsGrid').innerHTML = skillGroups.map(g => `
  <div class="skill-card reveal">
    <h4>${g.title}</h4>
    <ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul>
  </div>
`).join('');
observeReveal(document.getElementById('skillsGrid'));

/* ---------------- ABOUT STATS (computed from real data, never fabricated) ---------------- */
const totalTechCount = skillGroups.reduce((sum, g) => sum + g.items.length, 0);
const totalRepoCount = projects.length + moreRepos.filter(r => !r.name.startsWith('+')).length;
const statIcons = {
  projects: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5"/></svg>',
  tech: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>',
  repos: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-2 1.03-2.7-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.7 0 3.85-2.35 4.7-4.58 4.94.36.31.68.93.68 1.88v2.79c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
  security: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z"/></svg>',
};
const stats = [
  { icon: statIcons.projects, num: projects.length, label: 'Featured Projects' },
  { icon: statIcons.tech, num: totalTechCount, label: 'Technologies Used' },
  { icon: statIcons.repos, num: totalRepoCount, label: 'GitHub Repositories' },
  { icon: statIcons.security, num: labs.length, label: 'Security Labs Completed' },
];
document.getElementById('statsGrid').innerHTML = stats.map(s => `
  <div class="stat-card">
    <div class="stat-icon">${s.icon}</div>
    <div class="stat-num">${s.num}${s.num >= 10 ? '+' : ''}</div>
    <div class="stat-label">${s.label}</div>
  </div>
`).join('');

/* ---------------- EXPERIENCE TIMELINE DATA ---------------- */
const timelineGroups = [
  {
    title: 'Professional',
    items: [
      { h: 'Backend Developer — DeepTrack Inc', m: 'Current', p: 'Migrating a compliance / identity-verification platform\'s backend to Convex — schema, API key auth, HTTP routes, a risk-engine state machine, a credit ledger, and webhook retries. Working alongside a team lead and two other engineers.' },
      { h: 'SOC Analyst Training — Ongoza Cyber Hub', m: 'Current', p: 'Hands-on SOC training covering log analysis, network monitoring, and threat detection — see the Cybersecurity section above for specific lab work.' },
      { h: 'Industrial Attachment — Ampitech Solutions', m: 'Prior', p: 'Contributed OSINT and digital research work to the CCIJ Election Watch Project.' },
    ]
  },
  {
    title: 'Education',
    items: [
      { h: 'B.Sc. Computer Science — Egerton University', m: 'Final year · Graduating November 2026', p: 'Coursework and capstone projects including FitTrack (fitness tracking) and a laundry service management system.' },
    ]
  },
  {
    title: 'Self-Directed Builds',
    items: [
      { h: 'PayKit — multi-tenant billing platform', m: '', p: 'Django + React, M-Pesa Daraja integration, real-time updates via WebSockets. In development.' },
      { h: 'FaceGuard — face recognition access control', m: '', p: 'Django, DeepFace/OpenCV, real-time dashboard and alerting. Phase 2 complete.' },
      { h: 'Moonlite Café — restaurant & reservations site', m: '', p: 'Django + React, Docker Compose. Previously deployed on Render.' },
    ]
  }
];
document.getElementById('timeline').innerHTML = timelineGroups.map(g => `
  <div class="tl-group reveal">
    <div class="tl-group-title">${g.title}</div>
    ${g.items.map(it => `
      <div class="tl-item">
        <h4>${it.h}</h4>
        ${it.m ? `<div class="tl-meta">${it.m}</div>` : ''}
        <p>${it.p}</p>
      </div>
    `).join('')}
  </div>
`).join('');
observeReveal(document.getElementById('timeline'));

/* re-observe all top-level reveal elements now that content is injected */
observeReveal(document);