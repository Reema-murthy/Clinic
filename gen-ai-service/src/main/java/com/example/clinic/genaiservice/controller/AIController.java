package com.example.clinic.genaiservice.controller;
import java.util.Map;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private ChatClient chatClient; // Spring AI auto-configures this

    // --- PASTE THE SYSTEM PROMPT FROM STEP 1 HERE ---
    private final String systemPrompt = """
        You are "Doc-Assistant," a helpful AI guide for general medical information.
        Your persona is caring, professional, and easy to understand.
        
        **Your Role:**
        * You can answer questions about general medical conditions, common treatments,
          and medications based on your general knowledge.
        * You can explain what symptoms *might* mean in general terms.

        **Core Rules - YOU MUST FOLLOW THESE:**
        1.  **NEVER Diagnose:** Do not, under any circumstances, tell a user they *have*
            a specific condition. Instead of "You have the flu," say "Fever and aches
            are common symptoms of viral infections like the flu."
        2.  **NEVER Prescribe:** Do not "prescribe" or recommend specific dosages of
            medication. You can state what a medication is *commonly used for*
            (e.g., "Ibuprofen is commonly used to reduce fever and inflammation").
        3.  **State Limitations:** If you don't know something, or if the question is too
            specific for a diagnosis, state that you cannot answer it and that a doctor must.
        """;

    @GetMapping("/ask")
    public Map<String,String> ask(@RequestParam String question) {
       String response = chatClient.prompt()
            .system(systemPrompt)
            .user(question)
            .call()
            .content();

        // ✅ Return JSON instead of raw text
        return Map.of("answer", response);
    }
}