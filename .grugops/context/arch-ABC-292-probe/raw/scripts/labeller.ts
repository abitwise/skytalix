// SCRATCH PROBE (arch-ABC-292-probe), PR3's independent labeller. Written from ADR-0076 d2's words and d3's table only.
// It imports nothing and shares no code with the patch: it reads a FEN string's board field and states d2's clauses.
//   Bishop pair: the side has two or more bishops; once; square colours not read.
//   Open file: a file holds at least one of the side's rooks and no pawn of either colour; once per file.
//   Semi-open file: a file holds at least one of the side's rooks, none of the side's pawns, and at least one enemy pawn;
//   once per file. A pawn "on a file" stands on ranks 2 to 7. Queens are not read. Side to move is not read.
// d3's table, literal: BISHOP_PAIR 50 / 50, ROOK_OPEN_FILE 20 / 20, ROOK_SEMI_OPEN_FILE 10 / 10.
const VALUE = { BISHOP_PAIR: 50, ROOK_OPEN_FILE: 20, ROOK_SEMI_OPEN_FILE: 10 } as const;
type Parts = Record<"BISHOP_PAIR" | "ROOK_OPEN_FILE" | "ROOK_SEMI_OPEN_FILE", { mg: number; eg: number }>;

export function label(fen: string): { white: Parts; black: Parts } {
  const rows = (fen.split(" ")[0] as string).split("/"); // rows[0] is rank 8
  const grid: string[][] = rows.map((r) => r.replace(/[1-8]/g, (n) => ".".repeat(Number(n))).split(""));
  const side = (own: "white" | "black"): Parts => {
    const isOwn = (c: string) => (own === "white" ? c >= "A" && c <= "Z" : c >= "a" && c <= "z");
    let bishops = 0;
    let open = 0;
    let semi = 0;
    for (const row of grid) for (const c of row) if (isOwn(c) && c.toLowerCase() === "b") bishops++;
    for (let file = 0; file < 8; file++) {
      let rook = false, ownPawn = false, enemyPawn = false;
      for (let r = 0; r < 8; r++) {
        const c = (grid[r] as string[])[file] as string;
        const rank = 8 - r;
        if (c.toLowerCase() === "r" && isOwn(c)) rook = true;
        if (c.toLowerCase() === "p" && rank >= 2 && rank <= 7) {
          if (isOwn(c)) ownPawn = true;
          else enemyPawn = true;
        }
      }
      if (!rook) continue;
      if (!ownPawn && !enemyPawn) open++;
      else if (!ownPawn && enemyPawn) semi++;
    }
    const v = (x: number) => ({ mg: x, eg: x });
    return {
      BISHOP_PAIR: v(bishops >= 2 ? VALUE.BISHOP_PAIR : 0),
      ROOK_OPEN_FILE: v(open * VALUE.ROOK_OPEN_FILE),
      ROOK_SEMI_OPEN_FILE: v(semi * VALUE.ROOK_SEMI_OPEN_FILE),
    };
  };
  return { white: side("white"), black: side("black") };
}

// Hand rows, worked by hand from d2 before the labeller ran: [fen, white [pair, open, semi], black [pair, open, semi]].
// They run first; a miss here stops PR3 as the labeller's own fault, before the patch is read.
export const HAND_ROWS: [string, number[], number[]][] = [
  ["4k3/8/8/8/8/8/8/R3K3 w - - 0 1", [0, 20, 0], [0, 0, 0]], // K R against K: open a
  ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", [50, 0, 0], [50, 0, 0]], // pairs, rooks behind own pawns
  ["r3k3/8/8/8/8/8/P7/R3K3 b - - 0 1", [0, 0, 0], [0, 0, 10]], // a-file: white's own a2; black semi on a
  ["4k3/8/8/8/8/8/R7/R3K3 w - - 0 1", [0, 20, 0], [0, 0, 0]], // doubled rooks, open a, once
  ["2b1k3/8/2b5/8/8/8/8/2B1K1N1 w - - 0 1", [0, 0, 0], [50, 0, 0]], // one white bishop; two black, same colour
  ["4k2r/7p/8/8/8/8/8/3QK2R w - - 0 1", [0, 0, 10], [0, 0, 0]], // h: white semi (black h7), black own h7; queen d1 not read
];
