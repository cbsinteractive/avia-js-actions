import { getInput, info } from '@actions/core';
import { context, getCardByIssue, getColumnByName, getProjectByName, moveExistingCard } from './octokit-client';

export default async function moveCardToColumn() {
  const branch = context.payload.pull_request.head.ref;
  info(`Pull request for branch: ${branch}`);

  if (!/issue\/\d+$/.test(branch)) {
    info(`Ignoring non-issue PR`);
    return;
  }

  const column = getInput('column');
  info(`Move to column ${column}`);

  const issueNumber = branch.split('/').pop();
  info(`Issue number: ${issueNumber}`);

  const project = await getProjectByName('Avia JS Sprint Board');
  const card = await getCardByIssue(issueNumber, project.number);
  const toColumn = await getColumnByName(column, project.number);

  moveExistingCard(toColumn.id, card.id);
}
