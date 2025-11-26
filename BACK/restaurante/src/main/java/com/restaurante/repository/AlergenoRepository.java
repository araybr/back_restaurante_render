// AlergenoRepository.java
package com.restaurante.repository;

import com.restaurante.model.Alergeno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlergenoRepository extends JpaRepository<Alergeno, Integer> {
    Optional<Alergeno> findByNombre(String nombre);
}
