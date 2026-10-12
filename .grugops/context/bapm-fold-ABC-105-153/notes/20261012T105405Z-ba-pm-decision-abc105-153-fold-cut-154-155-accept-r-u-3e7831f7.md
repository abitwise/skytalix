---
id: 20261012T105405Z-ba-pm-decision-abc105-153-fold-cut-154-155-accept-r-u-3e7831f7
kind: decision
by: ba-pm
task: bapm-fold-ABC-105-153
at: 2026-10-12T10:54:05Z
verified_by:
confidence: high
refs:
  - ABC-105
  - ABC-153
  - ABC-154
  - ABC-155
  - N8-LANE
  - QE-105-d
  - QE-105-r
  - QE-105-s
  - QE-105-u
  - QE-105-v
  - QE-105-w
  - QE-105-x
  - QE-105-y
  - QE-105-z
  - QE-105-aa
  - QE-105-ab
  - QE-153-a
  - QE-153-b
  - QE-153-c
  - AR-105-SYMLINK-ROOT
  - AR-105-ALLOWJS
  - AR-145-CLI-WIRING
  - plans/tickets/ABC-105-qe-hop-detector.md
  - plans/tickets/ABC-153-the-book-sha256-test-alters-only-the-first-source-file.md
  - plans/tickets/ABC-154-the-qe-hop-detector-test-has-no-positive-control-on-its-whole-tree-read.md
  - plans/tickets/ABC-155-the-book-sha256-test-never-offers-a-hash-that-differs-only-in-its-last-character.md
  - 20261012T080130Z-qe-e2e-decision-abc105-verdict-pass-with-gaps-8094d5b1
  - 20261012T091901Z-qe-e2e-decision-abc105-qe2-verdict-p-q-closed-3bc30c08
  - 20261012T103400Z-qe-e2e-decision-abc105-qe4-verdict-pass-with-gaps-n8-not-read-6a647762
  - 20261012T065549Z-qe-e2e-observation-abc153-gap-register-e88108db
  - 20261012T105404Z-ba-pm-observation-abc105-153-fold-readings-e2d5f352
supersedes:
---

# `ABC-105` / `ABC-153` QE gaps folded: 2 cut (`ABC-154`, `ABC-155`), 2 accepted with triggers, 5 closed, `-x`/`-ab` left to the Architect

This is an agent `decision`, not a stamp. The tickets' `## Scope` and `## Acceptance` are authoritative; this note
records why. My readings are in `…e2d5f352`. No timing was read.

## Dispositions

| gap | sev | disposition | why |
|---|---|---|---|
| `QE-105-z` | LOW | **Cut → `ABC-154`** (`XS`, `P3`) | Three QE4 plants go 0 red, and `A3`'s unfiltered check passes on an empty read. That makes the `QE-105-p` closure vacuous. The fix is cheap: assertions over the existing memos, no new read |
| `QE-105-y` | LOW | **Folded into `ABC-154`** | It edits the same pair of files. One QE hop and one lane re-read cost less than two |
| `QE-105-r` | LOW | **Accepted, `AR-105-SYMLINK-ROOT`**, with a trigger | It adds no capability beyond the `A7` ceiling, since a forged note in place does the same. Read-only tool, root not a link, 0 symlinks. Trigger: automatic invocation, a write or argv path, or `test -L` true |
| `QE-105-u` | LOW | **Accepted, `AR-105-ALLOWJS`**, with a trigger | One `.ts` → `.js` import exists today. A `.d.ts` duplicates the JSDoc types and drifts silently. Trigger: a second such import, or a `.js` file added to `include` |
| `QE-105-s` | LOW (by design) | **Closed** | 0 spawns was chosen in § Scope 5. Every real `Done` exit runs the wrapper |
| `QE-105-w` | INFO | **Closed** | By design, per § Scope 4. It is an instance of the stated ceiling, and no covered id relies on one |
| `QE-105-aa` | INFO | **Closed** | The command line reaches neither behaviour. `ABC-154` Test note 4 keeps `notes` injection under `--sweep` only |
| `QE-105-x` | MEDIUM | **Not mine.** `design-ABC-105-lane` items 2 and 4 | Cross-reference only. `ABC-154` changes the `N8-LANE` set and owes a re-read, and whether that reading discharges `-x` is the Architect's |
| `QE-105-ab` | INFO | **Not mine.** `design-ABC-105-lane` item 1 | — |
| `QE-153-a` | LOW | **Cut → `ABC-155`** (`XS`, `P3`, same promotion trigger as `ABC-145`/`ABC-153`) | The `ABC-153` precedent: a cheap, good fix is cut, while a costly one (`QE-145-b`) is accepted. One case inside an existing `it`, 0 new tests |
| `QE-153-b` | INFO | **Closed** | Equivalent on every reachable input (lowercase digest and pins) |
| `QE-153-c` | INFO | **Closed** | Harmless: nothing reads the directory after the loop, and earlier restores fail loud |

**The owner's 2026-10-12 answers are recorded on `ABC-105`'s page (append-only):** UAT waived on his word
(`QE-105-v`); merged on the +0.370 s reading, which is a ruling and not a MET; `QE-105-d` not overruled. They
are transcribed from the board row `c1841b36` and the brief `6ae6dd27`, because no Orchestrator note records them.

## Gates (run before the commit, because committed non-note files changed)

In worktree `../wt-bapm-fold-ABC-105-153` at `6ae6dd27`, plus this diff, with `node_modules` symlinked from the
main checkout during the run and removed after:
- `npm run -s lint`: exit 0, "Checked 109 files".
- `npm run -s typecheck`: exit 0.
- `npm run -s build`: exit 0.
- `npm test`: exit 0, **57 files / 1775 tests**. `.test-results/last-run.json` reads `success: true`, pending 0,
  todo 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.

## Board recommendation (the Orchestrator's to make)

- `ABC-154`: add to `Backlog`, DoR 10/10, then `Backlog → Ready`. **Pull it into a window that can hold
  width 1:** its QE hop reads `N8-LANE`.
- `ABC-155`: add to `Backlog`, DoR 10/10, then `Backlog → Ready`. Width is not constrained.
- `ABC-105` and `ABC-153`: stay `Done`. Their page front matter still reads `backlog`/`Backlog`, which is the
  Orchestrator's to refresh; I did not edit it.

## Owner questions

**None blocking.** Two acceptances are recorded so he can overrule them: `AR-105-SYMLINK-ROOT` and
`AR-105-ALLOWJS`. If he wants either one closed now rather than on its trigger, it is a ticket for him to
commission. Note that closing `-r` edits the test file and owes an `N8-LANE` re-read.
