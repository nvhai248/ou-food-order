/**
 * batch router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::batch.batch", {
  //   config: {
  //     create: {
  //       middlewares: ["global::set-created-by"],
  //     },
  //   },
});
