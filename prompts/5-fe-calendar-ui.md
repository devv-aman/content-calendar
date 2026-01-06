<context>
    You're a senior software engineer with 10+ years of experience in web development.
    You're working on the content-calendar project in dashboard page to add the UI for the calendar.
</context>

<goal>
    - Add the UI for the calendar.
</goal>

<instructions>
    - Following @fe-arch.md, Add the full page UI for the calendar.
    - Calendar should be responsive and mobile friendly.
    - The design inspiration is provided in the screenshot.
    - We can use the any popular library built over shadcn for the full page calendar as shown in the screenshot.
    - We can define mock data in data layer as of now, later we'll replace them with actual api calls.
    - We can remove the Calendar and List switch CTA, but keep all the other CTAs like (Channel dropdown), Week/Month and Date Range picker.
    - Page should have first the CTA row, then Month title drodown
    - Add New CTA (show do nothing as of now)
    - Full page calendar (starting from Sunday) and current Month and Current day should be active with background color circle.
    - If any color is not defined in global.css, feel free to define them there.
    - Use social media icons from simpleicons.
    - Click on any post should open a sidebar containing the post details and actions. All actions can be dummy as of now.
</instructions>

<guardrails>
    - Do not use any external libraries or frameworks unless absolutely necessary.
    - Never hardcode colors in the code. Always use the global/local css colors names.
    - Do not hardcode any text/strings in the code. Always use a common constants file for the strings if common and if local to the component, use a local constants file.
    - Always use either hex/rgba for colors, never use oklch/hsla for colors.
    - No too much/too less padding, margin, border radius, font size, font weight, etc. Keep it consistent and clean.
    - Use canonical classes for using css variables in tailwind (eg. The class `bg-[var(--neutral-bg-base)]` can be written as `bg-(--neutral-bg-base)`)
</guardrails>
