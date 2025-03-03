package com.assistant.ai_assistant.controller;

import com.assistant.ai_assistant.model.AssistanceRequest;
import com.assistant.ai_assistant.service.AssistanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AssistanceController {

    private final AssistanceService service;

    @PostMapping("/getContent")
    public ResponseEntity<String> getContent(@RequestBody AssistanceRequest request){
        return ResponseEntity.ok().body(service.processContent(request));
    }
}
