# Routes Documentation

## Main Route
- `/` - Main landing page with portfolio information

## Games Route
- `/games` - Games index page listing all interactive games and experiments

## Project Routes
All projects are individual routes under the root path:

- `/ipong-x` - iPong X parody smartphone landing page (fully functional)
- `/ball-game` - Ball Game (fully functional)
- `/solar-system` - Solar System Simulator 3D (fully functional)
- `/donut` - Donut interactive experience (placeholder, coming soon)
- `/living-rps` - Living Rock Paper Scissors (placeholder, coming soon)
- `/conway` - Conway's Game of Life (fully functional)

## Project Structure

```
app/
├── page.jsx           # Main landing page (single route at /)
├── layout.jsx         # Root layout
├── styles/
│   ├── globals.css    # Global styles
│   └── game-page.css  # Shared project page styles
├── games/
│   ├── page.jsx       # Games index page
│   └── styles.css     # Games page styles
├── ball-game/
│   └── page.jsx
├── solar-system/
│   └── page.jsx
├── donut/
│   └── page.jsx
├── ipong-x/
│   ├── page.jsx
│   ├── styles.css
│   └── BootstrapClient.jsx
├── living-rps/
│   └── page.jsx
└── conway/
    └── page.jsx
```

## Assets
Project assets are stored in the `public/archives` folder and can be referenced with `/archives/...` in the code.

## Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project URLs
- Main page: `http://localhost:3000/`
- iPong X: `http://localhost:3000/ipong-x`
- Ball Game: `http://localhost:3000/ball-game`
- Solar System: `http://localhost:3000/solar-system`
- Donut: `http://localhost:3000/donut`
- Living RPS: `http://localhost:3000/living-rps`

## Converting Archives to Web Projects

To convert a project from the archives:

1. Create the project logic in the respective `app/[project-name]/page.jsx` file
2. Add any project-specific styles
3. Ensure assets are accessible from `public/archives/[project-name]/`
4. Update the main page link description once complete
