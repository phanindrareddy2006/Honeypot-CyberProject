package com.example.honeypot.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public Object[] analyzePayload(String payload) {
        if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.contains("replace")) {
            System.err.println("Gemini API key is missing. Using fallback analysis.");
            return AttackAnalyzer.analyze(payload);
        }

        try {
            String url = API_URL + "?key=" + geminiApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String prompt = "You are an elite cybersecurity AI SOC analyst. " +
                    "Analyze the following HTTP request payload and determine if it's an attack. " +
                    "Return ONLY a strictly valid JSON object in this exact format, with NO markdown blocks or backticks: \n"
                    +
                    "{ \"aiAttackType\": \"type String\", \"aiDescription\": \"short desc String\", " +
                    "\"aiSolution\": \"short mitigation String\", \"aiSeverity\": \"Low/Medium/High/Critical\", \"aiRiskScore\": integer_0_to_100 }\n\n"
                    +
                    "Payload to analyze: " + payload;

            // Gemini API payload structure
            Map<String, Object> parts = new HashMap<>();
            parts.put("text", prompt);

            Map<String, Object> contents = new HashMap<>();
            contents.put("parts", List.of(parts));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(contents));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = mapper.readTree(response.getBody());

                // Navigate Gemini response structure: candidates -> [0] -> content -> parts ->
                // [0] -> text
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    String responseText = textNode.asText().trim();

                    // Strip markdown in case the AI ignored instructions
                    if (responseText.startsWith("```json")) {
                        responseText = responseText.substring(7, responseText.length() - 3).trim();
                    } else if (responseText.startsWith("```")) {
                        responseText = responseText.substring(3, responseText.length() - 3).trim();
                    }

                    JsonNode resultJson = mapper.readTree(responseText);

                    if (resultJson.has("aiAttackType")) {
                        return new Object[] {
                                resultJson.path("aiAttackType").asText("Suspicious"),
                                resultJson.path("aiDescription").asText("Anomaly detected by AI"),
                                resultJson.path("aiSolution").asText("Investigate payload manually"),
                                resultJson.path("aiSeverity").asText("Medium"),
                                resultJson.path("aiRiskScore").asInt(60)
                        };
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
        }

        // Fallback to static analyzer if AI fails
        return AttackAnalyzer.analyze(payload);
    }
}
