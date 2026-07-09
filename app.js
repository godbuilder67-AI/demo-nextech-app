import LandingPageComponent from './components/landing-page-component.js';
import AboutPageComponent from './components/about-page-component.js';
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

router.afterEach(() => {
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
