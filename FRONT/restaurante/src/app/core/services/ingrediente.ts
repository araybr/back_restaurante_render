import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingrediente } from '../../shared/models/ingrediente.model';

@Injectable({ providedIn: 'root' })
export class IngredienteService {

  private apiUrl = 'http://localhost:8080/api/ingredientes'; // Ajusta si procede

  constructor(private http: HttpClient) {}

  getIngredientes(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(this.apiUrl);
  }

  crearIngrediente(ingrediente: Partial<Ingrediente>): Observable<Ingrediente> {
    return this.http.post<Ingrediente>(this.apiUrl, ingrediente);
  }

  eliminarIngrediente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
