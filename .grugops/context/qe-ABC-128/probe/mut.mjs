// QE ABC-128 mutant planter. Usage: node mut.mjs <path/to/turn-loop.ts> <id>
// Plants ONE `keyHistory(history)` call at a unique anchor. Scratch copies only; never a worktree.
import { readFileSync, writeFileSync } from "node:fs";
const [file, id] = process.argv.slice(2);
const KH = "keyHistory(history);";
const M = {
  // take-back edge (A1)
  M9: { anchor: "        takeBack(history, outcome.plies);", where: "after", line: `        ${KH}` },
  M9b: { anchor: "        takeBack(history, outcome.plies);", where: "before", line: `        ${KH}` },
  M9c: { anchor: "        takeBack(history, outcome.plies);", where: "after", line: `        if (outcome.plies > 0) ${KH}` },
  // edges the narrowed A8 title names
  M10: { anchor: '        return { result: "draw", reason: claimable.draws[0] as ClaimableDraw, exitCode: 0 };', where: "before", line: `        ${KH}` },
  M11: { anchor: "        playMove(history, outcome.move);", where: "after", line: `        ${KH}` },
  M12: { anchor: "      playMove(history, move);", where: "after", line: `      ${KH}` },
  M13: { anchor: "          messages = claimShortfall(history);", where: "before", line: `          ${KH}` },
  // edges the title no longer claims (out of scope; measured for the gap register)
  M14: { anchor: "          messages = outcome.messages;", where: "before", line: `          ${KH}` },
  M15: { anchor: "        sink.write(`${QUIT_NOTICE}\\n`);", where: "before", line: `        ${KH}` },
  M16: { anchor: "        sink.write(`${INPUT_ENDED_NOTICE}\\n`);", where: "before", line: `        ${KH}` },
  M17: { anchor: "        return { result: outcome.result, reason: outcome.reason, exitCode: 0 };", where: "before", line: `        ${KH}` },
};
const m = M[id];
if (!m) throw new Error(`unknown mutant ${id}`);
const s = readFileSync(file, "utf8").split("\n");
const hits = s.flatMap((l, i) => (l === m.anchor ? [i] : []));
if (hits.length !== 1) throw new Error(`${id}: anchor hits ${hits.length}, want 1`);
const i = hits[0] + (m.where === "after" ? 1 : 0);
s.splice(i, 0, m.line);
writeFileSync(file, s.join("\n"));
console.log(`${id} planted at line ${i + 1}: ${m.line.trim()}`);
