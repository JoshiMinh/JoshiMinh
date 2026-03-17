# MinhPhungPC Laravel Conversion

This repository tracks the migration of the MinhPhungPC storefront from the legacy PHP codebase in `OLD/` to a modern Laravel application.

## Requirements

- PHP 8.1+
- Composer
- Node.js 18+
- NPM or Yarn
- A database supported by Laravel (MySQL or MariaDB recommended)

## Getting Started

1. Copy `.env.example` to `.env` and adjust the database/mail settings for your environment.
2. Install PHP dependencies with `composer install`.
3. Generate an application key with `php artisan key:generate`.
4. Run database migrations with `php artisan migrate`.
5. Install and build front-end assets with `npm install` followed by `npm run build` (or `npm run dev` during development).
6. Serve the application locally with `php artisan serve`.

## Required Front-End Assets

To keep the repository lightweight, all binary assets (images, icons, and videos) have been removed. Before serving the UI, provide the following files so that the navigation, builder, and account screens render correctly:

### Application Branding (place in `public/`)

- `logo.png`
- `logo_light.png`
- `icon.png`
- `default.jpg` (default avatar/product image fallback)

### Component Icons (place in `public/component_icons/`)

Create the directory if it does not exist and add PNG icons with the exact filenames below:

- `cooler.png`
- `cpucooler.png`
- `graphicscard.png`
- `memory.png`
- `motherboard.png`
- `operatingsystem.png`
- `pccase.png`
- `powersupply.png`
- `processor.png`
- `storage.png`

### Sample Profile Images (optional, place in `public/profile_images/`)

These filenames are referenced by seeded/demo data. You can provide your own avatars or omit them if you are not using the demo content:

- `Concac.jpeg`
- `JoshiMinh.jpg`
- `Joshi_GAV.png`
- `Phụng_Nguyễn.png`
- `a.jpg`
- `caibuom.png`

### Legacy Front-End Backup (`OLD/`)

If you need to run the legacy PHP version, populate the mirrored directories under `OLD/` with the same filenames listed above. The PHP scripts expect the assets to exist at:

- `OLD/logo.png`, `OLD/logo_light.png`, `OLD/icon.png`, `OLD/default.jpg`
- `OLD/component_icons/*.png` (same filenames as the Laravel app)
- `OLD/profile_images/*` (same filenames as the optional avatars)

You can restore these assets from your private backups of the original project or replace them with custom artwork that matches the expected filenames.

## Testing

Run the application test suite with:

```bash
php artisan test
```

> **Note:** The historical vendor directory included with the project may be incomplete. If Artisan fails to bootstrap, run `composer install` to download the missing packages.

## License

This project inherits the original licensing terms of the MinhPhungPC codebase. Consult the project stakeholders if you plan to redistribute or commercialize the software.
