---
kind: adr
id: ADR-0048
---
# ADR-0048: The repository is Apache-2.0. The CC BY-SA 3.0 evaluation tables are carved out in `NOTICE` and the `src/evaluate.ts` header until our own values replace them

## Status

**2026-10-25 — the carve-out ended (decision 7 done by `ABC-215`, merged at `main` `5c91e2e4`).** The values are
now made by rule. `NOTICE` and the `src/evaluate.ts` header no longer name CC BY-SA 3.0 (matches 0 and 0; base
`cac2b4e9` had 5 and 4). Recorded by Architect/Design (task `arch-adr0048-status`), on QE `…c2c3540f` and
Orchestrator `…ccf209d9`. Nothing else in this ADR moves.

**ACCEPTED** 2026-10-24 by Olger Oeselg (owner), verbatim *"accept ADR-0048 ; keep grugops under MIT ; ok, if no
creds."* (note `.grugops/context/owner-word-2026-10-24/notes/20261024T091000Z-orchestrator-decision-776bba9a.md`).
Recorded by Architect/Design (task `arch-accept-adr0048`, records only, at `main` `fb0a7703`).

- **OQ-214-3 is answered: the four kit files stay MIT** (decision 5's default). The built `NOTICE` does not change.
- **The Architect/Design drift rows (1–7) are applied** in `ADR-0044` (§ Records drift). Rows 11–13 are BA/PM's.
- **The `NOTICE` layout as built is adopted** (decision 3): one line break moved, words unchanged.

Previously **PROPOSED** 2026-10-24 by Architect/Design (task `arch-licence-adr`, records only, at `main` `d4d49c5a`).
**Acceptance is the owner's.** This is a new ADR (`memory-bank/45-standing-rulings.md`, 2026-10-22). No agent
moves it to accepted.

- **What it would supersede:** `ADR-0044` D13's licence reading only. That is the "private, all rights
  reserved" bullet, the "no `LICENSE` file and no `NOTICE` file" sentence, and the "re-derive our own values
  first" precondition for distribution. It would also supersede the matching § Revision — private rows `P1`
  and `P3`. D13's name bullet (`skytalix`, Q13, Q14) and its CC0 and public-domain bullet stand. D13's kit-file
  bullet stands, with its notice now known (decision 5).
- **D13 opens itself:** *"Opening the licence later is a new owner decision. It reopens this D13."* The owner
  made that decision (below).
- **`ABC-214` builds on this text before acceptance and merges only after it** (`ABC-214` § Dependencies).
- *This is an engineering role's reading, not legal advice.* Every legal conclusion here is `UNKNOWN - verify`.

## Context

- **The owner's words.** These are transcriptions, not stamps:
  - Apache-2.0: *"let's put license as apache 2.0"*, in `.grugops/context/owner-word-2026-10-23/notes/20261023T220500Z-orchestrator-decision-28633db0.md`.
  - Path A (`OD-214-1`): *"accept your recommendations, other session paused"*, in
    `.grugops/context/owner-word-2026-10-24/notes/20261024T105800Z-orchestrator-decision-fb0468ff.md`. The
    recommendation he answered: Apache-2.0 now, with the CC BY-SA 3.0 tables carved out in `NOTICE` and the
    `src/evaluate.ts` header. The re-derivation comes later, as its own ticket in `EPIC-008`.
- **The licence facts** come from Security/NFR's licence note `…21dd2358` (task `security-nfr-public-repo`,
  `LIC-PUB-1`, MEDIUM, owner-owned). That branch is held, so it is cited for licence facts only:
  - The repository is public. `package.json` says `"license": "UNLICENSED"`, and no `LICENSE`, `NOTICE` or
    `COPYING` file is tracked.
  - `PIECE_VALUE` and the six piece-square tables in `src/evaluate.ts` are Tomasz Michniewski's
    "Simplified Evaluation Function" values, under CC BY-SA 3.0, credited in the file header.
  - **Collection reading** (values reproduced unchanged): CC BY-SA 3.0 § 4(a) forbids terms that restrict
    recipients' rights in the tables. Saying that the tables stay under CC BY-SA 3.0 answers it.
  - **Adaptation reading** (the changed layout and the king value of 0): § 4(b) needs BY-SA, a later version or
    a compatible licence. Apache-2.0 is **not** compatible. `UNKNOWN - verify`.
  - Whether the tables are protected at all is `UNKNOWN - verify`: probably not in the EU or Estonia, and
    unsettled in the US (`…15c4fd4e`).
  - The kit's own `LICENSE` reads "MIT License, Copyright (c) 2026 Olger Oeselg". The owner holds that copyright.
