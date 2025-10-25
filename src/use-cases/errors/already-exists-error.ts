export class AlreadyExistsError extends Error {
  constructor() {
    super('Resource already exists.');
  }
}
