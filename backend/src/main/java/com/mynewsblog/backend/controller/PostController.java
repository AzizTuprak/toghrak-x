package com.mynewsblog.backend.controller;

import com.mynewsblog.backend.dto.CreatePostRequest;
import com.mynewsblog.backend.dto.DeletePostRequest;
import com.mynewsblog.backend.dto.UpdatePostRequest;
import com.mynewsblog.backend.dto.AddImagesRequest;
import com.mynewsblog.backend.model.Post;
import com.mynewsblog.backend.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 1) CREATE a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody CreatePostRequest request) {
        Post newPost = postService.createPost(
                request.getTitle(),
                request.getContent(),
                request.getAuthorId(),
                request.getCategoryId()
        );
        return ResponseEntity.ok(newPost);
    }

    // 2) GET all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // 3) GET single post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    // 4) UPDATE a post
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Long id,
            @RequestBody UpdatePostRequest request) {

        Post updatedPost = postService.updatePost(
                id,
                request.getRequestUserId(),
                request.getTitle(),
                request.getContent(),
                request.getCategoryId()
        );
        return ResponseEntity.ok(updatedPost);
    }

    // 5) DELETE a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @RequestBody DeletePostRequest request) {
        postService.deletePost(id, request.getRequestUserId());
        return ResponseEntity.noContent().build();
    }

    // 6) (Optional) ADD IMAGES
    @PostMapping("/{id}/images")
    public ResponseEntity<Post> addImages(
            @PathVariable Long id,
            @RequestBody AddImagesRequest request
    ) {
        Post postWithImages = postService.addImagesToPost(id, request.getImageUrls());
        return ResponseEntity.ok(postWithImages);
    }
}