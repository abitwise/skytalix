---
subtask: qe-redact-SEC-177-1
role: qe-e2e
ticket: — (SEC-177-1, owner decision; FIX-177-1)
branch: work on `grugops/redact-SEC-177-1` from `main`; do not commit on `main`
ref: .grugops/context/security-nfr-ABC-177/
width: 1
---

# Redact foreign-session captures (SEC-177-1, owner option 2) + stop capturing them

**Owner word, 2026-10-21 ~07:50Z:** "2 redact". Redact the captured foreign-session text in the current tree, in a new commit. History is NOT rewritten, and the owner knows the text stays in history.

## Read first
- Security/NFR note `…34fec102` (SEC-177-1) and `…84c196c9` (FIX-177-1).
- `.grugops/queue/done/security-nfr-ABC-177.md`.

## What counts as foreign capture
Any process data from sessions other than this repo's own runs, as recorded by the QE window, sampler and gate scripts:
- command lines;
- paths under `<private-repo>` (the owner's private projects directory; spelled this way in this record only, see the Result);
- Keycloak, `kcadm`, `kubectl`, `bats`, `curl`, `docker` and OIDC-probe invocations;
- other sessions' test names.

Prose that only *names* a foreign session ("a foreign `oeselg-labs/platform` session", "a grugops-kit session ran vitest") is not a capture. Leave it, but **do** replace any full private path in prose with `<private-repo>`.

Find the starting set with:
- `git grep -l 'Projects/[p]rivate'` (31 files at `76ccd413`);
- `git grep -liE 'keycloak|kcadm|oidc-login-probe|verify\.bats|kubectl'` under `.grugops/` and `plans/`.

Read before you redact.

## Do
1. **Redact in place.** Replace each foreign command line with `<foreign: CLASS>`, where CLASS is one of `vitest`, `node`, `bats`, `kubectl`, `docker`, `curl`, `shell` or `other`. Keep row structure, counts, pids, timestamps, CPU and load fields, so every recorded count and grade still reads the same. Don't touch this repo's own command lines.
2. **Checksum files.**
   - If a redacted file is listed in a `SHA256SUMS`, regenerate that `SHA256SUMS`.
   - Record each changed file's old → new sha256 in a redaction-manifest note, so earlier notes citing the old hashes stay checkable: history still holds the originals.
3. **Sealed notes.**
   - Check how `context-io.js` seals notes, and whether `readContext` still accepts an edited note.
   - If edits break the seal, don't edit the sealed note. Publish a superseding note with the same body redacted, `supersedes:` the original. Report which path you took per note.
   - Never forge a seal.
4. **Instruments (forward fix).**
   - Change the scripts that capture foreign processes (`window.mjs`, `sampler174.mjs`, `gate*.sh`, and anything else you find under `probe/`) to log only a count and CLASS per foreign process, never its command line.
   - Fold FIX-177-1 into the same `sampler174.mjs` edit: guard the regex; skip and log unparsed lines; count unparsed lines per sample; never throw from the interval.
   - Re-register the new sha256s in a note.
5. **Verify.**
   - `git grep -n 'Projects/[p]rivate'` is empty.
   - The foreign-capture grep finds only prose mentions; list them in your result.
   - All `SHA256SUMS` check OK.
   - `readContext` reads every note.
   - lint, typecheck and build still pass. If `src/` is untouched, no `npm test` is needed.

## Fences
- No `src/` change.
- Run no timing.
- No history rewrite and no force operations.
- Never push or merge.
- Commit on `grugops/redact-SEC-177-1` only. The Orchestrator merges.

## Publish
- Sealed notes via the sanctioned writer (task `qe-redact-SEC-177-1`): redaction manifest, instrument re-registration, decision.
- Write `.grugops/queue/done/qe-redact-SEC-177-1.md` (brief + `## Result`) and `.claim.md`, uncommitted on `main`'s working tree, with:
  - the list of files changed;
  - the sealed-note path taken;
  - the verification output;
  - a trace row.

## Result (qe-e2e, 2026-10-21 08:03Z): **DONE with residuals.** Commit `55abd2c3` on `grugops/redact-SEC-177-1` (from `main` `c83fd575`)

- No history rewrite, no force, no push, no merge.
- No `src/` byte changed. No timing and no vitest were run.
- Worktree: `../wt-redact-SEC-177-1`.

> **About this record's brief copy.** The brief above is the dispatched text, verbatim except three spellings: the private path prefix is written `<private-repo>`, and the two grep patterns are written `Projects/[p]rivate`. That way this record adds no hit to the grep it describes. The original wording is in `c83fd575:.grugops/queue/pending/qe-redact-SEC-177-1.md`.

### Notes
All six were sealed by the sanctioned writer (`context-io.js` `admitAndAppend`, grugops 2.1.0 plugin cache), run in the worktree, so they land on the branch. Each one reads back through `readContext` with `sealVerdict` ok.
- **`20261021T075956Z-qe-e2e-observation-21a20432`** (task `security-nfr-ABC-177`): the redacted re-issue of `…34fec102`, `supersedes: …34fec102`.
- **`20261021T080029Z-qe-e2e-observation-9885f1a5`**: the redaction manifest, with all 66 changed files, old → new sha256, and the rule applied.
- **`20261021T080121Z-qe-e2e-observation-bdb49d84`**: the instrument re-registration (new sha256s, the checks run, and the 25 older instruments left unchanged).
- **`20261021T080225Z-qe-e2e-decision-3bc0ee20`**: the first decision note, **superseded**. It quoted the grep pattern literally (my error), which adds 3 grep hits; see RES-4.
- **`20261021T080255Z-qe-e2e-decision-dae138b1`**: the decision, corrected; it supersedes `…3bc0ee20`.

### Sealed-note path taken, per note
- **`…34fec102`** (security-nfr, **sealed**): **superseded, not edited.** An edit gives `sealVerdict` → `mismatch`, and `readContext` would skip the note as `unsealed`.
  - The new note `…21a20432` carries the same body with 5 captured fragments and 1 path redacted, plus a re-issue header.
  - `currentState` folds the original out.
  - No seal was forged.
- **`…69982a4f`** (qe-ABC-116), **`…55c8efb6`** (ticket-to-pr-ABC-116) and **`…3f802e17`** (qe2-ABC-167): these were **already unsealed** (seal `absent`, hand-authored or written before the seal existed), so `readContext` skipped them before this hop and still does. **Edited in place:**
  - private path → `<private-repo>`;
  - the `pnpm exec vitest …` and `pidinfo --git-state …` captures → `<foreign: vitest>` and `<foreign: other>`.

### Files changed (66 modified + 5 new notes), all under `.grugops/context/`
  - `qe-ABC-095/`: `probe/windows/n8-cli-w1/sampler.tsv`, `probe/windows/n8-cli-w2/sampler.tsv`, `probe/windows/n8-real-w1/sampler.tsv`
  - `qe-ABC-105/`: `probe/n8-attempt1/sampler.tsv`, `probe/sampler.tsv`
  - `qe-ABC-116/`: `notes/20261012T061500Z-qe-e2e-observation-abc116-qe-own-readings-a1-a2-69982a4f.md`, `probe/aborted-start-1/qe-a2-window.log.txt`, `probe/qe-a2-window.log.txt`
  - `qe-ABC-171/`: `probe/window1.out`
  - `qe-ABC-173/`: `probe/window1.out`, `probe/window2.out`
  - `qe-ABC-174/`: `probe/attempt1/sampler.tsv`, `probe/window2.out`, `probe/window4.out`, `probe/window5.out`, `probe/window6.out`
  - `qe-ABC-177/`: `probe/sampler174.mjs`, `probe/timing/batch1/window1.out`, `probe/timing/batch1/window2.out`, `probe/timing/batch1/window3.out`, `probe/timing/batch1/window4.out`, `probe/timing/batch1/window5.out`, `probe/timing/batch1/window6.out`, `probe/timing/batch2/window1.out`, `probe/timing/batch2/window2.out`, `probe/timing/batch2/window3.out`, `probe/timing/batch2/window4.out`, `probe/timing/batch2/window5.out`, `probe/timing/batch2/window6.out`, `probe/timing/SHA256SUMS`, `probe/timing2/full-r1/perrun.out`, `probe/timing2/full-r1/sampler.tsv`, `probe/timing2/full-r1/window.out`, `probe/timing2/full-r2/perrun.out`, `probe/timing2/full-r2/sampler.tsv`, `probe/timing2/full-r2/window.out`, `probe/timing2/n8-r1/perrun.out`, `probe/timing2/n8-r1/sampler.tsv`, `probe/timing2/n8-r1/window.out`, `probe/timing2/presample.out`, `probe/timing2/SHA256SUMS`, `probe/timing3/gate-t3-r1-cmds.txt`, `probe/timing3/gate3.sh`, `probe/timing3/SHA256SUMS`, `probe/timing3/t3-r1/perrun.out`, `probe/timing3/t3-r1/sampler.tsv`, `probe/timing3/t3-r1/window.out`, `probe/timing3/t3-r2/perrun.out`, `probe/timing3/t3-r2/sampler.tsv`, `probe/timing3/t3-r2/window.out`, `probe/window.mjs`
  - `qe-n8-ABC-095/`: `probe/windows/n8r-cli-w1/sampler.tsv`
  - `qe2-ABC-167/`: `notes/20261018T211200Z-qe-e2e-observation-abc167-n8-lane-owed-3f802e17.md`, `probe/window1.out`
  - `qe2-ABC-171/`: `probe/window1.out`
  - `qe3-ABC-105-lane/`: `probe/w2/sampler.tsv`, `probe/w3/sampler.tsv`
  - `qe4-ABC-105/`: `probe/w1/sampler.tsv`, `probe/w2/sampler.tsv`
  - `secnfr-ABC-167/`: `probe/window1.out`
  - `secnfr-ABC-171/`: `probe/window1.out`
  - `secnfr-ABC-173/`: `probe/window1.out`, `probe/window2.out`
  - `ticket-to-pr-ABC-116/`: `notes/20261012T055000Z-software-engineer-observation-abc116-a2-hook-deletion-re-measured-55c8efb6.md`, `probe/a2-window.log.txt`, `probe/aborted-start-1/a2-window.log.txt`
- **What changed in them:**
  - **57 capture files:** 6,951 foreign command strings → `<foreign: CLASS>`, and 113 own strings kept. Those strings sit in the window JSON `lines`/`distinct`, the sampler `lines`/`foreign_cmds`, `perrun.out`, `gate-t3-r1-cmds.txt` and the ABC-116 window logs. Pids, timestamps, counts, load, CPU and power fields, line and column counts and the JSON non-command values are unchanged, checked per file against `c83fd575`.
  - **3 unsealed notes**, as above.
  - **3 `SHA256SUMS`** regenerated.
  - **3 instruments**, below.
- **How a line was judged own or foreign:**
  - **Own:** the line names this project (a `grugops-examples` / `cli-chess-example` path, a `wt-*` tree, `uat-harness`, a `.grugops/context/*/probe/` path, `tools/grugops/`, `src/*.test.ts`, `/t177/`, `qe-hop-integrity`, or `--coverage.include=src/**`).
  - **Foreign:** the line carries a foreign marker, or it shares a Claude shell-snapshot id or a pid in the same file with a foreign line.
  - **Also redacted, 2,625 unmarked strings:** the remaining strings in an instrument's foreign field with no marker either way. Each was a session-neutral prefix (the `bash -c source …/shell-snapshots/snapshot-bash-` wrapper or a node worker's `--require` prefix) cut at 90–160 characters.

