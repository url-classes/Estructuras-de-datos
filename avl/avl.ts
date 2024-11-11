// AvlTree.ts
import TreeNode from "./treenode";

class AvlTree<T> {
  private root: TreeNode<T> | null;
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.root = null;
    this.comparator = comparator;
  }

  public depth(value: T, ref: TreeNode<T> | null = this.root): number {
    if (ref === null) {
      return -1;
    } else if (this.comparator(ref.data, value) === 0) {
      return 0;
    }

    const leftDepth = this.depth(value, ref.left);
    const rightDepth = this.depth(value, ref.right);

    if (leftDepth === -1 && rightDepth === -1) {
      return -1;
    }

    return Math.max(leftDepth, rightDepth) + 1;
  }

  public height(ref: TreeNode<T> | null = this.root): number {
    if (ref === null) {
      return -1; 
    }

    return Math.max(this.height(ref.left), this.height(ref.right)) + 1;
  }

  public preorder(ref: TreeNode<T> | null = this.root): string {
    if (ref === null) {
      return "";
    }

    if (ref.isLeaf()) {
      return `${ref.data}`;
    }

    let result = `${ref.data} (`;
    result += `${this.preorder(ref.left)},`;
    result += `${this.preorder(ref.right)})`;

    return result;
  }

  public search(value: T, ref: TreeNode<T> | null = this.root): TreeNode<T> | null {
    if (ref !== null && this.comparator(ref.data, value) === 0) {
      return ref;
    } else if (ref !== null) {
      const leftResult = this.search(value, ref.left);

      if (leftResult === null) {
        return this.search(value, ref.right);
      }

      return leftResult;
    }

    return null;
  }

  private rotateRight(subtree: TreeNode<T>): TreeNode<T> {
    const child = subtree.left;
    if (child === null) {
      throw new Error('La rotación derecha requiere un hijo izquierdo.');
    }

    subtree.left = child.right;
    child.right = subtree;
    return child;
  }

  private rotateLeft(subtree: TreeNode<T>): TreeNode<T> {
    const child = subtree.right;
    if (child === null) {
      throw new Error('La rotación izquierda requiere un hijo derecho.');
    }

    subtree.right = child.left;
    child.left = subtree;
    return child;
  }

  private rotateLeftRight(subtree: TreeNode<T>): TreeNode<T> {
    subtree.left = this.rotateLeft(subtree.left!);
    return this.rotateRight(subtree);
  }

  private rotateRightLeft(subtree: TreeNode<T>): TreeNode<T> {
    subtree.right = this.rotateRight(subtree.right!);
    return this.rotateLeft(subtree);
  }

  public insert(value: T) {
    this.root = this._insert(value, this.root);
  }

  private _insert(value: T, ref: TreeNode<T> | null): TreeNode<T> {
    if (ref === null) {
      return new TreeNode(value);
    }

    if (this.comparator(value, ref.data) < 0) {
      ref.left = this._insert(value, ref.left);
    } else {
      ref.right = this._insert(value, ref.right);
    }

    const balanceFactor = this.balanceFactor(ref);

    // Desbalance hacia la izquierda
    if (balanceFactor > 1) {
      if (this.comparator(value, ref.left!.data) < 0) {
        return this.rotateRight(ref);
      } else {
        return this.rotateLeftRight(ref);
      }
    }

    // Desbalance hacia la derecha
    if (balanceFactor < -1) {
      if (this.comparator(value, ref.right!.data) > 0) {
        return this.rotateLeft(ref);
      } else {
        return this.rotateRightLeft(ref);
      }
    }

    return ref;
  }

  public balanceFactor(ref: TreeNode<T>): number {
    const leftHeight = this.height(ref.left);
    const rightHeight = this.height(ref.right);

    return leftHeight - rightHeight;
  }

  public min(ref: TreeNode<T> | null = this.root): TreeNode<T> {
    if (ref === null) {
      throw new Error('Árbol vacío.');
    }
    if (ref.left === null) {
      return ref;
    }

    return this.min(ref.left);
  }

  public delete(value: T) {
    this.root = this._delete(value, this.root);
  }

  private _delete(value: T, ref: TreeNode<T> | null): TreeNode<T> | null {
    if (ref === null) {
        return null; 
    }

    const comparison = this.comparator(value, ref.data);

    if (comparison < 0) {
        ref.left = this._delete(value, ref.left);
    } else if (comparison > 0) {
        ref.right = this._delete(value, ref.right);
    } else {
        if (ref.left === null && ref.right === null) {
            return null;
        }

        if (ref.left === null) {
            return ref.right;
        } else if (ref.right === null) {
            return ref.left;
        }

        const minRight = this.min(ref.right);
        ref.data = minRight.data;
        ref.right = this._delete(minRight.data, ref.right); 
    }

    const balanceFactor = this.balanceFactor(ref);

    if (balanceFactor > 1) {
        if (this.balanceFactor(ref.left!) >= 0) {
            return this.rotateRight(ref); 
        } else {
            return this.rotateLeftRight(ref); 
        }
    }

    if (balanceFactor < -1) {
        if (this.balanceFactor(ref.right!) <= 0) {
            return this.rotateLeft(ref);
        } else {
            return this.rotateRightLeft(ref);
        }
    }

    return ref;
  }
}

export default AvlTree;


const stringTree = new AvlTree<string>((a, b) => a.localeCompare(b));
const numberTree = new AvlTree<number>((a, b) => a - b);