---
id: 20260820T213500Z-ba-pm-observation-no-existing-child-can-catch-this-and-i-measured-two-harness-shapes-that-can-a4f60b19
kind: observation
by: ba-pm
at: 2026-08-20T21:35:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ABC-043
  - src/cli.test.ts
  - NFR-008
supersedes:
---

# THE SIZING FACT: no child in `src/cli.test.ts` can reproduce this, and I measured two shapes that can

This is why `ABC-115` is `S` and not `XS`, and the measurement is here rather than asserted on the page.

## Why the existing harness cannot see the defect

`src/cli.test.ts` spawns every child through one helper, `childOf`, which calls **`spawnSync`** with
`encoding: "utf8"` and **full output capture** (`src/cli.test.ts:295-320`). A capturing parent **never
closes the pipe early** — it reads to EOF. **So not one of the seventeen existing children can produce
an `EPIPE`, and a guard cannot be written by reusing one.**

The file also pins itself, hard (`src/cli.test.ts:1473-1485`):

```
expect(spawned).toBe(17);
expect(Object.keys(CHILDREN)).toHaveLength(17);
expect(imported).toEqual(["spawnSync"]);
expect(self.match(/\bspawnSync\s*\(/g)).toHaveLength(1);
```

— exactly one `spawnSync` call site, and `spawnSync` as the **only** name taken from
`node:child_process`. A naive `spawn` import reds two of those rows.

## The two shapes I measured (both reproduce, on `main` @ `414ef75`)

**(a) A shell pipeline child, routed through the EXISTING `childOf` helper.**

```js
spawnSync("/bin/sh",
  ["-c", 'set -o pipefail; "$1" src/cli.ts --ascii | head -2 >/dev/null', "sh", process.execPath],
  { cwd, encoding: "utf8", input: "", stdio: ["pipe","pipe","pipe"], timeout: 30000 });
// measured: status 1, stderr contains `write EPIPE`, child.error undefined
```

**ZERO new `spawnSync` call sites and zero new imports** — `childOf(command, args)` already takes both,
so this is `childOf("/bin/sh", ["-c", …])` and the four pinned rows stay green apart from the count.
The interpreter is passed as `"$1"`, so no spawn argument is built by string concatenation (the file's
own bar 1b). **Caveat measured, not assumed:** `set -o pipefail` is a bash/zsh feature and `/bin/sh` on
this host honours it; a hop on another platform re-measures. And `pipefail` reports the pipeline's
status, so the assertion reads the node child's code only because `head` exits 0 — an engineer who wants
the code unambiguously should print `$?` from inside the shell instead.

**(b) An async `spawn` with `child.stdout.destroy()` after the first chunk.**

```
// measured: code 1, signal null, stderr contains `write EPIPE`, 485 bytes read before destroy
```

Also reproduces, and it is the more direct shape — **but it reds the two pinned rows above** and forces
their derivation to be rewritten.

**Recommendation on the page: (a). NOT mandated** — the choice is the engineer's, and either way the pin
moves with its derivation written beside it, exactly as `ABC-043` moved it from 10 to 17.

## The spawn account, derived rather than estimated

`ABC-115` `A3` names **five** children (reader closing at 2 lines and at 23 lines, on `--ascii` and on
the default glyph mode, plus the 24-line full-read control). `A4` reuses `ABC-043`'s existing throwing-
seam and refusal children and adds **none**. `A1`, `A2`, `A5`–`A8` add none.
**Ceiling +5, pin 17 → 22, ≈ 0.35 s at the 64–72 ms per child `ABC-043` measured.**

**`N8-LANE` IS NOT CLAIMED MET AND MAY NOT BE.** `ABC-108` is open; `NFR-008` is BREACHED on CPU /
UNRULED on wall. **Re-measured at this cut on `main` @ `414ef75`: `npx vitest run --dir src` → 40 files
/ 1207 tests / 0 skipped, GREEN, 2.95 s wall, 13.74 s user, 1.34 s sys — 13.74 s against the 13 s
clause.** A 5% slice of a spent total is not a slice; the ticket carries falsifiable zeroes instead.
