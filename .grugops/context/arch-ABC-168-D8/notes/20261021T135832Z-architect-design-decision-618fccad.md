---
id: 20261021T135832Z-architect-design-decision-618fccad
kind: decision
by: architect-design
at: 2026-10-21T13:58:32Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - ADR-0044
  - ADR-0044 D8
  - EPIC-007
  - EPIC-007 M9
  - A7
  - grugops/ABC-168
  - 2f02d158
  - 41f5b366
  - plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
  - plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
supersedes: 
seal: sha256:aa1e0ff5da1a15e8be7892f4098b9b13461384f3f348daa6b8e862f3f9e0c97b
---

# ABC-168 D8: what BA/PM must change on the ABC-168 page and in EPIC-007 M9 (records only; the Architect edited neither)

- **Scope 2:** "tsconfig.build.json as D8 specifies" becomes "as D8 specifies, with "include": [] (ADR-0044 § Addendum 2026-10-21)".
- **A7, bullet 2:** "dist/ holds no *.test.js, and no cli.js, turn-loop.js or line-input.js" becomes "dist/ holds no *.test.js, cli.js or line-input.js; turn-loop.js, history.js, frame.js and render.js may be present as type-only emits and are not loaded (next bullet); grep -l 'import(' dist/*.js prints nothing".
- **A7, away-from-clone bullet:** add "after rm -f <scratch>/d/turn-loop.js <scratch>/d/history.js <scratch>/d/frame.js <scratch>/d/render.js". Its expected output (one book warning, a legal bestmove, exit 0) is unchanged.
- **Out of scope:** after "or to any core file", add: "including moving EngineSeam out of src/turn-loop.ts; and any prune of dist/ (ADR-0044 § Addendum 2026-10-21: dist/ may hold type-only emits)".
- **Test note 4:** QE's fresh-clone re-run of A7 includes the rm -f run and the import( grep.
- **EPIC-007 M9:** the same change as A7 bullet 2. "no turn-loop.js" becomes "dist/uci.js loads no turn-loop.js, as A7 measures". M9 is owner-accepted, so the owner confirms the rewording (see below).
- **Unchanged:** A12's file list already names tsconfig.build.json. Scope 6's four pin edits and the build value "tsc -p tsconfig.build.json" are unchanged, and so are size S and P1.
- **DoR stays 10 of 10.** Item 2 is sharper. Item 4 still holds: A7 stays a binary, measurable reading, with exit codes and a run that fails visibly when a loaded file is missing.
- **Owner:** M9 is part of the accepted EPIC-007. Its wording moves from "dist holds no turn-loop.js" to "dist/uci.js loads none". The owner should confirm this before QE/UAT reads A7. If he refuses, the fallback is (b), with its turn-loop.ts edit and an ADR amendment.
