<context>
    You're a senior software engineer with 10+ years of experience in web development.
    You're working on the content-calendar project to add the APIs for the calendar.
</context>

<goal>
    - Add the CRUD APIs for the calendar.
</goal>

<instructions>
    - Following @be-arch.md, create following APIs for the calendar:
        - (Create Post) POST /api/v1/posts
            - Body:
                - title (string): The title of the post
                - content (string): The content of the post
                - channel (string): The channel of the post (twitter, facebook, instagram, youtube, linkedin)
                - scheduled_time (string): The scheduled time of the post (YYYY-MM-DD HH:MM:SS)
                - file (image, pdf, xls, docs etc.): The attachment of the post
        - (Get Posts) GET /api/v1/posts
            - Query Parameters:
                - channel (string): The channel of the post (twitter, facebook, instagram, youtube, linkedin)
                - start_date (string): The start date of the post (YYYY-MM-DD)
                - end_date (string): The end date of the post (YYYY-MM-DD)
        - (Get Post by ID) GET /api/v1/posts/:id
            - Response:
                - id (string): The id of the post
                - title (string): The title of the post
                - content (string): The content of the post
                - channel (string): The channel of the post (twitter, facebook, instagram, youtube, linkedin)
                - scheduled_time (string): The scheduled time of the post (YYYY-MM-DD HH:MM:SS)
                - file (image, pdf, xls, docs etc.): The attachment of the post as a url
        - (Update Post) PUT /api/v1/posts/:id
            - Body:
                - title (string): The title of the post
                - content (string): The content of the post
                - channel (string): The channel of the post (twitter, facebook, instagram, youtube, linkedin)
                - scheduled_time (string): The scheduled time of the post (YYYY-MM-DD HH:MM:SS)
                - file (image, pdf, xls, docs etc.): The attachment of the post
        - (Delete Post) DELETE /api/v1/posts/:id
    - I have created a bucket in supabase storage for the attachments of the posts by the name "content-calendar-attachments".
    - Format in bucket should be like users/{user_id}/posts/{post_id}/{file_name}.{extension}
    - APIs should have correct required/optional parameters, responses, error handling, etc.
    - One Post can have multiple channels, so we need to support that as well.
    - Swagger documentation should be updated for the new APIs.
    - Create supabase migrations required files.
    - Create seed script for the posts table.
    - After completion, create a be/docs/be-calendar-apis.md file to help the frontend team integrate with the backend. Keep the doc concise and to the point. Include curls and responses for each endpoint.
</instructions>

<guardrails>
    - Do not use any external libraries or frameworks unless absolutely necessary.
    - Never hardcode colors in the code. Always use the global/local css colors names.
    - Do not hardcode any text/strings in the code. Always use a common constants file for the strings if common and if local to the component, use a local constants file.
    - Always use either hex/rgba for colors, never use oklch/hsla for colors.
    - No too much/too less padding, margin, border radius, font size, font weight, etc. Keep it consistent and clean.
    - Use canonical classes for using css variables in tailwind (eg. The class `bg-[var(--neutral-bg-base)]` can be written as `bg-(--neutral-bg-base)`)
</guardrails>
