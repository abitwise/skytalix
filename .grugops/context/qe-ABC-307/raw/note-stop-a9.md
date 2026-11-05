# qe-ABC-307-a9: the hop STOPS with A9 still unread. Read 3 is VOID, 7 of 8 rounds flagged, and the one re-read never got a slot, so it is unspent. There is no verdict. A void is not a miss

QE/E2E, task `qe-ABC-307`, under PREREG `…da060cef`. Read 3: `…4a8dd8dc`, raw `raw/n8-r3/`. Gate log for the re-read: `raw/n8-r4/gate.console`.

## What happened on the clock
The clock ran 19:21:24Z to 20:01:24Z.

| when | what |
|---|---|
| 19:21:28Z to 19:48:35Z | 28 tries released on foreign vitest |
| 19:49:50Z | five clear samples, read 3's hold starts |
| 19:51:15Z | a new foreign `grugops` vitest first sampled, 85 s in. `…4a8dd8dc` says "75 seconds or so"; 85 s is the figure |
| 19:54:10Z | read 3 ends: 8 complete scored rounds, rounds 2 to 8 flagged, VOID |
| 19:54:50Z to 20:00:50Z | re-read gate, 7 tries, each released on 4 to 6 foreign vitest processes |
| 20:01:50Z | `reread.sh`: deadline, not read, exit 75 |

**The re-read took no lock past its 15 s samples and ran no test.** `<scratch>/qe307/out/n8-r4` was never created. Under `…da060cef`, the hop stops with the void standing and **the re-read unspent.**

## Where the load came from
- **`grugops`:** the vitest `…5571c5a1` named ended before the slot. The one that voided read 3 is a different run, started in the hold, under a 2 700 s timeout, so it can run to about 20:36Z. It was still live at 20:01:55Z.
- **A second project:** at 20:01:55Z a vitest from another project, not `grugops`, was live too, about 25 s old. No read was in progress, so it voided nothing. It does show the load is not one project's. `R-CEN-1`'s record names only `grugops`, so a window held for that project alone may not be a quiet host.
- All foreign load was recorded and none of it touched.

## State of the page
| criterion | state |
|---|---|
| A1, A2, A3, A4, A5 | hold, `…d356030c` |
| A7, with the new MC1, `F2`, `F3` | holds, `…19f6c80a` |
| A8 | holds, `…d356030c` |
| **A9** | **not graded.** Three voids in all: read 1, read 2, read 3. H's median, H − B against −0.215 s, the twin and the lane against 9.6 s are all unread |
| A10 | Security/NFR's; waits on a graded read |

`n8-grade.py` and `a9-sens.py` were not run: 7 flagged rounds stop the read before the grade. No wall in `raw/n8-r3/a8.tsv` is a figure to cite.

**Verdict: none.** Not a FAIL and not a PASS: nothing missed. **UAT:** the waiver's condition holds (A1's `grep` is empty), but QE's verdict signs, and there is none to sign with. ABC-307 stays In Review.

## Gaps
- **A9 unread (blocks the verdict).** The owner's word to start did not make the host quiet. The slot gate proves a clear moment and nothing after it: reads 1 and 3 both cleared, then lost the hold within 90 s. The read needs about 4.5 minutes in which no other project starts a vitest, and that can only come from the owner holding them. **Hold every project, not only `grugops`:** the gate counts all of them, and so do the flags.
- **What a next read needs from the Orchestrator:** the re-read under `…da060cef` is unspent, but its clock has run out. Whether it spends on a new clock or a new PREREG is the Orchestrator's to rule. I did not extend the clock.
- **The read is on the branch, not `main`,** as `…43927eb6` said. `…b17275dd` allows it, H's lane inputs equal. Still empty at `main` `54cf8334`.
- **`qe-hop-integrity.js --ticket ABC-307` will read covered off a PREREG**, as `…43927eb6` said. This stop note is an `observation` for that reason.

## Process facts
- **Two `ps` looks came before the seal,** recorded in `…da060cef`. They were not the gate and decided nothing, but the brief said no poll before the seal.
- **The arms were gone** from `<scratch>/qe307` and were rebuilt by `git archive` before the seal. H and H2 compared clean, then clean again apart from `.test-results` before the re-read. They are left in `<scratch>/qe307/arms` for the next hop.
- I ran nothing on the host during either background wait: no poller, no `tail`. Nothing of mine is left running, checked with `ps`.
