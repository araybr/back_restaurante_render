import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Usuario } from '../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.getUsuarioFromLocalStorage());
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, usuario).pipe(
      tap(res => {
        localStorage.setItem('usuario', JSON.stringify(res));
        this.usuarioSubject.next(res);
      })
    );
  }

  register(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}`, usuario);
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  private getUsuarioFromLocalStorage(): Usuario | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  getAlergenosUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/alergenos`);
  }

}
