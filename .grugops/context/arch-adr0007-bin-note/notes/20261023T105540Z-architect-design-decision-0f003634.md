---
id: 20261023T105540Z-architect-design-decision-0f003634
kind: decision
by: architect-design
at: 2026-10-23T10:55:40Z
verified_by: 
confidence: high
refs:
  - arch-adr0007-bin-note
  - ADR-0007
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - ABC-168
  - 2d962400
  - 825b21d1
  - 513c0211
  - ADR-0044
  - ADR-0018
  - AR-1
  - AR-168-BINPIN
  - 20261023T105100Z-orchestrator-decision-d3681daa
  - 20261022T172439Z-release-manager-observation-eb1d1cdf
  - 20261022T173538Z-security-nfr-observation-a8796ea3
  - 20261022T173546Z-security-nfr-decision-7d7b76ec
  - 20261022T174056Z-release-manager-decision-edd18e94
  - 20261023T105540Z-architect-design-observation-97e856c3
  - 20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57
  - memory-bank/70-runbook.md
supersedes: 
seal: sha256:b9cc912709897d2e0889699bd4bebcb6bff47f2ec5025333f1164c2525c1f1a8
---

# Architect/Design: ADR-0007 gains the owner-approved dated note on the `bin` since ABC-168. The posture is unchanged and the STOP condition did not fire

**What was done.** I added one block to `memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md` on branch `grugops/arch-adr0007-bin-note`. It is additive only (0 deleted lines):
- a dated `Note 2026-10-23` pointer in `## Status`, after the 2026-10-11 pointer;
- a `## § Note 2026-10-23: a bin since ABC-168` section at the end of the file.

No clause is amended and no falsifier row is edited. The facts behind it are in `…97e856c3`.

**The authority.** The owner's in-session word of 2026-10-23, "approve the ADR note" (`…d3681daa`). That note defines the scope: "a dated note on an accepted ADR, not a reversal; no posture change".

**Ruling: the STOP condition does not fire.** A `bin` on this package is a local executable. It is not a distribution channel and not a deploy:
- The package is `"private": true`, with no `main`, `exports` or `files` key, so it cannot be published.
- `D1`, `D3` and `D4` hold, and `D7` reads `true`.
- `ADR-0044` D8, which the owner accepted, already placed the `bin` inside `ADR-0007` and `ADR-0018`.

So only `D2`'s "exposes an executable" leg fired. That is a fact about the as-built surface, and the note records it. The posture in clause 1 ("deploys nowhere, runs locally") still holds.

**How to read `D2` from now on.** The note gives a baseline for `D2`, `[true,{"skytalix":"dist/uci.js"},false,false,false]`. Any other reading fires `D2` again. This keeps the row live without editing it.

**Superseding triggers (not a note).** A publish, a `files` allow-list, packaging `dist/` for third parties (`ADR-0044` D8's revisit trigger), a git remote taken as distribution, or a release record. Under `D5`, any of these needs a new ADR, and that ADR is the owner's call.

**Index.** No pointer was added. `memory-bank/00-index.md` lists `50-decisions/` as a folder and has no per-ADR rows, and there is no separate ADR index file.

**Follow-ups for the Orchestrator (INFO, nothing blocked).** `ADR-0018` has the same `D2` row and the same out-of-date wording ("no `bin`", "no `dist/` is emitted"). `memory-bank/70-runbook.md` § Deploy says "Nothing is published, built or deployed". Each could get a matching dated note. The owner's approval `…d3681daa` names only ADR-0007, so I did not touch them.

**Not touched.** `src/`, `package*.json`, `plans/`, `.grugops/factory.config.json` and `AGENTS.md`. No board column moved. Nothing was pushed or merged.
