import readlineSync from "readline-sync";
import Tree23 from "./tree23";
import Alumno from "./alumno";

let tree: Tree23 | null = null;

function mostrarMenu() {
    console.log("\n--- Menú de opciones ---");
    console.log("1. Almacenamiento de estudiantes");
    console.log("2. Búsqueda de estudiantes por promedio");
    console.log("3. Eliminación de estudiantes");
    console.log("4. Salir");
    console.log("-------------------------");
}

function almacenarEstudiante() {
    const nombre = readlineSync.question("Ingrese el nombre del estudiante: ");
    const carnet = parseInt(readlineSync.question("Ingrese el carnet del estudiante: "));
    const nota = parseFloat(readlineSync.question("Ingrese el promedio del estudiante: "));

    if (isNaN(carnet) || isNaN(nota)) {
        console.log("El carnet y el promedio deben ser números reales o enteros.");
        return;
    }

    const nuevoAlumno = new Alumno(nombre, carnet, nota);

    if (tree === null) {
        tree = new Tree23(nuevoAlumno);
    } else {
        tree.insert(nuevoAlumno);
    }

    console.log(`Estudiante ${nombre} con carnet ${carnet} y promedio ${nota} almacenado correctamente.`);
}

function buscarEstudiante() {
    console.log("\n--- Búsqueda de Estudiante ---");
    console.log("1. Buscar por promedio exacto");
    console.log("2. Buscar por rango de promedios");
    const opcionBusqueda = readlineSync.question("Seleccione una opción: ");

    if (opcionBusqueda === "1") {
        const nota = parseFloat(readlineSync.question("Ingrese el promedio del estudiante a buscar: "));

        if (isNaN(nota)) {
            console.log("El promedio debe ser un número válido.");
            return;
        }

        if (tree) {
            const resultado = tree.searchData(nota);
            if (resultado) {
                console.log(`Resultado de búsqueda:\n${resultado}`);
            } else {
                console.log(`No se encontró ningún estudiante con promedio ${nota}.`);
            }
        } else {
            console.log("No hay estudiantes almacenados en el sistema.");
        }

    } else if (opcionBusqueda === "2") {
        const minNota = parseFloat(readlineSync.question("Ingrese el promedio mínimo: "));
        const maxNota = parseFloat(readlineSync.question("Ingrese el promedio máximo: "));

        if (isNaN(minNota) || isNaN(maxNota) || minNota > maxNota) {
            console.log("Por favor, ingrese un rango válido de promedios.");
            return;
        }

        if (tree) {
            const resultados = tree.searchInRange(minNota, maxNota);
            if (resultados.length > 0) {
                console.log("Estudiantes encontrados en el rango:");
                resultados.forEach((alumno, index) => {
                    console.log(`${index + 1}. ${alumno.nombre} - Carnet: ${alumno.carnet} - Promedio: ${alumno.nota}`);
                });
            } else {
                console.log(`No se encontraron estudiantes con promedios entre ${minNota} y ${maxNota}.`);
            }
        } else {
            console.log("No hay estudiantes almacenados en el sistema.");
        }
    } else {
        console.log("Opción no válida. Intente de nuevo.");
    }
}

function eliminarEstudiante() {
    const nota = parseFloat(readlineSync.question("Ingrese el promedio del estudiante a eliminar: "));

    if (isNaN(nota)) {
        console.log("El promedio debe ser un número válido.");
        return;
    }

    if (tree) {
        tree.delete(nota);
        console.log(`Estudiante con promedio ${nota} eliminado del sistema (si existía).`);
    } else {
        console.log("No hay estudiantes almacenados en el sistema.");
    }
}

function main() {
    let opcion: string;

    do {
        mostrarMenu();
        opcion = readlineSync.question("Seleccione una opción: ");

        switch (opcion) {
            case "1":
                almacenarEstudiante();
                break;
            case "2":
                buscarEstudiante();
                break;
            case "3":
                eliminarEstudiante();
                break;
            case "4":
                console.log("Saliendo del programa.");
                break;
            default:
                console.log("Opción no válida. Intente de nuevo.");
                break;
        }
    } while (opcion !== "4");
}

main();

//npm install readline-sync
