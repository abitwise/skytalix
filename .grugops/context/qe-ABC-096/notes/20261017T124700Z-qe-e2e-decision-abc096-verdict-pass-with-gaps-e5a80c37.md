---
id: 20261017T124700Z-qe-e2e-decision-abc096-verdict-pass-with-gaps-e5a80c37
kind: decision
by: qe-e2e
task: qe-ABC-096
at: 2026-10-17T12:47:00Z
verified_by:
confidence: high
refs:
  - ABC-096
  - plans/tickets/ABC-096-show-the-named-opening-when-the-book-knows-it.md
  - ADR-0043
  - QE-096-a
  - QE-096-b
  - QE-096-c
  - QE-096-d
  - QE-096-e
  - QE-096-f
  - QE-096-g
  - QE-096-h
  - 20261017T124500Z-qe-e2e-observation-abc096-fence-gates-independent-reads-4c7a2e19
  - 20261017T124600Z-qe-e2e-observation-abc096-mutants-qe-vs-se-9b3d51f0
  - 20261017T123600Z-software-engineer-observation-abc096-criteria-gates-mutants-8f2d4b60
supersedes:
---

# QE `ABC-096` on `grugops/ABC-096-opening-name` (tip `2acebaa8`, code `a48da51c`, base `6edadcf0`): **PASS_WITH_GAPS**

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **I took no timing reading.**

| criterion | QE reading | ruling |
|---|---|---|
| `A1` family and cut | 2,456 shipped names through the real seam, both modes, against my own oracle: 0 mismatches. `75a8cd2e62c99edd` shows `Ruy Lopez`. The odd-offset astral case, read outside the suite, is correct | **MET**; one clause not pinned (`QE-096-a`, `-b`) |
| `A2` 23 rows | 23 rows on every frame I read: known name, no name, out of book, both modes | **MET** |
| `A3` escape bar | suite row on the emitted frame, with non-vacuity; `sanitize` only removes, never expands | **MET** |
| `A4` bound | ≤ 21 units, `W` 21, no `more)` and no lone surrogate on all-astral names. `< 16 ms` was **not read by QE** | **MET** except time (`QE-096-d`) |
| `A5` current position or nothing | memo mutant Q4 killed in 3 files; take-back and new game rows green | **MET** |
| `A6` nothing else moved | must-not-change list byte-identical; `book.test.ts` unmodified and green; base and tip `inBook`/`bookMove` equal on 5,679 positions; 0 draws; lint 0 diagnostics | **MET** |
| `A7` bad `n` | Q12 killed; 0 warnings | **MET** |
| `A8` one probe | 1 `createBookProbe(`; pin moved to `render: makeRenderSeam(mode, orientation, book)`; `Pick` type and `import type`; Q6, Q6b, Q7 and Q18 killed. Warning once, launch to `quit`: `CLI_DEEP` green | **MET** (`QE-096-e`) |
| `A9` precedence | Q3 and Q5 killed. A live child showed the rejection line in place of the name | **MET** |
| `A10` guard | real probe over in-memory bytes; positive control `[true, false]`, `reads` 1; Q8, Q11, Q15 and Q20 killed by it | **MET** |
| fence | 7 files, all in the table; 0 new files; 0 dependency changes | **conforms** |
| tests | 58 / 1810 at base, 58 / 1822 at tip: **+12** | **as stated** |
| gates at tip | lint 0 (113 files), typecheck 0, build 0, `npm test` 0 (58 / 1822, `success` true), skip 0, `No findings.`, `CLI_DEEP=1` 0 (10 passed) | **green** |
| UAT waiver | production `src/` grep prints `book.ts`, `cli.ts`, `render-seam.ts` | **does not apply: UAT owed** |
| mutants | 22: 19 killed, 2 survived (Q2, Q9), 1 equivalent (Q16) | see `QE-096-a`, `-b` |

**Gap register.** No criterion is unmet by the code, and none of these blocks the move out of `In Review`.
- **`QE-096-a` LOW, a test gap and not a defect.** `A1`'s *"leading whole code points"* is not pinned. A
  code-unit `slice` cut (Q2) passes the full lane and `tsc`, because every astral test name is all-astral and the
  cut at 18 lands on a pair boundary. The production cut is correct (read directly).
  - **Fix:** one row in `src/render-seam.test.ts`, which is inside the fence. In unicode mode, `"a"` + 20 ×
    `U+1D11E` must show `a` + 8 × `U+1D11E` + `...` with no lone surrogate. That moves the count to 1823.
  - **Recommended:** an SE repair before merge, because it is one row inside the fence. The Orchestrator may
    instead cut it as a follow-up. Either way the 0 astral names in the shipped book mean no player sees the
    difference today.
- **`QE-096-b` INFO.** `A1`'s separator `": "` is not pinned against `":"` (Q9). This is equivalent on the
  shipped book, which has 0 names with a `:` not followed by a space. The same repair could add a `"Foo:Bar"`
  name.
- **`QE-096-c` INFO, outside the fence.** The parenthesis in `src/cli.real-engine.test.ts:405`, *"the probe is
  asked only then"*, is false under `ADR-0043` D7. Frame 0's lookup now makes the first call. The row's
  assertions hold. I did not edit it. A one-line follow-up would need the fence widened, which is the
  Orchestrator's call.
- **`QE-096-d` OWED to Security/NFR.** `A4`'s `< 16 ms` and `NFR-007`'s first call `≤ 30 ms` were read only by the
  SE (6.44 ms worst, a loaded host). QE took no timing reading, per the brief. Measure them in a quiet window. A
  foreign vitest, from another project, was running on this host during my run.
- **`QE-096-e` INFO.** `A8`'s "warning exactly once, launch to `quit`" is evidenced only on the opt-in `CLI_DEEP`
  lane, `ABC-095` `A5` (stream half). The default `npm test` does not carry it. The lane was green at the tip.
- **`QE-096-f` INFO, for the owner at UAT.** The cut makes 12 families share 5 shown texts. For example,
  `Blackmar-Diemer Ga...` stands for `…Gambit`, `…Gambit Accepted` and `…Gambit Declined`, and
  `Queen's Indian Def...` stands for three families. `A1` allows this. It is cosmetic.
- **`QE-096-g` INFO, by design.** The cut is made before `sanitize` (`ADR-0043` D3). In ASCII mode, a long family
  with stripped characters shows fewer than 18 units before `...`. 0 shipped families are affected, because none
  of the 5 accented families is longer than 21.
- **`QE-096-h` INFO.** `src/cli.test.ts`'s reference frames now use `SHIPPED_BOOK`. The change is necessary and
  correct, but it is a child-versus-in-process consistency check, not an oracle for the name. The oracle is
  `src/render-seam.test.ts`. Also outside scope: `AGENTS.md`'s `CLI_DEEP` comment still reads "7 passed". The lane
  has 10 rows since `ABC-095` and `ABC-101`, and that predates this branch.
- **Equivalent mutant.** Q16 (the empty-family check removed) yields `[""]`, which packs to a blank region. The
  frame is byte-identical, so the mutant is equivalent and no test is owed.

**Next column.** QE recommends leaving `In Review` toward `In Security/NFR` for `QE-096-d`, then `Ready for UAT`.
UAT is **not waived**; the owner's word signs it (page § UAT observations, plus `QE-096-f`). The Orchestrator
decides whether `QE-096-a` is repaired before merge. Nothing was merged or pushed.
