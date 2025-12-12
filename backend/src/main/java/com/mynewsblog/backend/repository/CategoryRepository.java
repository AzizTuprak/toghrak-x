package com.mynewsblog.backend.repository;

import com.mynewsblog.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
