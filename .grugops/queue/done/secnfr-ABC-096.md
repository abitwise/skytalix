---
result: PASS_WITH_RISKS
branch: grugops/ABC-096-opening-name
tip: 0f28b286
reviewed_tip: c11bfec8
code_commit: a48da51c
base: 6edadcf0
preregistration: 92b73c49
---

Security/NFR ABC-096: PASS_WITH_RISKS. 0 required fixes, 2 accepted LOW risks. Two commits on the branch: 92b73c49 (the
timing pre-registration and instruments, committed before any window) and 0f28b286 (3 notes in
`.grugops/context/secnfr-ABC-096/notes/`, result decision `…e1c94a07`; the raw window files; the page's Security/NFR
section; one trace row `ABC-096 (Security/NFR)`). Nothing under `src/` changed. Nothing was pushed or merged.

Clause (b) (ADR-0036, canonical clause-b.mjs, 6edadcf0..c11bfec8): limbs 1, 2 and 3 do not fire (0 (b1) lines, 0 new
runtime edges, 0 word hits). Ruling 2 by hand, holders {src/book-file.ts} at base and head: 0 lines, does not fire.
AR-095-L1UNIT is still open (clause-b.mjs unchanged since 341da4c1).

Security: the escape bar (A3/G7) holds on emitted frames, 14 hostile names x 2 modes (0 ESC, 0 C0, 0 DEL, 0 code points
above U+007F in ascii, 23 rows). The Pick<BookProbe,"openingName"> type behind import type is adequate. 0 new reads,
dependencies or spawns.

Timing (QE-096-d), window w1 CLEAN: gate passed 13:13:03Z after a foreign grugops-kit vitest blocked it 13:03-13:12Z.
0 vitest, 0 platform processes, thermal 0, AC, load1 4.52-5.17. Apple M3, Node v26.11.1.
- A4 < 16 ms: MET, max 0.447 ms.
- NFR-007 first call <= 30 ms cold (a real npm run chess child, openingName with 1 read inside): MET, max 6.047 ms.
- NFR-007 < 2 s: MET, max 222.1 ms.

Accepted risks:
- AR-096-C1CP LOW, owner the Orchestrator. Unicode-mode C1 and bidi code points from a book name reach the terminal.
  0 shipped names carry one. Recommended: an XS follow-up widening compile.ts's refusal, before the next re-pin.
- AR-096-DISKCOLD LOW, owner Architect/Design. A page-cache-cold first call was not read.

Checks at 0f28b286: qe-hop-integrity --ticket ABC-096 covered, exit 0; tools/grugops/qe-hop-integrity.test.ts 32 passed.
Next: Ready for UAT (the Orchestrator's move). UAT is not waived.
