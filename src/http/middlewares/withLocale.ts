export const withLocale: MiddlewareFn = async (c, next) => {
  const supportedLocales = ['pt-BR'];

  const localeParam = c.req.param('locale');

  if (localeParam && supportedLocales.includes(localeParam)) {
    c.set('locale', localeParam);

    return await next();
  }

  const acceptLanguage = c.req.header('Accept-Language') || '';

  const requestedLocales = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim())
    .map((lang) => {
      // Mapear pt para pt-BR
      if (lang === 'pt') return 'pt-BR';
      return lang;
    });

  for (const locale of requestedLocales) {
    if (supportedLocales.includes(locale)) {
      c.set('locale', locale);
      return await next();
    }
  }

  c.set('locale', 'pt-BR'); // Fallback
  return await next();
};
