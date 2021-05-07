import { getInput, info } from '@actions/core';
import { context } from './octokit-client';

export default async function moveCardToBoard() {
  const { issue } = context.payload;
  const board = getInput('board');
  const column = getInput('column');

  info(`Moving issue #${issue.number} to column '${column}' of board '${board}'`);
}
