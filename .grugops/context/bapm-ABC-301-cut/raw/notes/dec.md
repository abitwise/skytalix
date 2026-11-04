# bapm-ABC-301-cut decision: E2's second pull is cut as ABC-301 (L, P2, intent GAIN, DoR 10/10, Ready) from the Architect's owed lines; EPIC-011 records the owner's two yeses and Q-3K-11

BA/PM, task `bapm-ABC-301-cut`, records only, on `grugops/bapm-ABC-301-cut` from `main` `d7cd6871`. Nothing was run
except the note seal and the records-path check. Pages commit: `8d6ea5dc`.

## The cut (`plans/tickets/ABC-301-…`)
- **Source:** `arch-second-pull-1104` `…4917f0f7` § 5, written as given, with § 1–4 of that note and `ADR-0067`'s
  dated line of 2026-11-04 under its bars table. The owner's word behind it: `orch-2026-10-30a` `…dda43b71`
  ("1. yes; 2. yes").
- **Front matter:** `status: ready`, `column: Ready`, size **L**, priority **P2**, `epic: EPIC-011`. `adr:` names
  `ADR-0067` (accepted; the d6 amendment adopted) and `ADR-0070` (accepted in form (a); d7).
- **Intent: GAIN** (C2′ ≥ 50.0 of 100).
- **Scope 0, the four preconditions, made measurable:**
  - P1 `QE-271-h`: exact on 44 / 44 of QE's frozen fixtures;
  - P2 `QE-271-g`: 0 callers outside test files;
  - P3 `QE-271-i`: 17 exports equal to `main`'s value for value, typecheck passes, B-T1 0 misses;
  - P4 `QE-271-f`: the endgame `G2` row named in the PREREG.
- **Scopes 1–5** are § 5's.
- **Bars:** B-T0–B-T8 by reference at their levels. The changes are written out:
  - F3's new form (§ 1's step list);
  - B-T4's endgame `G2` ≤ 1.02 × on `qe-ABC-271`'s six-position endgame set with the A5 instrument;
  - B-T8 re-confirmed;
  - `ADR-0070` F4 and F5.
- **Out of scope:** § 5's list, plus two items that § 3 and `…a5d74f70` already state: F2's cost cut and any bundle.
- **Dependencies:** `ABC-271` (`872e5ffc`), `ABC-280` (`0c8b385a`) and `ABC-283` (`58e90d07`) are merged, each
  checked as an ancestor of `main`. The freeze rule (C2′'s stale rule) and `ABC-272` (one at a time) are named.
- **`NFR-008` flag:** `QE-283-a`'s 9.60 s and the merged tree's 9.77 s (ungraded). The headroom is
  `UNKNOWN - verify`, pointed at `secnfr-nfr008-1104` (in flight).
- **DoR 10/10.** Row 10 is met because `ADR-0067` (with the amendment) and `ADR-0070` d7 are accepted, B-T8 is
  re-confirmed, and no owner question is open.

## `EPIC-011`
- **§ Phases, row E2:** the second pull is cut as `ABC-301`. "It has no ticket id yet" is struck.
- **§ The per-change rule:** the pointer already existed. `bapm-ABC-283-done` wrote it, naming `ADR-0056`'s PROPOSED
  "the bundle read" section, `Q-3K-11` and reading (b). It now cites its source, `…a5d74f70`. No second pointer was
  added (J2).
- **§ Tickets:** new row 53, and the ids line.
- **§ Owner questions:**
  - a dated header line;
  - the d6 amendment and B-T8 rows struck as answered yes (`…dda43b71`);
  - **`Q-3K-11` added**, in the form given in `…a5d74f70`: (a), (b) or (c); default reading (b); the optional bundle-1
    ask.
- **§ Dependencies:** "no ticket id yet" is struck. A new dated line reads `ABC-271` → `ABC-301`, one read judging
  both.
- **Top block.**

## Judgments, flagged
- **J1, the title:** it reads "fits again" where the Architect's suggested title reads "refits". Under the amendment
  there is no refit step, so the word would mislead. The meaning is unchanged.
- **J2, the pointer:** one pointer already existed and said what `…a5d74f70` owes. I added a source cite and did not
  add a duplicate.
- **J3, test note 5:** it carries `QE-270-e` (`954d44fb`) and K1 (c) form (A) from `ABC-239` § Close as "carried, not
  bars". § 5 does not list them. `ABC-239`'s close says the second pull owes `QE-270-e`.
- **J4, § Open, not bars:**
  - (1) B-T8's harness form. `rpair` takes no `--budget-ms` on `main` (the observation note), so the first pull's
    "one `rpair`" ruling has no command at 0.5 s.
  - (2) The endgame `G2` row's miss disposition. F1–F8 do not name one.
  - (3) The `NFR-008` headroom.
  - All three go to the Orchestrator. None is a bar and none blocks DoR.
- **J5, other pages:** ten pages mention "the second pull" without an id (`ABC-239`, `ABC-271`, `ABC-280`, `ABC-284`,
  `ABC-287`, `ABC-290`–`ABC-293`, `ABC-295`). They are not edited, because the brief does not ask for it. Adding
  pointers is optional and the Orchestrator's call.

## Not touched
The board, every ADR, `src/` and `tools/`. No bar, level, size or priority on another page moved.
