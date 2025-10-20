export class NameAlreadyExistsError extends Error {
  constructor() {
    super('Name already exists.');
  }
}
