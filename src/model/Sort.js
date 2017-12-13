export default class Sort {
  constructor(field, dir = 'ASC') {
    if (!field) {
      throw new Error('field is null');
    }
    this.field = field;
    this.dir = dir.toUpperCase();
  }

  getField() {
    return this.field;
  }

  getDir() {
    return this.dir;
  }

  static createSort(field, dir) {
    return new Sort(field, dir);
  }
}
