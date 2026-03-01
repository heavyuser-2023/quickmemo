import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMemos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }
    // 해당 사용자의 메모만 가져와서 최신순으로 정렬
    const memos = await ctx.db
      .query("memos")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return memos;
  },
});

export const createMemo = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("unauthenticated");
    }
    const memoId = await ctx.db.insert("memos", {
      userId,
      title: args.title,
      content: args.content,
    });
    return memoId;
  },
});

export const updateMemo = mutation({
  args: {
    id: v.id("memos"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("unauthenticated");
    }
    
    // 본인 소유의 메모인지 검증
    const memo = await ctx.db.get(args.id);
    if (!memo || memo.userId !== userId) {
      throw new Error("Unauthorized or Memo not found");
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      content: args.content,
    });
  },
});

export const deleteMemo = mutation({
  args: {
    id: v.id("memos"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("unauthenticated");
    }

    const memo = await ctx.db.get(args.id);
    if (!memo || memo.userId !== userId) {
      throw new Error("Unauthorized or Memo not found");
    }

    await ctx.db.delete(args.id);
  },
});
