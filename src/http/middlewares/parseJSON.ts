export const parseJSON: MiddlewareFn = async (c, next) => {
  try {
    if (
      c.req.method === 'POST' ||
      c.req.method === 'PUT' ||
      c.req.method === 'PATCH'
    ) {
      const body = await c.req.json();
      c.set('inputs', body);
    }

    return await next();
  } catch (error) {
    return c.json({ error: 'Erro ao obter corpo JSON!' }, 500);
  }
};
