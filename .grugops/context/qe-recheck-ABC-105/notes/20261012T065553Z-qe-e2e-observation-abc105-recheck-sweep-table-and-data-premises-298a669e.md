---
id: 20261012T065553Z-qe-e2e-observation-abc105-recheck-sweep-table-and-data-premises-298a669e
kind: observation
by: qe-e2e
task: qe-recheck-ABC-105
at: 2026-10-12T06:55:53Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A9
  - plans/tickets/ABC-105-qe-hop-detector.md
  - plans/board.md
supersedes:
---

# QE re-check of `ABC-105`: sweep table and data premises, read at `main`

This is the evidence note the brief asks for. The brief names it `kind: evidence`, but that kind does not exist.
The six-kind schema in `agent-factory/contracts/context-note.md` is closed, and 0 of 2607 notes use it. So it is
filed as an `observation`. It is hand-authored and unsealed, with no stamp, per `AGENTS.md`.

**Tree read.** Worktree `../wt-qe-recheck-ABC-105` at `21980135`. Between the brief's base `05a1f11d` and
`21980135`, only `plans/board.md` and two `.grugops/queue/pending/` files changed (`git diff --stat 05a1f11d
21980135`). `## Done` and `.grugops/context/` are byte-equal, so every reading below holds at `05a1f11d` too.

**Instrument.** A scratch script outside the repo, `node:` builtins only (`sweep105.mjs` in the session
scratchpad). It is not the deliverable and it was not committed. It applies the rule as follows.
- **Front matter.** `text.split('\n')`. Line 0 must be `---`, and the block runs to the next `---` line.
  Each `key: value` line is `split(':')`, and indented `- x` lines append to the last key.
- **Folder names `T`.** A boundary-safe token match: `/(?<![a-z0-9])abc-?(\d+)(?!\d)/gi`, then
  `parseInt(digits) === T's number`. This is A5.
- **Own `ticket-to-pr-*`.** The folder starts with `ticket-to-pr-` and names `T`.
- **Refs contain `T`.** Read two ways. "Exact": some refs element `=== 'ABC-xxx'`. "Token": some refs element
  names `T` under the A5 regex.
- **Done rows.** The line-leading `^- \[(ABC-\d+)\]` lines between `## Done` and the next `## ` heading.

## Data premises (page § Scope 1)

| reading | today | page (2026-08-17) |
|---|---|---|
| `.grugops/context/*/notes/*.md` | **2607** | 1288 |
| with a `---`…`---` front-matter block | **2607** (0 without) | all |
| `by: qe-e2e` | **622** (filename `^\d{8}T\d{6}Z-qe-e2e-` agrees 622/622, both directions) | 223 |
| `by: qe-e2e` + `kind: decision` | **139** | — |
| notes with no `kind:` / no `by:` key | **22 / 30** (all Orchestrator: `type:`/`role:`/`author:` keys) | 0 implied |
| `refs: [a, b]` inline list | **7** (all Orchestrator owner-word notes, `wave-2026-09-25`) | — |
| quoted values (`verified_by: ""`, `supersedes: ""`) | **17** (9 of them `qe-e2e`, `qe-ABC-050` and `quality-gate-ABC-106-qe`) | — |
| CR bytes / BOM / symlinks under context | **0 / 0 / 0** | — |

Re-run at the cut tree (`git archive e908b8e6 .grugops/context plans/board.md`): 1292 notes, which is the page's
1288 plus the cut's own 4, with 223 `qe-e2e`. **Plain `String.split` still parses every QE and Security/NFR note.**
No `qe-e2e` or `security-nfr` note is key-less, inline-listed or quoted on `kind`/`by`/`refs`. The 30 key-less
and 7 inline notes are all Orchestrator notes. They matter only to `A6`'s undefined "malformed" (see the
decision note).

**Folder forms holding a `qe-e2e` decision (114 folders):** `qe-ABC-*` 67, `quality-gate-ABC-*` 23,
`ticket-to-pr-ABC-*` 13, `qe2-ABC-*` 6, `uat-ABC-*` 2, `uat-run-*` 2, `residual-G-QE115-5-2026-08-21` 1. That
last one names its ticket as `QE115` with no `abc`, so the rule cannot see it. It is harmless today because
`ABC-115` is covered elsewhere. 0 folders name more than one id, and 0 `fix-*` folders hold a QE decision.
The 13 `ticket-to-pr-*` folders holding a `qe-e2e` decision are for `ABC-009`, `-011`, `-012`, `-013`, `-014`,
`-015`, `-018`, `-022`, `-023`, `-025` (all pre-cutover), and `-044`, `-110`, `-113` (post-cutover). The
hardening clause rejects them all.

