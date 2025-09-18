# Joshi Minh · Portfolio

This repository now contains a fully static version of my portfolio so it can be hosted without a build step (for example on GitHub Pages). The layout mirrors the original Next.js experience with sections for highlights, expertise, projects, and ways to connect.

## Preview locally

Open `index.html` directly in your browser or serve the site with any static HTTP server. For example:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000) and navigate to `index.html`.

## Deploy on GitHub Pages

1. Push the repository to GitHub.
2. In the repository settings, open **Pages**.
3. Choose the **main** branch and the `/ (root)` folder as the publishing source.
4. Save and wait for GitHub Pages to publish the site at `https://<username>.github.io/<repository>/`.

All assets are referenced relatively, so no additional configuration is needed. The site uses only static HTML, CSS, and JavaScript, plus the Lucide CDN for icons.

## Structure

```
index.html         # markup for the entire portfolio
assets/styles.css  # visual styling and responsive layout
assets/script.js   # renders data-driven sections and icons
```

Feel free to customise the copy, colours, or add more projects by editing `assets/script.js`.
