import * as github from '@actions/github'
import * as core from '@actions/core'
import * as cc from './conventionalcommit'

async function run(): Promise<void> {
  try {
    const gh_token = core.getInput('token')
    const octokit = github.getOctokit(gh_token)

    // replace semicolon with vertical bar to fit regex syntax
    // not directly used because README markdown table would break
    const types = core.getInput('types').replace(/;/g, '|')

    const skipMerge = /true/i.test(core.getInput('skip_merge'))
    const skipRevert = /true/i.test(core.getInput('skip_revert'))

    const {data: commit_list} = await octokit.rest.pulls.listCommits({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.issue.number
    })

    let hasInvalidCommits = false
    let versionType = 'patch'
    let hasBreakingCommit = false
    let breaking_msg = ''

    const commits: cc.conventionalcommit[] = []

    for (const c of commit_list) {
      // check if merge commit should be skipped
      if (c.commit.message.startsWith('Merge ') && skipMerge) {
        const commit = new cc.conventionalcommit()
        commit.full = c.commit.message
        commit.type = `merge`
        commits.push(commit)
        core.info(`🔇 skip merge: ${c.commit.message}`)
        continue
      }

      // check if revert commit should be skipped
      if (c.commit.message.startsWith('Revert ') && skipRevert) {
        const commit = new cc.conventionalcommit()
        commit.full = c.commit.message
        commit.type = `revert`
        commits.push(commit)
        core.info(`🔇 skip revert: ${c.commit.message}`)
        continue
      }

      const commit = cc.checkCommit(c.commit.message, types)

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

run()
