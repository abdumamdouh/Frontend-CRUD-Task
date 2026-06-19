import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const viteBin = join(dirname(require.resolve("vite/package.json")), "bin/vite.js");
const result = spawnSync(process.execPath, [viteBin, "build"], {
	stdio: "inherit",
});

process.exit(result.status ?? 1);
