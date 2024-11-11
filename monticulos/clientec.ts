export default class Obejto {
    public nombre: string;
    public precio: number;  
    public num: number; 
    public estado: string;  

    constructor(nombre: string, precio: number, num: number, estado: string) {
        this.nombre = nombre;
        this.precio = precio;
        this.num = num;
        this.estado = estado;
    }

    public print() {
        console.log('Nombre del cliente: ', this.nombre);
        console.log('Precio de oferta: ', this.precio);
        console.log('Cantidad de acciones que se desean comprar: ', this.num); 
        console.log('Estado (venta o compra): ', this.estado);       
    }
}
