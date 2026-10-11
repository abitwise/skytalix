NAME="R3rd-book-A2-load-salt-OLD-resetModules-form"
REV="ccb8f1bd"
CMD="npx vitest run src/book.test.ts -t 'ABC-094 A2'"
EDITS=[("src/book.ts","const KEY = /^[0-9a-f]{16}$/;\n","const LOAD_SALT = Math.random(); // PLANT: load-time nondeterminism\nconst KEY = /^[0-9a-f]{16}$/;\n"),
("src/book.ts","      let draw = Math.floor(random() * total);","      let draw = Math.floor(((random() + LOAD_SALT) % 1) * total);")]
