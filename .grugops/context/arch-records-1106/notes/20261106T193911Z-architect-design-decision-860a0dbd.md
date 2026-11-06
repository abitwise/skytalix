---
id: 20261106T193911Z-architect-design-decision-860a0dbd
kind: decision
by: architect-design
at: 2026-11-06T19:39:11Z
verified_by: 
confidence: high on the class, read from ADR-0034 d2 and ADR-0075 d4 and the design's files; medium on two named readings, that growth on an exact build is real and that the oracle is d7's K rows; nothing run
refs:
  - arch-records-1106
  - grugops/arch-records-1106
  - ABC-291
  - ABC-289
  - ABC-286
  - ABC-288
  - ABC-303
  - EPIC-011
  - ADR-0034
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - ADR-0074
  - ADR-0075
  - ADR-0064
  - ADR-0026
  - ADR-0028
  - OQ-0074-2
  - G1
  - F3
  - K3
  - S-prime
  - 8e115110
  - e717bc4f
  - 434fa171
  - b42706b3
  - arch-ABC-289-joint/20261106T192213Z-architect-design-decision-7c297147
  - arch-ABC-289-joint/20261106T192213Z-architect-design-observation-d61479af
  - arch-ABC-303-b5/20261106T183437Z-architect-design-decision-28283e48
  - bapm-lines-1106b/20261106T193100Z-ba-pm-decision-cd04f470
  - bapm-lines-1106b/20261106T193100Z-ba-pm-observation-710dc7ec
  - orch-2026-10-30a/20261106T192323Z-orchestrator-decision-40ef8351
  - orch-2026-10-30a/20261106T183544Z-orchestrator-decision-aaeffb04
supersedes: 
seal: sha256:45563c08aa8b50dbdebabe030a4f8c2c1f4e54a49fd0f8bc8aa4d999724210fc
---

# arch-records-1106 ruling: a `G1` miss on `ABC-291` is class B, on the letter of `ADR-0034` d2, and F3 reads as written. `…7c297147` § 4 item 5's class sentence is withdrawn. The owed `ADR-0075` and `ADR-0056` lines are written. No bar moved

Architect/Design, on `grugops/arch-records-1106` from `main` `8e115110`. Text of record `e717bc4f`: 61 lines added, 0 removed. Nothing run: no test, build, engine or game. No ticket, EPIC, board, `src/` or test edit. I did not open `se-ABC-291`'s branch, context or figures.

## 1. The ruling

**Every `G1` row missed on `ABC-291` is class B. The diff has no class D and no class L. F3 reads as written: "a defect check first. If real, NOT MET. Never a re-pin, a moved depth or a new value".**

The lines it rests on:
- **`ADR-0034` d2:** "A diff that touches any other trigger-list file has **no drift class here**. Every missed row is class B."
- **`ADR-0034` d2's instrument:** "Decisions 3 and 4 apply only if every printed line is `src/evaluate*.ts`."
- **`ADR-0034`'s control:** `ABC-079`, printing `src/engine.ts`, `src/quiescence.ts`, `src/search.ts`: "still all B, as decision 2 intends".
- **`ADR-0034` § Context:** two things separate drift from a defect, and the first is "the diff touches no search code".
- **`ADR-0075` d4:** `pawnShape` "in `src/search.ts`'s `Switches`, `src/engine.ts`'s `Heuristics` and quiescence's rules record".
- **`ADR-0075` § Consequences:** "`src/search.ts`, `src/engine.ts` and `src/quiescence.ts` take the switch".
- **`ADR-0075` F3, K3, d10 rule 2 and d11 (d):** "If real, NOT MET"; "`G1` no NEWLY-MISSED line"; PR7's "If the miss is real"; "a real safety red (F3)" is a miss.

Checked at `8e115110`, reading only: the three homes exist (`src/search.ts:473`, `src/engine.ts:315`, `src/quiescence.ts:159`), and the instrument's filter and load test pass all three names. That dry run fed it the names from the design, not a diff.

