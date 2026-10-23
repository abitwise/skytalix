---
subtask: bapm-cut-licence
role: ba-pm
ticket: (owner decision) Apache-2.0
ref: .grugops/context/bapm-cut-licence/
width: 3 of 3 (records only)
---

# Cut the Apache-2.0 licence ticket

## Do
- Cut one ticket (next free ABC id): add the Apache-2.0 `LICENSE` (verbatim text from apache.org), a `NOTICE`, `package.json` `"license": "Apache-2.0"` (`"private": true` stays), and any README/credit line. Pin testable criteria (exact SPDX id, verbatim licence text sha, NOTICE content, `cli.test.ts` package.json key pins that move, ABC-041 clause (a) on `package.json` → Security/NFR hop).
- **The tables:** the ticket must handle the CC BY-SA 3.0 values in `src/evaluate.ts`. Write both paths so the owner's A/B answer picks one: (A) carve-out in NOTICE + the evaluate.ts header now, re-derive later as its own ticket; (B) re-derive first (a separate EPIC-008-sized ticket; note the interaction with ABC-205, which edits the evaluation too). Do not pick for him.
- Records drift: list what ADR-0044 D13, ABC-169 and EPIC-007 M10 say about "private / UNLICENSED" for the Architect's licence ADR. Do NOT include any personal-data or homelab details from the held Security branch in anything you write.

## Fences
- Worktree `../wt-bapm-cut-licence` on `grugops/bapm-cut-licence` from `main`. Only the new ticket page and your notes. No `src/`, `package*.json`, LICENSE/NOTICE files, ADRs, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm-lic/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `bapm-cut-licence`), `at` from `date -u`, `kind: decision`. `## Result` (board card line) + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
