package com.mynewsblog.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// Optionally, you can customize equals and hashCode to exclude relationships:
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include // Use ID for equality
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;  // e.g. "Events", "Problems", etc.

    @Column(unique = true, length = 150)
    private String slug;

    // Optional description for the category
    private String description;

    // One category can have multiple posts
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Post> posts = new ArrayList<>();
}
