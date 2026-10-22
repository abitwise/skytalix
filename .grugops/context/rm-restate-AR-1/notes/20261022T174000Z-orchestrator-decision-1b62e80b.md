---
id: 20261022T174000Z-orchestrator-decision-1b62e80b
kind: decision
by: orchestrator
at: 2026-10-22T17:40:00Z
verified_by: 
confidence: high
refs:
  - AR-1
  - ABC-168
  - .grugops/context/rm-restate-AR-1/notes/20261022T172518Z-release-manager-decision-130fb9a3.md
  - .grugops/context/rm-restate-AR-1/notes/20261022T172439Z-release-manager-observation-eb1d1cdf.md
  - .grugops/context/rm-ABC-158/notes/20261017T180500Z-release-manager-decision-ar1-restated-901f43b6.md
  - .grugops/context/owner-delegation-2026-10-22/notes/20261022T140148Z-orchestrator-decision-5aaf7cec.md
supersedes: 
seal: sha256:3dd45b861cb3ebfdaef8dfda34921e8e8861cf4aba893bb83f19494f1b8fc1c5
---

# AR-1 premise drift: route (a), a Security/NFR premise re-read

**Merged** `grugops/rm-restate-AR-1` @ `256fdd5c` into `main` at `6ccbcc3e`. AR-1's advisory set is re-stated as 3 pairs: nanoid GHSA-2v37, postcss GHSA-fxqj and source-map-js GHSA-68fv, all dev-only. `--omit=dev` reads 0. The interim accept `…e4ef897b` has lapsed. New trigger (3): compare pair lists, never counts.

**Premise trigger (2) has fired** (`…eb1d1cdf`). ABC-168 (`513c0211`) changed three of the recorded premise checks from `…901f43b6`:
- check 3: `package.json` `bin` is `skytalix` → `dist/uci.js`;
- check 4: `npm run build` now writes 22 `dist/*.js` files;
- check 5c: built-in imports are now `{node:fs, node:readline}`.

Check 6 does not read `scripts.uci`. No re-read of the premise followed the ABC-168 merge, which is a process miss. The RM measured that no npm package loads on either runtime path, in `src` production or in `dist`.

**Ruling:** option (a). Security/NFR re-reads AR-1's premise with `bin` and `dist/` in scope (`security-nfr-AR-1-premise`), then publishes the revised check table and reason. The 3 pairs are dev-only and nothing on the board waits on this, so the route is in scope for the delegation `…5aaf7cec`.

**Escalation rule:** if the re-read concludes that any pair is HIGH in context (for example, a shipped path that loads a flagged package), that acceptance is the owner's. Security/NFR stops and publishes a finding, and I escalate.

**Process fix:** any ticket that adds a `bin`, a build output or a runtime dependency owes an AR-1 premise re-read before Done.
