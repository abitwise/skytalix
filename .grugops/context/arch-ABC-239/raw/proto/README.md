# arch-ABC-239 tuner prototype (scratch, reproducible)

PREREG `…9ed1db11`; addenda `…255e9bcf` (D1–D3) and `…f8d36d73` (D4). Nothing here is committed to `src/` or `tools/`.

## Reproduce
1. `git archive b7a8fc3a src package.json | tar -x -C <scratch>/e1` (E1 as built on `grugops/ABC-269`; `src/` tree `4e23078f`).
2. `git ls-files '*.pgn'` at `main` `af15cbc9`, as absolute paths, into `<scratch>/pgns.txt` (88 files; 17 contribute).
3. Copy `extract.ts`, `fit.ts`, `diag.ts`, `diag2.ts` into `<scratch>/proto/`.
4. `flock <host-test.lock> ./job.sh <scratch>` (extract, then fit), then
   `node --max-old-space-size=3000 proto/diag.ts <scratch>/e1/src <scratch>/out/pos.jsonl <scratch>/out/diag.json` and the same for `diag2.ts`.

## Files
- `extract.ts`: PGN reader, game and position filters, the term tracer, the identity gate G-P1.
- `fit.ts`: de-duplication, opening split, K, Newton on cross-entropy, C-S / C-F, the inner choice rule, rounding, outer read.
- `diag.ts`, `diag2.ts`: the inner-split diagnostics D1–D3 and D4 (bounded).
- `out/extract.json`, `out/fit.json`, `out/diag.json`, `out/diag2.json`: every figure quoted in the results note.
- `out/data-files.txt`: the 17 contributing PGN files and their sha256, repository-relative. Its sha256 is
  `6e8d0ab0…f040cf`. The run itself printed `00dc0695…8ec30`, the same manifest over absolute scratch paths; the tool
  must hash relative paths.
- `pos.jsonl` (61 MB) is not kept: it is re-made in about 9 s by step 4.

## Host time
Extract 8.5 s, fit 18 s, a re-run of the fit 18 s (byte-identical output, timing fields aside), D1–D3 14 s, D4 6 s,
two debug runs on one 10-game file under 1 s each. Waiting for the shared lock is not counted.
