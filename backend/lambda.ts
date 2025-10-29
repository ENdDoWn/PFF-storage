import { Elysia } from 'elysia'
import serverless from 'serverless-http'

import { app as mainApp } from './src/app'

const app = new Elysia()
    .use(mainApp)

export const handler = serverless(app.fetch)
