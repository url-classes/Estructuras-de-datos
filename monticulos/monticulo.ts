import Nodo from './nodo';
import ClienteC from './clientec';

class Heap {
  private root: Nodo | null;

  constructor(cliente: ClienteC) {
    this.root = new Nodo(cliente);
  }

  public depth(price: number, ref: Nodo | null = this.root): number {
    if (ref === null) {
      return -1;
    } else if (ref.valor.precio === price) {
      return 0;
    }

    const leftDepth = this.depth(price, ref.izquierdo);
    const rightDepth = this.depth(price, ref.derecho);

    if (leftDepth === -1 && rightDepth === -1) {
      return -1;
    }

    return Math.max(leftDepth, rightDepth) + 1;
  }

  public height(ref: Nodo | null = this.root): number {
    if (ref === null) {
      return 0;
    }
    return Math.max(this.height(ref.izquierdo), this.height(ref.derecho)) + 1;
  }

  public isFull(ref: Nodo | null = this.root): boolean {
    if (ref === null) {
      return true;
    }
    const totalNodes = this.countNodes(ref);
    const height = this.height(ref);
    return totalNodes === Math.pow(2, height) - 1;
  }

  private countNodes(ref: Nodo | null): number {
    if (ref === null) {
      return 0;
    }
    return 1 + this.countNodes(ref.izquierdo) + this.countNodes(ref.derecho);
  }

  public findRightMostNode(ref: Nodo | null = this.root): Nodo | null {
    if (ref === null) {
      return null;
    }

    if (ref.izquierdo === null && ref.derecho === null) {
      return ref;
    }
    const leftHeight = this.height(ref.izquierdo);
    const rightHeight = this.height(ref.derecho);
    if (leftHeight > rightHeight) {
      return this.findRightMostNode(ref.izquierdo);
    }
    return this.findRightMostNode(ref.derecho);
  }

  public insert(cliente: ClienteC): void {
    const newNode = new Nodo(cliente);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  private insertNode(ref: Nodo | null = this.root, newNode: Nodo): void {
    if (ref === null) {
      ref = newNode;
      return;
    }
    if (ref.izquierdo === null) {
      ref.izquierdo = newNode;
      return;
    }
    if (ref.derecho === null) {
      ref.derecho = newNode;
      return;
    }
    const isLeftFull = this.isFull(ref.izquierdo);
    const isRightFull = this.isFull(ref.derecho);
    const leftHeight = this.height(ref.izquierdo);
    const rightHeight = this.height(ref.derecho);
    if (isLeftFull && isRightFull) {
      if (leftHeight < rightHeight) {
        this.insertNode(ref.izquierdo, newNode);
      } else {
        this.insertNode(ref.derecho, newNode);
      }
    } else if (isLeftFull) {
      this.insertNode(ref.derecho, newNode);
    } else {
      this.insertNode(ref.izquierdo, newNode);
    }
  }

  public delete(ref: Nodo | null = this.root): ClienteC | null {
    if (ref === null) {
      return null;
    }
    const deleteValue = ref.valor;
    const node = this.findRightMostNode(ref);
    if (node !== null) {
      ref.valor = node.valor;
      const parent = this.findParent(this.root, node);
      this.removeLastNode(parent, node);
    }
    return deleteValue;
  }

  private removeLastNode(parent: Nodo | null, node: Nodo): void {
    if (parent === null) {
      return;
    }

    if (node === parent.derecho) {
      parent.derecho = null;
    } else if (node === parent.izquierdo) {
      parent.izquierdo = null;
    }
  }

  public orderMax(ref: Nodo | null = this.root): void {
    if (ref === null) {
      return;
    }

    this.orderMax(ref.izquierdo);
    this.orderMax(ref.derecho);
    if (ref.izquierdo !== null && ref.izquierdo.valor.precio > ref.valor.precio) {
      [ref.valor, ref.izquierdo.valor] = [ref.izquierdo.valor, ref.valor];
      this.orderMax(ref.izquierdo);
    }
    if (ref.derecho !== null && ref.derecho.valor.precio > ref.valor.precio) {
      [ref.valor, ref.derecho.valor] = [ref.derecho.valor, ref.valor];
      this.orderMax(ref.derecho);
    }
  }

  public orderMin(ref: Nodo | null = this.root): void {
    if (ref === null) {
      return;
    }
    this.orderMin(ref.izquierdo);
    this.orderMin(ref.derecho);
    if (ref.izquierdo !== null && ref.izquierdo.valor.precio < ref.valor.precio) {
      [ref.valor, ref.izquierdo.valor] = [ref.izquierdo.valor, ref.valor];
      this.orderMin(ref.izquierdo);
    }
    if (ref.derecho !== null && ref.derecho.valor.precio < ref.valor.precio) {
      [ref.valor, ref.derecho.valor] = [ref.derecho.valor, ref.valor];
      this.orderMin(ref.derecho);
    }
  }

public preorder(ref: Nodo | null = this.root): string {
  if (ref === null) {
    return "";
  }

  let result = `Nombre: ${ref.valor.nombre}, Precio: ${ref.valor.precio}, Num: ${ref.valor.num}, Estado: ${ref.valor.estado}`;

  if (ref.izquierdo !== null || ref.derecho !== null) {
    result += `\nIzquierdo: (${this.preorder(ref.izquierdo)})`;
    result += `\nDerecho: (${this.preorder(ref.derecho)})`;
  }

  return result;
}


  private findParent(root: Nodo | null = this.root, node: Nodo): Nodo | null {
    if (root === null || root.izquierdo === node || root.derecho === node) {
      return root;
    }
    const leftResult = this.findParent(root.izquierdo, node);
    if (leftResult !== null) {
      return leftResult;
    }
    return this.findParent(root.derecho, node);
  }

    // Protocolo de iteración
    public *[Symbol.iterator](): IterableIterator<ClienteC> {
      yield* this.inOrder(this.root); 
    }

  private *inOrder(ref: Nodo | null): IterableIterator<ClienteC> {
    if (ref === null) {
      return;
    }
    yield* this.inOrder(ref.izquierdo);
    
    yield ref.valor;

    yield* this.inOrder(ref.derecho);
  }

}

export default Heap;
