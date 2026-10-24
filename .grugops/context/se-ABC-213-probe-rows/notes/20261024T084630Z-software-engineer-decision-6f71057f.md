---
id: 20261024T084630Z-software-engineer-decision-6f71057f
kind: decision
by: software-engineer
at: 2026-10-24T08:46:30.593Z
verified_by: 
confidence: high: the page's A6 letter and QE-213-d's own reading
refs:
  - se-ABC-213-probe-rows
  - ABC-213
  - QE-213-a
  - QE-213-b
  - QE-213-c
  - QE-213-d
  - ADR-0047
  - grugops/ABC-213
  - 7adc85ac
  - e46db08e
  - src/pgn.test.ts
  - src/pgn-file.ts
  - qe-ABC-213/20261024T084131Z-qe-e2e-observation-1bb1938c
  - qe-ABC-213/20261024T090500Z-orchestrator-decision-502866f9
supersedes: 
seal: sha256:7aa943cfff447a705af05c675a52dae0b7588319e786fb86d24891e5d8454dcf
---

# ABC-213 QE-213-d header wording NOT made: the page's A6 fences it; stopped per the brief

Software Engineer, task `se-ABC-213-probe-rows`. The brief: "If the page's fences forbid either edit, STOP and report — do not stretch them."
- The page's **A6** reads: "`src/pgn-file.ts`'s diff touches the cleanup branch only." QE read A6 as a hunk count, "one hunk `@@ -70 +70,5 @@`", and QE-213-d gives A6 as the reason the header was left alone: "It rides with the owed D4 dated line, since `A6` kept the diff to the cleanup branch."
- Rewording header lines 15–16 would add a second hunk outside the cleanup branch to the delivered `src/pgn-file.ts` diff. That breaks A6 as written and voids QE's A6 reading at the verdict. "Comment only, no code line moves" is a reading A6 does not give. Taking it would stretch the fence.
- So `src/pgn-file.ts` is byte-identical to `e46db08e`. **QE-213-d stays open.** It can close by: (1) the Orchestrator or BA/PM amending A6 (for example, "code lines touch the cleanup branch only; the header comment may restate D4"); or (2) carrying the wording with the `ADR-0047` D4 dated line (`arch-adr0047-d4-ABC-213`) or the next ticket that edits `pgn-file.ts`. Either way, re-queue an SE hop for the one-line comment. Any edit to the holder routes to In Security/NFR (ADR-0036 limb 1), and ABC-213 goes there anyway.
