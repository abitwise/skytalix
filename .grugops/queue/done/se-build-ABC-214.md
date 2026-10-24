---
subtask: se-build-ABC-214
role: software-engineer
ticket: plans/tickets/ABC-214-the-repository-is-licensed-apache-2-0.md
ref: .grugops/context/se-build-ABC-214/
branch: new grugops/ABC-214 cut from main c4acf49f, worktree ../wt-ABC-214
width: 2 of 3
---

# Build ABC-214 (Apache-2.0, path A). Zero executable lines

## Do
- Build exactly what the page's [both]/[A] criteria and Scope say, with ADR-0048's wording. Own npm ci. Gates: lint, typecheck, build, npm test (+ .test-results/last-run.json), skip capture, the page's own checks (A5 base check etc.).
- ABC-205 (not merged) also edits the src/evaluate.ts header near line 20; build on main as it is — whichever merges later rebases.

## Fences
- Only ../wt-ABC-214 and /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se214/. No ADR edits (ADR-0048 is PROPOSED, owner's). Never push, force, amend or rebase; never merge into main; don't touch the remote or plans/board.md.

## Publish
- Commit on grugops/ABC-214. Seal notes (task se-build-ABC-214). ## Result + trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Built: `grugops/ABC-214` @ `bb8d4432`** (worktree `../wt-ABC-214`, cut from `main` `c4acf49f`). Two commits:
- `a5dfb0dc` is the build;
- `bb8d4432` reflows NOTICE, with line breaks only.

Not pushed and not merged. No ADR, board or remote touched.

- **Files** (`git diff --numstat c4acf49f bb8d4432`): `LICENSE` +202, `NOTICE` +20, `package.json` 1/1, `package-lock.json`
  1/1, `src/cli.test.ts` +1, `src/evaluate.ts` +2 (header comment). Zero executable lines.
- **Gates at tip, each read from its output:** `npm ci` 0, lint 0, typecheck 0, build 0. `npm test` exit 0: 62 files, 2038/2038
  passed, equal to the base count. `last-run.json`: pending 0, todo 0, success true. The skip capture printed `0`, and the
  integrity check printed `No findings.`
- **Page checks:**
  - A1, A2, A3, A4, A5, A6, A8, A9 and A10 all hold.
  - A3: the fetched sha equals the pin, `cfc7749b…3d30`, 11358 B.
  - A5: the base check is IDENTICAL against `c487d89c`, and the carve-out names exactly the seven identifiers.
  - A6: the transpile is IDENTICAL, with 2 comment lines added and 0 removed.
  - A8: armed. With the manifest reverted, the only red was ABC-042 A10, at 98/99.
- **One conflict, resolved by the builder (decision `…e2623df7`).** Scope 6's default NOTICE text, adopted unchanged by
  ADR-0048, wraps "Simplified Evaluation / Function" across two lines. That fails A5's string check, which read 0. The
  break moved, and the words did not: the whitespace-normalised NOTICE is identical before and after. BA/PM and the
  Architect should note it for any re-read and for ABC-215.
- **UAT waiver:** the file-level grep over `c4acf49f..bb8d4432` lists `src/evaluate.ts`, so the waiver rests on A6, which
  holds. Measure over the whole branch: `bb8d4432~1..bb8d4432` alone sees only NOTICE.
- **Before merge:** ADR-0048 must be accepted by the owner (§ Dependencies). The Security/NFR short hop (`ABC-041` (a)) and
  the QE hop are still owed. If `ABC-205` merges first, A5's base check fires, and per ADR-0048 decision 4 the list holds.
- **Notes** (`.grugops/context/se-build-ABC-214/notes/`): `…6de03920` (build), `…9a18751e` (gates), `…03288dbe` (page
  checks), `…e2623df7` (reflow decision).

### Trace row (10 cells, header order)

| ABC-214 (build) | The repository is licensed Apache-2.0: verbatim LICENSE, NOTICE, "license": "Apache-2.0"; CC BY-SA 3.0 tables carved out (path A) | EPIC-007 (post-close addition) | licence | none moves (A6 transpile identity); ABC-041 (a) fires, Security/NFR hop owed | grugops/ABC-214 @ bb8d4432 (a5dfb0dc build + bb8d4432 NOTICE reflow), base c4acf49f<br>LICENSE, NOTICE, package.json, package-lock.json, src/cli.test.ts (+1 expect), src/evaluate.ts (+2 comment lines)<br>notes …6de03920, …9a18751e, …03288dbe, …e2623df7 | no new test or it; 1 expect in ABC-042 A10 (armed: sole red with manifest reverted); npm test 2038/2038 = base; lint/typecheck/build/npm ci 0; skips 0, No findings. | expected WAIVED by measurement (A6 holds: comment-only, transpile identical) | — | built, In Development → In Review proposed; merge waits on ADR-0048 acceptance (owner) |
