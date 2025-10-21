export const attachmentPaths = {
  '/attachments/images': {
    post: {
      summary: 'Carrega imagem como anexo',
      description:
        'Carrega uma imagem (JPEG ou PNG) para ser usada como anexo, retornando um ID único para referência futura.',
      tags: ['Attachments'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                  description: 'Arquivo de imagem JPEG ou PNG',
                },
              },
              required: ['file'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Imagem carregada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  attachmentId: {
                    type: 'string',
                    example: '01K7WHHBXWKXWYWE9ZCY88MG2Z',
                    description: 'ID único do anexo carregado',
                  },
                },
                required: ['attachmentId'],
              },
            },
          },
        },
        400: {
          description: 'Erro de validação ou formato de arquivo inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },
};
