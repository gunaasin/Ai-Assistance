package com.assistant.ai_assistant.service;

import com.assistant.ai_assistant.model.AssistanceRequest;
import com.assistant.ai_assistant.model.GeminiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class AssistanceService {
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public AssistanceService(WebClient.Builder webclient , ObjectMapper objectMapper){
        this.webClient = webclient.build();
        this.objectMapper = objectMapper;
    }

    public String processContent(AssistanceRequest request) {
        String prompt = buildPrompt(request);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        String response =  webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return extractContentFromResponse(response);

    }

    private String extractContentFromResponse(String response) {
        try {
            var geminiResponse = objectMapper.readValue(response , GeminiResponse.class);
            if(geminiResponse.getCandidates()!=null && ! geminiResponse.getCandidates().isEmpty()){
                var firstCandidates = geminiResponse.getCandidates();
                if(firstCandidates.getFirst().getContent()!=null){
                    return  firstCandidates.getFirst().getContent().getParts().getFirst().getText();
                }
            }
            return "No content found in response";
        } catch (Exception e) {
            return "Parsing Error" + e.getMessage();
        }
    }

    private String buildPrompt(AssistanceRequest request){
        StringBuilder prompt = new StringBuilder();
        switch (request.getOperation()){
            case "summarize":
                prompt.append("Summarize the following text using bullet points only. \n" +
                        "Each key point should start with '*'. Do not include any introductory lines or explanations, just the bullet points.\n\n");
                break;
            case "suggest":
                prompt.append("Based on the following content: suggest related topics and further reading.\n")
                        .append("Format the response with clear headings, bullet points, and include links to relevant resources if available:\n\n");
                break;
            default:
                throw new IllegalCallerException("Unknown operation: " + request.getOperation());
        }
        prompt.append(request.getContent());
        return prompt.toString();
    }
}
