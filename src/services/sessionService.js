import { testmoPost } from "../api/testmoClient.js";

export async function addSessions(
  sessionId,
  sessions,
  milestoneId,
  testmoTemplateId,
) {
  const createEndpointId = 1;
  const path = `/sessions/create/${encodeURIComponent(createEndpointId)}`;
  let success = 0;
  let failed = 0;

  for (const [index, item] of sessions.entries()) {
    const body = {
      assignee_id: null,
      attachments: [],
      config_id: null,
      custom_mission: null,
      estimate: "",
      issues: [],
      milestone_id: Number(milestoneId),
      name: item.name,
      state_id: 11,
      tags: [],
      template_id: Number(testmoTemplateId),
    };

    try {
      const response = await testmoPost(path, body);
      console.log("Zadanie zakonczone:", response.status);
      success++;
      console.log(`[${index + 1}/${sessions.length}] OK: ${item.name}`);
    } catch (error) {
      failed++;
      console.error(
        `[${index + 1}/${sessions.length}] ERROR: ${error.message}`,
      );
    }
  }
  console.log("\nImport zakonczony");
  console.log(`OK: ${success}`);
  console.log(`ERROR: ${failed}`);
  if (failed > 0) process.exitCode = 1;
}
