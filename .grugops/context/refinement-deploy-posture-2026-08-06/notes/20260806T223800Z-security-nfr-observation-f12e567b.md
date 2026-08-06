---
id: 20260806T223800Z-security-nfr-observation-f12e567b
kind: observation
by: security-nfr
at: 2026-08-06T22:38:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - security-nfr-availability-bar
  - 20260806T223500Z-security-nfr-decision-c4552274
  - package.json
  - src/
  - .github/
  - plans/releases/
  - agent-factory/config/factory.config.md
  - agent-factory/checklists/security-nfr-checklist.md
supersedes: 
---

# What was checked and how — the availability question measured against the repository, not read off the previous hop's note

Every claim in the ruling was verified here on 2026-08-06 **before the config or the catalog was
written**. The Architect's hop published an overlapping scan; **it was not inherited** — this column's
standing practice on this project is to re-measure rather than accept another role's figures, and
three of the rows below go somewhere their scan did not.

| # | Question | How it was checked | Result |
|---|---|---|---|
| 1 | Is there anything that could be "up"? | read `package.json` | `"private": true`; **no `bin`, no `main`, no `exports`**; no `start` script. It cannot be `npm publish`ed and it exposes nothing to run |
| 2 | Is there an entry point? | `ls src/`, counting non-test modules | **10 modules, no entry point** — no `index.ts`, `main.ts` or `cli.ts`. `perft-bench.ts` is a verification harness that prints, not the game |
| 3 | Does anything listen, serve or outlive its invocation? | grepped `src/` for `listen(`, `createServer`, `http`, `net.`, `socket`, `express`, `fastify`, `setInterval`, `process.on`, `ws://` | **Zero code matches.** Six hits, **all English prose in comments** ("express", "expression", "safety net"). **No socket, no server, no timer, no signal handler** — the program exists only while a developer's process is running |
| 4 | Is there an observer that could see it unreachable? | `git remote -v`; `ls -a .github`; `ls .github/workflows` | **No remote at all.** `.github/` holds one file (`copilot-instructions.md`) and **no `workflows/` directory — there is no CI** |
| 5 | Has anything ever been released? | `ls -a plans/releases/` | **`.gitkeep` only** — zero release records. Machinery present and empty, which is the state this task preserves |
| 6 | Is there a build artifact? | `package.json` `build`; `ls -d dist` | `build` is `tsc --noEmit` — **emits nothing**; **no `dist/`** |
| 7 | Does the key's contract permit the ruling? | read `agent-factory/config/factory.config.md` | `nfr.availability` is a free-form string with **no allowed-value set**, and it is **not** among the nine keys in the "Config-dial contract" table. **It can honestly carry the ruling** |
| 8 | Who actually reads the key? | grepped the whole kit for `availability` | The config reference, the seed catalog's *categories to consider* line, and three ASVS rows — `V15.1.3`, `V15.2.2` (**L2**) and `V16.5.4` (**L3**). **No workflow, role or checklist reads `nfr.availability` by name** |
| 9 | Does the ASVS tier this project runs at contain an availability requirement? | filtered `agent-factory/checklists/security-nfr-checklist.md` to `security.asvs_level: L1` | **70 L1 rows; ZERO availability requirements.** The two L1 rows containing the string are `V6.2.4` (breached-password list) and `V14.3.1` (clearing client storage) — neither is about service availability |
| 10 | Was the bar ever in this project's catalog? | grepped `plans/nfr-catalog.md` before editing | **Once**, in the FORMAT comment's *categories to consider* list. **No row, no denominator, no machine, no `Verified by` cell** — unlike every other number this project holds itself to |
| 11 | Did the edit break the config? | `node -e "require('./.grugops/factory.config.json')"`, then re-read the parsed values | Parses OK. `nfr.availability` set; **`production_requires_human_confirmation` re-read and still `true`**; `environments` still `["local"]`; `default_stack.deploy` still `"none-local-only"`. `git diff` shows **exactly one changed line** |
| 12 | Did the catalog edit disturb adjacent content? | `git diff -U0 plans/nfr-catalog.md`, plus a byte comparison of the old `_Updated:` line against the new one | **Two hunks only: line 2, and a pure append after the last line.** The previous 13,224-character header survives **verbatim** after the inserted "Previously"; `NFR-001`–`NFR-007` and all `ABC-011` / `ABC-012` measured figures are **byte-identical** |

## The shape of the result, which matters as much as the result

**The absence is uniform, not partial.** There is no entry point, no listener, no timer, no remote,
no CI, no artifact and no release — so there is not one component of an availability measurement
anywhere in this repository. **`99.9%` was not an unmet target; there was never a thing it was about.**

## What this observation does NOT claim

- **No availability measurement was attempted**, because none is possible; **no number was invented**.
- **No performance bar was re-measured.** `NFR-005` and every other performance row were left closed —
  out of scope for this subtask by explicit instruction, and nothing here depends on re-opening one.
- **Row 3 is a static grep, not a proof of process lifetime.** It is strong evidence and it is stated
  as evidence: a module could in principle acquire a long-running surface later without any of those
  tokens. **That is what the trigger in `plans/nfr-catalog.md` exists to catch**, and it is why the
  trigger is written as a condition rather than a date.
