# Application/API Layer

This folder is for backend application code.

Minimum goals:

- Provide a health-check endpoint.
- Provide one endpoint to read data.
- Provide one endpoint to create data.
- Connect to the database.
- Retrieve sensitive values from a managed secrets service in the secured version.

Security notes:

- Do not commit real `.env` files.
- Use `.env.example` for placeholders only.
- Prefer a cloud role or managed identity over long-lived access keys.
- Validate user input before storing it in the database.

