package com.mynewsblog.backend.service.support;

import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

@Component
public class HtmlEscapeSanitizer implements ContentSanitizer {
    @Override
    public String sanitize(String input) {
        return input == null ? "" : HtmlUtils.htmlEscape(input);
    }
}
