---
id: 20260919T211000Z-security-nfr-decision-pass-no-required-fix-no-accepted-risk-the-fired-threshold-answered-on-all-three-prongs-asvs-l1-walked-nfr-008-not-ruled-5e8a2d67
kind: decision
by: security-nfr
at: 2026-09-19T21:10:00Z
verified_by:
confidence: high
refs:
  - ABC-034
  - ABC-034/A7
  - ABC-033
  - ABC-018
  - EPIC-003
  - ADR-0004
  - NFR-001
  - NFR-002
  - NFR-003
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ADR-0019
  - src/rejection.ts
  - src/move-input.ts
  - package.json
  - plans/tickets/ABC-034-rejections-that-teach.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - agent-factory/checklists/security-nfr-checklist.md
supersedes:
---

# Security/NFR verdict on `ABC-034` at the wave tip `1b431dc` (build `6ee7cde`, QE `aa9e49f`): **PASS** — zero required fixes, zero accepted risks (no `AR-` row; `plans/nfr-catalog.md` not opened), the fired threshold answered on all three prongs by probe, ASVS L1 walked, `NFR-008` NOT ruled

**This is not a stamp.** `context.human_admission` is `off`, no `finding` is admissible, so this is
a hand-authored `decision`. It is the Security/NFR result for the `In Security/NFR` exit; it is
not a merge, not a UAT and not a human acceptance. The column move (`In Security/NFR → Ready for
UAT`) is the Orchestrator's. Config read first: `mode` lean, `security.asvs_level` `L1`,
`security.block_on` `high`, `compliance_regime` `[]` (no Compliance Officer hand-off owed).

## What was reviewed, and what is authoritative

