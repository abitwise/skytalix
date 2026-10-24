---
subtask: security-nfr-ABC-214
role: security-nfr
ticket: plans/tickets/ABC-214-the-repository-is-licensed-apache-2-0.md
ref: .grugops/context/security-nfr-ABC-214/
branch: grugops/ABC-214 (2a9f38cf), worktree ../wt-ABC-214
width: 2 of 3 (beside qe-ABC-213; no timing)
---

# Security/NFR short hop for ABC-214 (ABC-041 clause (a): package*.json touched)

## Do
- The ABC-041 (a) review of the package.json / package-lock.json change, and the page's Security and NFR sections. Confirm NOTICE/LICENSE carry no personal or host detail beyond the owner-chosen copyright line, and that "private": true still keeps it off npm.
- Result: PASS / required fixes / accepted risks with severities. Licence readings stay UNKNOWN - verify (not legal advice).

## Fences
- Only ../wt-ABC-214 and /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec214/. No src or ADR edits. Don't touch the held security-nfr-public-repo branch or copy anything from it except licence facts; no homelab detail. Never push, force, amend or rebase; never merge into main; no board edits.

## Publish
- Commit on the branch. Seal notes (task security-nfr-ABC-214). ## Result + trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**PASS_WITH_RISKS** (Security/NFR, 2026-10-24, on `grugops/ABC-214` @ `246754cb`, from `2a9f38cf`; records only. No lane or timing was run, and no `src/` edit was made).

- **Required fixes: none.**
- **ABC-041 (a): FIRES, no finding.**
  - `package.json` and `package-lock.json` are `1 1` each, and the only change is the licence value.
  - The lock has 0 `resolved`, `integrity` or `version` lines changed.
  - There is no `dependencies`, `publishConfig` or `files` key.
  - `scripts`, `devDependencies`, `bin` and `engines` are identical at base and tip.
- **`"private": true` still keeps it off npm: MET.**
  - It is unchanged and pinned by ABC-042 A10.
  - npm 11.20.0 `libnpmpublish/lib/publish.js:15` throws `EPRIVATE` before any registry call. This is a source read; no publish was run.
- **NOTICE, LICENSE and the two header lines: MET.**
  - Every personal or host pattern counts 0: email, home paths, hostnames, IPv4, `homelab`, `ssh`, `token`, `secret`, `key`. Non-ASCII bytes: 0.
  - The owner's name appears only in the copyright line and the kit MIT line. He chose both (ADR-0048 decisions 2 and 5).
  - `LICENSE` sha256 equals the A3 pin.
- **ASVS L1:** no row fails. V15.1.1 and V15.2.1: no component changed. V13.4.1: not applicable (no deploy).
- **NFRs: none moves.** An independent `transpileModule(removeComments)` of `src/evaluate.ts` gives 9014 B with the same hash at `c487d89c`, base, tip and head.
- **Accepted: QE-214-a, LOW. Owner: BA/PM** (whether a guard ticket is cut).
  - Only `package.json`'s licence is gated. A silent drop of the carve-out would claim Apache-2.0 over the CC BY-SA values again.
  - LOW because no L1 control fails, a drop needs a deliberate edit, and every edit gets a QE hop. ABC-215 is the next ticket to touch these lines.
- **INFO SEC-214-a. Owner: the owner. No action asked.**
  - The metadata (`Apache-2.0` in `package.json` and the lock, and GitHub's read of `LICENSE`) does not express the carve-out. Only `NOTICE` and the header do.
  - An SPDX `AND` expression would contradict A1 and ADR-0048 decision 1, so it is not proposed. ABC-215 makes it moot.
  - `UNKNOWN - verify`.
- **Licence readings stay `UNKNOWN - verify`** (not legal advice): OQ-214-4, ADR-0048 decisions 4 and 8. LIC-PUB-1 (MEDIUM, owner) is not re-scored. Nothing was read from the held `security-nfr-public-repo` branch.
- **Owed by the owner:**
  - acceptance of ADR-0048 (PROPOSED) before ABC-214 merges;
  - the GitHub licence display after a push (`UNKNOWN - verify`).
- **No HIGH**, so no risk acceptance goes to the owner.
- **Notes** (`.grugops/context/security-nfr-ABC-214/notes/` on `grugops/ABC-214`, sealed by grugops 2.1.0 `admitAndAppend`, read back as 2, index rendered):
  - `20261024T084459Z-security-nfr-observation-a9182d9f` (readings)
  - `20261024T084459Z-security-nfr-decision-91f3c0d1` (rulings and the result)
- **Not touched:** `src/`, `package*.json`, ADRs, `plans/board.md`, `plans/traceability.md` (the row below is the Orchestrator's), the page, `../wt-ABC-213`, the held branch. No column moved. Nothing was pushed or merged.
- **Process note:** a `render()` read early in this hop wrote two empty untracked index files into main's `.grugops/context/qe-ABC-214/`. I removed them at once, so main's tree carries none of them. The `se-build-ABC-214` index re-rendered byte-identical.

### Trace row (10 cells, header order)

| ABC-214 (security-nfr) | Security/NFR short hop, ABC-041 (a): package*.json touched by the licence value only (lock: 0 resolved/integrity/version lines); no dependencies/publishConfig/files key; scripts/devDeps unchanged; private:true unchanged and pinned, npm 11.20.0 EPRIVATE before the registry; NOTICE/LICENSE/header carry no personal or host detail beyond the owner-chosen copyright and kit MIT lines | EPIC-007 (post-close addition) | licence | none moves (transpile 9014 B identical at c487d89c/base/tip/head); ASVS L1 no row fails (V15.1.1, V15.2.1 no component change; V13.4.1 N/A); QE-214-a accepted LOW (owner BA/PM); SEC-214-a INFO (owner); LIC-PUB-1 not re-scored; OQ-214-4 UNKNOWN - verify | `grugops/ABC-214` @ `246754cb` (records only, from `2a9f38cf`)<br>`.grugops/context/security-nfr-ABC-214/notes/` (…a9182d9f, …91f3c0d1) | numstat, jq and diff over package*.json; libnpmpublish source read (no publish run); pattern scan of NOTICE/LICENSE/header; LICENSE sha = A3 pin; independent transpile identity in scratch | WAIVED (waived is not accepted), per QE PASS_WITH_GAPS …719817d2 (A6) | — | PASS_WITH_RISKS (no required fix); merge waits on the owner's ADR-0048 acceptance; In Security/NFR → Ready for UAT is the Orchestrator's |
