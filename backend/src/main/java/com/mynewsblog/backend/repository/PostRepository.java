package com.mynewsblog.backend.repository;

import com.mynewsblog.backend.model.Category;
import com.mynewsblog.backend.model.Post;
import com.mynewsblog.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Find all posts created by a given author (using the User entity)
    List<Post> findByAuthor(User author);

    // Find all posts under a specific category (using the Category entity)
    List<Post> findByCategory(Category category);

    // Find all posts created by an author using their ID.
    // This method leverages property path navigation (author.id)
    List<Post> findByAuthorId(Long authorId);

    @EntityGraph(attributePaths = {"category", "author", "images"})
    @NonNull Page<Post> findAllBy(@NonNull Pageable pageable);

    @EntityGraph(attributePaths = {"category", "author", "images"})
    @NonNull Page<Post> findByCategoryId(Long categoryId, @NonNull Pageable pageable);

    @EntityGraph(attributePaths = {"category", "author", "images"})
    Optional<Post> findById(Long id);

    @EntityGraph(attributePaths = {"category", "author", "images"})
    Optional<Post> findBySlug(String slug);

    @EntityGraph(attributePaths = {"category", "author", "images"})
    List<Post> findTop6ByOrderByViewCountDescUpdatedAtDescCreatedAtDesc();

    boolean existsBySlug(String slug);

    boolean existsByAuthorId(Long authorId);

    long countByAuthorId(Long authorId);

    boolean existsByCategoryId(Long categoryId);

    long countByCategoryId(Long categoryId);

    @org.springframework.data.jpa.repository.Query(
            value = """
                    SELECT * FROM posts p
                    WHERE lower(p.title) LIKE lower(concat('%', :term, '%'))
                       OR lower(p.content) LIKE lower(concat('%', :term, '%'))
                    ORDER BY p.created_at DESC
                    LIMIT 10
                    """,
            nativeQuery = true)
    List<Post> searchTop10(@org.springframework.data.repository.query.Param("term") String term);
}
