package com.mynewsblog.backend.repository;

import com.mynewsblog.backend.model.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostImageRepository extends JpaRepository<PostImage, Long> {
    // e.g., List<PostImage> findByPostId(Long postId);
    List<PostImage> findByPostId(Long postId);  // Useful if you need to fetch images for a post



}