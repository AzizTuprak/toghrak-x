package com.mynewsblog.backend.repository;

import com.mynewsblog.backend.model.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostImageRepository extends JpaRepository<PostImage, Long> {
    // e.g., List<PostImage> findByPostId(Long postId);


}