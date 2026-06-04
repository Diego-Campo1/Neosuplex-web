package com.neosuplex.neosuplexapi;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5500") // Recuerda cambiar esto por tu link online cuando entregues el TP
public class ChatController {

    // Reemplaza esto con tu clave de API real de Google Gemini (¡Y no la subas a GitHub!)
    private final String GEMINI_API_KEY = "";
    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;  

    @PostMapping
    public ResponseEntity<String> procesarMensaje(@RequestBody String mensajeUsuario) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Instrucciones de comportamiento para NeoBot
            String contexto = "Eres NeoBot, el asistente virtual de ventas de Neosuplex, una tienda de suplementos. " +
                "Debes seguir estas reglas estrictamente: " +
                "1. Habla siempre en español argentino usando el 'vos', sé amable y muy breve. " +
                "2. El envío es gratis solamente en compras mayores a $50000, si es menor, el envío se coordina con el vendedor. " +
                "3. Di precios exactos. Si te preguntan cuánto cuesta algo, les puedes decir el precio y que lo pueden revisar en nuestro catálogo en la web. " +
                "4. Solo vendemos Proteínas, Aminoácidos, Creatina, Pre-Entrenos y Vitaminas. Si preguntan por esteroides u otra cosa, di que no vendemos eso. " +
                "5. Si te preguntan dónde estamos, responde que hacen envíos a todo el país desde Mendoza. " +
                "6. Si te preguntan cuanto cuesta el envio, diles que no tienes esa informacion ya que es un dato externo y redirigelo con un agente humano (Dales un numero de whatsapp al que puedan comunicarse como: 2617691326 o diles que pueden enviar un email con su consulta a neosuplexweb@gmail.com de preferencia). " +
                "7. Haz recomendaciones de productos que se puedan llevar dependiendo del objetivo que quieren alcanzar (pregúntales) y arma 'combos' de productos que puedan llevarse. " +
                "8. Empieza el chat con un 'Hola, soy Neobot, el asistente virtual de ventas de Neosuplex ¿En qué puedo ayudarte?' y termina con un saludo cordial. " +
                "9. Si solicitan informacion de los productos puedes sacarla de la base de datos como precio,descripcion,stock y para que sirven" +
                "Responde a este mensaje del cliente basándote en esas reglas: " + mensajeUsuario;

            // Estructura JSON requerida por la API de Gemini
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", contexto)
                    ))
                )
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // Hacemos la llamada a Google
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL, request, Map.class);
            
            // Extraemos solo el texto de la respuesta
            Map<String, Object> body = response.getBody();
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String respuestaIA = (String) parts.get(0).get("text");

            return ResponseEntity.ok(respuestaIA);

        } catch (org.springframework.web.client.HttpStatusCodeException httpException) {
            System.out.println("💥 ERROR DE GOOGLE GEMINI: " + httpException.getResponseBodyAsString());
            
            // Fallback elegante si la IA de Google está saturada
            if (httpException.getStatusCode().value() == 503) {
                return ResponseEntity.ok("¡Hola! Disculpá, justo en este momento estoy atendiendo a varios clientes en el mostrador. ¿Me podrías volver a hacer la consulta en un minutito?");
            }
            
            return ResponseEntity.internalServerError().body("Error de conexión con la IA.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Lo siento, estoy teniendo problemas de conexión en este momento.");
        }
    }
}