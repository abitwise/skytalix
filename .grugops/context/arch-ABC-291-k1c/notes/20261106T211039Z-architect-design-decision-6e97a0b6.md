---
id: 20261106T211039Z-architect-design-decision-6e97a0b6
kind: decision
by: architect-design
at: 2026-11-06T21:10:39Z
verified_by: 
confidence: high on the dates, hashes and § 2, by git read; medium on § 1's split of what the order guarded, a judgement; one question left open, for the owner
refs:
  - ABC-291
  - ABC-290
  - ABC-292
  - ABC-293
  - ABC-289
  - ADR-0075
  - ADR-0072
  - EPIC-011
  - orch-2026-10-30a/20261106T202213Z-orchestrator-decision-a7dc99cb
  - orch-2026-10-30a/20261106T203809Z-orchestrator-decision-5a2d8753
  - qe-ABC-291-k1/20261106T202814Z-qe-e2e-decision-2e186a33
  - qe-ABC-291-k1/20261106T203639Z-qe-e2e-observation-b850a2ad
  - qe-ABC-291-k1/20261106T203639Z-qe-e2e-observation-a223d29a
  - qe-ABC-291-k1/20261106T203702Z-qe-e2e-observation-5de6a358
  - se-ABC-291-k1rows/20261106T205243Z-software-engineer-decision-96abeaf8
  - se-ABC-291/20261106T201944Z-software-engineer-observation-f0c9e801
  - bapm-ABC-291-k1-lines/20261106T210025Z-ba-pm-observation-cd569ec9
  - arch-ABC-291-stop/20261106T203245Z-architect-design-decision-2d2c2bad
supersedes: 
seal: sha256:63679c4d9b9b31ea4353efef4ed33800181c79ac99971ea13a8bf01b2d997230
---

# arch-ABC-291-k1c ruling: K1 (c)'s order is not met to the letter and no line reads it as met; test note 1's "(b) rows" are form (b)'s, not K1 (b); PR10's drift earns a dated line

Architect/Design, records only, on `grugops/arch-ABC-291-k1c` from `main` `85731c89`. Read `grugops/ABC-291` at `9e496e4a`, read only. Nothing run but `git` reads, `sha256sum`, one text compare and the claim and note scripts. Text of record `a7097595`, `1f1824af`.

No value, rule, definition, ratio, intent, bar or level moved. **One question is left open and not ruled: § 1's last line.**

## 1. K1 (c): stated as not met to the letter
The brief offers three readings. I take the third. The first holds in part. The second is refused.

- **Met: refused.** `…2d2c2bad` § 2's test: a bar moves when an exact build that would have read red now reads green. K1 (h) passed that test because no exact build could meet its letter. This letter could have been met by a build dispatched after a freeze. A reading that made it met would turn a real miss green. d7 says none is loosened after Ready. So K1 (h)'s reason for not stopping does not carry over, and I do not take its form.
- **A rebuild** would meet the words alone. The rows and the patch are in hand, and `…d68ef14e` 1 says the build is the probe's patch re-anchored. Same lines, nothing blind. Not offered. So "no later step can meet it" is true of the guard and a little too strong of the words.
- **Does the blind derivation answer what the order guarded? Half, and the weaker way.**
  - **Values fixed with no sight of the code, never changed to fit** (`ABC-271` and `ABC-274` test note 1). Answered. The seal precedes the compare at `4948aad0`, the three sha256s match, no later commit touches `k1-rows.mjs` or `k1-labeller.mjs`, 0 of 704 reads missed, and 0 of 36 values differed. QE's list ran to 88 rows against 36, which does not read like a copy. **But a prior freeze is blind by date, and this one by QE's word:** its branch came from `63af973e`, so the code stood in its worktree. A commit proves seal before compare. It cannot prove what was opened before the seal.
  - **The rows in the Engineer's hand during the build** (`EPIC-011` § Test notes). Not answered, and nothing buys it back. "A freeze made after the build protects nothing" stands, and I do not read around it: QE's list is a blind check. The Engineer's file head says the same.
