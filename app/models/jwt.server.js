// app/models/jwt.server.js

import db from "../db.server";

export async function getToken(shop) {
  const jwt = await db.jwt.findUnique({
    where: {
      recomind_shop: shop,
    },
  });

  return jwt?.recomind_token;
}

export async function upsertJwt(shop, token) {
  return db.jwt.upsert({
    where: {
      recomind_shop: shop,
    },
    update: {
      recomind_token: token,
    },
    create: {
      recomind_shop: shop,
      recomind_token: token,
    },
  });
}

export async function getJwt(shop) {
  return db.jwt.findUnique({
    where: {
      recomind_shop: shop,
    },
  });
}
