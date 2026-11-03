# qe-ABC-269 gaps: **none blocking, none above LOW.** QE-269-f LOW (Architect): `G2` met on the mean with session 2 alone at 1.0560; the margin (0.0127) is about the session-to-session spread. QE-269-g INFO (Architect): "odd rounds" read as `g2b.ts`'s 0-based `r % 2`. QE-269-h INFO: the cut costs +2.4–4.5 % ns per node against `main` (report). QE-269-i INFO: B8's Elo interval crosses 0. QE-269-j INFO (Orchestrator): the rating tool's env vars. QE-269-k INFO (BA/PM): S′ pooling on merge. Carried: QE-269-a/c ruled; S1–S3 are `ABC-270`'s

QE/E2E, task `qe-ABC-269`. The ids continue from `qe-ABC-269-freeze`'s QE-269-a…e.

## QE-269-f: LOW (Architect/Design), the `G2` margin is about the noise
- Session 1 read r = 1.0186; session 2 read r = **1.0560**, above 1.05 on its own. The PREREG grades the mean, 1.0373, and it is MET. Nothing is re-read.
- Session 2's H rounds spread 310.3–352.5 ns while B and C stayed within 303.7–306.2. Over the two sessions, c moved 1.0200 → 0.9974 (0.023), and r moved 0.037.
- So the bar was met by about one session's spread. For `ABC-274` (E2-pre, its own `G2` ≤ 1.05 ×, measured against this build as the pre-ticket head once merged), the Architect may want to state the control band and the session count ahead of time, as this PREREG did. Not a defect; no action is owed for `ABC-269`.

## QE-269-g: INFO (Architect/Design), the reversal parity
- The PREREG says "odd rounds run the arm list in reverse" and names `g2b.ts` as the instrument. `g2b.ts` reverses on `r % 2` with a 0-based `r`, that is, rounds 2, 4 and 6 counted from 1. QE ran `g2b.ts`'s loop as written. Recorded so a later PREREG can say which it means.

## QE-269-h: INFO, the node-level cost (report, not graded)
- H's `chooseMove` is below U's per node on both boards in both windows (0.937–0.998 ×), so the "moved, not cut" finding does not fire.
- Against `main`, H reads +2.4 % / +2.5 % (window 1) and +4.5 % / +3.4 % (window 2) ns per node, and the untapered door +0.2 % to +3.0 %. The door's carried phase (one load, two adds per made move, never read) costs something. B7 shows no depth lost at 4 000 ms (medians equal base).

## QE-269-i: INFO, B8 is a pass, not a proven gain
- 57.0 / 100, Elo +49.0 ± 59.5 (LOS 94.8 %). The interval crosses 0. The harness printed `state: NEUTRAL`, which this read does not use (the ticket's bar is ≥ 50.0).

## QE-269-j: INFO (Orchestrator), the rating tool's environment
- `tools/rating/rating.ts` needs `CUTECHESS_CLI` and `STOCKFISH` set, and has no default (`ABC-204`). The first `d` launch stopped before any build or game; it was re-launched with the pinned binaries (`/home/…/cutechess/build/cutechess-cli`, `/usr/local/bin/stockfish`, both sha256 = the tool's pins). A line in the QE brief template or the runbook would save the round trip.

## QE-269-k: INFO (BA/PM), S′ pooling
- The S′ smoke read 7.0 / 10 at E 1 810. It joins the S′ pool only if `ABC-269` merges (`EPIC-011` § Close-out); the pool arithmetic is BA/PM's on the merge.

## Carried, not re-opened
- QE-269-a ruled (a) by the Architect: S1–S3 are a report here (+13 / +13 / +23, equal to the forecast) and `ABC-270`'s first graded rows. QE-269-b…e as recorded at the freeze.
- Merge hygiene: `be87a2f1` already has `main` `01a67c5d` merged, and the gates were read on it (2 566 / 2 566). If `main` moves before the merge, re-run `npm test` on the merged tree before the merge commit.
