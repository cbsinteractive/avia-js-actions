import { getInput, info } from '@actions/core';
import { context, createCard, getCardByIssue, getColumnByName, getProjectByName } from './octokit-client';

export default async function moveCardToProject() {
  const { issue } = context.payload;
  const projectName = getInput('project');
  const columnName = getInput('column');

  info(`Moving issue #${issue.number} to column '${columnName}' of project '${projectName}'`);

  const project = await getProjectByName(projectName);
  if (!project) {
    info(`Could not find project ${project}`);
    return;
  }

  const column = await getColumnByName(columnName, project.number);
  if (!column) {
    info(`Could not find column ${columnName}`);
    return;
  }

  const card = await getCardByIssue(issue.number, project.number);
  if (card) {
    info('  Card already exists');
    // remove from the previous?
    return;
  }

  await createCard(column.id, issue.id);
}
