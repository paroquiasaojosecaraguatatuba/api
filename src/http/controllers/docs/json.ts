import { openApiSpec } from '@/docs/openapi-spec';
import { getAppContext } from '@/http/utils/getAppContext';

export const jsonDoc: ControllerFn = async (c) => {
  const { locale } = getAppContext(c);

  return c.json(openApiSpec(locale));
};
