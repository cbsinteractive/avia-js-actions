
import { context, getCardByIssue, getColumnByName, getProjectByName, moveExistingCard } from './octokit-client';

export default async function moveCardToColumn() {
  const branch = context.payload.pull_request.head.ref;
  const issueNumber = branch.split('/').pop();
  const project = await getProjectByName('Test Sprint Board');
  const card = await getCardByIssue(issueNumber, project.number);
  const toColumn = await getColumnByName('Ready for Review', project.number);

  moveExistingCard(toColumn.column_id, card.id);
}
