import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../core/services/menu';
import { Pedido } from '../../core/services/pedido';
import { AuthService } from '../../core/services/auth';
import { Menu, Postre, Bebida } from '../../shared/models/producto.model';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menus.html',
  styleUrls: ['./menus.css']
})
export class Menus implements OnInit {
  menus: Menu[] = [];
  postres: Postre[] = [];
  bebidas: Bebida[] = [];
  usuarioId: number | null = null;
  usuarioLogueado: any = null;
  alergenosUsuario: string[] = [];

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

  constructor(
    private menuService: MenuService,
    private pedidoService: Pedido,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getUsuarioActual();
    this.usuarioId = usuario?.id ?? null;
    this.usuarioLogueado = usuario;

    if (this.usuarioId) {
      this.auth.getAlergenosUsuario(this.usuarioId).subscribe({
        next: (res) => {
          this.alergenosUsuario = res.map((a: any) => a.nombre);
        },
        error: (err) => console.error('Error cargando alérgenos', err)
      });
    }

    this.cargarProductos();
  }

  cargarProductos() {
    this.menuService.getMenus().subscribe((menusFromBackend: any[]) => {
      this.menus = menusFromBackend.map(menu => ({
        id: menu.id_menu,
        nombre: menu.nombre,
        descripcion: menu.descripcion,
        precio: menu.precio,
        imagen_url: menu.imagen_url,
        ingredientes: menu.ingredientes
      }));
    });

    this.menuService.getPostres().subscribe((postresFromBackend: any[]) => {
      this.postres = postresFromBackend.map(postre => ({
        id: postre.id_postre,
        nombre: postre.nombre,
        descripcion: postre.descripcion,
        precio: postre.precio,
        imagen_url: postre.imagen_url,
        ingredientes: postre.ingredientes
      }));
    });

    this.menuService.getBebidas().subscribe((bebidasFromBackend: any[]) => {
      this.bebidas = bebidasFromBackend.map(bebida => ({
        id: bebida.id_bebida,
        nombre: bebida.nombre,
        descripcion: bebida.descripcion,
        precio: bebida.precio,
        imagen_url: bebida.imagen_url,
        ingredientes: bebida.ingredientes
      }));
    });
  }

  agregarAlCarrito(tipo: 'menu' | 'postre' | 'bebida', producto: any) {
    if (!this.usuarioId) return alert('Debes iniciar sesión para añadir productos');

    const alergenosProducto = producto.ingredientes?.flatMap(
      (i: any) => i.alergenos?.map((a: any) => a.nombre) || []
    ) || [];

    const alergenosEnComun = this.alergenosUsuario.filter(a => alergenosProducto.includes(a));

    if (alergenosEnComun.length > 0) {
      const confirmacion = confirm(
        `¡Atención! Este producto contiene los siguientes alérgenos que tienes registrados: ${alergenosEnComun.join(', ')}.\n` +
        `¿Deseas añadirlo al carrito de todos modos?`
      );
      if (!confirmacion) return;
    }

    this.pedidoService.agregarAlCarrito(producto.id, tipo).subscribe({
      next: () => alert(`${producto.nombre} añadido al carrito`),
      error: (err) => console.error(err)
    });
  }

  eliminarProducto(tipo: 'menu' | 'postre' | 'bebida', id: number) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;

    this.menuService.eliminarProducto(tipo, id).subscribe({
      next: () => {
        alert('Producto eliminado');
        this.cargarProductos();
      },
      error: err => console.error('Error eliminando producto', err)
    });
  }

  getIconosAlergenos(producto: any): string[] {
    if (!producto?.ingredientes) return [];

    const alergenos = producto.ingredientes.flatMap(
      (ing: any) => ing.alergenos?.map((a: any) => this.alergenoIcons[a.nombre] || "") || []
    );

    return [...new Set<string>(alergenos)].filter(icon => icon !== "");
  }
}
