---
id: 20261010T091320Z-ba-pm-decision-abc010-recut-criterion9-fence15-rows-fold-into-abc126-d91057f3
kind: decision
by: ba-pm
at: 2026-10-10T09:13:20Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ABC-126
  - ABC-127
  - ABC-083
  - ABC-084
  - ADR-0033
  - ADR-0028
  - NFR-002
  - NFR-001
  - N8-LANE
  - plans/tickets/ABC-010-fen-semantic-validation.md
  - plans/tickets/ABC-126-hanging-corpus-pair-starts-in-check.md
  - plans/traceability.md
  - .grugops/context/design-abc010/notes/20261010T085828Z-architect-design-decision-abc010-check-via-moves-ts-grammar-only-entry-criterion9-to-bapm-98a03297.md
  - 20261010T091320Z-ba-pm-observation-abc010-recut-scan-oracle-engine-readings-ecbeb0c2
supersedes:
---

# `ABC-010` re-cut: criterion 9 re-worded as (a)–(f), fence 15 files, `M`/`P2`; the two corpus rows fold into `ABC-126` (`XS` → `S`). `ABC-010` DoR 8/10, stays in `Backlog`; `ABC-126` 10/10, stays `Ready`

This note is hand-authored and unsealed (degraded posture, `AGENTS.md`). Task `wave-2026-09-25`, subtask
`recut-abc010`, branch `grugops/recut-abc010` from `980890f`. The authority is `ADR-0033`, which is
**proposed**. I cut against it and did not edit it. The readings are in `…ecbeb0c2`.

## R1 — Criterion 9: I adopted the Architect's text and made each clause checkable

His five clauses are kept. I changed three things.

- **(a) names the one `ABC-001` exception.** `fen.test.ts:29` is re-authored to the after-`1.e4` FEN,
  not exempted. "Every `ABC-001` case parses" is then true as written.
- **(b) "parse through `parseFenGrammarOnly`" becomes a diff test.** In each of the six files, every
  changed line belongs to an import statement, and the tests pass unedited. QE can check this from
  `git diff -U0`. The bare "parses through" is not observable.
- **(d) "every other fixture parses through `parseFen`" becomes an attributable scan with a stop rule.**
  The Architect's scan cannot do this at the tip, because it counts tip rejections under
  "grammar-rejected" and names no file (`…ecbeb0c2` §2). `probe/fen-scan.mjs` prints `file:line` and a
  per-file count. The allowed files are listed, along with the two pre-existing empty-board literals.
  **Stop rule:** a rejection anywhere else is reported, not re-authored, and the fence does not grow at
  build. This is the guard against `ABC-127`'s rows, later merges, and FENs built at run time. The
  Architect left those as `UNKNOWN - verify` at the build hop.

I added two clauses. **(e)** makes the guard row red first, because a guard nobody has seen go red is
not one. **(f)** names three deep lanes:
- `SEARCH_DEEP` for quiescence, because its file is in the fence;
- `ZOBRIST_DEEP`, for the same reason;
- `PUZZLE_DEEP`, because the suite parses the corpus. The baseline file stays untouched.

I left out `ENGINE_DEEP` (5 min) and the PVS/LMR deep lane (15 min). Their files are not in the fence,
and their FEN literals are inside 9(d)'s scan.

## R2 — Size `M` holds, the fence is 15 files, and the order is fixed

- **Files, measured at `980890f`.** The reject list is identical to `6ade041`. The fence:
  - production: `fen.ts`;
  - `fen.test.ts`;
  - 6 import swaps;
  - 7 files that are re-authored or assert a rejection.

  It is 15, not 16, because `puzzle-corpus.ts` left with R3. The `memory-bank/30-architecture.md` row
  is owed when the code lands.
- **Why it is still `M`.** The count measures breadth, not risk. The production change is about 60
  lines in one module. Six files take a one-line swap, measured green. That leaves 9 fixtures in 8
  files, and of those, 2 have measured replacements and 2 only flip an assertion. No module and no
  design question remain. Not `L`: 9(d)'s stop rule bounds the churn. The cut-time (a)/(b) split was
  insurance against a new module, and none came. The corpus rows were the separable piece, and they
  went to `ABC-126`.
