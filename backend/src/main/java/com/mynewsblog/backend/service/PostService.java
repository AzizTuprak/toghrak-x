package com.mynewsblog.backend.service;

import com.mynewsblog.backend.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import com.mynewsblog.backend.model.*;
import com.mynewsblog.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.mynewsblog.backend.model.Post;
import com.mynewsblog.backend.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public PostService(PostRepository postRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    // 1️⃣ Create a new post
    public Post createPost(String title, String content, Long authorId, Long categoryId, String coverImage, List<String> imageUrls) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id=" + authorId));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id=" + categoryId));

        Post post = Post.builder()
                .title(title)
                .content(sanitize(content))
                .author(author)
                .category(category)
                .coverImage(coverImage)
                .createdAt(LocalDateTime.now())
                .build();

        setImages(post, imageUrls);

        return postRepository.save(post);
    }

    // 2️⃣ Update an existing post
    public Post updatePost(Long postId, Long requestUserId, String newTitle, String newContent, Long newCategoryId,
            String newCoverImage, List<String> imageUrls) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + postId));

        User currentUser = userRepository.findById(requestUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id=" + requestUserId));

        // Ensure only the owner or an admin can update
        User author = post.getAuthor();
        if (author == null) {
            throw new ResourceNotFoundException("Post author missing for post: " + postId);
        }
        if (!isAdmin(currentUser) && !author.getId().equals(requestUserId)) {
            throw new AccessDeniedException("You can only update your own posts!");
        }

        if (newTitle != null && !newTitle.isBlank()) {
            post.setTitle(newTitle);
        }
        if (newContent != null && !newContent.isBlank()) {
            post.setContent(sanitize(newContent));
        }
        if (newCategoryId != null) {
            Category category = categoryRepository.findById(newCategoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id=" + newCategoryId));
            post.setCategory(category);
        }
        if (newCoverImage != null && !newCoverImage.isBlank()) {
            post.setCoverImage(newCoverImage);
        }

        if (imageUrls != null) {
            setImages(post, imageUrls);
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

        User author = post.getAuthor();
        if (author == null) {
            throw new ResourceNotFoundException("Post author missing for post: " + postId);
        }
        // Ensure only the owner or an admin can delete
        if (!isAdmin(currentUser) && !author.getId().equals(requestUserId)) {
            throw new AccessDeniedException("You can only delete your own posts!");
        }

        postRepository.deleteById(postId);
    }

    // 4️⃣ Retrieve a single post
    public Post getPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + postId));
        long currentViews = post.getViewCount() == null ? 0 : post.getViewCount();
        post.setViewCount(currentViews + 1);
        return postRepository.save(post);
    }

    // 5️⃣ List all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // NEW: paginated listing
    public Page<Post> getPosts(Pageable pageable, Long categoryId) {
        if (categoryId != null) {
            return postRepository.findByCategoryId(categoryId, pageable);
        }
        return postRepository.findAll(pageable);
    }

    public List<Post> getPopular(int limit) {
        int size = Math.min(Math.max(limit, 1), 20);
        Pageable p = PageRequest.of(0, size, Sort.by(
                Sort.Order.desc("viewCount"),
                Sort.Order.desc("updatedAt"),
                Sort.Order.desc("createdAt")
        ));
        return postRepository.findAll(p).getContent();
    }

    // Utility: Check if the user is an admin
    private boolean isAdmin(User user) {
        return user.getRole() != null && "ADMIN".equals(user.getRole().getName());
    }

    private void setImages(Post post, List<String> imageUrls) {
        post.getImages().clear();
        if (imageUrls == null) {
            return;
        }
        List<PostImage> newImages = new ArrayList<>();
        for (String url : imageUrls) {
            if (url == null || url.isBlank()) {
                continue;
            }
            newImages.add(PostImage.builder()
                    .imageUrl(url)
                    .post(post)
                    .build());
        }
        post.getImages().addAll(newImages);
    }

    private String sanitize(String html) {
        return html == null ? "" : HtmlUtils.htmlEscape(html);
    }
}
