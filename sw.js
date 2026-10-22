/* =========================================================================
 * sw.js — fonctionnement hors ligne de Calliope installé
 *
 * Ce fichier ne sert que lorsque Calliope est servi en http(s), par exemple
 * sur GitHub Pages. Calliope.html reste autonome : téléchargé seul et ouvert
 * en file://, il n'enregistre aucun service worker et fonctionne tel quel.
 *
 * Stratégie : réponse immédiate depuis le cache, puis mise à jour du cache en
 * arrière-plan. Une nouvelle version publiée est donc prise au lancement
 * suivant. Aucune requête ne sort de l'origine du site.
 * ========================================================================= */

var CACHE = 'calliope-v1';
var FICHIERS = ['./', './index.html', './Calliope.html'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(FICHIERS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (cles) {
        return Promise.all(cles.filter(function (k) { return k !== CACHE; })
                               .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(req, { ignoreSearch: true }).then(function (enCache) {
        var reseau = fetch(req).then(function (rep) {
          if (rep.ok) c.put(req, rep.clone());
          return rep;
        });
        if (enCache) {
          e.waitUntil(reseau.catch(function () {}));
          return enCache;
        }
        return reseau;
      });
    })
  );
});
