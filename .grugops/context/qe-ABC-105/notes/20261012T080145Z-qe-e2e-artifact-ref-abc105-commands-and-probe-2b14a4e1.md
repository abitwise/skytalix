---
id: 20261012T080145Z-qe-e2e-artifact-ref-abc105-commands-and-probe-2b14a4e1
kind: artifact-ref
by: qe-e2e
at: 2026-10-12T08:01:45Z
verified_by:
confidence: high
refs:
  - ABC-105
  - .grugops/context/qe-ABC-105/probe/
supersedes:
---

# QE `ABC-105`: commands run and the probe folder

Hand-authored and unsealed (`AGENTS.md`). QE added **no test file** and changed no `src/`, `tools/`, `AGENTS.md`,
`tsconfig.json`, `biome.json` or `plans/board.md`. Every plant ran in an out-of-repo copy and was restored, with
`cmp` equal.

## Commands (in `../wt-qe-ABC-105` at `60415a8a` unless stated)

- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test` gives exit 0, 57 files / 1771 tests.
- `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` gives 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` gives `No findings.`, exit 0.
  The brief's form without the registry path gives exit 2.
- `node tools/grugops/qe-hop-integrity.js --sweep` gives exit 1, with readings for
  132/38/77/2/15. `--ticket ABC-061|062|031|076|072|073|105|147|153` was also run (table in `…0ff9feb3`).
- `python3 -I probe/handcount.py <root> [<board file>]` is the independent `A4` count. Its output is
  `probe/handcount.out.txt`.
- `python3 -I probe/plants.py [<plant>…]` runs 20 plants in a scratch `git archive 60415a8a` tree. Its outputs
  are `probe/plants.out.txt` and `probe/plants2.out.txt`.
- `node probe/symprobe.mjs <tool path>` is the symlink probe at three levels plus the root.
- `npx tsc --noEmit --listFiles` was run in scratch archives of `aeeba067` and `60415a8a`. The difference is the
  tool and its test.
- `npx biome check .` reads 107 files at the base and 109 at the tip.
- `git diff --name-only ada10423~1 ada10423 | grep -v '\.test\.ts$' | grep '^src/'` is empty, as it is over
  `aeeba067..60415a8a`.

## `N8-LANE` probe

- `probe/window105.sh` was run with `MAXLOAD="" GMAX=30` for attempt 2. Attempt 1 used the default load gate of
  4.0 and its log is in `probe/n8-attempt1/`.
- The lane harness is `secnfr-ABC-144-window-b/probe/lane144b.mjs`, and the gate is
  `secnfr-ABC-152-window/probe/gate.sh`. Both were used in place and unchanged.
- Raw readings are in `probe/n8-105.tsv` and `probe/n8-105.console.txt`. Logs are in `probe/sampler.tsv`,
  `probe/gate.tsv` and `probe/window-once.txt`.
- The readout is `python3 -I probe/readout105.py <dir>`, with output in `probe/readout105.out.txt`.
- The placeholder was `probe/placeholder.test.ts`.
- The scripts carry the scratch paths they ran from. They are a record, not a portable harness.

## After this verdict was filed

`node tools/grugops/qe-hop-integrity.js --ticket ABC-105` gives **exit 0, two covering notes**:
`qe-ABC-105/…-8094d5b1` (this hop's post-build verdict) and `qe-recheck-ABC-105/…-72ae8565` (the pre-build
re-check). `--sweep` is unchanged at 132/38/77/2/15, exit 1, malformed 0, because `ABC-105` is not yet a `Done` row.