- **Why the second loss cost nothing visible.** A frozen row acts on a build by going red. No QE row reads red. That is a result on this tree, and no guard for the next.
- **The rows half.** 60 rows at `70d931ab`, d1's double step and en passant among them, so `…5a2d8753`'s letter gap is closed. Read by the Engineer. QE's read is owed.
- **F1 does not fire.** It reads a red row. No falsifier names the order.
- **The real read, owed at stage 0.** The owner's rule for a clause like this is to say so and add a real read. The 24 rows are one. One more is cheap and goes at the weak point. The probe's `labeller.ts` (sha256 `4dc558bb…`, verified) was sealed at `d033ea0e`, about 30 h before `aec95beb`. It is the one set of expected parts blind to the build by date. It is not blind to the patch, which has its author. Only the Engineer has read it on the build (`…f0c9e801`). QE reads it at the tip: PR3's form, `pawnShapeForTest`, 28 126 positions, on a copy, under the lock, no quiet host. A report, no new bar. A mismatch goes to F1's check, after the labeller's six hand rows.
- **Left open, not mine: whether `ABC-291` merges with this order not met.** That is no reading. A yes sets aside words of a bar he accepted. It holds no read: K4, K5 and C2′ read the same five production files whatever he says, unless he asks for a real rebuild. The brief says he was told at about 20:22Z and has not answered. His silence is not a yes. The delegation of 2026-10-22 gives the Orchestrator QE-gap acceptance and keeps reversed ADRs and requirement changes with him. `QE-274-a` and `…085f647c` 1 were LOW gaps, on test notes. This one is in a bar. So I recommend his word, in the message that asks for the window and W, because a no spends less there than after C2′.
  - **The plain question:** "K1 (c) said QE fixes the seam test positions before the build. We missed that. QE wrote them afterwards, blind by its own word, none differed, and they exposed gaps we filled. Do you accept merging on that, if every other bar passes?"
  - **My recommendation: yes.** The rows are wider than a prior freeze's minimum would have asked, and no read moves. The cost is stated: this ticket's seam rows were not protected the way the ADR said.

## 2. Test note 1's "(b) rows": K1 (b) does not answer it, because it is the wrong (b)
- **By date.** As cut (`aebc9783`): "QE freezes the seam fixtures (or the (b) rows)", on a page with "Under form (a)" and "Under form (b)". `6cb4fb23`, 2026-11-05 08:08Z, made it "and" when form (b) was chosen. `ADR-0075`'s first commit is `b99d10a0`, 10:37Z, so K1 (b) did not exist. `ABC-290`, `ABC-292` and `ABC-293` carry the same sentence from the same commit.
- **So the "(b) rows" are form (b)'s:** the seam, the mirror and `ADR-0064` d7's safety rows. The seam is § 1.
- **The rest: QE froze none, and no set was chosen after the build.** `G3`, `TAPER_MIRROR_POSITIONS`, the 287, the seven and `G1`'s 58 are committed and unchanged from `8e115110` to `9e496e4a`. The 16 equal `PAWN_SET` in order, sha256 `8b070dda…`, sealed at `d033ea0e`. This is `…085f647c` 1's form: LOW, disclosed. A test note has no bar's words, so § 1's open question does not reach it.
- **Owed by QE before K4:** one PREREG line naming these sets, or an addendum before the first timing if sealed. No new freeze.
- **K1 (b) on its own terms:** frozen by date. The build changed which function the rows call and no table entry. Not re-read here. It sits in QE's stage 0.

## 3. PR10's drift: yes, one dated line
It decides nothing. It earns the line because a later reader, and d12's next ADRs, will set "100 %, 24" beside the build's 96.79 %, 89 with nothing in this ADR to say the base moved. The page has this, the ADR did not, and it costs one line. The figure stays the reading at `cc6e64d1`. QE's run is not a re-run of the probe. `…a223d29a`'s bundle-off row matches `raw/note-readings.md` on every published field, checked. M3 off alone reads 16, not 24, so the line says the bundle-off row matches and M3 moved it, and does not say M3 off reproduces the probe.

## 4. Owed
- **QE (`qe-ABC-291`, stage 0):** the labeller read (§ 1); the PREREG line (§ 2); K1 (c) reported as two halves, never as met.
- **Orchestrator:** the owner's word (§ 1), and the two reads above into QE's brief.
- **BA/PM:** the page's pointers, in the next hop that has one. This task's observation lists them.
