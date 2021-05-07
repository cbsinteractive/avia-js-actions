import { getInput, info } from '@actions/core';
import { context } from './octokit-client';

export default async function moveCardToBoard() {
  const { issue } = context.payload;
  const board = getInput('board');

  info(`Moving to issue ${issue.number} board ${board}`);
}
