---
id: 20260813T081500Z-qe-e2e-observation-all-five-criteria-re-broken-on-the-merged-tip-and-a2s-configuration-b-caught-my-own-no-op-1f6a3d84
kind: observation
by: qe-e2e
at: 2026-08-13T08:15:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A2
  - ABC-028-A3
  - ABC-028-A4
  - ABC-028-A5
  - RISK-ABC028-01
  - RISK-ABC028-03
  - RISK-ABC017-01
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
supersedes:
---

# All five criteria re-broken on the MERGED tip against their own named builds — and `A2`'s configuration (b) caught a NO-OP of mine before it reached a verdict

> **Hand-authored `observation`, not a `finding`** — no `scripts/context-io.ts`, no `§14-gate`
> record under this task, `human_admission: off`, **no stamp invented**. Every cell RUN on a pinned
> detached worktree at `0ee148e`. Nothing here is transcribed from my `752` or `755` runs; the
> ticket's numbers were re-derived because the tree gained `ABC-019`'s turn loop since both.

## The kill matrix on the merged tip — every build is the DELIVERED pane plus one anchored edit

The anchor of every edit is asserted **unique** before it is applied; the three pane files are
pinned by md5 and the pins are **re-verified after the restore**, not merely restored.

```
 #  build                    whose   full suite (807 on 28)   killed by
 0  NULL CONTROL             —        0 failed / 807          — (the lane is calibrated, not blind)
 1  WCACHE (naive)           tkt      6 failed / 807          A14 + A1 + A5r1 + A5r2 + nfr A11 x2
 2  WCACHE-LEN               tkt      5 failed / 807          A1 + A5r1 + A5r2 + nfr A11 x2
 3  WCACHE-LAST  (last 1)    tkt      4 failed / 807          A5r1 + A5r2 + nfr A11 x2
 4  WCACHE-LAST2 (last 2)    tkt      3 failed / 807          A5r2 + nfr A11 x2
 5  WCACHE-LAST3 (last 3)    tkt      2 failed / 807          nfr A11 x2 ONLY — the ACCIDENT
 6  WLEAD-ODD                tkt      1 failed / 807          ABC-028 A3
 7  WPOSMID                  tkt      1 failed / 807          ABC-028 A4
 8  WPOS                     tkt      2 failed / 807          ABC-017 A9 + ABC-028 A4
```

**Criterion by criterion, as DELIVERED on `main`'s tip:**

| criterion | verdict | the build that proves it, on this tip |
|---|---|---|
| **`A1`** — freshness across a mutation that does not change `moves.length` | **MET** | `WCACHE-LEN` dies at *"A1 — a mutation that leaves moves.length UNCHANGED still renders fresh"* |
| **`A2`** — the freshness guard does not depend on another file's fixtures | **MET, both configurations** | table below |
| **`A3`** — the black-anchored slid window at ODD length | **MET** | `WLEAD-ODD` → **exactly one** failure, and it is *"A3 — 21 plies from a black anchor: row 1 opens with a WHITE ply"*. The row count and the move numbers are context, not guards, exactly as the criterion warns |
| **`A4`** — the during-render clause over the whole `GameHistory` graph | **MET** | `WPOSMID` → **exactly one** failure, `A4`, **zero pre-existing tests break**. Plus the arming tripwire result in the sibling note: `A4` cannot be blinded green |
| **`A5`** — freshness across a length-preserving edit preserving the last move's IDENTITY | **MET, both rows** | `WCACHE-LAST` dies at BOTH `A5` rows; `WCACHE-LAST2` dies at row 2 only. The ladder is monotone and the rows discriminate exactly as the table claims |

## `A2` — both configurations, and the first attempt was a NO-OP that I caught and am reporting

`A2` is the only criterion of the five that is not "a build dies"; it asserts **where** the deaths
are. Both configurations were run rather than read off the page.

**(a) the single-file lane — `npx vitest run src/history-pane.test.ts` ALONE, nfr NOT loaded:**

```
(a) NULL CONTROL      0 failed / 26 on 1 file
(a) WCACHE (naive)    4 failed / 26      A14 + A1 + A5r1 + A5r2
(a) WCACHE-LEN        3 failed / 26      A1 + A5r1 + A5r2
```

