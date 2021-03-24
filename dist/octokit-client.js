"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBranch = exports.createBranch = exports.getCard = exports.createCard = exports.addLabels = exports.removeLabel = exports.getIssue = exports.getColumn = exports.context = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const token = core.getInput('token') || process.env.TOKEN;
const octokit = github.getOctokit(token);
exports.context = github.context;
const { owner, repo } = exports.context.repo;
function getColumn(column_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield octokit.projects.getColumn({
            column_id,
        });
        return response.data;
    });
}
exports.getColumn = getColumn;
function getIssue(issue_number) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield octokit.issues.get({
            owner,
            repo,
            issue_number,
        });
        return response.data;
    });
}
exports.getIssue = getIssue;
function removeLabel(issue_number, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield octokit.issues.removeLabel({
                owner,
                repo,
                issue_number,
                name,
            });
        }
        catch (error) {
            return null;
        }
    });
}
exports.removeLabel = removeLabel;
function addLabels(issue_number, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield octokit.issues.addLabels({
            owner,
            repo,
            issue_number,
            labels,
        });
    });
}
exports.addLabels = addLabels;
function createCard(column_id, content_id, content_type = 'Issue') {
    return __awaiter(this, void 0, void 0, function* () {
        return yield octokit.projects.createCard({
            column_id,
            content_id,
            content_type
        });
    });
}
exports.createCard = createCard;
function tryGetColumnAndCardInformation(columnName, projectUrl, issueOrPrDatabaseId) {
    return __awaiter(this, void 0, void 0, function* () {
        let column_id = null;
        let id = null;
        const project = parseInt(projectUrl.split('/').pop(), 10);
        console.log(`This project is configured at the repo level. Repo Owner: ${owner}, repo name: ${repo}, project number #${project}`);
        const repoColumnInfo = yield getRepoInformation(owner, repo, project);
        repoColumnInfo.repository.project.columns.nodes.forEach((columnNode) => {
            const { name, databaseId, cards } = columnNode;
            if (name == columnName) {
                column_id = databaseId;
            }
            cards.edges.forEach((card) => {
                const { node } = card;
                if (node.content != null) {
                    if (node.content.databaseId == issueOrPrDatabaseId) {
                        id = node.databaseId;
                    }
                }
            });
        });
        return { id, column_id };
    });
}
function getRepoInformation(owner, repo, project) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield octokit.graphql(`query ($owner: String!, $repo: String!, $project: Int!) {
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
    });
}
function getCard(issue_number, columnName) {
    return __awaiter(this, void 0, void 0, function* () {
        const issue = yield getIssue(issue_number);
        const projectUrl = 'https://github.com/cbsinteractive/github-actions-test/projects/3';
        return yield tryGetColumnAndCardInformation(columnName, projectUrl, issue.id);
    });
}
exports.getCard = getCard;
function createBranch(ref, sha) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('SHA ', sha);
        return yield octokit.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${ref}`,
            sha,
        });
    });
}
exports.createBranch = createBranch;
function getBranch(ref) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield octokit.git.getRef({
            owner,
            repo,
            ref: `heads/${ref}`,
        });
        return response.data;
    });
}
exports.getBranch = getBranch;
