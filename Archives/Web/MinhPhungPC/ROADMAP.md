# MinhPhungPC → Laravel Migration Roadmap

This roadmap is optimized for AI assistants and focuses on making the app minimally runnable for long-term archiving (not full feature parity).

### Agent Status
- [x] **Draft roadmap ready**
- [ ] **Next:** Foundation/Bootstrap (clean vendor, install deps, set up `.env`, run migrations/build)

### Current Issues to Triage
- [ ] **Incomplete dependencies:** Tracked `vendor/` is missing files (`symfony/deprecation-contracts/function.php`). Delete tracked `vendor/` and run `composer install` before any tests/CI.
- [ ] **Missing assets:** Required branding/component images (see `README.md`) are absent; UI will show broken images until `public/` assets are restored.
- [ ] **No environment file:** Copy `.env.example` to `.env`, fill DB/mail values, then run `php artisan key:generate`.

### Minimal Run-Ready Checklist (for archival)
- [ ] **Deps & build:** `composer install`, `npm install`, `npm run build` (or `dev`), `php artisan storage:link`.
- [ ] **Env & config:** `.env` created with DB credentials; `APP_KEY` generated.
- [ ] **Database:** `php artisan migrate` succeeds on a clean DB.
- [ ] **Seed demo data (optional):** Minimal catalog/users seeded for smoke testing.
- [ ] **Assets restored:** Place required logos/component icons in `public/` per README.
- [ ] **Smoke tests (manual):** Register/login, open builder, add a component to cart, view cart; checkout may remain stubbed but should not error fatally.
- [ ] **Document non-working areas:** Note any intentionally unimplemented features to set archive expectations.

### Area-Specific Notes (scope kept minimal)
- **Builder/Search:** Keep existing compatibility checks (socket type, DDR); no expansion unless required to avoid errors.
- **Cart:** Basic add/view/remove flows should avoid unhandled exceptions; stock checks can be coarse (skip fine-grained availability if not critical).
- **Auth/Account:** Ensure registration/login/logout works; password reset/email verification may be deferred—document if omitted.
- **Admin (optional):** If time-limited, document that admin CRUD remains in `OLD/admin/` and is not ported; archive state is acceptable.

### Handoff for Archival
- [ ] Confirm app boots (`php artisan serve`) without fatal errors after the steps above.
- [ ] Record any skipped features and known limitations in README/ROADMAP for future reference.
