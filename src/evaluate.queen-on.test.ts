/**
 * ABC-270 (E3a, structure only; `ADR-0068`): the three queen-on king-exposure pairs
 * (`KING_SHELTER_MISSING_QUEEN`, `KING_FILE_HALF_OPEN_QUEEN`, `KING_FILE_OPEN_QUEEN`) enter the
 * evaluation at `{ mg: 0, eg: 0 }`, added per file while the enemy has at least one queen.
 *
 * DEFAULT LANE (no search): K1 (a) the mirror with the pairs live, (b) `evaluate` `Object.is`-equal
 * to the pre-ticket `evaluate` on the frozen corpora, (c) QE's frozen queen pairs through the seam,
 * read per king (`kingExposureForTest`, `QE-270-a`) and through `evaluate`, and the source row (the
 * queen flags come from the walk's existing non-pawn compare). K1 (d), the int16 range row, is
 * `ABC-274` `A9` in `src/evaluate.taper.test.ts`; K1 (e), the phase-24 twins of `ABC-083` A2 (b) /
 * A3 (b), sits beside the rows it re-finds in `src/evaluate.king-mobility.test.ts`. K0 and the deep
 * half of K2 are the deep lanes' existing rows, unchanged.
 *
 * `QE_ROWS` is QE's frozen set, copied unchanged from
 * `.grugops/context/qe-ABC-270-freeze/raw/pairs.json` (sha256 `68769ea9…c681`, PREREG
 * `qe-ABC-270-freeze` `…fa82b3f3`). A row that must change is a new, dated QE note and a re-freeze,
 * never an edit here. The `*_PRE` arrays are the pre-ticket `evaluate` (`main` `src/` tree
 * `4cb84035`), read once before this ticket's code existed.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildCorpus, mirrorPosition } from "./evaluate.mirror-corpus.ts";
import { TAPER_DOOR_CORPUS, TAPER_MIRROR_POSITIONS } from "./evaluate.taper-corpus.ts";
import {
  type EvaluationParameters,
  evaluate,
  evaluateAtPhase,
  evaluateWithoutTaper,
  kingExposureForTest,
  withParametersForTest,
} from "./evaluate.ts";
import * as PARAMS from "./evaluate-params.ts";
import { parseFen, toFen } from "./fen.ts";
import { BLACK, type Position, pieceType, QUEEN } from "./position.ts";

interface KingCounts {
  readonly s: number;
  readonly h: number;
  readonly o: number;
  readonly q: number;
  readonly sQ: number;
  readonly hQ: number;
  readonly oQ: number;
  readonly baseCp: number;
  readonly seam2xCp: number;
}
interface SideExpect {
  readonly white: KingCounts;
  readonly black: KingCounts;
  readonly seamNetWpov: number;
}
interface QueenRow {
  readonly id: string;
  readonly subject: "white" | "black";
  readonly removed: readonly string[];
  readonly kind: "pair" | "control";
  readonly claim: string;
  readonly A: string;
  readonly B: string;
  readonly expect: { readonly A: SideExpect; readonly B: SideExpect };
  readonly [extra: string]: unknown;
}

const QE_ROWS: readonly QueenRow[] = [
  {
    id: "QP1",
    subject: "white",
    removed: ["d8"],
    kind: "pair",
    claim:
      "Kg1: g-file shelter missing + half-open (black g6); h3 shelters from two ranks; black queen removed -> white queen-on counts 1/1/0 -> 0",
    A: "3q2k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1",
    B: "6k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1",
    expect: {
      A: {
        white: {
          s: 1,
          h: 1,
          o: 0,
          q: 1,
          sQ: 1,
          hQ: 1,
          oQ: 0,
          baseCp: 25,
          seam2xCp: 75,
        },
        black: {
          s: 0,
          h: 0,
          o: 0,
          q: 1,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 0,
          seam2xCp: 0,
        },
        seamNetWpov: -50,
      },
      B: {
        white: {
          s: 1,
          h: 1,
          o: 0,
          q: 0,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 25,
          seam2xCp: 25,
        },
        black: {
          s: 0,
          h: 0,
          o: 0,
          q: 1,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 0,
          seam2xCp: 0,
        },
        seamNetWpov: 0,
      },
    },
  },
  {
    id: "QP2",
    subject: "white",
    removed: ["d8"],
    kind: "pair",
    claim:
      "game-1 shape: Ke1 / Ke8 with the d-file open (no pawns); black queen removed -> white 1/0/1 -> 0 while black's (white queen still on) stays 1/0/1",
    A: "3qk3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 w - - 0 1",
    B: "4k3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 w - - 0 1",
    expect: {
      A: {
        white: {
          s: 1,
          h: 0,
          o: 1,
          q: 1,
          sQ: 1,
          hQ: 0,
          oQ: 1,
          baseCp: 35,
          seam2xCp: 105,
        },
        black: {
          s: 1,
          h: 0,
          o: 1,
          q: 1,
          sQ: 1,
          hQ: 0,
          oQ: 1,
          baseCp: 35,
          seam2xCp: 105,
        },
        seamNetWpov: 0,
      },
      B: {
        white: {
          s: 1,
          h: 0,
          o: 1,
          q: 0,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 35,
          seam2xCp: 35,
        },
        black: {
          s: 1,
          h: 0,
          o: 1,
          q: 1,
          sQ: 1,
          hQ: 0,
          oQ: 1,
          baseCp: 35,
          seam2xCp: 105,
        },
        seamNetWpov: 70,
      },
    },
  },
  {
    id: "QP3",
    subject: "black",
    removed: ["d1"],
    kind: "pair",
    mirrorOf: "QP1",
    claim:
      "QP1 colour-mirrored (ranks flipped, colours swapped, side to move flipped): black Kg8 1/1/0 -> 0 when the white queen goes",
    A: "3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/3Q2K1 b - - 0 1",
    B: "3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/6K1 b - - 0 1",
    expect: {
      A: {
        white: {
          s: 0,
          h: 0,
          o: 0,
          q: 1,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 0,
          seam2xCp: 0,
        },
        black: {
          s: 1,
          h: 1,
          o: 0,
          q: 1,
          sQ: 1,
          hQ: 1,
          oQ: 0,
          baseCp: 25,
          seam2xCp: 75,
        },
        seamNetWpov: 50,
      },
      B: {
        white: {
          s: 0,
          h: 0,
          o: 0,
          q: 1,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 0,
          seam2xCp: 0,
        },
        black: {
          s: 1,
          h: 1,
          o: 0,
          q: 0,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 25,
          seam2xCp: 25,
        },
        seamNetWpov: 0,
      },
    },
  },
  {
    id: "QP4",
    subject: "black",
    removed: ["e2"],
    kind: "pair",
    bothQueens: true,
    claim:
      "both queens on in A. Kc1 2/1/1 (c half-open by black c5, d open), Kg8 2/1/0 (g5 own but 3 ranks ahead: shelter missing, file not half-open; h half-open by white h4). WHITE queen removed: black's counts -> 0, white's stay (black queen still on)",
    A: "6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1",
    B: "6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP3PP1/2K5 w - - 0 1",
    expect: {
      A: {
        white: {
          s: 2,
          h: 1,
          o: 1,
          q: 1,
          sQ: 2,
          hQ: 1,
          oQ: 1,
          baseCp: 60,
          seam2xCp: 180,
        },
        black: {
          s: 2,
          h: 1,
          o: 0,
          q: 1,
          sQ: 2,
          hQ: 1,
          oQ: 0,
          baseCp: 40,
          seam2xCp: 120,
        },
        seamNetWpov: -40,
      },
      B: {
        white: {
          s: 2,
          h: 1,
          o: 1,
          q: 1,
          sQ: 2,
          hQ: 1,
          oQ: 1,
          baseCp: 60,
          seam2xCp: 180,
        },
        black: {
          s: 2,
          h: 1,
          o: 0,
          q: 0,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 40,
          seam2xCp: 40,
        },
        seamNetWpov: -120,
      },
    },
  },
  {
    id: "QP5",
    subject: "white",
    removed: ["d7"],
    kind: "pair",
    bothQueens: true,
    claim:
      "QP4's A with the BLACK queen removed instead: white's counts -> 0, black's stay (white queen still on). QP4 + QP5 catch swapped flags",
    A: "6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1",
    B: "6k1/pp3p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1",
    expect: {
      A: {
        white: {
          s: 2,
          h: 1,
          o: 1,
          q: 1,
          sQ: 2,
          hQ: 1,
          oQ: 1,
          baseCp: 60,
          seam2xCp: 180,
        },
        black: {
          s: 2,
          h: 1,
          o: 0,
          q: 1,
          sQ: 2,
          hQ: 1,
          oQ: 0,
          baseCp: 40,
          seam2xCp: 120,
        },
        seamNetWpov: -40,
      },
      B: {
        white: {
          s: 2,
          h: 1,
          o: 1,
          q: 0,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 60,
          seam2xCp: 60,
        },
        black: {
          s: 2,
          h: 1,
          o: 0,
          q: 1,
          sQ: 2,
          hQ: 1,
          oQ: 0,
          baseCp: 40,
          seam2xCp: 120,
        },
        seamNetWpov: 80,
      },
    },
  },
  {
    id: "QP6",
    subject: "white",
    removed: ["e7"],
    kind: "pair",
    claim:
      "edge king Kh1: files g, h only (g2 shelters; h bare: missing + open); the f-file is bare too, so a 3-file window shifted inward would read 2/0/2. Black queen removed -> 0",
    A: "2k5/ppp1q3/3p4/4p3/4P3/2P5/PP1Q2P1/7K w - - 0 1",
    B: "2k5/ppp5/3p4/4p3/4P3/2P5/PP1Q2P1/7K w - - 0 1",
    expect: {
      A: {
        white: {
          s: 1,
          h: 0,
          o: 1,
          q: 1,
          sQ: 1,
          hQ: 0,
          oQ: 1,
          baseCp: 35,
          seam2xCp: 105,
        },
        black: {
          s: 0,
          h: 0,
          o: 0,
          q: 1,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 0,
          seam2xCp: 0,
        },
        seamNetWpov: -70,
      },
      B: {
        white: {
          s: 1,
          h: 0,
          o: 1,
          q: 0,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 35,
          seam2xCp: 35,
        },
        black: {
          s: 0,
          h: 0,
          o: 0,
          q: 1,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 0,
          seam2xCp: 0,
        },
        seamNetWpov: 0,
      },
    },
  },
  {
    id: "QP7",
    subject: "white",
    removed: ["c8", "d8"],
    kind: "pair",
    twoEnemyQueens: true,
    claim:
      "king off the back rank, Kg2: f2 beside the king does not shelter (f: missing, own pawn so no file term), g bare (missing + open), h4 shelters from two ranks. Black has TWO queens in A, none in B: the flag is 1, not 2 (a queen-count form reads 5x, not 3x)",
    A: "1kqq4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1",
    B: "1k6/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1",
    expect: {
      A: {
        white: {
          s: 2,
          h: 0,
          o: 1,
          q: 1,
          sQ: 2,
          hQ: 0,
          oQ: 1,
          baseCp: 50,
          seam2xCp: 150,
        },
        black: {
          s: 0,
          h: 0,
          o: 0,
          q: 0,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 0,
          seam2xCp: 0,
        },
        seamNetWpov: -100,
      },
      B: {
        white: {
          s: 2,
          h: 0,
          o: 1,
          q: 0,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 50,
          seam2xCp: 50,
        },
        black: {
          s: 0,
          h: 0,
          o: 0,
          q: 0,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 0,
          seam2xCp: 0,
        },
        seamNetWpov: 0,
      },
    },
  },
  {
    id: "QC8",
    subject: "white",
    removed: ["c8"],
    kind: "control",
    claim:
      "CONTROL, not a K1 (c) pair: QP7's A against one black queen left: the flag stays 1, so every count and both exposures are equal in A and B",
    A: "1kqq4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1",
    B: "1k1q4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1",
    expect: {
      A: {
        white: {
          s: 2,
          h: 0,
          o: 1,
          q: 1,
          sQ: 2,
          hQ: 0,
          oQ: 1,
          baseCp: 50,
          seam2xCp: 150,
        },
        black: {
          s: 0,
          h: 0,
          o: 0,
          q: 0,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 0,
          seam2xCp: 0,
        },
        seamNetWpov: -100,
      },
      B: {
        white: {
          s: 2,
          h: 0,
          o: 1,
          q: 1,
          sQ: 2,
          hQ: 0,
          oQ: 1,
          baseCp: 50,
          seam2xCp: 150,
        },
        black: {
          s: 0,
          h: 0,
          o: 0,
          q: 0,
          sQ: 0,
          hQ: 0,
          oQ: 0,
          baseCp: 0,
          seam2xCp: 0,
        },
        seamNetWpov: -100,
      },
    },
  },
];

/** The pre-ticket `evaluate` (side to move's view), read on `main` `src/` tree `4cb84035` before this ticket's code. */
// biome-ignore format: frozen data, one row
const G3_PRE: readonly number[] = [0, -66, -18, -18, -66, 0, -8, -10, -12, -12, -20, -38, -33, -50, -41, -4, 3, -10, -12, 0, -8, 41, -37, -37, -29, -66, -37, -41, -33, -49, -49, -43, -59, -47, -53, -47, -27, -59, -71, -73, -390, -31, -7, -39, -37, -102, -53, -17, -1, 9, -45, -57, -432, -52, -155, -45, -37, -44, -51, -55, -153, -134, -126, -129, -45, -1, -33, -17, -99, -58, -30, 24, 26, 28, -10, 14, 18, 18, -109, 30, 18, 34, 18, 38, 17, 110, -118, -129, -150, -150, -140, -114, 110, -168, -120, -108, -112, -158, -154, -144, -122, -119, -164, -177, -165, -192, -135, -502, -86, -106, -110, -114, -122, -116, -126, -118, -154, -154, -138, -154, -92, -108, -114, -114, -118, -112, -110, -225, -92, -78, -94, -92, -1094, -675, -498, -490, -176, 0, 20, 12, 16, 20, 28, 4, 4, 8, 12, 2, 6, -8, -13, 0, 17, 21, -6, -8, 15, 0, 4, 32, 52, 70, 80, 86, -18, -112, 48, -16, 36, 76, -2, -16, -111, 26, -60, 14, 32, 10, -377, 26, -14, -14, 8, 34];
// biome-ignore format: frozen data, one row
const DOOR_PRE: readonly number[] = [-110, -110, -247, -247, 74, 74, -259, -259, -92, -92, -279, -279, -98, -98, -235, -235, -100, -100, -235, -235, -243, -243, -248, -248, -204, -204, 338, 338, -172, -172, 326, 326, -189, -189, -123, -123, -195, -195, -131, -131, -194, -194, -164, -164, -194, -194, -156, -156, -209, -209, 1063, 1063, 89, 89, 0, 0, 0, 0, 196, 196, -22, -22, -97, -97, -10, -10, 24, 24, -12, -12, -97, -97, 22, 22, 66, 66, -10, -10, 45, 45, 70, 70, 105, 105, 25, 25, 12, 12, 25, 25, 12, 12, -200, -200, -223, -223, 100, 100, 0, 0, 98, 98, 0, 0, 76, 76, 0, 0, 75, 75, 0, 0, 116, 116, 93, 93, 88, 88, 78, 78, 142, 142, 133, 133, 123, 123, 118, 118, 178, 178, 169, 169, 151, 151, 127, 127, 234, 234, 227, 227, 197, 197, 182, 182, 320, 320, 295, 295, 257, 257, 232, 232, -100, -100, -98, -98, -76, -76, -75, -75, -178, -178, -169, -169, -151, -151, -127, -127, -320, -320, -295, -295, -257, -257, -232, -232];
const QUEEN_PAIR_PRE: ReadonlyArray<readonly [string, number]> = [
  ["3q2k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1", -143],
  ["6k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1", 816],
  ["3qk3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 w - - 0 1", 0],
  ["4k3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 w - - 0 1", 931],
  ["3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/3Q2K1 b - - 0 1", -143],
  ["3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/6K1 b - - 0 1", 816],
  ["6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1", -34],
  ["6k1/pp1q1p2/4p3/2p3p1/7P/4P3/PP3PP1/2K5 w - - 0 1", -978],
  ["6k1/pp3p2/4p3/2p3p1/7P/4P3/PP2QPP1/2K5 w - - 0 1", 926],
  ["2k5/ppp1q3/3p4/4p3/4P3/2P5/PP1Q2P1/7K w - - 0 1", -60],
  ["2k5/ppp5/3p4/4p3/4P3/2P5/PP1Q2P1/7K w - - 0 1", 880],
  ["1kqq4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1", -2015],
  ["1k6/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1", -131],
  ["1k1q4/p1p5/1p6/8/7P/8/5PK1/8 w - - 0 1", -1095],
  ["3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/3Q2K1 b - - 0 1", -143],
  ["3q2k1/ppp2p2/7p/8/8/6P1/PPP2P1P/6K1 b - - 0 1", 816],
  ["3qk3/ppp1pppp/8/8/8/8/PPP1PPPP/3QK3 b - - 0 1", 0],
  ["3qk3/ppp1pppp/8/8/8/8/PPP1PPPP/4K3 b - - 0 1", 931],
  ["3q2k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1", -143],
  ["6k1/ppp2p1p/6p1/8/8/7P/PPP2P2/3Q2K1 w - - 0 1", 816],
  ["2k5/pp2qpp1/4p3/7p/2P3P1/4P3/PP1Q1P2/6K1 b - - 0 1", -34],
  ["2k5/pp3pp1/4p3/7p/2P3P1/4P3/PP1Q1P2/6K1 b - - 0 1", -978],
  ["2k5/pp2qpp1/4p3/7p/2P3P1/4P3/PP3P2/6K1 b - - 0 1", 926],
  ["7k/pp1q2p1/2p5/4p3/4P3/3P4/PPP1Q3/2K5 b - - 0 1", -60],
  ["7k/pp1q2p1/2p5/4p3/4P3/3P4/PPP5/2K5 b - - 0 1", 880],
  ["8/5pk1/8/7p/8/1P6/P1P5/1KQQ4 b - - 0 1", -2015],
  ["8/5pk1/8/7p/8/1P6/P1P5/1K6 b - - 0 1", -131],
  ["8/5pk1/8/7p/8/1P6/P1P5/1K1Q4 b - - 0 1", -1095],
];

