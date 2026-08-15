---
id: 20260815T213300Z-agents-md-scribe-observation-the-whole-file-swept-for-the-same-contradiction-c52008d1
kind: observation
by: agents-md-scribe
at: 2026-08-15T21:33:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q13
  - AGENTS.md
  - EPIC-006
  - ABC-043
supersedes: 
---

# Every other place the same contradiction could have settled, and what each one actually says

The one-line fix is worthless if the same false belief is sitting in three other sentences. I swept
the whole file rather than only the two lines I was handed. Search was
`entry point|EPIC-006|UNKNOWN - verify|runnable|npx|packag|publish|distribut|deploy|no CLI|dist/|bin`
over all 268 lines, then each hit read in context and tested against the tip.

## The finding of the sweep: **one site, and I fixed it.** Every other site is clean.

| # | site | what it asserts | verdict |
|---|---|---|---|
| **1** | § Deployment posture L184-185 | no entry point; `Dev / run` is `UNKNOWN - verify` and stays so | **THE DEFECT — fixed.** Both clauses false |
| 2 | § Safety rules L217-219 — *"nothing to deploy and nowhere to deploy it"* | there is no deployable artifact | **CLEAN, and the trap.** Still true: `private: true`, no `bin`/`main`/`exports`/`files`, no build output, no `dist/`, no remote. Running `src/cli.ts` in place is not an artifact. **Deliberately not touched** |
| 3 | § Build L99-101 — *"emits nothing, because nothing is published until EPIC-006 packaging"* | build emits nothing; nothing published | **CLEAN.** `build` is still `tsc --noEmit`, still emits nothing, still publishes nothing. An entry point is not an emission |
| 4 | § Deployment posture L188-190 — the `EPIC-006` / distribution-undecided paragraph | distribution undecided, reserved to `EPIC-006` | **CLEAN and load-bearing.** Byte-identical after my edit. Its phrasing *"how the CLI will eventually be distributed"* already presupposed a CLI, so it never contradicted the entry point |
| 5 | § Deployment posture L182-183 — no container / manifest / CI / remote / release | five absences | **CLEAN, re-measured this hop**, not passed through on trust: zero YAML files in the repo, `.github` holds only `copilot-instructions.md`, `git remote -v` empty, `plans/releases/` is `.gitkeep` only |
| 6 | § Deployment posture L196-201 — *"Nothing here relaxes anything"* | `production_requires_human_confirmation` stays `true`; never-deploy stands; deploy not in merge approval | **CLEAN.** Config re-read: still `true`. Untouched |
| 7 | § Deployment posture L203-209 — kit precedence | `12-release.md` / `release-manager.md` hardcode `dev → staging → prod`; project files win | **CLEAN.** Unrelated to entry points |
| 8 | § Branching model L157-178, incl. the config trap | deploy excluded from the merge directive; `pr` means "branch + gate"; no remote | **CLEAN.** Nothing here turns on an entry point existing |
| 9 | § Commands L112-115 — the `ABC-008` provenance comment | every recorded command was RUN; remaining `UNKNOWN - verify` slots are genuinely unknown | **CLEAN, and now *more* true.** I ran `npm run chess` myself before leaving the slot in place |
| 10 | § Commands — the other four `UNKNOWN - verify` slots (Acceptance L77, Typecheck-single-file L93, Docs build L102, Clean/reset L103) | each genuinely unknown | **CLEAN.** None of the four is a function of a CLI existing; `tsc` still has no single-file mode. **Not filled in** — I have run none of them |
| 11 | § Stack L118-121 — *"Node runs `.ts` files directly … no bundler or transpile step in dev"* | no build step in dev | **CLEAN, and corroborated.** `scripts.chess` is literally `node src/cli.ts` and it ran with no `node_modules` |
| 12 | § E2E L107-108 — *"no runnable game until `EPIC-006`; … no UI surface yet"* | E2E slot is `UNKNOWN - verify` | **NOT the same contradiction, but the closest call in the file. Flagged, not fixed — see the gaps note** |
| 13 | Mission, How to work here, Role/workflow files (incl. the no-`finding` substrate note), Kit vs state, Delivery, Process rules, Coding rules, DoR/DoD, Memory bank & plans, When uncertain | — | **CLEAN.** No entry-point, packaging or deployment claim anywhere in them |

## The one I want on the record as a near-miss

**Row 2 is the sentence a careless fix breaks.** § Safety rules says *"There is also nothing to
deploy and nowhere to deploy it."* The tempting reading after `ABC-042` is "well, now there is
something" — and it is **wrong**. `npm run chess` is an npm run-script invoked from inside a checked-
out repo; it produces no artifact, installs nothing, and publishes nothing. The sentence is true at
this tip and I changed not one character of it. Anyone who later "harmonises" it with the entry point
has moved the deploy fence without an ADR.

## Size

`AGENTS.md` is **16,547 bytes** after the edit — half the 32 KiB Codex cap. Net +2 lines. I removed
nothing else; the sweep found no line worth deleting that belongs to this ticket, and deleting a
line another hop placed is not a contradiction fix (coding rules 9-12).
