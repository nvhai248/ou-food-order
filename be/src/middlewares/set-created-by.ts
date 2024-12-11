import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    try {
      if (ctx.state.user && ctx.request.method === "POST") {
        console.log("User:", ctx.state.user);
        const userId = ctx.state.user.documentId;

        if (ctx.request.body && ctx.request.body.data) {
          ctx.request.body.data.owner = { id: userId };
        }
        console.log("Request Body Data:", ctx.request.body.data);
      }
    } catch (error) {
      console.error("Error in set-created-by middleware:", error);
    }

    await next();
  };
};

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMzOTMwNTM2LCJleHAiOjE3MzY1MjI1MzZ9.Srf-8ZWLJbIAb4OM1-Vj-uSY_i66Nx9-jST7960v-Ms
