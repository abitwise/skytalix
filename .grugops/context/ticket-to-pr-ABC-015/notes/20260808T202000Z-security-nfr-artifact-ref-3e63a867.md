---
id: 20260808T202000Z-security-nfr-artifact-ref-3e63a867
kind: artifact-ref
by: security-nfr
at: 2026-08-08T20:20:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - ABC-014
  - ABC-018
  - EPIC-002
  - EPIC-006
  - NFR-007
  - RISK-005
  - src/glyph-mode.ts
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - .grugops/queue/done/ticket-to-pr-ABC-015-sec/claim.md
  - 20260808T201500Z-security-nfr-decision-187c3eae
supersedes: 
---

# Artifacts this subtask produced, by reference

Branch `grugops/ticket-to-pr-ABC-015`. **Never `main`.**

| Artifact | What changed |
|---|---|
| `plans/board.md` | The **`In Security/NFR` → `Ready for UAT`** move — the one exit this role owns. Headings `In Security/NFR (WIP 1/2)` → `(WIP 0/2)` and `Ready for UAT (WIP 0/4)` → `(WIP 1/4)`; the `ABC-015` row moved with its verdict; an **exit comment block** on `In Security/NFR` carrying the full gate record and an **entry comment** on `Ready for UAT` carrying the UAT deferral; one entry prepended to the `_Updated:` header. **The `ABC-014` and `ABC-012` comment blocks beneath both columns are left standing, not replaced** |
| `plans/tickets/ABC-015-glyph-mode-selection.md` | Frontmatter `in-security-nfr`/`In Security/NFR` → **`ready-for-uat`/`Ready for UAT`**; one new `## Security / NFR` section with the verdict, the three instruments, the 138-value campaign, the ASVS L1 walkthrough, the four accepted risks and the `ABC-014` ownership correction. **`## Acceptance` and both `CORRECTED IN PLACE` blocks, `## Scope`, `## Out of scope`, `## Dependencies`, `## Test notes`, `## Implementation`, `## QE`, size `S` and priority `P1` are all untouched** — no criterion was amended, which is BA/PM's exit |
| `plans/traceability.md` | **One row (`ABC-015`), three cells** — `NFRs` (the re-derived bar and its instruments), `UAT` (the deferral, filled rather than left blank) and `Status` (prepended, with a `Was:` chain). One entry prepended to the `_Updated:` header. **No other row touched.** The header's and **every** row's cell count was machine-verified at **ten** before and after — no unescaped `\|` was introduced |
| `plans/nfr-catalog.md` | **EXACTLY TWO LINES: the header and `NFR-007`'s row.** `NFR-007`'s `Verified by` cell gains the measured evidence for one component of its window. **`NFR-001`–`NFR-006` are BYTE-IDENTICAL, and `NFR-007`'s TARGET cell and `Applies to` cell are BYTE-IDENTICAL — NO TARGET MOVED**, verified by hashing the cells before and after rather than asserted. The row is **still `UNKNOWN - verify`**: a zero-I/O component inside a window is not the window |
| `.grugops/context/ticket-to-pr-ABC-015/notes/` | Four notes hand-written in the schema's exact shape: this one, two `observation`s (the `NFR-007` re-derivation and its instruments; the "no security trigger" re-derivation, the adversarial campaign and the ASVS L1 walkthrough) and one `decision` (the verdict, the accepted risks and the board move). **No `finding`, no derived `index.md` / `index.jsonl`** — the renderer does not exist here and nothing was hand-faked |
| `.grugops/queue/…/ticket-to-pr-ABC-015-sec/` | Moved `pending/` → `claimed/…/` → `done/…/` **by hand**, with a `claim.md` registry record naming the method and the absent substrate |

## The instruments, which live OUTSIDE the repository by design

Five harnesses were written in a scratch directory outside this repo, on the standing practice this
column set on `ABC-011` and kept on `ABC-012` and `ABC-014` — a measurement harness is not a
deliverable and does not enter the tree:

`probe-permission.mjs` (Node's permission model, four positive controls) · `probe-stdout.mjs` (what
the one permitted read does across four sink shapes, including a real pty) · `probe-surface2.mjs`
(module-load recorder, `process.env` access `Proxy`, 165 patched functions, with the module load
hoisted OUT of the region) · `probe-adversarial.mjs` (138 hostile locale values, non-string values,
hostile env shapes, ReDoS, regex statefulness) · `probe-pollution.mjs` and `probe-final.mjs` (the
prototype gadget with a live null control; the retention question and its failed null control; the
diagnostic timings).

The module under test was a **`cmp`-verified byte-identical copy** of `src/glyph-mode.ts`
(`md5 9c1f4f4e957d4faf3c9cccc49a545185`), placed **alone in an empty directory with no `render.ts`
beside it** — which is itself instrument 2's proof.

## Verification of the diff's shape, done rather than asserted

- **`git diff --stat -- src/` is EMPTY.** No production file, no test file, and no comment in either
  was touched. `src/glyph-mode.ts` still hashes `9c1f4f4e957d4faf3c9cccc49a545185`, identical to
  what the Engineer wrote and QE passed.
- `plans/nfr-catalog.md` differs from `HEAD` on **exactly 2 of its 546 lines**, and the file's line
  count is unchanged.
- `plans/traceability.md` differs on **exactly 2 lines** (the header and the `ABC-015` row).
- The suite is unchanged and green on this gate's own runs: **277/277 on 13 files**, skip count
  **0**, lint / typecheck / build exit **0**, plus **three shuffled full-suite runs, 277/277 each**.

## What was deliberately NOT produced

- **No code, no test, and no edit to any comment in `src/`.** No defect warranted a fix.
- **No widening of the delivered `NFR-007` guard.** Adding specifiers to a list that fails by
  omission treats the symptom; the permission-model instrument covers every specifier at once. The
  reasoning is recorded so a later reader can disagree with it on the evidence.
- **No test pinning the prototype gadget.** It would assert behaviour under a deliberately polluted
  global — a test that damages the process it runs in, for a scenario with no reachable
  precondition. `ABC-014`'s gate declined the sibling case for the same reason.
- **No wall-clock assertion anywhere**, and **no `--coverage` run**, so the tracked-`coverage/`
  hazard never arose.
- **No amended acceptance criterion and no re-opened ruling.** `## Acceptance` is byte-identical to
  what BA/PM left; the empty-locale and both-flags-true rulings, the merge-order constraint and the
  pull order are untouched.
- **No edit to `ABC-014`'s note or to any other role's notes**, no `supersedes` on a note whose
  other three records are correct, and no edit to `ABC-018`, `EPIC-006`, `EPIC-002`, any ADR or
  `plans/metrics.md`.
- **No dependency added or changed;** `package.json` and the lockfile are untouched, and this
  project still has **zero runtime dependencies**.
- **No PR.** This repo has no git remote and none was invented — `autonomy: "pr"` has always meant
  "branch + gate" here, as `AGENTS.md` records.
- **Nothing merged and nothing deployed.** The gate has now passed, which is what the owner's
  standing merge authority is approval to merge; the merge and the `… → Done` exit are the
  Orchestrator's, and **deploy is a human's** — per `ADR-0007` this project deploys nowhere at all.
