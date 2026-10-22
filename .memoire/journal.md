# Journal du projet Calliope

Mémoire de suivi : une entrée par modification, la plus récente en haut.

## 2026-10-22 — Application installable et utilisable hors ligne (PWA)

- Constat : manifeste déjà généré au démarrage (URL blob) ; test Chromium → installable, aucune erreur.
- Manque comblé : aucun service worker → l'app installée ne s'ouvrait pas hors ligne.
- Ajout `sw.js` (racine) : cache `calliope-v1`, réponse depuis le cache puis mise à jour en arrière-plan.
- `Calliope.html` : fonction `enregistrerHorsLigne()` (section 11), appelée au démarrage ; n'agit qu'en http(s), échec silencieux si `sw.js` absent.
- Vérifié : installable sur localhost, rechargement hors ligne OK, aucune erreur JS ; `file://` sans erreur.
- README : mention de `sw.js` et du fonctionnement hors ligne, phrase « aucun appel réseau » corrigée.
- **Bloquant hors code** : GitHub Pages non activé (toutes les adresses en 404). À faire par Yoann : Settings → Pages → Deploy from a branch → `main` / `(root)`.
- Pour publier une nouvelle version : incrémenter `CACHE` dans `sw.js` n'est pas obligatoire (mise à jour en arrière-plan), mais conseillé pour purger l'ancien cache.

## 2026-10-22 — Sortie de l'application du dossier `Calliope 0.0.1/`

- Fichiers déplacés à la racine : `Calliope.html`, `index.html`, `AppInfo.json`, `README.md`, `LICENSE`.
- Dossier `Calliope 0.0.1/` supprimé.
- But : rétablir l'adresse GitHub Pages `yoann-cramatte.github.io/calliope/Calliope.html` citée dans le README.
- Aucun fichier ne référençait le chemin `Calliope 0.0.1` : pas d'autre correction nécessaire.

## Structure actuelle

| Fichier | Rôle |
|---|---|
| `Calliope.html` | L'application entière (HTML, CSS, JS, un seul fichier) |
| `sw.js` | Service worker : hors ligne de l'app installée (mode en ligne seulement) |
| `index.html` | Redirection vers `Calliope.html` (adresse courte du site) |
| `AppInfo.json` | Métadonnées de l'application |
| `README.md` | Présentation et mode d'emploi |
| `LICENSE` | Licence |
