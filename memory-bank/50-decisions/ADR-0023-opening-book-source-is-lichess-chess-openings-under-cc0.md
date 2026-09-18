---
kind: adr
---
# ADR-0023: The opening-book source is `lichess-org/chess-openings` (CC0 1.0) — proposed, awaiting the owner's ratification

## Status

**proposed** — 2026-09-19 by Architect/Design at task `owner-rulings-2026-09-19`, subtask
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

> Ratified by: ______________________ (project owner)   Date: ____-__-__
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
