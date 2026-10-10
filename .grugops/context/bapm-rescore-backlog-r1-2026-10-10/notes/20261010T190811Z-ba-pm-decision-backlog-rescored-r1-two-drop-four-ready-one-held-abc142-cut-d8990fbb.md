---
id: 20261010T190811Z-ba-pm-decision-backlog-rescored-r1-two-drop-four-ready-one-held-abc142-cut-d8990fbb
kind: decision
by: ba-pm
at: 2026-10-10T19:08:11Z
verified_by:
confidence: high
refs:
  - ABC-108
  - ABC-111
  - ABC-116
  - ABC-114
  - ABC-105
  - ABC-117
  - ABC-070
  - ABC-142
  - ABC-072
  - ABC-073
  - ADR-0035
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - AR-N8SPAWN-DRIFT
  - QE-141-a
  - QE-141-d
  - QE-093-d
  - QE-093-e
  - plans/traceability.md
  - .grugops/context/wave-2026-09-25/notes/20261010T173005Z-orchestrator-decision-owner-word-eight-answers-6a1f3d92.md
  - .grugops/context/secnfr-catalog-2026-10-10/notes/20261010T183612Z-security-nfr-decision-catalog-r1-provisional-retired-node26-risk003-measured-ar133-recorded-d1e00b44.md
  - .grugops/context/qe-ABC-141/notes/20261010T185518Z-qe-e2e-observation-abc141-gap-register-baafc88b.md
  - .grugops/context/qe-ABC-093/notes/20261010T185733Z-qe-e2e-observation-abc093-mutants-gap-register-cce9af72.md
supersedes:
---

# Non-book backlog re-scored against `ADR-0035` / R-1: two DROP, four READY, one held, one ticket cut (`ABC-142`)

This note is hand-authored and unsealed. It is a `decision` and carries no stamp: `human_admission` is
`off`. Every recommendation is the Orchestrator's to apply. **No `column:`/`status:` was moved.**
`priority:` moved on two pages, each by that page's own pre-registered trigger.

**Base.** The worktree branched at `d1e66582`, the enqueue tip. It was **fast-forwarded to
`39d87491`** before any edit, after `ABC-093` merged. The `--dir src` gap is live only from that tip.

## Verdicts

