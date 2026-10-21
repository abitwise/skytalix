---
id: 20261021T100356Z-qe-e2e-observation-b3b2ce86
kind: observation
by: qe-e2e
at: 2026-10-21T10:03:56Z
verified_by: 
confidence: high (each read run by QE at base 19abbdb1 / 59fc9215 and code tip 8f8c88b3, before opening the SE notes)
refs:
  - ABC-181
  - qe-ABC-181
  - grugops/ABC-181
  - 8f8c88b3
  - 18b3c993
  - 19abbdb1
  - QE-179-a
  - plans/tickets/ABC-181-status-panel-header-credits-the-catalog-with-a-lesson-it-does-not-hold.md
supersedes: 
seal: sha256:d4c67fa4300d39f20e81a1011afa4117e3c85b944b11e62f21169fa6afd5caf7
---

# ABC-181 QE acceptance readings (A1-A3), taken independently

- **A1 (command).** At `59fc9215` the page's command prints "That is `src/gameend·nfr·test·ts`'s lesson, recorded in the catalog and followed here." At `8f8c88b3` it prints nothing (exit 0). `grep -c 'recorded in the catalog'` gives 1 at base and 0 at the tip. `src/` at `59fc9215` and `19abbdb1` is identical.
- **A1 (QE read of the class).** Every header sentence that matches /catalog/ was listed (joined text, dots in code spans kept). At the tip there is exactly one, and `grep -n -i catalog` on the whole file hits only `:6`. That sentence is "A count and not a clock, … so the bar moves off the clock and onto a count (see `plans/nfr-catalog.md` for that move)." Its only code span is a path, not a quote, so there is nothing to `grep -F`. What it credits to the catalog is "that move", off the clock and onto a count, and the catalog holds it in substance. `plans/nfr-catalog.md:25` says "RESOLVED BY MOVING IT OFF THE CLOCK AND ONTO A COUNT" (char 9499), and the same line (char 1336) ties `ABC-016` `A13` to "a criterion that can fail at zero timing sensitivity". `:49` repeats "OFF THE CLOCK AND ONTO A COUNT" (char 3836). The catalog is byte-identical between `59fc9215` and the tip. **Pass.**
- **A2.** The rewritten `:12` reads "That is `src/gameend.nfr.test.ts`'s lesson, written in that file's own header and followed here." `src/gameend.nfr.test.ts` has a `/** */` header at `:1-17`. Its `:11-13` says "a `vi.mock` factory is hoisted to file scope, so putting it in `gameend.test.ts` would re-route the module graph …". So "that file's own header" is literally true. "That file" binds to `src/gameend.nfr.test.ts`, the only file named in its sentence. That file has no change between base and tip. QE-159-a's lens finds no new claim the source does not support. **Pass.**
- **A3.** `git diff --name-only 19abbdb1 8f8c88b3` lists only `src/status-panel.nfr.test.ts`. `19abbdb1..18b3c993` adds only the 3 SE notes. The one hunk is `@@ -12 +12 @@`, inside the header `/** */` (`:1-13`, closing `*/` at `:13` at base and tip). The files are byte-identical with `:12` removed from both. The TypeScript printer with `removeComments` gives the same sha256 `5a57734194f0…ce11a` (5739 chars) at base and tip. A one-file run (heap 400) passes 6 of 6. **Pass.**
