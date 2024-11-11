import TreeNode from "./tree-node";

export default class RedBlackTree<T> {
  public root: TreeNode<T> | null = null;

  // Método de inserción
  public insert(key: number, value?: T): void {
    const newNode = new TreeNode({ key, value });

    if (!this.root) {
      this.root = newNode;
      this.root.color = "black"; // Raíz siempre negra
    } else {
      let parent: TreeNode<T> | null = null;
      let current = this.root;

      while (current) {
        parent = current;
        current = newNode.key < current.key ? current.left : current.right;
      }

      newNode.parent = parent;
      if (parent) {
        if (newNode.key < parent.key) parent.left = newNode;
        else parent.right = newNode;
      }

      this.fixInsert(newNode);
    }
  }

  // Método para arreglar el balance después de la inserción
  private fixInsert(node: TreeNode<T>): void {
    while (node.parent && node.parent.color === "red") {
      const grandparent = node.parent.parent;
      if (!grandparent) break;

      if (node.parent === grandparent.left) {
        const uncle = grandparent.right;

        if (uncle && uncle.color === "red") {
          node.parent.color = "black";
          uncle.color = "black";
          grandparent.color = "red";
          node = grandparent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            node.rotateLeft();
          }

          node.parent!.color = "black";
          grandparent.color = "red";
          grandparent.rotateRight();
        }
      } else {
        const uncle = grandparent.left;

        if (uncle && uncle.color === "red") {
          node.parent.color = "black";
          uncle.color = "black";
          grandparent.color = "red";
          node = grandparent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            node.rotateRight();
          }

          node.parent!.color = "black";
          grandparent.color = "red";
          grandparent.rotateLeft();
        }
      }
    }

    this.root!.color = "black";
  }

  // Método de búsqueda
  public search(key: number): TreeNode<T> | null {
    let current = this.root;
    while (current) {
      if (key === current.key) return current;
      current = key < current.key ? current.left : current.right;
    }
    return null;
  }

  // Método de eliminación
  public delete(key: number): void {
    const node = this.search(key);
    if (!node) return;

    let replacement = node;
    let originalColor = replacement.color;
    let x: TreeNode<T> | null;

    if (!node.left) {
      x = node.right;
      this.transplant(node, node.right);
    } else if (!node.right) {
      x = node.left;
      this.transplant(node, node.left);
    } else {
      replacement = this.minimum(node.right);
      originalColor = replacement.color;
      x = replacement.right;

      if (replacement.parent === node) {
        if (x) x.parent = replacement;
      } else {
        this.transplant(replacement, replacement.right);
        replacement.right = node.right;
        if (replacement.right) replacement.right.parent = replacement;
      }

      this.transplant(node, replacement);
      replacement.left = node.left;
      if (replacement.left) replacement.left.parent = replacement;
      replacement.color = node.color;
    }

    if (originalColor === "black") {
      if (x) this.fixDelete(x);
    }
  }

  // Transplante de nodos
  private transplant(u: TreeNode<T> | null, v: TreeNode<T> | null): void {
    if (!u) return;
    if (!u.parent) this.root = v;
    else if (u === u.parent.left) u.parent.left = v;
    else u.parent.right = v;

    if (v) v.parent = u.parent;
  }

  // Encontrar el nodo más pequeño
  private minimum(node: TreeNode<T>): TreeNode<T> {
    while (node.left) node = node.left;
    return node;
  }

  // Arreglar el árbol después de la eliminación
  private fixDelete(x: TreeNode<T> | null): void {
    while (x !== this.root && (x === null || x.color === "black")) {
      if (x === x?.parent?.left) {
        let sibling = x.parent?.right;

        if (sibling && sibling.color === "red") {
          sibling.color = "black";
          x.parent.color = "red";
          x.parent.rotateLeft();
          sibling = x.parent.right;
        }

        if (
          sibling &&
          (sibling.left === null || sibling.left.color === "black") &&
          (sibling.right === null || sibling.right.color === "black")
        ) {
          sibling.color = "red";
          x = x.parent!;
        } else {
          if (sibling && (sibling.right === null || sibling.right.color === "black")) {
            if (sibling.left) sibling.left.color = "black";
            sibling.color = "red";
            sibling.rotateRight();
            sibling = x.parent?.right!;
          }

          if (sibling) {
            sibling.color = x.parent!.color;
            x.parent!.color = "black";
            if (sibling.right) sibling.right.color = "black";
            x.parent!.rotateLeft();
          }
          x = this.root!;
        }
      } else {
        let sibling = x.parent?.left;

        if (sibling && sibling.color === "red") {
          sibling.color = "black";
          x.parent.color = "red";
          x.parent.rotateRight();
          sibling = x.parent.left;
        }

        if (
          sibling &&
          (sibling.right === null || sibling.right.color === "black") &&
          (sibling.left === null || sibling.left.color === "black")
        ) {
          sibling.color = "red";
          x = x.parent!;
        } else {
          if (sibling && (sibling.left === null || sibling.left.color === "black")) {
            if (sibling.right) sibling.right.color = "black";
            sibling.color = "red";
            sibling.rotateLeft();
            sibling = x.parent?.left!;
          }

          if (sibling) {
            sibling.color = x.parent!.color;
            x.parent!.color = "black";
            if (sibling.left) sibling.left.color = "black";
            x.parent!.rotateRight();
          }
          x = this.root!;
        }
      }
    }

    if (x) x.color = "black";
  }
}
