---
id: 20261105T215607Z-architect-design-decision-7cb68537
kind: decision
by: architect-design
at: 2026-11-05T21:56:07Z
verified_by: 
confidence: high on items 1 to 3, each read from the source or a named note; medium on item 4, a reading open to the Orchestrator; nothing run
refs:
  - arch-ABC-307-records
  - ABC-307
  - ABC-291
  - ABC-154
  - AR-154-TWO-POINT-CONTROL
  - EPIC-011
  - ADR-0046
  - ADR-0075
  - ADR-0056
  - NFR-005
  - NFR-008
  - NFR-009
  - G2
  - G6
  - bce24018
  - 014b8fa2
  - orch-2026-10-30a/20261105T135350Z-orchestrator-decision-ad217a34
  - orch-2026-10-30a/20261105T134300Z-orchestrator-decision-db111535
  - orch-2026-10-30a/20261105T141318Z-orchestrator-decision-69ee96e7
  - arch-ABC-291-probe/20261105T141205Z-architect-design-decision-2926c26b
  - bapm-ABC-291-probe-lines/20261105T141916Z-ba-pm-observation-bf92ae84
  - qe-ABC-307/20261105T150324Z-qe-e2e-observation-19f6c80a
  - qe-ABC-307/20261105T150324Z-qe-e2e-observation-d356030c
supersedes: 
seal: sha256:2f6f685cc657d3c1d4d31800f6d05c9589beab3f85ac0870f54fa9cdd5a13f5a
---

# arch-ABC-307-records: F1 is the run rule's 23rd line, qe-hop 36 and row 10 read as merged, the 640 KiB lines are dated, and F2's K5 half is written. No bar or level moved

Architect/Design, task `arch-ABC-307-records`, records only, at `main` `014b8fa2`. Nothing was run: no test, build or engine. Text of record: the two ADRs' dated lines.

## 1. F1 on the run rule (`…ad217a34` 3; `ABC-307` § Open 4)
**The line:**

```
ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/grugops/qe-hop-integrity.test.ts -t "AR-154-TWO-POINT-CONTROL F1 — the whole-tree read drops no note \[deep, ENGINE_DEEP=1\]"
```

- **It lives in** `ADR-0046` § Dated 2026-11-05 (`arch-ABC-307-records`). The set is 23: 4 + 9 + 9 + this one. It applies at every hop the trigger fires on and at each epic's close.
- **It needed a dated line,** because rule item 3 takes in moved rows and `F1` was born deep. It joins by name, as one row. The rule is not widened to born-deep rows.
- **1 passed is by reading, not by a run.** I checked the regular expression against the file's text: one describe, one `it`, and none of the trio's lines matches it. `F1` has only been read inside the whole deep lane, 36 passed (`…d356030c`). The next QE hop under the rule confirms it.
- **`AGENTS.md`: no edit, 0 B.** It holds none of the set's lines and no `qe-hop` deep line. It stands at 18 393 of 18 432 B.

## 2. `ADR-0046`'s stale `qe-hop` 35 and row 10
Dated lines at § Status, `arch-ABC-307`'s "base + 3", and `arch-ABC-307-reads`' counts and "not closed", plus the closing section. `qe-hop` reads 32 → 36. Row 10 is met on `…db111535` 1, and QE's A7 held its condition (`…19f6c80a`).

## 3. `ADR-0075`'s 640 KiB lines
Each is dated where it stands, with the original text kept: the title, § Status's summary, d3's heading and size, § Consequences' NFR line, and BA/PM's owed line. BA/PM's list named three of these. Four more lines carry the same stale fact and are dated with them: both § Alternatives lines on 64 KiB, § Rollback's "returns to 576 KiB", and the open F2 line in § The probe's reading, which now records ruling 1. Slot arithmetic: 2^14 × 36 = 589 824, 2^14 × 40 = 655 360.

## 4. F2's K5 half: written, as a reading
It sits in `ADR-0075` under § What would falsify this, with a pointer at K5.
- **The reading.** F2 is one row on one clause, so one cut and one re-read, and rule 3 spent the cut. The build is the one re-read for both halves. A clean run below depth 6 on K5 is the second miss: STOP to Architect/Design, a defect check, then not merged.
- **Rejected: a re-read of the same code.** It could only replay a recorded `NFR-005` FAIL into a pass, which softens a floor whose level is the owner's.
- **It moves no bar or level.** Depth 6, the depth-7 WARN, "≥ base" reported, `G6`'s rule and `NFR-005`'s level all stand. K5 keeps its void rule: a void is not a miss.
- **It is a judgement.** F2 as written would have given a first K5 miss a cut and a re-read if the cut were unspent. A reader could call removing that a tighter consequence, though the bar is the same. So it stands only unless the Orchestrator overrules it before K4's PREREG seals.

## Calls for the Orchestrator
1. **Confirm or overrule the K5 reading before K4's PREREG seals.** My recommendation: confirm.
2. **d11 (d)'s list names "a second `G2` miss", and K5 is `G6`.** I did not add K5, because d11 (d) was settled on the owner's acceptance. Is a K5 second miss also a miss under d11 (d)? My recommendation: yes, ruled by you if you read it as within his word, put to him if not. K4's PREREG does not wait on it.

**Owner question: none today.**
