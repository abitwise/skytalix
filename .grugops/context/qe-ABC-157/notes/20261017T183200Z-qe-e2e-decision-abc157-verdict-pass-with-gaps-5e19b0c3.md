---
id: 20261017T183200Z-qe-e2e-decision-abc157-verdict-pass-with-gaps-5e19b0c3
kind: decision
by: qe-e2e
task: qe-ABC-157
at: 2026-10-17T18:32:00Z
verified_by:
confidence: high
refs:
  - ABC-157
  - plans/tickets/ABC-157-the-castling-right-test-reads-any-right-and-only-the-deep-lane-sees-it.md
  - QE-157-a
  - QE-157-b
  - 20261017T183000Z-qe-e2e-observation-abc157-mutants-and-criteria-3d5b7e91
  - 20261017T183100Z-qe-e2e-observation-abc157-break-attempts-7a2c4f08
  - 20261017T181352Z-software-engineer-observation-readings-da7f6206
  - 20261017T181353Z-software-engineer-decision-row-shape-14459646
supersedes:
---

# QE `ABC-157` on `grugops/ABC-157-castling-one-right` (tip `2202b8eb`, code `968a5843`, base `aa37f9cb`): **PASS_WITH_GAPS**

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). No timing read. I planted my
own `X-any-right` before opening the SE's harness. Then I re-ran the committed catalogue, and it equals the SE's
output byte for byte.

| item | ruling | basis |
|---|---|---|
| `A1` | **MET** | 4 rows. Single right bit asserted, then alive-but-for-the-right, then castle by name at both layers, then 25 (`…3d5b7e91`) |
| `A2` | **MET** | 2 rows. Own 0 / opponent both asserted, then no castle at either layer, then 24 |
| `A3` | **MET** | `X-any-right` 1824/1824 at base, 6 failed at head (exactly the six rows). The 7 named mutants are killed at base and head with the same lists. 15/15 controls survive at both: 0 kills added |
| `A4` | **MET** | one `src/` file, `-U0` 0 removed. md5 `6335b452…` at base/code/tip. 58/1824 → 58/1830 (+6), skip 0. Deep perft 32/32 |
| Gates at `2202b8eb` | **green** | lint 0, typecheck 0, build 0, `npm test` 0 (58 / 1830, `success: true`), integrity `No findings.` at skip 0. `git merge-tree --write-tree main 2202b8eb` exit 0 |
| Security threshold | **not fired** | test-only, one file, +90. The added lines hold no import, spawn, net, env or fs |
| UAT-waiver reading | **applies** | `git diff --name-only aa37f9cb...2202b8eb \| grep -v '\.test\.ts$' \| grep '^src/'` is empty, and empty per commit (`968a5843`, `2202b8eb`). Waived, not signed |

**Gap register.** No criterion is unmet, and none of these blocks.
- **`QE-157-a` LOW, residual.** `W-mixed` passes the default lane at base and head and also passes `PERFT_DEEP` 32/32.
  It is a conjunction that offers the other wing's castle only when the mover holds its other right **and** the opponent
  holds a right. No row in any lane holds that mixed state while the castle's own right is absent. Witness: `w Qk` on the
  ticket's board gives `e1g1 e1c1` (26) where the delivered build gives `e1c1` (25). A mixed-rights row (`w Qk` → `e1c1`,
  25; `b Kq` → `e8c8`, 25) would close it. This is outside the ticket's one-right class. BA/PM may cut it, or the owner
  may accept it as a residual. (`…7a2c4f08`)
- **`QE-157-b` INFO.** Several weaker variants die on only 2 rows, one per colour: same wing either colour, and the
  one-wing wrong-colour reads, which die only on `A2`. The margin is one row per colour. That is enough for a red lane
  and thinner than `X-any-right`'s six.

**Next column.** `In Review` exit: QE recommends `Ready for UAT`, then `Done` under the zero-production-lines waiver.
The Orchestrator decides.
