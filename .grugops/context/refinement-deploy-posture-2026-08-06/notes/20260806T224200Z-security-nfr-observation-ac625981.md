---
id: 20260806T224200Z-security-nfr-observation-ac625981
kind: observation
by: security-nfr
at: 2026-08-06T22:42:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - security-nfr-availability-bar
  - 20260806T223500Z-security-nfr-decision-c4552274
  - plans/nfr-catalog.md
  - plans/epics/EPIC-005-opening-book.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - RISK-002
  - RISK-004
  - RISK-005
  - EPIC-006
supersedes: 
---

# The bounded second question, answered: NOTHING depends on a deploy target. FOUR things depend on DISTRIBUTION, and none is relaxed by the local-only posture. One TWO-DOCUMENTS-DISAGREE finding.

## The distinction the answer turns on

- **Deploy target / environment promotion path** — somewhere a build is pushed, and environments to
  promote it between. **Nothing on record needs one.**
- **Distribution** — the artifact reaching a machine that is not its author's (npm, a binary, a
  `git clone`). **Four things need this**, and every one of them stays exactly as open as it was.

**Collapsing the two is the error this note exists to prevent**, because it is what would let "we
deploy nowhere" quietly discharge obligations nobody discharged.

## The seven catalog rows

`NFR-001` / `NFR-002` / `NFR-003` / `NFR-004` / `NFR-005` — **no dependence.** All are in-process or
terminal-local: generator throughput, frame compute and write, keystroke echo and turn derives, engine
wall clock, search depth in budget.

- **`NFR-006` — distribution-dependent in one clause.** *"≤ 1 MB (no published-package bloat)."* The
  size bar is measurable on any build; only the word *published* presupposes distribution. **Recorded
  separately: its stated instrument does not exist today** — `npm run build` is `tsc --noEmit`, which
  emits nothing, and there is no `dist/`. **Not edited.** Owner Security/NFR, at `EPIC-005`/`EPIC-006`.
- **`NFR-007` — the one row that names a mechanism.** *"`npx` invocation to first rendered board in
  < 2 s with a warm npm cache."* **Not edited** — see the finding below.

## THE FINDING: two documents disagree about whether the distribution mechanism is decided

**`EPIC-006` states `npx` in FOUR places:** `## Scope` (*"Packaging: runs via `npx` with no install
step and no global dependency"*), the epic-level acceptance criterion (*"Given `npx <package>` on a
machine with Node installed…"*), its `## NFR triggers` block (which is where `NFR-007` was
transcribed from), and its `## Test notes` (*"drives a scripted game from `npx` invocation"*).

**`ADR-0007` clause 5, written the same day, says the opposite:** *"How the CLI will eventually be
distributed is **UNDECIDED**… npm, a standalone binary, a `git clone` and `npm start` — all open."*
The Orchestrator's decision note for this task likewise lists *"not deciding how the CLI will
eventually be distributed"* as out of scope.

**Both cannot be true at once.** This is the same *two-documents-disagree* shape this project spent
2026-08-04 untying out of `ABC-015`, and it is reported rather than smoothed.

**Nothing on either side was edited.** `EPIC-006`'s scope is **BA/PM's**; `ADR-0007` is
**Architect/Design's**; `NFR-007`'s bar is byte-identical because rewriting it would either pre-empt
the distribution choice or re-open a performance bar — both explicitly out of scope here. **Owners:
BA/PM and Architect/Design, at `EPIC-006`'s decomposition.** Whichever way it resolves, `NFR-007`'s
denominator then gets stated the way every other bar in the catalog states one; **Security/NFR owns
that edit and does not own the choice.**

## The five risks

| Risk | Deploy-dependent? | Actually depends on |
|---|---|---|
| `RISK-001` move-generation edge cases | **No** — retired | the perft harness |
| `RISK-002` throughput caps depth | **No** | **non-M3 target hardware** for its timeboxed spike — a machine, not an environment |
| `RISK-003` strength hard to verify | **No** | a reference opponent, self-play ladder, puzzle suite |
| `RISK-004` opening-book licensing | **No — distribution-dependent** | the licence must permit **redistribution** |
| `RISK-005` terminal portability | **No** | other people's terminals; its mitigation is local code |

