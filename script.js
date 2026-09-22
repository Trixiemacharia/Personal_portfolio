document.getElementById('year').textContent = new Date().getFullYear();

/* mobile nav */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));

/* glass header — solidify on scroll */
const glassNav = document.getElementById('glassNav');
function onScroll(){
  if(window.scrollY > 12) glassNav.classList.add('scrolled');
  else glassNav.classList.remove('scrolled');
}
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* reveal on scroll, staggered within each parent group */
const revealEls = document.querySelectorAll('.reveal');
const groupCounters = new WeakMap();
revealEls.forEach(el => {
  const parent = el.parentElement;
  const n = groupCounters.get(parent) || 0;
  el.style.setProperty('--stagger', Math.min(n,5) * 90 + 'ms');
  groupCounters.set(parent, n+1);
});
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.12});
revealEls.forEach(el => io.observe(el));

/* animated stat counters */
const statEls = document.querySelectorAll('.stat-num');
const statIo = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    statIo.unobserve(e.target);
    const target = parseInt(e.target.dataset.count, 10);
    const dur = 900; const start = performance.now();
    function step(t){
      const p = Math.min((t-start)/dur, 1);
      e.target.textContent = Math.round(target * (1 - Math.pow(1-p, 3)));
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}, {threshold:0.5});
statEls.forEach(el => statIo.observe(el));

