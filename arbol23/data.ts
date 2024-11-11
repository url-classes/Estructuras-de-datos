import Alumno from "./alumno";

export default class Data {
    public key: number; 
    public payload: Alumno;

    constructor(alumno: Alumno) {
        this.key = alumno.nota;
        this.payload = alumno;
    }
}