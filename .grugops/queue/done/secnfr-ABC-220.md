---
subtask: secnfr-ABC-220
role: security-nfr
ticket: ABC-220
ref: .grugops/context/secnfr-ABC-220/
branch: new grugops/secnfr-ABC-220 from main 01c37946 (worktree .claude/worktrees/secnfr-ABC-220); candidate grugops/qe-ABC-220 @ cc32a470 (code fbab54ff)
width: records only, NO builds/tests/node (an SE runs beside you)
---
# Security/NFR gate: ABC-220 (simple-tournament TimeMode over UCI)
## Read
ABC-220 ticket § NFR triggers; ADR-0052 (D1–D9, § Status 2026-10-30); arch-ABC-220-a14 notes (`…5ecf3a59`, `…ca075632` — the
NFR-011 entry text, D5 whole-second reading); qe-ABC-220 notes on branch grugops/qe-ABC-220 (`…58af5b6a` timing,
`…c6bdd364` gaps + your handoff, verdict `…7a09c5e1`); code via `git show fbab54ff:src/uci-session.ts`; plans/nfr-catalog.md.
## Do
- Gate verdict PASS / PASS_WITH_RISKS / FAIL (block_on: high; ASVS L1): one option matched exactly against a frozen tuple,
  hostile values refused, echo via printableOf, no new input class.
- Place, dated, in plans/nfr-catalog.md: NFR-004's 22 s text for simple-tournament (budget 22 s, clamp 32 000), AR-NFR004-A
  re-read at 22 s (A11 overshoot 1.0 ms), the busy isready/stop accepted-risk entry beside NFR-011 (Architect's text;
  measured worst ≈ 22 001.4 ms), NFR-008 headroom (A12 9.69 s, G8 +0.09 s) as a watch line.
- Rule whether anything needs the owner (the whole-second reading is already an open owner confirmation; it blocks nothing).
## Fences
plans/nfr-catalog.md, your notes. No src/, tools/, data/. Run no builds, tests or node; if sealing needs node, draft a seal
script that calls only context-io admitAndAppend and give me the command. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
Waiting on a background job: poll its output file or a pid with `kill -0 <pid>`; never `while pgrep -f <pattern>` (the loop matches its own command line and never exits). Stop every wait loop you start before you report.
## Publish
Notes (task `secnfr-ABC-220`), commit, `## Result` + trace row here, brief + claim to done/.

## Result

*Security/NFR, 2026-10-30, task `secnfr-ABC-220`; records only. Branch `grugops/secnfr-ABC-220`, made from `main` `01c37946` and fast-forwarded to the claim commit `3e4e1ca2` so that this brief could move. The catalog commit is `9c676157`, and the drafted notes and this brief move are on top. Nothing was run, built or timed.*

- **Gate: PASS_WITH_RISKS** (ASVS L1, `block_on: high`). **No required fix.**
  - One option, matched exactly against the frozen tuple: `TIME_MODES.find(m => m === value)`, with no key lookup.
  - Hostile values are refused (QE: 8, including `__proto__` and `constructor`).
  - The echo goes only through `info` → `printableOf`, so no line can be injected.
  - No new input class: every mode branch is `min(·, T)`; ±Infinity and NaN go to T or depth 1 (QE-220-d).
  - No new import, spawn or `package*.json` change.
  - `ADR-0036` clause (b) was not run (it needs `node`): `UNKNOWN - verify`.
- **`NFR-004`:** Target gains "; 22 s in UCI `TimeMode` `simple-tournament` (budget 22 s)" (`ADR-0052` § Consequences, verbatim, a pure insertion).
  - Two dated lines go with it: the owner's words `…3dd61448`, and the mechanism (T = ceiling = 22 000, 0 ms margin, clamp 32 000). It binds from `ABC-220`'s merge.
  - Verified by gains a dated line: MET exactly on the budget (`A6`); MET to the whole second on the real clock (`A11`, max 22 001.0 ms < 22 500); NOT MET in the letter at ≤ 22 000 by ≤ 1.0 ms, covered by `AR-NFR004-A`.
