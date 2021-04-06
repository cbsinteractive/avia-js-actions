import { info } from '@actions/core';
import { addLabels, context, createBranch, createCard, getBranch, getCardByIssue, getColumn, getColumnByName, getIssue, getProjectByName, removeLabel } from './octokit-client';
import { parallel } from './utils';

export default async function updateCard() {
  if (!context.payload.changes) {
    info('No changes detected');
    return;
  }

  const card = context.payload.project_card;
  const issue_number = card.content_url.split('/').pop();
  const issue = await getIssue(issue_number);
  const [from, to] = await parallel(
    getColumn(context.payload.changes.column_id.from),
    getColumn(card.column_id),
  );

  info(`Changing label from '${from.name.toLowerCase()}' to '${to.name.toLowerCase()}'`);

  await parallel(
    // Remove previous label
    removeLabel(issue_number, from.name.toLowerCase()),

    // Add the new label
    addLabels(issue_number, [to.name.toLowerCase()]),
  );

  switch (to.name) {
    case 'Ready for QA':
      const project = await getProjectByName('Avia JS QA Board');
      const card = await getCardByIssue(issue_number, project.number);

      if (!card) {
        const column = await getColumnByName('Ready for Review', project.number);
        info(`No card exists for the labeled Issue in the project. Attempting to create a card in column ${column.id}, for the Issue with the corresponding id #${issue.id}`);
        await createCard(column.id, issue.id);
        info(`Successfully created a new card in column #${column.id}, for the Issue with the corresponding id: ${issue.id}`);
      }
      break;

    case 'In Progress':
      const milestone = issue.milestone.title;
      const release = await getBranch(`release/${milestone}`);

      try {
        await createBranch(`issue/${issue_number}`, release.object.sha);
      }
      catch (e) { }
      break;
  }
}
