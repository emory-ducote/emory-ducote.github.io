const menu = document.getElementById('menu');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const bodyContent = document.getElementById('bodyContent');

const projects = [
  {
    title: 'Drink Delivery Bot',
    image: 'images/truckbot.gif',
    page: 'drink_delivery_bot',
    descriptionFile: 'projects/drinkbot.md'
  },
  {
    title: 'RACECAR Dataset',
    image: 'images/racecar_dataset.gif',
    page: 'project2',
    descriptionFile: 'projects/racecar_dataset.md'
  },
  {
    title: 'CAR Radar Perception Pipeline',
    image: 'images/ekf.gif',
    page: 'perception_pipeline',
    descriptionFile: 'projects/radar_perception_pipeline.md'
  },
  {
    title: 'Futbot!',
    image: 'images/futbot.gif',
    page: 'futbot',
    descriptionFile: 'projects/futbot.md'
  },
  {
    title: 'Chicken Battle',
    image: 'images/dodgeball_battle.gif',
    page: 'chicken_battle',
    descriptionFile: 'projects/robot_chicken.md'
  },
  {
    title: 'Nixie Clock',
    image: 'images/nixie.gif',
    page: 'nixie',
    descriptionFile: 'projects/nixie.md'
  },
  {
    title: 'Magnus Prusa i3 ',
    image: 'images/printer_printing.gif',
    page: 'printer',
    descriptionFile: 'projects/printer.md'
  }
];

const pages = {
  experience: {
    title: `Hi there, I'm Emory`,
    content: `
      <p>I'm a <strong>robotics enthusiast</strong> who loves <strong>building</strong>, <strong>racing</strong>, and <strong>coding</strong> things that move. My journey has taken me from the <strong>University of Virginia</strong> to <strong>high-speed autonomous racing</strong> and now to <strong>underwater robotics research </strong>at UT Austin. I enjoy working on <strong>perception</strong>, <strong>planning</strong>, and <strong>control</strong> for robots, and I'm always looking for new ways to push technology forward.</p>
      <h2>Education</h2>
      <p><strong>University of Virginia</strong><br>
      <strong>Master of Computer Science (MCS)</strong>, Jan 2022 - May 2023<br>
      Certificate: <strong>Cyber-Physical Systems</strong><br>
      <strong>B.S. Computer Engineering</strong>, Aug 2018 - May 2022</p>
      <h2>Cavalier Autonomous Racing</h2>
      <p>I was the <strong>Radar Perception Lead</strong> for the <strong>Cavalier Autonomous Racing</strong> team, where I worked on <strong>radar object detection</strong> for an autonomous race car that hit speeds over <strong>120 mph</strong> in the <strong>Indy Autonomous Challenge</strong>. I tuned <strong>tracking filters</strong>, <strong>optimzied code</strong> for real-time racing, and helped the team get the most out of our sensors. <a href="http://autonomousracing.dev" target="_blank">Learn more</a></p>
      <h2>What I'm Up To Now</h2>
      <p><strong>Robotics Software Engineer</strong>, Applied Research Laboratories at <strong>UT Austin</strong> (July 2023 - Present)<br></p>
      <p>These days, I'm working on <strong> Unmanned Underwater Vehicles (UUVs) </strong> at ARLUT. In my free time I have also been working on an <strong> autonomous mobile robot </strong> to navigate around my apartment and bring me drinks on the couch. </p>
    `
  },
  projects: {
    title: 'Projects',
    content: `<div class="projects-grid">
      ${projects.map(p => p.page ? `
        <div class="project-item">
          <a href="#" class="project-link" data-project="${p.page}">
            <img src="${p.image}" alt="${p.title}" class="project-thumb">
            <div class="project-title">${p.title}</div>
          </a>
        </div>
      ` : `
        <div class="project-item" style="visibility:hidden;"></div>
      `).join('')}
    </div>`
  },
  login: {
    title: 'Login',
    content: `<p>Login form or authentication options go here.</p>`
  },
  resume: {
    title: 'Resume',
    content: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <iframe src="resume.pdf" width="200%" height="700px" style="border:1px solid #ccc;max-width:2000px;"></iframe>
        <a href="resume.pdf" download style="margin-top:1.5rem;font-size:1.15rem;padding:0.7rem 1.5rem;background:#232323;color:#fff;border-radius:6px;text-decoration:none;display:inline-block;">Download PDF</a>
      </div>
    `
  }
};

function renderPage(page) {
  if (pages[page]) {
    bodyContent.innerHTML = `<h1>${pages[page].title}</h1>\n${pages[page].content}`;
    if (page === 'projects') {
      // Attach click listeners after DOM update
      document.querySelectorAll('.project-link').forEach(link => {
        link.onclick = function(e) {
          e.preventDefault();
          const proj = this.getAttribute('data-project');
          renderProjectPage(proj);
        };
      });
    }
  }
}

function renderProjectPage(proj) {
  const project = projects.find(p => p.page === proj);
  if (project) {
    fetch(project.descriptionFile)
      .then(res => res.text())
      .then(md => {
        // Use marked.js for full markdown rendering
        let html = window.marked ? window.marked.parse(md) : md;
        bodyContent.innerHTML = `
          <h1>${project.title}</h1>
          <img src="${project.image}" alt="${project.title}" class="project-thumb project-thumb-large" style="margin-bottom:2rem;">
          <div class="project-desc">${html}</div>
          <button class="back-to-projects">Back to Projects</button>
        `;
        document.querySelector('.back-to-projects').onclick = () => renderPage('projects');
          // Trigger MathJax typesetting for LaTeX rendering
          if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([bodyContent]);
          }
      });
  }
}

menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const page = e.target.getAttribute('data-page');
    renderPage(page);
    if (window.innerWidth < 900) {
      menu.classList.remove('open');
    }
  }
});

// Remove any existing Resume menu item to avoid duplicates
const existingResume = Array.from(menu.children).find(li => li.getAttribute('data-page') === 'resume');
if (existingResume) menu.removeChild(existingResume);

// Find the Projects menu item
const projectsMenuItem = Array.from(menu.children).find(li => li.getAttribute('data-page') === 'projects');

// Create Resume menu item
const resumeMenuItem = document.createElement('li');
resumeMenuItem.textContent = 'Resume';
resumeMenuItem.setAttribute('data-page', 'resume');

// Insert Resume after Projects
if (projectsMenuItem && projectsMenuItem.nextSibling) {
  menu.insertBefore(resumeMenuItem, projectsMenuItem.nextSibling);
} else {
  menu.appendChild(resumeMenuItem);
}

hamburgerBtn.addEventListener('click', () => {
  menu.classList.toggle('open');
});

window.addEventListener('click', (e) => {
  if (window.innerWidth < 900 && !menu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// On page load, check for hash and render project if present
window.addEventListener('DOMContentLoaded', () => {
  renderPage('experience');
  const hash = window.location.hash.replace('#', '');
  if (hash && projects.some(p => p.page === hash)) {
    renderProjectPage(hash);
  }
});
