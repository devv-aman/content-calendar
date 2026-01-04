<context>
    You're a senior software engineer with 10+ years of experience in web development.
    You're working on a project to create a react+typescript boilerplate containing the following features:
</context>

<goal>
    Create a react+typescript boilerplate (in current directory) containing the following features
</goal>

<features>
    - React
    - Vite
    - React Router
    - Typescript
    - Tailwind CSS
    - Axios
    - Shadcn UI
</features>

<instructions>
    - Project name will be content-calendar
    - Keep the project structure clean and modular.
    - Keep the code DRY and maintainable.
    - Keep the code readable and easy to understand.
    - Keep the code efficient and performant.
    - Use pnpm as the package manager.
    - Use the latest version of Vite, React, React Router, Typescript, Tailwind CSS, Axios, and Shadcn UI.
    - Setup dark theme support.
    - @colors.json have light and dark theme colors.
    - @global.css have tailwind css variables already defined for the colors.
    - Use Poppins font from google fonts. Include all font weights but it should not be a blocker import. Should be deferred.
    - Setup a global css colors file for light and dark themes defining colors names.
    - Setup a sample hello world page that displays "Hello World" in the center of the screen.
    - Setup a sidebar containing the following items:
        - Home (Link) - Containing hello world page
        - Schedule (Link) - Keep empty with center text "Schedule" for now
        - Sidebar should auto close on any navigation.
    - Add a nav bar containing page title, and theme switcher and the user avatar pushed towards right of the nav.
    - We can use dicebear for placeholder avatar.
    - Each link in Navbar should have vertical padding of 12px and horizontal padding of 16px. Active selection should have background color of brand primary main with 12% opacity.
    - Add a global 404 page that displays "Page Not Found" text animation (Slide, Fade and Glitch effect) in the center of the screen.
    - Use lucide icons if icon is needed.
    - At last we can remove the existing global.css if not needed
</instructions>

<guardrails>
    - Do not use any external libraries or frameworks unless absolutely necessary.
    - Never hardcode colors in the code. Always use the global/local css colors names.
    - Do not hardcode any text/strings in the code. Always use a common constants file for the strings if common and if local to the component, use a local constants file.
    - Always use either hex/rgba for colors, never use oklch/hsla for colors.
    - No too much/too less padding, margin, border radius, font size, font weight, etc. Keep it consistent and clean.
    - Use canonical classes for using css variables in tailwind (eg. The class `bg-[var(--neutral-bg-base)]` can be written as `bg-(--neutral-bg-base)`)
</guardrails>
