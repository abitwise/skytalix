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

## Result

**Done 2026-10-24 by BA/PM.** Branch `grugops/bapm-cut-licence` @ `25223d72` (worktree `../wt-bapm-cut-licence`, from
`main` `c487d89c`). Records only. Not merged, not pushed. Notes (`bapm-cut-licence`): observation
`20261023T215025Z-ba-pm-observation-9475c6d2`, decision `20261023T215045Z-ba-pm-decision-efbbb9ee`. Both seals read
back `ok`.

- **`ABC-214`** (`EPIC-007`, post-close addition; `XS`, `P1`; DoR **9/10** → stays in **Backlog**). Page:
  `plans/tickets/ABC-214-the-repository-is-licensed-apache-2-0.md`.
  - **[both]**
    - `LICENSE` byte-identical to apache.org: sha256 `cfc7749b…3d30`, 11 358 bytes, fetched not retyped.
    - `package.json` `"license": "Apache-2.0"` (exact SPDX id, numstat `1 1`); `"private": true` stays.
    - The lock root line (`1 1`, probed: npm moves exactly one line).
    - `NOTICE`: `skytalix` / `Copyright 2026 Olger Oeselg` / the Apache line / the four kit files MIT. Checks: 0 `@`,
      0 `/Users/`, ASCII only.
    - One `expect(packaged.license…).toBe("Apache-2.0")` line in `ABC-042` `A10` (`1 0`, armed).
    - **No `cli.test.ts` key pin moves:** `AT_HEAD` already holds `"license"`.
  - **[A]** A `NOTICE` CC BY-SA 3.0 section names `src/evaluate.ts` and the 7 identifiers. The `evaluate.ts` header
    gains two comment lines (transpile identity, `A6`). The identifier list is checked against the build base. The
    re-derive is a later ticket, on the owner's word.
  - **[B]** The re-derive goes first, as an `EPIC-008` ticket, not cut here. It is value-changing, owes G1/G2/G3/G6/G9
    and a width-1 D reading, and its ship rule is open. `ABC-214` then builds with no carve-out. Its pull precondition:
    `grep -ciE 'michniewski|by-sa' src/evaluate.ts` = 0.
  - **ABC-205:**
    - [A] different lines; the merge is comment-only, so `ABC-205`'s D reading stays valid.
    - [B] each value-changing merge makes the other's D reading stale. There are two orders, both stated.
    - **Route to the `ABC-205` design hop:** name the source of every new king value. A Michniewski king endgame table
      would join the carve-out.
  - `ABC-041` (a) fires → a short Security/NFR hop. `ADR-0036` (b1), (b2) and (c) do not fire. No NFR moves. UAT is
    WAIVED by measurement.
- **For the Orchestrator:**
  - **OD-214-1** to the owner. The proposed text is on the page, § Dependencies.
  - The **licence ADR** (Architect/Design) is accepted before `ABC-214` merges, not before it builds. **14 drift rows**
    are on the page: `ADR-0044` D13 ×4, Revision/Qs, Consequences ×2; `ABC-169` ×3; `EPIC-007` M10, the box/Scope/table
    and `RISK-EPIC007-07`; also `ADR-0023:60-63`.
  - `EPIC-007` needs one dated line, because this hop was fenced off the epic page.
  - No personal-data or homelab detail from the held Security branch is in anything written.
  - **Next free id: `ABC-215`.**
- **Not touched:** `src/`, `package*.json`, `LICENSE`/`NOTICE`, the ADRs, the epics, the board and the trace. In
  main's checkout only this record and its claim moved, and both are uncommitted.

### Board card line

`- [ABC-214] The repository is licensed Apache-2.0: verbatim LICENSE, NOTICE, "license": "Apache-2.0" in package.json; the CC BY-SA 3.0 evaluation tables carved out (A) or re-derived first (B)  (owner: software-engineer, after the owner's A/B answer (OD-214-1) and, before merge, the Architect's licence ADR, size: XS, priority: P1, epic: EPIC-007 (post-close addition), since: 2026-10-24, DoR 9/10 — Backlog until OD-214-1; cut in \`bapm-cut-licence\` (\`…efbbb9ee\`). Owner word \`…28633db0\`. LICENSE sha256 cfc7749b…3d30 (11 358 B); package.json + lock root 1/1 each, private stays true; NOTICE copyright 2026 + kit MIT, 0 @ / 0 /Users/; +1 armed value pin in ABC-042 A10, no key pin moves. [A] NOTICE carve-out of 7 arrays + 2 header comment lines (transpile identity), re-derive later. [B] EPIC-008 re-derive ticket first (not cut), then no carve-out. ABC-205 interaction per path. ABC-041 (a) → short Security/NFR hop; UAT waived by measurement. 0 executable lines)`

### Trace row (10 cells, header order)

| ABC-214 (bapm-cut-licence) | The repository is licensed Apache-2.0: verbatim LICENSE, NOTICE, "license": "Apache-2.0" in package.json; the CC BY-SA 3.0 evaluation tables carved out (path A) or re-derived first (path B) | EPIC-007 (post-close addition) | licence | none moves; ABC-041 (a) fires (Security/NFR short hop); ADR-0036 b1/b2/c do not; LIC-PUB-1 (owner); supersedes ADR-0044 D13 / EPIC-007 M10 via the Architect's licence ADR (14 drift rows) | grugops/bapm-cut-licence @ 25223d72 (records only)<br>plans/tickets/ABC-214-the-repository-is-licensed-apache-2-0.md<br>notes …9475c6d2, …efbbb9ee | — | expected WAIVED by measurement ([A] A6 transpile identity; [B] 0 src production files) | — | cut → Backlog (XS, P1, DoR 9/10; OD-214-1 open) |
