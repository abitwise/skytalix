---
id: 20261105T075329Z-architect-design-decision-ba8265e9
kind: decision
by: architect-design
at: 2026-11-05T07:53:29Z
verified_by: 
confidence: medium: the order is a recommendation on records that do not set it; the bars are the pages' and ADR-0056's; the mate-floor and memo points are reasoned, not read; nothing run
refs:
  - arch-owner-answers-1105
  - EPIC-011
  - ABC-290
  - ABC-291
  - ABC-292
  - ABC-293
  - ABC-272
  - ABC-289
  - ABC-303
  - ADR-0056
  - ADR-0067
  - ADR-0068
  - ADR-0070
  - orch-2026-10-30a/20261105T074310Z-orchestrator-decision-b836b85c
  - arch-ABC-301-miss/20261105T004221Z-architect-design-decision-e5a5ac0c
  - arch-ABC-301-miss/20261105T004230Z-architect-design-decision-2b3440cf
supersedes: 
seal: sha256:e54f9df51cdedd128a7369227b4ab91318999489f7359a11701a74fe1de09652
---

# arch-owner-answers-1105 item 3: next on the wait path is E4b (`ABC-291`), connected, phalanx and backward pawns. The records do not set the order, so this is my recommendation. Then E5 without per-piece mobility, then E3b, then E6

Architect/Design, task `arch-owner-answers-1105`, records only, on `grugops/arch-owner-answers-1105` from `main` `a44aa057`. Nothing was run. Line of record: `ADR-0056` D6's dated line of this task.

## Do the records decide the order? No
`ADR-0056` D6 item 5 says "E3–E7", a range. `…2b3440cf` left the order among them as it was, and no record set it. The pages say only "one at a time" on the evaluation files. Their priorities (E3b and E5 P2, E4b and E6 P3) were set when the weights were to come from a fit, and that premise has gone. D6's reorder rule makes the order the Orchestrator's, with the owner told.

## The four, side by side

| term | estimate (never read) | what it costs each evaluation | hand values so far | extra work |
|---|---|---|---|---|
| **E4b** pawns | +20–60 for all of E4, E4a included | pawn-only, so it may sit in the pawn memo. `UNKNOWN - verify`, the ADR's | never tried | size S–M |
| **E5** pieces | +30–80 | bishop pair and rook files look cheap; per-piece mobility and outposts cost per call (page) | `ABC-207`'s mobility lost, −18.3 ± 16.5. The other three never tried | size M; the page splits; mobility touches `ADR-0031` |
| **E3b** king attack | +40–100 for all of E3, E3a included | attacker counting on every call (page) | `ABC-205` died on cost; `ADR-0068`'s king values lost mates | size M |
| **E6** threats, tempo | +20–50, lowest confidence | attack and defence maps on every call (page) | never tried | size M; tempo meets the null move and the mirror rule, rows unknown |

## The recommendation, in plain words
**Try the pawn terms first.** On the evidence so far, hand values fail in two ways: they cost too much time, or they lose mates the engine used to find.
- E4b is the term least exposed to both. It looks only at pawns, so it can be worked out once per pawn shape. The mates that `ADR-0068`'s values lost were king and queen against king, where pawn terms do nothing. That last point is reasoned, not read.
- It is also the smallest job, and it opens the way to a third pull as well as any other term would.
- **What it gives up:** it is not the biggest estimate. If E4b's share of the row is small, 100 games may not show it. Taking it first also moves a P3 ahead of two P2s.
- **The risk:** its endgame values touch pawn scores, and the row that failed both pulls is sensitive to those. Its effect on that row is unread. **The row played no part in this order.** Attribution is not run, and it may not choose the next term.
- **If he would rather try the largest estimate first,** that is E3b, at a higher risk of the two failures above. The order is cheap to change.

**Then E5, without per-piece mobility.** The bishop pair and the rook files are cheap and untried. Mobility per piece is the one part that has already lost on hand values, so it should wait for a fit or its own case. This fires the page's split rule. **Then E3b. Then E6,** last: it has the lowest estimate, and tempo's effect on the rules is still unknown.

## What hand values must show, in plain words
A term merges only if all of these hold. This is form (b) of each term's page, and no bar is new.
1. **Honest values.** They come from a stated rule in the term's ADR, written before any test or game is read. He accepts that ADR, as for any new ADR. Nothing is adjusted after a result is seen.
2. **Nothing gets worse where safety is tested.** No mate it used to find is lost, the seven zugzwang traps stay 7 of 7, and no test position is newly missed. No depth moves and no expected result is rewritten to get through.
3. **It stays fast enough.** Evaluation stays within the slowdown the ADR sets, and every search still reaches depth 6. The pages' figure is 5 %, for form (a). Their form (b) lists do not name `G2`, though each page's front matter owes a ratio, so each ADR must set one.
4. **It wins or at least holds its own.** In 100 games at 100 ms a move against the engine without it, it scores at least 50.0, with all 100 finished, no crash and no loss on time. It then holds up against Stockfish at the level in force (1 810 today: at least 3.0 of 10), and the difficulty-levels test passes.

**What a pass means.** It means "not seen worse", not "proven better". A term truly worth +20 Elo passes about 79 % of the time, +10 about 66 %, and a term worth nothing 50 % (`ADR-0056`'s C2′ table). So the Elo of a merged term stays unknown.

**On a miss.** It does not merge and the read is not played again. The ticket goes back to BA/PM. I recommend each ADR also says there is no second set of values after a miss: new numbers chosen after seeing a loss are tuning on play by hand. That line is not yet on any record as a rule.

## Before E4b can start
BA/PM rewrites the page to form (b). The Architect's ADR follows, with its probe on the host after A4. He accepts it. The build then reads after `ABC-303` and `ABC-289`, because each merge stales the read behind it.

## `UNKNOWN - verify`
Whether E4b fits the memo and at what size. Whether any hand-valued term pays. Whether E4b holds `zugzwang.001`. E4b's and E3b's shares of their rows' estimates.
