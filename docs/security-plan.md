# Security Plan

This project compares an insecure baseline deployment against a secured deployment.

## Theme 1: Identity, Access, and Secrets

Purpose:

Show that the application can run without hardcoded credentials and without overly broad cloud permissions.

Baseline risks to document:

- Database password stored in a local configuration file.
- Cloud access keys stored manually on the server.
- Application identity has more permissions than required.
- Administrative accounts are used for normal project work.

Controls to implement:

- Move sensitive configuration values into a cloud secrets manager.
- Attach a cloud role or managed identity to the application layer.
- Grant the application identity only the permissions it needs.
- Remove long-lived cloud access keys from the server.
- Keep example configuration files free of real credentials.

Evidence to collect:

- Before/after configuration comparison.
- IAM role or managed identity policy.
- Successful application test after removing hardcoded credentials.
- Failed test showing the application cannot access unrelated secrets.

## Theme 2: Network Exposure and Perimeter Controls

Purpose:

Show that only the intended public entry points are reachable and that internal layers are protected.

Baseline risks to document:

- Database reachable from the public internet.
- Backend allows unnecessary inbound ports.
- Administrative access is open too broadly.
- Frontend, backend, and database are not separated clearly.

Controls to implement:

- Make only the public frontend or public load balancer internet-facing.
- Restrict backend access to approved sources.
- Restrict database access to the application layer only.
- Close unused ports.
- Use HTTPS where possible.
- Restrict administrative access or use a secure management channel.

Evidence to collect:

- Before/after firewall or security group rules.
- Connection test from outside the cloud to the database.
- Connection test from backend to database.
- Before/after port exposure results.
- Architecture diagrams showing allowed traffic paths.

## Experiment Table Template

| Experiment | Before State | Control Applied | After State | Evidence |
| --- | --- | --- | --- | --- |
| Secret storage | Password stored in config | Use secrets manager | Password removed from code/config | Screenshot or config diff |
| Application permissions | Broad permissions | Least-privilege role | Only required action allowed | Policy export and failed unauthorized test |
| Database exposure | Database reachable externally | Restrict database ingress | External connection blocked | Connection test output |
| Backend exposure | Extra ports open | Close unused ports | Only required ports reachable | Port scan output |

