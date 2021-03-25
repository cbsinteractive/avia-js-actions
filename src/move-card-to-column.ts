
import { context, getCard, getColumnIdByName, moveExistingCard } from './octokit-client';

const projectUrl = 'https://github.com/cbsinteractive/github-actions-test/projects/2';

export default async function moveCardToColumn() {
  console.log(JSON.stringify(context.payload, null, 2));
  const branch = context.payload.pull_request.head.ref;
  const issueNumber = branch.split('/').pop();
  const card = await getCard(issueNumber, 'In Progress', projectUrl);
  const toColumn = await getColumnIdByName('Ready for Review', projectUrl, null);

  moveExistingCard(toColumn.column_id, card.id);
}
