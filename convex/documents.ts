import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";


// to archive the docs
export const archive = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);
        if (!existingDocument) { // we can't find the doc
            throw new Error("Not found");
        }

        //only if the logged user's id matches the user id in the doc schema, we archive it
        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized");
        }

        //going to archive all the child of the archived parent:
        const recursiveArchive = async (documentId: Id<"documents">) => {
            // collect all the children doc
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

            // loop through each child and archive it
            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                });

                await recursiveArchive(child._id); // we need to do the same for all the child which in turn have a child doc
            }
        }

        // we archive the parent doc, through the patch
        const document = await ctx.db.patch(args.id, {
            isArchived: true,
        });

        //we archive all children under this doc:
        recursiveArchive(args.id);

        return document;

    }
})


export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;
        const documents = await ctx.db          // to get the docs related to the user
            .query("documents")
            .withIndex("by_user_parent", (q) => // we use the withindex that we created in the schema to do faster queries
                q                               // first param was the index name that we gave, the second is the query that we want to run on the docs created in db
                    .eq("userId", userId)       // check if the userid matches with the person logged in currently
                    .eq("parentDocument", args.parentDocument)  // check if the parent doc matches with what we have
            )
            .filter((q) =>
                q.eq(q.field("isArchived"), false) // from the query result, we filter out the ones which are archived
            )
            .order("desc")
            .collect();

        return documents;
    },
})

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
