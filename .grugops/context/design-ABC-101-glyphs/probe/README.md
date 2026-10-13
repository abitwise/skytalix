# Probe — design-ABC-101-glyphs (2026-10-13, Frontend/UI)

Run out of tree only. `git archive d5b55db3 src package.json` into a scratch directory; a second copy
had the six Unicode pairs in `src/render.ts` `GLYPHS.unicode` reversed (option (a)) by an exact
string replace, asserted once per pair. `probe.mjs <copy-root>` imports that copy's `render.ts` and
`fen.ts`, renders the start position in both modes and both orientations, and prints each row's
code-point width, UTF-16 width and the code points above U+007F. Its last line reads option (b)'s
cost: one rank with an SGR foreground (`ESC[97m` … `ESC[39m`) around each piece glyph.

- `readings-main-d5b55db3.txt` — the merged table.
- `readings-swapped-option-a.txt` — option (a).

Suite on the swapped copy (`npx vitest run`, `node_modules` symlinked from the main checkout,
read-only): 8 reds, all in `src/render.test.ts`. The `src/cli.test.ts` and `tools/grugops` reds in
the first run were scratch artefacts (no `AGENTS.md`, no `.grugops/qe-cutover-2026-08-17.txt` in the
archive). `cli.test.ts` re-run with `AGENTS.md` present: 69/69 green. No timing was read. Both
scratch copies were removed by exact path.
