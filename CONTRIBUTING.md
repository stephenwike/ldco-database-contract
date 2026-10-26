# Contributing

## Branches and Vercel builds

Vercel only builds two kinds of branches in this repo (set in `vercel.json` under `git.deploymentEnabled`):

- `main` builds and deploys production, as before.
- `preview/<name>` gets a Vercel preview build and URL. Use it when you want to click through a change on a real link (UI work, demos).
- Every other branch (`fix/...`, `test/...`, `chore/...`, `feature/...`, `cursor/...`, etc.) gets no Vercel build. Run tests locally (there is no GitHub Actions CI yet).

Need a preview of an existing branch? Push it under a `preview/` name: `git push origin HEAD:preview/<name>`.
