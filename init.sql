-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: tienda_neosuplex
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `direcciones`
--

DROP TABLE IF EXISTS `direcciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direcciones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `altura` varchar(255) NOT NULL,
  `calle` varchar(255) NOT NULL,
  `codigo_postal` varchar(255) NOT NULL,
  `localidad` varchar(255) NOT NULL,
  `piso_depto` varchar(255) DEFAULT NULL,
  `predeterminada` bit(1) NOT NULL,
  `provincia` varchar(255) NOT NULL,
  `usuario_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK54oy4k8b4ltgwmoq6kuocwhc7` (`usuario_id`),
  CONSTRAINT `FK54oy4k8b4ltgwmoq6kuocwhc7` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direcciones`
--

LOCK TABLES `direcciones` WRITE;
/*!40000 ALTER TABLE `direcciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `direcciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoria` varchar(255) DEFAULT NULL,
  `descripcion` text,
  `destacado` bit(1) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `stock` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Proteínas','Concentrado de suero de leche de alta pureza para recuperación muscular.',_binary '','imagenes/proteina-ena.png','Proteína Whey Pure ENA 1kg',35000,15),(2,'Creatina','Aumenta la fuerza y potencia muscular en entrenamientos de alta intensidad.',_binary '','imagenes/creatina-star.png','Creatina Micronizada Star Nutrition 300g',28000,20),(3,'Pre-entrenos','Fórmula explosiva con cafeína y beta-alanina para máxima energía y enfoque.',_binary '','imagenes/pump-v8.png','Pre-Entreno Pump V8 Shaker',22000,12),(4,'Vitaminas','Vitaminas y minerales esenciales para reforzar el sistema inmunológico del atleta.',_binary '\0','imagenes/multivi.png','Complejo Vitamínico Multivite 60 Caps',15000,30),(5,'Aminoácidos','Aminoácidos de cadena ramificada ideales para evitar el catabolismo muscular.',_binary '','imagenes/tranf.png','BCAA 2000 Mervick 120 Tab',18500,18),(6,'Aminoácidos','La GLUTAMINA es el aminoácido más abundante en sangre y músculo. Es condicionalmente esencial debido al alto consumo que existe en el estrés crónico por el ejercicio. Durante prolongados períodos de ejercicio intenso, los niveles de Glutamina pueden disminuir, lo que limita la síntesis de proteínas. Ademas es considerado como una de las principales fuentes de energía de los linfocitos (protagonistas en el sistema inmunológico).',_binary '','imagenes/glutamina-ena.png','Glutamina -ena- (300 Grs) Rápida Recuperación (60 Servicios) Sabor Sin sabor',28000,20),(7,'Pre-entrenos','Pre Workout Pre Entreno 300g Varios Sabores Optimum Nutrition',_binary '','imagenes/pre-entreno.png','Pre Workout Pre Entreno 300g Varios Sabores Optimum Nutrition (Fruit Punch)',40000,25),(8,'Aminoácidos','Apoya la resistencia muscular y la recuperación.',_binary '\0','imagenes/amino.png','Aminox Bsn Aminoácidos Aminoácidos Bcaa + L Citrulina 1kg',50000,35),(9,'Creatina','La creatina monohidratada Star Nutrition en presentación de 300 gramos doypack es un suplemento vegano, sin sabor y libre de gluten. Contiene 5 gramos de creatina pura por porción, ideal para mejorar la fuerza, resistencia y recuperación muscular durante planes de entrenamiento. Al estar micronizada, ofrece mejor asimilación que la creatina convencional. No contiene scoop. Requiere ser consumida siguiendo indicaciones específicas. Está aprobada por organismos oficiales y es apta para mayores de 18 años. Su fórmula es libre de TACC y lactosa, lo que la hace adecuada para personas con dietas especiales.',_binary '\0','imagenes/crea-star60.png','Creatina Monohidratada Star Nutrition 300 Gr - Doypack Sin sabor',28400,50),(10,'Aminoácidos','Envase con 30 porciones. Frasco con 150g.\r\n\r\nGlutamine Vitamin Way contribuye a recargar la energía muscular y a disminuir la sensación de cansancio, ayudando a reducir la pérdida de fuerza y favoreciendo una recuperación más rápida de la capacidad muscular. Además, colabora con un mayor confort post-entrenamiento al ayudar a disminuir la intensidad del dolor muscular de aparición tardía. Glutamine Vitamin Way aporta L-glutamina micronizada, de elevada biodisponibilidad, que favorece la solubilidad y la mezcla homogénea; su fórmula neutra se integra con facilidad a distintas bebidas y planes alimentarios sin modificar el sabor.\r\n\r\nGlutamina 100% pura - Micronizada',_binary '\0','imagenes/gluta-way.png','Glutamina 100% Pura Micronizada 150gr Vitaminway',15000,40),(11,'Grasas Saludables','Casi todos los aspectos de nuestra salud, tanto física como mental, están relacionados con los tipos de ácidos grasos que componen nuestras células y tejidos, incluyendo la visión. Y parece que la mayoría de nosotros no consumimos los adecuados.',_binary '\0','imagenes/omega3.png','Omega 3 Ultra Concentrado, 90 cápsulas blandas (NLS)',30000,15),(12,'Vitaminas','Magnesio + Calcio Vitamin Way® es un suplemento formulado para acompañar rutinas saludables con especial cuidado en la salud de músculos y huesos. Aporta 4 ingredientes clave para mantener la estructura ósea fortalecida y prevenir los calambres. Ayuda a prevenir calambres y contracturas. Ayuda a mejorar la densidad ósea y disminuir el riesgo de fracturas. Ayuda a reducir el riesgo de osteoporosis. Con vitamina D que ayuda a mejorar la absorción de calcio. Formulado en cápsulas de celulosa. Apto para veganos. NGESTA SUGERIDA: 2 cápsulas diarias. Estuches con 60 cápsulas vegetales. Consumir este producto de acuerdo a las recomendaciones de ingesta diaria establecidas en el rótulo. El consumo de suplementos dietarios no reemplaza una dieta variada y equilibrada. No utilizar en caso de embarazo, mujeres en período de lactancia ni en niños. Mantener fuera del alcance de los niños. Consulte a su médico y/o nutricionista. Conservar en lugar seco a temperatura ambiente. Por porción: Magnesio 260 mg, calcio 100 mg, vitamina C 45 mg, vitamina D2 (ergocalciferol) 5 µg.',_binary '\0','imagenes/mag-vit.png','VitaminWay Magnesio + Calcio Con Vitamina C Y D 60 Cápsulas',16300,35),(13,'Proteínas','roteína 100 % vegana con una nutrición perfecta y un delicioso sabor a chocolate. Proteína integral altamente digerible, sin OGM. Favorece una recuperación muscular más rápida. Más de 5 g de BCAA de origen natural. Promueve una mayor absorción de aminoácidos en el cuerpo. 0 g de azúcar por porción.',_binary '\0','imagenes/protvegana.png','Swanson Vitamins, Proteína vegana, Chocolate, 1500 g (3,3 lb)',95000,14);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(255) DEFAULT NULL,
  `puntos` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkfsp0s1tflm1cwlj8idhqsad0` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (8,'diegooc299@gmail.com','Diego Campo','$2a$10$qh4KH/WkuwnCzGTNUEQGBeQDrJaiDq8VVcpIHX3yBLXUpL0jnyd7i','CLIENTE',0);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'tienda_neosuplex'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-04 18:17:48