**(b) the full suite with `src/history-pane.nfr.test.ts`'s module-scope `AT_*` fixtures rebuilt PER
TEST:**

```
(b) NULL CONTROL      0 failed / 807 on 28
(b) WCACHE (naive)    4 failed / 807     ALL FOUR in src/history-pane.test.ts — nfr kills GONE
(b) WCACHE-LEN        3 failed / 807     ALL THREE in src/history-pane.test.ts — nfr kills GONE
(b) WCACHE-LAST       2 failed / 807     BOTH in src/history-pane.test.ts (A5 x2)
```

**`A2` is MET: in both configurations both builds die, and every surviving kill is in
`src/history-pane.test.ts`.**

**MY FIRST (b) WAS WRONG AND THE MEASUREMENT IS WHAT CAUGHT IT.** I first implemented "rebuilt per
test" by destructuring a `Proxy` at module scope. **Destructuring reads each key ONCE**, so every
`AT_*` was bound to a single object at module load — identical in effect to the original, a pure
no-op. It reproduced the delivered suite's numbers **cell for cell** (`6 failed` and `5 failed`,
against the delivered `6` and `5`), and that exact reproduction is what exposed it: an intervention
that removes the accidental guard cannot leave the accidental guard's two failures in place. The
real implementation is `let` + a file-scope `beforeEach` (that file already imports `beforeEach` at
`:25`), which is "rebuilt per test" literally. **Both scripts are in `artifacts/` — the no-op is
kept, not deleted, so the next reader can see the trap.**

## What (b) proves that the page could not, because `A5` did not exist when the page measured it

The `A5` section records configuration (b) for `WCACHE-LAST` as **`750 passed` — NOTHING — the
guard is GONE**. That was the argument for adding `A5` at all. **Measured here after `A5` landed:
`WCACHE-LAST` in configuration (b) is `2 failed / 807`, both in `src/history-pane.test.ts`.**

**`A5` closed the exact hole it was cut to close, and configuration (b) is the measurement that
shows it** — the ticket's central thesis, confirmed on the tree that shipped rather than argued.

## `RISK-ABC028-03` and `src/history-pane.test.ts:1018` — the latent instance the repair left alone, TESTED

`:1018` (BA/PM's instance 2, excluded from the `:493` repair by ruling so a two-line fix did not
become a text hop) claims: *"a cache keyed on the last THREE identities survives both rows below."*
It is a claim about this file's own rows, so it is checkable here:

```
WCACHE-LAST3   2 failed / 807   nfr A11 x2 ONLY — BOTH A5 rows PASS
```

**The claim HOLDS on the merged tip.** It is a prediction about two named rows in its own file, not
a census, and it is correct. **`RISK-ABC028-03` is reproduced and still open**: at rung 3 the
project's only guard is again the accidental `toSan` call count in `src/history-pane.nfr.test.ts` —
the same accident `RISK-ABC017-01` was cut to remove and that `A1` and `A5` each replaced for one
rung. **This is unchanged from my `final` gate and is not a new gap**; it is re-measured at `807`
rather than inherited at `752`, and it is the residual the ticket priced and accepted.

**This also re-closes, at `807`, the `:115` numerator my narrow gate closed at `755`:
`WCACHE-LAST3` fails exactly 2, and both are `toSan` assertions.**

## What I did NOT re-run, and why

- **The eight-subset-key enumeration** (`final` gate). Conclusive, nothing here depends on it, and
  it was explicitly not asked for twice.
- **`RISK-ABC028-01a`'s `WBOARDBLIND` witness.** Its standing obligation fires on a change to
  `A4`'s **instrument**; the only change since is comment text in a different `describe`. It did
  not fire. I did run `A4-BLIND`, which is a change to that instrument — see the sibling note — and
  the arming tripwire caught it.
- **`A5`'s `preservedTail: 16` boundary (`F1`)** and the `blackAnchorTo` domain formula. Measured
  and CLOSED at the narrow re-gate on both parities (`15` and `14`); nothing since touches
  `EditShape` or the builder. Not re-derived, per read-before-you-act.
- **Any timing / `N8-LANE` number.** A Security/NFR hop is running concurrently in this same
  working tree. `UNKNOWN - verify`, and gap `H5`.
