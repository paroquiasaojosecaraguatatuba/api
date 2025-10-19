import enUS from './en';
import ptBR from './pt-br';

export function openApiSpec(locale: string) {
  switch (locale) {
    case 'pt-BR':
      return ptBR;
    case 'en':
      return enUS;
    default:
      return ptBR;
  }
}
