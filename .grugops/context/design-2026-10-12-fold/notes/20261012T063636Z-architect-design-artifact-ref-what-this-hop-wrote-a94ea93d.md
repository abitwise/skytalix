---
id: 20261012T063636Z-architect-design-artifact-ref-what-this-hop-wrote-a94ea93d
kind: artifact-ref
by: architect-design
task: design-2026-10-12-fold
at: 2026-10-12T06:36:36Z
verified_by:
confidence: high
refs:
  - ABC-116
  - A5
  - ADR-0017
  - ADR-0035
  - NFR-008
  - plans/nfr-catalog.md
  - plans/traceability.md
supersedes:
---

# `design-2026-10-12-fold`: what this hop wrote, and the fences it kept

This note is hand-authored and unsealed.

## Branch

- `grugops/design-2026-10-12-fold` from `main` @ `d8794608`, in the sibling worktree
  `../cli-chess-example-design-2026-10-12-fold`, with `node_modules` symlinked.
- Not pushed, not merged. The worktree is removed at the end of the hop.

## Files

- **`ADR-0017`.** One dated Status pointer and `§ Addendum 2026-10-12` (A1–A3) at the end. Decisions 1–4 are
  byte-identical.
- **`ADR-0035`.** One dated Status paragraph, "Per-set floor, 2026-10-12". No decision text was edited.
- **`plans/nfr-catalog.md`.** +14/−2 lines.
  - The top `_Updated:` line.
  - **The `ABC-116` A5 pointer**, located by content. It is one paragraph directly after the `N8-SPAWN` account
    blockquote (the block headed "THE SPAWN ACCOUNT (`N8-SPAWN`) IS CREATED", `:1193` after the edit; the pointer is at `:1263`), and it points to the
    `T1`/`T2` bullets under "What replaces the gate — TWO NAMED TRIGGERS" (`:1632–1633` after the edit). The
    blockquote itself is byte-identical.
  - One dated line under the `T2` bullet.
  - In the floors block, the `src/cli.test.ts` floor and the "650 ms refused" sentence are struck and kept, and
    dated replacements are added.
- **NFR hash.** `grep -E '^\| NFR-00[1-8] \|' plans/nfr-catalog.md | shasum -a 256` gives
  `c74e742698b59da90b67e101942f20406a20c8aee54da7f518df39da9eae0d3b` on 8 lines, at base and at tip. **No row was
  changed.** The nine-row hash including `NFR-009` is also equal.
- **`plans/traceability.md`.** One row appended at the end.
- **Notes.** These four.

## Not touched

- `src/`, `tools/`, `data/`, `vitest.config.ts`, `package.json`, `plans/board.md`, `AGENTS.md`, and every ticket
  page.
- No timing reading was taken. The only computation was arithmetic over committed TSVs.
- Nothing was merged, pushed, force-moved or deleted.
