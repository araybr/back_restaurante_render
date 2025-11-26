package com.restaurante.controller;

import com.restaurante.model.Alergeno;
import com.restaurante.model.Rol;
import com.restaurante.model.Usuario;
import com.restaurante.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> getAll() {
        return usuarioService.getAllUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getById(@PathVariable Integer id) {
        return usuarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/alergenos")
    public ResponseEntity<?> getAlergenosUsuario(@PathVariable Integer id) {
        Optional<Usuario> usuarioOpt = usuarioService.findById(id);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = usuarioOpt.get();

        var alergenosLimpios = usuario.getAlergenos().stream()
                .map(a -> {
                    var alerg = new Alergeno();
                    alerg.setId_alergeno(a.getId_alergeno());
                    alerg.setNombre(a.getNombre());
                    alerg.setDescripcion(a.getDescripcion());
                    return alerg;
                })
                .toList();

        return ResponseEntity.ok(alergenosLimpios);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario user) {
        Usuario u = usuarioService.findByEmail(user.getEmail()).orElse(null);
        if (u != null && u.getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(u);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PatchMapping("/{id}/rol")
    public ResponseEntity<Usuario> updateRol(@PathVariable Integer id, @RequestBody String rolString) {

        Optional<Usuario> optionalUsuario = usuarioService.findById(id);

        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Usuario usuario = optionalUsuario.get();

        try {
            Rol nuevoRol = Rol.valueOf(rolString.replace("\"", ""));
            usuario.setRol(nuevoRol);
            Usuario actualizado = usuarioService.save(usuario);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody Usuario user) {
        if (usuarioService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Usuario nuevo = usuarioService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }


    @PostMapping
    public Usuario create(@RequestBody Usuario usuario) {
        return usuarioService.save(usuario);
    }

    @PostMapping("/{id}/alergenos")
    public ResponseEntity<?> agregarAlergenoUsuario(@PathVariable Integer id, @RequestBody String nombreAlergeno) {
        Optional<Usuario> usuarioOpt = usuarioService.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = usuarioOpt.get();

        try {
            usuarioService.agregarAlergeno(usuario, nombreAlergeno.replace("\"", ""));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable Integer id, @RequestBody Usuario usuario) {
        return usuarioService.findById(id)
                .map(existing -> {
                    existing.setNombre(usuario.getNombre());
                    existing.setApellidos(usuario.getApellidos());
                    existing.setEmail(usuario.getEmail());
                    existing.setPassword(usuario.getPassword());
                    existing.setTelefono(usuario.getTelefono());
                    existing.setRol(usuario.getRol());
                    existing.setActivo(usuario.getActivo());
                    return ResponseEntity.ok(usuarioService.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/alergenos/{nombreAlergeno}")
    public ResponseEntity<?> eliminarAlergenoUsuario(@PathVariable Integer id, @PathVariable String nombreAlergeno) {
        Optional<Usuario> usuarioOpt = usuarioService.findById(id);
        if (usuarioOpt.isEmpty()) return ResponseEntity.notFound().build();

        Usuario usuario = usuarioOpt.get();
        try {
            usuarioService.eliminarAlergeno(usuario, nombreAlergeno);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