/** White's point of view of a side-to-move score. */
const whitePov = (position: Position, score: number): number =>
  position.blackToMove ? 0 - score : score;

/** The table with the three queen-on pairs replaced. */
const withQueenPairs = (
  shelter: { mg: number; eg: number },
  halfOpen: { mg: number; eg: number },
  open: { mg: number; eg: number },
): EvaluationParameters => ({
  ...PARAMS,
  KING_SHELTER_MISSING_QUEEN: shelter,
  KING_FILE_HALF_OPEN_QUEEN: halfOpen,
  KING_FILE_OPEN_QUEEN: open,
});

const double = (pair: { readonly mg: number; readonly eg: number }) => ({
  mg: 2 * pair.mg,
  eg: 2 * pair.eg,
});

/** K1 (c)'s seam: each queen-on pair at 2 × its base pair (`ADR-0031` A1's × 3 in all). */
const SEAM_2X = withQueenPairs(
  double(PARAMS.KING_SHELTER_MISSING),
  double(PARAMS.KING_FILE_HALF_OPEN),
  double(PARAMS.KING_FILE_OPEN),
);

const SIDES = ["white", "black"] as const;
const other = (side: "white" | "black"): "white" | "black" =>
  side === "white" ? "black" : "white";

/** Every position QE froze, with its expectation: (row, "A" | "B"). */
const POSITIONS = QE_ROWS.flatMap((row) =>
  (["A", "B"] as const).map((at) => ({ row, at, position: parseFen(row[at]) })),
);

