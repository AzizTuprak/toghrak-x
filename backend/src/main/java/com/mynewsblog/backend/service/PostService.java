package com.mynewsblog.backend.service;

import com.mynewsblog.backend.exception.ResourceNotFoundException;
import com.mynewsblog.backend.model.*;
import com.mynewsblog.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PostImageRepository postImageRepository;

    public PostService(PostRepository postRepository,
                       UserRepository userRepository,
                       CategoryRepository categoryRepository,
                       PostImageRepository postImageRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.postImageRepository = postImageRepository;
    }

    // 1️⃣ Create a new post
    public Post createPost(String title, String content, Long authorId, Long categoryId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id=" + authorId));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id=" + categoryId));

        Post post = Post.builder()
                .title(title)
                .content(content)
                .author(author)
                .category(category)
                .createdAt(LocalDateTime.now())
                .build();

        return postRepository.save(post);
    }

    // 2️⃣ Update an existing post
    public Post updatePost(Long postId, Long requestUserId, String newTitle, String newContent, Long newCategoryId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + postId));

        User currentUser = userRepository.findById(requestUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id=" + requestUserId));

        // 🔹 Ensure only the owner or an admin can update
        if (!isAdmin(currentUser) && !post.getAuthor().getId().equals(requestUserId)) {
            throw new RuntimeException("You can only update your own posts!");
        }

        if (newTitle != null && !newTitle.isBlank()) post.setTitle(newTitle);
        if (newContent != null && !newContent.isBlank()) post.setContent(newContent);

        if (newCategoryId != null) {
            Category category = categoryRepository.findById(newCategoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id=" + newCategoryId));
            post.setCategory(category);
        }

        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    // 3️⃣ Delete a post
    public void deletePost(Long postId, Long requestUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot delete. Post not found: " + postId));

        User currentUser = userRepository.findById(requestUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id=" + requestUserId));

        // 🔹 Only the owner or an admin can delete
        if (!isAdmin(currentUser) && !post.getAuthor().getId().equals(requestUserId)) {
            throw new RuntimeException("You can only delete your own posts!");
        }

        postRepository.deleteById(postId);
    }

    // 4️⃣ Retrieve a single post
    public Post getPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + postId));
    }

    // 5️⃣ List all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // 6️⃣ Attach multiple images to a post
    public Post addImagesToPost(Long postId, List<String> imageUrls) {
        Post post = getPost(postId);

        List<PostImage> images = imageUrls.stream()
                .map(url -> PostImage.builder().imageUrl(url).post(post).build())
                .toList();

        postImageRepository.saveAll(images);  // Persist images separately

        return post;
    }

    // 🔹 Utility: Check if the user is an admin
    private boolean isAdmin(User user) {
        return user.getRole() != null && "ADMIN".equals(user.getRole().getName());
    }
}
