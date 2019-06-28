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
Pour ajouter le plugin à l'instance de vue :
```
Vue.use(lng, {
  debug: false,    // OPTIONNAL (default = true)
  startOne: false, // OPTIONNAL (default = true)
  fallback: false, // OPTIONNAL (default = true)
  language: "en",
  messages: {
    en: require("./locales/en.json"),
    fr: require("./locales/fr/")
  }
});
```
- **debug** (optionnel) : affiche ou masque les informations d'erreur et d'avertissement (true par default). _ex : process.env.NODE_ENV_
- **startOne** (optionnel) : définit l'index de départ pour la pluralisation, false = 0 ou true = 1 (defaut).
- **fallback** (optionnel) : si le message n'est pas trouvé dans la langue de traduction, le message est recherché dans la langue par defaut.
- **language** : est la langue intiale à utiliser. _"en"_ est un exemple.
- **messages** : est un objet représentant les messages de traduction. Il peut etre :
  - un json direct :
```
messages: {
  en: {
        title : "Welcome on my website",
        cart : "Cart",
        ...
      },
  fr: {
        title : "Bienvenue sur mon site",
        cart : "Panier",
        ...
      }     
}
```

  - un import de fichiers soit unique (en.json), soit multiples (fr) et dans ce cas, il est necessaire d'utiliser un fichier js d'import comme le montre l'exemple.
  Supposons la structure suivante :
```
mains.js
locales/
  |_ en.json
  |_ fr/
    |_ home.json
    |_ menu.json
    |_ index.js
```

Nous pourrons configurer le plugin de cette manière :
```
messages: {
  en: require("./locales/en.json"),
  fr: require("./locales/fr/")
}
```

Avec pour le fichier en.json :
```
{
  home : {
    title : "Movies page",
    count : "There is {0} movie|There are {0} movies",
    author : "{0} auteur|{0} auteurs",
    ...
  },
  menu: {
    connect : "Se connecter",
    disconnect : "Se déconnecter",
    about : "A propos",
    ...
  }
}
```

Pour fr/index.js (par exemple) :
```
export * from './home.json';
export * from './menu.json';
```

Pour home.json
```
home: {
  title : "Page de films",
  count : "Il y à {0} films",
  author : "{0} auteur|{0} auteurs",
  ...
}
```

Et pour finir menu.json :
```
menu: {
  connect : "Se connecter",
  disconnect : "Se déconnecter",
  about : "A propos",
  ...
}
```

#### Utilisation (méthodes)
Une fois installé, le plugin ets disponible dans tous les composants.
Pour l'utiliser, il suffit d'appeller une des methodes suivantes :

TODO
- $lng(msg)
- $lng(msg,val)
- $lng(msg,{index, val}) 
- $lngT(msg,{index, val})
- $lngGet(msg,{index, val}) 
- $lngSet(msg,{index, val}) 

