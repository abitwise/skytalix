# Opening book — attribution and provenance

`book.json` in this directory is compiled from third-party data. This file records where that
data came from and why it may be shipped (`ADR-0023` decision 3; `ABC-093` `A6`).

- **Source:** `lichess-org/chess-openings` — <https://github.com/lichess-org/chess-openings>
- **Pinned upstream commit:** `a6189a30dc273ccb21fc2536a9a2fefd5592a67a` (committed
  2026-10-06). The pinned files were read on 2026-10-10.
- **Licence:** `CC0-1.0`. Legal code: <https://creativecommons.org/publicdomain/zero/1.0/legalcode>
- **The licensor's statement** (`README.md` at the pinned commit), verbatim:

  > "As a collection of facts, this data set is in the public domain. Considerable effort was spent
  > curating and cleaning the data. Insofar as that qualifies for copyright, the work is released under
  > the CC0 Public Domain Dedication."

- CC0 requires no attribution; this file records provenance.

## The five source files at the pinned commit

| file | raw URL | sha256 |
|---|---|---|
| `a.tsv` | <https://raw.githubusercontent.com/lichess-org/chess-openings/a6189a30dc273ccb21fc2536a9a2fefd5592a67a/a.tsv> | `3282e4c9155289a29224f9a85fba0decb46efa35c2fa5e39662d2ac48fb0f793` |
| `b.tsv` | <https://raw.githubusercontent.com/lichess-org/chess-openings/a6189a30dc273ccb21fc2536a9a2fefd5592a67a/b.tsv> | `1d5ed134ebbd87915ead5683416e37583bb3e5ae3582b4d8cb5cb4aa7ef4f623` |
| `c.tsv` | <https://raw.githubusercontent.com/lichess-org/chess-openings/a6189a30dc273ccb21fc2536a9a2fefd5592a67a/c.tsv> | `45e843c7b7e79a0d04d5bda879c9bd23f5a10974488bd8615e4f4c5d0749986f` |
| `d.tsv` | <https://raw.githubusercontent.com/lichess-org/chess-openings/a6189a30dc273ccb21fc2536a9a2fefd5592a67a/d.tsv> | `1cf4057a8aece94f27bb3f278ad410ee2844831a642364eeceaafa091dbcceda` |
| `e.tsv` | <https://raw.githubusercontent.com/lichess-org/chess-openings/a6189a30dc273ccb21fc2536a9a2fefd5592a67a/e.tsv> | `48c6f6645b031a5937c8386839debab0e2e48837251687ba1afb6369677f8546` |

## Regenerating `book.json`

Fetch the five files above into a directory outside this repository, then run
`node tools/opening-book/compile.ts <that directory>`. The source files are not checked in.
To move to a newer upstream commit, change `SOURCE_COMMIT` in `tools/opening-book/compile.ts`
and this file together.
