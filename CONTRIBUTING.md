# Contributing to Biometric Attendance System

Thank you for your interest in contributing! 🎉 This document outlines everything you need to know to get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

---

## Code of Conduct

This project adheres to our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold its standards. Please report unacceptable behavior to the maintainers.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before submitting a bug report:

- Check the [existing issues](https://github.com/your-org/biometric-attendance-system/issues) to avoid duplicates.
- Collect relevant info: OS, Python/Node version, steps to reproduce, expected vs. actual behavior, screenshots/logs.

Use the **Bug Report** issue template when filing.

### 💡 Suggesting Features

- Open a [Feature Request](https://github.com/your-org/biometric-attendance-system/issues/new) issue.
- Clearly describe the problem it solves and the proposed solution.
- Label it `enhancement`.

### 🔧 Code Contributions

- Pick an open issue or create one before starting work.
- Comment on the issue to let the team know you're working on it.
- Follow the [Development Workflow](#development-workflow) below.

---

## Development Workflow

```bash
# 1. Fork the repository and clone your fork
git clone https://github.com/YOUR_USERNAME/biometric-attendance-system.git
cd biometric-attendance-system

# 2. Add the upstream remote
git remote add upstream https://github.com/your-org/biometric-attendance-system.git

# 3. Create a feature branch (see naming convention below)
git checkout -b feat/your-feature-name

# 4. Make your changes, commit, and push
git add .
git commit -m "feat(ai): add wave gesture confidence threshold config"
git push origin feat/your-feature-name

# 5. Open a Pull Request against the `main` branch
```

Always pull the latest changes from upstream before starting:

```bash
git fetch upstream
git merge upstream/main
```

---

## Branch Naming Convention

| Type     | Pattern                        | Example                       |
| -------- | ------------------------------ | ----------------------------- |
| Feature  | `feat/<short-description>`     | `feat/liveness-detection`     |
| Bug fix  | `fix/<short-description>`      | `fix/embedding-storage-crash` |
| Docs     | `docs/<short-description>`     | `docs/api-reference-update`   |
| Refactor | `refactor/<short-description>` | `refactor/auth-middleware`    |
| Chore    | `chore/<short-description>`    | `chore/update-dependencies`   |

---

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`  
**Scopes:** `ai`, `backend`, `frontend`, `infra`, `docs`

**Examples:**

```
feat(ai): integrate MediaPipe hand gesture model
fix(backend): resolve race condition in attendance logging
docs: update getting started guide
```

---

## Pull Request Process

1. Ensure your branch is up to date with `main`.
2. Make sure all tests pass locally before opening a PR.
3. Fill out the PR template completely.
4. Request review from at least **one** team member.
5. Address all review comments before merging.
6. PRs are merged using **squash and merge** to keep history clean.

---

## Coding Standards

### Python (AI / Backend)

- Follow [PEP 8](https://pep8.org/)
- Use type hints where possible
- Format with `black`, lint with `flake8` or `ruff`
- Write docstrings for all public functions

### JavaScript / TypeScript (Frontend)

- Use ESLint + Prettier (config included in repo)
- Prefer functional components with hooks in React
- Type everything — avoid `any`

### General

- Write tests for new features — aim for meaningful coverage, not 100%
- Don't commit secrets, API keys, or `.env` files
- Keep PRs focused — one feature or fix per PR

---

Thank you for helping make this project better! 🚀
