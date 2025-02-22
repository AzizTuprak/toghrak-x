package com.mynewsblog.backend.service;

import com.mynewsblog.backend.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
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
    public Post createPost(String title, String content, Long authorId, Long categoryId, String coverImage) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id=" + authorId));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id=" + categoryId));

        Post post = Post.builder()
                .title(title)
                .content(content)
                .author(author)
                .category(category)
                .coverImage(coverImage)  // Set the cover image URL
                .createdAt(LocalDateTime.now()) // Optionally, you can rely on the entity's @PrePersist instead of manually setting createdAt.
                .build();

        return postRepository.save(post);
    }

    // 2️⃣ Update an existing post
    public Post updatePost(Long postId, Long requestUserId, String newTitle, String newContent, Long newCategoryId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + postId));

        User currentUser = userRepository.findById(requestUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id=" + requestUserId));

        // Ensure only the owner or an admin can update
        if (!isAdmin(currentUser) && !post.getAuthor().getId().equals(requestUserId)) {
            throw new AccessDeniedException("You can only update your own posts!");
        }

        if (newTitle != null && !newTitle.isBlank()) {
            post.setTitle(newTitle);
        }
        if (newContent != null && !newContent.isBlank()) {
            post.setContent(newContent);
        }
        if (newCategoryId != null) {
            Category category = categoryRepository.findById(newCategoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id=" + newCategoryId));
            post.setCategory(category);
        }

        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);

//        if (imageUrls != null && !imageUrls.isEmpty()) {
//            for (String url : imageUrls) {
//                PostImage pi = PostImage.builder()
//                        .imageUrl(url)
//                        .post(post)
//                        .build();
//                postImageRepository.save(pi);
//                // Optionally add the image to post.getImages() if needed
//            }
//        }
//        return post;
    }

    // 3️⃣ Delete a post
    public void deletePost(Long postId, Long requestUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot delete. Post not found: " + postId));

        User currentUser = userRepository.findById(requestUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id=" + requestUserId));

        // Ensure only the owner or an admin can delete
        if (!isAdmin(currentUser) && !post.getAuthor().getId().equals(requestUserId)) {
            throw new AccessDeniedException("You can only delete your own posts!");
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


    // Utility: Check if the user is an admin
    private boolean isAdmin(User user) {
        return user.getRole() != null && "ADMIN".equals(user.getRole().getName());
    }
}
