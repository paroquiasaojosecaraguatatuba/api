import { getDictionary } from "@/dictionaries";
import type { Next } from "hono";

export const parseLanguage = async (c: DomainContext, next: Next) => {
  const acceptLanguage = c.req.header("Accept-Language")?.toLocaleLowerCase();
  const timezoneOffset = c.req.header("X-Timezone-Offset");
  const timezone = c.req.header("X-Timezone");

  const dictionary = getDictionary(acceptLanguage);

  c.set("dictionary", dictionary);
  c.set("timezone", timezone || "America/Sao_Paulo");
  c.set("timezoneOffset", timezoneOffset || "-03:00");

  return await next();
};