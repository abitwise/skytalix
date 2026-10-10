---
id: 20261010T154202Z-ba-pm-decision-r5c-cut-abc137-f1331-cut-a-and-b-abc138-c14-split-3b2a76f6
kind: decision
by: ba-pm
at: 2026-10-10T15:42:02Z
verified_by:
confidence: high
refs:
  - R5c
  - QE-136-b
  - ADR-0011
  - ABC-137
  - F-133-1
  - QE-133-a
  - QE-133-b
  - AR-133-LOADER
  - AR-133-WRAP
  - ABC-138
  - ABC-133
  - ABC-132
  - ABC-129
  - ABC-134
  - Q14
  - C14
  - V1.2.5
  - src/history-pane.nfr.test.ts
  - src/cli.test.ts
  - plans/tickets/ABC-137-clause-1-helper-is-unpinned.md
  - plans/tickets/ABC-138-spawn-pin-holes-are-watched-by-hand-move-the-checks-into-the-pin.md
  - 20261010T152348Z-architect-design-decision-qe136-a-accepted-qe136-b-is-r5c-a-ticket-r5b-discharged-1708c558
  - 20261010T143745Z-security-nfr-decision-abc133-pass-with-risks-strip-discharged-loader-wrap-low-f-133-1-0f608f0c
  - 20261010T142516Z-qe-e2e-observation-abc133-gap-register-f589327d
  - 20261010T154202Z-ba-pm-observation-r5c-f1331-readings-at-5d55cc48-and-3159ab68-bd7b201e
supersedes:
---

# `R5c` is cut as `ABC-137` (XS, P3, DoR 10/10). `F-133-1` is cut WHOLE, (a) and (b) together, as `ABC-138` (S, P3, DoR 10/10). `C14` splits, because (a) as written reds it

This note is hand-authored and unsealed. Readings are in the observation note `…bd7b201e` and
`../probe/RUN.txt`. Both premises were re-verified at the tip before cutting. The board moves are the
Orchestrator's.

## Item 1. `R5c` (`QE-136-b`) → `ABC-137`, `Ready`

- **Cut to the Architect's spec** (`…1708c558` § `QE-136-b`). It adds one framed literal holding
  clause 1's two-line helper definition to the drift tripwire, and fixes the reach comment.
- **Premise holds at `5d55cc48`.** `XHELPER-NARROW+FMT+WPERFT-STATIC` exits 0 with 12/12, and the
  R5b/R5 controls are still RED. The file is byte-identical at `3159ab68`.
- **`XS` (1), `P3`.**
- **Sequencing.** `ABC-134` is merged (`c28bec7f`), so the Architect's ordering is met: pullable now.
  It is disjoint from `ABC-132` and `ABC-138`. `ABC-030` is merge order only.
- **One criterion added beyond the spec, for the reach comment.** The sentence "it pins four spans
  of the guard by TEXT" becomes false once a span outside the guard is pinned. So `A3` asks for that
  phrase count to go 1 → 0, and for `R5c` to be named. This is how the Architect's "either names the
  helper pin or is narrowed to the truth" is measured.
- **`XSHADOW-HELPER` is recorded, not asserted green.** A spelling that also kills it is better, not
  worse.

## Item 2. `F-133-1` → `ABC-138`, (a) AND (b), `Ready`

**Why cut, not decline.** Each accepted risk is held by a hand-run check, `loader-scan.mjs`. BA/PM
runs it at every cut and Security/NFR at every gate that touches `src/cli.test.ts`. That file was
touched by about 19 tickets since 2026-08-01, so the check recurs on roughly every other ticket. The
two risks' promotion triggers ARE the counts `F-133-1` proposes (non-empty `childProcessArgCalls`; more
than two `spawnSyncValueRefs`). Cutting `F-133-1` moves a remembered step into the suite at the
cost of one ticket.

**Why (b) as well as (a).** Declining (b) leaves `AR-133-WRAP` open, so the hand check survives every
future hop for the sake of four wrappers, which is the expensive half of the bargain.
- (b) is no larger than (a): one filter over the walk that already exists.
- Every red-first recipe exists, and the dry run reads exactly 2 at both tips.
- Its one cost is reversing `ABC-133`'s "`Q14` out" line. The new page says so, and its `A4` measures
  the comment change.
- **Splitting (a) from (b) would buy two serial QE hops on one file.** They share the walk, the `it`
  and the QE ledger.
- `ABC-133`'s page is left as written (`Done`).

**`C14` split. This is a defect in the recommendation as written.**
- Security/NFR's (a) counts any call whose first argument names the module, "whatever the callee".
  Its control list says "`C13`/`C14` (no false count)".
- But QE's `C14` recipe holds `void JSON.stringify("child_process");`, and Security's own
  `loader-scan.mjs` lists that call under (a). Measured: `C14` → `["JSON.stringify@60"]`.
- **Resolved on the page:**
  - `C14-ARRAY` (the array half) is the green control;
  - `C14` and `C14-ARG` are a stated, loud false-red class, which is (a)'s price;
  - the pin's comment names that class.
- **Rejected alternative:** narrowing (a) to an allowlist of loader callees. That reopens the hole (a)
  exists to close, because the next loader is the one not listed. A loud false red costs one
  re-spelling, and a silent hole costs a child the counter never sees.
- **Security/NFR confirms the split at the gate.** That is recorded on the page and is not a DoR
  blocker.

**Bounds kept out by name.**
- A non-literal module name: adversarial, not drift. Whether `AR-133-LOADER` discharges with that
  bound is Security/NFR's call.
- `S1`: refused by `typecheck`.
- Restructuring count (ii).
- Member names spelled `spawnSync` (loud if counted).

**Ordering and size.**
- No open predecessor: `ABC-133` is `Done` (`c0b0e9e1`), and `ABC-129`, the last ticket on this file,
  merged at `3730f28e`.
- `ABC-132` (`In Development`) fences its diff to three production files (`A4`). It does not share
  this file, so they may run in parallel; if its delivered diff names this file, this ticket waits.
- `S` (2): two counts plus a cost bound, one file.
- `P3`, with Security/NFR's two `P1` triggers carried unchanged. Neither trigger fires at
  `5d55cc48` or at `3159ab68`.

## Ordering across the two

`ABC-137` and `ABC-138` touch disjoint files, so either order works, or both in parallel. Both are
`P3`. If one slot is free, take **`ABC-138` first**: closing it retires a hand-run check on a busy
file, while `ABC-137` closes a single LOW survivor on a file nobody is editing.

## Owner questions

None. Both items are inside the authority already delegated: the Architect ruled `R5c` a ticket, and
`F-133-1` is BA/PM's call by Security/NFR's ruling. **For Security/NFR, at `ABC-138`'s gate (not the
owner):** confirm the `C14` split, and rule whether `AR-133-LOADER` / `AR-133-WRAP` are discharged.

## Not done by this hop

- No `src/`, `plans/board.md`, ADR or `AGENTS.md` change, and no column change.
- `ABC-133`'s page is not edited.
- Nothing merged or pushed.
- **This branch is based on `5d55cc48`**, the enqueue. The wave moved to `3159ab68` during the hop, and
  the fast-forward was refused by this session's permission layer. The two pages, the notes and the
  probe are new files. `plans/traceability.md` gets two rows appended at its end, where
  `3159ab68` also appended two, so the Orchestrator's merge sees a one-hunk append conflict to keep
  both sides of.
