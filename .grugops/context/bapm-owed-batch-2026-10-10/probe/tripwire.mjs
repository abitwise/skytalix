// Copy of src/history-pane.nfr.test.ts:550-558 bindsAssembleFrame at wave tip 35ad336b, read-only re-measure.
const bindsAssembleFrame = (source) =>
  [...source.matchAll(/^import\s+(?!type\b)([^;]*?)\s*from\s+"\.\/frame\.ts";/gm)].some(
    ([, clause = ""]) =>
      /\*\s*as\s+\w+/.test(clause) ||
      (clause.match(/\{([^}]*)\}/)?.[1] ?? "").split(",").some((s) => /^assembleFrame\b/.test(s.trim())),
  );
const rows = {
  "control: value brace": 'import { assembleFrame } from "./frame.ts";',
  "control: namespace": 'import * as F from "./frame.ts";',
  "QE-054-b(1) comment ahead": 'import { /* c */ assembleFrame } from "./frame.ts";',
  "QE-054-b(2) default": 'import assembleFrame from "./frame.ts";',
  "QE-054-b(2) default-as": 'import { default as assembleFrame } from "./frame.ts";',
  "QE-057-b(1) string-named": 'import { "assembleFrame" as compose } from "./frame.ts";',
  "QE-057-b(2) comment with ; after name": 'import { assembleFrame /* a; b */ } from "./frame.ts";',
};
for (const [k, v] of Object.entries(rows)) console.log(bindsAssembleFrame(v) ? "COUNTED  " : "uncounted", k);
