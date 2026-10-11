---
id: 20261011T083621Z-architect-design-decision-qe093b-compiler-checks-source-sha256-ticket-xs-p3-e95791ae
kind: decision
by: architect-design
at: 2026-10-11T08:36:21Z
verified_by:
confidence: high
refs:
  - QE-093-b
  - ABC-093
  - ADR-0037
  - ADR-0023
  - tools/opening-book/compile.ts
  - tools/opening-book/book.test.ts
  - data/opening-book/ATTRIBUTION.md
  - .grugops/queue/claimed/design-low-batch-2026-10-11/design-low-batch-2026-10-11.md
  - 20261010T201446Z-orchestrator-observation-handoff-5-e41d7a20
  - 20261010T185733Z-qe-e2e-observation-abc093-mutants-gap-register-cce9af72
  - 20261010T183947Z-software-engineer-decision-abc093-compiler-shape-weight-switch-strict-san-79cc28a5
supersedes:
---

# Item 1: `QE-093-b` is RULED. The compiler checks the five source hashes. A ticket is recommended (XS, P3)

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
Batch `design-low-batch-2026-10-11`, branch `grugops/design-low-batch-2026-10-11` from `fae240b2`.

## The gap (QE, `…cce9af72`)
- `compile.ts` writes `source.commit = SOURCE_COMMIT` into `book.json`, and never checks the inputs' bytes.
- So any directory of well-formed TSVs compiles under the pinned commit. The field is a label, not a proof.
- The Engineer recorded the check as an option and did not build it (`…79cc28a5` call 2).
- It was not in `ADR-0037` D1(f)'s list.

## Ruling: the compiler checks, and refuses on a mismatch
- **Why.** `source.commit` is a provenance claim in a shipped file. `ADR-0023`'s CC0 basis rests on the
  data being the pinned data. The compiler is the only party that sees the bytes.
- **Cost.** About one `node:crypto` call per file, in `tools/` only.
- **Rejected: accept as a residual.** The risk record would cost about as much as the fix, and it would
  never close.
- **Recorded:** `ADR-0037`, a Status line and an amendment block under D1(f). It takes effect when the
  ticket merges.

## What the ticket must pin (BA/PM writes the page; the Engineer picks the spelling)
1. **A `SOURCE_SHA256` constant** beside `SOURCE_COMMIT` in `tools/opening-book/compile.ts`. It holds the
   five hex values from `ATTRIBUTION.md`.
2. **The check runs on the command-line path, before `writeBook`.** It hashes each file's raw bytes. On a
   mismatch it refuses with no write, and names the file, the expected hash and the actual hash.
   - `compileBook`, `writeBook`'s signature and the existing fixture tests stay unchanged. The tests call
     `writeBook` with fixtures and `"0".repeat(40)`.
   - Make the check a function the test can call in process. Do not spawn a child.
3. **Two tests in `tools/opening-book/book.test.ts`:**
   - (a) a fixture directory with one altered file is refused, names that file, and leaves no book on disk;
   - (b) each of the five constant values appears in `ATTRIBUTION.md`, so the two cannot drift.
4. **The positive path** is a RUN at the delivery hop on the real fetched source: exit 0, and `cmp` 0
   against the committed `book.json`. This is the same evidence `A1` used. The lane cannot hold the
   source files.
5. **`ATTRIBUTION.md` § Regenerating:** "change `SOURCE_COMMIT` and this file together" gains
   `SOURCE_SHA256`.

## Fences and cost
- 0 `src/` lines, 0 new files, 0 children (`N8-SPAWN` 0), and +2 in-process tests.
- UAT is waived by measurement (0 production lines). `ADR-0036` (b) does not fire.
- The narrow set is `tools/opening-book/book.test.ts`. A count pin is enough.
- `book.json`'s bytes must not change, and the delivery RUN proves it.
- **Size `XS`, priority `P3`, owner Software Engineer, then QE.** BA/PM sets size and priority.

## Follow-ups
- **BA/PM:** cut the ticket.
- **Scribe:** none. The `AGENTS.md` regeneration line does not restate the gap. The trap entry in
  `memory-bank/90-agents-md-command-log.md` (line 79) gets a one-line update when the ticket merges.
