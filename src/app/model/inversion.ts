export class Inversion {
    id?: number;
    nombre: string;
    precioEntrada: number;
    cantInvertida: number;

    constructor(nombre: string, precioEntrada: number, cantInvertida: number){
        this.nombre = nombre;
        this.precioEntrada = precioEntrada;
        this.cantInvertida = cantInvertida;
    }
}
