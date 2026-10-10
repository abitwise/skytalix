---
id: 20261010T113116Z-qe-e2e-observation-abc058-gap-register-904bdd2d
kind: observation
by: qe-e2e
at: 2026-10-10T11:31:16Z
verified_by:
confidence: high
refs:
  - ABC-058
  - ABC-042
  - ABC-059
  - ABC-114
  - V1.2.5
  - V1.3.3
  - N8-SPAWN
  - N8-LANE
  - ADR-0035
  - src/cli.test.ts
  - 20261010T113116Z-qe-e2e-observation-abc058-twenty-four-probes-head-vs-base-4b252e30
  - 20261010T111050Z-software-engineer-decision-abc058-token-bytes-pin-strip-comment-wording-0963774f
supersedes:
---

# `ABC-058` gap register: one LOW (the comment strip trades kills), one LOW (one member per class), four INFO. None blocks `In Review`

Hand-authored, unsealed. Probe ids are from `…4b252e30`.

| id | sev | gap | evidence | owner / route |
|---|---|---|---|---|
| **QE-058-a** | **LOW** | **The `S5` fix trades kills.** `executableCodeOf` strips `//` to end of line and `/*…*/` lazily, without knowing about string literals. A real direct `spawnSync` child placed after a `"…//…"` string on the same line, or between a `"/*"` string and the next `*/`, is invisible to the pin and ships GREEN. The pin reds all three at base. `A2` is MET **as written** (`MS1`/`MS2`), but the criterion's title "no kill traded" is not unconditionally true. The `"/*"` shape is the one that could arrive by accident, for example a glob or path literal: every line up to the next `*/` drops out of the count. **Today's file holds no such string.** The TypeScript scanner and the regex view agree on 1 call site, and differ only on 7 chars of the helper's own line | `Q11`, `Q12`, `Q13`: base RED on the pin, head GREEN. `strip-compare.cjs` shows scanner 2 vs regex 1 on `Q11` | Security/NFR, the bar's author, to grade. If a follow-up is wanted it goes to BA/PM. The likely shape is to count over a string-aware view (the TypeScript scanner is already in `node_modules`), or to keep the raw count as an upper bound beside the stripped one. **Not fixed here**: QE does not change instruments |
| QE-058-b | INFO | `Q14`: an aliased call (`const alias = spawnSync; alias(…)`) survives at base **and** head. The pin is a drift guard, not an adversary guard, and never was. This bounds QE-058-a's severity: it is a new accidental-shaped hole, not the loss of a property the pin had | `Q14` GREEN on both | Context only |
| **QE-058-c** | **LOW** | **Bar 3 samples one member per class.** A filter that exempts any C0 the token does not carry (TAB in `Q3`) ships GREEN at base and head. `A8`'s number row catches only **numeric-literal** edits to the filter. It does not see a string-literal exemption (`Q1`/`Q3` do not red it). This is exactly the "one member of each class" the page asked for, so `A5` is MET. It is recorded so that no one reads bar 3 as covering every C0 | `Q3` GREEN at base and head. `Q1` reds bar 3 only | Security/NFR. C1/CSI stays `AR-1`, out of scope |
| QE-058-d | INFO | **Whitespace C0, CONFIRMED.** At the token's edge, the `split(/\s+/)` locator drops it (`Q5` GREEN). Inside `[2Jpurple` it is caught, but by non-vacuity (i), not by clause (ii) (`Q5b`). The Engineer's choice of BEL is right | `Q4`/`Q4b` valid controls, `Q5` GREEN, `Q5b` RED | none |
| QE-058-e | INFO | A string or template-literal **text** naming `spawnSync(` (not a call) still reds a correct file. `A1` covers comments only. This is not traded: it was RED at base too | `Q8` RED, pin, at base and head | BA/PM if it ever bites. The page's `P1` trigger covers prose in comments only |
| QE-058-f | INFO | `executableCodeOf`'s `//` regex cuts the tail of its own source line (`…\*\//g, "")`, 7 chars). The Engineer's decision point 2 is true for `/*` ("cannot open a false block comment"). The `//` side does fire on that line, harmlessly: no call sits there. It is pre-existing helper code, so it is flagged and not touched | `strip-compare.cjs`, first divergence | none |

**Cost (`N8-LANE`, `ADR-0035` proposed). Not re-measured; the Engineer's two sets are accepted as
reported.**
- QE re-scored both committed TSVs with its own `rescore.mjs`. The figures match to the millisecond:
  - set 1: twin R 0.254 s, head −0.610 s, **MET** at 0.650 s;
  - set 2: twin R 1.097 s, **UNRESOLVED**, charge at most +0.107 s.
- Load1 medians were 6.50 and 6.17. All 54 runs asserted 66 tests.
- The sets are unpooled, and no `N8-LANE` line is claimed.
- **Observation for Architect/Design (owner of `F`):** this file's twin R (0.25 s and 1.10 s) sits
  above the one-file `F` of 0.17 s. That `F` was taken from child-free files. A 27-child file resolved
  650 ms in only one of two sets, so a per-file `F` for child-heavy files may be warranted. QE does
  not set it.

**Not covered by QE:**
- A TTY run of a RED bar 3: the raw-byte check was non-TTY only (`…ebb74095`).
- C1/CSI (`AR-1`, out of scope).
- `ABC-059`'s same-file block, which is not on this branch.
