NAME="R5R4-status-panel-nfr-extra-squareAt"
CMD="npx vitest run src/status-panel.nfr.test.ts"
EDITS=[("src/status-panel.ts","  const balance = materialBalance(position);\n","  squareAt(0, 0); // PLANT\n  const balance = materialBalance(position);\n")]
