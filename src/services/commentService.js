import { testmoPost } from "../api/testmoClient.js";

export async function addComments(sessionId, comments) {
  const path = `/sessions/create_result/${encodeURIComponent(sessionId)}`;
  let success = 0;
  let failed = 0;

  for (const [index, item] of comments.entries()) {
    const body = {
      comment: item.comment,
      status_id: null,
      elapsed: "",
      attachments: [],
      issue: [],
    };

    try {
      const response = await testmoPost(path, body);
      console.log("Zadanie zakonczone:", response.status);
      success++;
      console.log(`[${index + 1}/${comments.length}] OK: ${item.comment}`);
    } catch (error) {
      failed++;
      console.error(
        `[${index + 1}/${comments.length}] ERROR: ${error.message}`,
      );
    }
  }
  console.log("\nImport zakonczony");
  console.log(`OK: ${success}`);
  console.log(`ERROR: ${failed}`);

  if (failed > 0) process.exitCode = 1;
}
