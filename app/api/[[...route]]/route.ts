import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { handle } from "hono/vercel"
import { z } from "zod"
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

import authors from "./authors"
import categories from "./categories" 
import transactions from "./transactions"
import books from "./books"
import accounts from "./accounts"
// import { HTTPException } from "hono/http-exception"

export const runtime = 'edge'

const app = new Hono().basePath('/api')

// app.onError((err, c) => {
//     if (err instanceof HTTPException) {
//         return err.getResponse()
//     }

//     return c.json({error: "Internal Error"})
// })

const routes = app
    .route("/accounts", accounts)
    .route("/categories", categories)
    .route("/transactions", transactions)
    .route("/authors", authors)
    .route("/books", books)

app
    .get('/hello', 
    clerkMiddleware(),
    (c) => {
        const auth = getAuth(c)

        if (!auth?.userId) {
            return c.json({ error: 'Unauthorized'})
        }

        return c.json({
            message: 'Hello Next.js!',
            userId: auth.userId
        })
    })
    .get("/hello/:test",
    zValidator("param", z.object({
        test: z.number(),
    })),
    (c) => {
        const {test} = c.req.valid("param")
        return c.json({
            message: "Hello World!",
            test: test
        })
    })
    .post(
        "/create/:postId",
        zValidator("json", z.object({
            name: z.string(),
            userId: z.number(),
        })),
        zValidator("param", z.object({
            postId: z.number(),
        })),
        c => {
            const { name, userId } = c.req.valid("json")
            const { postId } = c.req.valid("param")

            return c.json({})
        }
    )

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes