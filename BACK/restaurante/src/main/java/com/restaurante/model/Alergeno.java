// Alergeno.java
package com.restaurante.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Alergeno")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Alergeno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_alergeno;

    private String nombre;
    private String descripcion;

    @ManyToMany(mappedBy = "alergenos")
    @JsonIgnore
    private Set<Usuario> usuarios;

    @ManyToMany(mappedBy = "alergenos")
    @JsonIgnore
    private Set<Ingrediente> ingredientes;
}
