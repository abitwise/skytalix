---
id: 20260811T202000Z-software-engineer-artifact-ref-9c40b1e7
kind: artifact-ref
by: software-engineer
at: 2026-08-11T20:20:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - EPIC-002
  - A2
  - A5
  - A6
  - A7
  - A9
  - A13
  - plans/board.md
supersedes:
---

# What this hop wrote, what it deliberately did not, and the board move it REQUESTS

> **Hand-authored** — see this hop's `decision` note for why. **Nothing here is a `finding`, and the
> gate table in the `observation` note is an OBSERVATION, not a gate verdict.** No `§14-gate#<id>`
> is self-attested and none should be inferred from a green row.

## Branch and files

Worktree `../cli-chess-ABC-016`, branch `grugops/ABC-016-status-panel`.

| path | change |
|---|---|
| `src/status-panel.test.ts` | 2 new `CASES` entries + their fixture constants; `A2` gains the check-plus-claim block; `A5` gains `Nexd4` and the `Nxd4` negative; `A6` gains 3 table rows; `A7` **rewritten** to sweep `CASES` in both thinking states; `A9` gains the forged-status case; the stale `A7` rationale and the now-orphaned `widestOf` helper removed |
| `src/status-panel.nfr.test.ts` | both counting clauses to **≥ 2 plies**; the difference baseline gets its own 3-ply replay with mocks cleared immediately before it; `expect(sanAlone).toBeGreaterThan(0)`; `occupiedIn` derives the anchor's piece count; the `:134-139` comment **rewritten** and the `src/san.ts:101` cite corrected to **`:104`**; one retained test (see the `claim` note) |
| `src/status-panel.ts` | **the `THINKING` doc comment only — zero production lines**, mechanically checked: every changed line in the diff is a comment line |
| `src/__snapshots__/status-panel.test.ts.snap` | **+12 lines, −0** — the two new entries; the fifteen existing snapshots byte-identical |
| `.grugops/context/ticket-to-pr-ABC-016-qegaps/notes/` | four hand-authored notes: `decision`, `observation`, `claim`, this `artifact-ref` |
| `.grugops/queue/claimed/ticket-to-pr-ABC-016-qegaps/` | the Workflow 17 claim, its `claim.md` registry record, and the subtask moved `pending/` → `claimed/` |

**The `claimed/` parent directory did not exist**, exactly as BA/PM recorded — the atomic `mkdir` of
the task directory would have returned `ENOENT`, which Workflow 17 step 2 calls a genuine failure and
never a lost claim. The parent was created first, then the **task directory itself** by a single
atomic `mkdir`, which is the operation the claim consists of. `scripts/claim.js` does not exist here;
the protocol was executed by hand and is disclosed rather than implied.

## The 6-item work list, item by item

| # | BA/PM's item | done |
|---|---|---|
| 1 | two new `CASES` entries, both with snapshots | ✅ `in check and fifty-move claimable`, `disambiguated last move` |
| 2 | `A2` check-plus-claim; `A5` `Nexd4` + negative; `A6` **three** rows; `A9` forged status | ✅ all four |
| 3 | `A7` rewritten over `CASES` in both states; widest-row assertion **and** its `:263-265` comment removed | ✅ |
| 4 | `A13` both clauses ≥ 2 ply; 3-ply baseline; `> 0` line; `:134-139` comment rewritten; `:101` → `:104` | ✅ |
| 5 | `src/status-panel.ts:95-101` comment; **comment only, no code** | ✅ |
| 6 | regenerate snapshots | ✅ +2, no existing entry moved |

**Everything went green on the first run, on the delivered panel, exactly as BA/PM measured it
would.** The ruling was right and the code needed nothing.

## Is EVERY criterion now met? YES — stated plainly

**`A1`–`A14` are all met, and the five that this amendment rewrote are met by assertions that were
each run against a wrong build at this hop** (the kill table is in the `observation` note). `A7`,
`A6`, `A5`, `A2`, `A9` and `A13` each now fail on the build they were written to catch — which is
the property `G1`–`G7` said they lacked, and it is measured rather than asserted. `A14` is unmoved:
no production line changed, so QE's 0.40x / 1.78x still stands and no new timing was taken.

## NOT written, each for a stated reason

