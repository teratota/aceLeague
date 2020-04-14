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


-- Listage de la structure de la base pour aceleague
CREATE DATABASE IF NOT EXISTS `aceleague` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `aceleague`;

-- Listage de la structure de la table aceleague. chat
CREATE TABLE IF NOT EXISTS `chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.chat : ~0 rows (environ)
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. chat2user
CREATE TABLE IF NOT EXISTS `chat2user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id_chat` int(11) NOT NULL,
  `ref_id_user` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_chat2user_user` (`ref_id_user`),
  KEY `FK_chat2user_chat` (`ref_id_chat`),
  CONSTRAINT `FK_chat2user_chat` FOREIGN KEY (`ref_id_chat`) REFERENCES `chat` (`id`),
  CONSTRAINT `FK_chat2user_user` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.chat2user : ~0 rows (environ)
/*!40000 ALTER TABLE `chat2user` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat2user` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. commentaire
CREATE TABLE IF NOT EXISTS `commentaire` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id_user` int(11) NOT NULL,
  `ref_id_publication` int(11) NOT NULL,
  `message` text,
  PRIMARY KEY (`id`),
  KEY `FK_commentaire_user` (`ref_id_user`),
  KEY `FK_commentaire_publication` (`ref_id_publication`),
  CONSTRAINT `FK_commentaire_publication` FOREIGN KEY (`ref_id_publication`) REFERENCES `publication` (`id`),
  CONSTRAINT `FK_commentaire_user` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.commentaire : ~0 rows (environ)
/*!40000 ALTER TABLE `commentaire` DISABLE KEYS */;
/*!40000 ALTER TABLE `commentaire` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. friend
CREATE TABLE IF NOT EXISTS `friend` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id_user_principal` int(11) NOT NULL,
  `ref_id_user_friend` int(11) NOT NULL,
  `validate` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_friend_user` (`ref_id_user_principal`),
  KEY `FK_friend_user_2` (`ref_id_user_friend`),
  CONSTRAINT `FK_friend_user` FOREIGN KEY (`ref_id_user_principal`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_friend_user_2` FOREIGN KEY (`ref_id_user_friend`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.friend : ~0 rows (environ)
/*!40000 ALTER TABLE `friend` DISABLE KEYS */;
/*!40000 ALTER TABLE `friend` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. groupe
CREATE TABLE IF NOT EXISTS `groupe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.groupe : ~0 rows (environ)
/*!40000 ALTER TABLE `groupe` DISABLE KEYS */;
/*!40000 ALTER TABLE `groupe` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. groupe2user
CREATE TABLE IF NOT EXISTS `groupe2user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id_groupe` int(11) NOT NULL,
  `ref_id_user` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_groupe2user_groupe` (`ref_id_groupe`),
  KEY `FK_groupe2user_user` (`ref_id_user`),
  CONSTRAINT `FK_groupe2user_groupe` FOREIGN KEY (`ref_id_groupe`) REFERENCES `groupe` (`id`),
  CONSTRAINT `FK_groupe2user_user` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.groupe2user : ~0 rows (environ)
/*!40000 ALTER TABLE `groupe2user` DISABLE KEYS */;
/*!40000 ALTER TABLE `groupe2user` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. image
CREATE TABLE IF NOT EXISTS `image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id_user` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_image_user` (`ref_id_user`),
  CONSTRAINT `FK_image_user` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.image : ~0 rows (environ)
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
/*!40000 ALTER TABLE `image` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. like
CREATE TABLE IF NOT EXISTS `like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id_publication` int(11) NOT NULL,
  `ref_id_user` int(11) NOT NULL,
  `etat` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_like_publication` (`ref_id_publication`),
  KEY `FK_like_user` (`ref_id_user`),
  CONSTRAINT `FK_like_publication` FOREIGN KEY (`ref_id_publication`) REFERENCES `publication` (`id`),
  CONSTRAINT `FK_like_user` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.like : ~0 rows (environ)
/*!40000 ALTER TABLE `like` DISABLE KEYS */;
/*!40000 ALTER TABLE `like` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. notification
CREATE TABLE IF NOT EXISTS `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id_user` int(11) NOT NULL,
  `texte` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_notification_user` (`ref_id_user`),
  CONSTRAINT `FK_notification_user` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.notification : ~0 rows (environ)
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. pro
CREATE TABLE IF NOT EXISTS `pro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id_user` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_pro_user` (`ref_id_user`),
  KEY `FK_pro_type` (`type`),
  CONSTRAINT `FK_pro_type` FOREIGN KEY (`type`) REFERENCES `type` (`id`),
  CONSTRAINT `FK_pro_user` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.pro : ~0 rows (environ)
/*!40000 ALTER TABLE `pro` DISABLE KEYS */;
/*!40000 ALTER TABLE `pro` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. profil
CREATE TABLE IF NOT EXISTS `profil` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id_user` int(11) NOT NULL,
  `sport` text,
  PRIMARY KEY (`id`),
  KEY `FK_profil_user` (`ref_id_user`),
  CONSTRAINT `FK_profil_user` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.profil : ~0 rows (environ)
/*!40000 ALTER TABLE `profil` DISABLE KEYS */;
/*!40000 ALTER TABLE `profil` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. publication
CREATE TABLE IF NOT EXISTS `publication` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_id_user` int(11) NOT NULL,
  `image` varchar(50) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `FK_publication_user` (`ref_id_user`),
  CONSTRAINT `FK_publication_user` FOREIGN KEY (`ref_id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.publication : ~0 rows (environ)
/*!40000 ALTER TABLE `publication` DISABLE KEYS */;
/*!40000 ALTER TABLE `publication` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. type
CREATE TABLE IF NOT EXISTS `type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.type : ~3 rows (environ)
/*!40000 ALTER TABLE `type` DISABLE KEYS */;
INSERT INTO `type` (`id`, `nom`) VALUES
	(1, 'Boutique'),
	(2, 'Evenement'),
	(3, 'Club');
/*!40000 ALTER TABLE `type` ENABLE KEYS */;

-- Listage de la structure de la table aceleague. user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` text,
  `isAdmin` tinyint(4) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL,
  `token` varchar(255) NOT NULL,
  `token_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table aceleague.user : ~0 rows (environ)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
