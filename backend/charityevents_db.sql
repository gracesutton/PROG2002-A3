-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `CategoryID` int NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(50) NOT NULL,
  `CategoryImage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Fun Run','images/fun-run.jpg'),(2,'Charity Gala','images/gala.jpg'),(3,'Auction','images/auction.jpg'),(4,'Community Fair','images/fair.jpg');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `EventID` int NOT NULL AUTO_INCREMENT,
  `EventName` varchar(255) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `EventDate` date NOT NULL,
  `EndDate` date DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `Location` varchar(255) NOT NULL,
  `TicketPrice` decimal(10,2) DEFAULT '0.00',
  `GoalAmount` decimal(10,2) DEFAULT '0.00',
  `CurrentProgress` decimal(10,2) DEFAULT '0.00',
  `IsActive` tinyint(1) NOT NULL DEFAULT '1',
  `Suspended` tinyint(1) NOT NULL DEFAULT '0',
  `OrganisationID` int NOT NULL,
  `CategoryID` int NOT NULL,
  PRIMARY KEY (`EventID`),
  KEY `OrganisationID` (`OrganisationID`),
  KEY `CategoryID` (`CategoryID`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`OrganisationID`) REFERENCES `organisations` (`OrganisationID`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` 
(`EventID`, `EventName`, `Description`, `EventDate`, `EndDate`, `StartTime`, `EndTime`, `Location`, `TicketPrice`, `GoalAmount`, `CurrentProgress`, `IsActive`, `Suspended`, `OrganisationID`, `CategoryID`)
VALUES 
(1,'5K Fun Run','Join us for a fun run to raise funds for local shelters.','2025-10-10','2025-10-10','07:00:00','10:00:00','Coolangatta',0.00,5000.00,2200.00,1,0,1,1),
(2,'Annual Charity Gala','An elegant evening to support conservation efforts.','2025-11-15','2025-11-15','18:30:00','23:30:00','Gold Coast Convention Centre',120.00,20000.00,7500.00,1,0,2,2),
(3,'Art Auction','Bid on local artwork and support kids education.','2025-12-01','2025-12-01','17:00:00','21:00:00','HOTA',0.00,8000.00,3000.00,1,0,3,3),
(4,'Spring Community Fair','Family-friendly fair with stalls and live music.','2025-09-30','2025-09-30','09:00:00','15:00:00','Burleigh Heads Public School',5.00,3000.00,1500.00,1,0,1,4),
(5,'Beach Clean-Up','Volunteer event to clean Gold Coast beaches.','2025-10-20','2025-10-20','08:00:00','12:00:00','Surfers Paradise Beach',0.00,1000.00,500.00,1,0,2,1),
(6,'Charity Fashion Show','Showcasing local designers for a cause.','2025-12-05','2025-12-05','19:00:00','22:30:00','Pacific Fair Shopping Centre',45.00,7000.00,3200.00,1,0,1,2),
(7,'Food Drive Gala Dinner','Help us fundraise for food packages.','2025-09-20','2025-09-20','18:00:00','22:00:00','JW Marriott Gold Coast',60.00,5000.00,1200.00,1,0,1,2),
(8,'Vintage Auction','Collectible items auction for fundraising.','2025-09-09','2025-09-09','17:30:00','21:00:00','Gold Coast Convention Centre',0.00,4000.00,1000.00,1,0,3,3);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organisations`
--

DROP TABLE IF EXISTS `organisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organisations` (
  `OrganisationID` int NOT NULL AUTO_INCREMENT,
  `OrganisationName` varchar(255) NOT NULL,
  `OrganisationDescription` varchar(255) DEFAULT NULL,
  `Website` varchar(255) DEFAULT NULL,
  `Phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`OrganisationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organisations`
--

LOCK TABLES `organisations` WRITE;
/*!40000 ALTER TABLE `organisations` DISABLE KEYS */;
INSERT INTO `organisations` VALUES (1, 'Helping Hands', 'Provides meals and shelter for the homeless', 'https://helpinghands.org', '(07) 5523 7890'),
(2, 'Green Earth', 'Environmental conservation initiatives', 'https://greenearth.org', '(07) 5524 4411'),
(3, 'Hope for Kids', 'Supports education programs for underprivileged children', 'https://hopeforkids.org', '(07) 5523 1234');
/*!40000 ALTER TABLE `organisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrations` (
  `RegistrationID` int NOT NULL AUTO_INCREMENT,
  `EventID` int NOT NULL,
  `FullName` varchar(120) NOT NULL,
  `Email` varchar(160) NOT NULL,
  `Phone` varchar(40) DEFAULT NULL,
  `Tickets` int NOT NULL DEFAULT '1',
  `Notes` text,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RegistrationID`),
  KEY `idx_reg_event` (`EventID`),
  KEY `idx_reg_email` (`Email`),
  CONSTRAINT `fk_reg_event` FOREIGN KEY (`EventID`) REFERENCES `events` (`EventID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrations`
--

LOCK TABLES `registrations` WRITE;
/*!40000 ALTER TABLE `registrations` DISABLE KEYS */;
INSERT INTO registrations (EventID, FullName, Email, Phone, Tickets)
VALUES
(5, 'Grace Sutton', 'grace.sutton@example.com', '0413 291 000', 2),
(5, 'Crawford James', 'crawford.james@example.com', '0402 556 812', 1),
(3, 'Paige Robinson', 'paige.robinson@example.com', '0458 112 497', 1);
/*!40000 ALTER TABLE `registrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-13 22:13:20
