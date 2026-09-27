---
id: 20260927T112420Z-software-engineer-observation-63b1276a
kind: observation
by: software-engineer
at: 2026-09-27T11:24:20Z
verified_by:
confidence: medium
refs:
  - ABC-124
  - ticket-to-pr-ABC-124
  - tools/grugops/uat-spec-integrity.js
  - .grugops/install.json
supersedes:
---

# Risk: `uat-spec-integrity.js` is a kit-materialized file, so a re-install could revert the autofix

- **What the file says about itself.** Its header (lines 14–18) says it is authored as `.ts` in the
  central grugops kit, compiled, and then MATERIALIZED by the kit's `install.ts` into
  `tools/grugops/uat-spec-integrity.js`.
- **What was checked.** `.grugops/install.json` (`installMode: copy`, kit 2.1.0) has no per-file
  hash. `find ~/.grugops -name uat-spec-integrity.js` returned nothing, so there is no local kit
  copy to diff against, and no freshness gate in this repo that the edit could trip.
- **What could happen.** A future re-materialization from an upstream kit that still has
  `Object.prototype.hasOwnProperty.call` and the two trailing `continue`s would restore the 1 warning
  and 2 infos. After ABC-124, `npm run lint` would show them. Its exit code would stay 0, because
  Biome exits 0 on warnings and infos. So only someone reading the lint summary would notice.
- **Not actioned; out of scope.** The fix upstream belongs in the kit repository. This is named so
  it is not lost. UNKNOWN - verify whether the kit's current `.ts` source already uses
  `Object.hasOwn`.