### Instruments (`qe-ABC-177/probe/`): count + CLASS only, never argv
| instrument | old sha256 | new sha256 |
|---|---|---|
| `sampler174.mjs` (+ FIX-177-1) | `83409bc0e70b416aa1e208ed67fd86dcd30caa789d4184b71cadea60b572ed2f` | `6295540c2e587a9c70e65d70018d1d9c6a4a4837dc58dce76a6aea202f0da151` |
| `window.mjs` | `83af1a013dd0a4f16d9567e7c78defb7ac6f3a5c0db67f7009e35a3688002d95` | `af83ea0c1d1efdd53cb9f4f90284c027a4906671697089e5e842de80407ff2ed` |
| `timing3/gate3.sh` | `34822376dc211cef920569c11016e7218b32bc521479589cc3a3eaa204024c20` | `a0c1c51342502388851e25b6435c81369796dd7530472830b9a990d3cfe1b737` |

- **FIX-177-1:**
  - the row regex is guarded;
  - an unmatched line is skipped, counted in a new last column `unparsed`, and logged to `<OUT>.unparsed.tsv` as utc, length, shape and class. Its text is not logged, because an unparsed `ps` line is argv;
  - the tick is wrapped (`tick-error`), so nothing is thrown from the interval.
- The columns `utc load1 user_procs foreign lines` are unchanged, so the registered readouts read the new TSV as before.
- **Checked with a fake `ps`** (no-pid continuation line with `--password hunter2`, a pid-only line, a blank line): `unparsed` = 2 per sample, `hunter2` in no output, and the sampler was still alive when killed at 12 s. A `ps` that exits 3 gave a `tick-error` per tick, and the sampler was still alive.
- **Checked with a planted `fakevitest run --password PLANTED_SECRET_42` process:** sampler `foreign 3`, `lines` `vitest | vitest | other`; window `foreignPolls` 3/3, rc 1; `PLANTED` appeared in no output.
- **`gate3.sh`:** `bash -n` OK, and the changed line writes `utc<TAB>count<TAB>vitest`.
- `powerlog.mjs`, `lane174.mjs`, `wait177.sh`, `go177.sh`, `run.sh`, `run-amended.sh`, `gates.sh`, `after-parity.sh` and `parity/run.sh` were already count-only and are unchanged.

