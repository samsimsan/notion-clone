import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    documents: defineTable({
        title: v.string(),
        userId: v.string(),     // this will be clerk userid
        isArchived: v.boolean(),    // for soft delete of the docs
        parentDocument: v.optional(v.id("documents")),  // to connect with the parent doc, if it exists
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.boolean(),   // to decide if it can e shared with others or not
    })
        //for fast querying
        .index("by_user", ["userId"])
        .index("by_user_parent", ["userId", "parentDocument"])
});