# Cloud Application Security Capstone

This project is a three-tier cloud application built for a cybersecurity capstone assignment.

It demonstrates:
- A working full-stack application (frontend + backend)
- Cloud deployment (baseline state)
- Security analysis before and after applying controls
- Evidence-based security improvement reporting

---

## Available Scripts (React App)

In the project directory, you can run:

### `npm start`
Runs the app in development mode.  
Open http://localhost:3000 to view it in your browser.

The page reloads when you make changes.

---

### `npm test`
Launches the test runner in interactive watch mode.

---

### `npm run build`
Builds the app for production into the `build` folder.

---

## Research Focus

This project focuses on:

1. Identity, Access, and Secrets Management
2. Network Exposure and Perimeter Security

The goal is to analyze:
- insecure baseline state
- applied security controls
- post-security improvement evidence

---

## High-Level Architecture

```mermaid
flowchart LR
  User["User Browser"] --> Frontend["Frontend Layer"]
  Frontend --> Backend["Application/API Layer"]
  Backend --> Database["Database Layer"]
  Backend --> Secrets["Secrets Manager"]
  Backend --> Identity["Cloud IAM Role / Managed Identity"]