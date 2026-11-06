---
id: 20261106T192213Z-architect-design-decision-7c297147
kind: decision
by: architect-design
at: 2026-11-06T19:22:13Z
verified_by: 
confidence: high on F1, F7 and the quotes: the records' own words on a reproduced build; high that ABC-291 may build; medium on the recommendation, a judgement open to the Orchestrator and the owner; worth and pass odds are estimates, UNKNOWN - verify
refs:
  - arch-ABC-289-joint
  - grugops/arch-ABC-289-joint
  - ABC-289
  - ABC-291
  - ABC-292
  - ABC-290
  - ABC-293
  - EPIC-011
  - ADR-0074
  - ADR-0072
  - ADR-0075
  - ADR-0056
  - ADR-0034
  - ADR-0028
  - ADR-0026
  - ADR-0024
  - OQ-0074-2
  - b42706b3
  - 3ff03a9d
  - se-ABC-289/20261106T190400Z-software-engineer-failed-attempt-0e380b06
  - se-ABC-289/20261106T190400Z-software-engineer-decision-4ad7c049
  - se-ABC-289/20261106T190400Z-software-engineer-observation-8b80f592
  - arch-ABC-289/20261104T201807Z-architect-design-decision-174760a3
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - orch-2026-10-30a/20261105T141318Z-orchestrator-decision-69ee96e7
  - orch-2026-10-30a/20261105T123040Z-orchestrator-decision-f40ce634
  - arch-ABC-303-b5/20261106T183437Z-architect-design-decision-28283e48
supersedes: 
seal: sha256:6a494f26850761f7e67a4474388453f09dc26ab2347271b639722f23b97857ee
---

# arch-ABC-289-joint ruling: F1 and F7 read NOT MET on an exact build; the premise's pay stands and the bars did not presume the old tree. Recommendation: close `ABC-289`, no other form now. `ABC-291` may build on `main` now. One non-blocking owner question

Architect/Design, on `grugops/arch-ABC-289-joint` from `main` `3ff03a9d`. Readings: this task's observation note. `ADR-0074` takes dated insertions only. No bar, margin, form or pin moved. No ticket, EPIC, board, `src/` or test edit.

## 1. How F1 and F7 read

**F1: NOT MET, by its own words.** "a non-mate score beyond 30 cp … in either recursion" fires at 34. Its disposition: "a defect first: the bound of decision 3, the order of decision 4, the in-check guard. On an exact build: NOT MET". The defect check is done (`…0e380b06`; re-read here). `ABC-289` F4: "a defect check first; if real, NOT MET".

**The bars did not presume the old tree. The records say the opposite, three times:**
- `ADR-0074` § Consequences: "three things follow, and no bar moves"; "The joint tree is unread. No probe has had P4 and this rule both on, so decision 11's drift and floor on that tree are `UNKNOWN - verify`. If one trips, F1 or F2 governs."
- `ADR-0074` d12: "The bars stay; a re-derived count is a dated line here, never a moved bar."
- `ADR-0056` D5, under "What it costs": "`ADR-0074` d11's drift bars are tight by rule (≤ 30 cp from a reading of 20) and would be read on a tree with P4 in it. If one trips, `ADR-0074` F1 governs and no bar moves."

The 30 was derived on the old tree, and the records say that too. It still binds here. This is the cost that order was known to carry.

**The premise did not fail.** PREREG `…174760a3`: "Whether the premise is met is decided by the pay gate below". Pay is met here: d8 0.6084 to 0.8215, reach +0.389. Its verdict rule also reads "A form passes both gates: the premise is met". Those gates were sealed for `0cc9afd1` and no record re-runs them. Read across as a diagnostic, D200b here passes the sealed 150 cp drift gate and misses `G1`. So: NOT MET on decision 11, premise standing as `0cc9afd1`'s record, not re-read.

