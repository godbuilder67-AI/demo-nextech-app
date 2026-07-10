import LandingPageComponent from './components/landing-page-component.js';
import AboutPageComponent from './components/about-page-component.js';
import DataDisclaimerComponent from './components/data-disclaimer-component.js';
import ContactPageComponent from './components/contact-page-component.js';
import NavbarComponent from './components/navbar-component.js';
import CollectionPageComponent from './components/collection-page-component.js';
import ItemDetailPageComponent from './components/item-detail-page-component.js';

const routes = [
  {
    path: '/',
    component: LandingPageComponent,
  },
  {
    path: '/about',
    component: AboutPageComponent,
  },
  {
    path: '/data-disclaimer',
    component: DataDisclaimerComponent,
  },
  {
    path: '/contact',
    component: ContactPageComponent,
  },
  {
    path: '/items',
    component: CollectionPageComponent,
  },
  {
    path: '/items/:id',
    component: ItemDetailPageComponent,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  },
});

function resolveAssetUrl(value) {
  const trimmedValue = String(value || '').trim();
  if (!trimmedValue) {
    return '';
  }

  const normalizedValue = trimmedValue.replace(/^\.\//, '');

  try {
    return new URL(normalizedValue, window.location.href).href;
  } catch {
    return normalizedValue;
  }
}

router.beforeEach((to, from, next) => {
  document.body.classList.add('page-transition');
  next();
});

function updateRowenVisibilityForPath(path) {
  try {
    const widget = document.getElementById('rowen-gpt-widget');
    const panel = document.getElementById('rowen-gpt-panel');
    const toggle = document.getElementById('rowen-gpt-toggle');
    const isDetail = /^\/items\/[^/]+$/.test(path);

    if (!widget) return;

    if (isDetail) {
      widget.style.display = '';
      widget.setAttribute('aria-hidden', 'false');
    } else {
      widget.style.display = 'none';
      widget.setAttribute('aria-hidden', 'true');
      if (panel) panel.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  } catch (e) {
    // ignore
  }
}

router.afterEach((to) => {
  updateRowenVisibilityForPath(to.path || '');

  window.setTimeout(() => {
    document.body.classList.remove('page-transition');
  }, 250);
});

const app = Vue.createApp({
  setup() {
    const itemsStore = Vue.reactive({
      items: [],
      isLoading: true,
      error: '',
    });

    fetch('items.csv')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load CSV data file.');
        }
        return response.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data, errors }) => {
            if (errors.length > 0) {
              itemsStore.error = 'There was a problem reading the CSV data.';
              itemsStore.items = [];
            } else {
              itemsStore.items = data.map((row) => {
                const rawImage = String(row.image_url || '').trim();
                const imageUrl = rawImage ? resolveAssetUrl(rawImage) : '';

                return {
                  id: String(row.id || '').trim(),
                  name: String(row.name || '').trim(),
                  description: String(row.description || '').trim(),
                  category: String(row.category || '').trim(),
                  imageUrl,
                  location: String(row.location || '').trim(),
                };
              });
              itemsStore.error = '';
            }
            itemsStore.isLoading = false;
          },
          error: () => {
            itemsStore.error = 'There was a problem parsing CSV data.';
            itemsStore.items = [];
            itemsStore.isLoading = false;
          },
        });
      })
      .catch(() => {
        itemsStore.error = 'There was a problem loading data.';
        itemsStore.items = [];
        itemsStore.isLoading = false;
      });

    Vue.provide('itemsStore', itemsStore);

    return {};
  },
});

app.component('navbar-component', NavbarComponent);

app.use(router);
app.mount('#app');
// Ensure the Rowen-GPT widget visibility matches the initial route
try {
  updateRowenVisibilityForPath(router.currentRoute.value.path || '');
} catch (e) {
  // ignore if function not available
}

const chatToggle = document.getElementById('rowen-gpt-toggle');
const chatPanel = document.getElementById('rowen-gpt-panel');
const chatClose = document.getElementById('rowen-gpt-close');
const chatForm = document.getElementById('rowen-gpt-form');
const chatInput = document.getElementById('rowen-gpt-input');
const chatMessages = document.getElementById('rowen-gpt-messages');

