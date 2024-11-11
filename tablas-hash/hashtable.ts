import HashNode from "./hashnode";

export default class HashTable {
  private _elements: Array<HashNode | null | undefined>;

  constructor(size: number) {
    this._elements = new Array(size);
  }

  public get elements() {
    return this._elements;
  }

  public findSlot(node: HashNode, index: number): number {
    let visitedKeys = 0;
    const size = this._elements.length;

    while (this._elements[index]) {
      index += 1;
      if (index === size) {
        index = 0;
      }

      visitedKeys += 1;
      if (visitedKeys === size) {
        throw new Error("Overflow error");
      }
    }

    return index;
  }

  private hash(key: number) {
    return key % this._elements.length;
  }

  public indexOf(key: number) {
    let index = this.hash(key);

    if (this._elements[index]?.key === key) {
      return index;
    }

    const size = this._elements.length;
    let visitedKeys = 0;

    while (this._elements[index] !== undefined) {
      if (this._elements[index]?.key === key) {
        break;
      }

      if (visitedKeys === size) {
        throw new Error("Key not found");
      }

      visitedKeys += 1;
      index += 1;

      if (index === size) {
        index = 0;
      }
    }

    return index;
  }

  public insert(node: HashNode) {
    const nu = Number(node.key)
    const index = this.hash(nu);

    if (this._elements[index]) {
      const newIndex = this.findSlot(node, index);
      this._elements[newIndex] = node;
    } else {
      this._elements[index] = node;
    }
  }

  public remove(key: number) {
    const index = this.indexOf(key);
    this._elements[index] = null;
  }

  public size(): number {
    return this._elements.reduce((count, element) => {
      if (element !== null && element !== undefined) {
        count += 1;
      }
      return count;
    }, 0);
  }

  [Symbol.iterator](): Iterator<HashNode | null> {
    let index = 0;
    const elements = this._elements;
    
    return {
      next(): IteratorResult<HashNode | null> {
        while (index < elements.length) {
          const value = elements[index++];
          if (value !== undefined) {
            return { value, done: false };
          }
        }
        return { value: null, done: true };
      }
    }
  }
}
