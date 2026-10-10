---
id: 20261010T113116Z-qe-e2e-decision-abc058-verdict-pass-with-gaps-47836894
kind: decision
by: qe-e2e
at: 2026-10-10T11:31:16Z
verified_by:
confidence: high
refs:
  - ABC-058
  - ABC-042
  - ABC-041
  - ABC-059
  - V1.2.5
  - V1.3.3
  - N8-SPAWN
  - N8-LANE
  - ADR-0035
  - src/cli.test.ts
  - 20261010T113116Z-qe-e2e-observation-abc058-twenty-four-probes-head-vs-base-4b252e30
  - 20261010T113116Z-qe-e2e-observation-abc058-gap-register-904bdd2d
  - 20261010T113116Z-qe-e2e-observation-abc058-clause-c-question-for-security-nfr-ebb74095
  - 20261010T111050Z-software-engineer-decision-abc058-token-bytes-pin-strip-comment-wording-0963774f
  - 20261010T111050Z-software-engineer-observation-abc058-gates-mutants-a1-a8-cost-b98960df
  - .grugops/context/qe-ABC-058/probe/out-gates-tip.txt
supersedes:
---

# `ABC-058` QE verdict: **PASS_WITH_GAPS** at `fb914ded`. `A1`, `A2`, `A5`–`A8` MET; no gap blocks it

Hand-authored, no seal. This is a `decision`, not a `finding`: no `§14-gate` verdict exists on this
install.
- Under review: `b21ec7cf...fb914ded` on `grugops/ABC-058-security-bar-instruments`. The code
  commit is `f2235ecd`.
- QE ran the gates in the Engineer's worktree. Every mutant ran on QE's own harness, in `git archive`
  copies in QE's scratchpad.

| | reading | result |
|---|---|---|
| `A1` | A prose docblock naming `` `spawnSync(` ``: base RED on the pin, head **GREEN 66/66**. A `//` line comment (`Q10`) flips the same way | **MET** |
| `A2` | `MS1` and `MS2` rebuilt and run: RED 1/66 on the pin at base and head. **As written, MET.** But the title "no kill traded" does not hold in general: `Q11`–`Q13` (a real child hidden behind a `//` or `/*` inside a string) were RED at base and are GREEN at head. That is QE-058-a, LOW | **MET** (gap QE-058-a) |
| `A5` | `M3h`: base GREEN 66/66 → head **RED 1/66, bar 3** (`expected [ 127 ] to deeply equal []`). Bar 3's non-vacuity holds on the correct build (control 66/66). Removing DEL from the token makes `M3h` survive again (`Q7b`), so the byte is load-bearing | **MET** |
| `A6` | `M3f`/`M3g`: RED on the `A8` number row at base and head, and on bar 3 as well at head. The row at `:1640` is byte-identical: no `numbersIn` line is in the diff, and it still reads `["0","0x20","0x7f","1","2","70"]` | **MET** |
| `A7` | `N8_SPAWN = 17 + 7 + 1 + 2` = **27**. `CHILDREN` has 27 keys (static count, plus the pin row green). There is **one** `spawnSync(` call site (`const child = spawnSync(` in `childOf`) on the raw view, the stripped view **and** the TypeScript scanner's view. Imported names: `["spawnSync"]`. `it(` lines added or removed: 0. 66 tests. Bar 3 still locates by `split(/\s+/)` and asserts over every occurrence | **MET** |
| `A8` | `git diff --name-only f2235ecd~1 f2235ecd` = `src/cli.test.ts` only. The zero-production-lines filter prints 0. 35 production modules are blob-identical between `b21ec7cf` and `fb914ded`. Suite green, skip 0 | **MET** |

**Gate at `fb914ded`** (`probe/out-gates-tip.txt`, load1 5.5–6.1):
- `npm run lint` exit 0 (98 files); `typecheck` exit 0; `build` exit 0.
- `npm test` exit 0: **51 files / 1581 passed**, 7.26 s.
- Skip count 0. `test-skip-integrity.js … --skip-count 0`: `No findings.`, exit 0.
- `lane-inventory.js`: exit 0, "51 / 51. No findings."

**Cost:**
- Not re-measured. The Engineer's two sets are accepted as reported, and QE independently re-scored
  them to the same figures.
- Under `ADR-0035` (proposed), set 1 is MET (R 0.254 s) and set 2 is UNRESOLVED (R 1.097 s, at most
  +0.107 s), at load1 6.5 / 6.2. The sets are unpooled.
- No `N8-LANE` line is claimed.

**Why `_WITH_GAPS`.** The register is in `…904bdd2d`.
- **QE-058-a (LOW):** the comment strip trades three kills that need a `//` or `/*` inside a string
  literal. No such string is in the file today.
- **QE-058-c (LOW):** bar 3 covers one member per class, so a string-literal exemption of a C0 the
  token does not carry ships green.
- Four INFO items.
- None of these is a criterion miss, and none blocks leaving `In Review`.

**Security/NFR is triggered** (the page says so). The clause (c) facts are in `…ebb74095`: identity
and count unchanged, and on a RED no new byte reaches the output. QE does not rule on (c), and QE-058-a
is offered to them to grade.

**Not done by QE:**
- No `src/` byte changed.
- No board move: that is the Orchestrator's. No ticket page edit: BA/PM owns the page.
- Nothing merged, nothing pushed.
- UAT is waived if the merge keeps 0 production lines (measured 0 at `f2235ecd`). That is re-checked at
  merge.