- **The build shape** (files, criteria and default `NOTICE` text) is `ABC-214`. This ADR does not restate it.

## Decision

1. **The repository is licensed under Apache-2.0.**
   - The SPDX id is exactly `Apache-2.0`.
   - `LICENSE` is the verbatim text that `ABC-214` `A3` pins.
   - `package.json` and the lock root read `"license": "Apache-2.0"`.
   - `"private": true` stays, so npm still refuses `npm publish`. Distribution stays a clone (`ADR-0018`).
2. **Copyright line: `Copyright 2026 Olger Oeselg`, in `NOTICE`** (the default in OQ-214-2). How far copyright
   protects AI-assisted code is `UNKNOWN - verify`. That does not change the line.
3. **Path A: the evaluation values are carved out.** They are declared to stay under CC BY-SA 3.0, outside the
   Apache grant, in two places:
   - a `NOTICE` section;
   - two header-comment lines in `src/evaluate.ts`.

   `ABC-214` Scope 5–7 gives the default wording, and **this ADR adopts it unchanged**. So `ABC-214` Scope 5's
   "the ADR's wording wins" changes nothing.
   - *2026-10-24, at acceptance:* the built `NOTICE` breaks the line before the title, so `A5`'s string check
     finds it: `…Tomasz Michniewski's` / `"Simplified Evaluation Function", published at` /
     `https://www.chessprogramming.org/Simplified_Evaluation_Function` (`bb8d4432`, note `…e2623df7`). The words
     are unchanged, and this ADR adopts that layout.
4. **The carve-out names exactly seven identifiers:** `PIECE_VALUE`, `PAWN_TABLE`, `KNIGHT_TABLE`,
   `BISHOP_TABLE`, `ROOK_TABLE`, `QUEEN_TABLE` and `KING_TABLE`. The list stays the same if `ABC-205` merges.
   The source of every new king value in `ABC-205`'s build is below. It was read on `grugops/ABC-205` at `4f650a45`,
   read only, against `main` `d4d49c5a`.

   | value in the build | source | on the list? |
   |---|---|---|
   | `KING_TABLE` (64 values) | Michniewski's "king middle game" table, unchanged. It is byte-equal to base and to `c487d89c`, and equal to the page's table as fetched 2026-10-24. The build keeps it as the middlegame half of the blend | **Stays on** |
   | `KING_ENDGAME_TABLE` (64 values, new) | Ours, by rule: `40 − 15 × m`, where m is the Manhattan distance to the nearest of d4, e4, d5 and e5. All 64 cells equal the rule. It is **not** the page's "king end game" table: 54 of 64 cells differ. The 10 that agree are the corners (−50), the four centre squares (40), and b7 and g7 (−20). The rule's range, −50 to 40, is also the page's range | **Does not join** |
   | `PHASE_WEIGHT` = N 1, B 1, R 2, Q 4, and `PHASE_MAX` = 24 (new) | The `ABC-205` design ruling (`…1fb6e1bc`), not the page. The page has no phase weights and no blend: it switches tables on a material rule | No |
   | `KING_EXPOSURE_QUEEN_SCALE` = 3 (new) | Ours: the value of the game-1 analysis probe (`ABC-205` § Design ruling, item 1) | No |
   | The shelter gate's 0 (a castled bonus is not paid without shelter) | Ours (`ADR-0031` addendum `A3`) | No |

   - **Engineering reading:** sharing a −50 to 40 range with the page is not copying its table. A linear
     distance rule is a method, not the page's values. `UNKNOWN - verify`.
   - **If `ABC-205` merges first,** `ABC-214` `A5`'s base check fires, because the transpiled `src/evaluate.ts`
     differs from `c487d89c`. BA/PM's re-read then finds this table: the list is unchanged.
   - `ABC-205`'s build also edits header line 20. It appends "The king endgame table is this project's own." to
     the sentence that `ABC-214` Scope 7 anchors on.
     - The two diffs touch adjacent comment lines, so the later merge rebases and keeps both.
     - `A6` still measures comment-only against its own base.
   - `KING_ENDGAME_TABLE` is covered by Apache-2.0 by default. It is **not** named in the carve-out section,
     because `A5` asks for exactly the seven.
