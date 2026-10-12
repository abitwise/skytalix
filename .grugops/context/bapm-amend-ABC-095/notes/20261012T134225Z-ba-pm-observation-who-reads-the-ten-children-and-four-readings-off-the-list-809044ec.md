---
id: 20261012T134225Z-ba-pm-observation-who-reads-the-ten-children-and-four-readings-off-the-list-809044ec
kind: observation
by: ba-pm
task: bapm-amend-ABC-095
at: 2026-10-12T13:42:25Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-119
  - ABC-043
  - ABC-044
  - ABC-045
  - ABC-046
  - ABC-042
  - ABC-064
  - ADR-0037
  - ADR-0036
  - ADR-0015
  - src/cli.test.ts
  - src/cli.real-engine.test.ts
  - 20261012T132000Z-architect-design-decision-wiring-rulings-r1-r3-and-amendments-a4fe3027
  - 20261012T133500Z-security-nfr-decision-s1-s2-ruled-r1-stands-s3-checklist-a096cf43
  - 20261012T125300Z-software-engineer-observation-wiring-reds-merged-criteria-ef39c9a6
supersedes:
---

# Who reads the 10 re-targeted children, and four things the amendment lists did not say

This note is hand-authored and unsealed. Everything was read at `main` `85e9d5cc`, and the SE's notes
through `git show grugops/ABC-095-book-before-engine:…`. No test was run, and no timing was read.

## 1. The `describe` blocks in `src/cli.test.ts` that read the 10 children

The command was an `awk` pass that pairs each `CHILDREN.<name>` use with its enclosing top-level
`describe(`, first use per block:

| block (line) | children read |
|---|---|
| `ABC-042 — the resolved colour reaches the board` (:1130) | `black`, `random` |
| `ABC-064 — the frame's shape and the status panel…` (:2474) | `black`, `random` (and `random` at :2607) |
| `ABC-043 — the live session` (:2623) | `mate`, `engineThrows`, `engineForeign`, `colourBlack`, `colourWhite` |
| `ABC-044 — the result screen reaches the player` (:3025) | `mate` (`A6`, :3047) and `engineThrows`/`engineForeign` (`A3`, :3110) |
| `ABC-045 — resign reaches the screen as reason 8` (:3121) | `resigns` |
| `ABC-046 — quit and new through the delivered entry point` (:3158) | `quits`, `renews` |

## 2. Four readings that differ from the amendment lists or add to them

1. **`ABC-044` `A6` also reads a re-targeted child (`mate`).** The Architect's list names `ABC-044` `A3`
   only. `A6`'s Given is "a scripted game driven to checkmate", which stipulates the scripted opponent,
   so (N) holds. I confirmed it on the page next to `A3`.
2. **`ABC-064`'s rows read `black` and `random`.** That page is outside this hop's fence, so it is not
   edited. QE's 2026-08-19 reading (`quality-gate-ABC-043-qe-2026-08-19/notes/…f4a5b6c7`) is that every
   one of those rows reads the **first frame**, which is rendered before anything acts. So the opponent
   is not an input to any of them, which is the same reason the Architect gives for `ABC-042`'s colour
   children. No amendment is needed. It is recorded so that QE does not find it cold.
3. **The "does not need to edit `src/cli.test.ts`" sentence** that the Architect places in
   "§ Re-score — 2026-10-12, Overlaps" is in the **2026-10-10** re-score's "Overlaps" bullet
   (`ABC-095` page, the `ABC-138` sentence). The 2026-10-12 section has "File overlaps", and that does not
   carry the claim. I struck it where it is.
4. **The `ABC-119` default-lane row needs the copy built in the default lane.** The Architect: "its entry
   path moves to the copy, and the byte-identity check joins it". Security/NFR: "`A1`'s Given **and its
   default-lane row** require a REAL copy". The row checks those properties and spawns nothing, so it has
   to build the copy (`mkdtemp`, then copy, check and `rmSync`) in the default lane. That is a filesystem
   write in the default lane. `ABC-041` (c) admits it inside a temp dir (S3 item 8). It is a cost the
   Architect's `NFR-008` line did not name, so I added it to `ABC-095`'s `NFR-008` bullet as a second
   `UNKNOWN - verify` on the same `N8-LANE` line. **The other reading** keeps the default-lane row static
   and builds the copy only under `CLI_DEEP`. It contradicts both rulings' words, and I did not take it.

## 3. Two (N1) admissions that rest on a test note, not on a Given

`ABC-043` `A7` (`colourBlack`, `colourWhite`) and `ABC-046` `A2`/`A3`/`A6` (`quits`, `renews`) have
Givens that do not stipulate a constructed engine. Their doubles were admitted on `ABC-043`
`## Test notes` 8 (no default-lane row runs the real search). The rig header in `src/cli.test.ts`
(:592) names `A7`'s double. It does not name `resigns`, `quits` or `renews`, whose doubles are described
at their own child definitions (:818-850). `ABC-043`'s (N) table never tabulated `A7`. The re-target moves the module and
not the seam, so it changes nothing about that admission. I recorded this on both pages and did not
re-open it.

## 4. Page state, not edited

- `ABC-095`'s front matter still reads `status: backlog`, `column: Backlog`. The board has it
  `In Development` since the owner's word (2026-10-12). The column is the Orchestrator's, so I changed
  only `size:` (S → M).
- Line counts after this hop:
  - `ABC-095`: 380 → 513;
  - `ABC-119`: 362 → 429;
  - `ABC-043`: 507 → 542;
  - `ABC-044`: 216 → 232;
  - `ABC-045`: 272 → 286;
  - `ABC-046`: 587 → 603.

  `ABC-095` is over the 300-line process-rule-2 median target, which is about new cuts. Most of the
  page is dated history from five re-scores.