if (chatToggle && chatPanel) {
  const togglePanel = () => {
    const isOpen = chatPanel.classList.toggle('is-open');
    chatToggle.setAttribute('aria-expanded', String(isOpen));

    if (isOpen && chatInput) {
      window.setTimeout(() => chatInput.focus(), 80);
    }
  };

  chatToggle.addEventListener('click', togglePanel);

  if (chatClose) {
    chatClose.addEventListener('click', (event) => {
      event.stopPropagation();
      chatPanel.classList.remove('is-open');
      chatToggle.setAttribute('aria-expanded', 'false');
    });
  }

  const addMessage = (text, sender) => {
    if (!chatMessages) {
      return;
    }

    const message = document.createElement('div');
    message.className = `rowen-gpt-message ${sender}`;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const showTyping = () => {
    if (!chatMessages) {
      return;
    }

    const typing = document.createElement('div');
    typing.id = 'rowen-gpt-typing';
    typing.className = 'rowen-gpt-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const removeTyping = () => {
    const typing = document.getElementById('rowen-gpt-typing');
    if (typing) {
      typing.remove();
    }
  };

  let lastReply = '';

  const getReply = (message) => {
    const lower = message.toLowerCase();

    const replies = [
      'I kinda dont wanna',
      'I dont know, google that for real.',
      'How should I know?',
      'I dont wanna answer that.',
      'Go ask your mom, she knows everything.',
      'I dont know, maybe you should ask a real scientist.',
      'I dont know, maybe you should ask a real astronaut.',
      'I dont know everything',
      'I dont know, I just know a lot of nothing about space.',
      'I\'m not quite sure.',
      'Maybe the real answer is inside you.',
      'Maybe you should ask the real Rowen.',
      'Give it your rec room best',
      'The cake is a lie',
      'meow',
      'Google exists for a reason',
      'Thats a solid maybe',
      ''
    ];

    const topicReplies = [];
    const replyPool = topicReplies.length > 0 ? topicReplies : replies;

    let randomIndex = Math.floor(Math.random() * replyPool.length);
    let fallbackReply = replyPool[randomIndex];

    if (replyPool.length > 1) {
      while (fallbackReply === lastReply) {
        randomIndex = Math.floor(Math.random() * replyPool.length);
        fallbackReply = replyPool[randomIndex];
      }
    }

    lastReply = fallbackReply;

    if (lower.trim() === 'send selected message') {
      return fallbackReply;
    }

    if (fallbackReply === 'Maybe you should ask the real Rowen.') {
      return fallbackReply;
    }

    if (fallbackReply === 'I dont know, maybe you should ask a real scientist.' || fallbackReply === 'I dont know, maybe you should ask a real astronaut.') {
      return fallbackReply;
    }

    return fallbackReply;
  };

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = chatInput.value.trim();

      if (!message) {
        return;
      }

      addMessage(message, 'user');
      chatInput.value = '';
      showTyping();

      window.setTimeout(() => {
        removeTyping();
        addMessage(getReply(message), 'bot');
      }, 900);
    });
  }
}

// Flying stars with mouse repulsion
const stars = [];
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
const STAR_COUNT = 40;
const REPEL_DISTANCE = 150;

function createStar() {
  const star = document.createElement('div');
  star.className = 'flying-star';
  if (Math.random() > 0.7) star.classList.add('large');
  if (Math.random() > 0.6) star.classList.add('colored');
  
  star.x = Math.random() * window.innerWidth;
  star.y = Math.random() * window.innerHeight;
  star.vx = (Math.random() - 0.5) * 1.5;
  star.vy = (Math.random() - 0.5) * 1.5;
  star.originalVx = star.vx;
  star.originalVy = star.vy;
  
  document.body.appendChild(star);
  stars.push(star);
}

function updateStars() {
  stars.forEach(star => {
    star.x += star.vx;
    star.y += star.vy;
    
    // Wrap around edges
    if (star.x < -10) star.x = window.innerWidth + 10;
    if (star.x > window.innerWidth + 10) star.x = -10;
    if (star.y < -10) star.y = window.innerHeight + 10;
    if (star.y > window.innerHeight + 10) star.y = -10;
    
    // Calculate distance to mouse
    const dx = star.x - mouseX;
    const dy = star.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Repel from mouse
    if (distance < REPEL_DISTANCE && distance > 0) {
      const angle = Math.atan2(dy, dx);
      const force = (1 - distance / REPEL_DISTANCE) * 3;
      star.vx = Math.cos(angle) * force + star.originalVx * 0.5;
      star.vy = Math.sin(angle) * force + star.originalVy * 0.5;
    } else {
      // Return to original velocity
      star.vx += (star.originalVx - star.vx) * 0.02;
      star.vy += (star.originalVy - star.vy) * 0.02;
    }
    
    star.style.left = star.x + 'px';
    star.style.top = star.y + 'px';
  });
  
  requestAnimationFrame(updateStars);
}

document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// Initialize stars
for (let i = 0; i < STAR_COUNT; i++) {
  createStar();
}

updateStars();
