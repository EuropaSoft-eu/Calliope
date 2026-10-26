# Calliope — notes de développement

Ce document s'adresse à qui modifie le code (personne ou agent IA). L'utilisateur, lui,
n'a besoin que du [README](README.md).

## Structure

Tout tient dans `Calliope.html` (~152 Ko), en sections délimitées et commentées :

```
<style>            thèmes, mise en page, styles d'aperçu et d'impression
<svg>              jeu d'icônes
markup             barre de titre, barre de mise en forme, éditeur, aperçu, barre d'état
<script> ×5        feuille de style des exports · parseur Markdown · moteur de
                   coloration · logique de l'application · test de régression
```

À côté :

| Fichier | Rôle |
|---|---|
| `index.html` | Redirige l'adresse courte du site vers `Calliope.html` |
| `sw.js` | Hors ligne de l'application installée — en ligne seulement, facultatif |
| `llms.txt` | Guide pour les agents IA, copie du bloc `#guide-agents` |
| `AppInfo.json` | Identité et historique des versions (fichier de projet) |
| `README.md` | Présentation pour l'utilisateur |
| `DEVELOPPEMENT.md` | Ce document |
| `.memoire/` | Journal de suivi des modifications (fichier de projet) |

## Servir en local

Pour tester l'installation, le service worker ou l'enregistrement en place hors du
site en ligne :

```bash
python3 -m http.server 8765
```

Puis ouvrir `http://localhost:8765/Calliope.html`. `localhost` compte comme une
origine sûre : l'application y est installable.

## Installation (PWA)

- Le manifeste est fabriqué au démarrage à partir du logo (URL `blob:`), l'icône
  Apple aussi : aucun fichier compagnon nécessaire.
- `sw.js` n'est enregistré qu'en http(s), et l'échec est silencieux s'il est absent.
  Stratégie : réponse depuis le cache, mise à jour en arrière-plan. Incrémenter
  `CACHE` à chaque publication purge l'ancien cache.
- `INFOS.adresse` (section 11 de `Calliope.html`) donne l'adresse en ligne affichée
  quand l'application est ouverte en `file://`. **À modifier si le site change
  d'adresse**, comme les liens du README.

## Guide pour agents IA

Modifier le bloc `<script type="text/markdown" id="guide-agents">` en tête de
`Calliope.html`, puis recopier son contenu dans `llms.txt`.

## Tests

Ouvrir `Calliope.html#test-alignement`. Le test s'exécute sur l'**éditeur réel** :
il compare la position de chaque caractère coloré à celle du même texte rendu sans
coloration — c'est-à-dire là où le navigateur place réellement le curseur — sur les
trois polices, trois tailles et trois largeurs de colonne, et vérifie les deux
invariants ci-dessous. Treize mesures, verdict vert ou rouge. Le document en cours et
sa sauvegarde locale sont mis de côté puis restaurés.

## Comment fonctionne la coloration dans l'éditeur

Une zone de saisie ne peut pas contenir de HTML. L'éditeur superpose donc deux
calques exactement alignés : un `<pre>` coloré en dessous, et le `<textarea>` au-dessus
avec `color: transparent` et un `caret-color` visible. Les deux partagent police,
taille, interlignage, retour à la ligne et marges, et leurs défilements sont
synchronisés.

Deux invariants à ne jamais casser :

1. **Le texte du calque est strictement identique à celui de la zone de saisie**, au
   caractère près. Toute la coloration se fait en un seul balayage de regex, avec une
   fonction de remplacement, pour que le balisage inséré ne soit jamais réexaminé par
   les motifs suivants.
2. **Le calque ne modifie aucune métrique du texte.** Une zone de saisie n'a qu'une
   fonte, une graisse et une hauteur de ligne : tout ce qui change la taille, l'avance
   des glyphes ou la largeur utile décale le curseur, cumulativement. Sont donc
   interdits `font-size`, `letter-spacing`, `text-transform`, les marges en ligne — et
   la barre de défilement de la zone de saisie est masquée, faute de quoi ses 11 px
   feraient couper les lignes plus tôt que dans le calque. Le gras et l'italique ne
   sont conservés qu'en police à chasse fixe, où les variantes gardent la même avance.

La hiérarchie des titres est donc portée par la **couleur seule**, jamais par la taille.
Ces couleurs ne sortent jamais de l'éditeur : aperçu, exports et fichier `.md` restent
neutres.

## Vues : lecture, lecture + édition, édition

`state.vue` vaut `lecture`, `double` ou `edition` ; `state.split` en dérive (aperçu
visible). Tout passe par `setVue()`. La vue **n'est pas mémorisée** dans les
préférences, c'est voulu : un fichier ouvert (`loadText`, donc aussi
`calliope.ecrire`) arrive en `double`, un document neuf (`newDoc`) en `edition`, le
démarrage en `double` s'il y a du texte. `Ctrl/Cmd+P` fait tourner les vues.

- En `double`, un clic dans le rendu (sans sélection en cours) place le curseur sur
  la ligne source du bloc (`data-line`).
- En `lecture`, un double-clic bascule en `double`, curseur sur la ligne.
- En `lecture`, barre de mise en forme masquée et outils d'écriture désactivés.

## Défilement synchronisé

L'aperçu est plus haut que l'éditeur — titres agrandis, marges, blocs encadrés :
sur un long document l'écart atteint 17 %. Un simple pourcentage décalerait donc la
lecture de plusieurs dizaines de lignes. Chaque bloc de l'aperçu porte sa **ligne de
source** (`data-line`), et les deux panneaux s'alignent sur la ligne réellement
affichée en haut, en interpolant entre deux ancres. Le lien fonctionne dans les deux
sens.

## Choix d'édition

- Les raccourcis passent par `insertText`, donc `Cmd+Z` annule normalement.
- La note de bas de page n'est jamais posée dans le bloc des définitions — sinon une
  note finirait par en écraser une autre.
- Retour à la ligne : par défaut, chaque retour est rendu tel qu'il apparaît à
  l'écran (contraire du Markdown strict, où il ne vaut qu'un espace). Le menu propose
  le comportement strict. Listes, tableaux et code ne sont pas concernés.
- Restent accessibles au clavier seulement : gras italique combiné, liens de
  référence, titres Setext, retour à la ligne forcé (deux espaces en fin de ligne).

## Sécurité du rendu

Tout le HTML source est échappé (pas de HTML brut injecté) et les URL en
`javascript:`, `vbscript:` ou `data:` non-image sont neutralisées.

## Documents récents

Sur Chrome et Edge, le **descripteur** de fichier est conservé dans IndexedDB : un
clic rouvre le document depuis le disque, après autorisation du navigateur. Safari et
Firefox n'exposent pas cette API — les entrées y restent un historique de noms.
