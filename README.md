# eptix-git

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts <destination-path>
```

Example:

```bash
bun run index.ts ~/Web/eptix
```

Clones all `eptix-*` repos from the `axso-ev` GitHub org into the specified destination directory. Skips repos already cloned.

This project was created using `bun init` in bun v1.3.3. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
