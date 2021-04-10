
import { info } from '@actions/core';
import { context, getCardByIssue, getColumnByName, getProjectByName, moveExistingCard } from './octokit-client';

export default async function moveCardToColumn() {
  const branch = context.payload.pull_request.head.ref;
  info(`Pull request for branch: ${branch}`);

  const issueNumber = branch.split('/').pop();
  info(`Issue number: ${issueNumber}`);

  const project = await getProjectByName('Avia JS Sprint Board');
  info(`Project: ${JSON.stringify(project, null, 2)}`);

  const card = await getCardByIssue(issueNumber, project.number);
  info(`Card: ${JSON.stringify(card, null, 2)}`);

  if (!card) {
    return;
  }

  const toColumn = await getColumnByName('Ready for Review', project.number);
  info(`To Column: ${JSON.stringify(toColumn, null, 2)}`);

  moveExistingCard(toColumn.id, card.id);
}
