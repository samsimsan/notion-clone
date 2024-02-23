import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";


export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        //if there isn't an identity, then the user is not logged in:
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const documents = await ctx.db.query("documents").collect();

        return documents;
    }
});


//Mutations insert, update and remove data from the database, check authentication or perform other business logic, and optionally return a response to the client application.
export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {     //ctx: context
        const identity = await ctx.auth.getUserIdentity();

        //if there isn't an identity, then the user is not logged in:
        if (!identity) {
            throw new Error("Not authenticated");
        }

        //extracting the userId:
        const userId = identity.subject;

        //creating the doc now: 
        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        });

        return document;
    }
})
