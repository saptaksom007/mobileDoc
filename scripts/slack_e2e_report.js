#!/usr/bin/env node

const axios = require('axios')
const { IncomingWebhook } = require('@slack/webhook')
const {
  CIRCLE_BUILD_NUM,
  CIRCLE_TOKEN,
  SLACK_WEBHOOK_URL,
  CIRCLE_BUILD_URL,
} = process.env
const endpoint =
  'https://circleci.com/api/v1.1/project/gh/e-medicus/mobile-docdok'

const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL, {
  icon_emoji: ':iphone:',
})

const getArtifactsAsync = () =>
  axios(
    `${endpoint}/${CIRCLE_BUILD_NUM}/artifacts?circle-token=${CIRCLE_TOKEN}`,
  )

;(async function main() {
  try {
    const { data: artifacts } = await getArtifactsAsync()
    if (!!artifacts && typeof artifacts === 'object' && artifacts.length) {
      const attachments = artifacts
        .map(({ url, pretty_path }) => ({
          image_url: url,
          footer: pretty_path
            .replace('Users/distiller/project/e2e/screenshots/', '')
            .replace('/beforeEach', ' \n1. Before')
            .replace('/afterEach', ' \n2. After'),
        }))
        .sort((a, b) => ('' + a.footer).localeCompare(b.footer))
        .filter(({ image_url }) => image_url.endsWith('png'))
        .map(({ image_url, footer }) => ({
          image_url: `${image_url}?circle-token=${CIRCLE_TOKEN}`,
          footer,
          color: 'good',
        }))

      const result = await webhook.send({
        text: `*End to End Tests Results*`,
        channel: 'e2e',
        username: 'bot',
        attachments: [
          {
            color: 'good',
            pretext: 'e2e screenshot',
            title: 'Build details',
            title_link: CIRCLE_BUILD_URL,
            ts: new Date().getTime() / 1000,
          },
          ...attachments,
        ],
      })
      console.log({ result })
    }
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
