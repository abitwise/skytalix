---
subtask: security-nfr-QE-193
role: security-nfr
tickets: [ABC-193]
branch: main (read only; records only — commit nothing, the Orchestrator commits)
ref: .grugops/context/security-nfr-QE-193/
width: 1
---

# Security/NFR (short read): rate QE-193-b (MEDIUM proposed) and QE-193-a (LOW proposed) — pre-existing clause (b) parsing blind spots. ABC-193 is merged; this gates nothing already merged

## Read first
- QE gap register and verdict `.grugops/context/qe-ABC-193/notes/20261021T182104Z-qe-e2e-decision-69c93667.md`, routes and names `…9c7a6680`; Orchestrator close `…f61be5db`.
- Your own `…7c1f3590` (AR-191-*), `…f5843a71` (AR-188-BINARY); `ADR-0036` § S1 (all dated blocks); `.grugops/context/design-F-072-1/probe/clause-b.mjs`, `r2-mutants.sh`.

## Do
- **QE-193-b:** an added line whose text starts `++ ` is read as a `+++` header, so every later hunk of that file is unseen on limbs 2/3 (head and base); passes lint inside a template literal. Reproduce in a scratch clone (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`). Rate it: who can reach it, effect, whether limb 1 / Ruling 2 / the waiver form still catch anything. QE's suggested fix: headers only before the first `@@` (also removes R-193-a's false dispute).
- **QE-193-a:** a production path with a space (git appends a TAB to its `---`/`+++` line; `isProduction` rejects it). Rate it.
- **QE-193-c/-e (INFO):** agree or re-rate.
- For each: accept (owner, trigger), or open an AR with what a fix ticket must hold and its close condition; say whether a hand stand-in is needed at merges until fixed, and give the exact line if so.

## Fences
- Read only on the repository. No edits to `src/`, the instrument, harness, ADRs, `AGENTS.md`, `plans/`. Never edit this repository's or any worktree's git config or `.git/info/attributes`, and never your real `HOME`'s. Do not touch anything under `node_modules/`.
- Your notes go into main's tree under `.grugops/context/security-nfr-QE-193/`, uncommitted.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-QE-193`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision` with your result. A `finding` needs a §14 gate stamp; without one, record it as a decision or observation.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/security-nfr-QE-193.md` + `.claim.md`, main's tree, uncommitted).
