# qe-ABC-307 verdict on ABC-307: PASS. A9 stands with the target met, and UAT is waived with this verdict signing

QE/E2E, task `qe-ABC-307`, on the labels `…da060cef` fixed and `…01f729cb` carried, before the figure.

**Verdict: PASS.** A read stands (`…78d1f873`), the twin is admissible, the state is `NFR-008 MET, graded`, and H − B is −0.350 s in paired median wall against the target of −0.215 s.

| criterion | state |
|---|---|
| A1, A2, A3, A4, A5 | hold, `…d356030c` |
| A7, with the new MC1, `F2`, `F3` | holds, `…19f6c80a` |
| A8 | holds, `…d356030c` |
| **A9** | **holds, `…78d1f873`:** H median 9.085 s, interval 9.02 to 9.17 s, max 9.17 s; H − B −0.350 s wall, −1.065 s CPU; twin ADMISSIBLE; 0 of 8 rounds flagged |
| A10 | Security/NFR's, not graded here; a graded read now exists for it |

**UAT:** waived, the page's test note 3: A1's `grep` is empty, as `…d5cd6d19` recorded, and this verdict signs.

**Routing, as figures only.** H's median reads G-GO on `…b9038a14`'s rule. H is under 9.6 s, so nothing goes to the owner on `…ad217a34` 4, and under 10 s, so nothing on `ADR-0035` D6. `R-N8H-1`'s state is Security/NFR's and QE does not read it.

## Gaps, none blocking this verdict
- **The read is on the arms, not on `main`.** B = `e01d39b1`, H = `797bb1a5`. `…b17275dd` allows it with H's lane inputs equal, and they are: the lane-input diff is empty at `main` `375f6362`. A read of `main` after the merge is the page's and is not done here.
- **The target's margin is thin against the twin.** Met by 0.135 s, with the twin's wall R at 0.210 s and one of 8 deltas above the target. The sign is firm: 0 of 8 positive, wall and CPU. Detail in `…78d1f873`.
- **One read is one window.** Three voids came before it. It was alone on the host for 251 s, and nothing here says the host stays that quiet.
- **Merge and deploy are the humans'.** The board move out of In Review is the Orchestrator's; this hop's fences leave the board alone.
