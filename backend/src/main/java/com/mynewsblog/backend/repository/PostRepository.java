package com.mynewsblog.backend.repository;

import com.mynewsblog.backend.model.Post;
import com.mynewsblog.backend.model.User;
import com.mynewsblog.backend.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Find all posts created by a given author (using the User entity)
    List<Post> findByAuthor(User author);

    // Find all posts under a specific category (using the Category entity)
    List<Post> findByCategory(Category category);

    // Find all posts created by an author using their ID.
    // This method leverages property path navigation (author.id)
    List<Post> findByAuthorId(Long authorId);

    @EntityGraph(attributePaths = { "author", "category", "images" })
    Page<Post> findAll(@NonNull Pageable pageable);

    boolean existsByAuthorId(Long authorId);

    long countByAuthorId(Long authorId);
}
