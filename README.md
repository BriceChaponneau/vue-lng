# VUE-LNG

TODO

---
## Bienvenue sur la page de vue-lng
vue-lng est un plugin facilitant les projets multilangues en Vue.js.

### Comment l'utiliser
#### Installation
Après avoir créé un projet Vue.js
Il faut installer le paquet : 
```
npm i vue-lng
```

Ensuite, dans le fichier **mains.js** à la racine du projet, il faut importer le plugins :
```
import lng from "vue-lng";
```
Le plugin est désormais présent dans le projet

#### Configuration
La base est la suivante :
```
Vue.use(lng, {
  language: "en",
  messages: {
    en: {}
  }
});
```

- **language** : est la langue de base et de démarrage. _"en"_ est un exemple.
- **messages** : est un objet représentant les messages de traduction. Il peut etre :
  - un json direct :
```
messages: {
  en: {}
}
```
    
  
  
  
  - un import de fichiers soit unique (en.json), soit multiples (fr) et dans ce cas, il est necessaire d'utiliser un fichier js d'import comme le montre l'exemple. Supposons la structure suivante :
```
mains.js
locales/
  |_ en.json
  |_ fr/
    |_ home.json
    |_ menu.json
    |_ index.js
```
     
     
```
messages: {
  en: require("./locales/en.json"),
  fr: require("./locales/fr/")
}
```
...


Vue.use(lng, {
  debug: false,    // OPTIONNAL : show warning (if debug is on), i.e : process.env.NODE_ENV
  startOne: false, // OPTIONNAL : pluralize start at index 0 (false) / 1 (true, default)
  fallback: false, // OPTIONNAL : allow get default valu from default locale
  language: "en",
  messages: {
    en: require("./locales/en.json"),
    fr: require("./locales/fr/")
  }
});
