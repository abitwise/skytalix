---
task: wave-2026-09-25
subtask: secnfr-ABC-095-placement
role: security-nfr
ticket: plans/tickets/ABC-095-short-circuit-the-engines-move-choice-with-the-book-and-fall-through-cleanly.md
ref: .grugops/context/secnfr-ABC-095-placement/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/secnfr-ABC-095-placement
base: main @ d6ddd9e8
---

# Subtask: Security/NFR rules S1 and S2 for ABC-095's book-file placement, before the wiring is built

The Architect (`design-ABC-095-wiring`, now on main; ADR-0037 § Addendum — 2026-10-12, notes `.grugops/context/design-ABC-095-wiring/notes/…a4fe3027`) placed the book read in a NEW module `src/book-file.ts`: `readBookFile(): Uint8Array`, no parameter, imports only `node:fs`, reads the fixed path `data/opening-book/book.json` resolved from `import.meta.url`, never references `process`, no import-time read. `src/cli.ts` builds the probe (`readBookFile`, a stderr warn sink, `Math.random`) and changes only `engine: withBook(book, createEngine(...))`.
- **S1 — ADR-0036 § Decision 3's trigger has fired** (`book-file.ts` is the fourth module holding a limb). Rule whether (b2) now needs a call-graph reach, or the delta test stands as is. Record the ruling where ADR-0036's limbs/triggers live.
- **S2 — ABC-042 bar 4** ("no `node:fs` import in `cli.ts`"): confirm it covers only the source of `cli.ts` and `cli-options.ts`, as its test checks. If yes, no bar text changes. If you read it as the whole runtime closure/process, amend it with the exception the Architect drafted: "one read-only synchronous read of the fixed path `data/opening-book/book.json`, resolved from `import.meta.url`, by a module that takes no input; no write, no other path, no network". R1's placement stands either way.
- **Pre-read S3** (ABC-095's own Security/NFR gate later): name what you will check at that gate — (b1) on `book-file.ts` and on `cli.ts`'s new `process.stderr`, (b2) on the `cli.ts -> book-file.ts` edge via `.grugops/context/design-F-072-1/probe/clause-b.mjs`, ABC-042 A9's `process` count moving 9 → 10 — so the SE builds to it. Do not run S3 now (nothing is wired yet).
- Also say whether anything in the placement reaches `ABC-041`'s clauses beyond (b) (path traversal: the path is fixed; symlinked `data/`; a malformed/oversized `book.json` — ABC-094 parses it).

## Fences (you are the ONLY hop running, width 1)
Edit only `memory-bank/50-decisions/` (ADRs), the ABC-042 ticket page ONLY if S2 requires a bar amendment (dated, append-only), `plans/nfr-catalog.md` only if a security row moves, your notes under `ref:`, and one trace row at the END of `plans/traceability.md`. Do not touch `src/`, `tools/`, `plans/board.md`, `AGENTS.md`, other ticket pages. Probes in scratch copies outside the repo. Own worktree (`git worktree add ../wt-secnfr-ABC-095-placement -b grugops/secnfr-ABC-095-placement main`); `node_modules` symlinked into the worktree root only if needed. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`. Never merge or push. No timing readings. If you change any committed file other than notes, run the gates before your last commit (lint, typecheck, build, `npm test` success:true). End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/secnfr-ABC-095-placement`, then FLAT `.grugops/queue/done/secnfr-ABC-095-placement.md` and `.claim.md`, uncommitted; `rmdir` the claim dir. Report: branch tip, S1/S2 rulings with reasons, the S3 checklist, any other clause reached, and anything owed by BA/PM or the SE.
