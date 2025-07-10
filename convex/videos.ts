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
    status: v.optional(v.union(v.literal("planned"), v.literal("in_production"), v.literal("published"))),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getLoggedInUser(ctx);
    
    let query = ctx.db.query("videos").withIndex("by_user", (q) => q.eq("userId", userId));
    
    if (args.platform) {
      query = ctx.db.query("videos").withIndex("by_user_and_platform", (q) => 
        q.eq("userId", userId).eq("platform", args.platform!)
      );
    } else if (args.status) {
      query = ctx.db.query("videos").withIndex("by_user_and_status", (q) => 
        q.eq("userId", userId).eq("status", args.status!)
      );
    } else if (args.category) {
      query = ctx.db.query("videos").withIndex("by_user_and_category", (q) => 
        q.eq("userId", userId).eq("category", args.category!)
      );
    }
    
    return await query.order("desc").collect();
  },
});

export const search = query({
  args: {
    searchTerm: v.string(),
    platform: v.optional(v.union(v.literal("tiktok"), v.literal("youtube"), v.literal("kwai"), v.literal("facebook"))),
    category: v.optional(v.string()),
    status: v.optional(v.union(v.literal("planned"), v.literal("in_production"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const userId = await getLoggedInUser(ctx);
    
    const results = await ctx.db
      .query("videos")
      .withSearchIndex("search_content", (q) => {
        let query = q.search("title", args.searchTerm).eq("userId", userId);
        if (args.platform) query = query.eq("platform", args.platform);
        if (args.category) query = query.eq("category", args.category);
        if (args.status) query = query.eq("status", args.status);
        return query;
      })
      .take(50);
    
    return results;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    link: v.optional(v.string()),
    platform: v.union(v.literal("tiktok"), v.literal("youtube"), v.literal("kwai"), v.literal("facebook")),
    category: v.string(),
    tags: v.array(v.string()),
    status: v.union(v.literal("planned"), v.literal("in_production"), v.literal("published")),
    scheduledDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getLoggedInUser(ctx);
    
    return await ctx.db.insert("videos", {
      ...args,
      userId,
      publishedDate: args.status === "published" ? Date.now() : undefined,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("videos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    platform: v.optional(v.union(v.literal("tiktok"), v.literal("youtube"), v.literal("kwai"), v.literal("facebook"))),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("planned"), v.literal("in_production"), v.literal("published"))),
    scheduledDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getLoggedInUser(ctx);
    const { id, ...updates } = args;
    
    const video = await ctx.db.get(id);
    if (!video || video.userId !== userId) {
      throw new Error("Video not found or unauthorized");
    }
    
    const updateData: any = { ...updates };
    if (updates.status === "published" && video.status !== "published") {
      updateData.publishedDate = Date.now();
    }
    
    return await ctx.db.patch(id, updateData);
  },
});

export const remove = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getLoggedInUser(ctx);
    
    const video = await ctx.db.get(args.id);
    if (!video || video.userId !== userId) {
      throw new Error("Video not found or unauthorized");
    }
    
    return await ctx.db.delete(args.id);
  },
});

export const getUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getLoggedInUser(ctx);
    
    const now = Date.now();
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_user_and_status", (q) => q.eq("userId", userId).eq("status", "planned"))
      .filter((q) => q.neq(q.field("scheduledDate"), undefined))
      .collect();
    
    return videos
      .filter(video => video.scheduledDate && video.scheduledDate > now)
      .sort((a, b) => (a.scheduledDate || 0) - (b.scheduledDate || 0))
      .slice(0, 5);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getLoggedInUser(ctx);
    
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    const stats = {
      total: videos.length,
      planned: videos.filter(v => v.status === "planned").length,
      inProduction: videos.filter(v => v.status === "in_production").length,
      published: videos.filter(v => v.status === "published").length,
      byPlatform: {
        tiktok: videos.filter(v => v.platform === "tiktok").length,
        youtube: videos.filter(v => v.platform === "youtube").length,
        kwai: videos.filter(v => v.platform === "kwai").length,
        facebook: videos.filter(v => v.platform === "facebook").length,
      },
    };
    
    return stats;
  },
});
