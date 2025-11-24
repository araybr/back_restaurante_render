import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { Pedido } from '../../core/services/pedido';
import { Usuario } from '../../shared/models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  usuario: Usuario | null = null;
  carrito: any = null;
  loading: boolean = false;
  alergenosUsuario: any[] = [];

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
      next: (res) => this.alergenosUsuario = res,
      error: (err) => console.error('Error cargando alérgenos', err)
    });
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

  // 🔹 Cambiar cantidad de un producto
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
