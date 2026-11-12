import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { addComments } from "./services/commentService.js";
loadEnvFile(".env");

const command = process.argv[2];

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

switch (command) {
  case "comments": {
    const comments = JSON.parse(
      await readFile("./src/data/comments.json", "utf8"),
    );
    await addComments(TESTMO_SESSION_ID, comments);
    break;
  }
  case "sessions": {
    console.log("TODO: Obsluga sesji do implementacji");
    break;
  }
  default:
    console.log("Dostepne komendy: comments");
}
