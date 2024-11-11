export default class Alumno{
    nombre: string;
    carnet: number;
    nota: number;

    constructor(nombre: string, carnet: number, nota: number){
        this.nombre = nombre;
        this.carnet = carnet;
        this.nota = nota;
    }
}