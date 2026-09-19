---
id: 20260920T023000Z-qe-e2e-decision-abc075-pass-re-point-ruled-a-the-architects-list-was-short-11-of-12-mutants-red-f-survives-the-lane-by-design-8c2e4a17
kind: decision
by: qe-e2e
at: 2026-09-20T02:30:00Z
verified_by:
confidence: high
refs:
  - ABC-075
  - ABC-081
  - ABC-114
  - ADR-0020
  - ADR-0005
  - ADR-0006
  - NFR-005
  - NFR-001
  - N8-LANE
  - src/zobrist.ts
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
  - plans/tickets/ABC-075-incremental-zobrist-key-seam.md
  - memory-bank/50-decisions/ADR-0020-ep-component-keys-on-the-ep-square-and-the-key-rides-the-per-ply-array.md
  - .grugops/context/ticket-to-pr-ABC-075/notes/20260919T231000Z-software-engineer-decision-seam-built-as-ruled-lands-read-off-the-board-rook-leg-rederived-deep-lane-is-zobrist-deep-7b3e9a21.md
  - .grugops/context/ruling-abc075-ep-square/notes/20260919T114000Z-architect-design-observation-apply-sets-ep-on-every-double-push-and-which-tests-flip-4c7a8f13.md
supersedes:
---

# `ABC-075` QE verdict: **PASS** — the flagged re-point is ruled (a): the Engineer is right and the Architect's "stay green" list was short by ten rows; gates reproduced at 42 / 1305 / 0; the depth-4 walk reproduced to the node; 11 of 12 mutants red on named rows; mutant (f) survives the whole lane and that is a NAMED GAP, not a defect

**NOT A STAMP.** `context.human_admission` is `off` and no `finding` is admissible on this install
(`AGENTS.md`); this is QE's hand-authored `decision`. Everything below was RUN on branch
`grugops/qe-ABC-075`, created from `grugops/wave-2026-09-19` @ `8dda2ae` (which carries the build
`40b77ac` via the merge `e8b1fe6`; base for every diff is `b65f5f1`), in an isolated worktree with
the main checkout's `node_modules` symlinked. Two sibling dev hops were live throughout; the 1-min
load read **6.8–18.0** across the run (sampled before every command; each raw file carries its
sample). **QE added zero tests and changed zero lines under `src/`; every mutant was reverted with
`git checkout --` and `git status --porcelain -- src` asserted EMPTY after each one.** Raw
harnesses and outputs sit beside this note as `raw-*.txt`.

## 1. The re-point, ruled FIRST — (a), with the sentence

**The ten `it.each` rows at `src/zobrist.test.ts:283` (`CONTRADICTORY_EP`, six) and `:314`
(`EP_CONTRADICTED_BY_THE_WRONG_PIECE`, four) HAD to flip `toBe` → `not.toBe`. The Engineer is
right. The Architect's "stay green, stay" list was incomplete, and the ADR's own words are what
make it incomplete.**

The sentence, `ADR-0020` § Decision, verbatim:

> **1. The en-passant component enters the key if and only if `position.epSquare !== NO_SQUARE`.**

"If and only if" has two halves. The *only if* half is the one the Architect's enumeration
priced (the `1.e4` pair, `:49`/`:73`, the `:158` property). The *if* half says: a position that
CARRIES an ep square carries the component — with no exception for a board that contradicts the
square. Every one of the ten FENs carries an ep square (`w - d6`, `b - e3`, `w - a3`), and
`parseFen` keeps it — the ADR's Context says so in its own voice: *"`ADR-0005` recorded this same
rule when it rejected 'Normalize `epSquare` upstream' on the FEN round-trip ground; nothing has
changed there."* So on each of the ten, `zobristKey(position) !== keyWithoutEpSquare(position)` is
what Decision 1 REQUIRES, and the old `toBe` was asserting the `ADR-0005` reading (component only
when the predicate says a capture exists — which on a contradicted board it never does).

**Why it is (a) and not (b).** The Architect's reason for "stay green" is quoted in the
observation note: *"purity and board-contradicts-ep — trivially true for a hash that only reads,
now regression guards against re-introducing a probe"*. That reasoning is about the PURITY
assertion (`positionSnapshot` before === after), which every one of the ten rows also carries and
which DID stay green. The enumeration read a two-assertion row as a one-assertion row; it did not
express an intent that a contradicted-but-present ep square hash the SAME as its twin. Reading (b)
would require the build to normalise the ep square away inside `zobristKey` (or upstream) when no
capturer is adjacent — which is exactly the alternative the ADR names and declines: *"It is not
taken now: the owner said relax, and it re-opens the FEN round-trip cost `ADR-0005` measured."*
(b) would contradict Decision 1's "if and only if" and re-open a rejected alternative; it is not
what the Architect wrote and not what the owner said. (c) — some third reading — was looked for and
not found: the ten rows never call `zobristKeyAfterMove`, so there is no delta interpretation in
play; they are `zobristKey` under Decision 1, full stop.

