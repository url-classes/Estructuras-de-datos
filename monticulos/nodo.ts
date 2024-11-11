import ClienteC from './clientec';

export default class Nodo {
    valor: ClienteC;
    izquierdo: Nodo | null;
    derecho: Nodo | null;

    constructor(cliente: ClienteC) {
        this.valor = cliente;
        this.izquierdo = null;
        this.derecho = null;
    }
}
