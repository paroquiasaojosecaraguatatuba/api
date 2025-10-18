export class ParishAlreadyExistsError extends Error {
  constructor() {
    super('Parish already exists.');
  }
}
