package com.mynewsblog.backend.service;

import com.mynewsblog.backend.exception.ResourceNotFoundException;
import com.mynewsblog.backend.model.Category;
import com.mynewsblog.backend.repository.CategoryRepository;
import com.mynewsblog.backend.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;

    public CategoryService(CategoryRepository categoryRepository, PostRepository postRepository) {
        this.categoryRepository = categoryRepository;
        this.postRepository = postRepository;
    }

    public List<Category> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        categories.forEach(this::ensureSlug);
        return categories;
    }

    public Category getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id=" + id));
        ensureSlug(category);
        return category;
    }

    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug=" + slug));
    }

    public Category createCategory(String name, String description) {
        Category category = Category.builder()
                .name(name)
                .description(description)
                .build();
        ensureSlug(category);
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, String name, String description) {
        Category existing = getCategoryById(id);
        existing.setName(name);
        existing.setDescription(description);
        ensureSlug(existing);
        return categoryRepository.save(existing);
    }

    public void deleteCategory(Long id) {
        Category existing = getCategoryById(id);
        if (postRepository.existsByCategoryId(id)) {
            long n = postRepository.countByCategoryId(id);
            throw new DataIntegrityViolationException(
                    "Cannot delete category: there are still " + n + " post(s) assigned to it.");
        }
        categoryRepository.delete(existing);
    }

    private void ensureSlug(Category category) {
        if (category.getSlug() != null && !category.getSlug().isBlank()) {
            return;
        }
        String base = slugify(category.getName());
        String unique = ensureUniqueSlug(base, category.getId());
        category.setSlug(unique);
    }

    private String ensureUniqueSlug(String base, Long currentId) {
        String candidate = base;
        int i = 1;
        while (true) {
            var existing = categoryRepository.findBySlug(candidate);
            if (existing.isEmpty() || (currentId != null && existing.get().getId().equals(currentId))) {
                return candidate;
            }
            candidate = base + "-" + i;
            i++;
        }
    }

    private String slugify(String input) {
        String lower = input == null ? "" : input.toLowerCase().trim();
        String normalized = lower.replaceAll("[^a-z0-9]+", "-");
        normalized = normalized.replaceAll("-{2,}", "-");
        normalized = normalized.replaceAll("(^-+|-+$)", "");
        if (normalized.isBlank()) {
            normalized = "category";
        }
        return normalized;
    }
}
