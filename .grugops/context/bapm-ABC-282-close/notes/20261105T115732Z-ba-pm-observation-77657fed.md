---
id: 20261105T115732Z-ba-pm-observation-77657fed
kind: observation
by: ba-pm
at: 2026-11-05T11:57:32Z
verified_by: 
confidence: high for what git and grep show at main 572edf13; two items UNKNOWN - verify
refs:
  - bapm-ABC-282-close
  - grugops/bapm-ABC-282-close
  - ABC-282
  - ABC-078
  - ABC-221
  - ABC-303
  - ABC-305
  - EPIC-011
  - ADR-0071
  - a6ae8227
  - 04ebeb7e
  - 22931005
  - QE-282-f
  - QE-282-g
  - QE-282-j
  - qe-ABC-282/20261105T113544Z-qe-e2e-decision-5191f871
  - qe-ABC-282/20261104T230342Z-qe-e2e-observation-e4b8527a
  - orch-2026-10-30a/20261105T114920Z-orchestrator-decision-16e0ec2c
supersedes: 
seal: sha256:f4f10e72c0fce8aed61311db13e08ff5956ea236e80c30a240ea0f5a8351b5ba
---

# bapm-ABC-282-close observation: the figures agree with their sources; five lines are still owed, none of them inside this hop's fence

BA/PM, task `bapm-ABC-282-close`. Read with git and grep at `main` `572edf13`. Nothing run.

**Checked.**
- `a6ae8227` is a merge on `main`, parents `7117ce75` and `64116740`, and `04ebeb7e` is its ancestor. `git diff 04ebeb7e a6ae8227 -- src` lists only `ABC-304`'s three test files, so the production lines are the ones QE read.
- A0-1 and A0-2 in `…aadd2d48` equal the literals in `src/engine.test.ts`; A0-3's three lines equal `src/uci-session.test.ts`.
- `src/engine.ts`'s header already carries D12's per-pass form, so `ABC-078` A3 and the code say the same thing.
- The fourth A10 search has no `position` line of its own, so it runs on the third fixture. The page says "the third position".
- `…5191f871` supersedes `…a6a2ba28`. QE-282-a is closed by `…4f8f7f5d`, QE-282-j by `…16e0ec2c`.

**Owed, outside this hop's fence. None edited.**
1. **`src/uci-session.test.ts`'s title, "ABC-221 A10 — three searches".** QE-282-f owes three → four. `se-ABC-303-main`'s brief does not name it and says to move no other expectation; the other hops the Orchestrator listed do not touch `src/`. It has no hop.
2. **`ADR-0071` § Status still reads "Not in force until `ABC-282` merges".** `…16e0ec2c` says it is in force. `arch-ABC-282-close` as listed names `ADR-0066` d5 and QE-282-l, not this line.
3. **`EPIC-011` § Dependencies still says `ABC-303`'s C2′ waits on `ABC-282`, and `ABC-305` on A4's lock,** and its `ABC-289` line says the census gates "the second of them". The brief gave this hop W1's row only.
4. **`ABC-305` § Dependencies and DoR row 5 still read "after A4" and "either order".** Both events are past; `ABC-282` landed first, so the page's "whichever lands second" names this ticket. The brief gave this hop the census line only.
5. **The `AGENTS.md` lane line ("3 x 59.5 s")** is the Scribe's, on the Orchestrator's list.

**`UNKNOWN - verify`.** Which branch stopped A4's moves at 59 500 (QE-282-f). Whether the census lets the next lane-adding merge go: `secnfr-census-1105` has not reported, so the pages give the gate and not its result.
