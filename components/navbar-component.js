export default {
  name: 'navbar-component',
  template: /* html */ `
    <nav class="navbar topbar sticky-top px-3 d-flex align-items-center">
      <button class="sidebar-toggle btn btn-outline-primary btn-sm me-2" onclick="document.body.classList.toggle('sidebar-open')" aria-label="Toggle menu">
        <i class="bi bi-list"></i>
      </button>
      <span class="navbar-brand mb-0 h1"><i class="bi bi-globe me-2"></i>🪐 Planet Explorer</span>
    </nav>

    <aside class="sidebar" role="navigation" aria-hidden="true">
      <div class="sidebar-content">
        <button class="sidebar-close btn btn-link text-light" onclick="document.body.classList.remove('sidebar-open')" aria-label="Close menu">
          <i class="bi bi-x-lg"></i>
        </button>
        <div class="sidebar-links d-flex flex-column mt-3">
          <router-link class="btn btn-outline-primary btn-sm mb-2" to="/">
            <i class="bi bi-house me-1"></i>Home
          </router-link>
          <router-link class="btn btn-outline-primary btn-sm mb-2" to="/items">
            <i class="bi bi-card-list me-1"></i>Items
          </router-link>
          <router-link class="btn btn-outline-primary btn-sm mb-2" to="/about">
            <i class="bi bi-info-circle me-1"></i>About
          </router-link>
          <router-link class="btn btn-outline-primary btn-sm" to="/contact">
            <i class="bi bi-envelope me-1"></i>Contact Me
          </router-link>
        </div>
          <div class="sidebar-footer">
            <router-link class="btn btn-link sidebar-disclaimer" to="/data-disclaimer">
              <i class="bi bi-file-earmark-text me-1"></i>Data Disclaimer
            </router-link>
          </div>
      </div>
    </aside>

    <div class="sidebar-backdrop" onclick="document.body.classList.remove('sidebar-open')"></div>
  `,
};
