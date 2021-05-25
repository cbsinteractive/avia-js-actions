import { error, getInput, info } from '@actions/core';
import { context, getOctokit } from '@actions/github';

const token = getInput('token') || process.env.TOKEN;
const octokit = getOctokit(token);
const { owner, repo } = context.repo;
const reportError = (message: string, e: any) => {
  error(message);
  error(e);
  return e;
};

export { context } from '@actions/github';

export async function getColumn(column_id: number) {
  try {
    const response = await octokit.projects.getColumn({
      column_id,
    });
    return response.data;
  }
  catch (error) {
    throw reportError(`Error retrieving column #${column_id}`, error);
  }
}

export async function getIssue(issue_number: number) {
  try {
    const response = await octokit.issues.get({
      owner,
      repo,
      issue_number,
    });
    return response.data;
  }
  catch (error) {
    throw reportError(`Error retrieving issue #${issue_number}`, error);
  }
}

export async function createCard(column_id: number, content_id: number, content_type = 'Issue') {
  try {
    return await octokit.projects.createCard({
      column_id,
      content_id,
      content_type,
    });
  }
  catch (error) {
    throw reportError(`Could not create card`, error);
  }
}

async function getProjectColumns(project: number) {
  // https://developer.github.com/v4/explorer/ is good to play around with
  const response: any = await octokit.graphql(
    `query ($owner: String!, $repo: String!, $project: Int!) {
      repository(owner: $owner, name: $repo) {
        project(number: $project) {
          number
          id: databaseId
          name
          url
          columns(first: 100) {
            nodes {
              id: databaseId
              name
              cards {
                edges {
                  node {
                    id: databaseId
                    content {
                      ... on Issue {
                        id: databaseId
                        number
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`, {
    owner,
    repo,
    project,
    headers: {
      authorization: `bearer ${token}`
    }
  });

  const columns = response.repository.project.columns.nodes;
  return columns.map((column: any) => ({
    ...column,
    cards: column.cards.edges.map((edge: any) => edge.node),
  }));
}

export async function getCardByIssue(issue_number: number, project_number: number) {
  const issue = await getIssue(issue_number);
  const columns = await getProjectColumns(project_number);
  const cards = columns.flatMap((column: any) => column.cards);
  const card = cards.find((card: any) => card.content?.id === issue.id);

  info(`Card: ${card?.content?.number}`);
  return card;
}

export async function createBranch(ref: string, sha: string) {
  console.log('SHA ', sha);

  return await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${ref}`,
    sha,
  });
}

export async function getBranch(ref: string) {
  try {
    const response = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${ref}`,
    });
    return response.data;
  }
  catch (error) {
    throw reportError(`Error retrieving branch ${ref}`, error);
  }
}

export async function moveExistingCard(column_id: number, card_id: number) {
  try {
    await octokit.projects.moveCard({
      card_id,
      position: "top",
      column_id
    });
  }
  catch (error) {
    throw reportError(`Could not move card #${card_id} to column #${column_id}`, error);
  }

  info(`Moved card #${card_id} to column #${column_id}`);
}

export async function getColumnByName(columnName: string, project_number: number) {
  const columns = await getProjectColumns(project_number);
  const column = columns.find((column: any) => column.name === columnName);
  info(`Column: ${column?.name}`);
  return column;
}

export interface Project {
  number: number;
  databaseId: number;
  name: string;
  url: string;
};

export async function getProjects() {
  const response: any = await octokit.graphql(
    `query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
            projects(first: 10) {
              nodes {
                number
                databaseId
                name
                url
              }
            }
        }
    }`, {
    owner,
    repo,
    headers: {
      authorization: `bearer ${token}`
    }
  });

  return response.repository.projects.nodes as Project[];
}

export async function getProjectByName(name: string) {
  const projects = await getProjects();
  const project = projects.find((project: any) => project.name === name);

  info(`Project: ${project.name}`);
  return project as Project;
}

export async function getColumnIssueNumbers(column_id: number) {
  const cards = await octokit.projects.listCards({
    column_id,
  });

  return cards;
}

export async function updateIssue(issue_number: number, details: any) {
  const response = await octokit.issues.update({
    owner,
    repo,
    issue_number,
    ...details
  });

  return response.data;
}

export async function getMilestoneByName(milestoneName: string) {
  const response = await octokit.issues.listMilestones({
    owner,
    repo,
  });

  const milestones = response.data;
  return milestones.find((milestone: any) => milestone.title == milestoneName);
}

/*
{
  "owner": "cbsinteractive",
  "repo": "github-actions-test",
  "project": 3
}
*/
