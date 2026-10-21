---
id: 20261021T080121Z-qe-e2e-observation-bdb49d84
kind: observation
by: qe-e2e
at: 2026-10-21T08:01:21Z
verified_by: 
confidence: high (hashes computed; functional checks run as listed; no timing)
refs:
  - SEC-177-1
  - FIX-177-1
  - ABC-177
  - NFR-008
  - 20261021T072219Z-security-nfr-observation-84c196c9
  - 20261021T075956Z-qe-e2e-observation-21a20432
  - .grugops/context/qe-ABC-177/probe/sampler174.mjs
  - .grugops/context/qe-ABC-177/probe/window.mjs
  - .grugops/context/qe-ABC-177/probe/timing3/gate3.sh
  - orchestrator
  - security-nfr
  - architect-design
supersedes: 
seal: sha256:ebc8e11cc5fb9e9d40053c0ce68838b73aec3783c8b79216cc68a88d4da00964
---

# Instrument re-registration (SEC-177-1 forward fix, FIX-177-1 folded): three `qe-ABC-177/probe` instruments

These are the instruments a later full-lane `NFR-008` reading will copy. From this commit on, none of them writes a foreign process's command line. Each one logs a count and a CLASS (vitest, node, bats, kubectl, docker, curl, shell or other) per foreign process. The command line is matched in memory only. **Register these sha256s in the next pre-registration that uses them.**

| instrument (`.grugops/context/qe-ABC-177/probe/`) | old sha256 (`c83fd575`) | new sha256 | change |
|---|---|---|---|
| `sampler174.mjs` | `83409bc0e70b416aa1e208ed67fd86dcd30caa789d4184b71cadea60b572ed2f` | `6295540c2e587a9c70e65d70018d1d9c6a4a4837dc58dce76a6aea202f0da151` | SEC-177-1 + FIX-177-1 (below) |
| `window.mjs` | `83af1a013dd0a4f16d9567e7c78defb7ac6f3a5c0db67f7009e35a3688002d95` | `af83ea0c1d1efdd53cb9f4f90284c027a4906671697089e5e842de80407ff2ed` | SEC-177-1 |
| `timing3/gate3.sh` | `34822376dc211cef920569c11016e7218b32bc521479589cc3a3eaa204024c20` | `a0c1c51342502388851e25b6435c81369796dd7530472830b9a990d3cfe1b737` | SEC-177-1; `timing3/SHA256SUMS` regenerated |

## What changed
- **`sampler174.mjs`.**
  - The TSV columns `utc load1 user_procs foreign lines` are unchanged. `foreign` is still the count, and `lines` now holds one CLASS per foreign process, ` | `-joined. So the registered readouts (`csv.DictReader`, keyed on `foreign`) and `perrun.py` read it unchanged.
  - **FIX-177-1:**
    - the `ps` row regex is guarded, so an unmatched line is skipped and never dereferenced;
    - a new last column `unparsed` counts unmatched lines per sample;
    - each unmatched line is logged to `<OUT>.unparsed.tsv` as utc, length, shape and class, **never its text**, because an unparsed `ps` line is argv by construction;
    - the whole tick is wrapped, so a failing tick is logged as `tick-error` and never throws out of the interval.
  - ROOT descent and ancestry, the foreign regex and the 5 s period are unchanged.
- **`window.mjs`.**
  - `firstForeign` / `lastForeign` now carry `{at, n, classes}`, a new `classes` total is added, and `distinct` is now the number of distinct foreign lines.
  - `polls`, `foreignPolls`, `kinds`, `load1` and the exit code (1 on any foreign poll) are unchanged, so `run.sh` and `run-amended.sh` grade it the same way.
- **`timing3/gate3.sh`.** `gate-<runid>-cmds.txt` gets `utc <TAB> count <TAB> vitest` for each poll with a full-suite vitest, instead of the command lines. Gates G1–G4, the span rule and `gate-<runid>.tsv` are unchanged.

