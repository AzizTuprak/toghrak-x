package com.toghrak.backend.service.support;

import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

@Component
public class HtmlEscapingSanitizer implements UserContentSanitizer {
    @Override
    public String sanitize(String input) {
        return input == null ? "" : HtmlUtils.htmlEscape(input);
    }
}
