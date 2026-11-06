---
id: 20261106T183437Z-architect-design-decision-28283e48
kind: decision
by: architect-design
at: 2026-11-06T18:34:37Z
verified_by: 
confidence: high on the lines, the pool and what each read carries, each traced to a named record; medium on the Levels line, an Architect reading open to the Orchestrator; how Q2 reads on the bundle's tree is UNKNOWN - verify
refs:
  - arch-ABC-303-b5
  - ABC-303
  - ABC-286
  - ABC-288
  - ABC-289
  - ABC-291
  - EPIC-011
  - ADR-0056
  - ADR-0063
  - ADR-0072
  - ADR-0073
  - ADR-0074
  - ADR-0075
  - R-BUNDLE-1
  - R-CEN-1
  - FL
  - S-prime
  - C2-prime
  - G6
  - NFR-008
  - 434fa171
  - bb0cc134
  - 38914841
  - 063ca870
  - qe-ABC-303/20261106T175340Z-qe-e2e-decision-ebefbfa2
  - qe-ABC-303/20261106T180618Z-qe-e2e-observation-9e2facfa
  - qe-ABC-303/20261106T175319Z-qe-e2e-observation-43c7fbb6
  - qe-ABC-303/20261106T170749Z-qe-e2e-observation-397a7ec5
  - qe-ABC-303/20261106T171254Z-qe-e2e-observation-f0be43f8
  - qe-ABC-303/20261106T135702Z-qe-e2e-decision-53858301
  - orch-2026-10-30a/20261105T215707Z-orchestrator-decision-43e6d8fd
  - orch-2026-10-30a/20261106T164759Z-orchestrator-decision-318c9e3b
  - orch-2026-10-30a/20261106T135416Z-orchestrator-decision-9c7d4b04
  - arch-ABC-303-load/20261106T141500Z-architect-design-decision-a5dc0532
supersedes: 
seal: sha256:fc9c6f0ebb3dd2bdf822de044a108b80a69423a312073ea78f68ea43241d7be9
---

# arch-ABC-303-b5: `ADR-0072` and `ADR-0073` read in force. E 1 810 holds for `ABC-289`'s seal, on a pool of 27.5 / 40. FL and this read move no bar, and they give both later reads four lines to carry that neither page names

Architect/Design, brief `arch-ABC-303-b5`, on `main` `063ca870`. Records only. No test, build, game or engine ran. No ticket, EPIC, board, `src/` or test edit.

## 1. What was written
- **`ADR-0072` and `ADR-0073`:** a dated line at the head of § Status and one decision-log row each. Each is in force on `main` as a part of bundle 1, naming `ABC-303`, merge `434fa171`, `…ebefbfa2` and `…9e2facfa`. Credit is to the bundle, with no per-part Elo. The premises stay overridden, and F1 stays fired, as written.
- **`ADR-0075`:** a dated pointer to `…43e6d8fd` 3 under d11 (d)'s "A miss is" and under "What stays open", and one log row.
- **The diff is insertions only:** 18 lines added, 0 removed. Checked first: `src/` at `main` and `bb0cc134` is `bba42fb7`, and `bb0cc134` is an ancestor of `434fa171`.

## 2. `ADR-0056` lines that should note the read
Named, not written. The brief's width is "B5's line and one pointer" and it says "name", so I left `ADR-0056` alone. The next Architect hop that holds the file can write them.
1. **§ Status, the dated line of `arch-owner-answers-1104b`:** "`ADR-0072` and `ADR-0073` are ACCEPTED, not in force". It takes a fold, in `arch-post-269`'s form.
2. **D2, rows P4 and O2c:** both ticket cells read "not in force". They take a dated line in `arch-ABC-283-accept`'s form: in force at `434fa171`, one read, no split by row, and the rows' Elo estimates stay estimates.
3. **D5, `arch-ABC-303-open` item 2, the S′ pool:** the 40-game trigger read in § 5 below. It supersedes that item's "The lower edge is close".
4. **D5, the FL block's "The Levels lane was not asked":** § 3 (d) below, if the Orchestrator lets that reading stand.

`EPIC-011`'s S′ pool row is BA/PM's, and it is outside this fence.

## 3. What both reads must carry
None of these adds a bar. `ABC-289`'s page, `ABC-291`'s page, `ADR-0074` and `ADR-0075` do not name FL (grep: 0 hits). FL postdates their lines, and it binds them through `ADR-0056` whatever those lines say. No `qe-ABC-289` or `qe-ABC-291` context exists, so nothing sealed changes.
- **(a) FL, word for word.** It goes after CF10 and after the Reach table. So the order is Reach, CF1–CF10, the table, FL. On `ABC-291` the table is `ADR-0075` d8, whose "QE copies" sentence stops at the table and predates FL. On `ABC-289` QE fills `ADR-0056`'s table.
- **(b) `fsample.sh` by name.** FL reports its count, and only `ABC-303`'s § 6a named the script. Each PREREG names it for itself: sha256 `705353d632274a01`, the same in `qe-ABC-303` and `qe-ABC-307`.
- **(c) W is not inherited.** W and its drop (`…318c9e3b`) were `ABC-303`'s. For each read, the Orchestrator asks or drops W before the first game. The FL block's advice is to ask when the read already owes a quiet window for timing rows. Both do: `ABC-289` for `G6`, `ABC-291` for K4 and K5. Without W, the CF3 branch stands as it did: a load-caused candidate move past 150 ms with the score at or above 50.0 is a STOP with no new read.
- **(d) A line on the Levels lane. This is the gap `…ebefbfa2` 2 names.** FL's words reach C2′ and S′ only. `ABC-303`'s QE read § 6's "alone" as the lock's alone, and that § 6 is bundle 1's shape, so no other PREREG has it. Left silent, load during the lane is CF10's STOP, as H1 was before `ABC-303`'s games. My reading, in the FL block's terms, for each PREREG to state before the first game:
  > **Levels and load.** "Alone" in this read's Levels line means alone under the host lock. Foreign load during the lane changes no line of this read, and no run is voided for it. The lane is graded as played: exit 0 with every test passed is MET, and a red is CF7's. QE reports the lane's `fsample.sh` count and largest load1 beside it, by class and count. No verdict rides on those figures.

  It adds no bar and moves no word of CF7. It stands unless the Orchestrator overrules it before the first seal. A load-caused red costs CF7's walk, not a void.
