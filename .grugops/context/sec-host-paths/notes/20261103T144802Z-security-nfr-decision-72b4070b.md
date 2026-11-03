---
id: 20261103T144802Z-security-nfr-decision-72b4070b
kind: decision
by: security-nfr
at: 2026-11-03T14:48:02Z
verified_by: 
confidence: high (result read from this task's scan and exposure notes; accepted risks need the owner's word to stand, owner Olger Oeselg)
refs:
  - sec-host-paths
  - QE-273-b
  - SEC-HP-1
  - SEC-HP-2
  - SEC-HP-3
  - ADR-0049
  - SEC-177-1
  - tools/rating/rating.ts
  - memory-bank/45-standing-rulings.md
  - se-ABC-262
  - qe-ABC-273/20261103T135141Z-qe-e2e-observation-334a1bf6
  - security-nfr-public-repo-redacted/20261024T110658Z-security-nfr-decision-04b04305
supersedes: 
seal: sha256:7dcafc703b60636e8970833709c6cd126dfc54230f0dc345270f295080baefa7
---

# Security/NFR on host paths in records (QE-273-b): PASS_WITH_RISKS. 0 credentials, 0 HIGH. Required: (a) `rating.ts` r/d redact like rpair, (b) a records path check and a placeholder rule. (c) No bulk redaction of existing files (accepted, owner Olger Oeselg), except one targeted line (SEC-HP-2)

This is a `decision`, not a `finding`. No gate can stamp an exposure review, and `context.human_admission` is `off`.
- Evidence for this result is in this task's scan note (0 credentials) and exposure note (SEC-HP-1..3).
- The upstream source is QE-273-b in `qe-ABC-273` `…334a1bf6`.

## Result: PASS_WITH_RISKS
- **Credentials: 0** in the 1,497 commits since the last sweep, and 0 in all 192 gzipped blobs. The positive control fired 27 of
  27 rules. ADR-0049 D4's "no creds" condition still holds.
- **HIGH: 0.** `security.block_on` is `high`, so nothing blocks.
- **SEC-HP-1, LOW:** the home path appears in 816 tip files. Origin/main already has 812 of them (last fetch).
  - It breaches ADR-0049 D4's "no personal path".
  - The data is the owner's already-public name and directory layout. There is no secret.
- **SEC-HP-2, LOW:** 1 foreign private-project process argv is public (`se-ABC-262`).
- **SEC-HP-3, INFO:** the hostname label is ruled by the owner. No action.
- History is not rewritten. That would need a force push, which is forbidden. Everything already pushed stays readable in
  history and in any clone.

## Recommendations

### (a) Tools fix: REQUIRED (forward). Owner: BA/PM to ticket, then Software Engineer
`rating.ts` `r` and `d` must redact their records exactly as `rpair` does:
- `machine.txt` and `cmd.txt` go through `redacted(…, out)`;
- the same `recordFiles(out)` redaction loop runs before `SHA256SUMS`, so the sums describe the committed bytes.

The `cutechess-cli` argv the tool *executes* must stay byte-equal. Only the records change. This removes QE's hand step
(`raw/scripts/redact.sh`) and its stale-checksum side effect.

### (b) Forward rule and check: REQUIRED. Owner: BA/PM to ticket (tools); Orchestrator (brief template); Architect/Design or Scribe (the rule's home)
- **Rule:** nothing committed under `.grugops/`, `plans/` or `memory-bank/` carries any of these:
  - the literal home path;
  - its slug form;
  - a `/Users/<name>` path;
  - the session scratch path;
  - a foreign process's argv.
- **Placeholders:** `<home>`, `<repo>`, `<scratch>`, `<out>`, `<node>`, `<cutechess-cli>`, `<stockfish>`, `<user>`.
- **Scripts:** use `$HOME` or environment variables, never expanded literals.
- **Briefs:** write `<scratch>/host-test.lock`. The dispatch message, which is not committed, carries the concrete path.
- **Foreign processes:** logged as a count and a class only (the `SEC-177-1` practice).
- **The owner-ruled hostname label (SEC-HP-3) is exempt.**
- **Check:** a `tools/grugops/` script over the files a branch adds or changes (the diff against the merge base), with `.gz`
  decompressed. It fails with the file and the class. Running on the diff, not the whole tree, keeps existing history from failing
  every gate.
  - Wire it where a record lands: the §14 gate, or a check the Orchestrator runs before each merge.