`A5`: a naive substring test over the 598 real folder names gives **0** false matches for any `Done` id. The
negative case `…abc0066…` vs `ABC-006` exists in no real folder, so it needs synthetic input.

## Done section parse

- **131** line-leading `- [ABC-xxx]` rows, plus 2 `- [EPIC-…]` rows. The naive `ABC-\d+` scan of the same
  section gives **1217 occurrences / 137 distinct ids**. The page's "42" was the distinct count at the cut;
  the cut-board re-read gives 38 rows and 42 distinct, which reproduces it.
- **Cutover set.** `## Done` at the directive commit `9998a544` (2026-08-17 21:34) and at the ticket's cut
  commit `e908b8e6` (23:05) is the same 38 ids (`cmp` 0). `main` at `e23c8484` (23:00) already held **40**,
  adding `ABC-031` and `ABC-076`. `e23c8484` is not an ancestor of `e908b8e6`, because the cut branched
  earlier. So "Done on 2026-08-17" reads 38 or 40 depending on the commit.
- All 38 ids of the 2026-08-17 set are still in `Done` today. 131 − 38 = **93 post-cutover rows**.

## Sweep at the tip, four-condition rule, cutover = the 38-id set (`9998a544`)

| line | count | ids |
|---|---|---|
| `Done` rows | **131** | |
| pre-cutover | **38** | listed below the table (`git show 9998a544:plans/board.md`, parsed as above) |
| covered (`qe-e2e`) | **75** | ABC-010 031 032 033 034 035 036 037 043 045 046 050 051 053 054 055 057 058 059 069 075 077 078 079 080 081 082 083 084 086 087 093 094 102 103 104 106 107 109 114 115 116 117 118 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135 136 137 138 139 140 141 142 143 144 145 148 149 151 152 |
| covered (`security-nfr` substitute, A9) | **2** | ABC-072 (`secnfr-ABC-072/…-29849eeb`), ABC-147 (`secnfr-ABC-147-review/…-ff01ca7a`; board row "in place of QE — docs-only") |
| **NOT covered (in-scope findings)** | **16** under exact refs, **15** under token refs (`ABC-076` flips) | below |

The pre-cutover row is exactly: 001 002 003 004 005 006 007 008 009 011 012 013 014 015 016 017 018 019 020 021 022
023 025 026 027 028 029 041 042 061 062 063 064 065 066 067 068 071.

**The 16, each classified from its board row:**

| id | class | reading |
|---|---|---|
| ABC-038 | dropped | "DROPPED, NOT DELIVERED on the owner's word (R4 option b)", 2026-10-10 |
| ABC-060 | dropped | "DROPPED, NOT DELIVERED on the owner's word … scope empty", 2026-10-10 |
| ABC-074 | dropped | "DROPPED, NOT DELIVERED: the owner ruled the spike out", 2026-10-10 |
| ABC-108 | dropped | owner word "2. yes" → "DROPPED (superseded by NFR-008 R-1)" |
| ABC-111 | dropped | "DROPPED — superseded by ABC-144", 2026-10-11 |
| ABC-112 | dropped (cancelled) | "Done 2026-09-19 as CANCELLED — MOOT … Nothing built" |
| ABC-092 | owner-close | ADR-0023 ratified by the owner verbatim, 0 `src/` files; 0 `qe-e2e` notes anywhere cite it |
| ABC-100 | owner-close | ADR-0018 on the owner's word; A1–A7 per an Architect `decision` note; 0 `qe-e2e` notes |
| ABC-150 | owner-close | "ADR-0041 ACCEPTED by the owner → closed at the ruling, no lever built"; Architect diagnosis only (`c2715ecd`: 5 notes, ADR, 2 plan lines) |
| ABC-073 | UAT-waived, verified elsewhere | delivered inside `ABC-072`; the only verdicts citing it are Security/NFR's in `secnfr-ABC-072`, which names only 072 (the page's own expected finding, A9) |
| ABC-044 | QE'd, off-convention: own t2p folder | `qe-e2e` decisions only in `ticket-to-pr-ABC-044-2026-08-20` (2, refs cite it), plus decisions in `qe-ABC-043-review-exit-2026-08-20` and `qe-ABC-114`, which do not name 044. The board cites `qe-ABC-044-recheck-2026-08-20`, which does not exist on disk |
| ABC-110 | QE'd, off-convention: own t2p folder | `qe-e2e` decisions in `ticket-to-pr-ABC-110-a1a4-2026-08-20` |
| ABC-113 | QE'd, off-convention: own t2p folder | `qe-e2e` decision in `ticket-to-pr-ABC-113-2026-08-20` |
| ABC-070 | QE'd, off-convention: verdict filed as `observation` | `qe-ABC-070`: artifact-ref, failed-attempt, 3 observations (`…abc070-verdict-272f49be` is an observation); 0 decisions |
| ABC-085 | QE'd, off-convention: verdict filed as `observation` | `qe-ABC-085` + `qe2-ABC-085`: 6 observations, 2 artifact-refs, 0 decisions (`…qe2-085-verdict-pass-with-gaps-…a2b6e4f0` is an observation) |
| ABC-076 | QE'd, refs reading | `quality-gate-ABC-076-qe-2026-08-17` holds 2 `qe-e2e` decisions. Their refs cite the ticket only as `plans/tickets/ABC-076-evaluation-…md` and never as the bare `ABC-076`. Exact element: NOT covered; token: covered |

