# Installation de l'application - Back End



## Installation des paquets

### Prérequis

Pour lancer le projet il vous faudra NodeJS sur votre machine : 
https://nodejs.org/en/download/



### Installation

Installation des paquets : `npm i`

Lancer l'application avec : `npm start`



## Modification

Pour changer les paramètres d'accès des sockets pour le chat ou de serveur



### Pour l'accès à la BDD

Se rendre dans le fichier `config/config.json` et modifier dans **development**, **test**, **production** cette ligne :

```json
"host": "URL"
```



### Pour changer les ports d'accès du serveur
Se rendre dans le fichier `server.js` 



#### Port pour les sockets

Changer cette ligne et changer [PORT] par votre numéro de port :

```js
var port = process.env.PORT || [PORT];
```



#### Port pour le serveur

Changer [PORT] par votre numéro de port :

```javascript
server.listen([PORT], function () {
  console.log('Server en écoute');
});
```

### Système de cryptage

Modifier la clé de sécurité dans le fichier : `crypto.utils.js`

```javascript
const key = "cle de securite";
```

**La clé doit être identique à celle dans la partie application**