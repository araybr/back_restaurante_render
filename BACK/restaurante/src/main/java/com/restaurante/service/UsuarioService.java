package com.restaurante.service;

import com.restaurante.model.Alergeno;
import com.restaurante.model.Usuario;
import com.restaurante.repository.AlergenoRepository;
import com.restaurante.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final AlergenoRepository alergenoRepo;

    public UsuarioService(UsuarioRepository usuarioRepo, AlergenoRepository alergenoRepo) {
        this.usuarioRepository = usuarioRepo;
        this.alergenoRepo = alergenoRepo;
    }

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> findById(int id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }


    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public void deleteById(int id) {
        usuarioRepository.deleteById(id);
    }

    public void agregarAlergeno(Usuario usuario, String nombreAlergeno) {
        Alergeno alergeno = alergenoRepo.findByNombre(nombreAlergeno)
                .orElseThrow(() -> new RuntimeException("Alergeno no encontrado: " + nombreAlergeno));

        if (!usuario.getAlergenos().contains(alergeno)) {
            usuario.getAlergenos().add(alergeno);
            usuarioRepository.save(usuario);
        }
    }

    public void eliminarAlergeno(Usuario usuario, String nombreAlergeno) {
        Alergeno alergeno = alergenoRepo.findByNombre(nombreAlergeno)
                .orElseThrow(() -> new RuntimeException("Alergeno no encontrado: " + nombreAlergeno));
        usuario.getAlergenos().remove(alergeno);
        usuarioRepository.save(usuario);
    }

}

