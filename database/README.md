# Database Layer

This folder is for database schema, seed data, and setup notes.

Minimum goals:

- Define one or two simple tables.
- Store application records.
- Allow the backend to read and write data.
- Block direct public access in the secured version.

Security notes:

- The database should not be accessed directly by the frontend.
- The database should accept connections only from the application/API layer.
- Credentials should be stored in a managed secrets service for the secured deployment.

