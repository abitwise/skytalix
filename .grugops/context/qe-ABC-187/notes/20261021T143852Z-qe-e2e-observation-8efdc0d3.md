---
id: 20261021T143852Z-qe-e2e-observation-8efdc0d3
kind: observation
by: qe-e2e
at: 2026-10-21T14:38:52Z
verified_by: 
confidence: high (own runs, before reading SE/Scribe notes)
refs:
  - ABC-187
  - grugops/ABC-187
  - grugops/qe-ABC-187
  - 9578481f
  - 494f7862
  - 65ee533d
  - 4890782a
  - 8918b07a
  - src/cli.test.ts
  - AGENTS.md
supersedes: 
seal: sha256:d2b02e434b0173ac4f56f4950d79e6faf7632144b93bed48eea0ea7dd4ccd667
---

# ABC-187 criteria A1, A4, A5, A6 by QE's own runs at the merge of main

Head is `4890782a` = tip `9578481f` merged with `main` `8918b07a` (clean). Base here is `main` `8918b07a`. Its `src/` and `AGENTS.md` are byte-equal to the cut base `bf6fc623` and the branch base `94c4b510`. Only `package.json` and `package-lock.json` moved (ABC-172, name only).
- **A1 MET.** The forbidden-pattern grep prints 2 at base and 0 at head. `const AGENTS_MD_BUDGET_BYTES = 18_432;` prints 0 at base and 1 at head. The JSDoc at `:2483`, directly above the constant, contains `ABC-187` and is one line.
- **A4 MET in AGENTS.md's reference form; the page's command is defective as written** (see the A4 note).
- **A5 MET.** The page's script prints 8. An independent count of `-->` lines in AGENTS.md finds the slot's own closer at `:60` and 8 more after it (`:74`, `:105`, `:107`, `:113`, `:119`, `:120`, `:124`, `:130`). The comment at `:2242` says 8. `carries 13 further closers` prints 1 at base and 0 at head.
- **A6 MET, folded-in clause applied.** `git diff --name-only main...HEAD`, ignoring `.grugops/`, lists `AGENTS.md` and `src/cli.test.ts`. numstat is 3/3 for `src/cli.test.ts`, with `-U0` hunks only at `:2242` and `:2483`-`:2484`. numstat is 1/1 for `AGENTS.md`, `:7` only, `24,576` → `18,432`. `wc -c AGENTS.md` is 15,606 at base and at head. `grep -c "targets ≤ 18,432 B" AGENTS.md` prints 1.
- The two rewritten comments are true at head. `:2242`: 8 closers, counted twice. `:2483`: it names ABC-187 and the decision `…cba9c8eb`. That note (`qe-ABC-164`) holds the owner's verbatim "1. byte limit to 18,432".
