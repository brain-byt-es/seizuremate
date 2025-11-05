# 🤝 Contributing to SeizureMate

Contributions are what make the open-source community an amazing place to learn, inspire, and create.  
Any contributions you make are **greatly appreciated** and help us bring **calm, clarity, and confidence** to seizure management.

---

## 🧭 House Rules (for PRs and Issues)

### 👥 Prevent Work Duplication
Before submitting a new issue or PR, check if it already exists in [Issues](https://github.com/brain-byt-es/seizuremate/issues) or [Pull Requests](https://github.com/brain-byt-es/seizuremate/pulls).

### ✅ Work Only on Approved Issues
- For **feature requests**, please wait for a core team member to approve and remove the 🚨 `needs approval` label before coding or submitting a PR.  
- For **bugs**, **security**, **performance**, or **documentation** work, you can start immediately—even if the label is present.

We value creativity, but to maintain coherence and quality, all new features must align with SeizureMate’s accessibility and clinical clarity standards.

### 🚫 Don’t Just Drop a Link
Avoid posting third-party links (e.g., Slack threads or Notion docs) without context.  
A GitHub issue or PR should **stand on its own** — reviewers shouldn’t need to chase external references.

### 👀 Think Like a Reviewer
Ask yourself:
- What context would help someone new understand this change?
- Are there key decisions or constraints worth documenting?
- Does this PR assume knowledge that isn’t obvious?

### 🧵 Bring in Context from Private Channels
If the task originated from a private chat (e.g., Slack), extract relevant reasoning and include it in your issue or PR.

> Example:  
> “A user requested a calmer color transition for seizure logging. Explored Sage vs. Mist palettes; chose Mist for visual accessibility.”

### 📚 Treat It Like Documentation
Every issue and PR should contribute to our long-term understanding of the product and design logic.  
Write clearly so a future contributor — or you in six months — can revisit it and understand why choices were made.

### ✅ Summarize Your PR at the Top
Even minor changes benefit from a short summary explaining intent.  
GitHub Copilot can assist with summaries, but always verify accuracy and relevance.

### 🔗 Use GitHub Keywords to Auto-Link Issues
Use keywords like `Closes #123` or `Fixes #456` in PR descriptions to automatically link and close related issues upon merge.

### 🧪 Mention What Was Tested (and How)
Explain how you validated your changes.

> Example:  
> “Tested on Android + iOS simulators. Confirmed calm-mode transitions and accessibility scaling work correctly.”

### 🧠 Assume Future-You Won’t Remember
Document edge cases, trade-offs, and temporary workarounds clearly so the reasoning remains transparent.

---

## ⚙️ Priorities

| Type of Issue | Priority |
|----------------|-----------|
| Minor improvements, non-core feature requests | 🟢 Low |
| Confusing UX (but functional) | 🟡 Medium |
| Core Features (logging, reports, alerts) | 🟠 High |
| Core Bugs (sync, auth, accessibility issues) | 🔴 Critical |

---

## 🗂 File Naming Conventions

To ensure consistency and ease of navigation, SeizureMate follows these conventions for **services**, **repositories**, and other class-based files.

### Repository Files

- Must include the `Repository` suffix.  
- If backed by a specific technology (e.g., Prisma), prefix with that name.  
- File name must match the exported class (PascalCase).

**Pattern:**  
`Prisma<Entity>Repository.ts`

**Examples:**
```ts
// File: PrismaUserRepository.ts
export class PrismaUserRepository { ... }

// File: PrismaReportRepository.ts
export class PrismaReportRepository { ... }
```

This avoids ambiguity and improves discoverability in editors.

---

## Service Files

Must include the `Service` suffix.

File name must match the class (PascalCase).

Be specific — avoid generic names like `AppService.ts`.

**Pattern:**

`<Entity>Service.ts`

**Examples:**

```ts
// File: ReportService.ts
export class ReportService { ... }

// File: NotificationService.ts
export class NotificationService { ... }
```

**Note:**

Avoid dot-suffixes like `.service.ts` or `.repository.ts` — they will be phased out.
Reserved suffixes: `.test.ts`, `.spec.ts`, `.types.ts` only.

---

## 🧪 Developing

See the README for setup and environment details.

---

## 🏗 Building

To build the project:

```bash
yarn build
```

Please ensure that a full production build runs successfully before committing code.

---

## 🧰 Linting

Check formatting and linting:

```bash
yarn lint
```

Fix all warnings or errors before committing.

---

## 🧾 Testing

SeizureMate maintains a calm, predictable app behavior — tests help ensure that. Run tests locally before PR submission.

### Running Tests

```bash
yarn test
```

### E2E Test Browsers Not Installed?

If you encounter:

```text
Executable doesn't exist at .../ms-playwright/chromium...
```

Run:

```bash
npx playwright install
```

---

## 🚀 Making a Pull Request

- ✅ Enable “Allow edits from maintainers” when creating your PR.
- 🔗 Use `Fixes #XXX` or `Refs #XXX` to link PRs to issues.
- 🧾 Complete the PR template clearly.
- 💡 Review SeizureMate’s App Contribution Guidelines if working on app components or integrations.
- 🔄 Keep your branch updated (click “Update branch” on GitHub if prompted).

---

## 💬 Support & Communication

- 💌 General contributions: contribute@seizuremate.com
- 🔒 Security reports: security@seizuremate.com
- 🌐 Website: https://seizuremate.com

Thank you for contributing to SeizureMate — calm technology designed with care, clarity, and compassion.