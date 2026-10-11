NAME="R4-glyph-mode-nfr-NFR007-fsp"
CMD="npx vitest run src/glyph-mode.nfr.test.ts"
EDITS=[("src/glyph-mode.ts",'import type { GlyphMode } from "./render.ts";\n','import { access } from "node:fs/promises";\nimport type { GlyphMode } from "./render.ts";\n'),
("src/glyph-mode.ts","export function selectGlyphMode(signals: GlyphSignals): GlyphMode {\n",'export function selectGlyphMode(signals: GlyphSignals): GlyphMode {\n  void access("/etc/locale.conf").catch(() => {}); // PLANT\n')]
