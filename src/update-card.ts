import { addLabels, context, createBranch, createCard, getBranch, getCard, getColumn, getIssue, removeLabel } from './octokit-client';
import { parallel } from './utils';

export default async function updateCard() {
  const card = context.payload.project_card;
  const issue_number = card.content_url.split('/').pop();
  const issue = await getIssue(issue_number);
  const [from, to] = await parallel(
    getColumn(context.payload.changes.column_id.from),
    getColumn(card.column_id),
  );

  console.log(`Changing label from '${from.name.toLowerCase()}' to '${to.name.toLowerCase()}'`);

  await parallel(
    // Remove previous label
    removeLabel(issue_number, from.name.toLowerCase()),

    // Add the new label
    addLabels(issue_number, [to.name.toLowerCase()]),
  );

  switch (to.name) {
    case 'Ready for QA':
      const card = await getCard(issue_number, to.name);
      const { column_id, id } = card;

      if (id === null) {
        console.log(`No card exists for the labeled Issue in the project. Attempting to create a card in column ${column_id}, for the Issue with the corresponding id #${issue.id}`);
        await createCard(column_id, issue.id);
        console.log(`Successfully created a new card in column #${column_id}, for the Issue with the corresponding id: ${issue.id}`);
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
