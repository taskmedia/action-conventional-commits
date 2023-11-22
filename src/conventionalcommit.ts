import {escapeRegExp} from 'lodash'

export class conventionalcommit {
  invalid: boolean

  full: string

  type: string
  breaking: boolean
  scope: string
  message: string
  body: string
  breaking_change: string

  constructor() {
    this.invalid = false
    this.full = ''
    this.type = ''
    this.breaking = false
    this.scope = ''
    this.message = ''
    this.body = ''
    this.breaking_change = ''
  }

  getShortMessage(): string {
    let msg = ''

    msg += this.type
    if (this.scope !== '') {
      msg += `(${this.scope})`
    }
    if (this.breaking) {
      msg += '!'
    }
    msg += ': '
    msg += this.message

    return msg
  }
}

const regex_conventionalcommit_breaking_change = new RegExp(
  `(?<body>[\\s\\S]*)?BREAKING CHANGE: (?<breakingchange>[\\s\\S]*)`
)

export function checkCommit(
  commit_msg: string,
  types: string
): conventionalcommit {
  // escape regex for input types, except for the pipe character
  const safeTypes = escapeRegExp(types).replace(/\\\|/g, '|')

  const regex_conventionalcommit = new RegExp(
    `^(?:(?<type>(${safeTypes}))(?:\\((?<scope>.*)\\))?(?<breaking>!?): (?<message>.*)?)` +
      `\\n?` +
      `(?<body>[\\S\\s]+)?$`
  )

  const c = new conventionalcommit()

  c.full = commit_msg

  const result = regex_conventionalcommit.exec(commit_msg)

  if (result == null) {
    c.invalid = true
    return c
  }

  if (result?.groups?.type !== undefined) {
    c.type = String(result?.groups?.type).trim()
  }

  if (result?.groups?.breaking !== '') {
    c.breaking = true
  }

  if (result?.groups?.scope !== undefined) {
    c.scope = String(result?.groups?.scope).trim()
  }

  if (result?.groups?.message !== undefined) {
    c.message = String(result?.groups?.message).trim()
  }

  if (result?.groups?.body !== undefined) {
    c.body = String(result?.groups?.body).trim()
  }

  if (c.body.includes('BREAKING CHANGE:')) {
    c.breaking = true

    const result_breaking_change =
      regex_conventionalcommit_breaking_change.exec(c.body)
    c.body = String(result_breaking_change?.groups?.body).trim()
    c.breaking_change = String(
      result_breaking_change?.groups?.breakingchange
    ).trim()
  }

  return c
}
