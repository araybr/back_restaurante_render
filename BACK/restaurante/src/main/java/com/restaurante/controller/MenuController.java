package com.restaurante.controller;

import com.restaurante.model.Menu;
import com.restaurante.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin(origins = "http://localhost:4200")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public List<Menu> getAll() {
        return menuService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Menu> getById(@PathVariable Integer id) {
        return menuService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Menu create(@RequestBody Menu menu) {
        return menuService.save(menu);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> update(@PathVariable Integer id, @RequestBody Menu menu) {
        return menuService.findById(id)
                .map(existing -> {
                    existing.setNombre(menu.getNombre());
                    existing.setDescripcion(menu.getDescripcion());
                    existing.setCategoria(menu.getCategoria());
                    existing.setPrecio(menu.getPrecio());
                    existing.setImagen_url(menu.getImagen_url());
                    existing.setEspecialidad(menu.getEspecialidad());
                    existing.setMas_vendido(menu.getMas_vendido());
                    existing.setIngredientes(menu.getIngredientes());
                    return ResponseEntity.ok(menuService.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        menuService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
