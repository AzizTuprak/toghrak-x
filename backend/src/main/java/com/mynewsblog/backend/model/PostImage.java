package com.mynewsblog.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PostImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The location/URL of the image
    @Column(nullable = false)
    private String imageUrl;

    // Many images can belong to one Post
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}