/* eslint-disable no-console */
/**
 *  ___
 * /\_ \
 * \//\ \     ___      __
 *   \ \ \  /' _ `\  /'_ `\
 *    \_\ \_/\ \/\ \/\ \L\ \
 *    /\____\ \_\ \_\ \____ \
 *    \/____/\/_/\/_/\/___L\ \
 *                     /\____/
 *                     \_/__/
 *
 * name : lng
 * description : Plugin to internationalize app with Vue.js
 * author : Brice CHAPONNEAU
 * version : 1.0.3
 *
 */

class lng {
  /**
   * @constructor
   * @param {*} Vue
   * @param {*} opts
   */
  constructor(Vue, opts) {
    if (opts.messages === undefined)
      throw new Error("Plugin lng : [options.messages] is undefined");
    if (opts.fallback === undefined)
      throw new Error("Plugin lng : [options.fallback] is undefined");

    // création d'une nouvelle instance pour gérer des données réactives
    this.storeVM = new Vue({
      data() {
        return {
          debug: true, // affiche les message d'alerte
          startOne: false, // démarre l'index à 0 ou 1 pour la pluralisation
          language: "en", // langue courante
          fallback: "fr", // langue de fallback
          messages: {}, // messages par langues
          json: {} // messages de la langue courante
        };
      }
    });

    // OPTIONS UTILISATEUR
    // mode debug (console.warn)
    if (typeof opts.debug === "boolean") this.storeVM.$data.debug = opts.debug;

    // indice de découpage pluralize
    if (typeof opts.startOne === "boolean")
      this.storeVM.$data.startOne = opts.startOne;

    // utilise la langue par default si la lnague est introuvable
    if (typeof opts.fallback === "string")
      this.storeVM.$data.fallback = opts.fallback;

    // chargement des messages
    this.storeVM.$data.messages = opts.messages;

    // définition de la langue courante
    if (window.localStorage.language === undefined) {
      if (opts.language) this.storeVM.$data.language = opts.language;
      else
        this.storeVM.$data.language =
          opts.language ||
          this._isoCleaner(
            navigator.userLanguage ||
              navigator.language ||
              navigator.browserLanguage ||
              this.storeVM.$data.fallback
          );

      // sauvegarde automatique de la langue dans le localstorage
      window.localStorage.language = this.storeVM.$data.language;
    } else {
      this.storeVM.$data.language = window.localStorage.language;
    }

    // charge le(s) fichier(s) de la langue courante
    if (
      this.storeVM.$data.messages[this.storeVM.$data.language] instanceof Array
    ) {
      this.storeVM.$data.json = this.extendJson(
        this.storeVM.$data.messages[this.storeVM.$data.language]
      );
    } else {
      this.storeVM.$data.json = this.storeVM.$data.messages[
        this.storeVM.$data.language
      ];
    }

    // messages undefined
    if (this.storeVM.$data.json === undefined) {
      if (this.storeVM.$data.fallback) {
        const defaut = this.storeVM.$data.fallback;

        if (this.storeVM.$data.debug)
          console.error(
            `Plugin lng : language "${
              this.storeVM.$data.language
            }" not found, fallback to "${defaut}"`
          );

        window.localStorage.language = defaut;
        this.storeVM.$data.language = defaut;
        this.storeVM.$data.json = this.storeVM.$data.messages[defaut];

        if (this.storeVM.$data.json === undefined)
          throw new Error(
            `Plugin lng : fallback language error, "${defaut}" not found !`
          );
      } else {
        if (this.storeVM.$data.debug)
          console.error(
            `Plugin lng : language "${this.storeVM.$data.language}" not found !`
          );
      }
    }
  }

  /**
   * ISOCLEANER
   * @description LIMITATION AUX LANGUES CONNUES, SINON, EN
   * @param {string} iso
   */
  _isoCleaner(iso) {
    if (!iso) return this.storeVM.$data.fallback;
    return iso.split("-")[0].toLowerCase();
  }

  /**
   * EXTENDJSON
   * @description MERGE LE CONTENU D'UN OU PLUSIEURS JSON EN UN UNIQUE JSON
   * @param {*} sources
   */
  _extendJson(sources) {
    const res = {};
    sources.forEach(src =>
      Object.keys(src).forEach(key => {
        res[key] = src[key];
      })
    );
    return res;
  }

  /**
   * JSONPATHTOVALUE
   * @description CHERCHE LA VALEUR D'UN CHEMIN DANS UN JSON
   * json   : {"menu": { "home": "Accueil", "registration": "Inscription", "agenda": "Agenda" }...}
   * path   : menu.registration
   * retour : Inscription
   *
   * @param {string} json
   * @param {string} path
   * @param {string} error
   */
  _jsonPathToValue(json, path, error = null) {
    if (!(json instanceof Object) || typeof path === "undefined") {
      if (this.storeVM.$data.debug)
        console.warn(
          `Plugin lng : Not valid argument:json:${json}, path: ${path}`
        );
      return;
    }
    path = path.replace(/\[(\w+)\]/g, ".$1"); // converti les index en propriétés
    path = path.replace(/^\./, ""); // supprime le premier point

    const pathArray = path.split(".");
    for (let i = 0, n = pathArray.length; i < n; ++i) {
      const key = pathArray[i];
      if (key in json) {
        if (json[key] !== null) {
          json = json[key];
        } else {
          return null;
        }
      } else {
        return error === null ? key : error;
      }
    }

    return json;
  }

