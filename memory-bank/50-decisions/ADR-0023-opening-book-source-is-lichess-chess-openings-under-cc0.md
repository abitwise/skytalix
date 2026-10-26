---
kind: adr
---
# ADR-0023: The opening-book source is `lichess-org/chess-openings` (CC0 1.0) — RATIFIED by the owner 2026-09-19

## Status

*2026-10-26:* a **PROPOSED** amendment for `ABC-211` is at the end of this file. Acceptance is the owner's. Decisions
1–5 stand unchanged until he answers.

**accepted** — ratified by the project owner Olger Oeselg in session, 2026-09-19, verbatim: *"I ratify ADR-0023: the opening-book source is lichess-org/chess-openings under CC0 1.0."* Transcribed by the Orchestrator (`human_admission` is `off`; this is a hand-authored record of a human's word, not a stamp). `RISK-004` moved to *resolved* in the same commit (`A5`). `data/opening-book/ATTRIBUTION.md` (`A4`) is written by `ABC-093` at the moment it pins the upstream commit SHA — the file's own required content (the pinned SHA and read date) does not exist until the data is fetched, so writing it earlier would record a pin that was never made.

**History — proposed** 2026-09-19 by Architect/Design at task `owner-rulings-2026-09-19`, subtask
`research-abc092-book-source`, Workflow 07, on the owner's word *"2. i don't have preferred source,
we can research that"* (`.grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md`).

**That word authorises RESEARCH. It is not a ratification, and this role cannot supply one.** `ABC-092`
`A1` requires *"the project owner as ratifier by name — with a status of `accepted`, not `proposed`"*;
`ABC-092` § Dependencies records that *"the choice is the owner's"*; and `ADR-0012` § Status, which
ratified an architecture ADR on Architect/Design's own authority, drew the line explicitly: the
book's **source and licence** is *"a legal and product choice, which is the owner's"*. So this ADR
stays `proposed` until the line below is filled in by the owner, and nothing downstream of it may
start: `ABC-093` § Dependencies — *"No byte of source data may be copied before its ADR is
`accepted`"*.

**`RISK-004` does NOT move at this hop.** Its row in `plans/nfr-catalog.md` § "The risks" stays
unedited, un-resolved and undated. `ABC-092` `A5` moves it on delivery, and delivery is the
ratification, not this research.

### Ratification (the owner's, by name — blank until he writes it)

> Ratified by: **Olger Oeselg** (project owner)   Date: **2026-09-19**
>
> The sentence that ratifies, so nobody has to guess what counts: **"I ratify ADR-0023: the
> opening-book source is `lichess-org/chess-openings` under CC0 1.0."** On that sentence the
> Orchestrator (or the role he routes it to) flips this Status to `accepted`, writes the ratifier's
> name and date above, moves `RISK-004` to *resolved* with a pointer here (`A5`), and writes the
> attribution file at the path in Decision clause 3 (`A4`). Until then: zero bytes of book data.

## Context

`EPIC-005` § Scope bullet 1: *"Research and select opening lines from a legally clean, attributable
source; record the source and its licence in the epic's first ticket before any data is copied."*
`ABC-092` is that ticket. `RISK-004` (`plans/nfr-catalog.md`) rules the licence question
distribution-dependent and closes the easy exit: *"redistribution is triggered by the data reaching
anyone at all, and a `git clone` distribution is still redistribution."* The owner's 2026-09-19 ruling
on `ABC-100` makes `git clone` + `npm start` the channel, so the data WILL reach clones.

What the data must feed (read from the tickets, not assumed):

- `ABC-093` compiles it into ONE static artifact, ≤ 1,048,576 bytes (`NFR-006`, `A5`), longest line
  ≥ 8 plies and recorded maximum ≤ 12 plies (`A3`), ≥ 3 weighted replies to `1. e4` (`A4`), carrying
  *"where the source supplies it — the name of the opening"*, plus the attribution file this ADR
  names (`A6`).
- `ABC-094` probes it by position; `ABC-096` shows the **name** and treats it as untrusted input.
  `ABC-096` § Dependencies adds the edge that decides half of this research: *"opening names may
  themselves be part of what the source licence covers."* A source with no name field makes
  `ABC-096` unbuildable (its § Dependencies says so).
- `EPIC-005` § Out of scope: no runtime network, no deep coverage (8–10 plies of mainline).

Two facts about THIS repository that bear on the choice, both measured 2026-09-19:

- **The repository has no licence of its own.** No `LICENSE`, no `NOTICE`, no `"license"` key in
  `package.json` (`private: true`). Under default copyright that is *all rights reserved*, which means
  any **copyleft / ShareAlike** source would impose an outbound licence on a repository that has not
  chosen one — an owner-level decision this ADR must not make by the back door.
- `package.json` `dependencies` is `{}`. The ASVS `V15.1.1`/`V15.2.1` severity override
  (`high` → `low`) on record rests on *"zero runtime dependencies"*; `ABC-092` § Security asks
  whether it still holds once a third-party CONTENT dependency enters (ruled in Consequences).

**Every licence below was read on the licensor's own page on 2026-09-19 and is quoted verbatim.**
Summaries are what `RISK-004` says is not enough. Sizes are the publisher's own figures or a byte
count from the GitHub contents API; nothing was downloaded into this repository (`A6`: 0 bytes).

## Decision

**1. The source is `lichess-org/chess-openings`** — <https://github.com/lichess-org/chess-openings>
— five TSV files `a.tsv`…`e.tsv` (one per ECO volume), columns `eco`, `name`, `pgn`; the repo's
`dist/` build adds `uci` and `epd`. The upstream commit to pin is chosen at `ABC-093` and recorded in
the attribution file; the compiler reads the pinned files, never a live URL.

**2. Licence identifier: `CC0-1.0`** (Creative Commons CC0 1.0 Universal Public Domain Dedication).

The licensor's own statement, `README.md`, read 2026-09-19 at
<https://raw.githubusercontent.com/lichess-org/chess-openings/master/README.md>:

> "As a collection of facts, this data set is in the public domain. Considerable effort was spent
> curating and cleaning the data. Insofar as that qualifies for copyright, the work is released under
> the CC0 Public Domain Dedication."

The repository carries the dedication in full as `COPYING.txt` (7,048 bytes; title line
*"CC0 1.0 Universal"*). The redistribution clause, CC0 1.0 § 2 *Waiver*, read 2026-09-19 at
<https://creativecommons.org/publicdomain/zero/1.0/legalcode>:

> "To the greatest extent permitted by, but not in contravention of, applicable law, Affirmer hereby
> overtly, fully, permanently, irrevocably and unconditionally waives, abandons, and surrenders all
> of Affirmer's Copyright and Related Rights and associated claims and causes of action, whether now
> known or unknown (including existing as well as future claims and causes of action), in the Work
> (i) in all territories worldwide, (ii) for the maximum duration provided by applicable law or
> treaty (including future time extensions), (iii) in any current or future medium and for any
> number of copies, and (iv) for any purpose whatsoever, including without limitation commercial,
> advertising or promotional purposes (the "Waiver")."

and § 3 *Public License Fallback*, for jurisdictions where a waiver is ineffective:

> "…Affirmer hereby grants to each affected person a royalty-free, non transferable, non
> sublicensable, non exclusive, irrevocable and unconditional license to exercise Affirmer's
> Copyright and Related Rights in the Work (i) in all territories worldwide, (ii) for the maximum
> duration provided by applicable law or treaty (including future time extensions), (iii) in any
> current or future medium and for any number of copies, and (iv) for any purpose whatsoever,
> including without limitation commercial, advertising or promotional purposes."

**How it applies to a `git clone` of this repository, in one sentence (`A2`):** every clone is
"any number of copies … in any current or future medium … for any purpose whatsoever", so a clone
carrying the compiled book — and the opening NAMES in it, which are the same Work — needs no
permission, imposes no licence on this repository, and is unaffected by the repository having no
licence of its own.

**3. Attribution: NONE REQUIRED by the licence — stated as a finding, not left as silence (`A4`) —
and an attribution file is kept anyway, for provenance.** CC0 § 2–3 impose no attribution condition;
§ 4 reserves only trademark/patent rights and disclaims warranty (*"No trademark or patent rights
held by Affirmer are waived… Affirmer offers the Work as-is and makes no representations or
warranties of any kind"*). What the project owes itself is the answer to `ABC-092`'s user's question
— *"where did this data come from and were you allowed to ship it?"* — so **`ABC-093` keeps the file
at exactly:**

`data/opening-book/ATTRIBUTION.md`

containing: the source name and URL; the pinned upstream commit SHA and the date the pinned files
were read; the licence identifier `CC0-1.0` with the URL of the legal code; the README sentence above,
verbatim; and the line *"CC0 requires no attribution; this file records provenance."* It is written
**on ratification, not before** — it does not exist at this hop. `data/` sits outside `src/` so the
`--dir src` test lane (`NFR-008`) never walks it; whether the compiled artifact lives beside it is
`ABC-093`'s format decision and is not made here.

**4. Size implication for `NFR-006` (informed, not verified — `ABC-092` § Security).** The raw source
is **388,052 bytes** across the five TSVs (`a` 66,338 / `b` 77,372 / `c` 132,306 / `d` 69,199 /
`e` 42,837; GitHub contents API, read 2026-09-19) and **3,704 rows** (the licensor's Parquet mirror
card at <https://huggingface.co/datasets/Lichess/chess-openings>, read 2026-09-19; the README itself
states no count). So even a compiler that copied every byte of source unchanged would sit at 37% of
the 1,048,576-byte bar; truncation to ≤ 12 plies (`ABC-093` `A3`) can only shrink it. **The compiled
figure is `UNKNOWN - verify` until `ABC-093` `A5` measures the real file.**

**5. What the source IS and IS NOT — so `ABC-093` starts with the right expectation.** It is a
**named-line table** (ECO code, name, move sequence), not a weighted book: it carries no play
frequencies. `ABC-093` `A4`'s weights are therefore the compiler's to assign (uniform across the
sibling lines of a node is enough to meet "≥ 3 replies with non-zero weight" — the table has many
distinct named replies to `1. e4`). Lines vary in length; some exceed 12 plies and the compiler
truncates. Both are consequences of the source, recorded here so they are not discovered at
`ABC-093`'s gate.

## Alternatives

Six candidates considered and not chosen. Each rejection states its true reason; two are rejected
on licence, two on provenance, two on fitness — and "clean licence" alone was never the winner's
only merit, so the list was not assembled to make it look inevitable (`ABC-092` test note 3).

| # | Candidate | Licence (read 2026-09-19, licensor's page) | Attribution | Size vs `NFR-006` | Carries names? | Rejected because |
|---|---|---|---|---|---|---|
| R1 | **Lichess open database**, standard rated games — <https://database.lichess.org/> | CC0: *"Database exports are released under the Creative Commons CC0 license. Use them for research, commercial purpose, publication, anything you like. You can download, modify and redistribute them, without asking for permission."* | none | **164 files, 2.57 TB, 8,130,696,420 games** (page footer of the Standard section) | via PGN `[Opening]` tag — `UNKNOWN - verify`, and Lichess derives that tag from the chosen source anyway | **Fitness / provenance of the pipeline.** Licence is clean, but this is game records, not theory: the "source" would really be an aggregation program over gigabytes of monthly `.pgn.zst` that a maintainer could not reproduce byte-for-byte (`ABC-093` `A1`) without the same download. Its names come from `chess-openings`, so choosing it would add a 2.57 TB detour to reach the same names. |
| R2 | **`official-stockfish/books`** (EPD/PGN opening sets used by Fishtest) — <https://github.com/official-stockfish/books> | CC0-1.0 (`LICENSE`, title *"CC0 1.0 Universal"*, § 2 Waiver identical to the text quoted in Decision 2) | none | e.g. `noob_4moves.epd` 1,837,365 positions, `UHO_Lichess_4852_v1.epd` 2,632,036 positions, `8moves_v3.pgn` 34,700 games — every set is orders of magnitude over 1 MB before compilation | **No.** Positions/lines only; no ECO, no name field | **Fitness.** Built for engine testing (balanced/unbalanced starting positions), not for playing named mainline theory; carries no name, which makes `ABC-096` unbuildable. Licence is clean. |
| R3 | **Perfect 2023 Polyglot `.bin`** (Sedat Canbaz) — <https://sites.google.com/site/computerschess/perfect-2023-books> | Freeware, own terms: *"The Perfect opening books are freeware. Nobody is allowed to sell copies of Perfect books. It may be freely distributed for non-commercial purposes as long as no any files in this package are modified."* Copyright *"© 2002-2026 Sedat Canbaz. All rights reserved."* | n/a — redistribution is conditional | `.bin` size not stated on the page — `UNKNOWN - verify` | **No.** Polyglot carries key/move/weight only | **LICENCE.** Two clauses fail `RISK-004` outright: *non-commercial only* (a restriction this repository, with no licence of its own, cannot promise to propagate) and *"as long as no any files … are modified"* — compiling into `ABC-093`'s own format IS modification. No names, so `ABC-096` would be unbuildable regardless. |
| R4 | **`eco.pgn` shipped with pgn-extract** (David J. Barnes, v26-04) — <https://www.cs.kent.ac.uk/people/staff/djb/pgn-extract/help.html> | Program: *"Full ANSI C source and a 32-bit Windows binary for the program are available under the terms of the GNU General Public License"* (version not stated on the page). The file: *"A PGN file of ECO classifications is distributed with this version. I believe that this was put together by Ewart Shaw, Franz Hemmer and others, to whom appropriate thanks is due."* | GPL notice + source-form obligations if GPL applies; unclear if it does | not measured — `UNKNOWN - verify` | Yes (ECO + names) | **PROVENANCE, then licence.** The licensor's own page does not state that `eco.pgn` is under the GPL, or under anything; its authorship is stated as a belief ("I believe…") and the permission on record is for distribution *with pgn-extract*. A third-hand file whose terms cannot be read on any page fails `ABC-092` § Scope's *"published and readable"* precondition before a licence question is even reached; and if the GPL does apply, it is copyleft landing on an unlicensed repository (see R5). |
| R5 | **Wikipedia, "List of chess openings" and the ECO articles** — <https://en.wikipedia.org/wiki/Wikipedia:Copyrights> (last edited 2026-08-15) | CC BY-SA 4.0 (co-licensed GFDL): *"Most of Wikipedia's text and many of its images are co-licensed under the Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA) and the GNU Free Documentation License (GFDL)."* Legal code § 3(b)(1), <https://creativecommons.org/licenses/by-sa/4.0/legalcode>: *"The Adapter's License You apply must be a Creative Commons license with the same License Elements, this version or later, or a BY-SA Compatible License."* | § 3(a)(1): retain *"identification of the creator(s)…", "a copyright notice", "a notice that refers to this Public License"*; Wikipedia: *"a hyperlink or URL to the page or pages you are re-using"* or *"a list of all authors"* | pages, not data — extraction effort unbounded; `UNKNOWN - verify` | Yes | **LICENCE.** The compiled book is *Adapted Material*; ShareAlike would oblige this repository to release it — and arguably the artifact's surroundings — under CC BY-SA, an outbound-licence decision the owner has never taken (the repository has NO licence today). Attribution by author list is also impractical for a wiki. The bare list of names is arguably uncopyrightable fact, but "arguably" is exactly what `RISK-004` refuses to ship on. |
| R6 | **Hand-authored main lines** (an agent or the owner types 8–10 plies of the ~20 best-known openings from memory) | none — moves and opening names are facts; no third-party Work is copied | none | tiny; trivially under 1 MB | Yes, if typed | **PROVENANCE.** `EPIC-005` § Scope requires a *"legally clean, **attributable** source"*; an agent's recollection is not attributable to anything a maintainer can check, and `ABC-093` `A1` (byte-identical regeneration "from the same source") has no source to regenerate from. It is the honest fallback if the owner rejects every external source — and it would be recorded then as *its own* ADR, not smuggled in as a "curation" of this one. |

**Also considered and not tabled:** the proprietary *Encyclopaedia of Chess Openings* (Chess
Informant) — copyrighted and sold, no published redistribution terms; and any online explorer
(Lichess/ChessDB APIs) — `EPIC-005` § Out of scope declines runtime network *permanently*, so they
are not sources for a static book at all.

## Consequences

- **Positive.** The one candidate that is clean on all three axes the tickets need: licence (CC0,
  no attribution, no copyleft, no commercial restriction), names (the `name` column is the whole
  point of the dataset, and `ABC-096`'s "names may be covered by the licence" edge is closed by the
  same waiver), and size (388,052 bytes raw, 3,704 rows — under `NFR-006` before compilation). It is
  a plain text TSV a compiler can read without a binary parser, which is what `ABC-093`'s "the
  compiler validates the source before emitting" wants.
- **Negative, named.** (a) No play-frequency weights — `ABC-093` invents them (uniform is enough for
  `A4`; anything richer is a later ticket, not a scope creep here). (b) Lines are ECO classification
  lines, not a tuned repertoire: some are short (1–2 plies), some exceed 12 plies; coverage is broad,
  not deep, which is what `EPIC-005` asked for ("variety-and-speed feature, not a theory database").
  (c) The dataset is community-curated and edited over time — hence the **pinned commit** in the
  attribution file, so `ABC-093` `A1`'s byte-identical regeneration has a fixed input.
- **ASVS `V15.1.1` / `V15.2.1` — does *"zero runtime dependencies"* still hold?** `claim`, medium
  confidence, owner Architect/Design at `EPIC-006`: **narrowly, yes.** `dependencies` stays `{}` and
  no third-party *code* enters — the book is data compiled once and checked in, with no update
  channel, so there is no vendor patch to track on a timeframe. What the override's wording did NOT
  anticipate is a third-party *content* dependency; the correct posture for it is the one `ABC-093`
  (compiler validates before emit) and `ABC-096` (name is untrusted input, sanitised and bounded)
  already carry, and `V15.x`'s remediation-timeframe clause is not the right instrument for data.
  Recorded here; the override's sentence should be amended at `EPIC-006` to say "zero runtime CODE
  dependencies; one pinned, validated CONTENT dependency (`ADR-0023`)".
- **`RISK-004` stays open until ratification.** `plans/nfr-catalog.md` is not edited by this hop.
- **`ABC-057`'s licence-guard sense is untouched.** That guard is about *internal import* licensing
  (`LICENSED_DRIVERS`); this ADR is about *data redistribution*. Whether the guard should also
  witness `data/opening-book/ATTRIBUTION.md` stays the open question `ABC-092` § Dependencies left
  it — not decided here.
- **Migration / rollback surface is one file plus one artifact.** See Rollback.

## Rollback

- **Before ratification:** nothing to roll back. This ADR is a proposal; if the owner names a
  different source, this file is superseded by `ADR-0024-…` and stays as the record of what was
  considered. Zero bytes of data exist in the repository to remove.
- **After ratification, if the source must change** (a licence dispute — improbable under CC0 — or a
  quality problem in the data): delete `data/opening-book/ATTRIBUTION.md` and the compiled artifact,
  supersede this ADR, re-run `ABC-093`'s compiler against the new source. No `src/` module names the
  source; `ABC-094` probes an artifact, not a provenance, so the seam is the compiler input and
  nothing else — that is the seam this ADR draws deliberately.
- **Detection row:** any `git clone` of this repository containing opening-book data while this ADR
  still reads `proposed` is a breach of `ABC-092` `A6` / `ABC-093` § Dependencies, and the data is
  removed before anything else happens.

## Proposed amendment 2026-10-26 (`ABC-211`): a source for English lines past the named openings. PROPOSED

### Status

**PROPOSED** 2026-10-26 by Architect/Design (task `arch-source-ABC-211`, records only, at `main` `1df54ba6`).
**Acceptance is the owner's.** A new or changed source and licence is his (`ABC-092`; `ADR-0012` § Status; standing
ruling 2026-10-22). No agent picks an option. No byte of a new source is copied before he does.

- **Default without an answer:** nothing changes. Decisions 1–5 stand, and `ABC-211` stays in Backlog, held.
- **The answer that settles it:** one option id from the table below, e.g. *"ADR-0023 ABC-211: O0"*.

### Context

- `ABC-211` § Scope 1 asks for a source that holds English lines beyond the named openings, game 1's 3...b6 among
  them. `A1`: the book holds ≥ 1 White move at the position after 1.c4 c5 2.Nc3 Nf6 3.Nf3 b6.
- **No route inside this ADR.** Each was read at this hop, in a scratchpad outside the repo:
  - **The pinned source cannot reach the position at any depth.** 3,865 rows, longest 36 plies. **0 rows** reach the
    position at any ply, with transpositions included and no 12-ply cut. 8 rows pass the position after 3.Nf3. Black's
    moves there are Nc6 (6), d5 (1) and e5 (1). 9 rows hold all six game-1 moves in another order, and none of them
    reaches the position. So raising `maxPly` would not help either (that is `ADR-0037`'s, and `EPIC-005` `A3`'s).
  - **The re-pin rule gives nothing.** The upstream `master` is the pinned commit `a6189a30`, committed 2026-10-06.
    All five sha256 values equal the pins in `compile.ts`.
  - **The shipped book is exactly compile(pin).** It is byte for byte the same, 356,526 B.
- **The motivating move is gone at base.** `QE-207-f` (`qe-ABC-207`, `…cc744e8c` and `…dc779c4a`): since `ABC-215`,
  `main`'s own search plays 4.d3 (depth 8, +56) at the game-1 position, not 4.Qa4?!. The page's pain was 4.Qa4 at
  −72 cp. A book move there now saves think time. It no longer fixes a known bad move.
- **The format holds one source.** `ADR-0037` D1(e) has `"source":{"repo","commit"}`, which is one object. A second
  source cannot be recorded without changing that field, and `ABC-211` `A3` says "format unchanged".
  - The player's reader, `src/book.ts:96`, reads only `format` and `positions`, and it refuses any `format` other
    than 1. `source` is read only by `tools/opening-book/book.test.ts`.
  - So a provenance change costs 0 `src/` lines, if `format` stays 1.

### Options (each licence read 2026-10-26 on the licensor's own page)

| id | option | licence | measured against `ABC-211` | what it would take | Architect's view |
|---|---|---|---|---|---|
| **O0** | **No new source.** This ADR is unchanged, and `ABC-211` is closed undelivered | — | — | BA/PM closes it (`status: dropped`, as `ABC-205`/`ABC-207`), with the owner's veto open. 0 bytes | **Recommended** |
| **O1** | **Add `official-stockfish/books` `8moves_v3.pgn`** at commit `a804a97e709f40aa75a00f9d19e84915b7a3a45c` (repo HEAD, 2026-10-16; the file last changed 2019-12-16). Only lines whose first move is 1.c4 | `CC0-1.0`: the repo `LICENSE`, 7,048 B, title *"CC0 1.0 Universal"*. GitHub's licence API reads `CC0-1.0`. The waiver is decision 2's text | 34,700 lines of 16 plies, 4,192 of them starting 1.c4. 30 lines pass the game-1 position: e4 17, e3 5, d4 5, g3 3. The 1.c4-only subset has 16: e4 11, e3 3, d4 1, g3 1. **`A1` met.** Merged at ≤ 12 plies: **715,259 B** (68.2 % of `NFR-006`), with 5,390 → 14,504 entries. Positions in book from 1.c4 per ply (plies 1–12), base `1,9,22,32,41,50,49,52,50,40,31,0`, merged `1,12,56,144,275,480,716,998,1357,1741,2150,39`. All lines unfiltered: 2,527,629 B, which **fails** `NFR-006` | This amendment accepted. **An `ADR-0037` D1 amendment:** `source` becomes a list of two, and `format` stays 1. **A graft weight rule in D1(c):** an edge already in the book keeps its line count, and an edge only the new set adds gets weight 1 (below). `compile.ts` gains a PGN reader and a second sha256 pin. `ATTRIBUTION.md` gains a second section. **A scope change on `ABC-211`:** `A3`'s wording, and size S → M for the new parsing. **`NFR-007`'s re-read fires** (2.006x > 2x) | Workable, low value. The lines were chosen as balanced starts for engine testing, not as theory. Their quality as a repertoire is `UNKNOWN - verify` |
| **O2** | **Lines generated offline by our own engine** (deterministic mode) | Our own output, Apache-2.0 (`ADR-0048`). No third-party bytes | At this position it adds nothing the shipped engine does not already find in 3 s (4.d3, above) | Its own ADR. `R6` above says a non-attributable line source is recorded as its own ADR. Plus the same `ADR-0037` change as O1, and a generator tool | Not recommended |
| **O3** | **Lines generated offline by Stockfish 19** (the host's tool, already hashed in `ABC-202`) | The program is GPL-3.0. The FSF's GPL FAQ, entry "In what cases is the output of a GPL program covered by the GPL too?": *"The output of a program is not, in general, covered by the copyright on the code of the program."* That is an engineering reading. The legal reading is `UNKNOWN - verify`, and it is the owner's | Strong moves are likely. Not measured | Its own ADR, as O2. `ABC-093` `A1` (byte-identical rebuild) would then rest on a binary outside the repo, pinned by hash, with fixed nodes and 1 thread. Another maintainer cannot rebuild it without that binary | Not recommended |

**Re-read and not proposed:**
- **The Lichess open database.** Licence re-read 2026-10-26 on <https://database.lichess.org/>, verbatim: *"Database
  exports are released under the Creative Commons CC0 license."* `R1`'s fitness rejection stands. It is an
  aggregation over multi-gigabyte monthly files, and nobody can rebuild it without the same download.
- **`bjbraams_chessdb_198350_lines.pgn`** (same repo, CC0 at the repo level). It has 54 lines through the position.
  Its commit message reads *"biased (dbcn) and known from human master play"*. The terms of those upstream sources
  are not stated on any page read. It fails on provenance, as `R4` did.
- **The EPD sets** (`popularpos_lichess_v3.epd`, `noob_3moves.epd`). They hold the position, but an EPD row is a
  position with no move. `popularpos_lichess_v3` holds 4 of its children (e3, g3, d3, b3), and any move taken from
  that would be inferred. So neither is a line source.
- **`R3` (Perfect 2023), `R5` (Wikipedia) and the ECO book.** Not re-read. Their rejections stand.

### The graft rule (O1 only, recommended if O1 is chosen)

- **What a naive line-count merge does.** It moves White's first move. 1.c4 goes from 202 of 3,865 rows (**5.2 %**)
  to **54.5 %** of the root weight, and 1.e4 goes from 52.6 % to 25.2 %. That is a product change nobody asked for.
- **The rule.** An edge already in the book keeps its line count. An edge that only the second source adds gets
  weight 1. Every base root share is then unchanged (measured), and the game-1 position gets 4 moves of weight 1.
- **The owner's veto.** He may veto this rule, as he may veto D1(c)'s policy.

### Consequences

- **O0:** no record moves except `ABC-211`'s close. `RISK-004` stays resolved. `NFR-006` and `NFR-007` are
  untouched.
- **O1:** this ADR's decision 1 reads "two sources". Decision 2 is unchanged, since both are CC0-1.0. Decision 3
  gains a second attribution section. Decision 4's figure becomes the measured 715,259 B. `ADR-0048` decision 6 needs
  nothing, because CC0 parts need no `NOTICE` line. Rollback is the existing one: delete the second section and
  recompile from the TSVs alone.
- **O2 and O3:** each is its own new ADR, written on the owner's word, and this amendment is withdrawn.

### Rollback

- **Before acceptance:** mark this section `withdrawn`. Nothing else was edited.
- **After O1 ships:** remove the second source from `compile.ts` and `ATTRIBUTION.md`, and recompile.
  `compile(pin)` is byte-identical to today's book (measured above).
