---
id: 20260813T121000Z-qe-e2e-observation-the-glyph-mode-red-not-forced-and-the-blind-spot-2853e4c5
kind: observation
by: qe-e2e
at: 2026-08-13T12:10:00Z
verified_by:
confidence: high
refs:
  - ABC-026
  - ABC-026-A4
  - quality-gate-ABC-026
  - src/glyph-mode.test.ts
  - src/glyph-mode.nfr.test.ts
  - vitest.config.ts
  - NFR-007
supersedes:
---

# I tried to force the `glyph-mode` red and **COULD NOT** — ~44 million sampled observations, overlap proven, 0 violations. **And I found the thing that matters more: the suite CANNOT SEE this hazard at all.**

An `observation`. The brief said a reproduction here is a `BLOCKED_NEEDS_FIX` rather than a curiosity.
**There is no reproduction. The reason is mechanism, not luck, and it is stated in the note beside
this one.** What follows is what I did to try, so the negative is worth something.

## The detector, and it is ARMED — a green probe that cannot fail proves nothing

Built in an **out-of-tree copy** so the repository's `src/` was never written: `src/` +
`package.json` + `tsconfig.json` + `biome.json` + the delivered `vitest.config.ts`, `node_modules`
symlinked. **Every copied file `cmp`-verified byte-identical: 47 files, 0 mismatches.**

```
zz-holder.test.ts       mutates the SAME globals src/glyph-mode.test.ts mutates
                        (isTTY, LC_ALL/LC_CTYPE/LANG, platform) and HOLDS them live for
                        1.2-2.0 s instead of the real file's ~3 ms, then restores in afterEach.
                        It asserts its own mutation applied - a hold that silently failed to
                        mutate would make every detector's green vacuous.
zz-detector-1..6        spin-sample all four globals continuously, recording their own window.
zz-residue.test.ts      asserts the CANARY VALUE ABSOLUTELY rather than against a baseline
                        captured at module load - because a load-time baseline is BLIND to
                        residue: a file polluted before it loaded would record the pollution
                        as "pristine" and see no deviation.

ARMING (QE_ARM=1)       the identical assertion mutates the ambient inside its own module
                        mid-spin  ->  2 of 2 files RED, "LANG=QE_LEAK_CANARY"
```

**The armed control goes red on demand. The detector can fail.**

## The result

```
holder + 6 detectors alone, threads     holder on thread 1, detectors on threads 2-7
                                        windows overlap ~2000 ms of a 2000 ms hold
                                        13.1 M samples          0 violations
full 36-file tree (28 real + 8 probes)  815 tests green, 3 runs
                                        detectors overlap 1190-1200 ms of a 1200 ms hold
                                        44.2 M samples          0 violations
single worker (maxThreads=minThreads=1) 4 files, each a FRESH thread (1,2,3,4)
                                        residue detector: 0 violations
--no-isolate, 1 worker, 4 files         all four on thread 1 - genuinely shared
                                        residue detector: STILL 0 violations
```

**The overlap is recorded per detector, so the negative is a real negative:** the detectors were
sampling *while* the mutation was live, not before or after it. Two detectors in the 36-file runs
landed **after** the hold (overlap −167 ms, −156 ms) and are reported rather than dropped; the other
nineteen overlapped almost the whole window.

**Not forced under: 8 worker counts and orders, file-order shuffling with fresh seeds, single-worker
serialisation, a 400x-amplified mutation window, and `--no-isolate` worker sharing.** I record this as
a **`could not reproduce`**, not as proof of impossibility — but the mechanism note beside this one
says why I expect it to stay unreproducible, and that reason is checkable.

## **THE FINDING THAT MATTERS: a real leak would be SILENT. The 24 green runs were blind to it.**

`src/glyph-mode.nfr.test.ts` is the only other file that exercises the ambient path. Line 96:

```ts
beginGlyphModeSession({ ascii: false, unicode: false })();
```

`src/glyph-mode.ts` lines 117–118 read `process.stdout.isTTY` and `process.env` there. **That call's
RETURN VALUE IS NEVER ASSERTED.** The file's three assertions are (a) `toHaveBeenCalledTimes(0)` on
`node:fs` spies, (b) the same on `node:child_process` spies, and (c) `selectGlyphMode` with
**injected** tuples. The value derived from the real ambient is computed and dropped.

Everywhere else, `glyph-mode.test.ts` drives the rule as a **table with the environment injected** —
deliberately, and the file says why: *"a rule that read `process.env` directly could be exercised for
one tuple per process."* **That design is correct and is exactly what makes the suite blind here:
almost nothing in 807 tests asserts a value derived from the REAL ambient.**

**Consequence, stated plainly. If `process.env` or `isTTY` did leak across workers, no test in this
suite would go red.** So *"24 consecutive green runs"* is **not evidence about this hazard** — it is
evidence that the suite has no assertion pointed at it. My 100 runs inherit the same blindness, and I
say so rather than banking them.

**This does not weaken the adoption — it relocates its support.** The prior hop wrote *"a run count was
not enough"* and adopted on a mechanism instead. **That judgement is vindicated more strongly than its
own note argues:** for this specific hazard the run count was worth approximately nothing, and the
mechanism is the whole of the case. **The mechanism holds** (three-deep, per the note beside this one).

**The gap this leaves is a MISSING ASSERTION, not a defect in this diff.** No such assertion existed
before `ABC-026` and `ABC-026` wrote zero `src/` bytes, so this is pre-existing and out of its scope.
**Severity low, and low on purpose:** the leak it would catch is structurally prevented today, so the
assertion guards against a future `isolate: false` or a `SHARE_ENV` change in tinypool — the same class
of thing `NFR-007`'s own file exists for. **Owner: BA/PM to route; a candidate row for `ABC-030`, which
already owns the `*.nfr.test.ts` comment blocks.** I did not write it: the brief forbids touching the
four files `ABC-030` owns, and `src/` is frozen by `A6`.
