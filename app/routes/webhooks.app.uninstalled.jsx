import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can be retried after the records were already deleted.
  await db.session.deleteMany({ where: { shop } });
  await db.jwt.deleteMany({ where: { recomind_shop: shop } });

  return new Response();
};
