---
id: 20261021T095900Z-software-engineer-decision-15535dbd
kind: decision
by: software-engineer
at: 2026-10-21T09:59:00Z
verified_by: 
confidence: high (both headers re-read at 19abbdb1)
refs:
  - ABC-181
  - grugops/ABC-181
  - 8f8c88b3
  - 19abbdb1
  - QE-179-a
  - plans/tickets/ABC-181-status-panel-header-credits-the-catalog-with-a-lesson-it-does-not-hold.md
  - .grugops/context/qe-ABC-179/notes/20261021T091230Z-qe-e2e-observation-42fba2a4.md
supersedes: 
seal: sha256:ae1438f1b1cafede25eccf6d3a2b00ac88935e18a24f756e3d4b76828e59b39e
---

# ABC-181 SE wording decision (tip `8f8c88b3`)

- `src/status-panel.nfr.test.ts:12` "recorded in the catalog" is now "written in that file's own header". The full sentence reads
  "That is `src/gameend.nfr.test.ts`'s lesson, written in that file's own header and followed here."
- The sentence keeps `src/gameend.nfr.test.ts` as the lesson's source (`A2`). That file's header at `:11-13` says "a `vi.mock`
  factory is hoisted to file scope, so putting it in `gameend.test.ts` would re-route the module graph".
- The sentence no longer mentions the catalog. Nothing was added to `plans/nfr-catalog.md`, which the ruling fences.
- Only line 12 changed (1 insertion, 1 deletion). No rewrap. Line 11's trailing "That" and the "A count and not a clock"
  sentence (`:4-8`) are byte-identical.
