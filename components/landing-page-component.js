export default {
  name: 'landing-page-component',
  template: /* html */ `
    <div class="container py-4">
      <h1 class="mb-3">🪐 Planet Explorer</h1>
      <p class="lead">Discover information about the planets in our solar system. Learn about their characteristics, distance from the Sun, and potential for supporting life.</p>
      <router-link to="/items" class="btn btn-primary mb-4"><i class="bi bi-search me-1"></i>Explore Planets</router-link>

      <h2 class="h4 mt-3">About This App</h2>
      <p>
        Welcome to Planet Explorer! This app lets you browse all eight planets in our solar system. For each planet, you can see general information like when it was discovered, what type of planet it is (Terrestrial, Gas Giant, or Ice Giant), and how likely it is to support life.
      </p>
      <p>
        Click "Explore Planets" above to start browsing. Select any planet to see more detailed information!
      </p>
    </div>
  `,
};
