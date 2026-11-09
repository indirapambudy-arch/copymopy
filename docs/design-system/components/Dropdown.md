# Dropdown

A single-choice field with a label above and a chevron on the right, matching the Figma dropdown set and sharing TextField's states.

- **States:** default, placeholder (grey text), filled, hover (border goes grey-secondary), focus (2px blue-main), error (2px red-main, alert icon, red message), disabled (grey-bgdisabled fill, grey-textdisabled text and chevron).
- **Helper text** is optional and sits under the field; `error` replaces it.
- Built on the browser's own select, so the open list is the browser's native menu. Keyboard, screen readers and phones work without extra code. The Figma file shows no open-menu design; add one if you want a custom list.
- Use it for one choice from 5 or more options, or when space is tight (like the product switcher). For 2–6 short options people should see at once, use ChipGroup.
- Always pass a visible `label`. The `placeholder` ("Select a product") can't be picked again once a value is chosen.
- The consumer supplies `options` and handles `onChange`.
