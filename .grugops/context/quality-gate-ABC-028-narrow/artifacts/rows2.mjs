// F1's boundary run through the REAL suite, as real `ABC-028 A5` rows. Every `changes` value below
// was MEASURED by `changes.ts` on the DELIVERED pane first (`## Test notes` 4); none is predicted.
// Nothing is landed: every lane is out of tree and the worktree is never written.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildLane, replaceOnce } from "./lane.mjs";

const TABLE_ANCHOR = "  ];\n\n  it.each(A5_SHAPES)";

const row = (name, preservedTail, replacement, changes) => `    [
      "CANDIDATE ${name}",
      {
        preservedTail: ${preservedTail},
        replacement: ${JSON.stringify(replacement)},
        changes: ${JSON.stringify(changes)},
      },
    ],
`;

const append = (text) => (source) => {
  const parts = source.split(TABLE_ANCHOR);
  if (parts.length !== 2) throw new Error("A5_SHAPES anchor not unique");
  return `${parts[0]}${text}${TABLE_ANCHOR}${parts[1]}`;
};

/** Replaces the WHOLE table with one row and re-points the `it` body at a different fixture. */
const soloAt = (plies, text) => (source) => {
  const start = source.indexOf("  const A5_SHAPES:");
  const end = source.indexOf(TABLE_ANCHOR);
  if (start < 0 || end < 0) throw new Error("A5_SHAPES table not found");
  const head = `  const A5_SHAPES: readonly (readonly [name: string, shape: EditShape])[] = [\n`;
  // The `it` body is the region AFTER the table, so the two edits are scoped to that tail — the
  // same assertion text also appears in `A1`'s body at `:803` and must not be touched.
  let tail = source.slice(end);
  tail = replaceOnce(tail, "blackAnchorTo(21);", `blackAnchorTo(${plies});`, "it-body fixture");
  tail = replaceOnce(
    tail,
    '"the length is unchanged across the edit").toHaveLength(21);',
    `"the length is unchanged across the edit").toHaveLength(${plies});`,
    "it-body length",
  );
  return `${source.slice(0, start)}${head}${text}${tail}`;
};

function suite(lane, file) {
  const report = join(lane, "__report.json");
  try {
    execFileSync("npx", ["vitest", "run", "--reporter=json", `--outputFile=${report}`, file], {
      cwd: lane,
      encoding: "utf8",
      stdio: "pipe",
    });
  } catch {
    /* a red lane is the point of some of these */
  }
  const json = JSON.parse(readFileSync(report, "utf8"));
  const tests = json.testResults.flatMap((f) => f.assertionResults);
  return { total: json.numTotalTests, failed: tests.filter((t) => t.status === "failed") };
}

const R21_14 = row(
  "preservedTail 14 on blackAnchorTo(21) — one INSIDE the bound",
  14,
  [["a7", "a6"], ["b1", "c3"], ["h7", "h6"]],
  [[0, "30. Nc3 Nb8", "30. Nc3 h6"]],
);
const R21_15 = row(
  "preservedTail 15 on blackAnchorTo(21) — the bound EXACTLY",
  15,
  [["a2", "a3"], ["b8", "c6"], ["h2", "h3"]],
  [[0, "30. Nc3 Nb8", "30. h3 Nb8"]],
);
const R21_16 = row(
  "preservedTail 16 on blackAnchorTo(21) — one PAST the bound",
  16,
  [["a7", "a6"], ["c3", "b1"], ["h7", "h6"]],
  [],
);
const R22_14 = row(
  "preservedTail 14 on blackAnchorTo(22) — the HALF-ROW fixture's bound EXACTLY",
  14,
  [["a2", "a3"], ["c6", "b8"], ["h2", "h3"]],
  [[0, "31. Nb1 Nc6", "31. h3 Nc6"]],
);
const R22_15 = row(
  "preservedTail 15 on blackAnchorTo(22) — one PAST the half-row fixture's bound",
  15,
  [["a7", "a6"], ["b1", "c3"], ["h7", "h6"]],
  [],
);

const cases = [
  ["R21-T14  (row, appended)", append(R21_14), "expect GREEN"],
  ["R21-T15  (row, appended)", append(R21_15), "expect GREEN — the bound"],
  ["R21-T16  (row, appended)", append(R21_16), "expect RED on correct code"],
  ["R22-T14-AS-A-ROW-ONLY", append(R22_14), "the n=22 row's DATA on the n=21 fixture the it body hardcodes"],
  ["R22-T14-BODY-EDITED", soloAt(22, R22_14), "expect GREEN — requires editing the it body"],
  ["R22-T15-BODY-EDITED", soloAt(22, R22_15), "expect RED — one past the half-row bound"],
];

for (const [name, edit, note] of cases) {
  const lane = buildLane(name.split(" ")[0], { editTest: edit });
  const owned = suite(lane, "src/history-pane.test.ts");
  console.log(`--- ${name}   [${note}]`);
  console.log(`    owned lane: ${owned.failed.length} failed / ${owned.total}`);
  for (const test of owned.failed) {
    console.log(`      FAIL  ${test.title.slice(0, 110)}`);
    console.log(`            ${(test.failureMessages[0] ?? "").split("\n")[0].slice(0, 160)}`);
  }
}
