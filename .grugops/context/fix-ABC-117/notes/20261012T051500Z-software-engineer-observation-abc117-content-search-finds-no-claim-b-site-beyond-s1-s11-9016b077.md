---
id: 20261012T051500Z-software-engineer-observation-abc117-content-search-finds-no-claim-b-site-beyond-s1-s11-9016b077
kind: observation
by: software-engineer
task: fix-ABC-117
at: 2026-10-12T05:15:00Z
verified_by:
confidence: medium
refs:
  - ABC-117
  - ABC-115
  - QE-117-a
  - QE-117-d
supersedes:
---

# Content search at `8e679aed`: no CLAIM-B site beyond S1–S11

Run once, by content, over `plans/`, `memory-bank/`, `.grugops/context/` and `src/`.

**Pass 1.** I listed the files that mention `USAGE_EXIT_CODE` together with `EBADF`, non-`EPIPE`,
`read-only fd` or `stdout write`: `grep -rlE 'USAGE_EXIT_CODE' … | xargs grep -lE
'EBADF|non-`?EPIPE|read-only (fd|stdout)|stdout[- ]write'`. That gives **22 files**. QE counted 16;
the extra six are this ticket's own notes and QE's notes, written since. I read every
`USAGE_EXIT_CODE` line in each file in context:

- **Known sites:** S1/S2 `…8a4b2e69`, S3 `…9d3a7e52`, S4 `…8c04b19d`, S5 `…6b1e4c72`, S6/S9
  `plans/board.md` (`:659`, `:873`), S7 `ABC-115` page `:302`, S8 `src/cli.test.ts`, S10
  `plans/traceability.md` `:676`, S11 `…0391186e:69-70`.
- **Corrections or quotes of the clause, not claims:** `…d2c79dc9`, `…9b459890`, `…7f2a91c4`,
  `…3e8b40d7`, `…7f2c91ab`, board `:483`/`:484`/`:724`, trace `:631`/`:678`/`:1034`, this ticket's page
  and its notes, QE's `qe-ABC-117` notes, and the `ABC-115` page's added block `:315-321`.
  `ADR-0016:30` states the true mechanism.
- **CLAIM-A, fenced (A5):** `ABC-115` page `:62`/`:117`/`:384`, `ADR-0016:112`, trace `:676`'s
  exit-code ruling clause (*"`1` is `USAGE_EXIT_CODE` and the collision with a refused command line
  was MEASURED"*), board `:873`'s first clause (the pre-`ABC-115` `EPIPE` value). `src/cli.test.ts:1984`
  says `1` is *also* `USAGE_EXIT_CODE`, which is a value statement, and it states the true mechanism
  just before.
- **QE-117-d's four lines, not touched:** `src/cli.test.ts:3251`, the dated `src/cli.ts:159` reading in
  the `A10` comment, `:3198`/`:567` line drift, board `:871` (now `:873`'s `A10` clause).

**Pass 2, for other wordings.** In the 35 files that mention `EBADF` or non-`EPIPE`, I searched for
lines that say "usage code", "usage exit", "refusal code", "refused command line status" or "the code
the product reserves" without `USAGE_EXIT_CODE`: **0 lines**. In the 13 files that pass 1 did not
read, I checked every `usage`/`refus` line that carries `exit`/`status`/`` `1` ``, and every
`collision`/`collides`/`reserved for` line. None states that the non-`EPIPE` `1` is an assignment.
`…8d7cad3b:80` (*"a future fix of the exit-code collision leaves this row green and needs no
re-cut"*) has the shape of S2. It is true about `A10` and makes no mechanism claim, so it is **not
a CLAIM-B site and is left alone**. It is named here so the next reader does not have to judge it
again.

**Limit:** this is a regex search plus reading in context, not a proof. A paraphrase that uses none
of the searched tokens would be missed. Confidence `medium` for that reason.
