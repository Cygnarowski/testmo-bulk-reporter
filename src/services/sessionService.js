import { testmoPost } from "../api/testmoClient.js";
import { writeFile } from "node:fs/promises";

export async function addSessions(sessions, milestoneId, testmoTemplateId) {
  const createEndpointId = 1;
  const path = `/sessions/create/${encodeURIComponent(createEndpointId)}`;
  const createdSessions = [];
  let success = 0;
  let failed = 0;

  for (const [index, session] of sessions.entries()) {
    const body = {
      assignee_id: null,
      attachments: [],
      config_id: null,
      custom_mission: null,
      estimate: "",
      issues: [],
      milestone_id: Number(milestoneId),
      name: session.name,
      state_id: 11,
      tags: [],
      template_id: Number(testmoTemplateId),
    };

    try {
      const response = await testmoPost(path, body);
      console.log("Zadanie zakonczone:", response.status);
      const result = await response.json();
      createdSessions.push({
        id: result.id,
        name: result.name,
      });
      await writeFile(
        "./src/data/created-sessions.json",
        JSON.stringify(createdSessions, null, 2),
        "utf-8",
      );
      console.log("Zapisano do pliku: created-sessions.json");
      success++;
      console.log(`[${index + 1}/${sessions.length}] OK: ${session.name}`);
    } catch (error) {
      failed++;
      console.error(
        `[${index + 1}/${sessions.length}] ERROR: ${error.message}`,
      );
    }
  }

  for (const createdSession of createdSessions) {
    console.log("Import zakonczony. Wygenerowano sesje nr:", createdSession.id);
  }
  console.log(`OK: ${success}`);
  console.log(`ERROR: ${failed}`);
  if (failed > 0) process.exitCode = 1;
  return createdSessions;
}
