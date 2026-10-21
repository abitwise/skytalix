---
id: 20261021T135939Z-qe-e2e-observation-c9c6ba15
kind: observation
by: qe-e2e
at: 2026-10-21T13:59:39Z
verified_by: 
confidence: high (each command run by QE at merge a0dc4135, before the SE's notes were opened; exit codes read)
refs:
  - ABC-172
  - EPIC-007
  - grugops/ABC-172
  - grugops/qe-ABC-172
  - 2eaf1a1c
  - 0bddbb43
  - 3e617b26
  - a0dc4135
  - A1
  - A2
  - A3
  - A4
  - A5
supersedes: 
seal: sha256:d8425234eda2821d977e816b9d71aebaa459cd05a84dc39813f35dc6205e2ecf
---

# ABC-172 QE: A1-A5 at merge a0dc4135 (main 41f5b366 into tip 2eaf1a1c, clean, no conflict); all met

- Merge: `git merge main` into `grugops/qe-ABC-172` (from tip `2eaf1a1c`) -> `a0dc4135`, ort, no conflict. Main brought queue/board/trace/ticket-page files only; `git diff --name-only 2eaf1a1c a0dc4135` holds no `src/` and no `package*` path. ABC-187 and ABC-168 had not landed on main.
- A1: `npm pkg get name` -> `"skytalix"`.
- A2: lock `.name` and `.packages[""].name` -> skytalix, skytalix. `git diff --numstat 3e617b26 a0dc4135 -- package-lock.json` -> 2/2, both lines `name`. `npm ci` rc 0 run IN the QE worktree (a real `node_modules`, not a symlink); `git status` clean afterwards (lock untouched by ci). Node v26.11.1, npm 11.20.0.
- A3: the page's exact `git grep -n cli-chess -- . ':!plans/tickets' … ':!memory-bank/50-decisions'` prints nothing, rc 1.
- A4: lint/typecheck/build/unit green, counts equal base (see the gates observation). `printf 'quit\n' | npm run chess -- --colour white --ascii` prints `> skytalix@0.0.0 chess`, draws the start board, rc 0. `npm run chess -- --bogus` still refuses, rc 1, usage line unchanged (`usage: npm run chess -- …`, Q14).
- A5: `git diff --name-only 3e617b26 0bddbb43` = package-lock.json, package.json. Production-`src/` grep empty. At the notes tip `2eaf1a1c` the same diff also lists the SE's three `.grugops/context/ticket-to-pr-ABC-172/notes/` files (gap QE-172-b).
- Runtime readers: no file under src/, tools/, spike/ reads `npm_package_name` or the manifest's `name`; nothing can break on the value.
