---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-13T11:19:16Z
sealed: false
refs: [ABC-101, ABC-015, ABC-014]
---

# Owner word, 2026-10-13 — ABC-101 UAT held; the piece-colour look is fixed IN ABC-101

**Owner's UAT report (verbatim):** "when i selected color black with \"--color black\" the black played first, this is against the rules. It seems there is bug, I should be black not AI playing a move first. My pieces still look white. difficulty 1 setting seemed to work fine."

**Orchestrator reading (pty, branch `98ea0a84` and main):**
- `--color` (US spelling) is refused with the usage line; the game the owner described was `--colour black`.
- With `--colour black`, the engine plays White and moves first (1.e4 from the book), which is the rule; the board is flipped (ranks 1→8 top to bottom, files h→a), the human's pieces at the bottom. Identical on main (pre-existing, not ABC-101's code).
- The human's pieces are drawn with the Unicode BLACK glyphs (♟♜♞♝♛♚, filled). On a dark terminal a filled glyph renders in the light foreground colour, so Black's pieces LOOK white and White's outline glyphs (♙♖…) look dark. `--ascii` (lowercase = Black) reads correctly.

**Owner's answers (verbatim, to "UAT word on ABC-101?" and "ticket for the glyph look?"):**
1. "It seems board was correctly switched as well since numbers were 8 and 7 on my side. This seems to be just pieces color issue. Fix in it ABC-101"
2. "Fix it in ABC-101"

**Ruling recorded:** ABC-101's UAT is HELD (neither accepted nor rejected). The difficulty behaviour is not disputed ("difficulty 1 setting seemed to work fine"). Scope of ABC-101 grows by the piece-colour look on a dark terminal, by the owner's word. Route: Frontend/UI design contract → BA/PM amendment of ABC-101 (criteria, size, DoR) → SE → QE → Security/NFR (if triggered) → owner UAT.