describe("ABC-270 — the queen-on pairs are data: three pairs at { 0, 0 } in src/evaluate-params.ts", () => {
  it("each pair is { mg: 0, eg: 0 } (start (prior): 0; the tuner owns the values)", () => {
    expect(PARAMS.KING_SHELTER_MISSING_QUEEN).toEqual({ mg: 0, eg: 0 });
    expect(PARAMS.KING_FILE_HALF_OPEN_QUEEN).toEqual({ mg: 0, eg: 0 });
    expect(PARAMS.KING_FILE_OPEN_QUEEN).toEqual({ mg: 0, eg: 0 });
  });

  it("QE's frozen set: 7 pairs and 1 control; A and B differ only on the removed squares, which hold the subject's enemy queens", () => {
    expect(QE_ROWS.map((row) => row.id)).toEqual([
      "QP1",
      "QP2",
      "QP3",
      "QP4",
      "QP5",
      "QP6",
      "QP7",
      "QC8",
    ]);
    expect(QE_ROWS.filter((row) => row.kind === "pair").length).toBeGreaterThanOrEqual(6);
    for (const row of QE_ROWS) {
      const a = parseFen(row.A);
      const b = parseFen(row.B);
      const removed = new Set(
        row.removed.map((name) => (Number(name[1]) - 1) * 16 + (name.charCodeAt(0) - 97)),
      );
      for (let square = 0; square < 128; square++) {
        if ((square & 0x88) !== 0) continue;
        const pieceA = a.board[square] as number;
        if (removed.has(square)) {
          expect(pieceType(pieceA), `${row.id} ${square}`).toBe(QUEEN);
          // The removed queens are the subject's ENEMY's.
          expect((pieceA & BLACK) !== 0, row.id).toBe(row.subject === "white");
          expect(b.board[square], row.id).toBe(0);
        } else {
          expect(b.board[square], `${row.id} ${square}`).toBe(pieceA);
        }
      }
      expect(b.blackToMove, row.id).toBe(a.blackToMove);
    }
  });
});

