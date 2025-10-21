export class ResourceNotFoundError extends Error {
  constructor(errorKey?: string) {
    super(errorKey || 'Resource not found.');
  }
}
