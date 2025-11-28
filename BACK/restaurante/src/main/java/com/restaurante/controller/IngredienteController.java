package com.restaurante.controller;

import com.restaurante.model.Ingrediente;
import com.restaurante.service.IngredienteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredientes")
@CrossOrigin(origins = "*")
public class IngredienteController {

    private final IngredienteService ingredienteService;

    public IngredienteController(IngredienteService ingredienteService) {
        this.ingredienteService = ingredienteService;
    }

    @GetMapping
    public List<Ingrediente> getAll() {
        return ingredienteService.findAll();
    }

    @GetMapping("/{id}")
    public Ingrediente getById(@PathVariable Integer id) {
        return ingredienteService.findById(id);
    }

    @PostMapping
    public Ingrediente create(@RequestBody Ingrediente ingrediente) {
        return ingredienteService.create(ingrediente);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        ingredienteService.delete(id);
    }
}
