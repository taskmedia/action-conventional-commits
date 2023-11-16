import * as github from '@actions/github'
import * as core from '@actions/core'
import * as cc from './conventionalcommit'

async function run(): Promise<void> {
  try {
    core.info(`starting Action conventional-commits`)

    // replace semicolon with vertical bar to fit regex syntax
    // not directly used because README markdown table would break
    const types = core.getInput('types');
    const scopes = core.getInput('types');

    const skipMerge = /true/i.test(core.getInput('skip_merge'))
    const skipRevert = /true/i.test(core.getInput('skip_revert'))

    const commit_list = await receiveCommits()

    let hasInvalidCommits = false
    let versionType = 'patch'
    let hasBreakingCommit = false
    let breaking_msg = ''

    const commits: cc.conventionalcommit[] = []

    for (const c_msg of commit_list) {
      const commit_msg = String(c_msg)

      // check if merge commit should be skipped
      if (commit_msg.startsWith('Merge ') && skipMerge) {
        const commit = new cc.conventionalcommit()
        commit.full = commit_msg
        commit.type = `merge`
        commits.push(commit)
        core.info(`🔇 skip merge: ${commit_msg}`)
        continue
      }

      // check if revert commit should be skipped
      if (commit_msg.startsWith('Revert ') && skipRevert) {
        const commit = new cc.conventionalcommit()
        commit.full = commit_msg
        commit.type = `revert`
        commits.push(commit)
        core.info(`🔇 skip revert: ${commit_msg}`)
        continue
      }

      const commit = cc.checkCommit(commit_msg, types, scopes)

      if (commit.invalid) {
        hasInvalidCommits = true
        core.info(`❌ ${commit.full}`)
      } else {
        core.info(`✅ ${commit.getShortMessage()}`)
      }

      if (commit.breaking) {
        hasBreakingCommit = true
        versionType = 'major'
        breaking_msg = commit.breaking_change
      }

      if (commit.type === 'feat' && versionType !== 'major') {
        versionType = 'minor'
      }

      commits.push(commit)
    }

    core.setOutput('breaking_commit', hasBreakingCommit)
    core.setOutput('breaking_msg', breaking_msg)
    core.setOutput('commits', JSON.stringify(commits))
    core.setOutput('count_commits', commits.length)
    core.setOutput('invalid_commits', hasInvalidCommits)
    core.setOutput('version_type', versionType)

    if (hasInvalidCommits) {
      core.setFailed('at least one commit is invalid')
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function receiveCommits(): Promise<String[]> {
  const commits: String[] = []

  const gh_token = core.getInput('token')
  const octokit = github.getOctokit(gh_token)

  // Extract commits from push event
  if (github.context.payload.commits != null) {
    core.debug('Extracting commits from push event')
    for (const c of github.context.payload.commits) {
      commits.push(c.message)
    }
    return commits
  }

  // Extract commits from pull request
  core.debug('Extracting commits from pull request')
  const {data: commit_list} = await octokit.rest.pulls.listCommits({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.issue.number
  })

  for (const c of commit_list) {
    commits.push(c.commit.message)
  }

  return commits
}

run()
