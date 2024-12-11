import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    try {
      if (ctx.state.user && ctx.request.method === "POST") {
        const userId = ctx.state.user.id;

        if (ctx.request.body && ctx.request.body.data) {
          ctx.request.body.data.created_by_id = userId;
        }
      }
    } catch (error) {
      console.error("Error in set-created-by middleware:", error);
    }

    await next();
  };
};
