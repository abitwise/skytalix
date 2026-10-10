---
id: 20261010T170427Z-software-engineer-decision-abc140-two-whole-statement-pins-in-the-drift-tripwire-seven-span-reach-three-instrument-docblock-f8b6efb4
kind: decision
by: software-engineer
at: 2026-10-10T17:04:27Z
verified_by:
confidence: high
refs:
  - ABC-140
  - ABC-137
  - ABC-136
  - ABC-057
  - ADR-0011
  - ADR-0029
  - R5d
  - QE-137-a
  - src/history-pane.nfr.test.ts
  - 20261010T163938Z-architect-design-decision-qe137-a-is-r5d-a-ticket-qe137-b-accepted-docblock-rides-e86924d7
supersedes:
---

# `ABC-140` spelling: two whole-statement literals in the drift tripwire after `R5c`; the reach comment says seven spans; clause 1's docblock counts three instruments and two properties

This note is hand-authored and unsealed. No `finding` is admissible on this install (see `AGENTS.md`). The
Architect decided what is pinned (`R5d`, `…e86924d7` §§ 1 and 3). This note records only how it is spelled.

1. **Placement: the recommended one.** Both pins go in the drift-tripwire `it`, after the `R5c` literal. The file
   keeps one pin site and one reach comment. Nothing argued for the composer tripwire's own `it`.
2. **Scan pin**, message "the composer tripwire scans EVERY production module". It is the whole statement, from
   its leading newline through `    );\n`. It is written on one line with `\n` escapes (`ABC-057` `D1`) and
   single-quoted because it holds `"`. It holds `${`, so it carries one
   `biome-ignore lint/suspicious/noTemplateCurlyInString`, in the same wording as `R5b`'s importer pin. That takes
   the count from 1 to **2**, as the page states.
3. **Comparator pin**, message "the composer tripwire compares with an EQUALITY". It is the whole statement, from
   `\n    expect(` through `.toEqual([COMPOSITION_ROOT]);\n`, framed and escaped the same way. It holds the
   tripwire's failure message. The comment above says that rewording the message reds here too, as intended.
4. **One `//` comment above the two pins.** It names `R5d` and says what is at stake: the composer tripwire is the
   second-composer kill's only holder. It lists the five spellings that drop that kill and says why each pin is
   whole. It also says the predicate's reach (`bindsAssembleFrame`) is `ADR-0029`'s and is not pinned.
5. **Reach comment.** "it pins five spans by TEXT" becomes "it pins seven spans by TEXT, all of them in this `it`".
   "Four are the guard's" becomes "Four are the licence guard's". The fifth is still clause 1's helper (`R5c`).
   New: "The sixth and seventh are the composer tripwire's own (`R5d`): its whole scan statement and its whole
   comparator." The re-run and not-tamper-proof sentences are kept, reflowed.
6. **Docblock.** The first line keeps `/**\n * \`ADR-0011\` CLAUSE 1`, so `plant.mjs`'s `H-SHADOW` anchor still
   occurs once. The new text says three instruments derive their set from this function: the frame-path probe,
   the composer tripwire and the licence guard. Each applies one named rule, and the three hold TWO properties.
   The probe and the composer tripwire share `COMPOSITION_ROOT`. The probe derives the frame path from that one
   root, and the tripwire makes that root fail closed (`ADR-0029` decision 2). The licence guard applies
   `LICENSED_DRIVERS` to the regex. The `NFR-002` / `ABC-029` sentence is kept.
7. **Not touched.**
   - The composer tripwire's code, `bindsAssembleFrame`, the helper, every call site and `:653`.
   - The five existing pin statements, each hash-identical.
   - No new `it`, no new file, no spawn.
   - No literal or comment spells `const LICENSED_DRIVERS: readonly string[]` or `const COMPOSITION_ROOT =`.
     Each declaration still occurs once.
