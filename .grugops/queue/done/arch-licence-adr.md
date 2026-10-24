---
subtask: arch-licence-adr
role: architect-design
ticket: plans/tickets/ABC-214-the-repository-is-licensed-apache-2-0.md
ref: .grugops/context/arch-licence-adr/
branch: same records branch as arch-accept-owner-words-2026-10-24 (cut from main d4d49c5a)
width: shares one agent (claim_cap 2)
---

# The licence ADR (next free number), PROPOSED

## Do
- Draft the ADR ABC-214 names: Apache-2.0 for the repository, path A (NOTICE + src/evaluate.ts header carve-out of the CC BY-SA 3.0 tables; re-derive later as its own ticket). It supersedes ADR-0044 D13's private reading; handle the § Records drift list.
- Status **PROPOSED**. A new ADR is the owner's to accept: do NOT mark it accepted.
- Name the source of every new king value in ABC-205's build (grugops/ABC-205, read only) so the carve-out identifier list is right: does KING_TABLE (or its tapered pair) leave the list or stay on it? State it in the ADR and your note.
- Licence facts only from the held security branch's licence note; copy no homelab detail. Legal readings stay UNKNOWN - verify.

## Fences / Publish
- As arch-accept-owner-words-2026-10-24. Seal notes (task arch-licence-adr), then move this brief and its claim.md to done/.

## Result

**Done, records only. `ADR-0048` is PROPOSED, and acceptance is the owner's.** It is on the shared branch
`grugops/arch-accept-owner-words`, cut from `d4d49c5a`. The head is `894c079a`: the ADR is `0c8f287b`, the
`ADR-0044` pointer is `ad8dfa13`, and the notes are `894c079a`. Not pushed and not merged.

- **ADR:**
  `memory-bank/50-decisions/ADR-0048-the-repository-is-apache-2-0-and-the-cc-by-sa-evaluation-tables-are-carved-out-in-notice-until-re-derived.md`.
  - 0048 is free on every local branch.
  - On acceptance it would supersede `ADR-0044` D13's private reading: the private / `UNLICENSED` bullet, the "no
    `LICENSE`/`NOTICE`" sentence, and the "re-derive first" precondition.
- **Decisions:**
  - Apache-2.0, with `"private": true` kept.
  - `Copyright 2026 Olger Oeselg` in `NOTICE`.
  - Path A: the carve-out uses `ABC-214`'s default `NOTICE` and header wording, **adopted unchanged**.
  - Exactly seven identifiers.
  - The four kit files stay MIT, with their notice now known. The other seven `tools/grugops/` files and the 10
    tracked kit outputs fall under Apache-2.0.
  - The CC0 and public-domain parts need nothing.
  - The later `EPIC-008` re-derivation replaces D13's precondition and removes the carve-out.
  - Public history is not rewritten.
  - A bundle carries `NOTICE`.
- **The `ABC-205` king-value finding** (read only, `grugops/ABC-205` `4f650a45`):
  - **`KING_TABLE` stays on the list.** It is byte-equal to base and to `c487d89c`. It is Michniewski's "king
    middle game" table, used unchanged as the middlegame half.
  - **`KING_ENDGAME_TABLE` does not join.** All 64 cells are ours by the rule `40 − 15 × m`. 54 of 64 differ from
    the page's king end game table, and the 10 that agree are the rule's corners, centre and b7/g7.
  - `PHASE_WEIGHT`/`PHASE_MAX`, the queen scale 3 and the shelter gate's 0 are ours or the design ruling's. None is
    on the page.
  - **The list stays seven whichever order `ABC-205` and `ABC-214` merge in.**
- **Records drift:** all 14 rows have a disposition. The edits are made on acceptance: `ADR-0044` by
  Architect/Design, `EPIC-007` by BA/PM. `ABC-169` and `ADR-0023` stay as dated history.
  - The only edit now is a "PROPOSED" pointer in `ADR-0044` § Status. D13 stands until acceptance.
- **Licence facts** come only from the held branch's licence note `…21dd2358`, read as one file. No homelab detail
  is copied. Legal readings stay `UNKNOWN - verify`.

**Empty-diff check** (the output is empty, 0 bytes):

```
$ git diff --stat d4d49c5a..HEAD -- src tools package.json
$
```

**Notes** (sealed by `context-io.js` `admitAndAppend`, grugops 2.1.0; read back; 0 findings), in the worktree under
`.grugops/context/arch-licence-adr/notes/`:
- `20261024T080253Z-architect-design-decision-83df1e49`: the ADR;
- `20261024T080253Z-architect-design-observation-05d1c022`: the king-value source.

**Owner decides:**
- accept or reject `ADR-0048` (before `ABC-214` merges);
- OQ-214-3, kept at the default: the four kit files stay MIT.

**Untouched:** `plans/board.md`, the held branch, and `src/`.

### Trace row (for the Orchestrator to append; this hop did not edit `plans/traceability.md`)
`| ABC-214 (licence ADR) | owner …28633db0 Apache-2.0, …fb0468ff OD-214-1 = A; Security/NFR …21dd2358 | grugops/arch-accept-owner-words @ 0c8f287b + ad8dfa13 (on d4d49c5a) | — (docs only) | ABC-205 king values read at 4f650a45: KING_TABLE stays, KING_ENDGAME_TABLE ours by rule (64/64) | ADR-0048 PROPOSED; supersedes ADR-0044 D13 private reading on acceptance; drift rows 1–14 disposed | notes …83df1e49, …05d1c022 |`
