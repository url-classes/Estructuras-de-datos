export default class TreeNode<T> {
  public color: "red" | "black" = "red";
  public key: number;
  public left: TreeNode<T> | null = null;
  public parent: TreeNode<T> | null = null;
  public right: TreeNode<T> | null = null;
  public value?: T;

  constructor({
    key,
    value,
    parent = null,
  }: {
    key: number;
    value?: T;
    parent?: TreeNode<T> | null;
  }) {
    this.key = key;
    this.value = value;
    this.parent = parent;
  }

  public swapColor() {
    this.color = this.color === "red" ? "black" : "red";
  }

  public rotateLeft(): TreeNode<T> | null {
    const pivot = this.right;
    if (!pivot) return null;

    this.right = pivot.left;
    if (pivot.left) pivot.left.parent = this;

    pivot.left = this;
    pivot.parent = this.parent;
    this.parent = pivot;

    return pivot;
  }

  public rotateRight(): TreeNode<T> | null {
    const pivot = this.left;
    if (!pivot) return null;

    this.left = pivot.right;
    if (pivot.right) pivot.right.parent = this;

    pivot.right = this;
    pivot.parent = this.parent;
    this.parent = pivot;

    return pivot;
  }
}

  