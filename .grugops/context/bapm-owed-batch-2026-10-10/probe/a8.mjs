// Copy of src/render-seam.test.ts:107-123 bindsAValueFrom at wave tip 35ad336b, read-only re-measure.
const bindsAValueFrom = (source, target) =>
  [...source.matchAll(new RegExp(`^import\\s+([^;"]*?)\\s*from\\s+"\\./${target.replace(".", "\\.")}";`, "gm"))].some(([, clause = ""]) => {
    if (/^type\s/.test(clause)) return false;
    const outsideBraces = clause.replace(/\{[^}]*\}/, "").replace(/,/g, "").trim();
    if (outsideBraces !== "") return true;
    return (clause.match(/\{([^}]*)\}/)?.[1] ?? "").split(",").map((s) => s.trim()).some((s) => s !== "" && !/^type\s/.test(s));
  });
const rows = {
  "QE-054-a O1 comment in all-type brace (expect false)": 'import { /* c */ type X } from "./m.ts";',
  "QE-054-a O2 trailing line comment (expect false)": 'import {\n  type X, // c\n} from "./m.ts";',
  "QE-054-a O6 commented-out value (expect false)": 'import {\n  type X,\n  // f,\n} from "./m.ts";',
  "QE-054-a O4 col-0 import inside block comment (expect false)": '/*\nimport { f } from "./m.ts";\n*/',
  "QE-054-c multi-line mixed brace (expect true)": 'import {\n  type X,\n  f,\n} from "./m.ts";',
  "QE-054-c second statement binds (expect true)": 'import type { X } from "./m.ts";\nimport { f } from "./m.ts";',
};
for (const [k, v] of Object.entries(rows)) console.log(bindsAValueFrom(v, "m.ts"), k);