## Accepted risks — twelve enumerated across three gates, none deploy-dependent

Checked against every accepted-risk enumeration in `plans/board.md`, `plans/traceability.md` and the
ticket files: **`ABC-011`'s first pass (3)** — one-machine timings; the `zobristKey` purity MEDIUM
(since **closed**); the amortized denominator. **`ABC-011`'s re-gate (4)** — one-machine timings; two
unpinned behaviour-equivalent cost mutants; the amortized denominator; purity closure being 336,000
inputs rather than a proof. **`ABC-012`'s gate (5)** — `takeBack(NaN)`; `playMove` validates nothing;
`src/fen.ts` out-of-range move counters; `coverage/` tracked and stale; every NFR figure being one
machine and one Node version. **`ABC-006`'s** `PASS_WITH_RISKS` risk (*"nfr-catalog empty"*) is long
since discharged.

**Not one of them needs a deploy target, an environment or a promotion path to be discharged.**

## Two ASVS deferrals DO depend on packaging — and the local-only ruling CONFIRMS them

Both from `ABC-011`'s gates at `security.asvs_level: L1`. **Neither touched, neither closed:**

- **`V13.4.1`** (no source-control metadata in what is deployed) — **DEFERRED, not passed**, on the
  ground *"nothing is deployed and nothing is packaged until `EPIC-006`"*. It is about what a
  **shipped artifact** leaks, so it goes live at **packaging**, not at deployment. **"We deploy
  nowhere" must not be read as closing it.**
- **`V15.1.1` / `V15.2.1`** (documented remediation timeframes for third-party components) — **not met
  at project level**, severity overridden `high` → `low` with a stated reason. **Owner:
  Architect/Design, at `EPIC-006`.** Unchanged.

## THE FENCE — "we deploy nowhere" must never be read as "only this machine matters"

The most likely wrong inference from this whole task, named so it can be caught:

1. **`RISK-002`'s non-M3 spike stands.** It is the named verification that lifts `NFR-005`'s
   **PROVISIONAL** depth-7 marker. Local-only makes *deployment* unnecessary, not a *second machine*.
2. **Every `UNKNOWN - verify` on other hardware stands.** Every figure in the catalog is Apple M3
   (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64. `ABC-011` re-gate risk 1 and `ABC-012` risk 5
   carry exactly this obligation.
3. **`RISK-004` stands.** Redistribution is triggered by the data reaching **anyone at all** — a
   `git clone` distribution is still redistribution. Resolve **before** copying any data.
4. **`RISK-005` stands.** "Used locally" is about *this* developer's machine today; the ASCII fallback
   exists for the terminals this project has not met.

## Found in this role's own ownership and deliberately NOT fixed

**`perf_p95_ms: 300`** (a p95 latency budget over API endpoints this project does not have) and
**`a11y_target: "WCAG-2.2-AA"`** (a web-content standard, for a terminal program) sit in the same
`nfr` object and are the same class of untrue bootstrap default as `availability` was.

**Not fixed — and flagging is not re-opening.** Neither was asked; this subtask's question was the
availability bar; and re-opening any performance bar was explicitly barred. **No value was changed and
`NFR-003`'s keystroke figures are byte-untouched.** Recorded loudly because a reader will otherwise
ask why one key in that object was ruled and the two beside it were not. **Owner: Security/NFR.
Trigger: `EPIC-003`** for the latency key (`NFR-003` already carries this project's honest version of
that question) and **`EPIC-002`/`EPIC-003`** for the accessibility key (terminal accessibility is
glyph-mode and contrast, which `RISK-005` and epic amendment `[A4]` already own; WCAG is the wrong
standard to inherit unexamined).

**Also noted from the previous hop and still unowned:** `default_stack.container: "docker"` with no
Dockerfile, and `memory-bank/00-index.md`'s now-stale fill-state line. Both were flagged by the
Architect; neither is this role's and neither was touched. **They are repeated here only so the count
of open substrate items does not shrink by being mentioned once.**
