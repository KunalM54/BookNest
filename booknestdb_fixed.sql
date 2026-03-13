-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: booknest
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author` varchar(255) NOT NULL,
  `available_copies` int NOT NULL,
  `category` varchar(255) NOT NULL,
  `isbn` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `total_copies` int NOT NULL,
  `image_data` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkibbepcitr0a3cpk3rfr7nihn` (`isbn`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'Stephen Hawking',2,'Science','9780553380163','A Brief History of Timee',10,NULL),(2,'Richard Dawkins',2,'Science','9780192860927','The Selfish Gene',8,NULL),(3,'Jared Diamond',3,'History','9780393317558','Guns, Germs, and Steel',6,NULL),(4,'Yuval Noah Harari',8,'History','9780062316110','Sapiens: A Brief History of Humankind',12,NULL),(5,'Robert C. Martin',6,'Technology','9780132350884','Clean Code',9,NULL),(6,'Thomas H. Cormen',2,'Academic','9780262033848','Introduction to Algorithms',7,NULL),(7,'Stuart Russell',2,'Technology','9780136042594','Artificial Intelligence: A Modern Approach',5,NULL),(8,'Abraham Silberschatz',5,'Academic','9781118063330','Operating System Concepts',8,NULL),(9,'Jane Austen',8,'Literature','9780141439518','Pride and Prejudice',10,NULL),(10,'Harper Lee',6,'Literature','9780061120084','To Kill a Mockingbird',11,NULL),(11,'F. Scott Fitzgerald',6,'Literature','9780743273565','The Great Gatsby',9,NULL),(12,'Charles Darwin',4,'Science','9781509827695','The Origin of Species',6,NULL),(13,'Martin Gilbert',5,'History','9780805076233','World War II: A Complete History',7,NULL);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `borrows`
--

DROP TABLE IF EXISTS `borrows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `borrows` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `due_date` date DEFAULT NULL,
  `request_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `status` enum('APPROVED','OVERDUE','PENDING','REJECTED','RETURNED') NOT NULL,
  `book_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8789wjikihu9ocbhamiw789y9` (`book_id`),
  KEY `FKm195mfltnwyri274x0r3xutlc` (`student_id`),
  CONSTRAINT `FK8789wjikihu9ocbhamiw789y9` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `FKm195mfltnwyri274x0r3xutlc` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `borrows`
--

LOCK TABLES `borrows` WRITE;
/*!40000 ALTER TABLE `borrows` DISABLE KEYS */;
INSERT INTO `borrows` VALUES (17,'2026-03-27','2026-03-13',NULL,'APPROVED',1,2),(18,NULL,'2026-03-13',NULL,'REJECTED',2,2),(19,'2026-03-27','2026-03-13',NULL,'APPROVED',3,2),(20,'2026-03-27','2026-03-13',NULL,'APPROVED',4,2);
/*!40000 ALTER TABLE `borrows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_important` bit(1) DEFAULT NULL,
  `message` text,
  `title` varchar(150) NOT NULL,
  `priority` enum('HIGH','NORMAL') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_notices_created_at` (`created_at`),
  KEY `idx_notices_priority_created_at` (`priority`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES (2,'2026-03-10 10:45:49.522051',_binary '\0','Dear Students,\n\nPlease note that the library will remain open from 9:00 AM to 6:00 PM on all working days. Students are requested to maintain silence and return borrowed books before the due date to avoid penalties.\n\nThank you for your cooperation.\nLibrary Management ?','Library Timing Update','NORMAL','2026-03-10 10:45:49.522051'),(3,'2026-03-11 11:11:46.617903',_binary '\0','New books in Technology, Science, History, and Literature are now available in the library. Members are encouraged to explore the new collection and remember to return borrowed books before the due date.','? New Arrivals and Borrowing Reminder','NORMAL','2026-03-11 11:11:46.617903');
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','STUDENT') NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `active` bit(1) NOT NULL,
  `joined_date` date DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKqh3otyipv2k9hqte4a1abcyhq` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'priyanshikathiriya@gmail.com','priyanshi kathiriya','$2a$10$rL9r9XgPSdxvu7XJvUHb2e1POPzxtoSJzqqSIxn7P43kkW8n6Wqbu','STUDENT','S12345',_binary '',NULL,NULL),(2,'meet@gmail.com','meet dobariya','$2a$10$rsKg3Rtzc4IE7K66yGLjUucyYWjMVa73IWmrDs/h3SUs8j4Usp/I.','STUDENT','S12346',_binary '',NULL,'+91 - 9510475834'),(3,'bhagi@gmail.com','bhagirathi bhuva','$2a$10$nKck3V3j9zKQp598bTxCGOnmG.XGqQonTsgBsdt/eAJXAOu.3ZtSW','STUDENT','S12348',_binary '',NULL,NULL),(4,'john@example.com','John Doe','$2a$10$KXorDlGrs2NbxhlEFDfyluX4XaS0myAV1IiI/qzgoSxwop3rteMHq','STUDENT','STU001',_binary '',NULL,NULL),(5,'kunal@gmail.com','kunal mendpara','$2a$10$LoG/snySiZEkb/LnCtpkPuUuSxtJup3K2Iey6X8vt70I7zpLQiI2e','STUDENT','S12347',_binary '',NULL,NULL),(6,'krisha@gmail.com','krisha sabhaya','$2a$10$jwDk2AtwS1/TI02wHiIHKOw/E/dmnI6ruiCg6GgMdLSyGp6Nm1y2i','STUDENT','S12349',_binary '',NULL,NULL),(7,'admin@booknest.com','Administrator System','$2a$10$0xCycuHVbJJ5eQ23RHuZ4OFzuZsCJkmJ6nB7MLHVZ9I6FilPKNOQK','ADMIN','ADMIN001',_binary '',NULL,'+91 - 9510475834'),(14,'bhoutik@gmail.com','bhoutik sojitra','$2a$10$2zKvMPfzIA3slL.kVM/OcuvYbYQayDHzBGfTo3epqkpBEVEantJYa','STUDENT','S123410',_binary '',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-13 13:56:11
