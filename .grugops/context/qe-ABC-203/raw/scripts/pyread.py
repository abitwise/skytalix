import sys, chess, chess.pgn, re
GLYPH = {"♚": "K", "♛": "Q", "♜": "R", "♝": "B", "♞": "N", "♟": "P",
         "♔": "k", "♕": "q", "♖": "r", "♗": "b", "♘": "n", "♙": "p"}
for path in sys.argv[1:]:
    with open(path) as f:
        g = chess.pgn.read_game(f)
    board = g.end().board()
    print("==", path.split("/")[-1])
    print(" errors:", len(g.errors), [str(e) for e in g.errors])
    print(" headers:", dict(g.headers))
    print(" plies:", len(list(g.mainline_moves())), "final FEN:", board.fen())
    print(" checkmate:", board.is_checkmate(), "outcome:", board.outcome())
    print(" comment on last node:", repr(g.end().comment))
