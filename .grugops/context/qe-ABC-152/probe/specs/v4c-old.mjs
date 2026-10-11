// A2 old form (ccb8f1bd: runner off, vi.resetModules() form): the same QE ordinal salt must be GREEN (blind).
import specs from "./v4-specs.mjs";
const s = specs.find((x) => x.id === "a2-ordinal-salt-head");
export default [
  { id: "OLD-ctl-book", tests: ["src/book.test.ts"], edits: [], expect: "green", why: "old-form control" },
  { ...s, id: "OLD-a2-ordinal-salt", expect: "green", why: "ruling 3: the old form is blind to a load-time salt" },
];
