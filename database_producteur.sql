-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 29 jan. 2024 à 09:21
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `database_producteur`
--

-- --------------------------------------------------------

--
-- Structure de la table `achat`
--

DROP TABLE IF EXISTS `achat`;
CREATE TABLE IF NOT EXISTS `achat` (
  `idAchat` int NOT NULL AUTO_INCREMENT,
  `idProd` int DEFAULT NULL,
  `idProduit` int DEFAULT NULL,
  `idAdmin` int DEFAULT NULL,
  `dateAchat` date DEFAULT NULL,
  `quantiteAchat` int DEFAULT NULL,
  `montantAchat` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`idAchat`),
  KEY `idProd` (`idProd`),
  KEY `idProduit` (`idProduit`),
  KEY `idAdmin` (`idAdmin`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `achat`
--

INSERT INTO `achat` (`idAchat`, `idProd`, `idProduit`, `idAdmin`, `dateAchat`, `quantiteAchat`, `montantAchat`) VALUES
(1, 1, 1, 1, '2024-01-29', 5, '5000.00'),
(2, 1, 1, 1, '2024-01-29', 5, '5000.00');

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `idAdmin` int NOT NULL AUTO_INCREMENT,
  `nomAdmin` varchar(255) DEFAULT NULL,
  `prenomsAdmin` varchar(255) DEFAULT NULL,
  `levelAdmin` int NOT NULL,
  `date_naissAdmin` date DEFAULT NULL,
  `pwdAdmin` varchar(255) DEFAULT NULL,
  `usernameAdmin` varchar(255) DEFAULT NULL,
  `date_CreaAdmin` date DEFAULT NULL,
  `contactAdmin` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idAdmin`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`idAdmin`, `nomAdmin`, `prenomsAdmin`, `levelAdmin`, `date_naissAdmin`, `pwdAdmin`, `usernameAdmin`, `date_CreaAdmin`, `contactAdmin`) VALUES
(1, 'Dibi', 'Ahou Georgina', 0, '1999-02-12', 'Gina', 'Gina', '2024-01-28', '0774859665');

-- --------------------------------------------------------

--
-- Structure de la table `categorieproduit`
--

DROP TABLE IF EXISTS `categorieproduit`;
CREATE TABLE IF NOT EXISTS `categorieproduit` (
  `idCatProd` int NOT NULL AUTO_INCREMENT,
  `libelleCatProd` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idCatProd`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `categorieproduit`
--

INSERT INTO `categorieproduit` (`idCatProd`, `libelleCatProd`) VALUES
(1, 'Café-Cacao'),
(2, 'Coton');

-- --------------------------------------------------------

--
-- Structure de la table `producteur`
--

DROP TABLE IF EXISTS `producteur`;
CREATE TABLE IF NOT EXISTS `producteur` (
  `idProd` int NOT NULL AUTO_INCREMENT,
  `nomProd` varchar(255) DEFAULT NULL,
  `prenomsProd` varchar(255) DEFAULT NULL,
  `date_naissProd` date DEFAULT NULL,
  `pwdProd` varchar(255) DEFAULT NULL,
  `usernameProd` varchar(255) DEFAULT NULL,
  `date_CreaProd` date DEFAULT NULL,
  `contactProd` varchar(255) DEFAULT NULL,
  `idProduit` int DEFAULT NULL,
  PRIMARY KEY (`idProd`),
  KEY `idProduit` (`idProduit`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `producteur`
--

INSERT INTO `producteur` (`idProd`, `nomProd`, `prenomsProd`, `date_naissProd`, `pwdProd`, `usernameProd`, `date_CreaProd`, `contactProd`, `idProduit`) VALUES
(1, 'Tanagueda', 'Cheick Abdallah', '2000-10-27', 'Cheick', 'Cheick', '2024-01-26', '0779595588', 1),
(8, 'Tanagueda', 'Cheick Abdallah', '2000-10-27', 'Cheick', 'Cheicki', '2024-01-27', '0152963215', 1),
(9, 'Tanagueda', 'Jean Charles', '1992-05-04', 'Ouallo', 'Cheick', '2024-01-27', '0774859665', 1),
(10, 'Ouallo', 'Jean Charles', '1992-05-04', 'Ouallo', 'Ouallo', '2024-01-29', '0774859665', 1);

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

DROP TABLE IF EXISTS `produit`;
CREATE TABLE IF NOT EXISTS `produit` (
  `idProduit` int NOT NULL AUTO_INCREMENT,
  `libelleProduit` varchar(255) DEFAULT NULL,
  `idCatProd` int DEFAULT NULL,
  `prixProduit` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`idProduit`),
  KEY `idCatProd` (`idCatProd`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `produit`
--

INSERT INTO `produit` (`idProduit`, `libelleProduit`, `idCatProd`, `prixProduit`) VALUES
(1, 'Café', 1, '1000.00'),
(2, 'Cacao', 1, '900.00'),
(3, 'Coton', 2, '700.00');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `achat`
--
ALTER TABLE `achat`
  ADD CONSTRAINT `achat_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `produit` (`idProduit`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `achat_ibfk_2` FOREIGN KEY (`idAdmin`) REFERENCES `admin` (`idAdmin`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `achat_ibfk_3` FOREIGN KEY (`idProd`) REFERENCES `producteur` (`idProd`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `producteur`
--
ALTER TABLE `producteur`
  ADD CONSTRAINT `producteur_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `produit` (`idProduit`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `produit`
--
ALTER TABLE `produit`
  ADD CONSTRAINT `produit_ibfk_1` FOREIGN KEY (`idCatProd`) REFERENCES `categorieproduit` (`idCatProd`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
