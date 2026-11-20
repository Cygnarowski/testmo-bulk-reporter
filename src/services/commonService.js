import { addComments } from "./commentService.js";
import { addSessions } from "./sessionService.js";

export async function addSessionAndComments(
  sessions,
  comments,
  milestoneId,
  testmoTemplateId,
) {
  const sessionCreated = await addSessions(
    sessions,
    milestoneId,
    testmoTemplateId,
  );
  if (!sessionCreated.length) {
    throw new Error("No created sessions found");
  }
  console.log(sessionCreated[0].id);
  const sessionId = sessionCreated[0].id;
  await addComments(sessionId, comments);
}