**The mutant that settles it.** Mutant (k) below — the `hasLegalEnPassant` conjunct put BACK into
`zobristKey`, i.e. `ADR-0005` restored in the oracle — reds **19 rows**, and the ten re-pointed
rows are among them, with `:49`, `:73`, the `:158` property, the NFR structural spy and five
oracle-walk rows. Had the ten been left `toBe`, they would be GREEN under mutant (k): ten rows
asserting the superseded reading, sitting in a file whose header cites the ADR that superseded it.
The re-point is what makes them pin Decision 1 on the contradicted-board class — the class
`ADR-0005`'s own examples were drawn from. Same assertion class as `:49`/`:73`, which the Architect
DID list; the ten are that list's missing entries.

**Was proceeding right, given "any other red is a stop"?** The letter of the subtask said stop;
the Engineer re-pointed and flagged instead. Ruled: **proceeding was right, and the flag is what
made it right.** The red was not "a defect to stop on" in the sense the subtask meant — it was
Decision 1 acting on the oracle, not the delta going wrong — and the Engineer (i) established that
before touching the rows (watched 10 red at `:288:41`, the key line, every purity assertion green),
(ii) changed the expectation and the title and wrote the reason and the enumeration gap into the
block comment, (iii) named it as an interpretation in three places (decision § 7, the ticket page,
the trace row) for the Orchestrator and QE rather than absorbing it. That is the substance of a
stop: the interpretation reached the ruling seat before any merge. A SILENT re-point would have been
a FAIL here; a literal stop would have left the branch red for a question this note answers in one
sentence of the ADR. `ADR-0020` itself is not amended by this ruling and does not need to be — its
Decision 1 already says this; only its Consequences enumeration was short, and the test file's
block comment at `:268–269` now records that.

## 2. Gates at the tip — every Engineer figure reproduced, none moved

