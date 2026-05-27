# Frontend Layer

This folder is for the user-facing application.

Minimum goals:

- Show data returned by the backend API.
- Provide a form to submit new data.
- Display success or error messages.
- Avoid direct database access.

Security notes:

- The frontend should not contain database credentials.
- The frontend should not contain cloud access keys.
- The frontend should communicate with the backend only through approved API endpoints.

