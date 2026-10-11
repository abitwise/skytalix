NAME="R5R4-status-panel-nfr-extra-isInCheck"
CMD="npx vitest run src/status-panel.nfr.test.ts"
EDITS=[("src/status-panel.ts",'  const check = isInCheck(position) ? "CHECK" : "";\n','  isInCheck(position); // PLANT\n  const check = isInCheck(position) ? "CHECK" : "";\n')]
