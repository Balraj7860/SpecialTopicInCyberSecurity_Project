# RA1 Outline

Use this file to draft the Week 3 RA1 submission.

RA1 requires one combined group document with six deliverables.

## 1. Topic Summary

Length: exactly one page.

Write a concise summary of cloud application security. Focus on why identity permissions, secrets storage, and network exposure are common sources of cloud risk.

Key points to cover:

- Cloud applications often use several connected services.
- Misconfigured identities can give applications more access than needed.
- Exposed secrets can allow attackers to access databases or cloud resources.
- Overly open networks can expose backend services and databases.
- Security controls should be tested with before/after evidence, not only screenshots.

## 2. Five IEEE Sources

Find at least five credible sources related to:

- Cloud security misconfiguration
- Identity and access management
- Secrets management
- Network segmentation
- Cloud attack surface reduction

Store citation drafts here until they are moved into the final RA1 document.

## 3. Problem Statement

Draft:

Cloud-hosted applications are often deployed with overly broad permissions, exposed credentials, and permissive network access rules. These weaknesses can increase the risk of credential theft, unauthorized database access, and unnecessary exposure of internal application components. This project investigates how identity controls, managed secrets, and restricted network access reduce those risks in a three-tier cloud application.

## 4. Scope Definition

Included:

- A genuine three-tier application with separate frontend, application/API layer, and database layer.
- Identity and access controls for the application layer.
- Managed secrets for database credentials or application configuration.
- Network controls that restrict which layers can communicate.
- Before/after experiments that measure security changes.

Excluded:

- Multi-cloud deployment.
- Full enterprise monitoring and incident response.
- Advanced malware detection.
- Production-scale load testing.
- Real sensitive personal data.
- Attacks against systems outside the project cloud environment.

## 5. Research Question

Draft:

To what extent do least-privilege identity, managed secrets, and restricted network access reduce credential exposure and unauthorized access risk in a cloud-hosted three-tier application?

## 6. Team Roles

Use specific roles. Avoid generic labels.

Example role categories:

- Frontend and user workflow owner
- Backend/API owner
- Database and schema owner
- Cloud deployment owner
- IAM and secrets owner
- Network controls owner
- Evidence and report owner

Also include each member's work distribution so the total equals 100%.

