package com.assistant.ai_assistant.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AssistanceRequest {
    private String content;
    private String operation;
}
