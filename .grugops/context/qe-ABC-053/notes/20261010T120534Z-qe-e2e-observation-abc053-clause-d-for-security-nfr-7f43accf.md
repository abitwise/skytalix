---
id: 20261010T120534Z-qe-e2e-observation-abc053-clause-d-for-security-nfr-7f43accf
kind: observation
by: qe-e2e
at: 2026-10-10T12:05:34Z
verified_by:
confidence: high
refs:
  - ABC-053
  - ADR-0029
  - N8-LANE
  - src/history-pane.nfr.test.ts
  - src/render-seam.test.ts
  - 20261010T120534Z-qe-e2e-decision-abc053-verdict-pass-with-gaps-928ba81f
supersedes:
---

# `ABC-053` for Security/NFR: clause (d) FIRES as named in advance; the facts for (a)–(c). QE claims no verdict

This note is hand-authored and unsealed. It holds facts only. The ruling on each clause is
Security/NFR's.

- **(d) FIRES.** `git diff --name-status e15eb31d..57251578 -- src/` lists **two** files:
  `src/history-pane.nfr.test.ts` and `src/render-seam.test.ts`. The second is the one `ADR-0029` and
  `A5` named before code landed. Its diff is +6/−6, in three places:
  - the header sentence `FRAME_PRODUCERS` → `COMPOSITION_ROOT`;
  - the `A9` title;
  - the one re-pointed assertion: from `declaredList("FRAME_PRODUCERS")` containing
    `"render-seam.ts"` to `probe` matching `/^const COMPOSITION_ROOT = "render-seam\.ts";$/m`.

  The `LICENSED_DRIVERS` assertion (`:327`) is byte-identical, and so is the `declaredList` helper.
  **No new file.**
- **(c), the facts.**
  - `spawnSync(` count is 1 → 1.
  - The existing child gains: an `import()` of `history.ts?fixture` and of `legal.ts`, both inside
    `src/`; two frame calls; and a 3-turn `setImmediate` settle.
  - Its argv changes from the root list to `[arming, root, START_FEN, "40"]`.
  - The child writes only to fd 3 (`writeSync(3, …)`, pre-existing). It does no network and no
    filesystem write.
  - stdio is unchanged: `["ignore", "ignore", "pipe", "pipe"]`.
- **(b)**: 0 non-`.test.ts` paths under `src/`.
- **(a)**: 0 `package*.json` paths.
- **Cost:** QE did not re-time. The Engineer's narrow-set reading stands as recorded (`…3a8f5aa3`):
  set 2 admissible, R 0.052 s, +0.008 s CPU; set 1 inadmissible. `N8-LANE` has no added file in
  scope. **No `NFR-008` line is claimed by QE.**
- **A QE gap with a security-shaped edge:** QE-053-a. A second composer can bind `assembleFrame`
  through a re-export or a dynamic import without tripping the tripwire. It is graded LOW as a reach
  gap in a test instrument, not a security exposure. Security/NFR may re-grade it.
