---
subtask: bapm-cut-ABC-200-followups
role: ba-pm
ref: .grugops/context/bapm-cut-ABC-200-followups/
inputs: Orchestrator …838e9652 (qe-ABC-200), …e459881c (security-nfr-ABC-200), …de0099fa (bapm-next-slice); QE …843719f4 (gaps); Security/NFR …08e4152e
width: 1
---

# Rule and cut the ABC-200 follow-ups, plus the EPIC-006 AC1/NFR-007 reading ticket

## Do
- **QE-200-a (LOW):** no row reads whether `cli.ts` plays the answered colour and level. Cut it (XS, test-only) or accept it, with a reason.
- **AR-200-C1ECHO (LOW, accepted):** the optional XS fix widens both `printableOf` copies to U+0080–U+009F (precedent AR-096-C1CP). Cut it or leave it accepted, with a reason. It may share a ticket with QE-200-d (Ctrl-D at a question writes no newline) if that is in scope.
- **Page correction on ABC-200:** the ADR-0036 (b1) lines are `cli.ts` L150, L167 and L200, and `const sink = process.stdout;` is unchanged (Security/NFR `…08e4152e`). Add a dated erratum.
- **EPIC-006 AC1 and `NFR-007`:** cut the XS fresh-clone reading ticket deferred in `…de0099fa`. It is a timing reading, so it must run on a quiet host after ABC-178.
- New tickets use ids from ABC-201, must be DoR 10/10, and must name their builder. Nothing may change an NFR bound or requirement; if one would, list it as an owner question.

## Fences
- Records only. No tests or timing runs. No `src/`, `tools/`, `package*.json` or `AGENTS.md`. On `plans/board.md`: one `_Updated` line plus new Ready cards; leave headers alone. Work on `grugops/bapm-cut-ABC-200-followups` (worktree `../wt-bapm-cut-ABC-200-followups` from `main`). Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm200/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-cut-ABC-200-followups`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
