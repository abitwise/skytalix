---
id: ABC-276
title: "`tools/rating/rating.ts r` and `d` redact their records the way `rpair` does: host paths, the user name and the host name become placeholders before `SHA256SUMS` is written, so the sums describe the committed bytes. The executed `cutechess-cli` argv stays byte-equal. `usage()` names r's 100 (folds `QE-275-a`). Tools only (`ADR-0049` D4; `QE-273-b`, `SEC-HP-1`)"
status: done
column: Done
closed: "2026-11-03, merged to local main at 3dd27cfc (from grugops/ABC-276 at b4f962c5, code f4c52d62); QE PASS_WITH_GAPS (qe-ABC-276 …a79db6c1), which signs acceptance (tools only, no UAT); A1-A7 MET on 20 real r/d runs; QE-276-a/b accepted LOW with re-open triggers (bapm-gaps-1103). Front matter by bapm-gaps-1103"
size: S
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0049 D4 (\"a record names infrastructure by class and count only … and no personal path\"). No new ADR: rpair's redaction (ABC-225) extended to r and d. Security/NFR ruling sec-host-paths decision …72b4070b, recommendation (a), REQUIRED"
---

# ABC-276: `r` and `d` write records with no host path

> **CLOSED 2026-11-03, DONE, by BA/PM** (task `bapm-gaps-1103`, records only, at `main` `8580bbd3`; nothing run but the
> path check). **Merged to local `main` at `3dd27cfc`** from `grugops/ABC-276` at `b4f962c5` (code `f4c52d62`). Not
> pushed. Sources: QE `qe-ABC-276` verdict `…a79db6c1` and gaps `…1cbc2325`; the Orchestrator's board line.
>
> **Result: QE PASS_WITH_GAPS**, which signs acceptance (test note 5, no UAT).
>
> | row | read | result |
> |---|---|---|
> | A1 | 10 real `r` / `d` runs (r at 4 000 / 500 / 100; d at 7 budgets), fake tools planting 11 values: 0 left on the branch, 92 (r) / 96 (d) on the cut | MET |
> | A2 | `sha256sum -c` 10 / 10 out dirs, 0 FAILED; file set equal to the cut's | MET |
> | A3 | played argv byte-equal in 10 runs (39 / 37 tokens); `cutechessArgs` JSON-equal on 23 vectors; 22 prints byte-equal, 10 refusals message-equal; pair-check 40 / 40 | MET |
> | A4 | offline row, paths generated at test time; mutants M1, M3 killed | MET |
> | A5 | usage differs from the cut only in lines 1 and 5; M5 killed | MET |
> | A6 | 0 lines under `src/` / `data/` / `vitest.config.ts` | MET |
> | A7 | lint, typecheck, build green; `npm test` 2 566 / 2 566; 0 lane rows | MET |
>
> **Gaps, routed** (`bapm-gaps-1103`):
> - **QE-276-a, LOW: accepted, not cut.** No offline row covers `main()`'s `sealRecords(out, topFiles)` call or the
>   redacted summary print (mutants M2, M7 survive pair-check). *Why not cut or fold into `ABC-278`:* the only row that
>   sees the call site runs `rating.ts r` with fake tools, which costs a clone, `npm ci` and a build per run (about
>   450 MB and 3 s, QE). It lives in `tools/rating/`, so folding it would give `ABC-278` a second file set and a second
>   QE reading. The code is right today (QE's 10 real runs), and QE's next `r` / `d` reading greps the records (test
>   note 4) as a second net. **Re-open trigger:** any diff to `rating.ts` `main()`'s `r` / `d` path (the seal call or
>   the stdout prints): that PR adds the fake-tool row or QE runs its probe. Also re-open if a QE `r` / `d` reading's
>   `sha256sum -c` or placeholder grep fails.
> - **QE-276-b, LOW: accepted, not cut.** It is inherited from `rpair`'s word pass (`ABC-225`, `pair.ts` `redact`).
>   A user or host named like a placeholder word, or `skytalix`, garbles placeholders or engine names. A name shorter
>   than 3 characters is not redacted, so A1's "0 occurrences of the user or host name" holds for names of 3 or more
>   characters only. *Why not cut or fold:* it cannot occur on this host (both names are 3 or more characters and clash
>   with nothing), no path leaks in any case, and the sums stay right. The fix touches `rpair`'s redaction, whose
>   `ABC-225` / `ABC-247` / `ABC-255` / `ABC-275` rows are a byte-equal net. That is another file set from `ABC-278`'s.
>   **Re-open trigger:** `r`, `d` or `rpair` is run on a host whose user or host name is under 3 characters, or equals
>   `home`, `repo`, `out`, `node`, `stockfish`, `cutechess-cli`, `user`, `host` or `skytalix`. Fix hint (QE): skip
>   matches inside `<…>`; refuse or flag names under 3 characters.
> - **QE-276-c, INFO:** QE at the next `r` / `d` reading (R2, C2′ or D): `sha256sum -c` and a placeholder grep before
>   commit; verify before gzipping `r.out` / `d.out`, then re-sum or annotate.
> - **QE-276-d, INFO:** no owner. `ABC-277`'s check (home-slug class) is the net for a slug-form path. The dry-run
>   print keeps `<out>` raw by design (A3).

> **Cut 2026-11-03 by BA/PM: DoR 10/10, Ready** (task `bapm-sec-cut`, records only, at `main` `5222a9b4`; nothing
> run). Source: Security/NFR `sec-host-paths` decision `…72b4070b` (PASS_WITH_RISKS; recommendation (a) REQUIRED;
> ticket text T1) and observation `…45ef018a` (SEC-HP-1, the `rating.ts` source of 4 files). Upstream: QE
> `qe-ABC-273` `…334a1bf6` (`QE-273-b`). Folded: `QE-275-a` (`qe-ABC-275` gaps, LOW, BA/PM). Priority **P2** is the
> Orchestrator's brief (public repo). The Ready column move is the Orchestrator's.

## Problem

- **User:** QE, who runs `r` and `d` and commits the records (R2, R3, every C2′ / D read). Behind QE, the owner,
  whose repo is public.
- **Pain** (read in `tools/rating/rating.ts` at `5222a9b4`, not run):
  - `r` / `d` write `machine.txt` and `cmd.txt` raw (around lines 876 and 889). `cmd.txt` carries the
    `cutechess-cli` and Stockfish paths, the clone paths and the out path. `machine.txt` carries the node and
    harness paths.
  - `SHA256SUMS` is computed over those raw files (around line 900).
  - `rpair` already redacts every record through `redacted(…, out)` and a `recordFiles(out)` loop before its
    `SHA256SUMS` (around lines 718–805), and the `r` / `d` dry run redacts through `argvText`.
  - So every committed `r` / `d` reading needs a hand redaction (`qe-ABC-273` `raw/scripts/redact.sh`), which leaves
    `SHA256SUMS` describing bytes that are not committed. 4 committed files came from this path (`…45ef018a`).
- **Value:** an `r` / `d` out dir can be committed as written, with sums that verify. It removes one hand step from
  every reading and closes the `rating.ts` source of SEC-HP-1.

## Scope

1. `r` and `d` (a real run, not the dry run) pass `machine.txt` and `cmd.txt` through the same redaction `rpair`
   uses, with the out dir as `<out>`.
2. Before `SHA256SUMS` is written, every other record file in the out dir (`*.out`, the PGN, `summary.txt`, the
   stderr files, any other file except the clones) goes through the same redaction, as `rpair`'s loop does.
3. `SHA256SUMS` is written last, over the redacted files.
4. What `r` / `d` print to stdout from `machine.txt` and `summary.txt` is the redacted text, as `rpair` prints
   `red(machine)` (QE tees stdout into its records).
5. **`QE-275-a` folded:** `usage()` reads `[--budget-ms 500|100]` on r's line and `R 500 or 100` on the
   `--budget-ms` line. Every other usage line stays byte-equal.

## Out of scope

- Any change to the argv that is executed, to any dry-run print, default, pin or refusal message other than the
  usage text (scope 5).
- `rpair`: unchanged (its redaction already holds).
- Redacting files already committed, and rewriting history (Security/NFR (c): accepted risk, owner Olger Oeselg).
- The records path check and the placeholder rule (`ABC-277`).
- `pgrep`-style captures in agent scripts (`ABC-277`'s check catches them; `hostLine` already logs a count only).
- Any change to `src/`, `data/` or `vitest.config.ts`.

## Acceptance criteria

- **A1 (no host path in a record).** **Given** an `r` or `d` out dir whose record files contain any of: `homedir()`,
  the repo path, the out path (given and realpath), the given path and realpath of `CUTECHESS_CLI` and of `STOCKFISH`,
  `process.execPath`, the user name or the host name, **when** the records are sealed, **then** 0 occurrences of each
  remain in any record file outside the clone dirs, and each is replaced by the placeholder `rpair` uses today
  (`<home>`, `<repo>`, `<out>`, `<cutechess-cli>`, `<stockfish>`, `<node>`, `<user>`, `<host>`).
- **A2 (the sums describe the committed bytes).** **Then** `SHA256SUMS` is written after the redaction, every line
  verifies (`sha256sum -c SHA256SUMS` in the out dir exits 0, 0 lines `FAILED`), and the set of file names it lists
  equals the set an `r` / `d` run lists today (top-level record files, `SHA256SUMS` excluded).
- **A3 (the played argv is unchanged).** **Given** the PR, **then** the argument vector handed to `cutechess-cli` for
  `r` (at 4 000, 500 and 100 ms) and for `d` (at each budget it takes) is byte-equal to `main` at the cut
  (`5222a9b4`). Read two ways: (a) `cutechessArgs` and the call that starts the process are unchanged in the diff, or
  any change is shown argv-equal by a row; (b) every existing `tools/rating/pair-check.ts` row passes unedited, and the
  dry-run prints of `ABC-275` A2's list are byte-equal to the cut (only `cmd.txt`'s *record* changes).
- **A4 (offline row, no game).** **Given** a temp out dir with fake record files (`machine.txt`, `cmd.txt`, `r.out`,
  a PGN) into which the row plants every A1 value (built at test time from `homedir()`, the env and the process, never
  written as a literal), **when** the same sealing step `r` / `d` use runs on it, **then** A1 and A2 hold. No engine,
  no `cutechess-cli`, no build.
- **A5 (usage text).** **When** `rating.ts` runs with no mode, and when `rpair … --budget-ms 100` runs, **then** each
  exits non-zero and prints the usage text with `[--budget-ms 500|100]` and `R 500 or 100`; no other usage line
  differs from the cut. *BA/PM re-reading of `ABC-275` A3 item 3 (2026-11-03):* rpair's refusal is "the usage text",
  whatever its current bytes. The new text is intended, not a regression.
- **A6 (the engine is not changed).** `git diff --name-only <base> <head> -- src/ data/ vitest.config.ts` prints 0
  lines. Code paths changed: `tools/rating/` only.
- **A7 (gates).** `npm run lint`, `typecheck`, `test` and `build` green at every commit. `node --test
  tools/rating/pair-check.ts` passes in full. The default lane gains 0 rows.

## What happens on a miss

- **A3 differs in any token:** a defect; back to the Engineer before review. No existing row is re-pinned.
- **A1 leaves any value in any record:** NOT MET.
- **A2 lists a different file set:** a defect unless the PR names each added file and why (a record `rpair` also
  seals). Removing a file from the sums is NOT MET.

## NFR triggers

- **`NFR-008`:** 0 new default-lane rows (A4 lives in `pair-check.ts`, `node --test`, not collected by `npm test`).
- **Security (ASVS L1; `ADR-0049` D4):** the records carry no personal path. No new input path; no network.
- **Host:** none. Offline rows only.

## Test notes

1. The sealing shape is the Engineer's. One likely form: the redaction loop and `SHA256SUMS` write that `rpair` runs
   become one step that `r` / `d` also call. A4 then calls that step on a temp dir.
2. A4 must not commit a literal path: the fixtures are generated at test time (so `ABC-277`'s check passes on this
   branch).
3. A3's byte-equality: the existing `ABC-225` / `ABC-247` / `ABC-255` / `ABC-275` rows are the net. The Engineer may
   also diff the dry-run prints against `5222a9b4` in the PR.
4. A real run's records are read at the next QE `r` / `d` reading (R2, or the next C2′ / D), not here: no game is
   owed by this ticket. QE then runs `sha256sum -c` and a placeholder grep on the out dir before commit.
5. No UAT: tools only. QE's verdict signs.

## Size and priority

- **Size: S.** Two writes routed through an existing function, one existing loop reused, one usage string, one or
  two offline rows.
- **Priority: P2.** Public repo (the Orchestrator's brief); every future `r` / `d` reading otherwise needs a hand step.

## Dependencies

- None hard. `ABC-275` Done (merged `85a304ff`). Met.
- **File overlap:** `tools/rating/` only. `ABC-277` edits `tools/grugops/`; no open ticket edits `tools/rating/`.
- **Before R2** (Phase 4's close) is preferred, so R2's records need no hand step. Not a hard dependency.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `r` / `d` write raw paths and sum raw bytes (read at `5222a9b4`); 4 committed files came from it |
| 2 | scope and out-of-scope | ✅ r / d records + usage text; argv, rpair, history, src untouched |
| 3 | INVEST | ✅ S; independent of `ABC-277`; valuable (one hand step gone, D4 held) |
| 4 | testable, measurable acceptance | ✅ A1 0 occurrences of 8 named values; A2 `sha256sum -c` 0 FAILED, same file set; A3 argv byte-equal; A5 exact usage strings; A6 0 lines |
| 5 | dependencies known | ✅ none hard |
| 6 | NFR triggers with targets | ✅ `NFR-008` 0 lane rows; D4 |
| 7 | test notes | ✅ 1–5 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 (Orchestrator's brief) |
| 10 | no major unresolved blocker | ✅ none; no owner item (Security/NFR REQUIRED, forward only) |

**DoR 10/10: Ready.** The column move is the Orchestrator's.
