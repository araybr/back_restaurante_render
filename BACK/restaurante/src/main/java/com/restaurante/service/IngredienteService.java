package com.restaurante.service;

import com.restaurante.model.Ingrediente;
import com.restaurante.repository.IngredienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredienteService {

    private final IngredienteRepository ingredienteRepository;

    public IngredienteService(IngredienteRepository ingredienteRepository) {
        this.ingredienteRepository = ingredienteRepository;
    }

    public List<Ingrediente> findAll() {
        return ingredienteRepository.findAll();
    }

    public Ingrediente findById(Integer id) {
        return ingredienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingrediente no encontrado"));
    }

    public Ingrediente create(Ingrediente ingrediente) {
        return ingredienteRepository.save(ingrediente);
    }

    public void delete(Integer id) {
        ingredienteRepository.deleteById(id);
    }
}
