import { Ingrediente } from "./ingrediente.model"

export interface Menu {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url?: string;
  ingredientes?: Ingrediente[];
}

export interface Postre {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url?: string;
  ingredientes?: Ingrediente[];
}

export interface Bebida {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url?: string;
  ingredientes?: Ingrediente[];
}
