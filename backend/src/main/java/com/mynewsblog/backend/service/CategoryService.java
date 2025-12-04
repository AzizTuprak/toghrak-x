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
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id=" + id));
    }

    public Category createCategory(String name, String description) {
        Category category = Category.builder()
                .name(name)
                .description(description)
                .build();
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, String name, String description) {
        Category existing = getCategoryById(id);
        existing.setName(name);
        existing.setDescription(description);
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
}
