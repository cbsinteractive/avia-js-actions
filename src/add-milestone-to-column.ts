
import { info } from '@actions/core';
import { context, getColumnByName, getMilestoneByName, getProjectByName, updateIssue } from './octokit-client';
import { parallel } from './utils';

export default async function addMilestoneToColumn() {
  const { milestone: milestoneName, project: projectName, column: columnName } = context.payload.inputs;

  const milestone = await getMilestoneByName(milestoneName);
  if (!milestone) {
    info(`Could not find milestone ${milestoneName}`);
    return;
  }

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

  const issues = column.cards.map((card: any) => card.content);
  if (!issues?.length) {
    info(`Could not find cards from column ${columnName}`);
    return;
  }

  const details = { milestone: milestone.number };
  await parallel(...issues.map((issue: any) => {
    try {
      updateIssue(issue.number, details);
    }
    catch (error) {
      info(`Could not add milestone to issue ${issue.number}`);
    }
  }));
}
