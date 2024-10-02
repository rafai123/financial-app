import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception"
import { parse, subDays } from "date-fns"

import { Client } from "@neondatabase/serverless";
import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2"
import { z } from "zod"
import { accounts, categories, insertTransactionSchema, transactions } from "@/db/schema";

const app = new Hono()
    .get("/", 
    zValidator("query", z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
    })),
    clerkMiddleware(),
    async  c => {
        const auth = getAuth(c)
        const { from, to, accountId } = c.req.valid("query")

        if (!auth?.userId) {
            // throw new HTTPException(401, {
            //     res: c.json({
            //         error: "Unauthorized"
            //     }, 401)
            // })
            return c.json({error: "unauthorized"}, 401)
        }

        const defaultTo = new Date()
        const defaultFrom = subDays(defaultTo, 30)

        const startDate = from 
            ? parse(from, "yyyy-MM-dd", new Date)
            : defaultFrom

        const endDate = to 
            ? parse(to, "yyyy-MM-dd", new Date)
            : defaultTo

        // const data = await db.select().from(schema.accounts)
        const data = await db
        .select({
            id: transactions.id,
            amount: transactions.amount,
            payee: transactions.payee,
            notes: transactions.notes,
            date: transactions.date,
            account: accounts.name,
            accountId: transactions.accountId,
            category: categories.name,
            categoryId: transactions.categoryId,
        }).from(transactions)
        .innerJoin(transactions, 
            eq(transactions.accountId, accounts.id)
        )
        .leftJoin(transactions, 
            eq(transactions.categoryId, categories.id)
        )
        .where(
            and(
                accountId ? eq(transactions.accountId, accountId) : undefined,
                eq(accounts.userId, auth.userId),
                gte(transactions.date, startDate),
                lte(transactions.date, endDate),
            )
        )
        .orderBy(desc(transactions.date))

        return c.json({data})
    })
    .get(
        "/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string().optional()
        })),
        async c => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")

            if (!id) {
                return c.json({error: "Missing ID"}, 400)
            }

            if (!auth?.userId) {
                return c.json({error: "Unauthorized"}, 401)
            }

            const [data] = await db
                .select({
                    id: transactions.id,
                    amount: transactions.amount,
                    payee: transactions.payee,
                    notes: transactions.notes,
                    date: transactions.date,
                    accountId: transactions.accountId,
                    categoryId: transactions.categoryId,
                })
                .from(transactions)
                .innerJoin(transactions, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(transactions.id, id),
                        eq(accounts.userId, auth.userId)
                    ),
                );

            if (!data) {
                return c.json({error: "Data Not Found"}, 404)
            }

            return c.json({ data })
        }
    )
    .post("/",
    clerkMiddleware(),
    zValidator("json", insertTransactionSchema.omit({
        id: true,
    })),
    async c => {
        const auth = getAuth(c)
        const values = c.req.valid("json")

        if (!auth?.userId) {
            return c.json({error: "Unauhtorized!"}, 401)
        }

        const [data] = await db.insert(transactions).values({
            id: createId(),
            ...values,
        }).returning()

        return c.json({ data })
        }
    )
    .post(
        "/bulk-create",
        clerkMiddleware(),
        zValidator("json", z.array(insertTransactionSchema.omit({
            id: true
        }))),
        async c => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({error: "Unauthorized!"}, 401)
            }

            const data = await db.insert(transactions)
            .values(
                values.map(value => ({
                    id: createId(),
                    ...value,
                }))
            )
            .returning()

            return c.json({data})
        }
    )
    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                ids: z.array(z.string())
            }),
        ),
        async c => {
            const auth = getAuth(c)
            const values = c.req.valid("json")
            
            if (!auth?.userId) {
                return c.json({error: "Unauthorized"}, 401)
            }

            const transactionsBulkIds = db.$with('transactions_bulk_ids').as(
                db.select({id: transactions.id})
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        inArray(transactions.id, values.ids),
                    )
                )
            )

            const data = await db
                .with(transactionsBulkIds)
                .delete(transactions)
                .where(
                    inArray(transactions.id, sql`select id from ${transactionsBulkIds}`)
                )
                .returning({
                    id: transactions.id
                })
                

            return c.json({ data }) 
        }
    )
    .patch(
        "/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string()
        })),
        zValidator(
            "json",
            insertTransactionSchema.omit({
                id: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")
            const values = c.req.valid("json")

            if (!id) {
                return c.json({error: "Missing ID"}, 400)
            }

            if (!auth?.userId) {
                return c.json({error: "Unauthorized!"}, 401)
            }

            const transactionToUpdate = db.$with("transaction_to_update").as(
                db.select({ id: transactions.id })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(transactions.id, id),
                    )
                )
            )

            const [data] = await db.with(transactionToUpdate)
                .update(transactions)
                .set(values)
                .where(
                    and(
                        inArray(transactions.id, sql`select id from ${transactionToUpdate}`),
                        eq(accounts.userId, auth.userId),
                    )
                )
                .returning({
                    id: transactions.id
                })

            if (!data) {
                return c.json({error: "NOT FOUND"}, 404)
            }

            return c.json({data})
        }
    )
    .delete(
        "/:id",
        clerkMiddleware(),
        zValidator("param", z.object({
            id: z.string().optional()
        })),
        async c => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")

            if (!id) {
                return c.json({error: "MISSING ID"}, 400)
            }

            if (!auth?.userId) {
                return c.json({error: "Unauthorized!"}, 401)
            }

            const transactionToDelete = db.$with("transaction_to_delete").as(
                db.select({id: transactions.id})
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(accounts.userId, auth.userId),
                        eq(transactions.id, id)
                    )
                )
            )

            const [data] = await db.with(transactionToDelete)
            .delete(transactions)
            .where(
                inArray(transactions.id, sql`select id from ${transactionToDelete}`)
            )
            .returning({
                id: transactions.id
            })

            if (!data) {
                return c.json({error: "NOT FOUND"}, 404)
            }

            return c.json({data})
        }
    )

export default app