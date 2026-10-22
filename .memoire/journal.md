# Journal du projet Calliope

Mémoire de suivi : une entrée par modification, la plus récente en haut.

## 2026-10-22 — README corrigé, guide agents élargi

- README : section « Tests » en double (renvoyait à `tests/alignement.html`, inexistant) supprimée ; la bonne reste `Calliope.html#test-alignement`.
- README « Structure » : taille de `Calliope.html` actualisée, tableau des fichiers compagnons.
- Guide agents (bloc `#guide-agents` + `llms.txt`, synchronisés) : section PDF remplacée par « Calliope comme réceptacle » — toute source (image, PDF, web, audio, consigne) analysée par l'agent puis écrite en Markdown.
- Vérifié : image `data:image/png;base64` rendue dans l'aperçu.

## 2026-10-22 — Guide et interface pour agents IA

- `Calliope.html` : bloc `<script type="text/markdown" id="guide-agents">` en tête du `<body>` (inerte, invisible) + commentaire dans `<head>` qui y renvoie.
- `llms.txt` (racine) : copie exacte du guide. **À resynchroniser à chaque modification du bloc.**
- Section 11 bis : `window.calliope` gelé — `version`, `lire`, `nom`, `ecrire(texte, nom, {remplacer})`, `inserer`, `ajouter`, `html`, `enregistrer`, `aide`.
- `ecrire()` : refuse si document modifié (sauf `remplacer: true`), remet `handle` à null pour ne pas réécrire l'ancien fichier, laisse le document « modifié ».
- `textarea#editor` : `aria-label="Document Markdown"` (lisible par l'arbre d'accessibilité des agents).
- Testé en http et file:// : tous les appels OK, aucune erreur JS.
- Non fait : WebMCP (`navigator.modelContext`), proposition encore en cours — à réévaluer.
- Constat (corrigé ensuite) : section « Tests » en double dans le README.

## 2026-10-22 — Bouton « Installer »

- En-tête : bouton `#btnInstall` (icône `i-install`), masqué par défaut. Menu : entrée `#menuInstall`.
- Section 11 de `Calliope.html` : `installer()`, `guideInstallation()`, `majBoutonInstall()`, `dejaInstalle()`.
- Chrome/Edge/Android : capture `beforeinstallprompt`, le bouton lance la vraie boîte d'installation.
- iOS/iPadOS, Safari Mac, Firefox, autres : fenêtre avec les gestes à faire.
- `file://` : bouton masqué, l'entrée de menu renvoie vers `INFOS.adresse`.
- Déjà lancé comme application : bouton et entrée de menu masqués.
- `INFOS.adresse` = adresse en ligne. **À modifier si le dépôt passe sous l'organisation EuropaSoft ou sur un domaine propre.**
- Fiche « À propos », ligne Réseau corrigée.
- Testé (Chromium) : Chrome en ligne, iPhone simulé, file://, mode application ; aucune erreur JS. Non testé sur vrais appareils iOS/Mac.

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
| `llms.txt` | Guide pour agents IA (copie du bloc `#guide-agents`) |
| `sw.js` | Service worker : hors ligne de l'app installée (mode en ligne seulement) |
| `index.html` | Redirection vers `Calliope.html` (adresse courte du site) |
| `AppInfo.json` | Métadonnées de l'application |
| `README.md` | Présentation et mode d'emploi |
| `LICENSE` | Licence |
