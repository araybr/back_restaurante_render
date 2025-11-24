import { Alergeno } from "./alergeno.model";

export interface Ingrediente {
  id_ingrediente: number;
  nombre: string;
  alergenos: Alergeno[];
}