### Verification output (on the branch at `55abd2c3`)
1. **`git grep -n 'Projects/[p]rivate'`: NOT empty, 7 lines in 3 files, all residuals:**
   ```
   .grugops/context/qe-redact-SEC-177-1/notes/20261021T080225Z-qe-e2e-decision-3bc0ee20.md:38,60,63   (RES-4: my superseded note, pattern mentions, no repo name)
   .grugops/context/security-nfr-ABC-177/notes/20261021T072219Z-security-nfr-observation-34fec102.md:33   (RES-1: sealed original)
   .grugops/queue/pending/qe-redact-SEC-177-1.md:21,28,47   (RES-2: the dispatch brief; leaves the tree when the Orchestrator commits this close)
   ```
   It was 31 files at `76ccd413`. Once the close removes the pending brief, 4 lines remain in 2 files.
2. **The foreign-capture grep** (`keycloak|kcadm|oidc-login-probe|verify\.bats|kubectl` under `.grugops/` and `plans/`):
   - **prose mentions:**
     - `qe-ABC-177/notes/20261020T215500Z-…-46beddf7.md` (it names the classes a foreign session ran);
     - `queue/done/qe-ABC-177-timing.md`, `queue/done/qe-ABC-177-timing-2.md` and `queue/done/security-nfr-ABC-177.md`;
     - `queue/pending/qe-redact-SEC-177-1.md`;
     - this hop's notes, which name the classes;
   - **not captures:**
     - `install.json`, the kit's `kubectl` deny-list;
     - 7 `qe-ABC-177/probe/timing/batch*/window*.out` files, where the hit is the `<foreign: kubectl>` tag;
     - `qe-ABC-177/probe/window.mjs` and `sampler174.mjs`, where the hit is the class regex;
   - **the one remaining capture:** the sealed original `…34fec102` (RES-1).
