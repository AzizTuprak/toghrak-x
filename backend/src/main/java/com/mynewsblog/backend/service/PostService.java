package com.mynewsblog.backend.service;

import com.mynewsblog.backend.exception.ResourceNotFoundException;
import com.mynewsblog.backend.model.*;
import com.mynewsblog.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    // 1) Create a new post
    public Post createPost(String title, String content, Long authorId, Long categoryId) {
        // find user (author)
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id=" + authorId));

        // find category
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

    // 2) Update an existing post
    public Post updatePost(Long postId,Long requestUserId, String newTitle, String newContent, Long newCategoryId) {

        // 1) Retrieve the post
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + postId));

        //newly added code
        // 2) Retrieve the current user making this request
        User currentUser = userRepository.findById(requestUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id=" + requestUserId));

        // 3) Check if currentUser is admin or if post is owned by them
        if (!isAdmin(currentUser)) {
            // must be the owner
            if (!post.getAuthor().getId().equals(requestUserId)) {
                throw new ResourceNotFoundException("You can only update your own posts!");
            }
        }
        // newly added code

        // 4) Do the updates
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
    }


    // 3) Delete a post
    public void deletePost(Long postId, Long requestUserId) {

        // 1) Retrieve the post first
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot delete. Post not found: " + postId));

        //newly added code
        // 2) Retrieve the current user making this request
        User currentUser = userRepository.findById(requestUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id=" + requestUserId));

        // 3) Check if currentUser is admin or if post is owned by them
        if (!isAdmin(currentUser)) {
            // must be the owner
            if (!post.getAuthor().getId().equals(requestUserId)) {
                throw new ResourceNotFoundException("You can only delete your own posts!");
            }
        }
        // newly added code

        // 4) Delete the post
        postRepository.deleteById(postId);
    }

    // to check if current user is admin
//    private boolean isAdmin(User user) {
//        return user.getRole().getName().equals("ADMIN");
//    }
    private boolean isAdmin(User user) {
        return user.getRole() != null && "ADMIN".equals(user.getRole().getName());
    }

    // 4) Retrieve a single post
    public Post getPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + postId));
    }

    // 5) List all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // 6) Optional: attach multiple images to an existing post
    public Post addImagesToPost(Long postId, List<String> imageUrls) {
//        Post post = getPost(postId);
//
//        for (String url : imageUrls) {
//            PostImage image = PostImage.builder()
//                    .imageUrl(url)
//                    .post(post)
//                    .build();
//            post.getImages().add(image);  // sync in memory
//        }
//        // Cascade = ALL => saving the post also saves images
//        return postRepository.save(post);
        Post post = getPost(postId);

        List<PostImage> images = imageUrls.stream()
                .map(url -> PostImage.builder().imageUrl(url).post(post).build())
                .toList();

        postImageRepository.saveAll(images);  // Persist images separately

        return post;
    }
}