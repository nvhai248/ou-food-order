import type { Strapi } from "@strapi/strapi";

export default {
  async beforeCreate(event: { params: any; state: any }) {
    const { params, state } = event;

    // Ensure the user is authenticated
    if (state.user && state.user.id) {
      params.data.created_by_id = state.user.id;
    } else {
      throw new Error("User not authenticated");
    }
  },
};