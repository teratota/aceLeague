-- --------------------------------------------------------
-- Hôte :                        localhost
-- Version du serveur:           5.7.24 - MySQL Community Server (GPL)
-- SE du serveur:                Win64
-- HeidiSQL Version:             9.5.0.5332
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour aceleague-dev
CREATE DATABASE IF NOT EXISTS `aceleague-dev` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `aceleague-dev`;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'null',
  `email` varchar(50) NOT NULL COMMENT 'null',
  `username` varchar(50) NOT NULL COMMENT 'null',
  `password` varchar(255) NOT NULL COMMENT 'null',
  `bio` text COMMENT 'null',
  `isAdmin` int(4) NOT NULL COMMENT 'null',
  `image` varchar(255) DEFAULT NULL,
  `sport` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `sportDescription` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL COMMENT 'null',
  `updatedAt` datetime NOT NULL COMMENT 'null',
  `token` varchar(255) DEFAULT NULL COMMENT 'null',
  `token_date` datetime DEFAULT NULL COMMENT 'null',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. pro
CREATE TABLE IF NOT EXISTS `pro` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'null',
  `ref_id_user` int(11) NOT NULL COMMENT 'null',
  `type` varchar(255) NOT NULL COMMENT 'null',
  `nom` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `description` text NOT NULL COMMENT 'null',
  `image` varchar(50) DEFAULT NULL COMMENT 'null',
  PRIMARY KEY (`id`),
  KEY `pro_ibfk_1` (`ref_id_user`),
  CONSTRAINT `pro_ibfk_1` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. groupe
CREATE TABLE IF NOT EXISTS `groupe` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'null',
  `nom` varchar(50) NOT NULL DEFAULT '0' COMMENT 'null',
  `ref_id_user` int(11) NOT NULL DEFAULT '0',
  `image` varchar(50) DEFAULT NULL,
  `private` int(11) NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_groupe_user` (`ref_id_user`),
  CONSTRAINT `FK_groupe_user` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. publication
CREATE TABLE IF NOT EXISTS `publication` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'null',
  `ref_id_user` int(11) DEFAULT NULL COMMENT 'null',
  `ref_id_groupe` int(11) DEFAULT NULL,
  `ref_id_pro` int(11) DEFAULT NULL,
  `image` varchar(50) DEFAULT NULL COMMENT 'null',
  `description` text COMMENT 'null',
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_publication_groupe` (`ref_id_groupe`),
  KEY `FK_publication_pro` (`ref_id_pro`),
  KEY `publication_ibfk_1` (`ref_id_user`),
  CONSTRAINT `FK_publication_groupe` FOREIGN KEY (`ref_id_groupe`) REFERENCES `groupe` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_publication_pro` FOREIGN KEY (`ref_id_pro`) REFERENCES `pro` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `publication_ibfk_1` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8;


-- Listage de la structure de la table aceleague-dev. abonnement
CREATE TABLE IF NOT EXISTS `abonnement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id_user` int(11) NOT NULL DEFAULT '0',
  `ref_id_pro` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_abonnement_pro` (`ref_id_pro`),
  KEY `FK_abonnement_user` (`ref_id_user`),
  CONSTRAINT `FK_abonnement_pro` FOREIGN KEY (`ref_id_pro`) REFERENCES `pro` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_abonnement_user` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. chat
CREATE TABLE IF NOT EXISTS `chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'null',
  `nom` varchar(50) NOT NULL COMMENT 'null',
  `createdAt` datetime NOT NULL COMMENT 'null',
  `updateAt` datetime NOT NULL COMMENT 'null',
  `nomvue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. chat2user
CREATE TABLE IF NOT EXISTS `chat2user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'null',
  `ref_id_chat` int(11) NOT NULL COMMENT 'null',
  `ref_id_user` int(11) NOT NULL COMMENT 'null',
  PRIMARY KEY (`id`),
  KEY `chat2user_ibfk_1` (`ref_id_chat`),
  KEY `chat2user_ibfk_2` (`ref_id_user`),
  CONSTRAINT `chat2user_ibfk_1` FOREIGN KEY (`ref_id_chat`) REFERENCES `chat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chat2user_ibfk_2` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. commentaire
CREATE TABLE IF NOT EXISTS `commentaire` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'null',
  `ref_id_user` int(11) NOT NULL COMMENT 'null',
  `ref_id_publication` int(11) NOT NULL COMMENT 'null',
  `message` text NOT NULL COMMENT 'null',
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `commentaire_ibfk_1` (`ref_id_user`),
  KEY `commentaire_ibfk_2` (`ref_id_publication`),
  CONSTRAINT `commentaire_ibfk_1` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `commentaire_ibfk_2` FOREIGN KEY (`ref_id_publication`) REFERENCES `publication` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. friend
CREATE TABLE IF NOT EXISTS `friend` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'null',
  `ref_id_user_principal` int(11) NOT NULL COMMENT 'null',
  `ref_id_user_friend` int(11) NOT NULL COMMENT 'null',
  `validate` int(1) NOT NULL DEFAULT '0' COMMENT 'null',
  PRIMARY KEY (`id`),
  KEY `friend_ibfk_1` (`ref_id_user_principal`),
  KEY `friend_ibfk_2` (`ref_id_user_friend`),
  CONSTRAINT `friend_ibfk_1` FOREIGN KEY (`ref_id_user_principal`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `friend_ibfk_2` FOREIGN KEY (`ref_id_user_friend`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. groupe2user
CREATE TABLE IF NOT EXISTS `groupe2user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'null',
  `ref_id_groupe` int(11) NOT NULL COMMENT 'null',
  `ref_id_user` int(11) NOT NULL COMMENT 'null',
  PRIMARY KEY (`id`),
  KEY `groupe2user_ibfk_1` (`ref_id_groupe`),
  KEY `groupe2user_ibfk_2` (`ref_id_user`),
  CONSTRAINT `groupe2user_ibfk_1` FOREIGN KEY (`ref_id_groupe`) REFERENCES `groupe` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `groupe2user_ibfk_2` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. like
CREATE TABLE IF NOT EXISTS `like` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'null',
  `ref_id_publication` int(11) NOT NULL COMMENT 'null',
  `ref_id_user` int(11) NOT NULL COMMENT 'null',
  `etat` int(11) NOT NULL COMMENT 'null',
  PRIMARY KEY (`id`),
  KEY `like_ibfk_1` (`ref_id_publication`),
  KEY `like_ibfk_2` (`ref_id_user`),
  CONSTRAINT `like_ibfk_1` FOREIGN KEY (`ref_id_publication`) REFERENCES `publication` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `like_ibfk_2` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. message
CREATE TABLE IF NOT EXISTS `message` (
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `likes` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. notification
CREATE TABLE IF NOT EXISTS `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'null',
  `ref_id_user` int(11) NOT NULL COMMENT 'null',
  `texte` text NOT NULL COMMENT 'null',
  PRIMARY KEY (`id`),
  KEY `notification_ibfk_1` (`ref_id_user`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.
-- Listage de la structure de la table aceleague-dev. sequelizemeta
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Les données exportées n'étaient pas sélectionnées.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
