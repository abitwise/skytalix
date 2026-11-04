# arch-owner-answers-1104b decision: `ADR-0072` and `ADR-0073` are ACCEPTED over missed premises, `ADR-0074` is ACCEPTED, and `ADR-0024` d4 is amended. Bundle 1's read is ruled row by row in `ADR-0056`. Bundle 1 reads first; `ABC-289` reads alone after it

Architect/Design, task `arch-owner-answers-1104b`, records only, on `grugops/arch-owner-answers-1104b` from `main` `65e28f95`. Nothing was run. Input: the owner's word as the Orchestrator recorded it, `orch-2026-10-30a` `…3e73f9f9`. All lines are in commit `74194a4a`. The PREREG shape is `…d776c0f0`.

## 1. `ADR-0072`, `ADR-0073`
- **Status: ACCEPTED over a missed premise, not in force.** F1 stays fired on both. The rows, the readings and the audit and CH3 misses stand as written. The old Status blocks are kept as history.
- **R-BUNDLE-1 is named, with what this adds:** P4 enters past the audit and drift rows, and the countermove has no measured pay. Stated once in `ADR-0072` § Status; `ADR-0073` points to it.
- **One reading, flagged.** Option (a) as put in `…37b7fb23` reads "On a pass both ADRs are accepted as a bundle; on a miss both return to held". The brief says Status to ACCEPTED now. I wrote both: ACCEPTED now, which opens the build; in force only at the bundle's merge; on NOT MET, B6 returns each to PROPOSED, premise not met. B5's line, naming the bundle ticket and the read, is owed at QE's verdict, because the ticket is not cut.

## 2. What bundle 1's read holds (`ADR-0056` D5's dated block; the shape is `…d776c0f0`)
- **Safety bars, table 1:** all-off identity; older doors; the mate floor (B1, B2, each B3 row) at 0; zugzwang 7 / 7; `G1` ≥ 54 / 58, none newly missed; 0 mate sign changes; O2c's drift on its own door, ≥ 95 % within 25 cp, none beyond 25 cp.
- **Part bars and gates, table 2:** door pairs and rule rows; the forms; L4 d8 ≤ 0.89 × on the four and reach ≥ door + 0.10; 3 072 bytes; `G6` "≥ base"; `NFR-008` ≤ 10 s and ≤ +0.10 s for the bundle; the lint, type, build and run-rule gates.
- **Reported only, table 3:** L2's drift share and cap; L2's audit; CH3; `chooseMove` d6 and `krk`; `G2`; the all-on and firing figures; the instrument counts.
- **The read:** one C2′, 100 games at 100 ms, all on against the merge-base, GAIN ≥ 50.0 / 100; S′ at E 1 810 and the Levels deep lane, both bars.
- **Rows that were open and are ruled here, with the reason in the block:** the sign-change clause, O2c's drift, L4, `chooseMove` d6 and `krk`, S′, `G6`, `G2`, what "reproduced to the count" means, and a red on L4 or `G6` (a STOP, not a miss).
- **No ceiling on the reported rows.** A worse audit on a moved base stops nobody. It reaches the Orchestrator in the SE's hand-off, before QE's PREREG. A ceiling now would be a new bar after a read. That is the weakest row in this ruling, so it is stated.

## 3. `ADR-0074`, `ADR-0024`
- `ADR-0074` ACCEPTED, not in force until `ABC-289` merges on its own read. A decision log is added, as `ADR-0071`'s acceptance did.
- `ADR-0024`: a fifth § Status block and a dated line at d4, as `ADR-0074` d9 owes. Quiet checks stay on the list.

## 4. The order
- **Bundle 1 first. `ABC-289` reads alone after it,** on top of the bundle if it merged, on `main` without it if it was NOT MET. Its build starts when bundle 1's merge or `failed-attempt` is recorded. It stays out of the bundle. This confirms `…085f647c` 5.
- **The reasons:** two reads on one base cannot both stand; P4's reach bar has the least room (+0.116 against +0.10, where Q2 has +0.279 against +0.15); the override rests on figures read without Q2; a joint red then has one door.
- **The cost:** the met premise waits behind two missed ones, and Q2's tight drift bars are read on a P4 tree.
- **Not settled by the records.** No probe has had P4 and Q2 both on. The margin reason is reasoned, with one precedent, not measured. The joint effect on either ticket's pay and drift is `UNKNOWN - verify`.
- **The lane does not set the order.** About −0.38 s is my arithmetic for the census ask with `ABC-289`, an estimate; `…085f647c` 2 says only "more". Whether the rows exist is `UNKNOWN - verify`.
- **A gap closed.** `ADR-0074` named no re-read of b = 2.3, though Q2 changes the tree's growth. A dated line applies `ADR-0072` d11's clause to `ABC-289`.

## 5. Lines beyond the brief's four items
All are inside the fence and all were owed at acceptance by `…37b7fb23` § Owed or by the ADRs themselves. The Orchestrator may drop any of them.
- `ADR-0056` § Status line, D2 rows P4, O2c and Q2 with a dated line.
- `ADR-0063` § Status: a dated pointer for d2 and d4. It lapses on a NOT MET.
- `ADR-0060` § Status: R-283-LMR's new rows.
- `ADR-0074` § Consequences: the door, count, joint-tree and b lines.

## 6. Owed by others (nothing here edits a ticket, the EPIC or the board)
**BA/PM:**
1. `ABC-286`: `adr:`, DoR row 10, L2 and L4 from `ADR-0072` d8–d9 and `ADR-0056` tables 1–3, scope 1 from d1, L0's door.
2. `ABC-288`: `adr:`, DoR row 10, CH1's bytes, CH3 reported; the title and scope 1 drop continuation history; F1's disposition.
3. **The bundle ticket (B7), in `ABC-283`'s form,** its bars copied from `ADR-0056` tables 1–3, with the two pages kept as design pages.
4. `ABC-289`: `adr:` reads ACCEPTED; § Dependencies takes the order, and "the build may start on PROPOSED" is replaced by it.
5. `EPIC-011`: OQ-0072-1, OQ-0073-1 and OQ-0074-1 answered; rows P4, O2c and Q2. `ABC-284`'s R-283-LMR line stays owed.

**Orchestrator:**
- The board and the slots against `ABC-282` and `ABC-301`, which this does not rule. `ABC-301`'s page makes B-T7 stale on a value-changing merge after its freeze, and C2′'s stale rule makes a bundle read stale if `ABC-301` merges after it. So the bundle's C2′ and merge need placing against that freeze.
- The census, sized for both.

**Architect, at QE's verdict:** B5's line in `ADR-0072` and `ADR-0073`, or their return to PROPOSED by B6.

## 7. Owner
Nothing needs his decision now. Two things he may want to see: the reported rows carry no ceiling, and the order was reasoned without a joint reading.