- Write the rule in `memory-bank/45-standing-rulings.md`, citing ADR-0049 D4.

### (c) A redaction commit for existing files
- **NOT warranted for SEC-HP-1. Accepted risk; named owner Olger Oeselg.** Reasons:
  - History keeps every copy, and 812 of the 816 files are already public, so a tip edit recalls nothing.
  - 4 of the 5 non-`raw/` files are sealed notes. Editing them breaks their seal, and superseding them costs a hop per note.
  - Checksums are a minor cost, measured: of the 116 `raw/` files carrying the literal path (101 text plus 15 `.gz`), 4 are
    named in a task `SHA256SUMS` and 7 have their sha256 cited in a context note. Redacting those would make those references
    describe bytes that are no longer at the tip.
  - The data is LOW, and the bulk churn (816 files, 739 of them carrying the scratch path) buys no recall.
- **Re-open trigger:** a credential, a third party's data, or a non-owner private path is found in a record.
- **SEC-HP-2: a targeted one-line tip redaction is RECOMMENDED.** Replace the foreign argv in
  `.grugops/context/se-ABC-262/raw/gates/summary.txt` line 5 with `<foreign: CLASS>` (2 processes).
  - It matches the `SEC-177-1` precedent and touches 1 file with no seal and no checksum.
  - It is LOW. History keeps the old blob, so the owner may decline. If declined, it is an accepted risk owned by Olger Oeselg.

## Ticket text for BA/PM (two tickets; ids are BA/PM's)

**T1 (tools only, S): `r` and `d` redact their records like `rpair` (ADR-0049 D4, QE-273-b / SEC-HP-1)**
- *Why:* `rating.ts r|d` writes `machine.txt`, `cmd.txt` and the other records with raw host paths, so every committed reading
  needs a hand redaction. That redaction leaves `SHA256SUMS` describing bytes that are not committed.
- *Scope:* `tools/rating/rating.ts` (and its tests) only. No `src/` change.
- *AC1:* After an `r` or `d` run, no record file in the out dir contains any of: `homedir()`, the repo path, the out path, the
  realpath of `CUTECHESS_CLI` or `STOCKFISH`, `process.execPath`, the username, or the hostname. Each is replaced by the same
  placeholder `rpair` uses.
- *AC2:* `SHA256SUMS` is written after redaction, and every line verifies (`sha256sum -c`) against the redacted files.
- *AC3:* The executed `cutechess-cli` argument vector is byte-equal to today's, for `r` (every `--budget-ms`) and `d`. The
  dry-run print is unchanged.
- *AC4:* A unit test plants the home, repo and tool paths in fake records and asserts AC1 and AC2. It does not play a game.

**T2 (tools plus records, S/M): records path check, and the placeholder rule (ADR-0049 D4, SEC-HP-1/2)**
- *Why:* 816 committed files carry the owner's home path in some form, and 1 carries a foreign private-project argv. Nothing
  catches either before commit.
- *Scope:*
  - a new `tools/grugops/` check, plus its tests;
  - a standing-ruling line;
  - the Orchestrator brief template (`<scratch>` placeholder);
  - optionally, the one-line SEC-HP-2 redaction, if the owner agrees.
- *AC1:* The check scans the files the branch adds or changes under `.grugops/`, `plans/` and `memory-bank/`, decompressing
  `.gz`. It exits non-zero, naming the file and the class only, on any of:
  - the literal home path;
  - the `-home-<user>-` slug form;
  - a `/Users/<name>` path;
  - the `/tmp/claude-<uid>/` scratch path;
  - `pgrep -a`-style foreign argv lines.
- *AC2:* It passes on `main` as it is today, because it reads only the diff. It fails on a planted fixture of each class (a
  positive control).
- *AC3:* It runs in the §14 gate or a pre-merge step, and the step is named in the runbook.
- *AC4:* `memory-bank/45-standing-rulings.md` carries the placeholder rule and the hostname exemption, citing ADR-0049 D4.
- *Out of scope:* rewriting history, and bulk-redacting existing files (accepted, (c)).

## Not verified (`UNKNOWN - verify`, the owner's; each needs the remote)
- whether the remote's refs still equal the local remote-tracking copies;
- whether the hosting provider's secret scanning raised anything;
- forks and clones.
