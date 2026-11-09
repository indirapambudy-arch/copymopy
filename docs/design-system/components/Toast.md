# Toast

A short message that floats at the bottom of the screen for a few seconds, after an action that has no other visible result.

- grey-main fill, white-main text (16:1), radius-md, `shadow-lg`. Announced to screen readers as a status.
- Use it for "Copied to clipboard" (when copying from outside a ResultCard) and for failed requests: "Couldn't generate. Try again in a moment."
- One line. Say what happened and, for errors, what to do next.
- The consumer handles positioning and timing (about 4 seconds; errors can stay until dismissed).
