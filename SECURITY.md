# 🛡️ Security Policy

**Contact:** security@seizuremate.com  
**Based on:** [Supabase Security Policy](https://supabase.com/.well-known/security.txt)

At SeizureMate, we consider the security of our systems, data, and users a top priority.  
Despite our best efforts, vulnerabilities can still exist. If you discover one, we would appreciate your help in responsibly disclosing it so we can act quickly to protect our community.

---

## 🚫 Out of Scope Vulnerabilities

The following are **not considered in scope** for our security program:

- Clickjacking on pages with no sensitive actions  
- Unauthenticated, logout, or login CSRF  
- Attacks requiring MITM or physical access to a user’s device  
- Any activity that disrupts service (DoS / DDoS)  
- Content spoofing or text injection without an HTML/CSS attack vector  
- Email spoofing  
- Missing DNSSEC, CAA, or CSP headers  
- Lack of Secure or HTTP-only flag on non-sensitive cookies  
- Deadlinks or outdated URLs  

---

## 🧭 Responsible Disclosure Guidelines

If you believe you’ve found a vulnerability, please:

1. **Email your findings** to `security@seizuremate.com`.  
2. **Do not** run automated scanners on our infrastructure or app without prior approval.  
   - If you wish to test at scale, contact us to set up a sandbox environment.  
3. **Avoid exploiting** the vulnerability — do not download, delete, or modify data beyond what’s necessary to demonstrate the issue.  
4. **Do not disclose** the vulnerability publicly until we’ve confirmed and resolved it.  
5. **Do not** use attacks involving physical access, social engineering, DDoS, spam, or third-party systems.  
6. **Provide sufficient detail** for reproduction (e.g., affected URL, system, and a clear description).  

---

## 🤝 Our Commitments

We promise to:

- Respond to your report **within 3 business days** with our evaluation and an estimated fix timeline.  
- **Not pursue legal action** if you adhere to this policy and act in good faith.  
- Treat your report **confidentially** and never share your personal information without consent.  
- Keep you updated on the progress and resolution status.  
- Publicly acknowledge you as the discoverer (unless you prefer anonymity).  
- **Resolve verified issues promptly** and, when appropriate, collaborate on responsible publication.

---

**Thank you for helping keep SeizureMate secure and trustworthy.**
