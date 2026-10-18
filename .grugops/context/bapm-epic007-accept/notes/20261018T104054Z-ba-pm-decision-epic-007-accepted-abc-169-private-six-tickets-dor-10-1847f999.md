---
id: 20261018T104054Z-ba-pm-decision-epic-007-accepted-abc-169-private-six-tickets-dor-10-1847f999
kind: decision
by: ba-pm
task: bapm-epic007-accept
at: 2026-10-18T10:40:54Z
verified_by:
confidence: high
refs:
  - EPIC-007
  - ADR-0044
  - ADR-0036
  - ABC-041
  - ABC-167
  - ABC-168
  - ABC-169
  - ABC-170
  - ABC-171
  - ABC-172
  - plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
  - plans/tickets/ABC-169-declare-the-engine-private.md
  - .grugops/context/wave-2026-09-25/notes/20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57.md
  - .grugops/context/wave-2026-09-25/notes/20261010T141247Z-orchestrator-decision-owner-word-uat-q4-5c8e2a17.md
supersedes:
---

# EPIC-007 ACCEPTED (owner, 2026-10-18); ABC-169 re-scoped to "Declare the engine private"; ABC-167..172 DoR 10 of 10

This note is hand-authored and unsealed (`scripts/context-io.ts` is absent on this install, so no `finding` was
attempted). The `at` time is this host's wall clock. The epic page and the ticket pages are authoritative. This note
gives only the choices and why. It extends `bapm-engine-revise`'s `…84e602dc` and does not supersede it.

## Decisions

1. **EPIC-007 → ACCEPTED, 2026-10-18, owner**, citing `…c3e81a57`. The frontmatter is `status: accepted` and stays in
   column `Backlog`, like the other open epics. Q12–Q15 are marked answered, and no owner question on the epic is open.
2. **ABC-169 re-scoped and renamed** to `plans/tickets/ABC-169-declare-the-engine-private.md`. Scope:
   `"license": "UNLICENSED"`, plus a Michniewski credit paragraph in the `src/evaluate.ts` header comment. The four MIT
   kit files are untouched. No `LICENSE` or `NOTICE` file. Size `XS`, `P1`.
3. **M10** is now `npm pkg get private license` → `"private": true`, `"license": "UNLICENSED"`, plus the
   comment-only credit.
4. **UAT reading for ABC-169: expected WAIVED, by measurement.** The diff names one production file, so the 2026-08-17
   file-level grep alone is not empty. The owner's Q4 word (`…5c8e2a17`) counts comment-only diffs as zero production
   lines. `A3` carries both checks: every changed line is a comment line, and the comment-stripped transpile output is
   byte-identical. If either check fails, the owner's UAT applies.
5. **Security/NFR for ABC-169:** `ABC-041` clause (a) fires on `package.json`, so a short hop is needed. `ADR-0036`
   (b1) and (b2) do not fire, because there is no executable line and no import edge.
6. **DoR item 10 ("no major unresolved blocker", where owner acceptance sits) ticked** on ABC-167, 168, 170, 171 and
   172. Each goes 9 → 10 of 10. ABC-169 is re-scored 8 → 10 of 10. ABC-172: Q14 = keep `npm run chess`, so Scope 3
   does not apply.

## Readings that differ from the brief's wording (at `main` `50e081fc`)

- **`"private": true` is already in `package.json:4`.** ABC-169 adds only the `license` line.
- **None of the four MIT kit files carries an in-file MIT notice.** `grep -E '\bMIT\b|SPDX|Copyright' tools/grugops/*`
  is empty. So "keep their notice" is recorded as "not edited; MIT on the owner's word". Adding a notice text needs
  the kit's copyright line, which is `UNKNOWN - verify`.
- The default credit wording is `ADR-0044` D13's at `459d6741`, minus `See NOTICE.` If the Architect's parallel
  `arch-adr0044-accept` hop rewrites it, D13 wins, and `A2` checks named strings, so it holds either way.

## Not done (fenced)

No diff to `src`, `tools`, `package*.json`, `vitest.config.ts` or `memory-bank/50-decisions`. `plans/board.md` and
`plans/traceability.md` were not touched. No test was run.
