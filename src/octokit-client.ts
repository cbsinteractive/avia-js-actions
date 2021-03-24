import * as core from '@actions/core';
import * as github from '@actions/github';

const token = core.getInput('token') || process.env.TOKEN;
const octokit = github.getOctokit(token);

export const context = github.context;
const { owner, repo } = context.repo;

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

async function tryGetColumnAndCardInformation(columnName: string, projectUrl: string, issueOrPrDatabaseId: number) {
  // if org project, we need to extract the org name
  // if repo project, need repo owner and name
  let column_id: number = null;
  let id: number = null;
  const project = parseInt(projectUrl.split('/').pop(), 10);

  console.log(`This project is configured at the repo level. Repo Owner: ${owner}, repo name: ${repo}, project number #${project}`);

  const repoColumnInfo: any = await getRepoInformation(owner, repo, project);
  repoColumnInfo.repository.project.columns.nodes.forEach((columnNode: any) => {
    const { name, databaseId, cards } = columnNode;
    if (name == columnName) {
      column_id = databaseId;
    }

    // check each column if there is a card that exists for the issue
    cards.edges.forEach((card: any) => {
      const { node } = card;

      // card level
      if (node.content != null) {
        // only issues and pull requests have content
        if (node.content.databaseId == issueOrPrDatabaseId) {
          id = node.databaseId;
        }
      }
    });
  });

  return { id, column_id };
}


async function getRepoInformation(owner: string, repo: string, project: number) {
  // GraphQL query to get all of the columns in a project that is setup at that org level
  // https://developer.github.com/v4/explorer/ is good to play around with
  const response = await octokit.graphql(
    `query ($owner: String!, $repo: String!, $project: Int!) {
      repository(owner: $owner, name: $repo) {
        project(number: $project) {
          id
          number
          databaseId
          name
          url
          columns(first: 100) {
            nodes {
              databaseId
              name
              cards {
                edges {
                  node {
                    databaseId
                    content {
                      ... on Issue {
                        databaseId
                        number
                      }
                      ... on PullRequest {
                        databaseId
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
  return response;
}

export async function getCard(issue_number: number, columnName: string, projectUrl: string) {
  const issue = await getIssue(issue_number);
  return await tryGetColumnAndCardInformation(columnName, projectUrl, issue.id);
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
  return `Succesfully moved card #${card_id} to column #${column_id} !`;
}


export async function getColumnIdByName(columnName: string, projectUrl: string, id: number) {
  return await tryGetColumnAndCardInformation(columnName, projectUrl, id);
}
