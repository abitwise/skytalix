---
id: 20260919T111000Z-architect-design-observation-seven-book-sources-and-their-licences-read-on-the-licensors-own-pages-5e2a9c71
kind: observation
by: architect-design
at: 2026-09-19T11:10:00Z
verified_by:
confidence: high
refs:
  - ABC-092
  - ABC-093
  - ABC-096
  - EPIC-005
  - RISK-004
  - NFR-006
  - ADR-0023
  - memory-bank/50-decisions/ADR-0023-opening-book-source-is-lichess-chess-openings-under-cc0.md
supersedes:
---

# SEVEN CANDIDATE SOURCES OF OPENING THEORY, EACH LICENCE READ ON THE LICENSOR'S OWN PAGE, 2026-09-19

**Neutral facts, not a recommendation** — the recommendation is the sibling `claim` note. Every
quotation below was read on the date stated at the URL stated, through `WebFetch` / `curl`; nothing
was downloaded into the repository (`ABC-092` `A6`: 0 bytes of book data, 0 files under `src/`).
`ABC-092` test note 2: *"Verify the licence text against the licensor's own published page, not
against a summary site."* — done for every row. Where a figure could not be read on the page it is
`UNKNOWN - verify`, never estimated.

## Two facts about this repository, measured first

- **No licence of its own**: no `LICENSE`, no `NOTICE`, no `"license"` key in `package.json`;
  `"private": true`. Default copyright = all rights reserved. Any copyleft/ShareAlike source would
  impose an outbound licence the owner has never chosen.
- `dependencies` is `{}` (the basis of the ASVS `V15.1.1`/`V15.2.1` `high` → `low` override).

## The table

