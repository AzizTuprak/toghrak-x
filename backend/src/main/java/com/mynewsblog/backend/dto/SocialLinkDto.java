package com.mynewsblog.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialLinkDto {
    private Long id;
    private String label;
    private String url;
    private String icon;
}
