NAME="R1-cli-resolveOptions-calls-selectGlyphMode"
CMD="npx vitest run src/cli.test.ts -t 'selectGlyphMode is not called'"
EDITS=[("src/cli-options.ts",'import type { GlyphFlags } from "./glyph-mode.ts";\n','import { type GlyphFlags, selectGlyphMode } from "./glyph-mode.ts";\n'),
("src/cli-options.ts","export function resolveOptions(argv: readonly string[]): Resolution {\n","export function resolveOptions(argv: readonly string[]): Resolution {\n  selectGlyphMode({ ascii: false, unicode: false, isTTY: false, env: {} }); // PLANT\n")]
