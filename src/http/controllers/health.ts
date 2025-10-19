import type { Context } from 'hono';

export const health = (c: Context<{ Bindings: Bindings }>) => {
  return c.text('The API is running!');
};
