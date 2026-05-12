# Architecture Notes

The project must use a genuine three-tier architecture.

## Frontend Layer

Purpose:

The frontend is the user-facing part of the system. It lets users view data, submit forms, and receive feedback.

Typical responsibilities:

- Display application data.
- Collect user input.
- Send requests to the backend API.
- Avoid direct database access.

Possible technologies:

- Static HTML, CSS, and JavaScript
- React
- Vue
- Cloud static hosting
- CDN with HTTPS

## Application/API Layer

Purpose:

The application layer receives frontend requests, validates input, applies business logic, retrieves secrets securely, and reads/writes database records.

Typical responsibilities:

- Expose API endpoints.
- Validate incoming requests.
- Connect to the database.
- Retrieve secrets from a managed secrets service.
- Use a cloud identity or role.

Possible technologies:

- Node.js with Express
- Python Flask
- Java Spring Boot
- Cloud virtual machine
- Managed app service
- Container service

## Database Layer

Purpose:

The database layer stores application records and should not be directly exposed to public users.

Typical responsibilities:

- Store application data.
- Accept connections only from the application/API layer.
- Use strong credentials or managed authentication.
- Avoid public exposure.

Possible technologies:

- PostgreSQL
- MySQL
- Managed relational database service

## Security Support Layers

Identity:

- Cloud IAM roles or managed identities define what the application is allowed to access.

Secrets:

- A secrets manager stores database credentials and other sensitive values.

Network:

- Firewall rules, security groups, private networks, subnets, and load balancers control what is reachable.

