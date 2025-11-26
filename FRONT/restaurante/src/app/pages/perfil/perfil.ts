import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { Pedido } from '../../core/services/pedido';
import { Usuario } from '../../shared/models/usuario.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  usuario: Usuario | null = null;
  carrito: any = null;
  loading: boolean = false;
  alergenosUsuario: any[] = [];

  nuevoAlergeno: string = "";

  todosAlergenos: string[] = [
    "Gluten", "Crustáceos", "Huevos", "Pescado", "Cacahuetes",
    "Soja", "Lácteos", "Frutos de cáscara", "Apio", "Mostaza",
    "Sésamo", "Sulfitos", "Altramuces", "Moluscos"
  ];

  alergenoIcons: { [nombre: string]: string } = {
    "Gluten": "assets/images/gluten.png",
    "Crustáceos": "assets/images/crustaceos.png",
    "Huevos": "assets/images/huevos.png",
    "Pescado": "assets/images/pescado.png",
    "Cacahuetes": "assets/images/cacahuetes.png",
    "Soja": "assets/images/soja.png",
    "Lácteos": "assets/images/lacteos.png",
    "Frutos de cáscara": "assets/images/frutos-cascara.png",
    "Apio": "assets/images/apio.png",
    "Mostaza": "assets/images/mostaza.png",
    "Sésamo": "assets/images/sesamo.png",
    "Sulfitos": "assets/images/sulfitos.png",
    "Altramuces": "assets/images/altramuces.png",
    "Moluscos": "assets/images/moluscos.png"
  };

  constructor(private auth: AuthService, private pedidoService: Pedido) {}

  ngOnInit(): void {
    this.usuario = this.auth.getUsuarioActual();
    if (this.usuario) {
      this.cargarCarrito();
      this.cargarAlergenos()
    }
  }

  cargarAlergenos(): void {
    if (!this.usuario) return;

    this.auth.getAlergenosUsuario(this.usuario.id).subscribe({
      next: (res) => {
        this.alergenosUsuario = res;
      },
      error: (err) => console.error('Error cargando alérgenos', err)
    });
  }

  agregarAlergeno(): void {
    if (!this.usuario || !this.nuevoAlergeno) return;

    // Comprobar si ya existe
    if (this.alergenosUsuario.some(a => a.nombre === this.nuevoAlergeno)) {
      return alert('Este alergeno ya está registrado.');
    }

    this.auth.agregarAlergenoUsuario(this.usuario.id, this.nuevoAlergeno).subscribe({
      next: () => {
        this.alergenosUsuario.push({ nombre: this.nuevoAlergeno });
        this.nuevoAlergeno = "";
        alert('Alergeno añadido correctamente.');
      },
      error: (err) => console.error('Error añadiendo alergeno', err)
    });
  }

  eliminarAlergeno(alergeno: any): void {
    if (!this.usuario) return;
    if (!confirm(`¿Seguro que quieres eliminar la alergia ${alergeno.nombre}?`)) return;

    this.auth.eliminarAlergenoUsuario(this.usuario.id, alergeno.nombre).subscribe({
      next: () => {
        this.alergenosUsuario = this.alergenosUsuario.filter(a => a.nombre !== alergeno.nombre);
        alert('Alergeno eliminado.');
      },
      error: (err) => console.error('Error eliminando alergeno', err)
    });
  }


  getIconosAlergenosUsuario(): string[] {
    return this.alergenosUsuario
      .map(a => this.alergenoIcons[a.nombre] || "")
      .filter(icon => icon !== "");
  }


  private normalizarCarrito(rawCarrito: any): any {
    const detalles = rawCarrito.detalles.map((item: any) => {
      const tipo = item.menu ? 'menu' : item.postre ? 'postre' : 'bebida';
      const producto = item.menu || item.postre || item.bebida;

      return {
        ...item,
        tipo,
        nombre: producto?.nombre,   // mostrar en la vista
        precio_unitario: producto?.precio || item.precio_unitario,
        cantidad: item.cantidad
      };
    });

    const total = detalles.reduce(
      (sum: number, item: any) => sum + item.precio_unitario * item.cantidad,
      0
    );

    return { ...rawCarrito, detalles, total };
  }


  cargarCarrito(): void {
    this.pedidoService.obtenerCarrito().subscribe({
      next: (res) => this.carrito = this.normalizarCarrito(res),
      error: (err) => console.error(err)
    });
  }

  eliminarDetalle(idDetalle: number) {
    this.pedidoService.eliminarDetalle(idDetalle).subscribe({
      next: () => this.cargarCarrito(),
      error: (err) => console.error(err)
    });
  }


  cambiarCantidad(item: any, delta: number) {
    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad < 1) return;

    this.pedidoService.actualizarCantidad(item.id_detalle, nuevaCantidad).subscribe({
      next: () => this.cargarCarrito(),
      error: (err) => console.error(err)
    });
  }

  finalizarPedido() {
    this.pedidoService.finalizarPedido().subscribe({
      next: () => {
        alert('Pedido finalizado');
        this.cargarCarrito();
      },
      error: (err) => console.error(err)
    });
  }
}