3. **`SHA256SUMS`, all OK:**
   - `timing` 14/14, `timing2` 38/38 and `timing3` 30/30 tracked entries;
   - the 16 gitignored `.log` entries (2/6/8), kept verbatim, check OK against this checkout's untouched files.

   All three also checked OK at `c83fd575` before the change.
4. **`readContext` over all 721 tasks:**
   - 3,031 note files; **40 read** (35 before + this hop's 5); **2,991 skipped**, the same count as on `main` `c83fd575`; 0 errors.
   - Every sealed note reads. The 2,991 skips are pre-existing unsealed notes: hand-authored, or written before the seal existed.
   - This hop changed no note's readability.
   - **So "`readContext` reads every note" holds for every sealed note but not for the store, and it did not hold before this hop either.**
5. **Gates:** `npm run lint` OK (biome, 116 files), `typecheck` rc 0, `build` rc 0. `src/` changed 0 files, so no `npm test` was run.

### Residuals: owner / Orchestrator
- **RES-1: the sealed original `…34fec102`** still holds, in the current tree, the Keycloak admin-login fragment, the SigV4 `curl` credential-variable names, `--env-from-secret` and a private path prefix. The brief rule (supersede, never edit, never forge) keeps it there.
  - **Option (a):** accept it. It is superseded, and current state shows the redacted copy.
  - **Option (b):** the owner explicitly authorises deleting that one note file in a new commit. The store is append-only, so that is the owner's call.
- **RES-2: the dispatch brief** in `pending/` carries the path prefix and the patterns. I left it alone on the branch, because editing it there would conflict with this close. It leaves the tree when the Orchestrator commits the move to `done/`, and this record's copy is neutralised.
- **RES-3: 25 older capture instruments** outside `qe-ABC-177/probe/` still write command text; they are listed in `…bdb49d84`. They are frozen, and no next hop uses them. Rule: copy from `qe-ABC-177/probe/` at or after `55abd2c3`. Neutralising them as well is one more records-only hop, if the owner wants it.
- **RES-4: my own error.** The first decision note `…3bc0ee20` quoted the grep pattern literally (3 hits, no repo name, no capture). It is sealed, so it stays; it is superseded by `…dae138b1`. Option (b) for RES-1 could take it too.
- **Unchanged from SEC-177-1:** a full secret scan of the originals, which history still holds, is `UNKNOWN - verify`.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| SEC-177-1 (QE redact, owner option 2) | Foreign-session captures redacted in the tree (57 capture files, 6,951 strings → `<foreign: CLASS>`; 3 unsealed notes in place; sealed …34fec102 superseded by …21a20432); qe-ABC-177 window.mjs / sampler174.mjs / gate3.sh log count + CLASS only; FIX-177-1 folded (guarded regex, `unparsed` column, never throws); 3 SHA256SUMS regenerated; qe-redact-SEC-177-1 …dae138b1 | — (owner word "2 redact") | grugops/redact-SEC-177-1 @ 55abd2c3 (from c83fd575) | .grugops/context only (66 files + 5 notes); no src/ | manifest …9885f1a5; instruments …bdb49d84 (fake-ps + planted-secret checks); SUMS all OK; readContext 40/3,031, skips unchanged 2,991; lint/typecheck/build pass | DONE with residuals: RES-1 sealed original stays (owner: accept or authorise deletion), RES-2 brief leaves at close, RES-3 25 older instruments unchanged, RES-4 superseded …3bc0ee20 pattern hits; FIX-177-1 closed |

### Next
- **The Orchestrator** reviews `55abd2c3` and merges it, or not.
- **The owner** rules on RES-1, and on RES-3 if wanted.
- FIX-177-1 is done, so the next full-lane `NFR-008` reading registers `sampler174.mjs` `6295540c…`.