| ticket | verdict | DoR | size / priority | recommended column |
|---|---|---|---|---|
| `ABC-108` | **DROP**, superseded by `ADR-0014` → `ABC-110` → `ADR-0019` → `ADR-0035` + R-1. The clause it rules is no longer levelled | n/a | M / P1 (left) | Done as superseded (owner's call) |
| `ABC-111` | **DROP once `NFR-008` carries the re-open trigger.** Its own demotion trigger fired on R-1 | n/a | M / **P1 → P3** | Backlog until then, then closed |
| `ABC-116` | **READY**. The premise holds: 0 `T2` in `src/cli.test.ts`. `A1`(ii)/`A2` were re-read onto `ADR-0035` | **10/10** (item 4 ⚠️ → ✅) | XS / P2 | Ready |
| `ABC-117` | **READY**. Re-measured on v26.11.0: exit 1, `Usage` 0, `internal error` 0, `:160`. **9th site found** (board `ABC-115` row, missed at the cut) | **10/10** (item 5 ⚠️ → ✅, `ABC-115` `Done`) | XS / **P3 → P2** | Ready |
| `ABC-114` | **READY**. All six false sentences still on disk. The `XS` trigger did not fire | **10/10** (first table on the page) | S / P2 | Ready |
| `ABC-070` | **READY**. `ABC-065:130` is still live | 10/10 | XS / P3 | Ready |
| `ABC-105` | **STAYS Backlog**. `ABC-072`/`ABC-073` reached `Done` 2026-10-10 with no `qe-e2e` hop, by a recorded routing call | 9/10 (item 10: owner's ceiling ack) | M / P2 | Backlog |

**Ready count if all are taken: 4 + `ABC-142` = 5 of 8.**

## Shared stale items, fixed on all three comment-only pages (`ABC-114`, `ABC-116`, `ABC-117`)

- **Hash pins `63f66795…ca31` are VOID.** The tip reads `c74e7426…0d3b` after the owner's 2026-10-10
  catalog moves. They were re-read as "the 8-line hash is identical at base and tip". As written, a
  correct delivery would have FAILED `A5`/`A6`.
- **`npx vitest run --dir src` → `npm test`.** The cited *"`AGENTS.md` `## Test notes` 5"* no longer
  exists.
- **`N8-LANE` sentences** ("`ABC-108` open / BREACHED 1.480 s / UNRULED wall") are history. Comment-only
  diffs use the count pin (`ADR-0035` decision 3).

## The five flagged items: ticket or not

1. **`--dir src` vs `tools/` tests: NO TICKET. Now LIVE:** 52 vs 53 files (`QE-093-d`).
   - BA/PM's three Backlog pages are fixed here.
   - **Still owed:** the `NFR-008` row's *"measured as `npx vitest run --dir src`"* and its own flag
     *"0 today"*, which is now false. Security/NFR at the next catalog hop, with Architect/Design.
2. **`ABC-084` file count 49 vs 51: NO TICKET.**
   - Nothing downstream reads the number.
   - Which figure is right is `UNKNOWN - verify` (not checked here).
   - Architect/Design gives it a dated erratum at their next touch of `ADR-0035`.
3. **`N8-LANE`'s "5 %" has no CPU level under R-1: NO TICKET.**
   - `ADR-0035` decision 3 keeps **650 ms as a number**, read on the narrow set at or above `F`.
   - The 5 % is provenance. One catalog wording line, for Architect/Design.
4. **`QE-141-a` + `QE-093-e`, the unnamed flake: TICKET `ABC-142` (XS, P2, owner Software Engineer).**
   - Two unnamed one-test reds in one day, each lost to a truncated capture.
   - **Cut the cheapest slice: keep the name on disk on every run.**
   - **Not cut: a load-induced reproduction spike.** Holding load1 near 180 on the shared machine taxes
     every live hop. Cut that later, against a name.
5. **`QE-141-d` (`host-protection.js` exit 2): NO TICKET.**
   - `git remote -v` prints **0** lines, and the tool's header documents exit 2 when the repository
     cannot be resolved.
   - **Exit 2 is the correct "could not run".** Recommend gates write *"N/A — no git remote (`ADR-0007`)"*
     rather than `UNKNOWN`.
   - Revisit trigger: a remote is added (`EPIC-006`).

## Hand-offs (no ticket; owners named)

- **Architect/Design:**
  - **`AR-N8SPAWN-DRIFT`'s discharge** reads *"at `ABC-108`'s remedy"*. No discharge is recorded
    anywhere at `39d87491`, and `ABC-108` is recommended DROP. Re-point it.
  - Items 2 and 3 above.
- **Security/NFR (with Architect/Design):**
  - Carry `ABC-111`'s re-open trigger in `NFR-008`: *re-open warm/cold when a conforming warm wall
    median reaches **8.76 s** (10 ÷ 1.141), or any cooled reading exceeds 10 s; re-measure the factor on
    re-open.*
  - Item 1's catalog sentence.

## Owner questions (plain words)

1. **Your "2. accept" on 2026-10-10:** did you mean the test-suite rule is now *"`npm test` finishes in
   10 s or less on a moderately busy machine; CPU time is only reported"*? Two things rest on that
   reading: `ABC-111`'s drop and Security/NFR's catalog change.
2. **QE skipped twice:** on 2026-10-10, `ABC-072` and `ABC-073` were closed with Security/NFR checking
   them **instead of** a QE hop. Your 2026-08-17 rule says every ticket gets QE. Is that swap OK for
   documentation-only tickets, or should it not happen again?
3. **`ABC-105`, the QE detector:** it can check that a QE verdict note exists in the right place, but it
   cannot prove QE really did the work. Is that enough for what you meant by "yes to the QE detector"?

## Process disclosure

The queue `claim.md` was written with an **unquoted** heredoc, to expand the UTC stamp. That departs
from the quoted-delimiter rule. The content is a literal stamp and nothing else expanded. Every later
write used a quoted delimiter or the file tool.
