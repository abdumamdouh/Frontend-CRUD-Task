# Design System Wrappers

This folder contains small `App*` wrappers around `@aegov/design-system-react`.

The goal is not to hide the UAE Design System. The goal is to keep product code
consistent and make package-level adjustments easy to find.

## Wrapper Rules

- Prefer the UAE React component whenever it fits the app flow.
- Keep wrappers thin unless the app needs a controlled API, shared defaults, or
  a small compatibility fix.
- Keep product-specific layout in feature components, not in these wrappers.
- Put cross-app design-system corrections in `src/styles/design-system-overrides.css`.

## Current Tradeoffs

- `AppButton`, `AppCard`, `AppInput`, `AppSelect`, `AppTextarea`,
  `AppCheckbox`, `AppToggle`, `AppTooltip`, `AppToast`, and `AppBreadcrumbs`
  are primarily thin wrappers with shared defaults.
- `AppModal` uses Radix dialog primitives instead of the package `Modal`
  component because the app needs controlled modals for CRUD forms, filters,
  delete confirmation, and nested open/close flows. The visual behavior is kept
  close to the UAE modal guidance: backdrop, ESC close, click-away close, clear
  title, and accessible close button.
- `AppIconButton` wraps UAE `Button` patterns with consistent sizing and icon
  affordances for card actions.
- `AppCurrencyAmount` follows the UAE currency-symbol pattern and uses the
  local AED SVG asset so the symbol renders consistently across browsers.
- `AppCheckbox` and `AppToggle` include wrapper class names because the current
  package output needed small alignment fixes in this app. Those fixes live in
  `src/styles/design-system-overrides.css`.

If the package API changes later, update the wrapper here first and keep feature
components stable.
