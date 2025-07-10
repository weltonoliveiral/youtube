import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  videos: defineTable({
    title: v.string(),
    description: v.string(),
    link: v.optional(v.string()),
    platform: v.union(v.literal("tiktok"), v.literal("youtube"), v.literal("kwai"), v.literal("facebook")),
    category: v.string(),
    tags: v.array(v.string()),
    status: v.union(
      v.literal("planned"),
      v.literal("in_production"),
      v.literal("published")
    ),
    scheduledDate: v.optional(v.number()),
    publishedDate: v.optional(v.number()),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_platform", ["userId", "platform"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_user_and_category", ["userId", "category"])
    .searchIndex("search_content", {
      searchField: "title",
      filterFields: ["userId", "platform", "category", "status"],
    }),

  references: defineTable({
    title: v.string(),
    link: v.string(),
    platform: v.union(v.literal("tiktok"), v.literal("youtube"), v.literal("kwai"), v.literal("facebook")),
    notes: v.optional(v.string()),
    tags: v.array(v.string()),
    folder: v.optional(v.string()),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_platform", ["userId", "platform"])
    .index("by_user_and_folder", ["userId", "folder"])
    .searchIndex("search_references", {
      searchField: "title",
      filterFields: ["userId", "platform", "folder"],
    }),

  categories: defineTable({
    name: v.string(),
    color: v.string(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  folders: defineTable({
    name: v.string(),
    color: v.string(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
