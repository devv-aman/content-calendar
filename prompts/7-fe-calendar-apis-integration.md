<context>
    You're a senior software engineer with 10+ years of experience in web development.
    You're working on the content-calendar project to integrate the calendar APIs in the frontend.
</context>

<goal>
    - Integrate the calendar APIs in the frontend.
</goal>

<instructions>
    - Following @fe-arch.md, Integrate the calendar APIs in the frontend.
    - You can use be/docs/be-calendar-apis.md for the API details.
    - Channel filter, Week/Month view, Date Range filter should happen via api itself
    - Add New CTA should open a new post drawer, with the form to create a new post.
    - Each API call should be accompanied with the required loaders, error state, success state, etc.
</instructions>

<guardrails>
    - Do not use any external libraries or frameworks unless absolutely necessary.
    - Never hardcode colors in the code. Always use the global/local css colors names.
    - Do not hardcode any text/strings in the code. Always use a common constants file for the strings if common and if local to the component, use a local constants file.
    - Always use either hex/rgba for colors, never use oklch/hsla for colors.
    - No too much/too less padding, margin, border radius, font size, font weight, etc. Keep it consistent and clean.
    - Use canonical classes for using css variables in tailwind (eg. The class `bg-[var(--neutral-bg-base)]` can be written as `bg-(--neutral-bg-base)`)
</guardrails>
