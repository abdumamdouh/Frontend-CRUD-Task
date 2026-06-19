import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(envPath: string) {
  if (!fs.existsSync(envPath)) {
    return {} as Record<string, string>;
  }

  const env: Record<string, string> = {};

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

export function loadDevLiferayCredentials() {
  const env = {
    ...loadEnvFile(path.resolve(currentDir, "../.env")),
    ...loadEnvFile(path.resolve(currentDir, ".env")),
  };

  return {
    password: env.LIFERAY_PASSWORD || process.env.LIFERAY_PASSWORD || "",
    user: env.LIFERAY_USER || process.env.LIFERAY_USER || "",
  };
}
