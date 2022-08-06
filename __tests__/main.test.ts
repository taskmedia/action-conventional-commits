import {expect, test} from '@jest/globals'

import * as cc from '../src/conventionalcommit'

const types_default = "fix|feat|revert"

test('commit - single', async () => {
  let msg: string = `feat: test commit`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default)

  expect(commit.invalid).toBe(false)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('feat')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('')
  expect(commit.message).toBe('test commit')
  expect(commit.body).toBe('')
  expect(commit.breaking_change).toBe('')
})

test('commit - scope', async () => {
  let msg: string = `feat(cicd): test commit`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default)

  expect(commit.invalid).toBe(false)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('feat')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('cicd')
  expect(commit.message).toBe('test commit')
  expect(commit.body).toBe('')
  expect(commit.breaking_change).toBe('')
})

test('commit - message', async () => {
  let msg: string = `fix(cicd): test commit

some more text`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default)

  expect(commit.invalid).toBe(false)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('fix')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('cicd')
  expect(commit.message).toBe('test commit')
  expect(commit.body).toBe('some more text')
  expect(commit.breaking_change).toBe('')
})

test('commit - breaking', async () => {
  let msg: string = `fix(cicd)!: test commit

some more text

BREAKING CHANGE: API changed`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, types_default)

  expect(commit.invalid).toBe(false)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('fix')
  expect(commit.breaking).toBe(true)
  expect(commit.scope).toBe('cicd')
  expect(commit.message).toBe('test commit')
  expect(commit.body).toBe('some more text')
  expect(commit.breaking_change).toBe('API changed')
})

test('commit - custom type', async () => {
  let msg: string = `chore: test commit`

  let commit: cc.conventionalcommit = cc.checkCommit(msg, "fix|feat|revert|chore")

  expect(commit.invalid).toBe(false)
  expect(commit.full).toBe(msg)
  expect(commit.type).toBe('chore')
  expect(commit.breaking).toBe(false)
  expect(commit.scope).toBe('')
  expect(commit.message).toBe('test commit')
  expect(commit.body).toBe('')
  expect(commit.breaking_change).toBe('')
})
