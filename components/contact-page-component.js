export default {
  name: 'contact-page-component',
  template: /* html */ `
    <section class="container py-4">
      <h1>Contact Me</h1>
      <p>If you'd like to reach me directly, use one of the links below.</p>

      <section class="contact-details mt-3">
        <h2 class="h4">Direct contact</h2>
        <ul class="list-unstyled mt-3">
          <li class="mb-2">
            <strong>Email:</strong>
            <a href="mailto:example@gmail.com?subject=Hello%20from%20your%20site" class="ms-2">example@gmail.com</a>
          </li>
          <li class="mb-2">
            <strong>Phone:</strong>
            <a href="tel:+1234567890" class="ms-2">+1 (234) 567-890</a>
          </li>
          <li class="mb-2">
            <strong>Twitter:</strong>
            <a href="https://twitter.com/example" class="ms-2" target="_blank" rel="noopener">@example</a>
          </li>
        </ul>
        <p>This is not my actual contact information, i dont want people to contact me.</p>
      </section>
    </section>
  `,
};
