import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

async function getLoggedInUser(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
}

export const list = query({
  args: {
    platform: v.optional(v.union(v.literal("tiktok"), v.literal("youtube"), v.literal("kwai"), v.literal("facebook"))),
    folder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getLoggedInUser(ctx);
    
    let query = ctx.db.query("references").withIndex("by_user", (q) => q.eq("userId", userId));
    
    if (args.platform) {
      query = ctx.db.query("references").withIndex("by_user_and_platform", (q) => 
        q.eq("userId", userId).eq("platform", args.platform!)
      );
    } else if (args.folder) {
      query = ctx.db.query("references").withIndex("by_user_and_folder", (q) => 
        q.eq("userId", userId).eq("folder", args.folder)
      );
    }
    
    return await query.order("desc").collect();
  },
});

export const search = query({
  args: {
    searchTerm: v.string(),
    platform: v.optional(v.union(v.literal("tiktok"), v.literal("youtube"), v.literal("kwai"), v.literal("facebook"))),
    folder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getLoggedInUser(ctx);
    
    const results = await ctx.db
      .query("references")
      .withSearchIndex("search_references", (q) => {
        let query = q.search("title", args.searchTerm).eq("userId", userId);
        if (args.platform) query = query.eq("platform", args.platform);
        if (args.folder) query = query.eq("folder", args.folder);
        return query;
      })
      .take(50);
    
    return results;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    link: v.string(),
    platform: v.union(v.literal("tiktok"), v.literal("youtube"), v.literal("kwai"), v.literal("facebook")),
    notes: v.optional(v.string()),
    tags: v.array(v.string()),
    folder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getLoggedInUser(ctx);
    
    return await ctx.db.insert("references", {
      ...args,
      userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("references"),
    title: v.optional(v.string()),
    link: v.optional(v.string()),
    platform: v.optional(v.union(v.literal("tiktok"), v.literal("youtube"), v.literal("kwai"), v.literal("facebook"))),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    folder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getLoggedInUser(ctx);
    const { id, ...updates } = args;
    
    const reference = await ctx.db.get(id);
    if (!reference || reference.userId !== userId) {
      throw new Error("Reference not found or unauthorized");
    }
    
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("references") },
  handler: async (ctx, args) => {
    const userId = await getLoggedInUser(ctx);
    
    const reference = await ctx.db.get(args.id);
    if (!reference || reference.userId !== userId) {
      throw new Error("Reference not found or unauthorized");
    }
    
    return await ctx.db.delete(args.id);
  },
});

export const getRecent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getLoggedInUser(ctx);
    
    return await ctx.db
      .query("references")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(5);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getLoggedInUser(ctx);
    
    const references = await ctx.db
      .query("references")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    const stats = {
      total: references.length,
      byPlatform: {
        tiktok: references.filter(r => r.platform === "tiktok").length,
        youtube: references.filter(r => r.platform === "youtube").length,
        kwai: references.filter(r => r.platform === "kwai").length,
        facebook: references.filter(r => r.platform === "facebook").length,
      },
    };
    
    return stats;
  },
});
