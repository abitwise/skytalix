NAME="R4-history-pane-nfr-derives-gameStatusOf"
CMD="npx vitest run src/history-pane.nfr.test.ts"
EDITS=[("src/history-pane.ts",'import type { GameHistory } from "./history.ts";\n','import { type GameHistory, gameStatusOf } from "./history.ts";\n'),
("src/history-pane.ts","export function renderHistory(history: GameHistory): string[] {\n","export function renderHistory(history: GameHistory): string[] {\n  gameStatusOf(history); // PLANT: an expected-0 derive added\n")]
