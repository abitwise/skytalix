---
id: 20261023T185614Z-architect-design-decision-5ffd0ca7
kind: decision
by: architect-design
at: 2026-10-23T18:56:14Z
verified_by: 
confidence: high
refs:
  - arch-adr0018-bin-note
  - ADR-0018
  - memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md
  - memory-bank/70-runbook.md
  - ABC-168
  - 7fa33c0c
  - 825b21d1
  - 513c0211
  - e1403550
  - ADR-0044
  - ADR-0007
  - AR-1
  - 20261023T185236Z-orchestrator-decision-366ebd9e
  - 20261023T105540Z-architect-design-decision-0f003634
  - 20261023T105540Z-architect-design-observation-97e856c3
  - 20261022T174056Z-release-manager-decision-edd18e94
  - 20261023T185614Z-architect-design-observation-a6addc0d
  - 20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57
supersedes: 
seal: sha256:d5872ac449a0086481bf0dd381eee08bbd45598a2043264aaf7e0d5ec90ef516
---

# Architect/Design: ADR-0018 gains the owner-approved dated note on the `bin` since ABC-168, and `70-runbook.md` § Deploy gets a dated correction. The channel is unchanged and the STOP condition did not fire

**What was done.** On branch `grugops/arch-adr0018-bin-note`, from `main` `7fa33c0c`. Both edits are additive (0 deleted lines):
- `memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md`: a dated `Note 2026-10-23` pointer at the top of `## Status`, and a closing `## § Note 2026-10-23: a bin since ABC-168` section. No clause is amended and no falsifier row is edited.
- `memory-bank/70-runbook.md` § Deploy: a `[CORRECTED 2026-10-23 …]` bracket after the 2026-09-19 bracket. The old sentence "Nothing is published, built or deployed" stays visible, and the bracket says how to read it now: nothing is published or deployed; the UCI engine artifact is built locally by `npm run build`.

The facts are in `…a6addc0d`.

**The authority.** The owner's in-session word of 2026-10-23, "approve the ADR-0018 note" (`…366ebd9e`). It sets the scope: a dated, additive note mirroring `ADR-0007`'s (`…0f003634`); Context row 2 and Decision 1 stay as dated history; no clause is amended; the channel is unchanged; STOP if the fact changes the channel. The runbook edit is the Orchestrator's ride-along in the same note.

**Ruling: the STOP condition does not fire.** The channel is how a user gets and starts the game: `git clone`, `npm install`, `npm run chess`. None of those steps changed. `chess` is still `node src/cli.ts` (unchanged since `e1403550`). The `bin` is the UCI engine's local entry for a GUI or backend to spawn, built in a clone (`ADR-0044` D8). The package is private and cannot be published. `D3` holds (no remote), so the `npx`-from-git option is not reachable. `ADR-0044` D8, accepted by the owner, already placed the `bin` inside this ADR. So `D2`'s worry, "this file is being superseded without saying so", does not apply: an owner-accepted ADR said so.

**How to read `D2` from now on.** The row is not edited. It is checked against the note's baseline, `[true,{"skytalix":"dist/uci.js"},false,false,false]`, the same as `ADR-0007`'s `D2`. Any other value fires `D2` again: a changed or second `bin`, a `main`, `exports` or `files` key, or `"private"` removed. A `start` alias is still not a `D2` event.

**Superseding triggers (not a note).** Decision 3's revisit triggers, and `ADR-0044`'s: `npm publish`, a `files` allow-list, packaging `dist/` for third parties. D8 also leaves install from a git URL out of v1. Under `D5`, each needs a new ADR, and that ADR is the owner's call.

**Follow-ups for the Orchestrator (INFO, nothing blocked, not edited here).**
- `70-runbook.md` § Operate is further out of date than § Deploy. It says "The game cannot be run", "`package.json` has no `bin` and no `start` script" and "`src/` has no entry module". `npm run chess` and `npm run uci` both exist. The brief limits this hop to § Deploy.
- The runbook's Roll back section says a rollback procedure is owed "the moment `EPIC-006` produces a distributed artifact". `dist/uci.js` is built but not distributed, so that sentence still holds.

**Not touched.** `src/`, `package*.json`, `plans/`, `.grugops/factory.config.json` and `AGENTS.md`. No board column moved. Nothing was pushed or merged.