## Checked (functional only: no timing, no lane, no vitest)
- **Sampler, fake `ps` that adds a no-pid continuation line carrying `--password hunter2`, a pid-only line and a blank line.** 2 rows written, `unparsed` = 2 per sample, side log `no-leading-pid` / `pid-only`. `hunter2` appeared in neither file. The process was alive when `timeout` killed it at 12 s.
- **Sampler, fake `ps` that exits 3.** 0 data rows, one `tick-error` per tick, alive at 12 s. This is the old crash path, now logged.
- **Sampler and `window.mjs` 2 s, with a planted `fakevitest run --password PLANTED_SECRET_42` process.** Sampler row `foreign 3`, `lines` `vitest | vitest | other`. Window `foreignPolls` 3/3, `kinds` and `classes` vitest 6, rc 1. `PLANTED` appeared in neither output.
- **`gate3.sh`.** `bash -n` OK. The changed line, run alone on a two-line `fs`, wrote `2026-10-21T00:00:00Z<TAB>2<TAB>vitest`.

## Unchanged and already count-only (hashes at this commit, identical to `c83fd575`)
- `powerlog.mjs` `f28980c526f6e0ea83e627c715c637720c300ca90cc3f227912acc06fc2ebc7b`
- `lane174.mjs` `e2074cdbeedd2d16732bd0b1ae8854d93833f7e734ee14b42905dfbf30ed3e40`
- `timing2/wait177.sh` `fc8d96ba76213624054c3179d346aec394da842b96c4f80288cc7d98a710bb51`
- `timing2/go177.sh` `850dc337f350f67c16f9e1d9c3425d21dede96ec7545cd101b6929ae18917415`
- `timing/run.sh` `da435e757fb0c6710a9e7dff0995750622abc08a3793b27d00e3519ee5ff95ec`
- `timing2/run-amended.sh` `6f44786ba6c9c867f0f38711bd27a66fbd101f2337f67922bf3824436da7f284`
- `gates/gates.sh` `eb6d3f7940278159489ea95a6da0cb43394a878e4a32b6df672dca63e8346393`
- `gates/after-parity.sh` `2cf93c6f23f7efb00e22379cb944517b3e456ce740aef54fc97e3af4ef46b8ac`
- `parity/run.sh` `73b60cc7dc4a62422f39ce57d89ec2590f9e7a49cb80f26ba860a77feb403a97`

## Gap, not fixed here: 25 older instruments outside `qe-ABC-177/probe/` still write command text
They are frozen, registered instruments of closed hops. They are not the current generation, so this hop left them byte-identical:
- `qe-ABC-095/probe/window-n8.sh`, `qe-ABC-095/probe/window-timing.sh`;
- `qe-ABC-101/probe/window-n8.sh`, `qe2-ABC-101/probe/window-n8.sh`, `qe-n8-ABC-095/probe/window-n8r.sh`;
- `qe-ABC-105/probe/window105.sh`, `qe3-ABC-105-lane/probe/window-qe3.sh`, `qe4-ABC-105/probe/window-qe4.sh`;
- `qe-ABC-116/probe/qe-a2window.sh`, `ticket-to-pr-ABC-116/probe/a2window.sh`;
- `qe-ABC-152/probe/lanes.sh`, `qe-ABC-154/probe/window-qe5.sh`;
- `qe-ABC-167/probe/window.mjs`, `qe2-ABC-167/probe/window.mjs`, `secnfr-ABC-167/probe/window.mjs`;
- `qe-ABC-171/probe/window.mjs`, `qe2-ABC-171/probe/window.mjs`, `secnfr-ABC-171/probe/window.mjs`;
- `qe-ABC-173/probe/window.mjs`, `secnfr-ABC-173/probe/window.mjs`;
- `qe-ABC-174/probe/window.mjs`, `qe-ABC-174/probe/sampler174.mjs`, the latter with the same unguarded `m[1]` as FIX-177-1;
- `secnfr-ABC-096/probe/window096.sh`, `secnfr-ABC-152-window/probe/sampler.sh`, `wire-ABC-095/probe/window.sh`.

**Rule for the next hop:** copy from `qe-ABC-177/probe/` at or after this commit, never from these. If the owner wants them neutralised as well, that is one more records-only hop.
