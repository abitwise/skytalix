// design-ABC-152 F1: apply ONLY the declared rewrite forms R1-R3 (METHOD.md + amendment 1) to a scratch
// tree. Each edit is an exact-string replacement that must match once; a miss throws. Prints a per-file
// `expect(` count before and after (V5 asks for equal counts).
// Usage: node f1-rewrites.mjs <scratch tree>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TREE = process.argv[2];
if (!TREE) throw new Error("tree required");
const edits = {
  // R1: namespace spy -> vi.mock(path, { spy: true }) + the spy read off the namespace, cleared where the
  // original was installed (counts start at the same point). Restore -> clear (an automock cannot be restored).
  "src/cli.test.ts": [
    ['import * as glyphMode from "./glyph-mode.ts";\n', 'import * as glyphMode from "./glyph-mode.ts";\n'],
    ['import { describe, expect, it, vi } from "vitest";\n', 'import { describe, expect, it, vi } from "vitest";\n\nvi.mock("./glyph-mode.ts", { spy: true });\n'],
    ['const spy = vi.spyOn(glyphMode, "selectGlyphMode");', 'const spy = vi.mocked(glyphMode.selectGlyphMode);\n    spy.mockClear();'],
    ["    } finally {\n      spy.mockRestore();\n    }", "    } finally {\n      spy.mockClear();\n    }"],
  ],
  "src/render-seam.test.ts": [
    [
      'import { type RenderSeam, runTurnLoop } from "./turn-loop.ts";\n',
      'import { type RenderSeam, runTurnLoop } from "./turn-loop.ts";\n\nvi.mock("./frame.ts", { spy: true });\nvi.mock("./gameend.ts", { spy: true });\nvi.mock("./history.ts", { spy: true });\nvi.mock("./history-pane.ts", { spy: true });\nvi.mock("./legal.ts", { spy: true });\nvi.mock("./render.ts", { spy: true });\nvi.mock("./status-panel.ts", { spy: true });\n\n/** R1: a `{ spy: true }` automock spy, cleared at the point the original `vi.spyOn` was installed. */\nfunction spyFrom<T extends (...args: never[]) => unknown>(fn: T) {\n  const spy = vi.mocked(fn);\n  spy.mockClear();\n  return spy;\n}\n',
    ],
    ['vi.spyOn(gameend, "gameStatus")', "spyFrom(gameend.gameStatus)"],
    ['vi.spyOn(historyModule, "gameStatusOf")', "spyFrom(historyModule.gameStatusOf)"],
    ['vi.spyOn(legal, "legalMoves")', "spyFrom(legal.legalMoves)"],
    ['const panel = vi.spyOn(statusPanel, "renderStatusPanel");\n\n    for (let call = 0; call < 3', "const panel = spyFrom(statusPanel.renderStatusPanel);\n\n    for (let call = 0; call < 3"],
    ['vi.spyOn(render, "renderBoard")', "spyFrom(render.renderBoard)"],
    ['const panel = vi.spyOn(statusPanel, "renderStatusPanel");\n    const pane', "const panel = spyFrom(statusPanel.renderStatusPanel);\n    const pane"],
    ['vi.spyOn(historyPane, "renderHistory")', "spyFrom(historyPane.renderHistory)"],
    ['vi.spyOn(frameModule, "assembleFrame")', "spyFrom(frameModule.assembleFrame)"],
    ['const panel = vi.spyOn(statusPanel, "renderStatusPanel");\n\n    for (const thinking', "const panel = spyFrom(statusPanel.renderStatusPanel);\n\n    for (const thinking"],
  ],
  // R3: vi.fn(<a binding this file mocks with vi.fn>) -> a NEW spy that calls through to it (3.2.7's behaviour).
  "src/command-input.test.ts": [
    ["      legalMoves: vi.fn(legalMoves),", "      legalMoves: vi.fn((...args: Parameters<typeof legalMoves>) => legalMoves(...args)),"],
    ["  const derive = vi.fn(legalMoves);", "  const derive = vi.fn((...args: Parameters<typeof legalMoves>) => legalMoves(...args));"],
  ],
  // R2: resetModules + doMock + fresh import -> file-level { spy: true } + a per-test stub restored in finally.
  "tools/opening-book/book.test.ts": [
    [
      '    vi.resetModules();\n    vi.doMock("../../src/zobrist.ts", () => ({ zobristKey: () => 0n }));\n    try {\n      const stubbed = await import("./compile.ts");',
      '    vi.mocked(zobrist.zobristKey).mockImplementation(() => 0n);\n    try {\n      const stubbed = await import("./compile.ts");',
    ],
    [
      '    } finally {\n      vi.doUnmock("../../src/zobrist.ts");\n      vi.resetModules();\n    }',
      "    } finally {\n      vi.mocked(zobrist.zobristKey).mockReset(); // an automock spy: back to the original implementation\n    }",
    ],
  ],
};
const count = (s) => (s.match(/\bexpect\(/g) ?? []).length;
for (const [file, list] of Object.entries(edits)) {
  const path = join(TREE, file);
  let s = readFileSync(path, "utf8");
  const before = count(s);
  for (const [from, to] of list) {
    const n = s.split(from).length - 1;
    if (n !== 1) throw new Error(`${file}: expected 1 match, got ${n}: ${from.slice(0, 60)}`);
    s = s.replace(from, to);
  }
  if (file === "tools/opening-book/book.test.ts") {
    // the R2 import: the stubbed module's namespace, and its file-level { spy: true }
    const anchor = s.indexOf("\n", s.lastIndexOf("\nimport ")+1);
    s = `${s.slice(0, anchor + 1)}import * as zobrist from "../../src/zobrist.ts";\n\nvi.mock("../../src/zobrist.ts", { spy: true });\n${s.slice(anchor + 1)}`;
  }
  writeFileSync(path, s);
  console.log(`${file}: expect( ${before} -> ${count(s)}`);
}
