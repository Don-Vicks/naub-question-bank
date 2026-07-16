# Agents

## Git Workflow

### Commit Style

Use conventional commits with a scope:

```
type(scope): description
```

**Types:** `feat`, `fix`, `chore`, `refactor`, `docs`, `test`
**Scopes:** `admin`, `farmer`, `hatchery`, `processor`, `transporter`, `regulator`, `portal`, `passport`, `api-client`, `backend`, `ui`

### Grouping Rules

**DO** group related changes into separate commits:

- Backend module + its Prisma model = 1 commit
- API client endpoint group = 1 commit
- Frontend pages per portal = 1 commit
- UI component library changes = 1 commit

**DON'T** push everything as one commit.

### Example Commit Sequence

```
feat(backend): add lab-tests module with Prisma model
feat(api-client): add lab-tests endpoint
feat(processor): wire lab tests page to API
feat(admin): wire broadcasts and support pages to API
feat(processor): wire by-products and settings to API
feat(transporter): wire incident form and settings to API
feat(hatchery): wire settings page to API
```

### Before Committing

1. Run lint/typecheck if available
2. Review `git diff` to confirm only intended changes
3. Stage only files related to the commit scope
