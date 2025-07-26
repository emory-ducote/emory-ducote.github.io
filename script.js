const menu = document.getElementById('menu');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const bodyContent = document.getElementById('bodyContent');

const pages = {
  experience: {
    title: 'Experience',
    content: `<p>Details about your work and education experience go here.</p>`
  },
  projects: {
    title: 'Projects',
    content: `<p>Showcase your projects here.</p>`
  },
  notes: {
    title: 'Notes',
    content: `<p>Personal notes, blog posts, or articles can be listed here.</p>`
  },
  login: {
    title: 'Login',
    content: `<p>Login form or authentication options go here.</p>`
  }
};

menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const page = e.target.getAttribute('data-page');
    if (pages[page]) {
      bodyContent.innerHTML = `<h1>${pages[page].title}</h1>\n${pages[page].content}`;
      if (window.innerWidth < 900) {
        menu.classList.remove('open');
      }
    }
  }
});

hamburgerBtn.addEventListener('click', () => {
  menu.classList.toggle('open');
});

// Optional: Close menu when clicking outside on mobile
window.addEventListener('click', (e) => {
  if (window.innerWidth < 900 && !menu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
    menu.classList.remove('open');
  }
});