- **`plans/board.md`** — the Orchestrator's. The move is requested below.
- **`plans/tickets/ABC-016-status-panel.md`** — BA/PM's. **One under-specified edge is FLAGGED in
  this hop's `claim` note and was NOT amended**, per the brief's stop condition.
- **`plans/traceability.md`** — `ABC-016`'s row exists; its `Status` moves with the board move,
  which is not mine to make. Editing it to stand in for a move I did not make would be a faked
  trace. No row is owed: no ticket was created, split or re-scoped.
- **`src/turn-loop.*` and `src/frame.*`** — untouched. An Engineer is live on `ABC-027` (which owns
  `src/frame.ts` and `src/frame.test.ts`) and a BA/PM on `ABC-019`. **No channel to either was
  opened**; the on-disk shared context is the only channel and these four notes are all of it.
- **A constant-frame-width criterion or assertion** — none added anywhere. `ADR-0010` cl. 5 refuses
  one and the replacement `A7` is not one.
- **`memory-bank/50-decisions/`, `plans/nfr-catalog.md`** — not re-opened; nothing in this hop moves
  an accepted ADR or an NFR row.
- **Nothing merged, nothing deployed, nothing pushed, no `git checkout main`.**

## The board move REQUESTED — `In Development` → `In Review`

`In Development` **2/3 → 1/3**, `In Review` **1/3 → 2/3**. Forward, and the reason is narrow: **the
closes are written and they run.** The three backward moves this ticket made were each for an
unwritten fixture; that condition is discharged — every criterion the amendment added now has an
assertion behind it, and each was measured to kill.

Suggested row text for the Orchestrator (its wording, not mine):

> **SEVEN QE CRITERION GAPS CLOSED, TEST-ONLY, `In Development` → `In Review` 2026-08-11.** BA/PM's
> two replacements taken as ruled: **`A7`'s widest-row clause is gone**, replaced by a sweep of
> `CASES` in both thinking states asserting that blanking `thinking...` to same-length spaces yields
> a panel byte-identical to the idle one — **it names no row index and no frame-level term**, and it
> killed `m06`, `m23` and `m46` **at `A7` and at no other criterion**; **`A6` took three
> single-removal rows**, which killed the compensating `KNIGHT=4, BISHOP=2` build the single joint
> `+11` FEN survives. `A13`'s two counting clauses moved to **≥ 2 plies** — and the two builds that
> walked through, `m49` and `m50`, were confirmed **green on the pre-hop fixtures and red on the
> new ones**, so the depth is what closes it. `A2`, `A5` and `A9` gained the check-plus-claim, the
> `Nexd4` disambiguator and the forged-status case; `m45`, `m13` and `m27` die on them. **ZERO
> PRODUCTION LINES — every changed line in `src/status-panel.ts` is a comment, and the fifteen
> pre-existing snapshots are BYTE-IDENTICAL.** All three stale-comment sites under `src/` repaired,
> including `src/status-panel.test.ts:263-265`, which was named by nobody; the `src/san.ts:101`
> cite corrected to **`:104`**, verified at source. Gates: **711/711 on 24 files** (708 + 2 snapshot
> tests + 1 retained `A13` test), lint/typecheck/build **0**, skip **0**. **`main` advanced to
> `d838bd6` mid-hop — 1 behind, touching no `src/` file and not this ticket; a rebase is owed before
> merge.** One under-specified edge in `A13`'s scan clause **flagged to BA/PM, not amended.**

## Flagged, not taken

- **`A13`'s *"at every depth asserted"* is ambiguous at ply 0**, where the ply-independent formula
  is false by the anchor's piece count. Resolved conservatively — the delivered depth-0 assertion
  was **retained**, because dropping it makes a wasted `parseFen` invisible to all 29 acceptance and
  snapshot tests (measured). **Full account and the counter-reading in this hop's `claim` note.**
- **`npm run lint`'s 2 infos are pre-existing `biome.json` config notices** (schema 2.3.0 vs CLI
  2.5.5; the deprecated `recommended` field). Verified pre-existing by stashing. Not this ticket's
  and not fixed here.
- **The branch is 1 behind `main` and needs a rebase before merge.** Not taken: rebasing is not this
  subtask's, and `main` was never checked out.
