---
id: 20261012T050316Z-qe-e2e-decision-abc117-verdict-6242f82f
kind: decision
by: qe-e2e
at: 2026-10-12T05:03:16Z
verified_by:
confidence: high
refs:
  - ABC-117
  - ABC-115
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - QE-117-a
  - QE-117-b
  - QE-117-c
  - QE-117-d
supersedes:
---

# QE `ABC-117` verdict: PASS_WITH_GAPS

Reviewed tip `d5afab3f` (`grugops/ABC-117-exit-one-correction`, corrections `59000c87`, base
`3537fe48`). Readings are in `…d83a9326` and gaps in `…7db4ad01`. This is an agent `decision` and
not a stamp (`human_admission` is `off`).

| criterion | verdict | my reading |
|---|---|---|
| A1 | **MET** | Tip: exit 1, `^usage: ` 0, `internal error` 0, no `CAUGHT:`. Repro: exit 1, `CAUGHT:` never printed. Control (refusal): `^usage: ` 1. Every corrected sentence matches. The page's `Usage` instrument is vacuous, which the Engineer disclosed (QE-117-b) |
| A2 | **MET, all four** | Original unmodified. `supersedes` = `…8a4b2e69`. (i) both zeros. (ii) no `try`/`catch`, `:160` arm. (iii) `cmp` of lines 24-49 equal, 26 lines. (iv) "NOT re-opened" |
| A3 | **MET** | One `observation`, three ids on `refs`, empty `supersedes`, three originals byte-identical |
| A4 | **MET** | Board +2/-0, ABC-115 page +14/-0, each block quotes its clause. **S9 rides the S6 block and names both clauses** (as ruled). S8 is comment lines only (+7/-3) and declares that it corrects |
| A5 | **MET** | No CLAIM-A line touched. ADR-0016 numstat empty. No wider arm, no re-score / move / re-open wording |
| A6 | **MET** | Only `src/cli.test.ts`, all `//` lines, nfr/AGENTS numstat empty, 8-row hash `c74e7426…0d3b` base == head |
| A7 | **MET** | 56 / 1741 / 0 at base and tip, same paths and names. N8 lines hash-equal. `T2` not fired |

Gates at the tip: lint, typecheck, build and unit all exit 0. Skip integrity `No findings.` at 0.
Host protection `UNKNOWN - verify` (exit 2, no remote).

**The gaps that make it PASS_WITH_GAPS and not PASS:**
- **QE-117-a (MEDIUM): two CLAIM-B clauses outside the inventory stay false at the tip.** They are the
  `ABC-115` trace row, which the page itself declared verified clean, and `…0391186e:69-70`. Routed to
  BA/PM. QE recommends a two-row widening and an SE delta hop before merge.
- QE-117-b (LOW): amend A1's instrument wording to `^usage: `.
- QE-117-c (INFO) and QE-117-d (INFO): non-blocking.

**UAT waiver: applies, measured.** The production `src/` list is empty over the range and per
commit. **Next:** BA/PM rules QE-117-a. On "widen", an SE delta hop follows, then a QE re-check of
the delta. On "follow-up", the ticket proceeds as zero-production-lines (`Ready for UAT` → `Done`
under the waiver) through the Orchestrator's merge gate. No security trigger is engaged (comment
and records only).
