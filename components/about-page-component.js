export default {
  name: 'about-page-component',
  template: /* html */ `
    <section class="container py-4">
      <h1>About Planet Explorer</h1>
      <p>Planet Explorer is a simple web app for learning about our solar system. It presents information about all eight planets, including their location from the Sun, their type, when they were discovered, and their potential to support life.</p>
      <h2 class="h4 mt-4">App Features</h2>
      <ul>
        <li>Browse all 8 planets in our solar system</li>
        <li>View key information like discovery date and planet type</li>
        <li>Learn about each planet's potential for supporting life</li>
        <li>See images and distances from the Sun</li>
      </ul>
      <h2 class="h4 mt-4">Data</h2>
      <p>This app uses simulated data for demonstration purposes. In a future update, we will connect to real astronomical databases for live planet information.</p>
    </section>
  `,
};