  /**
   * SUPPLANT
   * @description PLACE LES VALEURS DANS UNE CHAINE DANS L'ORDRE INDIQUE
   * str       : Bonjour {0} {1} ou Bonjour {civility} {name}
   * supplants : ['Monsieur', 'Jean'] ou {civility: 'Monsieur', name: 'Jean'}
   * retour    : Bonjour Monsieur Jean
   *
   * (info)
   * Array  : L'ordre est important
   * Object : L'ordre n'a pas d'importance
   * @param {string} str
   * @param {array[string] or object} supplants
   */
  _supplant(str, supplants) {
    if (supplants === undefined) return str;

    str = JSON.stringify(str);
    if (str.substr(0, 1) === '"' && str.substr(str.length - 1, 1) === '"') {
      str = str.substring(1, str.length - 1);
    }

    if (supplants instanceof Array) {
      supplants.forEach((s, i) => {
        str = str.replace(`{${i}}`, s);
      });
    } else if (typeof supplants === "object") {
      Object.keys(supplants).forEach(key => {
        str = str.replace(`{${key}}`, supplants[key]);
      });
    }
    return str;
  }

  /**
   * LNG
   * @description
   * @param {*} src
   * @param {*} path
   * @param {*} p1
   * @param {*} p2
   */
  _lng(src, path, p1, p2) {
    if (path === undefined) return src;

    const error = `$lng -> path "${path}" not found !`;
    let val = this._jsonPathToValue(src, path, error);
    let supplants = null;

    // la valeur vaut le path ou le path n'existe pas
    if (val === path || val === error) return val;

    // normal
    if (p2 === undefined) {
      supplants = p1;
    } // pluralize
    else {
      supplants = p2;
      const index = this.storeVM.$data.startOne === true ? 1 : 0;
      const str = val.split("|")[p1 - index];
      if (str === undefined) return `$lng -> path "${path}[${p1}]" not found !`;
      val = str;
    }

    // SI aucun supplants, retourne la chaine
    // SINON supplants
    if (supplants === null) return val;
    return this._supplant(val, supplants);
  }

  /**
   * LNG
   * @description RECUPERE LA VALEUR DANS LE JSON
   * @param {*} path
   * @param {*} p1
   * @param {*} p2
   */
  lng(path, p1, p2) {
    return this._lng(this.storeVM.$data.json, path, p1, p2);
  }

  /**
   * LNGT
   * @description RECUPERE LA VALEUR DANS LE JSON POUR UNE LANGUE SPECIFIQUE
   * @param {*} path
   * @param {*} language
   * @param {*} p1
   * @param {*} p2
   */
  lngT(path, language, p1, p2) {
    const fallback = this.storeVM.$data.messages[this.storeVM.$data.fallback];
    const translate = this.storeVM.$data.messages[language];

    if (translate === undefined) {
      if (this.storeVM.$data.debug)
        console.warn(`$lngT -> path "${path}" for "${language}" not found !`);
      if (this.storeVM.$data.fallback) return this._lng(fallback, path, p1, p2);
      return `$lngT -> path "${path}" for "${language}" not found !`;
    }

    return this._lng(translate, path, p1, p2);
  }

  /**
   * LNGSET
   * @description AFFECTE LA LANGUE
   * @param {string} language
   */
  lngSet(language = this.storeVM.$data.fallback) {
    const errorNotExist = `Plugin lng : language [${language}] does not exist, selected : [${
      this.storeVM.$data.fallback
    }]`;
    const errorUndefined = `Plugin lng : language [${language}] is undefined, selected : [${
      this.storeVM.$data.language
    }]`;

    // la langue est la même que celle déjà definie. on ne fait rien
    if (language === this.storeVM.$data.language) return;

    // la langue n'est pas definit dans l'instance
    if (!this.lngGetAll().includes(language)) {
      if (this.storeVM.$data.debug) console.warn(errorNotExist);
      if (this.storeVM.$data.fallback) {
        language = this.storeVM.$data.fallback;
        return;
      }
      console.warn(errorNotExist);
      return;
    }

    let msg = this.storeVM.$data.messages[language];
    if (msg === undefined && !this.storeVM.$data.fallback) {
      console.warn(errorUndefined);
      return;
    }
    if (msg === undefined) {
      if (this.storeVM.$data.debug) console.warn(errorUndefined);
      language = this.storeVM.$data.fallback;
    }

    this.storeVM.$data.language = this._isoCleaner(language);
    this.storeVM.$data.json = this.storeVM.$data.messages[language];
    window.localStorage.language = language;
  }

  /**
   * LNGGETa
   * @description RETOURNE LA LANGUE COURANTE
   */
  lngGet() {
    return this.storeVM.$data.language;
  }

  /**
   * LNGGETALL
   * @description RETOURNE TOUTES LES LANGUES CONNUES
   */
  lngGetAll() {
    return Object.keys(this.storeVM.$data.messages);
  }
}

export default {
  /**
   * Install lng plugin
   * @param {Vue} Vue - Vue instance
   * @param {Object} options - Options for the plugin
   */
  install: (Vue, options = {}) => {
    const instance = new lng(Vue, options);
    Vue.prototype.$lng = (path, p1, p2) => instance.lng(path, p1, p2);
    Vue.prototype.$lngT = (path, language, p1, p2) =>
      instance.lngT(path, language, p1, p2);
    Vue.prototype.$lngSet = language => instance.lngSet(language);
    Vue.prototype.$lngGet = () => instance.lngGet();
    Vue.prototype.$lngGetAll = () => instance.lngGetAll();
  }
};
