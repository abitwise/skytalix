---
id: 20260817T235500Z-qe-e2e-decision-verdict-pass-with-findings-eight-gaps-4b7c19ae
kind: decision
by: qe-e2e
at: 2026-08-17T23:55:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - ADR-0004
  - src/san.ts
  - src/san.parse.test.ts
supersedes:
---

# VERDICT — `PASS WITH FINDINGS`. 8 gaps: 0 high, 3 medium, 5 low. `In Review` may be exited.

The mandatory QE hop `AGENTS.md` § QE validation authority requires for `ABC-032`. Branch
`grugops/abc032-parse-san` @ `da69986`, base `main` @ `bf371d7`. Every figure below was read from a
run in this worktree; nothing is transcribed from the engineer's notes without being re-run.

**All seven acceptance criteria are MET on the evidence I produced myself**
(`…-observation-a1-a7-independently-re-verified-…`). No criterion is unmet, no legal SAN string
resolves to the wrong move, and `ADR-0004` (2b) move provenance holds everywhere I could reach it.
**Nothing here blocks the merge.**

**No gap is high.** Five of the eight are guards that could not fail — found by mutating
`src/san.ts` and watching the suite stay green — and all five are now closed by rows I added, each
confirmed RED against its mutant and GREEN after revert. Three are behaviours outside the ticket's
closed tolerance list that no criterion can see; they are pinned as characterization rows and the
ruling on them belongs to BA/PM, not to me.

## The eight gaps, with severity

| # | gap | severity | state |
|---|---|---|---|
| `G1` | **`A7` cannot see a second table spelled as a REGEX literal.** `PIECE_MOVE` rebuilt as the literal `/^([NBRQK])([a-h]?)([1-8]?)(x?)([a-h][1-8])$/`, and the castle branch rebuilt as `/^O-O(-O)?$/`, each introduce a second spelling of the one table and **both survived the entire delivered suite**. `A7`'s counter counts double-quoted string literals only, and a regex literal is the shape this module's own style reaches for first (`CHECK_SUFFIX` is one). | **medium** — this is the ONE criterion whose whole job is to catch this | CLOSED by two rows that scan the comment-stripped code |
| `G2` | **The capture marker `x` was unasserted on the piece path.** Deleting `(move.captured !== EMPTY) === (capture === "x")` left the suite green. `A2` asserts `Bxf7` and `Bxf7+`; the negatives (`Bf7` for a capture, `Nxg5` for a quiet move) were never asserted, and `A1` cannot see it by construction. | **medium** | CLOSED |
| `G3` | **A pawn's capture form was unasserted.** Deleting `(move.captured !== EMPTY) === (originFile !== undefined)` left the suite green, and under that mutant a bare `d5` resolves to the CAPTURE `exd5` — a move the player did not type. | **medium** | CLOSED |
| `G4` | **`text.trim()` has no assertion.** Removing it left the suite green. It is the undisclosed third tolerance, added for seam consistency with `parseCoordinateMove`; unasserted, the next edit can remove it and the two readers `ABC-033` dispatches to would silently disagree about a trailing space. | **low** | CLOSED (and the tolerance is ACCEPTED — see the four-disclosures note) |
| `G5` | **A REDUNDANT qualifier is accepted.** `Nfg5`, `N3g5` and `Nf3g5` all resolve to the same move as `Ng5` — strings `toSan` never emits. A fourth input tolerance, not in the ticket's closed list and **not disclosed**. Benign (a wrong origin, `Ne4g5`, is still refused) and arguably standard long-algebraic reading. | **low** | PINNED as characterization; the ruling is BA/PM's |
| `G6` | **MIXED castle spellings are accepted** — `O-0` and `0-O`, from `replaceAll("0", "O")`. A fifth tolerance, not in the closed list and not disclosed. Case is still meaning: `o-o` is refused. | **low** | PINNED as characterization |
| `G7` | **`e8=K` is coded `no-such-move`, not `unreadable`.** Promotion to a king is not well-formed SAN, so the floor's own words put it on the `unreadable` side; it lands on the other because the promotion letter class is derived from the one table, which contains `K`. Same root cause as the castle price the engineer disclosed. `A5` is still MET — the two codes stay independently reachable. | **low** | PINNED; matters to `ABC-034`, which writes the wording |
| `G8` | **The `A4` FEN defect is now on its SECOND ticket** (`ABC-031` `A2`, then `ABC-032` `A4` — the same string `8/4P3/8/8/8/8/4k3/4K3 w - - 0 1`). Two tickets have now paid to discover and pin the same bad line. The page is not mine to edit; a fix at the source is what stops the third. | **low** (process, not code) | ESCALATED to BA/PM |

## What this verdict does not cover

- **`N8-LANE` is NOT measured by this hop and is NOT claimed.** The engineer's own note records his
  measurement as inadmissible under the bar's identity-null-control clause, and I did not re-run it.
  Security/NFR owns it. My rows add **zero** test files, so the lane cost of this hop is nil.
- **`A1` and `A7` are load-bearing but not complete**, and the exact edges are in
  `…-observation-what-a1-and-a7-can-and-cannot-see-…`. A reader who takes "`A1` MET" as "the grammar
  is right" has over-read it.
- **QE is not UAT.** This verdict is an agent's test result. It is not the owner's acceptance and
  carries no stamp (`context.human_admission` is `off`; no `finding` is admissible here).

## Board move I am recommending, not making

`ABC-032` may leave `In Review`. `plans/board.md` is the Orchestrator's and I did not touch it; the
merge is the Orchestrator's and I did not perform it. `main` was not touched by this hop.