**F7: it has no NOT MET of its own; it reaches one.** "`G1` below 54 / 58, or a NEWLY-MISSED line … classed per row under `ADR-0034`".
- `ADR-0034` d1: "The red stays a QE FAIL." d2: "A diff that touches any other trigger-list file has **no drift class here**. Every missed row is class B." The instrument prints three search files.
- The table agrees on its own: "a `mate-in-N` row still missed at +25 % at depth ≥ base's".
- d2 sends a not-a-defect argument to `ADR-0026` d10's oracle, which here is d11 itself, and it reads red.
- B goes to the Engineer under `ADR-0028` d1, whose first proof is "the identity and oracle rows that cover the reddened code are green on the branch". F1's drift row is one, and it is red. "If any of the three fails, the red is a defect and the build is fixed instead". The build is exact, so there is nothing inside this form to fix.
- Were F1 lifted, `ADR-0034` d3 ends: "Any other row goes to the owner as a depth cost". So `G1` has no agent route on any path.
- `…42c82347`: "NEVER re-pinned: zugzwang rows, the mate floor, G1, the identity gate, and relation tests". `ADR-0034` d4 rules out "re-finding a mate row". `ABC-289` F4 closes it: NOT MET.
- It is the row and the miss D300 also failed on: "`G1` 53 / 58 with "mate in 3, seed 1632" newly missed".

**A gap, named:** § Consequences' joint-tree line names drift and floor, not `G1`. F7 and d11 have no tree condition, so it changes nothing. A dated line says so. No row retires.

## 2. The routes

| route | what it does | what it moves | whose | reads |
|---|---|---|---|---|
| **A. Close** | F1's NOT MET stands; `ADR-0074` stays accepted, not in force; `b42706b3` kept as the record | nothing | the Orchestrator | none |
| **B. Override on this build** | D200b ships as built, past both reds | d11's drift bar and `G1` (a lowered count or an accepted miss, `ABC-084` A7) | **the owner.** A safety override, heavier than a pay override; his second on this tree after `ADR-0072` | 21 rows, then DP4, `G6` |
| **C. D200b + mate-band guard** | a new form; reverses d5's "No mate-band guard" | **his accepted form.** Clears `G1` on one scratch read only; **leaves drift at 34, so F1 still reads NOT MET.** Alone it is no route: it needs B's drift half | the owner | new PREREG, probe, then as B |
| **D. Another new form** | d5's named follow-up, check-exempt with the bound, or any other | **his accepted form, and maybe a bar.** Unread, on purpose | the owner | new PREREG, probe, then as B |
| **E. P4 out, Q2 in** | `moveCount` off, D200b on | **`ADR-0072`, in force, and the read that passed.** Only route read to clear both reds, on scratch: 100 % / 12, 100 % / 20, `G1` 54, floor 0, 7 / 7, d8 ≤ 0.8433, reach 7.158 against `main`'s 7.016 and the both-on 7.405 | the owner | own ADR line, build, own C2′; `ADR-0072`: "Removing a part later is a value change with its own read" |

**Said plainly on D:** the PREREG's bar rule would re-derive drift from a new read: at 34 it gives ⌊1.5 × 34⌋ = 51. That is the 30 moved by another door. Any new form keeps ≤ 30 unless the owner moves it, in advance and in those words.

**Not routes:**
- Re-reading D200b, unchanged, on a later tree. One row at 34 could flip by chance on any merge, and that would be a miss re-played.
- Re-deriving 30 from the red, or re-pinning anything in DP2.
- Cutting or re-finding 1632. `ADR-0034` d4 excludes it, the count is his, and the head's miss is behaviour, not budget. The row's lost margin on `main` (§ 6) is a separate fact.

## 3. Recommendation

**Route A. Close it. It is not worth another form now.**

- **Worth:** `ADR-0056`'s +5–20 Elo stays an estimate, unmeasured. The tree says the pay is there, if anything more of it (+0.389 ply against +0.279). The tree also says the rule behaves worse here: drift is wider at d4, d6 and d7 than the single row at d5 suggests, and the two rules interact in a way nobody has priced. I put it at the same +5–20, with less confidence.
- **Why not B:** two safety bars for a P3 ticket, on a tree already past its audit by his word. `…f40ce634` 1: "waiving a sealed rule on a close figure is the wrong habit", and 34 against 30 is a close figure.
- **Why not C or D:** C cannot pass alone. D means a new PREREG, a probe, his acceptance, BA/PM lines, a rebuild, 21 rows re-formed, then the whole read: about six hops and an owner-held quiet window. And it may buy little. A bar this tight on a P4 tree may pass or fail on one row, so a pass would mean little too.
- **What the read could give:** at +5–20 Elo a 100-game C2′ passes about 56–74 % of the time (my arithmetic, 4.5 points of standard error, `UNKNOWN - verify`), once, never re-played. So a real gain is lost a quarter to nearly half the time.
- **Why not E now:** it is the one with evidence behind it, and P4's premise was the one not met. But it reverses a part that passed its read, the bundle's credit cannot be split, and it trades 0.25 ply for clean bars. It is his to open, and not on this ticket's back.
- **Against this recommendation:** it gives up the largest reach gain on the board, on one row's 4 cp and a mate found one move late, with the game still won. I hold to it because those are the bars he accepted, and the reports do not make the figure smaller.
- **Re-open:** a change to P4 on its own ticket, or his word. Never a moved tree alone.

