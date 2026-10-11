NAME="R1-render-seam-derives-legalMoves"
CMD="npx vitest run src/render-seam.test.ts"
EDITS=[("src/render-seam.ts",'import { renderHistory } from "./history-pane.ts";\n','import { renderHistory } from "./history-pane.ts";\nimport { legalMoves } from "./legal.ts";\n'),
("src/render-seam.ts","  return (history, status, thinking, messages) =>\n    assembleFrame(","  return (history, status, thinking, messages) =>\n    (legalMoves(history.position), assembleFrame)( // PLANT")]
