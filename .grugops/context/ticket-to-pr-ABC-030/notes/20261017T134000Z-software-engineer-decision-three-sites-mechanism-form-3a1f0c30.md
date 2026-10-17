---
id: 20261017T134000Z-software-engineer-decision-three-sites-mechanism-form-3a1f0c30
kind: decision
by: software-engineer
at: 2026-10-17T13:40:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-030
  - ABC-030
  - src/status-panel.nfr.test.ts
  - src/gameend.nfr.test.ts
  - src/san.nfr.test.ts
supersedes:
---

# Three sites, not four; the repair deletes the number and keeps the argument

1. **Scope is the re-score's three files** (page § Re-score 2026-10-12, `A2` amended). The brief says
   "the four `*.nfr.test.ts` files the page names"; the page's latest amendment fences
   `src/zobrist.nfr.test.ts` out (discharged at `40b77ac7`, `ABC-075`, already reads *"every test
   there"*). Its md5 is `bb4d52be…` before and after — zero lines touched.
2. **Wording = the discharged zobrist form**, so the four comments now read alike:
   *"would re-route the module graph for every test there"* (status-panel `:11`, gameend `:13`).
   The `vi.mock`-hoisted-to-file-scope argument is unchanged in each. No refresh (`26 -> 29` refused).
3. **san `:19`**: *"every one of the 52 rows in `san.test.ts`"* -> *"every one of the rows in
   `san.test.ts`"*. Whether 52 was right is left `UNKNOWN - verify`; the repair deletes it.
4. **`A4` read as scoped to the repaired sentences**, consistent with the re-score fencing the dated
   witness `src/gameend.nfr.test.ts:8` (*"Measured at the ABC-020 ... left all 45 tests ... green"*)
   out. Integers still in the three header comments, all either own-file or dated/sourced:
   gameend `45` (:8, dated witness, kept per test note 2), `150-ply` (rule constant); san `1/5`,
   `42 moves` (P60's legal-move count — `P60` is a literal FEN in this file, `:41-42`), `~97%`/`~3%`
   (`ADR-0004`'s recorded measurement), `four assertions` (own file); gameend `three assertions`
   (own file). None is a live count of a sibling file.