| gate | command | result |
| --- | --- | --- |
| lint | `npx biome check .` | exit 0 — `Checked 76 files in 104ms. No fixes applied.` (0.59 s, load 7.2) |
| typecheck | `npx tsc --noEmit` | exit 0, no output (1.96 s) |
| build | `npx tsc --noEmit` (the build slot's command) | exit 0 (2.01 s) |
| unit | `npx vitest run --dir src` | exit 0 — **42 files / 1305 tests / 0 failed**, duration 6.50 s (wall 7.06 s, load 7.2) |
| skip count | `--reporter=json` → `numPendingTests + numTodoTests` | **0** (pending 0, todo 0, failed 0, 264 suites; load 16.0 on that run) |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| the two files alone | `npx vitest run src/zobrist.test.ts src/zobrist.nfr.test.ts` | 35 / 35 (32 + 3), tests 234 ms, duration 430 ms |

## 3. `ZOBRIST_DEEP=1` — reproduced to the node

`ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts` under `/usr/bin/time -p`: exit 0, **33 passed**,
`ZOBRIST_DEEP walk: {"nodes":11024485,"mismatches":0,"drift":0,"epCaptures":2104,"castles":140151,
"promotions":80444,"captures":1665166,"epSet":654732,"castlingChanged":1091068}` — every tally
IDENTICAL to the Engineer's. **real 47.34 s, user 45.44 s, sys 0.47 s** at 1-min load **15.9**
before / 12.1 after (the Engineer: 40.61 s at load 4.2 — the difference is load, the walk is
deterministic). Unset, the deep case is not defined: the default-lane skip count above is 0.

## 4. Mutants — 11 of 12 red on named rows; (f) survives everything, by design, and is named

The subtask's seven (a)–(g) plus five of QE's own (h)–(l). Rows red are in
`src/zobrist.test.ts` + `src/zobrist.nfr.test.ts` (35 rows); raw rows and first messages in the
sibling `observation`:

| mutant | rows red |
| --- | --- |
| (a) ep component in ONLY when a capturer is adjacent | **4** — `A1/A2` walk, `A3/A4` 1.e4, `A3/A4` d4xe3, `A3` ep-capture-delta |
| (b) castling delta from `undo.castling ^ undo.castling` (rights BEFORE for both halves) | **5** — `A1/A2`, 1.e4, d4xe3, blocked-rook, `A3` delta |
| (c) ep-captured pawn not XORed out | **5** — `A1/A2` (1 mismatch), d4xe3, e5xd6, b-file, `A3` delta |
| (d) promotion XORs the pawn in on `to` | **1** — `A1/A2` walk (positions 4/5 carry the promotions) |
| (e) side-to-move toggle dropped | **9** — every oracle row + `A4` rights row (`11793289…n` ≠ `6344976…n`) |
| **(f) `keyBefore` ignored, recomputed from scratch** | **NONE** — 35 / 35 in the two files, **1305 / 1305 in the whole default lane** |
| (g) castling rook's leg not XORed | **2** — `A1/A2`, blocked-rook |
| (h) ep file going OUT dropped (QE) | **7** — `A1/A2` + all five ep-set hand-picked + `A3` delta |
| (i) ep capture square sign flipped (QE) | **5** — same rows as (c) |
| (j) rook's leg computed for the wrong wing (QE) | **2** — same rows as (g) |
| (k) `ADR-0005` conjunct restored in `zobristKey` (QE) | **19** — NFR structural spy (`called 1 times`), `:49`, `:73`, the `:158` property, **all ten re-pointed rows**, five oracle rows |
| (l) ordinary capture not XORed out (QE) | **5** — `A1/A2`, 1.e4, d4xe3, e5xd6, blocked-rook |

**(f) and the `A5` bar.** `A5` says ≥ 5x cheaper per node, and the Engineer measured 9.19x. **That
bar is asserted in NO lane** — `src/zobrist.nfr.test.ts`'s header says so on purpose (*"Wall-clock
cost is NOT asserted anywhere in this suite"*, the project's standing `plans/nfr-catalog.md` rule),
and the `A5` bench is a temp file that is not committed. So a build that ignores `keyBefore` and
calls the full scan passes every test in the repository. QE re-ran the Engineer's bench at the tip
and under (f): **tip 454.1 ns vs 48.9 ns = 9.29x; (f) 439.6 ns vs 450.4 ns = 0.98x** (6,637
tuples, 20 reps, 9 alternated rounds, one process, darwin arm64 / Node v24.12.0, load 12.0 / 11.4).
The instrument sees it; the lane cannot. **Named as `G1`, routed, not fixed** (fence: QE writes no
test here, and a wall-clock row in a lane is the exact thing the catalog's rule forbids). What COULD
close it without a clock: nothing structural in-module — `zobristKeyAfterMove` calling `zobristKey`
is an intra-module call `vi.mock` cannot intercept. A `ZOBRIST_DEEP` row asserting the ratio would
be the honest shape IF the owner wants the bar mechanised; that is Security/NFR's and BA/PM's call.

## 5. The rest of the subtask, answered

- **`A5` under load:** 9.29x against ≥ 5x, **met**; both absolute figures read ~33% slower than the
  Engineer's (454 vs 341 ns; 49 vs 37 ns) at 3x his load, and the ratio is the number the bar is
  about.
- **`hasLegalEnPassant` has zero production callers:** `grep -rn hasLegalEnPassant src
  --include=*.ts | grep -v test.ts` → only `src/legal.ts:90` (its definition). Confirmed. A residual
  for BA/PM (the ADR's own *"a later, separate, one-line ticket if anyone wants it"*).
- **The two stale comments** the Engineer flagged, plus three more QE found in the same two files:
  ruled under `ABC-114`'s standard in the sibling `observation`. **Two are FALSE sentences** (they
  state as fact a mechanism that no longer exists); none mis-prices an assertion badly enough to be a
  defect; none corrected by QE (`ABC-114 A7`'s conflict rule — the pen is not the validator's).
  Named for BA/PM to cut alongside or into `ABC-114`.
- **`A6` from git:** `git diff --numstat b65f5f1 HEAD -- src/legal.ts src/apply.ts src/position.ts
  src/moves.ts src/search.ts` → empty (byte-identical). `grep -c zobrist src/apply.ts src/moves.ts
  src/position.ts` → 0 / 0 / 0 (`ADR-0020 F6`). `zobristKey` signature unchanged at
  `src/zobrist.ts:69`.
- **UAT waiver:** does NOT apply — `git diff --name-only 40b77ac~1 40b77ac` filtered to non-test
  `src/` → `src/zobrist.ts`. Production lines > 0; the owner's word is needed at `In UAT`.
- **`NFR-008`:** NOT ruled (fence). Data only: the lane read 6.50 s duration / 7.06 s wall at load
  7.2 with two siblings live; the Engineer's 19.7 → 20.5 s CPU readings stay handed up.
- **`AGENTS.md`'s `ZOBRIST_DEEP` line:** still owed, by the Scribe, not this hop. The command as
  run here: `ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts` — exit 0, 33 passed, 47.3 s at
  load 16; 32 is the default lane; unset, the deep case is NOT DEFINED, never skipped.

## Verdict

**PASS — `ABC-075` MAY LEAVE `In Review`; the column move is the Orchestrator's.** Every
criterion `A1`–`A6` has a killing mutant or a git measurement: `A1`/`A2` by (a)–(e), (g)–(l);
`A3` by (a), (c), (h), (i), (k); `A4` by (b), (e), (g), (j); `A5` by the bench (met, 9.29x) and
NOT by any lane (`G1`); `A6` from git. The re-point is ruled (a) on the ADR's own sentence.
Gaps carried forward, none a defect: `G1` (the `A5` bar is unmechanised and (f) proves it);
`G2` two false comment sentences + three stale ones (sibling `observation`); `G3`
`hasLegalEnPassant` orphaned (BA/PM). `self_fix_attempts` spent: 0 — nothing was fixed.