5. **The kit files.**
   - **The four kit files in `tools/grugops/` stay MIT,** as D13 says, and `NOTICE` names them. They are
     `reference-check.js`, `test-skip-integrity.js`, `uat-spec-integrity.js` and `host-protection.js`.
     - Their notice is now known: "MIT License, Copyright (c) 2026 Olger Oeselg". That closes D13's
       `UNKNOWN - verify`.
     - None of them carries the notice in the file. `NOTICE` is where it is stated.
   - **The other seven files in `tools/grugops/` are this project's own.** Apache-2.0 covers them.
   - **The tracked kit outputs fall under Apache-2.0 by default. No `NOTICE` section is added.** There are 10:
     - `.claude/settings.json` and the six `.claude/skills/grugops-*/SKILL.md`;
     - `.gemini/settings.json`;
     - `.github/copilot-instructions.md`;
     - `.pi/prompts/grugops.md`.

     The installer writes them for this repository. The owner holds the kit's copyright, so licensing them under
     Apache-2.0 touches nobody else's rights.
   - **Folding the four kit files into Apache-2.0 too** (OQ-214-3) is open to the owner and **not recommended**.
     It gains nothing today and changes one more `NOTICE` section. *Answered 2026-10-24: the owner kept them MIT
     ("keep grugops under MIT", `…776bba9a`).*
6. **The CC0 and public-domain parts need nothing**, as D13 already says: the opening book (`ADR-0023`,
   `data/opening-book/ATTRIBUTION.md`), mulberry32 and splitmix64. The perft positions and counts from the CPW
   "Perft Results" page are facts, probably unprotected (`UNKNOWN - verify`, INFO). `NOTICE` does not list them.
7. **The re-derivation replaces D13's precondition.**
   - D13 required "re-derive our own values first" before any distribution. Publication breached that
     (`LIC-PUB-1`). Under path A, the carve-out covers the tip now, and the re-derivation follows as its own
     `EPIC-008` ticket. That ticket is cut by BA/PM on the owner's word (task `bapm-ABC-214-path-a`).
   - In the same change as the new values, that ticket removes the `NOTICE` section and the two header lines.
   - It replaces all seven identifiers, `KING_TABLE` included. `KING_ENDGAME_TABLE` needs nothing.
   - This ADR sets no date for it. Its order against `ABC-205` and `ABC-207` is the Orchestrator's.
8. **Public history is not rewritten.** Three older public versions carry the values without credit. Removing
   them needs a force push, and that is the owner's call under `LIC-PUB-1`.
9. **A bundle carries `NOTICE`.** D13 says "the web project's licence is its own". It stands. A bundle of the
   engine is now a distribution of Apache-2.0 code plus the carved-out values. Apache-2.0 § 4(d) asks that
   `NOTICE` travel with it. Whether that meets BY-SA 3.0 under the Adaptation reading is OQ-214-4,
   `UNKNOWN - verify`. Path B's re-derivation removes the question.

## Records drift (`ABC-214` § Records drift, rows 1–14)

**Nothing here is edited before the owner accepts this ADR.** The one exception is a "PROPOSED" pointer added now
to `ADR-0044` § Status. The edits below are made **on acceptance**, by the role named. Done tickets' dated
readings are kept as history.

*Applied 2026-10-24, on acceptance:* rows 1–7 by Architect/Design (task `arch-accept-adr0048`), and the
`ADR-0044` § Status pointer is made final. Rows 11–13 are BA/PM's hop (task `bapm-epic007-licence-line`).

