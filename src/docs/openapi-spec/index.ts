import ptBR from './pt-br';

export function openApiSpec(locale: string) {
  switch (locale) {
    case 'pt-BR':
      return ptBR;
    default:
      return ptBR;
  }
}
