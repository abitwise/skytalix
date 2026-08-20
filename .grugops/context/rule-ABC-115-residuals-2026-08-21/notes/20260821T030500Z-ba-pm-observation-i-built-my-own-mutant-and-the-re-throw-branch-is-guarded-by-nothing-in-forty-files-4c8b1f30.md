---
id: 20260821T030500Z-ba-pm-observation-i-built-my-own-mutant-and-the-re-throw-branch-is-guarded-by-nothing-in-forty-files-4c8b1f30
kind: observation
by: ba-pm
at: 2026-08-21T03:05:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - G-QE115-1
  - ADR-0016
  - A10
  - src/cli.ts
supersedes:
---

# `G-QE115-1` RE-MEASURED FROM SCRATCH — THE MUTANT SURVIVES ALL FORTY FILES AND ALL FOUR GATES

QE's note is an unstamped `claim` (`human_admission` is `off`), so nothing below is inherited from
it. **A fresh copy of the delivered tree was made OUTSIDE the repository** — `src/` plus
`package.json`, `tsconfig.json`, `vitest.config.ts`, `biome.json`, `AGENTS.md`, `package-lock.json`,
with `node_modules` symlinked — and the mutant lived there. **`src/` in the repository was never
touched**, which is this subtask's fence.

## The mutant — one token deleted from the delivered arm

```ts
// delivered (src/cli.ts:158-161)
sink.on("error", (error) => {
  if ((error as NodeJS.ErrnoException).code !== "EPIPE") throw error;
  process.stdin.destroy();
});
// mutant
sink.on("error", () => {
  process.stdin.destroy();
});
```

## Readings, all at Node v24.12.0, macOS

| instrument | delivered | mutant |
|---|---|---|
| `npx vitest run src/cli.test.ts` | 60 passed | **60 passed** |
| `npx vitest run --dir src` | (base) | **40 files / 1212 tests / 0 skipped, green, 3.74 s** |
| `npx tsc --noEmit` | — | **exit 0, silent** |
| `npx biome check src/cli.ts` | — | **clean, "Checked 1 file"** |

**QE claimed the file; I measured the LANE.** It is not that one file misses the branch — **no test
anywhere under `src/` distinguishes the two builds**, and the mandatory gates (`lint`, `typecheck`,
`build` — which is `tsc --noEmit` here — and `unit`) are all green on the mutant. The
`EPIPE`/not-`EPIPE` discrimination, which is `ADR-0016` clause 4 and the central design decision of
a 13-line production diff, is asserted by nothing.

**Every existing row is scoped to the `EPIPE`-shaped Given by construction** — `A1`, `A2`, `A3` and
`A9` all close a READER, and `A4`'s two children fail through `InputSeam` and the argument parser,
neither of which is a **stdout** error. That is why the mutant is invisible: nothing on this ticket,
and nothing in `src/`, ever drives a non-`EPIPE` error into `process.stdout`.
