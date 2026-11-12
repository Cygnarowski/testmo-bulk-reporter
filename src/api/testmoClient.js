import { loadEnvFile } from "node:process";
loadEnvFile(".env");

const {
  TESTMO_REMEMBER_WEB_KEY,
  TESTMO_REMEMBER_WEB_VALUE,
  TESTMO_SESSION,
  TESTMO_CSRF_TOKEN,
  TESTMO_SITE_NAME,
} = process.env;

export async function testmoPost(path, body) {
  const endpoint = new URL(path, TESTMO_SITE_NAME);

  if (endpoint.protocol !== "https:") {
    throw new Error("Wymagane polaczenie HTTPS");
  }

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

  if (response.status === 419 || response.status === 401) {
    throw new Error("Sesja Testmo wygasla lub jest nieprawidlowa");
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response;
}
