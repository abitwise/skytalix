// QE ABC-152: does an ADMITTED form (R2's shape: vi.mock(p, { spy: true }) at file top + vi.mocked(f).mockImplementation
// in the test) re-arm PUZZLE_DEEP=weakened at head? Scratch only; QE does not write the fix.
const F = "src/puzzle-suite.test.ts";
const edits = [
  { file: F, find: 'import type { EngineChoice, EngineOptions } from "./engine.ts";\n', replace: 'import type { EngineChoice, EngineOptions } from "./engine.ts";\nimport { evaluate } from "./evaluate.ts";\n' },
  { file: F, find: 'import { virtualClock } from "./virtual-clock.ts";\n', replace: 'import { virtualClock } from "./virtual-clock.ts";\n\nvi.mock("./evaluate.ts", { spy: true });\n' },
  { file: F, find: '      vi.doMock("./evaluate.ts", async (importOriginal) => ({\n        ...(await importOriginal<typeof import("./evaluate.ts")>()),\n        evaluate: () => 0,\n      }));\n', replace: '      vi.mocked(evaluate).mockImplementation(() => 0);\n' },
];
export default [
  { id: "pz-asis-weakened-HEAD", tests: [F], env: { PUZZLE_DEEP: "weakened" }, edits: [], expect: "red", why: "as committed: which row is red?" },
  { id: "pz-r2form-weakened", tests: [F], env: { PUZZLE_DEEP: "weakened" }, edits, expect: "red", why: "R2 shape: the GATE row must be the red one, A3 green" },
  { id: "pz-r2form-deep1", tests: [F], env: { PUZZLE_DEEP: "1" }, edits, expect: "green", why: "R2 shape must not move the shipped gating run" },
  { id: "pz-r2form-default", tests: [F], edits, expect: "green", why: "default lane unchanged" },
];
