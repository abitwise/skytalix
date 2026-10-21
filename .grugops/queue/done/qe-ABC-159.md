---
subtask: qe-ABC-159
role: qe-e2e
ticket: plans/tickets/ABC-159-four-nfr-test-headers-carry-a-running-tally-of-the-catalog-and-they-disagree.md
ref: .grugops/context/qe-ABC-159/
branch: grugops/ABC-159 (tip 3c505abe; base 4ab5b453); SE worktree ../wt-ABC-159 (read only)
width: 3 (beside qe-ABC-160 and qe-ABC-162; other worktrees, other files)
---

# QE gate for ABC-159 (header comments only)

## Do
- Verify A1–A4 against the page. **A3 is yours to grade:** the wording of the four rewritten headers.
  - **The bar:** each says the bar is a count because a timing bar cannot fail on its regression.
  - **No tally:** no count or ordinal of catalog citations remains, including ones A1's search misses (e.g. "both times").
  - **Independence:** do not copy the SE's readings in `.grugops/context/ticket-to-pr-ABC-159/`.
- **A4 counts.** Read them literally as the page writes them. The heap rule:
  - `--max-old-space-size=400` is for ONE-file vitest runs only.
  - A whole-suite or multi-file vitest call uses 128, which is what `npm test` sets itself. The repo's heap guard (`tools/grugops/heap-guard.js`) refuses 400 there.
  - The SE's per-file 400 workaround is in `…c7a671d8`. Grade whether it is equivalent; it's not a substitute for your literal read.
- **Diff.** Confirm the diff is four files, every hunk inside a `/** */` header, and that no executable line changes.
- **Gates.** Run on the tip: lint, typecheck, build, `npm test`, `last-run.json` success, skip-integrity `--skip-count 0`, `CLI_DEEP`, `PERFT_DEEP`. Those two deep lanes are one-file runs at 400. Run one at a time.
- **UAT waiver.** Measure it: `git diff --name-only 4ab5b453...3c505abe -- src | grep -vE '\.test\.ts$|__snapshots__'`.
- **Verdict.** Return PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-159` on a branch from the tip. Commit typed notes and a QE section on the ABC-159 page there.
- No production files, `plans/board.md`, `AGENTS.md`, or other ticket pages. No timing.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal the notes with `/Users/olgeroeselg/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/context-io.js` (`admitAndAppend`, task `qe-ABC-159`). `AGENTS.md` wrongly says that writer is absent; that line is a known stale entry owed to the Scribe.
- Finish with `.grugops/queue/done/qe-ABC-159.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.

## Result

```
result: DONE
verdict: PASS_WITH_GAPS
branch: grugops/qe-ABC-159 (from grugops/ABC-159 tip 3c505abe; base 4ab5b453)
reviewed: 3c505abe
tip: 60f445b8
worktree: /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-159
```

QE/E2E qe-ABC-159: **PASS_WITH_GAPS**. One commit, `60f445b8`, on `grugops/qe-ABC-159`. It holds five QE notes,
sealed through the plugin's `context-io.js` `admitAndAppend` under `.grugops/context/qe-ABC-159/notes/`: criteria
`…e82b1231`, A3 `…b9df505d`, gates `…5e364554`, gaps `…a1580e88` and verdict `…10545147`. It also holds the
probes and the ticket page's `## QE` section. Not touched: `src/`, `plans/board.md`, `plans/traceability.md`,
`AGENTS.md` and other ticket pages. Nothing pushed or merged. No timing reading.

- **A1 MET:** the verbatim search prints nothing at the tip and the three sites at base.
- **A2 MET:** exit 1 at the tip, `turn-loop:9` at base.
- **A3 MET:** QE's own read, done before opening the SE's decision note. All four sentences say the bar is a
  count because a timing bar cannot fail on its regression, and no count or ordinal is left (wider probe
  included). See `QE-159-a` on san.
- **A4 MET:** four files, every hunk inside the `/** */` header, and the post-header bytes are identical. The
  per-file counts are byte-identical at base and tip (59 files, 1987 tests), with skips 0, read at
  `--max-old-space-size=128`. The literal bare command is refused by the heap guard (exit 1, 0 tests:
  `QE-159-b`). The SE's per-file 400 route (`…c7a671d8`) is equivalent: its listings are byte-identical.
- **Gates at the tip:**
  - lint 0 (116 files), typecheck 0, build 0;
  - `npm test` 0, 59 files, 1987/1987, and `last-run.json` reads `success: true` (re-run green on `60f445b8`);
  - skip count 0, and integrity reports `No findings.`;
  - `CLI_DEEP` 11/11 and `PERFT_DEEP` 32/32, each run alone at 400;
  - `qe-hop-integrity --ticket ABC-159`: covered, exit 0.
- **UAT waiver reading:** both forms are empty. The brief's is `git diff --name-only 4ab5b453...3c505abe -- src |
  grep -vE '\.test\.ts$|__snapshots__'`. AGENTS.md's is `git diff --name-only 3c505abe~1 3c505abe | grep -v
  '\.test\.ts$' | grep '^src/'`. Applying the waiver is the Orchestrator's job.
- **Gaps:**
  - `QE-159-a` (LOW): san's clause drops the "small headroom" qualifier and is tied to a catalog lesson that
    does not say it.
  - `QE-159-b` (LOW): A4's bare command is refused by `ABC-173`'s guard.
  - `QE-159-c` (INFO): there is no standing tally guard.
  - `QE-159-d` (INFO): the colon form reads as a quote of words the catalog does not hold.
  - Outside the ticket: `QE-159-e` (stale `cli.test.ts:1831` → `history-pane.nfr.test.ts:329` citation,
    pre-existing), `QE-159-f` (the brief's waiver filter is wider than AGENTS.md's) and `QE-159-g` (the SE's notes
    are unsealed).

Left for the Orchestrator: `.grugops/queue/pending/qe-ABC-159.md` and the empty `claimed/qe-ABC-159/`, both
untouched. The next column is the Orchestrator's call.

## Trace row (for `plans/traceability.md`, not written by QE)

| ABC-159 (QE) | Four `*.nfr.test.ts` headers: the catalog tally dropped, the lesson kept; QE/E2E (Claude Opus 5.5, subtask `qe-ABC-159`, on `grugops/ABC-159` tip `3c505abe`, base `4ab5b453`; QE commit `60f445b8`). **Comment lines only; no timing read.** | EPIC-002 | — | `NFR-008` 0 / 0 / 0 (0 test files, 0 tests, 0 spawns) | no code changed by QE. Probes: verbatim A1/A2, wider joined-text tally probe, A4 suite-128 listings at base and tip, bare-command refusal | **PASS_WITH_GAPS.** `A1`–`A4` MET. A4 per-file counts byte-identical (59 files, 1987), skips 0. Gates: lint, typecheck, build, `npm test` 1987/1987, `success: true`, skip 0, integrity `No findings.`, `CLI_DEEP` 11/11, `PERFT_DEEP` 32/32. Gaps: `QE-159-a`/`-b` LOW, `-c`/`-d` INFO; outside: `-e`/`-f`/`-g` INFO | waiver measured: 0 `src/` production lines on both forms, so it applies (the Orchestrator's to apply) | — | **In Review; the next column is the Orchestrator's call.** Notes `.grugops/context/qe-ABC-159/notes/` (decision `…10545147`) |
