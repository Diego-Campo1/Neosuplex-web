package com.neosuplex.neosuplexapi;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @PostMapping("/crear-preferencia")
    public ResponseEntity<?> crearPreferencia(@RequestBody List<Map<String, Object>> carrito) {
        try {
            // Agrega tu credencial (Access Token) de prueba de Mercado Pago
            MercadoPagoConfig.setAccessToken("APP_USR-7765593385580859-060311-d5ec6fd0288f1f9a5e068674cf4ca2c4-3448107666");

            List<PreferenceItemRequest> items = new ArrayList<>();

            // Recorremos el carrito que nos mandó el Frontend
            for (Map<String, Object> producto : carrito) {
                String nombre = (String) producto.get("nombre");
                // Aseguramos la conversión correcta del precio
                BigDecimal precio = new BigDecimal(producto.get("precio").toString());

                PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                        .title(nombre)
                        .quantity(1)
                        .unitPrice(precio)
                        .currencyId("ARS")
                        .build();

                items.add(itemRequest);
            }

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    // A dónde vuelve el usuario tras pagar
                    .backUrls(com.mercadopago.client.preference.PreferenceBackUrlsRequest.builder()
                            .success("http://localhost:5500/index.html")
                            .failure("http://localhost:5500/carrito.html")
                            .pending("http://localhost:5500/carrito.html")
                            .build()) 
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            // Devolvemos el init_point al Frontend
            return ResponseEntity.ok(Map.of("init_point", preference.getInitPoint()));

        } catch (com.mercadopago.exceptions.MPApiException apiException) {
            System.out.println("💥 ERROR DE MERCADO PAGO: " + apiException.getApiResponse().getContent());
            return ResponseEntity.internalServerError().body(Map.of("error", "Error en API de pagos"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}