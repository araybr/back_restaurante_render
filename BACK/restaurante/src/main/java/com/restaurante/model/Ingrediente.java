package com.restaurante.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Ingrediente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true) // 💡 solo incluimos el ID
public class Ingrediente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id_ingrediente;

    private String nombre;

    @ManyToMany(mappedBy = "ingredientes")
    @JsonIgnore
    private Set<Menu> menus;

    @ManyToMany(mappedBy = "ingredientes")
    @JsonIgnore
    private Set<Postre> postres;

    @ManyToMany(mappedBy = "ingredientes")
    @JsonIgnore
    private Set<Bebida> bebidas;

    @ManyToMany
    @JoinTable(
            name = "Ingrediente_Alergeno",
            joinColumns = @JoinColumn(name = "id_ingrediente"),
            inverseJoinColumns = @JoinColumn(name = "id_alergeno")
    )
    private Set<Alergeno> alergenos;
}
