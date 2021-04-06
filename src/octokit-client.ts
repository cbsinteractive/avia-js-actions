import { getInput, info } from '@actions/core';
import { context, getOctokit } from '@actions/github';

const token = getInput('token') || process.env.TOKEN;
const octokit = getOctokit(token);
const { owner, repo } = context.repo;

export { context } from '@actions/github';

export async function getColumn(column_id: number) {
  const response = await octokit.projects.getColumn({
    column_id,
  });
  return response.data;
}

export async function getIssue(issue_number: number) {
  const response = await octokit.issues.get({
    owner,
    repo,
    issue_number,
  });
  return response.data;
}

export async function removeLabel(issue_number: number, name: string) {
  try {
    return await octokit.issues.removeLabel({
      owner,
      repo,
      issue_number,
      name,
    });
  }
  catch (error) {
    return null;
  }
}

export async function addLabels(issue_number: number, labels: string[]) {
  return await octokit.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels,
  });
}

export async function createCard(column_id: number, content_id: number, content_type = 'Issue') {
  return await octokit.projects.createCard({
    column_id,
    content_id,
    content_type
  });
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

  const edges = columns.flatMap((column: any) => column.cards.edges);
  const edge = edges.find((edge: any) => edge.node?.content?.id === issue.id);

  return edge?.node;
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
  const response = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${ref}`,
  });
  return response.data;
}

export async function moveExistingCard(column_id: number, card_id: number) {
  await octokit.projects.moveCard({
    card_id,
    position: "top",
    column_id
  });

  info(`Successfully moved card #${card_id} to column #${column_id} !`);
}

export async function getColumnByName(columnName: string, project_number: number) {
  const columns = await getProjectColumns(project_number);
  return columns.find((column: any) => column.name === columnName);
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
  return project as Project;
}

export async function getColumnIssueNumbers(column_id: number) {
  const cards = await octokit.projects.listCards({
    column_id,
  });

  return cards;
}

/*
{
  "owner": "cbsinteractive",
  "repo": "github-actions-test",
  "project": 3
}
*/
