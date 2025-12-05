package com.mynewsblog.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Page {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, length = 200)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