**Real misses (delivered production, no QE record anywhere): 0.** Across all `qe-e2e` notes, those with
`verdict` in the filename split as decision 72, observation 8, claim 7, artifact-ref 1. That is 16 verdicts not
filed as `decision`.

**Today's tickets:** `ABC-116`, `ABC-117`, `ABC-145` and `ABC-148` are covered by `qe-ABC-1xx/…-verdict-*` and
`qe2-ABC-1xx/…-recheck-verdict-*`. The four `bapm-fold-*` folders hold 0 `qe-e2e` notes, and no fold is a
`Done` row. `ABC-153` is In Development and not in `Done`.

## Named criteria, hand-evaluated on real data

| ticket | four-condition (exact) | token refs | refs-only (`qe-e2e`, any kind) | in 38-id cutover set? |
|---|---|---|---|---|
| ABC-061 | not covered (0 `qe-e2e` notes cite it or sit in a folder naming it) | not covered | not covered | yes |
| ABC-031 | covered: `quality-gate-ABC-031-qe-2026-08-17/notes/20260817T190536Z-qe-e2e-decision-abc031-a2-confirmed-defective-…-dbbb1b96.md` | covered | covered (7) | no |
| ABC-076 | **not covered** | covered (2, same folder) | covered (1, `quality-gate-ABC-077-qe` observation) | no |
| ABC-062 | not covered | not covered | **covered: 2 notes, both `quality-gate-ABC-066-qe/`** (`…a5-ruling-…-e9ea09f5` decision, `…gaps-found-at-qe-for-abc066-d73cfa8f` observation). The board row says "three" | yes |
| ABC-072 | `security-nfr` substitute: `secnfr-ABC-072/notes/20261010T150119Z-security-nfr-decision-abc072-pass-with-risks-…-29849eeb.md` | same | — | no |
| ABC-073 | not covered (Security/NFR verdict only in `secnfr-ABC-072`) | not covered | — | no |

**Snapshot sizes:** the 38-id set is 38 lines / 304 B. A land-time set today would be 131 lines / 1048 B.
`.grugops/qe-cutover-2026-08-17.txt` does not exist yet. The `.grugops/context` tree is 5033 files / 34,140 KiB
(`du -sk`).

**Commands** (all read-only): `git worktree add ../wt-qe-recheck-ABC-105 -b grugops/qe-recheck-ABC-105 main`;
`git diff --stat 05a1f11d 21980135`; `git show <sha>:plans/board.md` for `9998a544` `e23c8484` `e908b8e6`;
`git archive e908b8e6 .grugops/context plans/board.md | tar -x`; `git merge-base --is-ancestor e23c8484
e908b8e6`; `node sweep105.mjs <root> [--board-file f]` (scratch); `find`/`wc -c`/`du -sk`. No test suite was
run, no timing was read, and nothing under `src/`, `tools/` or `AGENTS.md` was touched.
