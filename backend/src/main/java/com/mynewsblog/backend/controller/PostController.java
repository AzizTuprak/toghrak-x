package com.mynewsblog.backend.controller;

import com.mynewsblog.backend.dto.CreatePostRequest;
import com.mynewsblog.backend.dto.PostResponseDTO;
import com.mynewsblog.backend.dto.UpdatePostRequest;
import com.mynewsblog.backend.model.Post;
import com.mynewsblog.backend.model.PostImage;
import com.mynewsblog.backend.security.UserPrincipal;
import com.mynewsblog.backend.service.PostService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@Slf4j
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 1) CREATE a new post
    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(
            @Valid @RequestBody CreatePostRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("Current User ID = {}", currentUser.getId()); // this line can be deleted, it was only for testing
        Post newPost = postService.createPost(
                request.getTitle(),
                request.getContent(),
                currentUser.getId(), // Get ID from UserPrincipal
                request.getCategoryId(),
                request.getCoverImage(), // Include the cover image URL
                request.getImageUrls()
        );
        return ResponseEntity.ok(toPostResponseDTO(newPost));
    }

    // // 2) GET all posts
    // @GetMapping
    // public List<PostResponseDTO> getAllPosts() {
    // List<Post> posts = postService.getAllPosts();
    // return posts.stream()
    // .map(this::toPostResponseDTO)
    // .toList();
    // }
    // paginated GET /api/posts
    @GetMapping
    public ResponseEntity<Page<PostResponseDTO>> getPosts(
            @org.springframework.data.web.PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(value = "categoryId", required = false) Long categoryId) {
        // hard cap page size to prevent abuse (e.g., max 50)
        int safeSize = Math.min(pageable.getPageSize(), 50);
        Pageable safePageable = PageRequest.of(pageable.getPageNumber(), safeSize, pageable.getSort());

        Page<PostResponseDTO> page = postService
                .getPosts(safePageable, categoryId)
                .map(this::toPostResponseDTO);

        return ResponseEntity.ok(page);
    }

    @GetMapping("/popular")
    public ResponseEntity<java.util.List<PostResponseDTO>> getPopular(
            @RequestParam(value = "limit", defaultValue = "6") int limit) {
        var popular = postService.getPopular(limit).stream()
                .map(this::toPostResponseDTO)
                .toList();
        return ResponseEntity.ok(popular);
    }

    // 3) GET single post by ID
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDTO> getPost(@PathVariable Long id) {
        Post post = postService.getPost(id);
        return ResponseEntity.ok(toPostResponseDTO(post));
    }

    // 4) UPDATE a post (Only the owner can update)
    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDTO> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Post updatedPost = postService.updatePost(
                id,
                currentUser.getId(),
                request.getTitle(),
                request.getContent(),
                request.getCategoryId(),
                request.getCoverImage(),
                request.getImageUrls());
        return ResponseEntity.ok(toPostResponseDTO(updatedPost));
    }

    // 5) DELETE a post (Only the owner or admin can delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        postService.deletePost(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    // Unified converter method to transform Post entity to PostResponseDTO
    private PostResponseDTO toPostResponseDTO(Post post) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setSlug(post.getSlug());
        dto.setContent(post.getContent());
        dto.setCoverImage(post.getCoverImage());
        dto.setCategoryId(post.getCategory().getId());
        dto.setCategoryName(post.getCategory().getName());
        dto.setAuthorUsername(post.getAuthor().getUsername());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setViewCount(post.getViewCount());
        dto.setImageUrls(
                post.getImages().stream()
                        .map(PostImage::getImageUrl)
                        .toList());
        return dto;

    }

}
