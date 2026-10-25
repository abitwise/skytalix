---
id: 20261025T122917Z-security-nfr-observation-5a234bae
kind: observation
by: security-nfr
at: 2026-10-25T12:29:17Z
verified_by: 
confidence: high: git diff numstat at 794d5c04; file reads and git grep at cc30eebe
refs:
  - security-nfr-lic-pub-1
  - grugops/security-nfr-lic-pub-1
  - 794d5c04
  - cc30eebe
  - EPIC-008
  - ADR-0049
  - SEC-PUB-1
  - SEC-PUB-3
  - SEC-PUB-4
  - SEC-212-b
  - plans/nfr-catalog.md
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - security-nfr-adr0049-row34/20261024T155830Z-security-nfr-observation-f2ef08e0
  - security-nfr-adr0049-row34/20261024T155800Z-security-nfr-decision-3f3817a9
  - orch-2026-10-25x/20261025T122241Z-orchestrator-decision-26f4e001
supersedes: 
seal: sha256:879b29545ae3bf18ecea011e7765afcc5d922bed87858ac711ad915eec496a2c
---

# Two records edited at the tip, commit `794d5c04`: the EPIC-008 cutechess-cli host path replaced by a placeholder (ADR-0049 decision 4); the stale "no bin, ten modules" NFR row dated. No bound moved

Security/NFR, task `security-nfr-lic-pub-1`. Branch `grugops/security-nfr-lic-pub-1` from `main` `cc30eebe`. Records only. Two files: 6 lines added, 3 removed. Nothing run: no npm, vitest, build or timing.

## 1. EPIC-008 § Dependencies (`plans/epics/EPIC-008-…md`): 4 added, 2 removed
- **Class and count:** 1 absolute home-directory path (personal path: it holds the owner's account name and local folder layout) to the `cutechess-cli` build. It was the page's only one; the count is now 0.
- **Replaced by** the placeholder `<local build dir>/cutechess-cli`. Version `1.5.1`, sha256 `fb4fc2aa…5e766e1c` and the 2026-10-23 re-read are unchanged. A dated bracket on the bullet says why.
- **Rule applied:** `ADR-0049` decision 4, "a record names infrastructure by class and count only … no personal path", applied forward to a live page. Older versions of the page and dated history keep the path. No history rewrite (`SEC-PUB-1` accepted; `ADR-0048` decision 8).
- **Stockfish path kept, by reading d4:** `/opt/homebrew/bin/stockfish` is a system package-manager prefix. It holds no account name and is none of d4's classes (hostname, domain, address, realm, cluster or context, service or secret name, personal path). It is host-fingerprint class (`SEC-PUB-4`, LOW, "remedy: none needed"). It also appears at EPIC-008 line 88. Not edited.
- **Not edited, out of fence:** 1 dated board line carries a home-relative form of the same build path (board edits are fenced; dated history). Repo-wide personal paths are `SEC-PUB-3` (LOW, QE/E2E forward fix), not this brief.

## 2. `plans/nfr-catalog.md`: 2 added, 1 removed
- **Where:** § Availability, SLO table, row "Something that is "up" between uses", the "What is actually here" cell. A dated bracket sits after the statement, the same shape as row 34's (`…3f3817a9`). The stale line was found at the `SEC-212-b` hop (`…f2ef08e0`).
- **Re-read at `main` `cc30eebe`** (file reads and `git grep` only): `package.json` has a `bin` with 1 entry (the UCI program, `ADR-0044` D8), no `main`, `exports` or `start`; `src/` holds 46 production modules (non-test `.ts`) and 2 entry points (`npm run chess` → `src/cli.ts`, `npm run uci` → `src/uci.ts`). The cell's own grep list (`listen(`, `createServer`, `http`, `net.`, `socket`, `express`, `fastify`, `setInterval`, `process.on`, `ws://`) over the 46 modules: 0 code matches, 5 hits, all English prose in comments.
- **The conclusion holds:** nothing runs between uses. The struck words and the 2026-08-06 check are kept as history.
- One `_Updated` line added at the top. No `NFR-001`–`NFR-012` row changed (the diff touches only the `_Updated` line and the SLO row). `nfr.availability` unchanged.

## Checks
- Added lines scanned for personal paths, the account name, `.local` host names and private IPv4 ranges: 0 hits.
- `plans/traceability.md` and `plans/board.md` not touched; the 10-cell trace row is in the brief's Result.
