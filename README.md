# VUE-LNG

[Documentation en Français](#fr)

#en
## Welcome to the view-lng page
view-lng is a plugin facilitating multilingual projects in Vue.js.

### How to use
#### Installation
After creating a Vue.js project
You have to install the package: 
```
npm i vue-lng
```

Then, in the ** mains.js ** file at the root of the project, you need to import the plugins:
```
import lng from "vue-lng";
```
The plugin is now present in the project

#### Configuration
To add the plugin to the view instance:
```
Vue.use(lng, {
  debug: false,    // OPTIONNAL (default = true)
  startOne: false, // OPTIONNAL (default = false)
  language: "fr",  // OPTIONNAL (default = autodetect browser language)
  fallback: "en",
  messages: {
    en: require("./locales/en.json"),
    fr: require("./locales/fr/")
  }
});
```
- **debug** (optionnal) : ashow or hide error and warning information (true by default). _ex: process.env.NODE_ENV_
- **startOne** (optionnal) : sets the starting index for pluralization, false = 0 (default) or true = 1.
- **language** : (optionnal) is the default language to use. _ "fr" _ is an example.
- **fallback** : if the message is not found in the language of translation, the message is searched in this language.
- **messages** : is an object representing the translation messages. He can be :
  - a direct json:
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

- an import of file, unique (en.json), or multiple (fr) and in this case, it is necessary to use a file js of import as the example shows.
  Suppose the following structure:
```
mains.js
locales/
  |_ en.json
  |_ fr/
    |_ home.json
    |_ menu.json
    |_ index.js
```

We can configure the plugin this way:
```
messages: {
  en: require("./locales/en.json"),
  fr: require("./locales/fr/")
}
```

For the en.json file:
```
{
  home : {
    title : "Books page",
    count : "There is {N} book(s)",
    gender : "With {0} thrillers, {1} mangas",
    author : "{0} author|{0} authors",
    ...
  },
  menu: {
    home : "Home",
    about : "A propos",
    ...
  }
}
```

For fr/index.js file (example) :
```
export * from './home.json';
export * from './menu.json';
```

For home.json file
```
home: {
  title : "Page de livres",
  count : "Il y à {N} livre(s)",
  gender : "Dont {0} thrillers, {1} mangas",
  author : "{0} auteur|{0} auteurs",
  ...
}
```

And to finish menu.json:
```
menu: {
  home : "Accueil",
  about : "A propos",
  ...
}
```

#### Use (methods)
Once installed, the plugin is available in all components.
To use it, just call one of the following methods:

**Retrieve the message of the current language**
```
$lng(path, p1, p2)
--
path : the json path. ex : $lng(home.title)

#case of non-pluralization : 
p1: the number or value to replace.
p2: useless.
ex : $lng(home.count, {"N":3}) ou $lng(home.gender, [3, 6]) =  "With 3 thrillers, 6 mangas"

#with pluralization :
p1: index to use (the message is cut by a pipe |)
p2: the number or value to replace.
ex: $ lng ("home.author, 1, [6]) =" 6 authors "
```

**Retrieve the messages of a language different from the current language**
```
$ lngT (path, language, p1, p2)
-
path: the json path. ex: $ lng (home.title)

language : the language of translation
ex : $lng("menu.about") and $lngT("menu.about", "fr") = "About" and "A propos

#case of non-pluralization:
p1: the number or value to replace.
p2: useless.
ex : $lngT(home.count, "fr", {"N":3}) ou $lngT(home.gender, "fr", [3, 6]) =  "Dont 3 thrillers, 6 mangas"

#case of pluralization:
p1: index to use (the message is cut by a pipe |)
p2: the number or value to replace.
ex : $lng("home.author, "fr", 1, [6]) = "6 auteurs"
```

**Définir la langue courante**
```
$lngSet(language);
--
language: desired language

ex : $lngSet("fr")
```

**Retrieves the current language**
```
$lngGet();
--
ex : $lngGet(), return "en"
```

**Retrieves the list of configured languages​​**
```
$lngGetAll();
--
ex : $lngGetAll(), return a string array ["en", "fr"]
```

#### Demo
Of course, an example is better than a thousand words.
Go to the [GIT page of the demo project](https://github.com/BriceChaponneau/vue-plugins-demo) to test.

Thank you

---
[English documentation](#en)

#fr
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
  debug: false,    // OPTIONNEL (defaut = true)
  startOne: false, // OPTIONNEL (defaut = false)
  language: "en", // OPTIONNEL (defaut = true)
  fallback: "fr",
  messages: {
    en: require("./locales/en.json"),
    fr: require("./locales/fr/")
  }
});
```
- **debug** (optionnel) : affiche ou masque les informations d'erreur et d'avertissement (true par default). _ex : process.env.NODE_ENV_
- **startOne** (optionnel) : définit l'index de départ pour la pluralisation, false = 0 (defaut) ou true = 1.
- **language** (optionnel) : est la langue intiale à utiliser. _"en"_ est un exemple.
- **fallback** : si le message n'est pas trouvé dans la langue de traduction, le message est recherché dans cette langue par defaut.
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

Pour le fichier en.json :
```
{
  home : {
    title : "Books page",
    count : "There is {N} book(s)",
    gender : "With {0} thrillers, {1} mangas",
    author : "{0} author|{0} authors",
    ...
  },
  menu: {
    home : "Home",
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
  title : "Page de livres",
  count : "Il y à {N} livre(s)",
  gender : "Dont {0} thrillers, {1} mangas",
  author : "{0} auteur|{0} auteurs",
  ...
}
```

Et pour finir menu.json :
```
menu: {
  home : "Accueil",
  about : "A propos",
  ...
}
```

#### Utilisation (méthodes)
Une fois installé, le plugin est disponible dans tous les composants.
Pour l'utiliser, il suffit d'appeller une des methodes suivantes :

**Récupérer le message de la langue courante**
```
$lng(path, p1, p2)
--
path : le chemin json. ex : $lng(home.title)

#cas de non pluralisation : 
p1 : le numéro ou la valeur à remplacer.
p2 : inutile.
ex : $lng(home.count, {"N":3}) ou $lng(home.gender, [3, 6]) =  "Dont 3 thrillers, 6 mangas"

#cas de pluralisation :
p1 : index à utiliser (le message est découpé par un pipe |)
p2 : le numéro ou la valeur à remplacer.
ex : $lng("home.author, 1, [6]) = "6 auteurs"
```


**Récupérer les message d'une langue différente de la langue courante**
```
$lngT(path, language, p1, p2)
--
path : le chemin json. ex : $lng(home.title)

language : la langue de traduction
ex : $lng("menu.about") et $lngT("menu.about", "en") = "A propos" et "About

#cas de non pluralisation : 
p1 : le numéro ou la valeur à remplacer.
p2 : inutile.
ex : $lngT(home.count, "en", {"N":3}) ou $lngT(home.gender, "en", [3, 6]) =  "With 3 thrillers, 6 mangas"

#cas de pluralisation :
p1 : index à utiliser (le message est découpé par un pipe |)
p2 : le numéro ou la valeur à remplacer.
ex : $lng("home.author, "en", 1, [6]) = "6 authors"
```

**Définir la langue courante**
```
$lngSet(language);
--
language : langue souhaitée

ex : $lngSet("en")
```


**Récupère la langue courante**
```
$lngGet();
--
ex : $lngGet(), retourne "fr"
```

**Récupère la liste des langues paramétrés**
```
$lngGetAll();
--
ex : $lngGetAll(), retourne un tableau de chaine de caractères ["en", "fr"]
```

#### Démonstration
Bien entendu, un exemple vaut mieux que mille mots.
Rendez vous sur la [page GIT du projet de démo](https://github.com/BriceChaponneau/vue-plugins-demo) pour tester.

Merci