import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let nombres = new Array
nombres.push('Hola', 'Que tal')

function mostrarMenu() {
  console.log("----- Menú -----");
  console.log("1. Opción 1");
  console.log("2. Opción 2");
  console.log("3. Opción 3");
  console.log("0. Salir");
  rl.question("Selecciona una opción: ", handleOpcion);
}

function handleOpcion(opcion: string) {
  switch (opcion) {
    case "1":
      print();
      break;
    case "2":
      console.log(`${nombres}`);
      console.log(`${nombres[0]}`)
      console.log(`${nombres[1]}`)
      for (let nomb of nombres)
        console.log(nomb)
      break;
    case "3":
      console.log("Has seleccionado la Opción 3");
      break;
    case "0":
      console.log("Saliendo...");
      rl.close();
      return;
    default:
      console.log("Opción no válida. Inténtalo de nuevo.");
  }
  mostrarMenu();
}

mostrarMenu();


function print(){
    console.log('Hola buenos dias.')
    rl.question('Ingrese su nombre: ', (nombre) => {
        console.log(`nombre ingresado ${nombre}`);
        nombres.push(nombre)
        mostrarMenu()
    })
    return 'Done'
}