describe("ABC-270 K1 (c) — the queen-on structure through the seam, per king (QE-270-a) and through evaluate", () => {
  it("with the pairs at 0, each king's exposure is its base exposure in both halves, queen or no queen", () => {
    for (const { row, at, position } of POSITIONS) {
      const exposure = kingExposureForTest(position);
      for (const side of SIDES) {
        const cp = row.expect[at][side].baseCp;
        expect(exposure[side], `${row.id} ${at} ${side}`).toEqual({ mg: cp, eg: cp });
      }
    }
  });

  it("with the pairs at 2 × base: the subject king's exposure is exactly 3 × its queenless exposure in each half, the other king's is equal, and the control moves nothing", () => {
    withParametersForTest(SEAM_2X, () => {
      for (const row of QE_ROWS) {
        const a = kingExposureForTest(parseFen(row.A));
        const b = kingExposureForTest(parseFen(row.B));
        const subject = row.subject;
        for (const half of ["mg", "eg"] as const) {
          if (row.kind === "pair") {
            expect(a[subject][half], `${row.id} ${half}`).toBe(3 * b[subject][half]);
            expect(b[subject][half], `${row.id} ${half}`).toBeGreaterThan(0);
          } else {
            expect(a[subject][half], `${row.id} ${half}`).toBe(b[subject][half]);
          }
          expect(a[other(subject)][half], `${row.id} ${half}`).toBe(b[other(subject)][half]);
        }
        for (const at of ["A", "B"] as const) {
          const exposure = at === "A" ? a : b;
          for (const side of SIDES) {
            const cp = row.expect[at][side].seam2xCp;
            expect(exposure[side], `${row.id} ${at} ${side}`).toEqual({ mg: cp, eg: cp });
          }
        }
      }
    });
  });

  it("each queen-on pair counts its own feature: the king's file count × the enemy-queen flag, mg and eg apart", () => {
    const unit = { mg: 1, eg: 3 };
    const zero = { mg: 0, eg: 0 };
    const terms = [
      ["sQ", withQueenPairs(unit, zero, zero)],
      ["hQ", withQueenPairs(zero, unit, zero)],
      ["oQ", withQueenPairs(zero, zero, unit)],
    ] as const;
    for (const [count, params] of terms) {
      withParametersForTest(params, () => {
        for (const { row, at, position } of POSITIONS) {
          const exposure = kingExposureForTest(position);
          for (const side of SIDES) {
            const k = row.expect[at][side];
            expect(exposure[side], `${count} ${row.id} ${at} ${side}`).toEqual({
              mg: k.baseCp + k[count],
              eg: k.baseCp + 3 * k[count],
            });
          }
        }
      });
    }
  });

  it("through evaluate: pairs 0 → 2 × base moves white's view by QE's frozen net, in evaluate and evaluateWithoutTaper", () => {
    const before = POSITIONS.map(({ position }) => ({
      tapered: whitePov(position, evaluate(position)),
      flat: whitePov(position, evaluateWithoutTaper(position)),
    }));
    withParametersForTest(SEAM_2X, () => {
      POSITIONS.forEach(({ row, at, position }, i) => {
        const net = row.expect[at].seamNetWpov;
        const was = before[i] as { tapered: number; flat: number };
        expect(whitePov(position, evaluate(position)) - was.tapered, `${row.id} ${at}`).toBe(net);
        expect(
          whitePov(position, evaluateWithoutTaper(position)) - was.flat,
          `${row.id} ${at}`,
        ).toBe(net);
      });
    });
  });

  it("the queen-on endgame halves enter the blend: eg = 24, mg = 0 moves only the phase-0 score, by −24 × (white's queen-on count − black's)", () => {
    const eg = { mg: 0, eg: 24 };
    const zero = { mg: 0, eg: 0 };
    const terms = [
      ["sQ", withQueenPairs(eg, zero, zero)],
      ["hQ", withQueenPairs(zero, eg, zero)],
      ["oQ", withQueenPairs(zero, zero, eg)],
    ] as const;
    const before = POSITIONS.map(({ position }) => ({
      atZero: whitePov(position, evaluateAtPhase(position, 0)),
      flat: whitePov(position, evaluateWithoutTaper(position)),
    }));
    let moved = 0;
    for (const [count, params] of terms) {
      withParametersForTest(params, () => {
        POSITIONS.forEach(({ row, at, position }, i) => {
          const k = row.expect[at];
          const shift = 0 - 24 * (k.white[count] - k.black[count]);
          const was = before[i] as { atZero: number; flat: number };
          const label = `${count} ${row.id} ${at}`;
          expect(whitePov(position, evaluateAtPhase(position, 0)) - was.atZero, label).toBe(shift);
          expect(whitePov(position, evaluateWithoutTaper(position)), label).toBe(was.flat);
          if (shift !== 0) moved++;
        });
      });
    }
    expect(moved).toBeGreaterThan(0);
  });
});

