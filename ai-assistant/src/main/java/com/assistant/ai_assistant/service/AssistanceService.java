package com.assistant.ai_assistant.service;

import com.assistant.ai_assistant.model.AssistanceRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AssistanceService {
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final WebClient webClient;

    public String processContent(AssistanceRequest request) {
        String prompt = buildPrompt(request);

        Map<String , Object> requestBody = Map.of(         // api Query
                                            "content",new Object[]{
                                                    "parts" , new Object[]{
                                                            "text" , prompt
                                            }});

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

        } catch (Exception e) {
            return "Parsing Error" + e.getMessage();
        }
    }


    private String buildPrompt(AssistanceRequest request){
        StringBuilder prompt = new StringBuilder();
        switch (request.getOperation()){
            case "summarize":
                prompt.append("Provide a clear content and concise summary of the following text in a few sentences : \n\n");
                break;
            case "suggest":
                prompt.append("Based on the following content: suggest related topics and further reading. Format the response with clear heading and bullet points:\n\n");
                break;
            default:
                throw new IllegalCallerException("Unknown operation: " + request.getOperation());
        }
        prompt.append(request.getContent());
        return prompt.toString();
    }
}
