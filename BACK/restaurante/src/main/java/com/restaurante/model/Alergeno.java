// Alergeno.java
package com.restaurante.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Alergeno")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alergeno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_alergeno;

    private String nombre;
    private String descripcion;

    @ManyToMany(mappedBy = "alergenos")
    private Set<Usuario> usuarios;

    @ManyToMany(mappedBy = "alergenos")
    private Set<Ingrediente> ingredientes;
}
