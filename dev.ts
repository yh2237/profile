import { readFile } from 'node:fs/promises'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

import 'dotenv/config'

const app = new Hono()

app.use('/*', serveStatic({ root: './' }))

async function prettyError(c: Context, status: 404 | 500) {
    try {
        return c.html(await readFile('./404.html', 'utf8'), status)
    } catch {
        return c.text(status === 404 ? '404 Not Found' : '500 Internal Server Error', status)
    }
}

app.notFound((c) => prettyError(c, 404))

app.onError((err, c) => {
    console.error(err)
    const status = err instanceof HTTPException && err.status === 404 ? 404 : 500
    return prettyError(c, status)
})

app.get('/error/:code', (c) => {
    const num = Number(c.req.param('code'))
    const status = num === 404 ? 404 : 500
    return prettyError(c, status)
})

const port = (() => {
    const n = Number(process.env.PORT)
    return Number.isInteger(n) && n > 0 ? n : 3000
})()

serve({ fetch: app.fetch, port }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`)
    console.log(`Directory: ${process.cwd()}`)
})
