# Installation de l'application - Front End



## Installation des paquets

### Prérequis

Pour lancer le projet il vous faudra NodeJS sur votre machine : 
https://nodejs.org/en/download/



### Installation

Installation des paquets : `npm i`

Lancer l'application avec : `ionic serve`



## Modification

Pour changer l'adresse de l'api avec laquelle vous allez communiquer

### Pour les socket ( fonctionnalité de chat )

Se rendre dans le fichier `app.module` et modifier cette ligne :

```typescript
const config: SocketIoConfig = { url: 'http://URL:PORT', options: {} };
```





### Pour l'accès à l'API

Se rendre dans le fichier `src/app/includes/api_path.js` et modifier cette ligne :

```typescript
export const api_path = 'http://URL:PORT/api/'
```

