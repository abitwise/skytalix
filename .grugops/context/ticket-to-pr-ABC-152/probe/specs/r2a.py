NAME="R2a-book-delete-mockImplementation"
CMD="npx vitest run tools/opening-book/book.test.ts"
EDITS=[("tools/opening-book/book.test.ts","    vi.mocked(zobristKey).mockImplementation(() => 0n);\n","")]