| # | Source | Licence id | Redistribution clause, verbatim (URL, date) | Attribution obligation | Provenance | Size vs `NFR-006` (1,048,576 B) | Carries opening NAME? |
|---|---|---|---|---|---|---|---|
| C1 | `lichess-org/chess-openings` — <https://github.com/lichess-org/chess-openings> | `CC0-1.0` | README, <https://raw.githubusercontent.com/lichess-org/chess-openings/master/README.md>, 2026-09-19: *"As a collection of facts, this data set is in the public domain. Considerable effort was spent curating and cleaning the data. Insofar as that qualifies for copyright, the work is released under the CC0 Public Domain Dedication."* Full dedication in repo as `COPYING.txt` (7,048 B). CC0 § 2, <https://creativecommons.org/publicdomain/zero/1.0/legalcode>, 2026-09-19: *"…waives, abandons, and surrenders all of Affirmer's Copyright and Related Rights … (iii) in any current or future medium and for any number of copies, and (iv) for any purpose whatsoever, including without limitation commercial, advertising or promotional purposes"* | **None** (CC0 § 2–3 impose no condition; § 4 reserves trademark/patent only) | Curated by the Lichess project; TSVs `a`–`e` by ECO volume, columns `eco`, `name`, `pgn` (+ `uci`, `epd` in `dist/`); Parquet mirror at <https://huggingface.co/datasets/Lichess/chess-openings> | **388,052 B raw** (GitHub contents API 2026-09-19: a 66,338 / b 77,372 / c 132,306 / d 69,199 / e 42,837); **3,704 rows** (HF card). Compiled: `UNKNOWN - verify` at `ABC-093` `A5` | **Yes** — `name` column, English |
| C2 | Lichess open database, standard rated games — <https://database.lichess.org/> | `CC0-1.0` | Page, 2026-09-19: *"Database exports are released under the Creative Commons CC0 license. Use them for research, commercial purpose, publication, anything you like. You can download, modify and redistribute them, without asking for permission."* | None | Every rated standard game on Lichess, monthly `.pgn.zst` files since 2013-01 | **164 files, 2.57 TB, 8,130,696,420 games** (Standard section footer, `curl` 2026-09-19) | Via `[Opening]` PGN tag — `UNKNOWN - verify`; the tag is itself derived from C1 |
| C3 | `official-stockfish/books` — <https://github.com/official-stockfish/books> | `CC0-1.0` | `LICENSE`, <https://raw.githubusercontent.com/official-stockfish/books/master/LICENSE>, 2026-09-19: title *"CC0 1.0 Universal"*, § 2 Waiver identical to C1's quoted text | None | Fishtest opening sets (EPD positions, PGN lines) for engine testing | e.g. `noob_4moves.epd` 1,837,365 positions; `UHO_Lichess_4852_v1.epd` 2,632,036 positions; `8moves_v3.pgn` 34,700 games (repo README figures) — all ≫ 1 MB | **No** — no ECO, no name |
| C4 | Perfect 2023 Polyglot `.bin` (Sedat Canbaz) — <https://sites.google.com/site/computerschess/perfect-2023-books> | freeware, own terms (no SPDX id) | Page, 2026-09-19: *"The Perfect opening books are freeware. Nobody is allowed to sell copies of Perfect books. It may be freely distributed for non-commercial purposes as long as no any files in this package are modified."* *"Copyright © 2002-2026 Sedat Canbaz. All rights reserved."* | n/a — redistribution is conditional (non-commercial, unmodified) | Author's own SCCT engine-tournament lines, *"tested over than 1.000.000 SCCT games (since 2002)"* | `.bin` size not stated — `UNKNOWN - verify` | **No** — Polyglot = key/move/weight/learn |
| C5 | `eco.pgn` shipped with pgn-extract v26-04 — <https://www.cs.kent.ac.uk/people/staff/djb/pgn-extract/help.html> | program GPL (version unstated); **file: not stated on the page** | Page, 2026-09-19: *"Full ANSI C source and a 32-bit Windows binary for the program are available under the terms of the GNU General Public License."* On the file: *"A PGN file of ECO classifications is distributed with this version. I believe that this was put together by Ewart Shaw, Franz Hemmer and others, to whom appropriate thanks is due."* | If GPL applies: licence notice + source-form terms; **unclear whether it applies** | Third-hand: authorship stated as belief, permission scoped to distribution with pgn-extract | not measured — `UNKNOWN - verify` | Yes (ECO + names) |
| C6 | Wikipedia (List of chess openings / ECO articles) — <https://en.wikipedia.org/wiki/Wikipedia:Copyrights> (last edited 2026-08-15) | `CC-BY-SA-4.0` (+ GFDL) | Wikipedia:Copyrights, 2026-09-19: *"Most of Wikipedia's text and many of its images are co-licensed under the Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA) and the GNU Free Documentation License (GFDL)."* Legal code § 2(a)(1), <https://creativecommons.org/licenses/by-sa/4.0/legalcode>, 2026-09-19: *"reproduce and Share the Licensed Material, in whole or in part; and produce, reproduce, and Share Adapted Material."* § 3(b)(1): *"The Adapter's License You apply must be a Creative Commons license with the same License Elements, this version or later, or a BY-SA Compatible License."* | § 3(a)(1): *"identification of the creator(s)…"*, *"a copyright notice"*, *"a notice that refers to this Public License"*; Wikipedia: *"a hyperlink or URL to the page or pages you are re-using"* or *"a list of all authors"*; modifications must be indicated | Wiki pages, community-edited | Pages, not data; extraction unbounded — `UNKNOWN - verify` | Yes |
| C7 | Hand-authored main lines (typed from memory by an agent or the owner) | none needed — moves/names are facts, no third-party Work | n/a | n/a | **None checkable** — an agent's recollection | trivially < 1 MB | Yes, if typed |

## Observations that fall out of the table, stated as facts

1. Three candidates (C1, C2, C3) are CC0 and need no attribution; of those only **C1 carries names
   and fits under `NFR-006` raw**. C2 is 2.57 TB and gets its names from C1; C3 has no names.
2. Two candidates fail on **licence** as written: C4 (non-commercial, no-modification) and C6
   (ShareAlike onto an unlicensed repository).
3. One fails on **provenance before licence**: C5's terms are not stated on any page for the file
   itself — it does not meet `ABC-092` § Scope's "published and readable" precondition.
4. C7 has no external Work to license but also nothing a maintainer can verify against, which
   `EPIC-005` § Scope ("attributable") and `ABC-093` `A1` (byte-identical regeneration "from the same
   source") both require.
5. C1 is a **named-line table, not a weighted book**: no play frequencies; line lengths vary from
   1 ply to beyond 12. Both are `ABC-093`'s to handle (weights assigned; depth truncated to `A3`).
