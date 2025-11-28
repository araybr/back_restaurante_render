import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MenuService } from '../../core/services/menu';

import { Usuario } from '../../shared/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario';

import { Ingrediente } from '../../shared/models/ingrediente.model';
import { IngredienteService } from '../../core/services/ingrediente';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-page.html',
  styleUrls: ['./admin-page.css']
})
export class AdminPage implements OnInit {

  usuarios: Usuario[] = [];

  nuevoProducto: {
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_url: string;
    tipo: string;
    ingredientes: Ingrediente[];
  } = {
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen_url: '',
    tipo: 'menu',
    ingredientes: []
  };

  ingredientes: Ingrediente[] = [];
  ingredienteSeleccionado: Ingrediente | null = null;

  nuevoIngrediente: Partial<Ingrediente> = {
    nombre: '',
    alergenos: []
  };

  constructor(
    private menuService: MenuService,
    private usuarioService: UsuarioService,
    private ingredienteService: IngredienteService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarIngredientes();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  cambiarRol(usuario: Usuario, rol: string) {
    this.usuarioService.actualizarRol(usuario.id, rol).subscribe(() => {
      usuario.rol = rol as any;
      alert('Rol actualizado');
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    this.usuarioService.deleteUsuario(id).subscribe(() => {
      this.usuarios = this.usuarios.filter(u => u.id !== id);
      alert("Usuario eliminado");
    });
  }

  agregarProducto() {
    const producto = {
      ...this.nuevoProducto,
      imagen_url: 'assets/images/' + this.nuevoProducto.imagen_url
    };

    switch (this.nuevoProducto.tipo) {
      case 'menu':
        this.menuService.crearMenu(producto).subscribe(() => alert('Menú añadido'));
        break;
      case 'bebida':
        this.menuService.crearBebida(producto).subscribe(() => alert('Bebida añadida'));
        break;
      case 'postre':
        this.menuService.crearPostre(producto).subscribe(() => alert('Postre añadido'));
        break;
    }

    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      imagen_url: '',
      tipo: 'menu',
      ingredientes: []
    };
  }

  cargarIngredientes() {
    this.ingredienteService.getIngredientes().subscribe(data => {
      this.ingredientes = data;
    });
  }


  agregarIngredienteProducto() {
    if (!this.ingredienteSeleccionado) return;

    if (!this.nuevoProducto.ingredientes.some(i => i.id_ingrediente === this.ingredienteSeleccionado!.id_ingrediente)) {
      this.nuevoProducto.ingredientes.push(this.ingredienteSeleccionado);
    }

    this.ingredienteSeleccionado = null;
  }

  quitarIngredienteProducto(ing: Ingrediente) {
    this.nuevoProducto.ingredientes = this.nuevoProducto.ingredientes.filter(
      i => i.id_ingrediente !== ing.id_ingrediente
    );
  }
}
