---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-13T11:44:09Z
sealed: false
refs: [ABC-101, ABC-014]
---

# Owner word, 2026-10-13 — ABC-101 glyph swap is permanent; no light/dark flag

Asked (from Frontend/UI's contract `design-ABC-101-glyphs`, note `…1c687529`): "The fix swaps the piece symbols so White is drawn filled and Black outlined … A light-background terminal would then show them inverted. What should ABC-101 promise for light terminals?" Options: (A) `--ascii` is the light fix, no new flag (recommended); (B) swap now plus a follow-up flag ticket; (C) the flag inside ABC-101.

Owner's answer (verbatim): **"Is someone using light terminal? I have not seen so we can make this swap permanent and no additional flag is needed."**

Recorded as option (A): the six Unicode pairs are swapped permanently in `src/render.ts` (White U+265A–U+265F filled, Black U+2654–U+2659 outline); no flag, no follow-up ticket; on a light terminal `--ascii` reads correctly. ABC-101 takes `A11a`–`A11g` as the contract states; size stays `M`.
