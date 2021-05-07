import { getInput, info } from '@actions/core';
import { context, getCardByIssue, getColumnByName, getProjectByName } from './octokit-client';

export default async function moveCardToBoard() {
  const { issue } = context.payload;
  const projectName = getInput('project');
  const columnName = getInput('column');

  info(`Moving issue #${issue.number} to column '${columnName}' of project '${projectName}'`);
  info(JSON.stringify(issue));

  const project = await getProjectByName(projectName);
  if (!project) {
    info(`Could not find project ${project}`);
    return;
  }

  let card = getCardByIssue(issue.number, project.number);
  if (card) {
    info('  Card already exists');
    return;
  }

  const column = await getColumnByName(columnName, project.number);
  if (!column) {
    info(`Could not find column ${columnName}`);
    return;
  }

  //card = await createCard(column.id, issue.id);
}
