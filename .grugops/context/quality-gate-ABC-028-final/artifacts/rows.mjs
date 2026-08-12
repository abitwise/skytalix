// DOES `A5`'s EXTENSION MECHANISM ACTUALLY EXTEND? The ticket's central design claim is that
// closing a further member of the cache class is "a NEW ROW, never a new criterion". This builds
// two candidate rows OUT OF TREE and runs them. Nothing here is landed anywhere.
//
//   row 3  — preservedTail 3, the rung the ledger calls its deepest known live witness.
//   row 16 — preservedTail 16, past the rendered window.
//
// Every `changes` value below was MEASURED by `probe.ts` on the delivered pane (`## Test notes` 4);
// none is predicted.
import { execFileSync } from "node:child_process";
import { copyFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildLane } from "./mk.mjs";

const HERE = dirname(new URL(import.meta.url).pathname);
const ANCHOR = "  ];\n\n  it.each(A5_SHAPES)";

const ROW_3 = `    [
      "CANDIDATE the last THREE moves' identities are preserved and plies 16 and 18 change",
      {
        preservedTail: 3,
        replacement: [
          ["a2", "a3"],
          ["b8", "c6"],
          ["h2", "h3"],
        ],
        changes: [
          [5, "35. Nb1 Nc6", "35. a3 Nc6"],
          [6, "36. Nc3 Nb8", "36. h3 Nb8"],
        ],
      },
    ],
`;

const ROW_16 = `    [
      "CANDIDATE the last SIXTEEN moves' identities are preserved — the edit is off-window",
      {
        preservedTail: 16,
        replacement: [
          ["a7", "a6"],
          ["c3", "b1"],
          ["h7", "h6"],
        ],
        changes: [],
      },
    ],
`;

const insert = (row) => (source) => {
  const parts = source.split(ANCHOR);
  if (parts.length !== 2) throw new Error("A5_SHAPES anchor not unique");
  return `${parts[0]}${row}${ANCHOR}${parts[1]}`;
};

function suite(lane, only) {
  const report = join(lane, "__report.json");
  const args = ["vitest", "run", "--reporter=json", `--outputFile=${report}`];
  if (only !== undefined) args.push(only);
  try {
    execFileSync("npx", args, { cwd: lane, encoding: "utf8", stdio: "pipe" });
  } catch {
    /* a red suite is the point of some of these lanes */
  }
  const json = JSON.parse(readFileSync(report, "utf8"));
  const failed = json.testResults
    .flatMap((file) => file.assertionResults)
    .filter((test) => test.status === "failed");
  return { total: json.numTotalTests, failed, files: json.testResults.length };
}

const cases = [
  ["ROW3-CLEAN", ROW_3, null],
  ["ROW3-WCACHE-LAST3", ROW_3, "tail:3"],
  ["ROW3-WCACHE-LAST4", ROW_3, "tail:4"],
  ["ROW16-CLEAN", ROW_16, null],
];

for (const [name, row, key] of cases) {
  const lane = buildLane(name, { key, extraTest: insert(row) });
  copyFileSync(join(HERE, "identity.ts"), join(lane, "__identity.ts"));
  const identity = execFileSync("node", ["__identity.ts"], { cwd: lane, encoding: "utf8" }).trim();
  const owned = suite(lane, "src/history-pane.test.ts");
  console.log(`--- ${name}  key=${key ?? "delivered pane"}`);
  console.log(`    ${identity}`);
  console.log(`    owned lane: ${owned.failed.length} failed / ${owned.total}`);
  for (const test of owned.failed) {
    console.log(`      FAIL  ${test.title}`);
    console.log(
      `            ${(test.failureMessages[0] ?? "").split("\n")[0].slice(0, 150)}`,
    );
  }
}