- **`AR-NFR004-A` at 22 s: STANDS, re-accepted with its number (+1.0 ms of ≤ 31 ms). Owner: Security/NFR.** The sample is thin (5 calls); `ABC-222`'s games are the next reading.
- **`AR-UCI-BUSY` (new), placed after § "`NFR-011` PLACED"; the `NFR-011` row is byte-identical.**
  - The Architect's text, verbatim, with the whole-second reading.
  - The bound's worst case is ≈ 22 131 ms; the worst case read is ≈ 22 001.4 ms (two separate readings added together).
  - **Owner: Architect/Design** (`ADR-0044` D5's worker triggers).
- **`NFR-008` watch line:** `A12` 9.69 s; `G8` +0.09 s (head 9.73 s), so 0.27–0.31 s of headroom. MET; not edited. **Owner of the watch: the Orchestrator.**
- **Observations (INFO):**
  - `SEC-220-a`: the ADR's quoted `NFR-004` sentence says "≤ 3 s" (stale since `ABC-228`). Architect/Design, at the fold.
  - `SEC-220-b`: the `milliseconds` comment says "finite", but it can return ±Infinity. Pre-existing and safe. SE, at `ABC-221`.
  - `SEC-220-c`: `NFR-011`'s cell does not name `sysctl`; its A6 probe does. QE, at the next `NFR-011` re-read.
- **Owner ruling: nothing new needs the owner.** The whole-second reading is the already-open confirmation (FOLDED note), and it blocks nothing. `SEC-228-a` stays his and does not gate anything.
- **Checks:**
  - All 12 NFR rows hashed before and after: only `NFR-004` moved, and in it only Target and Verified by.
  - A host-path scan of the added lines found 0 hits.
- **Notes: drafted, NOT sealed** (sealing needs `node`). Run from the worktree root:
  `node .grugops/context/secnfr-ABC-220/raw/seal.mjs .grugops/context secnfr-ABC-220 .grugops/context/secnfr-ABC-220/raw/seal-spec.json`
  It calls only context-io `admitAndAppend`, then `render` and `readContext`. It admits a decision and an observation, both stampless.
- **Not touched:** `src/`, `tools/`, `data/`, tests, ADRs, the board, the trace, tickets and `AGENTS.md`. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-220 (Security/NFR gate) | simple-tournament over UCI: NFR-004 gains 22 s in TimeMode simple-tournament (budget 22 s; clamp 32 000), A6 exact, A11 max 22 001.0 ms (< 22 500 whole-second; letter missed by ≤ 1.0 ms); AR-NFR004-A re-read at 22 s, stands (+1.0 ms); AR-UCI-BUSY placed beside NFR-011 (worst read ≈ 22 001.4 ms; owner Architect/Design); NFR-008 watch 0.27–0.31 s; PASS_WITH_RISKS; SEC-220-a/b/c INFO | EPIC-009 | — | NFR-004 (text, owner's word …3dd61448, ADR-0052 § Consequences); AR-NFR004-A; AR-UCI-BUSY (ADR-0052 D7, ADR-0044 D5); NFR-008 (watch); NFR-011 (unchanged) | grugops/secnfr-ABC-220 @ 9c676157 (plans/nfr-catalog.md: NFR-004 Target + Verified by, 1 _Updated line, AR-UCI-BUSY paragraph, closing section); .grugops/context/secnfr-ABC-220/raw/ (2 drafted notes, seal script) | none run (records only); readings cited from qe-ABC-220 …58af5b6a (A11, A12, A14a, A14b, G8), …c6bdd364 (gaps), verdict …7a09c5e1 | — (ABC-220 UAT signed by QE verdict …7a09c5e1) | — | ABC-220 → Ready for UAT (Orchestrator); merge is a human's |
