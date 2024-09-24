import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception"

import * as schema from "@/db/schema"
import { Client } from "@neondatabase/serverless";
import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2"

const app = new Hono()
    .get("/", 
    clerkMiddleware(),
    async  c => {
        const auth = getAuth(c)

        if (!auth?.userId) {
            // throw new HTTPException(401, {
            //     res: c.json({
            //         error: "Unauthorized"
            //     }, 401)
            // })
            return c.json({error: "unauthorized"}, 401)
        }
        // const data = await db.select().from(schema.accounts)
        const data = await db
        .select({
            id: schema.accounts.id,
            name: schema.accounts.name,
        }).from(schema.accounts).where(eq(schema.accounts?.userId, auth.userId))

        return c.json({data})
    })
    .post("/",
    clerkMiddleware(),
    zValidator("json", schema.insertAccountSchema.pick({
        name: true,
    })),
    async c => {
        const auth = getAuth(c)
        const values = c.req.valid("json")

        if (!auth?.userId) {
            return c.json({error: "Unauhtorized!"}, 401)
        }

        const [data] = await db.insert(schema.accounts).values({
            id: createId(),
            userId: auth.userId,
            ...values,
        }).returning()

        return c.json({ data })
        }
    )

export default app