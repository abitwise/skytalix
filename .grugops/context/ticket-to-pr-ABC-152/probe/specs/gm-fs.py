NAME="R4-glyph-mode-nfr-NFR007-fs"
CMD="npx vitest run src/glyph-mode.nfr.test.ts"
EDITS=[("src/glyph-mode.ts",'import type { GlyphMode } from "./render.ts";\n','import { existsSync } from "node:fs";\nimport type { GlyphMode } from "./render.ts";\n'),
("src/glyph-mode.ts","export function selectGlyphMode(signals: GlyphSignals): GlyphMode {\n",'export function selectGlyphMode(signals: GlyphSignals): GlyphMode {\n  existsSync("/etc/locale.conf"); // PLANT\n')]