| # | where | on acceptance | by |
|---|---|---|---|
| 1, 2, 4 | `ADR-0044` D13: the licence bullet, the precondition and the web-project bullet | One dated line under D13's heading: "Licence reading superseded by `ADR-0048` (accepted <date>): Apache-2.0, the tables carved out, re-derivation as its own ticket". The bullets stay as history | Architect/Design |
| 3 | `ADR-0044` D13: the kit bullet | Pointer only: its `UNKNOWN - verify` notice is closed by decision 5 here | Architect/Design |
| 5 | `ADR-0044` § Revision — private (`P1`, `P2`, `P6`) and § Owner questions Q12/Q15 | One dated row in § Revision: "`ADR-0048`: Apache-2.0 (`…28633db0`), path A (`…fb0468ff`)". The old rows stay | Architect/Design |
| 6, 7 | `ADR-0044` § Consequences (config, distribution) and § Rollback | Pointer to this ADR in the existing D13 sentences. The Rollback line ("the licence is a separate decision") stands | Architect/Design |
| 8, 9, 10 | `ABC-169` (Done): title, Scope 1, `A4` and § Out of scope | **Not edited.** These are a Done ticket's dated readings. `ABC-214` `A1` replaces the value | — |
| 11 | `EPIC-007` M10 | One dated line: M10 was MET on `ABC-169`, and `ABC-214` supersedes its target. The MET reading stays | BA/PM |
| 12 | `EPIC-007` acceptance box, § Scope, ticket table, Q12, web project | One dated line in the acceptance box pointing to this ADR | BA/PM |
| 13 | `EPIC-007` `RISK-EPIC007-07` | Disposition: it fired at publication. Path A: carved out now, re-derived later (decision 7) | BA/PM |
| 14 | `ADR-0023` "no licence of its own … all rights reserved" (measured 2026-09-19) | **Not edited.** It is a dated measurement. The CC0 book needs nothing under Apache-2.0 | — |

Not drift, unchanged: `"private": true`; `45-standing-rulings.md` on deployment; `ADR-0044` D8; the "unlicensed"
of the `ADR-0011` clause 3 licence set (`ADR-0011`, `ABC-029`, `ABC-057`, `ABC-136` and `ABC-137`); and
`ABC-190`'s dated reading.

## Alternatives

- **Path B: re-derive first, then Apache-2.0 with no carve-out.** **Not chosen:** the owner chose A
  (`OD-214-1`). B removes the Adaptation question at the tip. Its cost is that the repository stays
  `UNLICENSED` behind a value-changing `EPIC-008` ticket and its D reading.
- **Stay public and `UNLICENSED`.** Rejected by the owner's word: Apache-2.0.
- **GPL-3.0 or AGPL-3.0-or-later.** These would keep the tables through BY-SA 3.0 → 4.0 → GPLv3
  (`…15c4fd4e`; `UNKNOWN - verify`). Not chosen: the owner picked Apache-2.0.
- **Move the tables into their own file** (a cleaner form of the carve-out under the Collection reading). Not
  now. It is a code change and an open legal point (`ABC-214` § Out of scope). It would be a ticket on the owner's
  word, and path A's re-derivation makes it short-lived.
- **Put `KING_ENDGAME_TABLE` on the list "to be safe".** Rejected. Its values are ours by rule (decision 4). It
  would also break `A5`'s exactly-seven check.
- **Fold the four kit files into Apache-2.0.** Not recommended (decision 5). Not chosen: the owner kept them MIT
  (`…776bba9a`).

## Consequences

- **`ABC-214` builds as written**, with the [A] rows. It merges after this ADR is accepted.
- **`LIC-PUB-1` at the tip:**
  - The repository carries an explicit licence and an explicit carve-out.
  - The Collection reading is answered.
  - The Adaptation reading stays `UNKNOWN - verify` (OQ-214-4) until the re-derivation merges.
  - History is unchanged (decision 8).
- **No NFR moves. No gate changes.**
  - Under `ABC-214` `A6`, the emitted code is unchanged.
  - `ABC-041` clause (a) fires on `package.json` (the ticket's Security hop).
- **`ABC-205` and `ABC-207` are not blocked.**
  - `ABC-205`'s new king values add nothing to the carve-out (decision 4).
  - `ABC-207`'s mobility values are not Michniewski's.
- **Apache-2.0 grants are perpetual and irrevocable** (its §§ 2–3). A later change of licence does not withdraw
  the grant from copies already received. That is an engineering reading, `UNKNOWN - verify`.

## Rollback

- **Before acceptance:** mark this ADR `rejected`. Remove the "PROPOSED" pointer in `ADR-0044` § Status. Then
  `ABC-214` does not merge.
- **After acceptance, before `ABC-214` merges:** on the owner's word, mark this ADR `superseded` and revert the
  `arch-accept-adr0048` records commit, which restores the `ADR-0044` text. Then `ABC-214` does not merge.
- **After `ABC-214` merges:** revert its commit, and mark this ADR `superseded` by whatever the owner chooses.
  Copies already received under Apache-2.0 keep their grant (Consequences).
