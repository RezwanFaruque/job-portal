# Styles

SCSS structure:

```
styles/
├── variables/   # Theme variables (colors, spacing, breakpoints)
├── mixins/      # Reusable mixins (responsive, flex)
├── base/        # Component styles (.scss-hero, .scss-card)
└── main.scss    # Entry point (compiled)
```

Imported in `app/layout.tsx` alongside `globals.css` (Tailwind) and Bootstrap.
