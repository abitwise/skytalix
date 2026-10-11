NAME="R1-render-seam-renderBoard-twice"
CMD="npx vitest run src/render-seam.test.ts"
EDITS=[("src/render-seam.ts","        board: renderBoard(history.position, mode, orientation),","        board: (renderBoard(history.position, mode, orientation), renderBoard(history.position, mode, orientation)), // PLANT")]
