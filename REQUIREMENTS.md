# ⛪ Paróquia API

## Requisitos

### Requisitos Funcionais

- [x] Deve ser possível criar novos acessos para usuários;
- [x] Deve ser possível autenticar usuários existentes;
- [x] Deve ser possível fazer uploads de imagens;
- [x] Deve ser possível criar, atualizar, excluir e listar comunidades;
- [x] Deve ser possível criar, atualizar, excluir e listar clérigos;
- [x] Deve ser possível criar, atualizar, excluir e listar pastorais;
- [ ] Deve ser possível criar, atualizar, excluir e listar categorias do blog;
- [ ] Deve ser possível criar, atualizar, excluir e listar rascunhos do blog;

### Regras de Negócio

- [x] Somente o administrador pode criar novos acessos;
- [x] Somente uma comunidade pode ser do tipo 'Paróquia';
- [x] O slug da comunidade deve ser único;
- [x] Posições de clérigos 'Supremo Pontífice', 'Bispo Diocesano' e 'Pároco' só podem ser atribuídas uma vez;
- [x] O slug da categoria do blog deve ser único;
- [x] O slug do rascunho do blog deve ser único por categoria;
- [ ] A data do evento do rascunho deve ser uma data futura;
- [ ] A data de publicação agendada do rascunho deve ser uma data futura;
- [ ] A data de despublicação agendada do rascunho deve ser uma data futura e posterior à data de publicação agendada;
- [ ] Somente o autor do rascunho ou um administrador pode editar ou excluir um rascunho.

### Requisitos Não Funcionais

- [x] Utilização da Cloudflare Workers para hospedar a API;
- [x] Utilização do banco de dados Cloudflare D1;
- [x] Utilização do storage Cloudflare R2 para armazenar imagens;