- **Priority stays `P2`.** No FEN input exists, and the trigger back to `P1` is unchanged.
- **Order:** `ABC-127` (In Development) → `ABC-126` → `ABC-010`, on `src/puzzle-corpus.ts`.
  - `ABC-126` → `ABC-010` on `src/quiescence.test.ts` too. `ABC-126` edits `:269`; `ABC-010` edits
    `:327`, the runaway rig.
  - `ABC-083` and `ABC-010` must never run in parallel, because both touch `quiescence.test.ts`.
    Neither blocks the other. When both can be pulled, `ABC-083` (`P1`) goes first, and the second one
    rebases.
  - Both are owner-gated today: `ABC-083` on `ADR-0031`, `ABC-010` on `ADR-0033`.

## R3 — The two corpus rows fold into `ABC-126`, and no new ticket is cut

**I chose to fold rather than cut a separate `XS` (`ABC-128`).**
- **Same file, same class, same instruments.** Both are a corpus row that breaks a rule the corpus
  claims to keep. The fold uses the same three-file fence (`A5`), the same `PUZZLE_DEEP` reading
  (`A4`), the same baseline rule and one QE hop.
- **A separate ticket costs a third serialized hop** on the most contended file in the wave
  (`ABC-127` → `ABC-126` → `ABC-128` → `ABC-010`). That buys one more QE hop and lane run for two FEN
  edits.
- **The cost of folding is coupling, and it is small.** `ABC-010` now also waits on the pair's re-find
  and its quiescence margins (`A3`). That re-find has a measured candidate. `ABC-010` is owner-gated on
  `ADR-0033` anyway, and both tickets are `P2`.
- **What changed on `ABC-126`.** New `A7`. `A2` gains a rules check, so the re-found pair passes
  `ADR-0033` too. `A4` and `A6` no longer hard-code 40/40: `ABC-127` re-records the baseline
  (58/62 at its in-flight `47433c5`). `XS` → `S`, `P2` unchanged. DoR 10/10, page stays `Ready`.

**How the answers are proven.** `ABC-084` `A6`'s rule holds: the answer is never the engine's output.
Each re-authored row's `accept` is exactly the material oracle's strictly-best set, and its `source`
gain is the oracle's.
- If `ABC-127` is on the base, its `A2` `PUZZLE_DEEP` row re-proves all six win-material sets,
  these two included.
- If it is not, the `ABC-084` probe reading goes in the PR note.

**How the baseline may move: it does not.** Option B's rules are: own commit, stated reason, no
trigger-list file; a raise is QE's; a lowering is the owner's word.
- The fold keeps `total` (rows are replaced, not added or dropped).
- It keeps both names, so the baseline's `unsolved` names and `ABC-127`'s per-row lines keep their
  keys.
- It requires the shipped engine to solve each replacement at the baseline's config. A replacement
  that the engine misses is re-found, not kept. That is `ADR-0028` decision 2's fixture rule; it is
  not a reason to lower the count.

So the baseline file is not touched in `ABC-126`'s commits. Both measured candidates are solved
(`…ecbeb0c2` §3). One consequence is recorded on the page: the "discovered check" candidate gains +4,
not +6, and its `source` string changes to match.

## DoR

- **`ABC-010`: 8/10, two ⚠️, stays in `Backlog`.**
  - **Item 3:** not independent until `ABC-126` merges. Owner: the Orchestrator, sequencing.
  - **Item 10:** `ADR-0033` is `proposed`, and the build waits for the owner's acceptance. Owner:
    Olger Oeselg.

  Both release with no BA/PM work. When they do, the pull goes straight to `Ready for Dev`, because
  the design hop is done.
- **`ABC-126`: 10/10, stays `Ready`.**

## Fences kept, and what I noticed but did not touch

- **Not touched:** `src/`, `plans/board.md`, every ADR, and `ABC-127`'s page. `ABC-127` was read only
  through `git show`.
- **For the Orchestrator:** the board row titles for `ABC-126` (size `XS` → `S`, scope) and `ABC-010`
  (8/10, two ⚠️, `ABC-126` predecessor) are yours to sync.
- **`ABC-010` page length:** 346 lines, up from 323. It sits above the 300-line process budget
  (`AGENTS.md` rule 2). The growth is criterion 9 and the fence, and the measurements went to this
  note. I report it rather than cut acceptance text.
- **Stale text on `ABC-083`, not my page this hop:**
  - its `A10` says the puzzle suite "reads 40/40", and that goes stale when `ABC-127` merges;
  - its Dependencies says `ABC-126` is `XS`.

  Owner: BA/PM at `ABC-083`'s next re-score. It is owner-gated on `ADR-0031` now, so there is no
  urgency.