**The class cannot wait on the diff.** A build whose instrument printed `src/evaluate*.ts` alone would lack d4's switch, which is F1's. So on an exact build no figure from `se-ABC-291` can change this, and none was needed.

**The readings for D, answered:**
- *It is an evaluation ticket.* d2 tests the diff, not the term. It equates its scope with `ADR-0028` d6's by naming the files.
- *The switch is plumbing.* The READING under d2 sets aside test files and test-only fixtures, and nothing else. A loaded switch is search code, and a miswired one is what d2's reason fears: "`W3`–`W5` and `W16` read exactly like drift".
- *`…7c297147` said D.* It is a note of mine, not an ADR line, and its own § 1 reads d2 the other way on `ABC-289`, on the same three files.

**How a miss runs.** The red stays a QE FAIL (`ADR-0034` d1). Then F3: a defect goes to F1, and a fix restoring d1 or d2 is not a miss (d8, d11 (d)). With no defect, the miss is real, because growth on an exact build is not a defect and F3 has no third outcome. NOT MET, not merged, and a miss under d11 (d).

**Not routes:** `ADR-0034` d3's table and its "Any other row goes to the owner as a depth cost", since decision 3 does not apply to this diff; d4's fixture and level lines, since K3 reads `ADR-0064` d7's rows and d7 keeps `G1` on the shipped path. A ladder rung may be reported as evidence for the defect check. It classes nothing.

**Softest points, named.** "Real" is undefined in F3, so "growth on an exact build is real" is my reading of its two outcomes, though d10 rule 2 uses the same form. "The oracle is d7's K rows" is also my reading. `…7c297147` § 1's use of d3's owner line on `ABC-289` was hypothetical, and it found no route there. Neither point changes the class.

**The withdrawal.** `…7c297147` § 4 item 5's class sentence only. This note's `supersedes` is empty on purpose: that field folds a whole note out on replay, and the rest of `…7c297147` stands.

**No bar moved.** A class is a red's route. K3, F3, d11 (d), `G1`'s bar and `ADR-0034` are unchanged. The reading that keeps F3 is not chosen for being the stricter one: it is what d2 says.

## 2. The lines written

**`ADR-0075`:** § Status bullet; decision-log row; a pointer under K3; the ruling block under § What would falsify this; a dated line under § Consequences' Order.

**`ADR-0056`, for `ABC-289`'s NOT MET (…7c297147 § 6):**
- D2: dated block, rows P4, O2c and Q2. Q2 reads recorded NOT MET, not closed, OQ-0074-2 open.
- D5: dated line closing "The order against `ABC-289`".

**`ADR-0056`, `…28283e48` § 2's four lines:**
1. § Status: a fold under `arch-owner-answers-1104b`'s dated line, in `arch-post-269`'s form.
2. D2, rows P4 and O2c: in the block above, in `arch-ABC-283-accept`'s form, with the cells left as written because this brief is insertions only.
3. D5, `arch-ABC-303-open` item 2: under "The lower edge is close". 27.5 / 40 = 68.75 %, X = +137.0, no step.
4. D5, the FL block: under "The Levels lane was not asked", on `…aaeffb04` 1's confirmation.

## 3. Owed, none written here

- **BA/PM, before QE seals:** `ABC-291`'s banner ("Not settled, and not ruled here"), K3's third dated line, § `UNKNOWN - verify`'s class line, and DoR's closing mention of it. Each now reads ruled: class B, F3, this note.
- **Orchestrator:** QE's brief for `ABC-291` carries this ruling. `…40ef8351`'s "F7 governs" reads F3 on this ticket.
- **Architect, next hop on the file:** `ADR-0056` D6's "a term's C2′ follows `ABC-303` and `ABC-289`". The same fact as the Order line, not on this brief's list, so not written.
