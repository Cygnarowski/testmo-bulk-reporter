import { readFile } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import { addComments } from "./services/commentService.js";
import { addSessions } from "./services/sessionService.js";
import { addSessionAndComments } from "./services/commonService.js";

loadEnvFile(".env");

const command = process.argv[2];

const {
  TESTMO_SITE_NAME,
  TESTMO_SESSION_ID,
  TESTMO_REMEMBER_WEB_KEY,
  TESTMO_REMEMBER_WEB_VALUE,
  TESTMO_CSRF_TOKEN,
  TESTMO_SESSION,
  TESTMO_MILESTONE_ID,
  TESTMO_TEMPLATE_ID,
} = process.env;

if (
  !TESTMO_SITE_NAME ||
  !TESTMO_SESSION_ID ||
  !TESTMO_REMEMBER_WEB_KEY ||
  !TESTMO_REMEMBER_WEB_VALUE ||
  !TESTMO_CSRF_TOKEN ||
  !TESTMO_SESSION ||
  !TESTMO_MILESTONE_ID ||
  !TESTMO_TEMPLATE_ID
) {
  throw new Error("Brak wymaganej konfiguracji w .env");
}

switch (command) {
  case "comments": {
    if (!/^\d+$/.test(TESTMO_SESSION_ID)) {
      throw new Error("Niepoprawne ID sesji");
    }
    const comments = JSON.parse(
      await readFile("./src/data/comments.json", "utf8"),
    );
    await addComments(TESTMO_SESSION_ID, comments);
    break;
  }
  case "sessions": {
    const sessions = JSON.parse(
      await readFile("./src/data/sessions.json", "utf8"),
    );
    await addSessions(sessions, TESTMO_MILESTONE_ID, TESTMO_TEMPLATE_ID);
    break;
  }
  case "combo": {
    const sessions = JSON.parse(
      await readFile("./src/data/sessions.json", "utf8"),
    );

    const comments = JSON.parse(
      await readFile("./src/data/comments.json", "utf8"),
    );
    await addSessionAndComments(
      sessions,
      comments,
      TESTMO_MILESTONE_ID,
      TESTMO_TEMPLATE_ID,
    );
    break;
  }
  default:
    console.log(
      `Available commands: 
  comments - Add comments to an existing session
  sessions - Create a sessions from JSON
  combo    - Create a session and comments to that session
  
Usage:
  node src/index.js comments
  node src/index.js sessions
  node src/index.js combo
  `,
    );
}
