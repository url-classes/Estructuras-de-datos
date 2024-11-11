import * as readline from 'readline';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function emparejamiento(compra: Heap, venta: Heap): void {
    let comprador: ClienteC | null = null;
    let vendedor: ClienteC | null = null;

    // Iterar sobre el heap de compra y venta
    for (comprador of compra) {
        for (vendedor of venta) {
            // Verificar si el precio y la cantidad coinciden
            if (comprador.precio >= vendedor.precio && comprador.num === vendedor.num) {
                console.log(`Transacción exitosa: ${comprador.nombre} compra de ${vendedor.nombre} por ${vendedor.precio}`);
                
                // Remover el nodo del comprador y del vendedor
                compra.delete();  // Eliminar el comprador que ha completado la transacción
                venta.delete();   // Eliminar el vendedor que ha completado la transacción
                
                break;  // Salir del loop de vendedores cuando haya una coincidencia
            }
        }
    }
}

function mostrarMenu() {
    console.log("\n---- Menú del simulador ----");
    console.log("1. Insertar comprador");
    console.log("2. Insertar vendedor");
    console.log("3. Emparejar órdenes");
    console.log("4. Salir");
}

function iniciarSimulacion() {
    const compra = new Heap(new ClienteC('Inicial', 0, 0, 'Compra'));
    const venta = new Heap(new ClienteC('Inicial', 0, 0, 'Venta'));

    mostrarMenu();

    rl.question('Seleccione una opción: ', (respuesta) => {
        switch (respuesta) {
            case '1':
                rl.question('Ingrese nombre, precio, cantidad: ', (input) => {
                    const [nombre, precio, num] = input.split(',');
                    const cliente = new ClienteC(nombre.trim(), parseFloat(precio), parseInt(num), 'Compra');
                    compra.insert(cliente);
                    console.log('Comprador agregado.');
                    iniciarSimulacion();
                });
                break;
            case '2':
                rl.question('Ingrese nombre, precio, cantidad: ', (input) => {
                    const [nombre, precio, num] = input.split(',');
                    const cliente = new ClienteC(nombre.trim(), parseFloat(precio), parseInt(num), 'Venta');
                    venta.insert(cliente);
                    console.log('Vendedor agregado.');
                    iniciarSimulacion();
                });
                break;
            case '3':
                emparejamiento(compra, venta);
                iniciarSimulacion();
                break;
            case '4':
                console.log('Saliendo...');
                rl.close();
                break;
            default:
                console.log('Opción no válida.');
                iniciarSimulacion();
                break;
        }
    });
}

iniciarSimulacion();
