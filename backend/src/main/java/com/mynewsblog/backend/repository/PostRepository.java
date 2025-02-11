package com.mynewsblog.backend.repository;

import com.mynewsblog.backend.model.Post;
import com.mynewsblog.backend.model.User;
import com.mynewsblog.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthor(User author);
    List<Post> findByCategory(Category category);
    // New: Allowing Admins to fetch unpublished posts if needed
    List<Post> findByAuthorId(Long authorId);
}