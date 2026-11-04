// arch-ABC-239-f3f4 D5: a scratch copy of src/evaluate.queen-on.test.ts whose K1 (c) rows run with the six
// king-file pairs at their pre-tune values (base 15/10/20 both halves, queen-on 0), every literal unchanged.
// usage: node d5-make.mjs <in.test.ts> <out.test.ts>
import { readFileSync, writeFileSync } from "node:fs";
const [inp, out] = process.argv.slice(2);
let s = readFileSync(inp, "utf8");
const rep = (a, b) => { if (!s.includes(a)) throw new Error(`missing: ${a.slice(0, 60)}`); s = s.replace(a, b); };
rep('import * as PARAMS from "./evaluate-params.ts";',
  'import * as PARAMS_SHIPPED from "./evaluate-params.ts";\n' +
  '// D5: the king-file pairs at the values the K1 (c) literals were frozen at (E1 rule values; queen-on 0).\n' +
  'const PARAMS = { ...PARAMS_SHIPPED, KING_SHELTER_MISSING: { mg: 15, eg: 15 }, KING_FILE_HALF_OPEN: { mg: 10, eg: 10 }, KING_FILE_OPEN: { mg: 20, eg: 20 }, KING_SHELTER_MISSING_QUEEN: { mg: 0, eg: 0 }, KING_FILE_HALF_OPEN_QUEEN: { mg: 0, eg: 0 }, KING_FILE_OPEN_QUEEN: { mg: 0, eg: 0 } } as unknown as EvaluationParameters & typeof PARAMS_SHIPPED;');
// row 1: the reads at "pairs 0" run inside the seam
rep(`  it("with the pairs at 0, each king's exposure is its base exposure in both halves, queen or no queen", () => {
    for (const { row, at, position } of POSITIONS) {`,
`  it("with the pairs at 0, each king's exposure is its base exposure in both halves, queen or no queen", () => {
    withParametersForTest(PARAMS, () => { for (const { row, at, position } of POSITIONS) {`);
rep(`        expect(exposure[side], \`\${row.id} \${at} \${side}\`).toEqual({ mg: cp, eg: cp });
      }
    }
  });`, `        expect(exposure[side], \`\${row.id} \${at} \${side}\`).toEqual({ mg: cp, eg: cp });
      }
    } });
  });`);
// rows 4 and 5: the "before" reads run inside the seam
s = s.replaceAll(`    const before = POSITIONS.map(({ position }) => ({`, `    const before = withParametersForTest(PARAMS, () => POSITIONS.map(({ position }) => ({`);
s = s.replace(`      flat: whitePov(position, evaluateWithoutTaper(position)),
    }));
    withParametersForTest(SEAM_2X`, `      flat: whitePov(position, evaluateWithoutTaper(position)),
    })));
    withParametersForTest(SEAM_2X`);
s = s.replace(`      flat: whitePov(position, evaluateWithoutTaper(position)),
    }));
    let moved = 0;`, `      flat: whitePov(position, evaluateWithoutTaper(position)),
    })));
    let moved = 0;`);
writeFileSync(out, s);
console.log("written", out.split("/").pop(), (s.match(/withParametersForTest\(PARAMS,/g) || []).length, "PARAMS seams");
