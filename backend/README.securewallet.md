# Secure Wallet Backend

Small Express API for the Secure Wallet React app.

## Setup

```bash
npm install
npm start
```

The server runs on:

```text
http://localhost:5001
```

## Test Accounts

```text
Username: user
Password: user123
Role: user
```

```text
Username: admin
Password: admin123
Role: admin
```

## Routes

- `POST /login`
- `POST /logout`
- `GET /me`
- `GET /admin`
- `POST /admin/add`
- `DELETE /admin/delete`