- **(e) The bar, not the label.** "The harness's `state:` label is not the verdict" sat in `…53858301` § 6, and C2′ 55.5 printed NEUTRAL. Each PREREG states it for itself.
- **(f) FL stops at games.** It does not reach `G6`, K4, K5 or `NFR-008`. Those keep their own void lines and the owner's quiet-host word (`…43e6d8fd` 4, `…318c9e3b`). A PREREG must not read FL's "never voided" across to them.
- **A host fact for QE's brief, not a line of the read:** a C2′ needs about 1.4 GB of the `/tmp` quota (`…ebefbfa2` gap 6).

## 4. What each read must carry, ticket by ticket
**`ABC-289`.** The bundle merged, so `ADR-0074` § Consequences' three lines apply, and they are on the page. No bar moves. What the read adds is figures:
- **The door is now the bundle's shipped path:** d8 311 546 / 163 523 (`search()`), 573 518 / 94 911 (`chooseMove`), reach 7.0158 (R7, `…ebefbfa2`; `…9e2facfa`). DP0's first row and DP3's "≥ 7.018 on 6.868" are `0cc9afd1`'s, and they now describe `…WithoutQuietBundle`.
- **DP3's bar stays door + 0.15.** If the door reads 7.0158, it reads ≥ 7.1658. A re-derived figure is a dated line in `ADR-0074`.
- **`G6` "≥ base" binds, and the base moved.** The bundle's head read kiwipete 9, 10, 9, 10, 10, median 10, and position-6 12 (`…397a7ec5`). Q2's base is that tree, so kiwipete's median sits on the 9 / 10 edge. The run reads its own base by `G6`'s rule, and a figure is not carried from `ABC-303`. Whether Q2 clears it is `UNKNOWN - verify`.
- **`NFR-008`:** the base graded 9.14 s (`…f0be43f8`). DP's ≤ +0.10 s is head minus base on that lane.
- **Still unread:** the joint tree, P4 and Q2 both on. This read had Q2 off, so it says nothing about `ADR-0074` d11's drift and floor there. F1 or F2 governs, and a red has one door, `…WithoutDeltaPruning`.

**`ABC-291`.** Nothing changes beyond § 3 and § 5.
- K0 (c) and K2's list bind at `cc6e64d1`, which is no longer `main`'s tree. The page already re-derives them on the build's base, which will also carry `ABC-289`'s outcome.
- `ABC-303` and `ABC-305` are Done, so `ABC-289` is the one dependency left.
- K5's d11 (d) point is closed by the pointer in § 1.

## 5. E 1 810 for `ABC-289`'s seal: it holds
| merged build | W / L / D | score |
|---|---|---|
| `ABC-269` | 7 / 3 / 0 | 7.0 |
| `ABC-279` | 5 / 4 / 1 | 5.5 |
| `ABC-283` | 6 / 4 / 0 | 6.0 |
| `ABC-303` | 9 / 1 / 0 | 9.0 |

- **The trigger read:** 27.5 / 40 = 68.75 %, inside 60–85 %, X = +137.0. No step fires, and no owner question arises. Item 2's lower edge, below 5.5 / 10, did not bite.
- **What I checked:** QE notes under `qe-ABC-27x`, `28x` and `30x` for a played S′ at 500 ms. Since `arch-ABC-303-open`'s count of 30, only `ABC-303` adds games. `ABC-301` did not merge, and R1 at 100 ms never pools.
- **`ABC-303`'s S′ pools despite the load.** It ran with foreign vitest in 70 of 138 samples, but FL changes no line of a read, and the pool rule reads a merged build at this E.
- **Nothing can move E before the seal.** The next S′ that can pool is `ABC-289`'s own, and a step after a seal does not reach that read. So `ABC-289` seals `--elo 1810`, S-1, S-2 and S-4.
- **For `ABC-291`'s seal:** E is read again if `ABC-289` merges.
  - At 50 games the upper edge cannot fire, and the band can be left only by a first ten at or below 2.0, which S-4 stops first.
  - The one route out is a two-stage S′: 7.0 to 8.0 of 20 on a merged build gives under 60 % at 60 games, which is the owner's question.
  - K6's "the E in force" already covers it.

## 6. Standing
- **Inside the brief:** dated insertions only. Every other ADR line stands.
- **The Architect's, open to the Orchestrator:** § 3 (d).
- **Not settled here:** how load moves a score stays `UNKNOWN - verify`, as `…a5dc0532` says. `R-N8H-1` LOW at 9.14 s is the Orchestrator's. `ADR-0074` still reads "Not in force until `ABC-289` merges", which is right.
