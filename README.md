# UAE Services Directory

A React application for browsing UAE-style government services.

This project started from a simple frontend assignment: show a list of services, support search, add at least one filter, and use UAE Design System where possible. I kept that required scope at the center, then added a few practical features that make the app feel closer to a real service directory without turning it into a backend-heavy product.

## What Was Built

The app has two main user-facing routes:

- `/` for browsing all services.
- `/favorites` for services marked as favorites.
- `/services/:serviceId` for a service details view.

Users can browse, search, filter, sort, paginate, favorite, add, edit, delete, and reset services. The app also supports English and Arabic, including RTL layout changes when Arabic is selected.

## Assignment Requirements Covered

The original assignment requirements are covered:

- A services list page.
- Reusable service cards.
- Search by service title and description.
- Additional filters beyond search.
- Functional React components and hooks.
- Mock data.
- UAE Design System usage.
- README documentation.

## Enhancements Added

On top of the assignment baseline, the project includes:

- Fake Promise-based API layer.
- localStorage persistence.
- Full local CRUD flow.
- Add and edit modal form.
- Delete confirmation modal instead of browser alerts.
- Favorites page.
- Service details page.
- Breadcrumbs on details pages.
- Debounced search.
- Category, status, tag, and popular filters.
- Tags filter modal.
- Sorting by date, title, processing time, and fee.
- Pagination with 9 services per page.
- Filter state saved in the URL.
- Loading skeletons.
- Empty and error states.
- Toast feedback for create, edit, delete, reset, favorite, and start actions.
- English and Arabic translations.
- RTL support for Arabic.
- Dark mode toggle.
- Yup validation.
- Focused unit tests.
- Vercel routing configuration.

## UAE Design System Usage

The app uses the UAE Design System packages:

- `@aegov/design-system`
- `@aegov/design-system-react`

The React components from the package are wrapped in small local `App*` components under:

```txt
src/components/common/design-system/
```

This keeps the app code clean and makes the design-system dependency easier to replace or adjust later.

Current wrappers include:

- `AppButton`
- `AppCard`
- `AppInput`
- `AppTextarea`
- `AppSelect`
- `AppCheckbox`
- `AppToggle`
- `AppTooltip`
- `AppToast`
- `AppBreadcrumbs`
- `AppIconButton`
- `AppModal`

Most wrappers are thin wrappers around UAE Design System React components. `AppModal` uses Radix dialog primitives internally because the package modal API is more trigger-oriented, while this app needs controlled modals for CRUD, nested filters, and confirmation flows.

The UI also uses UAE Design System tokens and utility classes for color, spacing, badges, buttons, cards, form controls, and dark-mode adjustments.

## Data And API Approach

The app does not use a backend API. It uses 50 seeded UAE-style service records from:

```txt
src/data/initialServices.ts
```

The UI does not read from the seed data directly. All service operations go through:

```txt
src/api/servicesApi.ts
```

That fake API returns Promises and adds a small delay so the app can show realistic loading states.

Supported operations:

- `getServices`
- `createService`
- `updateService`
- `deleteService`
- `toggleFavorite`
- `resetServices`

Changes are persisted in localStorage. Resetting data restores the original seeded services and clears local CRUD/favorite changes.

## Search, Filters, And URL State

Search is client-side and debounced. It checks:

- Title.
- Description.
- Category.
- Tags.
- Localized Arabic text when Arabic is selected.

Filters are also client-side. The app supports:

- Category filter.
- Status filter.
- Tag filter.
- Popular-only filter.
- Sort option.
- Current page.

Filter and sort state is stored in the URL query string so the current view can be refreshed or shared.

## UI States

The app includes the basic states expected in a real frontend flow:

- Initial loading skeletons.
- Empty state when no services match.
- Empty favorites state.
- Error state with retry.
- Button-level loading for saving, deleting, and resetting.
- Toast feedback after user actions.

## Internationalization

The UI uses:

- `i18next`
- `react-i18next`

English and Arabic translations live in:

```txt
src/i18n/locales/en.json
src/i18n/locales/ar.json
```

When Arabic is selected, the app updates the document language and direction:

```txt
lang="ar"
dir="rtl"
```

Service titles, descriptions, categories, statuses, tags, fees, and processing time labels are shown in Arabic where available.

## Validation

The service form uses Yup validation for:

- Required title.
- Required description.
- Category.
- Status.
- Positive processing time.
- Zero-or-positive fee.
- At least one tag.

Validation messages are translated.

## Testing

The project includes focused unit tests with Vitest and React Testing Library. Tests cover the main logic and user-facing behavior rather than chasing full coverage.

Covered areas include:

- Search.
- Filtering.
- Sorting.
- Pagination.
- Favorite persistence.
- Form validation.
- Language switching.

## AI Assistance Note

I used AI as a support tool for repetitive and review-heavy work, not as a replacement for planning or implementation ownership.

AI helped with things like drafting seed data, checking wording, reviewing UI details, spotting possible gaps, and acting like a coding assistant for routine edits. The project direction, feature decisions, architecture, implementation choices, review passes, and final code ownership remained mine.

In short: this was not vibe coding. I planned and implemented the app, while using AI as a copilot for the donkey work and extra review.

## Project Structure

```txt
src/
  api/                 fake Promise API and localStorage persistence
  components/common/   reusable states, pagination, toast, dialogs
  components/layout/   app shell, header, navigation, footer
  components/services/ service cards, toolbar, filters, form, banner
  config/              app constants
  data/                50-item seed dataset
  hooks/               useQuery, useDebounce, useLocalStorage
  i18n/                English and Arabic translations
  pages/               services, favorites, details pages
  routes/              route configuration
  types/               shared TypeScript types
  utils/               filtering, sorting, pagination, formatting helpers
```

## Author

Built by Abdulrahman Mamdouh.

- GitHub: https://github.com/abdumamdouh
- LinkedIn: https://www.linkedin.com/in/abdumamdouh/

For setup, scripts, and local development instructions, see SETUP.md.