/* hero network canvas */
(function(){
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, nodes;
  const NODE_COUNT = window.innerWidth < 700 ? 20 : 40;

  function resize(){
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }
  function initNodes(){
    nodes = Array.from({length:NODE_COUNT}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.18, vy: (Math.random()-0.5)*0.18,
      r: Math.random()*1.4 + 0.6
    }));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const n of nodes){
      if(!reduceMotion){
        n.x += n.vx; n.y += n.vy;
        if(n.x < 0 || n.x > w) n.vx *= -1;
        if(n.y < 0 || n.y > h) n.vy *= -1;
      }
    }
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 130){
          ctx.strokeStyle = `rgba(111,168,199,${(1 - dist/130) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    for(const n of nodes){
      ctx.fillStyle = 'rgba(227,168,87,0.55)';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2); ctx.fill();
    }
    if(!reduceMotion) requestAnimationFrame(draw);
  }
  resize(); initNodes(); draw();
  window.addEventListener('resize', () => { resize(); initNodes(); if(reduceMotion) draw(); });
})();

/* ---------------- PROJECT DATA ---------------- */
const projects = [
  {
    name: 'PayKit',
    cats: ['fullstack','backend','saas'],
    catLabels: ['Full Stack','Backend','SaaS'],
    status: 'dev', statusLabel: 'Near Feature-Complete',
    desc: 'A multi-tenant subscription billing platform with Safaricom Daraja integration (STK Push, C2B), JWT + Google OAuth, and a React admin dashboard — her flagship project.',
    built: 'Backend APIs, tenant-aware JWT auth, Daraja integration (STK Push, C2B), async billing jobs via Celery/Redis, the React admin dashboard.',
    tags: ['Django/FastAPI','React','JWT','Google OAuth','Celery','Redis','PostgreSQL','Docker','Safaricom Daraja'],
    github: 'https://github.com/Trixiemacharia/PayKit',
    featured: true,
    screenshots: ['screenshots/paykit-1.png','screenshots/paykit-2.png','screenshots/paykit-3.png'],
    case: {
      overview: 'PayKit is her flagship project: a subscription billing platform built to handle multiple tenants on one system, with Kenyan payment rails (Safaricom Daraja — STK Push and C2B) built in from the start rather than bolted on.',
      problem: 'Most billing tutorials assume Stripe and a single tenant. Building for the Kenyan market means integrating Safaricom\'s Daraja API directly, handling asynchronous payment callbacks reliably, and keeping tenants\' data and permissions cleanly separated.',
      solution: 'A Django/FastAPI backend handles auth, tenant isolation, and billing logic, with Celery workers processing Daraja payment callbacks and scheduled billing jobs asynchronously via Redis. PostgreSQL backs the data layer, and a React admin dashboard gives visibility into subscriptions and payment status. The whole stack runs in Docker.',
      features: ['Multi-tenant data model with tenant-aware JWT middleware','JWT authentication with token blacklisting on logout/revoke','Google OAuth as an alternate login path','Safaricom Daraja integration — STK Push and C2B payment flows','Async job processing for billing cycles via Celery + Redis','PostgreSQL-backed data layer','React admin dashboard','Dockerized for consistent local and deployment environments'],
      stack: {Frontend:['React'], Backend:['Django / FastAPI','Celery'], Database:['PostgreSQL','Redis (queue)'], Authentication:['JWT','Google OAuth'], Infrastructure:['Docker'], APIs:['Safaricom Daraja API (STK Push, C2B)']},
      arch: {frontend:'React Admin Dashboard', backend:'Django/FastAPI + Celery Workers', database:'PostgreSQL + Redis (queue)', external:['Safaricom Daraja API','Google OAuth']},
      challenges: ['Getting Redis running reliably in a Kali Linux dev environment','A tenant-aware JWT middleware timing bug that only surfaced under specific request sequences','Upgrading through React 19 incompatibilities across the dashboard\'s dependency tree','Google OAuth breaking due to Cross-Origin-Opener-Policy (COOP) restrictions on the popup login flow','Hitting Linux\'s inotify watch limit (ENOSPC) during development and having to raise it for the dev server to keep watching files','Integrating Safaricom\'s Daraja API — handling STK Push initiation and asynchronous C2B confirmation callbacks correctly'],
      learned: 'Most of the hardest-won lessons here were operational, not algorithmic — the kind of debugging that only shows up once a project has real infrastructure under it: Linux system limits, browser security policies colliding with OAuth popups, and dependency upgrades breaking things in non-obvious ways. That, plus hands-on experience with payment gateway integration in a market where card rails aren\'t the default.'
    }
  },
  {
    name: 'FaceGuard',
    cats: ['fullstack','backend'],
    catLabels: ['Full Stack','Backend'],
    status: 'source', statusLabel: 'Source Available',
    desc: 'A real-world face recognition access control system with a live guard dashboard, enrolment flow, and real-time alerting.',
    built: 'Django backend, recognition pipeline, WebSocket-based live dashboard, alerting, and the enrolment/guard-facing views.',
    tags: ['Django','DeepFace','OpenCV','Django Channels','Celery','Chart.js'],
    github: 'https://github.com/Trixiemacharia/FaceGuard',
    featured: true,
    screenshots: ['screenshots/faceguard-1.png'],
    case: {
      overview: 'FaceGuard is an access-control system that recognizes enrolled faces at an entry point and logs access events in real time, giving a guard-facing dashboard visibility into who came through and when.',
      problem: 'Manual access logs and badge systems are easy to bypass or forget to update. The goal was a system where enrolment, recognition, and logging happen automatically, with alerts when something looks wrong.',
      solution: 'A Django backend runs the recognition pipeline using DeepFace and OpenCV, with Django Channels pushing live events over WebSockets to a dashboard. Celery handles background work like alerting, and Chart.js visualizes access activity over time.',
      features: ['Face enrolment flow for adding new authorized users','Real-time recognition and access logging','Live guard dashboard over WebSockets (Django Channels)','Admin dashboard with access-log charts (Chart.js)','Zone management for multi-entry-point setups','Email/SMS alerting on flagged events','Optional Redis-backed Celery for background alert processing'],
      stack: {Frontend:['Django templates'], Backend:['Django','Django Channels','Celery'], Database:['SQLite (default) / MySQL (optional)'], Authentication:['Django auth'], Infrastructure:['Redis (optional, for Channels/Celery)'], APIs:['DeepFace / OpenCV (recognition)'], Other:['Chart.js']},
      arch: {frontend:'Guard Dashboard (Django templates + WS)', backend:'Django + Channels + Celery', database:'SQLite / MySQL', external:['DeepFace / OpenCV pipeline','Email/SMS alert provider']},
      challenges: ['Getting real-time recognition events onto a live dashboard without polling, using Django Channels over WebSockets','Structuring zone management so the same pipeline supports multiple entry points','Wiring alerting (email/SMS) into the recognition pipeline without blocking the request cycle'],
      learned: 'This project surfaced a real constraint worth being upfront about: extended recognition sessions can strain RAM and inference stability, which shaped how she thinks about running ML inference inside a web request/response cycle versus offloading it to a dedicated worker.',
      note: 'Known limitation: extended live-recognition sessions can cause RAM and inference instability — a good candidate for offloading inference to a separate worker process in a future pass.'
    }
  },
  {
    name: 'Moonlight Café',
    cats: ['fullstack','frontend'],
    catLabels: ['Full Stack','Frontend'],
    status: 'source', statusLabel: 'Source Available',
    desc: 'A restaurant website focused on menu showcasing and reservation booking. Previously deployed on Render.',
    built: 'Full-stack build across Django backend and React frontend, containerized with Docker Compose.',
    tags: ['Django','React','Docker Compose','Render'],
    github: 'https://github.com/Trixiemacharia/Moonlight-Website',
    featured: true,
    screenshots: ['screenshots/moonlight-1.png','screenshots/moonlight-2.png','screenshots/moonlight-3.png'],
    case: {
      overview: 'Moonlight Café is a restaurant site built around two jobs: showing off the menu clearly, and making it easy to book a table without a phone call.',
      problem: 'Small restaurant sites are often either a static PDF menu or an over-engineered booking system. The goal was something in between — a real booking flow backed by an actual database, without unnecessary complexity.',
      solution: 'A Django backend serves the menu and reservation data through an API consumed by a React frontend. The whole stack was containerized with Docker Compose so the dev and deployment environments matched, and it was deployed to Render for a period before being taken down.',
      features: ['Menu showcase with categorized items','Reservation booking flow','Django backend API','React frontend','Docker Compose for local + deployment parity'],
      stack: {Frontend:['React'], Backend:['Django'], Database:['(Django ORM-backed)'], Infrastructure:['Docker Compose'], DevOps:['Previously deployed on Render']},
      arch: {frontend:'React (menu + booking UI)', backend:'Django REST API', database:'Django ORM-backed DB', external:['Render (previous deployment target)']},
      challenges: ['Designing a reservation data model that avoids double-booking a table','Getting Docker Compose to mirror the deployed environment closely enough that deployment wasn\'t a surprise'],
      learned: 'First project taken all the way to a live deployment — the operational side (environment variables, container orchestration, actually shipping) taught more than the code itself did.',
      note: 'This project was live on Render for a period and has since been taken down — it is not currently deployed. Source is available and runnable locally.'
    }
  },
  {
    name: 'FitTrack',
    cats: ['fullstack','backend'],
    catLabels: ['Full Stack','Backend'],
    status: 'source', statusLabel: 'Source Available',
    desc: 'A fitness tracking capstone project with workout logging, progress charts, and Kenyan food nutrition data.',
    built: 'Django REST API, data model for workouts/nutrition, and Chart.js progress visualizations.',
    tags: ['Django','DRF','MySQL','Chart.js'],
    github: 'https://github.com/Trixiemacharia/Fitness_project',
    featured: false,
    screenshots: ['screenshots/fittrack-1.png','screenshots/fittrack-2.png','screenshots/fittrack-3.png'],
    case: {
      overview: 'FitTrack is a fitness tracking app for logging workouts and nutrition, with progress visualized over time.',
      problem: 'Most fitness app tutorials use generic, US-centric food databases. The goal was a tracker that actually reflects what users are eating, using Kenyan food fixture data.',
      solution: 'Django REST Framework powers the API for logging workouts and meals, backed by MySQL, with Chart.js rendering progress over time on the frontend.',
      features: ['Workout logging','Nutrition tracking with Kenyan food fixture data','Progress charts (Chart.js)','REST API via Django REST Framework'],
      stack: {Backend:['Django','Django REST Framework'], Database:['MySQL'], Other:['Chart.js']},
      arch: {frontend:'Chart.js dashboard', backend:'Django REST Framework API', database:'MySQL', external:[]},
      challenges: ['Building a food/nutrition fixture dataset relevant to Kenyan diets instead of relying on a generic international database','Structuring the API so workout and nutrition logs could be queried efficiently for chart rendering'],
      learned: 'Practical DRF serializer and viewset design, and the value of localizing reference data rather than defaulting to whatever dataset is easiest to find.'
    }
  }
];

const filterBar = document.getElementById('filterBar');
const grid = document.getElementById('projectGrid');
const statusClass = {live:'status-live', source:'status-source', dev:'status-dev'};

function stackGroupsHTML(stack){
  return `<div class="stack-groups">` + Object.entries(stack).map(([k,v]) =>
    `<div class="stack-group"><h5>${k}</h5>${v.map(x=>`<span>${x}</span>`).join('')}</div>`
  ).join('') + `</div>`;
}

function archHTML(a){
  let html = `<div class="arch">
    <div class="arch-node">User</div>
    <div class="arch-connector"></div>
    <div class="arch-node">${a.frontend}</div>
    <div class="arch-connector"></div>
    <div class="arch-node">${a.backend}</div>
    <div class="arch-connector"></div>
    <div class="arch-node">${a.database}</div>`;
  if(a.external && a.external.length){
    html += `<div class="arch-connector"></div><div class="arch-row">` +
      a.external.map(e=>`<div class="arch-ext">${e}</div>`).join('') + `</div>`;
  }
  html += `</div>`;
  return html;
}

function shotFrameHTML(name, src){
  return `
    <div class="shot-frame" data-src="${src}">
      <div class="shot-chrome"><span></span><span></span><span></span></div>
      <div class="shot-body">
        <img src="${src}" alt="${name} screenshot" loading="lazy"
             onload="this.parentElement.querySelector('.shot-placeholder').style.display='none';"
             onerror="this.style.display='none'; this.parentElement.querySelector('.shot-placeholder').style.display='flex';">
        <div class="shot-placeholder">
          <span class="icon">▢</span>
          <span>Drop a screenshot in as</span>
          <code>${src}</code>
        </div>
      </div>
    </div>`;
}

function shotGalleryHTML(name, shots){
  if(!shots || !shots.length) return '';
  return `<div class="case-block"><h4>Screenshots</h4><div class="shot-gallery">` +
    shots.map(src => shotFrameHTML(name, src)).join('') +
    `</div></div>`;
}

function projectCard(p){
  const cs = p.case;
  return `
  <div class="card glass ${p.featured?'featured':''}" data-cats="${p.cats.join(' ')}">
    <div class="card-top">
      <span class="card-title">${p.name}</span>
      <span class="status-pill ${statusClass[p.status]}"><span class="status-dot"></span>${p.statusLabel}</span>
    </div>
    <div class="card-cats">${p.catLabels.map(c=>`<span class="cat-chip">${c}</span>`).join('')}</div>
    <p class="card-desc">${p.desc}</p>
    <div class="card-built"><strong>What I built:</strong> ${p.built}</div>
    <div class="tag-row">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    <div class="card-actions">
      <a class="card-link primary" href="${p.github}" target="_blank" rel="noopener">View Source</a>
    </div>
    <details class="case">
      <summary>View Case Study</summary>
      <div class="case-body">
        ${shotGalleryHTML(p.name, p.screenshots)}
        <div class="case-block"><h4>Overview</h4><p>${cs.overview}</p></div>
        <div class="case-block"><h4>Problem</h4><p>${cs.problem}</p></div>
        <div class="case-block"><h4>Solution</h4><p>${cs.solution}</p></div>
        <div class="case-block"><h4>Key Features</h4><ul>${cs.features.map(f=>`<li>${f}</li>`).join('')}</ul></div>
        <div class="case-block"><h4>Technology Stack</h4>${stackGroupsHTML(cs.stack)}</div>
        <div class="case-block"><h4>Architecture</h4>${archHTML(cs.arch)}</div>
        <div class="case-block"><h4>Engineering Challenges</h4><ul>${cs.challenges.map(c=>`<li>${c}</li>`).join('')}</ul></div>
        <div class="case-block"><h4>What I Learned</h4><p>${cs.learned}</p></div>
        ${cs.note ? `<div class="case-block"><h4>Note</h4><p>${cs.note}</p></div>` : ''}
      </div>
    </details>
  </div>`;
}

function renderProjects(filter){
  const sorted = [...projects].sort((a,b)=> (b.featured?1:0) - (a.featured?1:0));
  grid.innerHTML = sorted
    .filter(p => filter === 'all' || p.cats.includes(filter))
    .map(projectCard).join('');
  attachCardEffects();
}
renderProjects('all');

function attachCardEffects(){
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
  attachShotClicks(grid);
}

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
function openLightbox(src){
  lightboxImg.src = src;
  lightbox.classList.add('open');
}
document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') lightbox.classList.remove('open'); });

function attachShotClicks(scope){
  scope.querySelectorAll('.shot-frame img').forEach(img => {
    img.addEventListener('click', () => {
      if(img.style.display === 'none') return; // no real image loaded yet
      openLightbox(img.src);
    });
  });
}

filterBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if(!btn) return;
  filterBar.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderProjects(btn.dataset.filter);
});

/* ---------------- DEDICATED SCREENSHOTS SECTION ---------------- */
const shotsGroups = document.getElementById('shotsGroups');
function renderScreenshotsSection(){
  shotsGroups.innerHTML = projects.map(p => `
    <div class="shots-project glass reveal">
      <div class="shots-project-head">
        <h3>${p.name}</h3>
        <span class="status-pill ${statusClass[p.status]}"><span class="status-dot"></span>${p.statusLabel}</span>
      </div>
      <div class="shot-gallery">
        ${p.screenshots.map(src => shotFrameHTML(p.name, src)).join('')}
      </div>
    </div>
  `).join('');
  // re-run the reveal-on-scroll setup for the newly injected elements
  const newReveals = shotsGroups.querySelectorAll('.reveal');
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io2.unobserve(e.target); } });
  }, {threshold:0.12});
  newReveals.forEach((el,i) => { el.style.setProperty('--stagger', Math.min(i,5)*90+'ms'); io2.observe(el); });
  attachShotClicks(shotsGroups);
}
renderScreenshotsSection();

/* ---------------- SECURITY LABS DATA ---------------- */
const labs = [
  {
    icon:'01', name:'SQL Injection Exploitation', sub:'PortSwigger Web Security Academy · Burp Suite',
    objective:'Understand and exploit UNION-based and blind SQL injection vulnerabilities in deliberately vulnerable web applications.',
    environment:'PortSwigger Web Security Academy labs, Burp Suite, FoxyProxy, and Firefox on Kali Linux.',
    method:'Worked through UNION-based attacks first, then moved to blind boolean-based SQL injection, using Burp Intruder to automate character-by-character extraction against a live target.',
    findings:'Extracted a full 20-character administrator password character-by-character via Intruder, with no visible query output at any point — confirmation that the injection was exploitable purely through boolean response differences.',
    skills:['Burp Suite (Intruder, Repeater)','UNION-based SQLi','Blind boolean-based SQLi','Database enumeration']
  },
  {
    icon:'02', name:'DNS Tunneling Detection', sub:'Kali Linux (host + attacker VM) · Wireshark',
    objective:'Investigate DNS tunneling as a covert data-exfiltration and C2 channel, and learn to spot it at the network layer.',
    environment:'A Kali Linux desktop as the host machine, a second Kali Linux VM configured as the attacker, and Wireshark for packet capture and log analysis.',
    method:'Generated DNS tunneling traffic from the attacker VM directed at the host, captured the traffic with Wireshark, and reviewed DNS query patterns and volume in the resulting logs.',
    findings:'Identified the traffic signatures that distinguish tunneling from normal DNS activity — unusual query patterns and volume — directly in the packet captures.',
    skills:['Wireshark','Packet analysis','DNS-based threat detection','Network security monitoring']
  },
  {
    icon:'03', name:'SIEM Log Analysis with Splunk', sub:'Splunk Enterprise · Completed',
    objective:'Build practical log-analysis and monitoring capability using a real SIEM tool, working against a large DNS dataset.',
    environment:'Splunk Enterprise, installed on a Kali Linux system.',
    method:'Ingested a large DNS dataset and worked through sourcetype configuration, field extraction, and timestamp parsing issues to get the data usable for analysis.',
    findings:'Came away with a working understanding of the friction points in getting raw log data into a queryable, correctly-parsed state inside a SIEM — not just running searches once the data is already clean.',
    skills:['Splunk (sourcetypes, field extraction)','Log parsing','SIEM fundamentals']
  },
  {
    icon:'04', name:'Cyber Kill Chain Exercises', sub:'Hack The Box',
    objective:'Practice mapping real attack activity onto the stages of the Cyber Kill Chain — from reconnaissance through to actions on objectives.',
    environment:'Hack The Box labs.',
    method:'Worked through kill-chain-oriented exercises on HTB, tying each step of an attack to its corresponding kill chain stage.',
    findings:'Reinforced how the stages connect in practice, not just on paper — useful groundwork for later threat-hunting and detection work.',
    skills:['Attack lifecycle analysis','Cyber Kill Chain','Hands-on labs (HTB)']
  },
  {
    icon:'05', name:'MITRE ATT&CK, Kill Chain &amp; Network Fundamentals', sub:'Ongoing drills',
    objective:'Build fluency in the frameworks and fundamentals that underpin detection and investigation work.',
    environment:'MITRE ATT&CK framework documentation, OSI model and network topology references.',
    method:'Regularly drilling MITRE ATT&CK, the Cyber Kill Chain, the OSI model, and network topology concepts — mapping techniques encountered in hands-on labs back to the frameworks.',
    findings:'Ongoing — the goal is fluency, not a one-time pass.',
    skills:['MITRE ATT&CK','OSI model','Network topology','Threat intelligence fundamentals']
  },
  {
    icon:'06', name:'SOC Analyst Learning Roadmap', sub:'Self-directed curriculum design',
    objective:'Turn scattered self-study into a structured, job-ready path rather than an unordered pile of tutorials.',
    environment:'Self-directed — planning built around Ongoza Cyber Hub training plus independent labs.',
    method:'Mapped out a nine-phase roadmap spanning foundations through to job-ready SOC analyst skills, sequencing networking and Linux fundamentals before SIEM tooling, detection engineering, and incident response.',
    findings:'Gives every lab above a place in a bigger picture, and a clear view of what comes next.',
    skills:['Self-directed learning','Curriculum planning','SOC analyst fundamentals']
  }
];

const labList = document.getElementById('labList');
labList.innerHTML = labs.map((l,i) => `
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
        <div class="lab-field"><h5>Method</h5><p>${l.method}</p></div>
        <div class="lab-field"><h5>Findings</h5><p>${l.findings}</p></div>
      </div>
      <div class="skill-tags">${l.skills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div>
    </div>
  </div>
`).join('');

labList.querySelectorAll('.lab-head').forEach(head => {
  head.addEventListener('click', () => head.closest('.lab').classList.toggle('open'));
});
labList.querySelector('.lab')?.classList.add('open');

/* terminal (unused placeholder retained for future use) */

/* placeholder link warnings */
['cvLink'].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.addEventListener('click', (e)=>{
    e.preventDefault();
    alert('Add a link to your CV file here (e.g. an uploaded PDF URL) — replace the #cvLink href in index.html.');
  });
});
['linkedinLink','linkedinLinkNav','linkedinLinkProfile'].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.addEventListener('click', (e)=>{
    e.preventDefault();
    alert('Add your LinkedIn profile URL here — replace this href in index.html.');
  });
});