## 4. `ABC-291`

**Yes: it may build now on `main`, whatever `ABC-289`'s outcome.**

- `ADR-0075` § Consequences: "`ABC-305`'s merge, then the build. C2′ follows `ABC-303` and `ABC-289`". `ABC-305` is Done. The build's wait on `ABC-289` is the page line and `…69ee96e7`, whose reason is "Each can add a door or a row to K0 (c) and K2". That is the Orchestrator's to lift. It costs at most a re-derivation, which the page already provides for.
- **Its C2′ waits only for `ABC-289`'s outcome to be recorded,** as `ABC-289`'s own order read "merge or `failed-attempt`". A recorded close meets it. If the owner opens a route, `ABC-291`'s read goes first or waits. He was shown "after `ABC-303` and `ABC-289`", so reading first is put to him in the question.

**Its page needs (BA/PM, dated, no bar):**
1. § Dependencies and the banner's "The build stays behind": `ABC-289` comes off, citing the ruling and this note. DoR row 5 follows.
2. "The read queues": `ABC-289`'s recorded outcome meets it. The same line on `ABC-292`, `ABC-290`, `ABC-293` and `EPIC-011` rows 42, 44, 45.
3. K0 (b), (c) and K2: re-derived on the build's base, bundle 1 in and no `…WithoutDeltaPruning`. `ADR-0075` d4's "those `ABC-303` and `ABC-289` add" reads `ABC-303`'s only.
4. **A new `UNKNOWN - verify`:** its probe ran before bundle 1, so K3 (floor, zugzwang, `G1`) is unread on a P4 tree. This stop is what that can cost. Drift there is a report, so that trap is not on its page.
5. **`G1` is thin there:** row 1632 uses 82 % of its budget on `main` and misses at 0.8×. An evaluation-only diff has a drift class, so a miss by growth is D, the owner's. Bars unchanged.
6. `…28283e48` § 3's lines stay owed. E stays 1 810: `ABC-289` adds no S′, pool 27.5 / 40.

## 5. The 21 rows

Nothing, on route A. They stay red on the unmerged branch. If the owner opens a route, their figures are tree-bound, so their form comes back here on that build.

## 6. Owed, none written here

- **Owner, one question:** below. It does not block `ABC-291`.
- **Orchestrator:** the close ruling; lifting `…69ee96e7`'s `ABC-289` clause. Whether to raise row 1632's margin on `main`: not a red, no remedy asked, reported so it is not found later. b reads 2.2727, 2.3, on a tree that does not ship: no ticket.
- **BA/PM:** `ABC-289`'s title and status; DP1 (a)'s wording only if a route goes on; § 4's lines.
- **Next Architect hop on each file:** `ADR-0075` § Consequences' Order and `ADR-0056` D2 row Q2 and D5's order. Fenced from this hop.

## 7. The owner's question, as drafted

> **1. OQ-0074-2 (does not block other work).** Delta pruning passed its safety checks on the old tree. On top of the move-count pruning you accepted, it fails two. Built exactly to design, the worst score moves 34 cp against a limit of 30, and the puzzle gate reads 53 of 58 against 54: on one row it plays a mate in 4 instead of a mate in 3. The game is still won, but those are the bars you accepted. By the ADR's own words this is NOT MET, and the ADR said in advance that no bar moves.
> - **(a) Close it. Recommended.** `ADR-0074` stays accepted, not in force. Nothing moves, and `ABC-291` goes on. It costs about +5–20 Elo, an estimate.
> - **(b) Override both bars on this build.** This goes past a safety guard, not a pay gate, and it is the second on this tree. It still needs its 100-game read.
> - **(c) A new form, with a new read.** The one lead fixes the puzzle and leaves the 34, so it would need (b)'s drift half as well. About six hops. `ABC-291`'s read would go first.
> - **(d) Take move-count pruning out and put delta pruning in.** The only option read to clear both, on a scratch read. It reverses part of the bundle that passed, and needs its own read.
