// qe-EPIC-010-m1-batch-2: skytalix PGN clock reader (ABC-247 Test note 3 guard).
// usage: node clocks.mjs [--check] <r.pgn>...   Prints, per file, the skytalix clock histogram.
// A skytalix move's clock is the `N.Ns` in its move comment, matched before `,` or the end of the
// comment (QE-247-a: the last move's comment holds the clock and the result). A skytalix move with
// no comment, or no clock in it, is a book move. --check: exit 3 if any skytalix move reads 3.0s or
// none reads 4.0s, over all files given.
import { readFileSync } from "node:fs";
const args = process.argv.slice(2);
const check = args[0] === "--check";
const files = check ? args.slice(1) : args;
let all3 = 0, all4 = 0;
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const games = text.split(/\n(?=\[Event )/).filter((g) => g.includes("[Event "));
  const hist = new Map();
  let book = 0, moves = 0, under1 = 0;
  for (const game of games) {
    const tag = (n) => new RegExp(`^\\[${n} "(.*)"\\]$`, "m").exec(game)?.[1];
    const skyWhite = tag("White") === "skytalix";
    if (!skyWhite && tag("Black") !== "skytalix") throw new Error(`${file}: a game without skytalix`);
    const fen = tag("FEN");
    let whiteToMove = fen === undefined ? true : fen.split(" ")[1] === "w";
    const body = game.replace(/^\[.*\]$/gm, "");
    // tokens: comments, move numbers, results, SAN
    const re = /\{([^}]*)\}|(\d+\.(?:\.\.)?)|(1-0|0-1|1\/2-1\/2|\*)|([^\s{}]+)/g;
    let m, lastSky = null;
    while ((m = re.exec(body)) !== null) {
      if (m[4] !== undefined) {
        const sky = whiteToMove === skyWhite;
        if (lastSky === true) book++; // previous skytalix move had no comment
        lastSky = sky ? true : false;
        if (sky) moves++;
        whiteToMove = !whiteToMove;
      } else if (m[1] !== undefined) {
        if (lastSky === true) {
          const c = /(\d+(?:\.\d+)?)s\s*(?:,|$)/.exec(m[1].trim());
          if (c === null) book++;
          else {
            const v = Number(c[1]);
            const k = v.toFixed(1);
            hist.set(k, (hist.get(k) ?? 0) + 1);
            if (v < 1) under1++;
          }
        }
        lastSky = null;
      } else if (m[3] !== undefined) {
        if (lastSky === true) book++;
        lastSky = null;
      }
    }
    if (lastSky === true) book++;
  }
  const n3 = hist.get("3.0") ?? 0, n4 = hist.get("4.0") ?? 0;
  all3 += n3; all4 += n4;
  const h = [...hist.entries()].sort((a, b) => Number(b[0]) - Number(a[0])).map(([k, v]) => `${k}s×${v}`).join(" ");
  console.log(`${file.replace(/^.*\/(base|candidate)\//, "$1/")}: games ${games.length}; skytalix moves ${moves}; at 4.0s ${n4}; at 3.0s ${n3}; book/no clock ${book}; <1s ${under1}; hist ${h}`);
}
if (check) {
  const ok = all3 === 0 && all4 > 0;
  console.log(`CHECK ${ok ? "PASS" : "FAIL"}: at 4.0s ${all4}, at 3.0s ${all3}`);
  process.exit(ok ? 0 : 3);
}
