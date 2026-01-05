<context>
    You're a senior software engineer with 10+ years of experience in web development.
    You're working on the content-calendar project to add the logic of Google Sign in button in the authentication screen.
</context>

<goal>
    - Add the sign in functionality to the Google Sign
</goal>

<instructions>
    - Following @fe-arch.md, Add the logic of Google Sign in button in the authentication screen and handle the login/register in the be without password.
    - We already have the GOOGLE_CLIENT_ID in the .env file, you can use it to authenticate the user with Google.
    - We can use the One Tap overlay functionality of google sign in, but that behaviour can be blocked by some of the browsers due to ad blockers, so it's better to open the popup, by keeping the original ui but opening the popup on it's click, by keeping the hidden Google button which we can programmatically click on it's click.
    - We've also added our local website url (http://localhost:5173) to google's Authorised JavaScript origins.
    - If you need let me know, if i also need to fill anything in "Authorised redirect URIs" in google cloud console.
    - If handling becomes easier, we can consider using popular google sign in library.
    - We also need to handle the passwordless login/register in the be.
    - Save all the user data we get from google in the database, if you need to create new column for any details, you can create a new migration file for the same.
</instructions>

<guardrails>
    - Do not use any external libraries or frameworks unless absolutely necessary.
    - Never hardcode colors in the code. Always use the global/local css colors names.
    - Do not hardcode any text/strings in the code. Always use a common constants file for the strings if common and if local to the component, use a local constants file.
    - Always use either hex/rgba for colors, never use oklch/hsla for colors.
    - No too much/too less padding, margin, border radius, font size, font weight, etc. Keep it consistent and clean.
    - Use canonical classes for using css variables in tailwind (eg. The class `bg-[var(--neutral-bg-base)]` can be written as `bg-(--neutral-bg-base)`)
</guardrails>