describe("ABC-270 K1 (a) — the mirror stays Object.is-exact with the queen-on pairs live", () => {
  const corpus = [
    ...buildCorpus().map(({ position }) => position),
    ...TAPER_MIRROR_POSITIONS.map(({ fen }) => parseFen(fen)),
    ...POSITIONS.map(({ position }) => position),
  ];

  it("G3 + TAPER_MIRROR_POSITIONS + QE's pairs, at 0 and at 2 × base: 0 mismatches", () => {
    const mismatches = (): string[] =>
      corpus
        .filter((position) => !Object.is(evaluate(mirrorPosition(position)), evaluate(position)))
        .map((position) => toFen(position));
    expect(mismatches()).toEqual([]);
    withParametersForTest(SEAM_2X, () => {
      expect(mismatches()).toEqual([]);
    });
  });
});

describe("ABC-270 K1 (b) — value identity: evaluate is Object.is the pre-ticket evaluate on the frozen corpora", () => {
  it("G3's 184 in buildCorpus order", () => {
    const corpus = buildCorpus();
    expect(corpus).toHaveLength(G3_PRE.length);
    const differ = corpus.filter(({ position }, i) => !Object.is(evaluate(position), G3_PRE[i]));
    expect(differ.map(({ name }) => name)).toEqual([]);
  });

  it("QE's ABC-269 door corpus (176; every taper-corpus position, the KP rows among them, and its mirror)", () => {
    expect(TAPER_DOOR_CORPUS).toHaveLength(DOOR_PRE.length);
    const differ = TAPER_DOOR_CORPUS.filter(
      ({ fen }, i) => !Object.is(evaluate(parseFen(fen)), DOOR_PRE[i]),
    );
    expect(differ.map(({ fen }) => fen)).toEqual([]);
  });

  it("QE's ABC-270 queen pairs and their mirrors", () => {
    expect(QUEEN_PAIR_PRE).toHaveLength(28);
    const differ = QUEEN_PAIR_PRE.filter(
      ([fen, main]) => !Object.is(evaluate(parseFen(fen)), main),
    );
    expect(differ).toEqual([]);
  });
});

