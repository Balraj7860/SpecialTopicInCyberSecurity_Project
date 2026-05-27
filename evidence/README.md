# Evidence

Use this folder to organize experiment results.

Suggested structure:

- `before/` for baseline evidence.
- `after/` for secured-state evidence.
- `tables/` for comparison tables.
- `screenshots/` for non-sensitive screenshots.

Do not store raw secrets, private keys, passwords, or sensitive cloud exports in this repository.

Good evidence examples:

- Command output showing a blocked database connection.
- Screenshots of security rules with sensitive values hidden.
- Policy exports with account identifiers removed if needed.
- Before/after tables explaining the security impact.

