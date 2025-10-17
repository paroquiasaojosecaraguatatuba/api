export const parseBody: MiddlewareFn = async (c, next) => {
  try {
    if (
      c.req.method === 'POST' ||
      c.req.method === 'PUT' ||
      c.req.method === 'PATCH'
    ) {
      const contentType = c.req.header('Content-Type');
      if (contentType?.includes('application/json')) {
        const body = await c.req.json();
        c.set('inputs', body);
      }

      if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await c.req.formData();
        const body: Record<string, string> = {};
        formData.forEach((value, key) => {
          if (typeof value === 'string') {
            body[key] = value;
          }
        });
        c.set('inputs', body);
      }
    }

    return await next();
  } catch (error) {
    return c.json({ error: 'Erro ao obter corpo JSON!' }, 500);
  }
};
