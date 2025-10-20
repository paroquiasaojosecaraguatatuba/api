export class ClergyPositionAlreadyExistsError extends Error {
  constructor() {
    super('Clergy position already exists.');
  }
}
