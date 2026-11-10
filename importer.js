import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
loadEnvFile(".env");

const {
  TESTMO_SITE_NAME,
  TESTMO_SESSION_ID,
  TESTMO_REMEMBER_WEB_KEY,
  TESTMO_REMEMBER_WEB_VALUE,
  TESTMO_CSRF_TOKEN,
  TESTMO_SESSION,
} = process.env;

if (
  !TESTMO_SITE_NAME ||
  !TESTMO_SESSION_ID ||
  !TESTMO_REMEMBER_WEB_KEY ||
  !TESTMO_REMEMBER_WEB_VALUE ||
  !TESTMO_CSRF_TOKEN ||
  !TESTMO_SESSION
) {
  throw new Error("Brak wymaganej konfiguracji w .env");
}

if (!/^\d+$/.test(TESTMO_SESSION_ID)) {
  throw new Error("Niepoprawne ID sesji");
}

const comments = JSON.parse(await readFile("./comments.json", "utf8"));

const endpoint = new URL(
  `${TESTMO_SITE_NAME}/sessions/create_result/${encodeURIComponent(TESTMO_SESSION_ID)}`,
);

if (endpoint.protocol != "https:") {
  throw new Error("Wymagane polaczenie HTTPS");
}

let success = 0;
let failed = 0;

for (const [index, item] of comments.entries()) {
  const body = {
    comment: item.comment,
    status_id: 4,
    elapsed: "",
    attachments: [],
    issue: [],
  };
  console.log(body);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Cookie: `${TESTMO_REMEMBER_WEB_KEY}=${TESTMO_REMEMBER_WEB_VALUE}; testmo_session=${TESTMO_SESSION}`,
        "X-CSRF-Token": TESTMO_CSRF_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      redirect: "manual",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    console.log("Zadanie zakonczone:", response.status);
    success++;
    console.log(`[${index + 1}/${comments.length}] OK: ${item.comment}`);
  } catch (error) {
    failed++;
    console.error(`[${index + 1}/${comments.length}] ERROR: ${error.message}`);
  }
}

console.log("\nImport zakonczony");
console.log(`OK: ${success}`);
console.log(`ERROR: ${failed}`);

if (failed > 0) process.exitCode = 1;
