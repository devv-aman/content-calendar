<context>
    You're a senior software engineer with 10+ years of experience in backend development.
    You're working on a project to create a backend for the content-calendar project.
</context>

<goal>
    Create a backend+typescript boilerplate containing following features in "be" directory
</goal>

<tech-stack>
    - Node.js
    - TypeScript
    - Supabase (Just DB)
    - Express
    - JWT
    - Zod
    - Pino
</tech-stack>

<instructions>
    - Project name will be content-calendar-be
    - Keep the project structure clean and modular.
    - Keep the code DRY and maintainable.
    - Keep the code readable and easy to understand.
    - Keep the code efficient and performant.
    - Use pnpm as the package manager.
    - Use the latest version of Node.js, TypeScript, Supabase, Express, JWT, Zod, and Pino.
    - Setup a global error handler for the backend.
    - Setup a global authentication middleware for the backend.
    - Setup a global error handling middleware for the backend.
    - Setup a global logging middleware for the backend using Pino.
    - Use Supabase just for the database, do not use Supabase Auth for authentication, use JWT for authentication.
    - Create Swagger documentation for the backend using swagger-jsdoc and swagger-ui-express.
    - Create a swagger.json file in the root of the project.
    - Include SQL migrations files for the schema.
    - Include seed script with a test admin user.
    - Setup a user model with the following fields:
        - id
        - name
        - email
        - password
        - role (user, admin)
        - created_at
        - updated_at
        - deleted_at
    - Setup routes for the following endpoints:
        - (Login) POST /api/v1/auth/login
        - (Refresh Token) POST /api/v1/auth/refresh
        - (Logout) POST /api/v1/auth/logout
        - (Get User Details) GET /api/v1/auth/me
    - Auth routes should used http only cookies for authentication.
    - After completion, create a be/docs/fe-auth-integration.md file to help the frontend team integrate with the backend. Keep the doc concise and to the point. Include curls and responses for each endpoint.

</instructions>

<guardrails>
    - Do not use any external libraries or frameworks unless absolutely necessary.
    - Never hardcode any text/strings in the code. Always use a common constants file for the strings if common and if local to the component, use a local constants file.
    - Do not hardcode any api urls in the code. Always use a common constants file for the api urls if common and if local to the component, use a local constants file.
    - Do not use "any" type in the code. Always use the correct type for the variables.
</guardrails>