describe("ABC-270 — the source row: the queen flags come from the walk's existing non-pawn compare (ADR-0068 d3)", () => {
  /** `src/evaluate.ts` without comments, whitespace flattened. */
  const code = readFileSync(new URL("./evaluate.ts", import.meta.url), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\s+/g, " ");
  const between = (from: string, to: string): string => {
    const start = code.indexOf(from);
    expect(start, from).toBeGreaterThanOrEqual(0);
    return code.slice(start, code.indexOf(to, start));
  };

  it("the walk: one type compare per non-pawn piece (type >= QUEEN), KING and QUEEN told apart inside it; no new per-piece operation", () => {
    const walk = between("function whiteMinusBlack(", "const capMg");
    expect(walk).toContain("if (type >= QUEEN) { if (type === KING) {");
    expect(walk).not.toMatch(/type === QUEEN|type !== QUEEN/);
    expect(walk.match(/pieceType\(/g)?.length).toBe(1);
    expect(walk.match(/squaresReached\(/g)?.length).toBe(1);
  });

  it("each king reads the ENEMY's flag, and kingExposure adds the queen-on terms once, before its file loop", () => {
    const tail = between("const kingSafety", "const structure");
    expect(tail).toContain("kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1, whiteQueen)");
    expect(tail).toContain("kingExposure(board, whiteKing, PAWN, BLACK_PAWN, 1, blackQueen)");
    const exposure = between("function kingExposure(", "return penalty;");
    const flag = exposure.indexOf("if (enemyQueen)");
    const loop = exposure.indexOf("for (let file");
    expect(flag).toBeGreaterThan(0);
    expect(loop).toBeGreaterThan(flag);
    expect(exposure.slice(loop)).not.toContain("enemyQueen");
  });
});
