package com.mynewsblog.backend.repository;

import com.mynewsblog.backend.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface PageRepository extends JpaRepository<Page, Long> {
    Optional<Page> findBySlug(String slug);
    boolean existsBySlug(String slug);

    @Query(value = """
            SELECT * FROM pages p
            WHERE lower(p.title) LIKE lower(concat('%', :term, '%'))
               OR lower(p.content) LIKE lower(concat('%', :term, '%'))
            ORDER BY p.updated_at DESC
            LIMIT 10
            """, nativeQuery = true)
    List<Page> searchTop10(@Param("term") String term);
}
