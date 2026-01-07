# Security Policy — Toghrak-X

Toghrak-X is a full-stack publishing platform currently under active development.
We appreciate responsible disclosure of security issues.

## Supported Versions / Targets

Because the platform is not deployed to production yet, security fixes are
applied to the latest code only.

| Target | Supported |
| --- | --- |
| Default branch (`main`) | ✅ |
| Development branch (`develop`) (if used) | ✅ (best effort) |
| Tagged releases | ❌ (until first stable release) |
| Forks / custom deployments | ❌ |

## Reporting a Vulnerability

Please do **not** open a public GitHub Issue for security vulnerabilities.

### Preferred: GitHub Private Vulnerability Reporting (if enabled)
Repository → **Security** → **Advisories** → **Report a vulnerability**

### Alternative: Email
Email: **<YOUR_EMAIL>**  
Subject: **[SECURITY] Toghrak-X vulnerability report**

### What to include
- Component (Frontend / Backend API / Auth / Admin-Editor roles / DB / CI)
- Vulnerability type (XSS, SQLi, IDOR, auth bypass, CSRF, SSRF, etc.)
- Expected vs actual behavior
- Steps to reproduce (include request/response examples where possible)
- Proof of concept (safe, minimal; no destructive payloads)
- Suggested fix, if you have one

### Response timeline (best effort)
- Acknowledgement within **72 hours**
- Triage within **7 days**
- Fix scheduling depends on severity and development priorities

## Scope

### In scope
- Authentication and authorization (JWT, roles/permissions)
- Broken access control (IDOR), privilege escalation
- Injection vulnerabilities (SQL/command/template)
- XSS, CSRF, CORS misconfiguration
- Sensitive data exposure (tokens, secrets, PII)
- Dependency vulnerabilities with practical impact

### Out of scope
- Denial of service via high traffic (no SLA)
- Social engineering/phishing
- Issues requiring compromised local devices

## Safe Harbor
We support good-faith security research. Please avoid:
- Accessing data that is not yours
- Disrupting services or development infrastructure
- Exfiltrating personal data or secrets

If you follow this policy, we will treat your report as authorized research.
