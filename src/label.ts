import {octokit, owner, repo} from './main'

export function addLabels(versionType: string): void {
  octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number: 1,
    labels: [
      {
        name: `${versionType}`
      }
    ]
  })
}
