// SCRATCH PROBE (arch-ABC-291-probe), PR3: an independent labeller of ADR-0075 d1, written from its words. It imports
// nothing: it reads a FEN string, holds each side's pawns as (file, own rank) points in that side's own frame, and
// states each definition over those points. It shares no code, form or table with the patch. d2's values are copied
// from the ADR's table.
const CONNECTED = [0, 0, 2, 5, 10, 17, 28, 0];
const PHALANX = [0, 0, 1, 2, 5, 8, 14, 0];
const BACKWARD = 10;
type Point = { f: number; R: number };
type Parts = Record<"connected" | "phalanx" | "backward", { mg: number; eg: number }>;

function score(own: Point[], enemy: Point[]): Parts {
  const at = (set: Point[], f: number, R: number): boolean => set.some((p) => p.f === f && p.R === R);
  let connected = 0;
  let phalanx = 0;
  let backward = 0;
  for (const { f, R } of own) {
    // Connected: a friendly pawn stands on (f - 1, R - 1) or (f + 1, R - 1). Once per pawn.
    if (at(own, f - 1, R - 1) || at(own, f + 1, R - 1)) connected += CONNECTED[R] as number;
    // Phalanx: a friendly pawn stands on (f - 1, R) or (f + 1, R), and R >= 2. Once per pawn.
    if (R >= 2 && (at(own, f - 1, R) || at(own, f + 1, R))) phalanx += PHALANX[R] as number;
    // Backward: (a) a pawn on f - 1 or f + 1, on any rank; (b) no such pawn on rank R or behind it; (c) the stop
    // square (f, R + 1) holds an enemy pawn, or an enemy pawn attacks it from (f - 1, R + 2) or (f + 1, R + 2).
    const neighbours = own.filter((p) => p.f === f - 1 || p.f === f + 1);
    const a = neighbours.length > 0;
    const b = neighbours.every((p) => p.R > R);
    const c = at(enemy, f, R + 1) || at(enemy, f - 1, R + 2) || at(enemy, f + 1, R + 2);
    if (a && b && c) backward += BACKWARD;
  }
  return {
    connected: { mg: connected, eg: connected },
    phalanx: { mg: phalanx, eg: phalanx },
    backward: { mg: backward, eg: backward },
  };
}

export function label(fen: string): { white: Parts; black: Parts } {
  const whiteFrame: { white: Point[]; black: Point[] } = { white: [], black: [] };
  const rows = (fen.split(" ")[0] as string).split("/");
  rows.forEach((row, index) => {
    const rankFromWhite = 7 - index;
    let f = 0;
    for (const ch of row) {
      if (ch >= "1" && ch <= "8") {
        f += Number(ch);
        continue;
      }
      if (ch === "P") whiteFrame.white.push({ f, R: rankFromWhite });
      if (ch === "p") whiteFrame.black.push({ f, R: rankFromWhite });
      f++;
    }
  });
  const flip = (p: Point): Point => ({ f: p.f, R: 7 - p.R });
  return {
    white: score(whiteFrame.white, whiteFrame.black),
    black: score(whiteFrame.black.map(flip), whiteFrame.white.map(flip)),
  };
}

// Hand-worked rows, read at the start of PR3. A miss stops PR3 before the patch is read: it is the labeller's fault.
export const HAND_ROWS: ReadonlyArray<readonly [string, readonly [number, number, number], readonly [number, number, number]]> = [
  ["4k3/8/8/8/3P4/2P5/1P6/4K3 w - - 0 1", [7, 0, 0], [0, 0, 0]],
  ["4k3/8/8/3PP3/8/8/8/4K3 w - - 0 1", [0, 10, 0], [0, 0, 0]],
  ["4k3/8/8/4p3/2P5/3P4/8/4K3 w - - 0 1", [5, 0, 10], [0, 0, 0]],
  ["4k3/8/8/8/2PPp3/8/3P4/4K3 w - - 0 1", [0, 4, 10], [0, 0, 0]],
  ["4k3/8/8/8/2Pp4/3P4/8/4K3 w - - 0 1", [5, 0, 10], [0, 0, 0]],
  ["4k3/8/p7/1p6/1P6/8/8/4K3 b - - 0 1", [0, 0, 0], [5, 0, 10]],
];