The ticket page's `## Scope` and `## Security / NFR triggers` (`plans/tickets/ABC-034-…md`), the
Engineer's four notes (`ticket-to-pr-ABC-034`), QE's four notes (`qe-ABC-034`) and the diff
`git diff 4f0ef01 6ee7cde -- src/`: `src/rejection.ts` +181, `src/move-input.ts` +10/−11, and the
two test files. The ticket's own firing threshold — *"writes to any stream directly, touches any
file under `src/` other than its own module and test file(s), or adds a runtime dependency"* —
fired on its second prong (QE's `A7` ruling). **Each prong, answered by evidence:**

| prong | answer | evidence |
|---|---|---|
| direct stream write | **none** | grep of `process.` / `console.` / `.write(` / `stdout` / `stderr` over both files = 0; the module returns strings; the only sink is `assembleFrame`'s `sanitize` (`src/frame.ts:202`) — sibling `observation` traces the path end to end |
| a second `src/` file | **`src/move-input.ts`, one call site** — the one `## Scope` requires (*"messages travel as `PromptOutcome.rejected.messages`"*) | the diff is the call site, the removal of the two-code precedence it made unused, and one header sentence; eight core files hash-pinned unchanged by QE |
| runtime dependency | **none** | `package.json` blob `81d3a85a…` = `main:package.json`; `package-lock.json` `b1a4d6e7…` = main; `vitest.config.ts` `0c0aa2fb…` = main — byte-identical, hashed not eyeballed |

## The four things the subtask asked to be probed — all in the two sibling `observation`s

1. **The sink.** Bound verified from the regexes and then **enumerated over the whole grammar
   (165,888 strings)**: echo ≤ 7, sentence ≤ 20 columns; **0 escape / control / non-ASCII bytes in
   any of 120,288 prompts**, 0 sentences off the seven shapes; 192 frames whole. The `ABC-018` bar
   holds on this path with two independent controls (grammar allow-list, then `sanitize`).
2. **`NFR-003` one-derive (QE G3).** `legalMoves` per rejected prompt **1 → 1** on the production
   path (`resolvePromptLine`, no deps). `generateMoves` 1 → 2 (the classifier's set difference),
   `isInCheck` +1 on the two king classes. **No `NFR-003` charge**; the ticket's cost claim is
   exactly the measurement. G3 remains a test gap on a claim that is true — see below.
3. **`NFR-002` per-frame path.** `classifyRejection` **0 of 1,600 frames** through the CLI's own
   render seam (positive control 1). Static: `src/rejection.ts` is imported only by
   `src/move-input.ts`; no renderer imports either. The ticket's *"`NFR-002` — not triggered"*
   is true. The per-frame `legalMoves` the probe DID count (14–19/frame at 40–272 plies) is
   identical before and after the build — pre-existing, handed to Architect/Design as data.
4. **Dependencies.** Byte-identical to `main` (table above).

## ASVS L1 (70 requirements), filtered at read time — what has purchase, and why the rest does not

| requirement | ruling | evidence |
|---|---|---|
| V1.2.1 output encoding relevant to the context | **PASS** | the interpreter is the terminal; the encoding step is `sanitize` at the sink (`src/frame.ts:123`) and this path's bytes are grammar-bounded ASCII before it — probed, 0 leaks in 120,288 prompts |
| V1.3.2 no `eval` / dynamic code | **PASS** | grep = 0 over both files |
| V2.1.1 documented input validation rules | **PASS** | the two grammars are documented and tested (`ADR-0004`, `ABC-031`, `ABC-032`); this ticket's `## Scope` table documents how each code is COMPUTED and `A2` asserts it over the perft corpus |
| V2.2.1 positive validation against an allow-list | **PASS** | the classifier consumes only the readers' verdicts (`^…$` ASCII regexes) and set operations over generator output; it has no grammar of its own (`A8`'s constraint, hash-pinned by QE) |
| V5.2.1 accept only sizes it can process | **PASS (pre-existing control)** | `MAX_LINE_LENGTH` 1024 (`src/line-input.ts:90`, `ABC-037`) sits before this path; a 1,024-char line costs the classifier one pass over ≤ 5 texts and yields a 16-column sentence (probed) |
| V1.2.2 URLs · V1.2.3 JS/JSON · V1.2.4 DB · V1.2.5 OS commands · V1.3.1 HTML · V1.5.1 XML | not applicable | no URL, JSON, database, `child_process`, HTML or XML is built or touched (grep) |
| V2.2.2 trusted service layer · V2.3.1 sequential flows | not applicable | one local process, no client/server split; the loop's transitions are `ABC-019`'s and untouched (`src/turn-loop.ts` hash-pinned) |
| V3 web frontend · V4 API/WebSocket · V5.3 file handling · V6 authentication · V7 session · V8 authorization · V9 tokens · V10 OAuth · V11 cryptography · V12 TLS · V13.4.1 deploy without VCS metadata · V14 data protection | not applicable | no HTTP, browser, upload, user account, session, permission, token, crypto or transport exists in this program; it deploys nowhere (`ADR-0007`) |
| V15.1.1 / V15.2.1 component remediation timeframes · V15.3.1 field subsetting | not applicable to this change | no component added or updated (hashes above); the project-level documentation question is `UNKNOWN - verify` and pre-dates this ticket — not its finding |

No failed requirement, so no severity is tagged and `security.block_on: high` is not reached.

## Required fixes: **none**. Accepted risks: **none** — deliberately

No bar is missed and no control is absent, so an `AR-` row would be a risk invented to fill the
shape. The two residuals that exist are **test gaps on true claims**, owned where QE placed them:

- **G3** (the one-derive claim is asserted by nothing): now measured TRUE here; the guard is
  still absent and a later edit dropping `legal` at `src/move-input.ts:190` would cost one more
  `legalMoves` (~3–5 µs) invisibly. Cheap to close in the same test-only follow-up as G1/G2/G4;
  recommended, not required — the owner's call on whether it rides `ABC-034` before merge.
- **G2** (dispatcher order pinned only via the classifier): a reversed order echoes `bxc4` for a
  typed `Bxc4` — still 7-bounded ASCII; a wording defect, never a security one.

## `NFR-008` — NOT ruled (fence). The `N8-LANE` figure WAS measured to the protocol

The Engineer's +215 ms gross / +55 ms net: contained lane, `/usr/bin/time -p` CPU, one process per
run, 9 rounds with round 0 discarded (n = 8), three conditions rotated every round, identity twin
null control −0.09% with sign 4/8 (≤ 1.5%, at chance — recorded before any comparison), file and
test counts asserted on every run (27/27), base files restored by blob hash, harness outside the
repository. **That is the row's protocol as `plans/nfr-catalog.md` states it; the figure is
admissible as recorded.** The absolute 16.920 / 17.300 s readings were taken at 1-min load
6.7–18.7 and are handed up exactly as the Engineer handed them (`ADR-0019` trigger (a)); the quiet
re-measure is the separate hop. Nothing here re-measured the lane and nothing was trimmed.

## Observations passed on, not charged

- The render path derives `legalMoves` 14–19 times per frame at 40–272 plies (history pane
  `toSan`, `ADR-0004`) — identical before and after this build. Architect/Design: the `NFR-002`
  row's compute list does not yet carry it as a measured item (~60–80 µs by the row's own per-call
  figure; under the bar).
- `"  qh5  "` never case-folds — `ABC-033`'s whole-line variants (QE's (f)); no criterion of this
  ticket names it; BA/PM's ruling.
- `A1`'s named FEN has no pinned piece — QE's ruling stands; BA/PM to relabel.

## What this hop did NOT do

No merge, no deploy, no self-sign; `NFR-008` not ruled; the suite not re-run (this hop changed no
line under `src/` — `git diff --numstat` under `src/` is empty — and QE's 42 / 1291 / 0 at
`aa9e49f` stands as the lane record); `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` not
opened; `src/search.ts` and `src/turn-loop.ts` (sibling hops live) not touched. UAT is **not
waivable** (production lines under `src/`); the owner's word is the signature.
