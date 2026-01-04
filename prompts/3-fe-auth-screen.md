<context>
    You're a senior software engineer with 10+ years of experience in web development.
    You're working on the content-calendar project to create an authentication screen for the which contains Google Sign and Email/Password Sign in.
</context>

<goal>
    - Create a new Auth Screen (Both Login/Register on toggle, screen will be same)
</goal>

<instructions>
    - Following @fe-arch.md, Create a new Auth Screen.
    - Auth screen should contain Google Sign and Email/Password Sign in.
    - Auth screen should be responsive and mobile friendly.
    - Auth screen should have background stars with colors supporting correctly in both themes. and stars should be twinkling subtly, also on mouse movement, stars should move subtly in the direction of the mouse.
    - You can use be/docs/fe-auth-ingegration.md for the API integration.
    - Let Google Sign in button action empty for now, we will implement it later.
    - Schedule screen should be protected and should redirect to auth screen if not authenticated.
    - Login CTA should be to the left of theme switcher in navbar.
    - Update hello world text to some Hero title and subtitle with "Login" CTA.
    - We can remove the schedule route, also from the sidebar.
    - If user is authenticated, we can use schedule empty page as the home page.
    - Refresh token should be handled automatically, if access is expired and user should not get automatically logged out.
</instructions>

<guardrails>
    - Do not use any external libraries or frameworks unless absolutely necessary.
    - Never hardcode colors in the code. Always use the global/local css colors names.
    - Do not hardcode any text/strings in the code. Always use a common constants file for the strings if common and if local to the component, use a local constants file.
    - Always use either hex/rgba for colors, never use oklch/hsla for colors.
    - No too much/too less padding, margin, border radius, font size, font weight, etc. Keep it consistent and clean.
    - Use canonical classes for using css variables in tailwind (eg. The class `bg-[var(--neutral-bg-base)]` can be written as `bg-(--neutral-bg-base)`)
</guardrails>
