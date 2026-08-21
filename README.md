# Calliope

Éditeur Markdown sans distraction, écrit **entièrement en HTML, CSS et JavaScript purs**.
Interface et modes inspirés de l'application GNOME
[Apostrophe](https://flathub.org/en/apps/org.gnome.gitlab.somas.Apostrophe), réimplémentés
de zéro pour le navigateur.

> *Calliope, muse de l'éloquence et de la poésie épique, sœur de Clio.*

- **Zéro dépendance** : ni framework, ni bibliothèque, ni CDN.
- **Zéro build** : pas de npm, pas de bundler, pas d'étape de compilation.
- **Zéro réseau** : tout fonctionne hors ligne, y compris en `file://`.

Le parseur Markdown et le moteur de coloration syntaxique sont écrits à la main
(≈ 440 lignes de JavaScript) — c'est le cœur du projet.

## Lancer

Double-cliquer sur `Calliope.html`. C'est tout : **un seul fichier**, aucune ressource
externe, aucun dossier compagnon. On peut le copier, l'envoyer par courriel ou le poser
sur une clé — il s'ouvre partout, hors ligne.

Pour le servir en HTTP (utile pour l'API fichiers de Chrome, qui permet de réécrire un
fichier en place) :

```bash
python3 -m http.server 8765
```

Puis ouvrir `http://localhost:8765/Calliope.html`.

## Installer comme une application

Le fichier déclare un manifeste d'application, fabriqué au démarrage à partir de son
logo. Là où c'est possible, Calliope s'installe donc comme un logiciel : fenêtre
propre, sans barre d'adresse, icône dans le dock ou le menu Démarrer.

| Contexte | Résultat |
|---|---|
| Servi en **https** ou sur **localhost** | Installable — Chrome et Edge proposent « Installer » dans la barre d'adresse ; Safari (macOS 14+) propose « Ajouter au Dock » ; Android et iOS, « Ajouter à l'écran d'accueil » |
| Ouvert en **`file://`** (double-clic) | Pleinement utilisable, mais **non installable** : les navigateurs réservent l'installation aux origines sûres |

L'icône d'onglet, elle, s'affiche partout, y compris en `file://`.

> **À savoir** : l'icône du fichier `.html` dans le Finder ou l'Explorateur ne peut pas
> être changée depuis le fichier lui-même — c'est une propriété du système, pas du
> document. Sur macOS, se faire sa propre icône passe par *Lire les informations* puis
> un collage d'image.

## Fonctionnalités

### Les quatre modes

| Mode | Raccourci | Effet |
|---|---|---|
| **Focus** | `Cmd/Ctrl + D` | Tout s'estompe sauf le paragraphe où se trouve le curseur |
| **Hemingway** | `Cmd/Ctrl + H` | Retour arrière, suppression et annulation désactivés |
| **Machine à écrire** | `Cmd/Ctrl + T` | La ligne courante reste centrée verticalement |
| **Aperçu** | `Cmd/Ctrl + P` | Rendu HTML en direct, défilement synchronisé |

Chaque mode annonce son effet quand on l'active, et sa bulle d'aide décrit ce qu'il fait.

### Défilement synchronisé

L'aperçu est plus haut que l'éditeur — titres agrandis, marges, blocs encadrés :
sur un long document l'écart atteint 17 %. Un simple pourcentage décalerait donc la
lecture de plusieurs dizaines de lignes. Chaque bloc de l'aperçu porte donc sa **ligne
de source** (`data-line`), et les deux panneaux s'alignent sur la ligne réellement
affichée en haut, en interpolant entre deux ancres. Le lien fonctionne dans les deux
sens.

### Barre de mise en forme

Une barre d'insertion (masquable, `Cmd/Ctrl + Maj + B`) donne accès en un clic à :

| Groupe | Boutons |
|---|---|
| Titres | `H1` `H2` `H3` `H4` `H5` `H6` — à bascule : un second clic retire le titre |
| Texte | gras, italique, barré, surligné, code en ligne, bloc de code, **formule** |
| Listes | à puces, numérotée, **case à cocher**, citation — à bascule également — plus indenter / désindenter |
| Blocs | **tableau** (nombre de colonnes et de lignes au choix), ligne de séparation |
| Insertions | lien, image, note de bas de page (numérotée automatiquement) |

La note de bas de page pose sa référence dans le texte et prépare sa définition en fin
de document ; le curseur reste où l'on écrivait. La référence n'est jamais posée dans
le bloc des définitions — sinon une note finirait par en écraser une autre.

Chaque bouton affiche au survol une **bulle** avec son nom et son raccourci, mis en
forme selon la plateforme (`⌘⇧1` sur macOS, `Ctrl+Maj+1` ailleurs). Le menu principal
propose aussi le mode **« Libellés visibles »**, actif par défaut : le nom s'inscrit
alors en permanence sous chaque icône, dans la barre de mise en forme comme dans la
barre de titre.

Les boutons s'appliquent à toutes les lignes sélectionnées : sélectionner trois lignes
et cliquer sur « liste numérotée » produit `1.` `2.` `3.`. Après une insertion, le
texte à remplacer est déjà sélectionné — le tableau met « Colonne 1 » en surbrillance,
il n'y a plus qu'à taper.

### Savoir où l'on écrit

Les boutons de la barre **s'allument** selon l'endroit du curseur : dans une liste de
tâches, le bouton *Case* est actif ; dans une citation, le bouton *Citation* l'est.
Un bouton allumé se reclique pour **sortir** du contexte et revenir au texte normal.
La barre d'état nomme ce contexte et rappelle, pour les listes et les citations,
qu'une ligne vide suivie d'`Entrée` en fait sortir — sans quoi chaque `Entrée`
prolonge la liste sans qu'on sache comment s'en échapper.

### Couleur par niveau de titre

Chaque niveau de `#` à `######` a sa propre couleur **dans l'éditeur**, reprise sur
les boutons `H1`…`H6` de la barre, pour repérer la structure d'un coup d'œil. Les trois
thèmes ont leur palette.

> Ces couleurs ne sortent jamais de l'éditeur : l'aperçu, l'export HTML, l'export PDF
> et le fichier `.md` restent strictement neutres.

### Édition

- Coloration syntaxique **dans** l'éditeur (calque superposé à la zone de saisie,
  aligné au pixel près) : titres, gras, italique, code, liens, citations, listes,
  tâches, tableaux, formules.
- Poursuite automatique des listes, listes de tâches et citations à la touche `Entrée`
  (une deuxième `Entrée` sur un élément vide sort de la liste).
- `Tab` / `Maj+Tab` : indentation et désindentation d'un élément de liste.
- Mise en forme : `Cmd+B` gras, `Cmd+I` italique, `Cmd+E` code, `Cmd+K` lien,
  `Cmd+Maj+X` barré, `Cmd+Maj+1…6` niveau de titre.
- Les raccourcis passent par `insertText`, donc `Cmd+Z` annule normalement.

Tout ce que le document d'exemple mentionne a son bouton. Restent accessibles au
clavier seulement, faute d'usage assez courant pour occuper la barre : le gras
italique combiné (`Cmd+B` puis `Cmd+I`), les liens de référence, les titres soulignés
façon Setext et le retour à la ligne forcé (deux espaces en fin de ligne).

### Markdown pris en charge

Titres ATX et Setext · gras / italique / barré / surligné · code en ligne et blocs
clôturés (avec étiquette de langage) · blocs indentés · citations imbriquées et
continuation paresseuse · listes à puces, numérotées, imbriquées et listes de tâches ·
tableaux avec alignement · liens, liens de référence, liens automatiques, images ·
notes de bas de page numérotées automatiquement · règles horizontales · retours à la
ligne forcés · formules `$…$` et `$$…$$` (rendu typographique, sans moteur LaTeX).

### Retour à la ligne

En Markdown strict, un retour à la ligne isolé ne vaut qu'un espace : la ligne suivante
se recolle au paragraphe. C'est la spécification, mais dans un éditeur de prose c'est
déroutant — on écrit une ligne, elle disparaît dans la précédente. Par défaut, Calliope
rend donc **chaque retour tel qu'il apparaît à l'écran**. Le menu propose le
comportement strict pour qui veut un fichier portable au sens littéral.
Listes, tableaux, code en ligne et blocs de code ne sont pas concernés.

**Sécurité** : tout le HTML source est échappé (pas de HTML brut injecté) et les URL
en `javascript:`, `vbscript:` ou `data:` non-image sont neutralisées.

### Fichiers et export

- **Ouvrir** (`Cmd/Ctrl + O`) : sélecteur de fichier, ou glisser-déposer sur la fenêtre.
- **Documents récents** : le bouton *Ouvrir* déroule les douze derniers fichiers
  travaillés, avec leur date relative. Sur Chrome et Edge, le **descripteur** du
  fichier est conservé dans IndexedDB : un clic rouvre vraiment le document depuis le
  disque, après une demande d'autorisation du navigateur. Safari et Firefox n'exposent
  pas cette API — les entrées y restent un historique de noms, signalé comme tel, et
  renvoient vers le sélecteur. Un fichier déplacé ou supprimé est signalé, et son
  entrée se retire d'elle-même.
- **Enregistrer** (`Cmd/Ctrl + S`) : quand le navigateur expose l'API *File System Access*
  (Chrome, Edge), le fichier ouvert est **réécrit en place**, sans boîte de dialogue.
  Sinon, le document est téléchargé sous son nom.
- **Enregistrer sous…** (`Cmd/Ctrl + Maj + S`) : choisit un nouvel emplacement.
- Sauvegarde automatique locale : le document en cours et le nom du fichier survivent
  à la fermeture de l'onglet.
- Export **page HTML autonome** : le document embarque sa propre feuille de style,
  claire et sombre, et s'ouvre seul n'importe où.
- Export **PDF** via la boîte d'impression (`Cmd/Ctrl + Maj + P`).
- Copie du Markdown ou du HTML dans le presse-papiers.

### Apparence

Quatre thèmes — **clair**, **sombre**, **nuit bleue**, **sépia** — que le bouton de la
barre de titre fait défiler. Le réglage **Auto**, qui reprend l'apparence du système,
reste dans le menu : l'inclure dans la rotation reviendrait à afficher deux fois la
même chose. Police de l'éditeur mono / serif / sans · taille de texte réglable ·
largeur de colonne étroite / normale / large.

**Mode sans distraction** (`F11`, `Échap` pour sortir) : toute l'interface disparaît,
le texte occupe l'écran entier. La barre de titre n'est qu'escamotée — amener le
pointeur sur le bord haut la fait revenir. Le plein écran du navigateur est demandé en
prime ; s'il est refusé (page en cadre, réglage de sécurité), l'application le signale
et masque l'interface malgré tout.

## Structure

Tout tient dans `Calliope.html` (~131 Ko), en sections délimitées et commentées :

```
<style>            thèmes, mise en page, styles d'aperçu et d'impression
<svg>              jeu d'icônes
markup             barre de titre, barre de mise en forme, éditeur, aperçu, barre d'état
<script> ×5        feuille de style des exports · parseur Markdown · moteur de
                   coloration · logique de l'application · test de régression
```

Le projet garde à côté `AppInfo.json` (identité et changelog) et ce `README.md` — ce
sont des fichiers de projet, pas des fichiers de l'application.

### Tests

Ouvrir `Calliope.html#test-alignement`. Le test s'exécute sur l'**éditeur réel** :
il compare la position de chaque caractère coloré à celle du même texte rendu sans
coloration — c'est-à-dire là où le navigateur place réellement le curseur — sur les
trois polices, trois tailles et trois largeurs de colonne, et vérifie les deux
invariants ci-dessous. Treize mesures, verdict vert ou rouge. Le document en cours et
sa sauvegarde locale sont mis de côté puis restaurés.

### Comment fonctionne la coloration dans l'éditeur

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

### Tests

`tests/alignement.html` — à ouvrir dans le navigateur. La page reconstruit l'éditeur,
compare la position de **chaque caractère** coloré à celle du même texte rendu sans
coloration (c'est-à-dire là où le navigateur place réellement le curseur), sur les
trois polices, trois tailles et trois largeurs de colonne, et vérifie les deux
invariants. 13 mesures, verdict vert ou rouge.

## Signaler un défaut, proposer une amélioration

Par courriel à **contact@europasoft.eu**, ou en ouvrant une *issue* sur ce dépôt.
Préciser le navigateur et, si possible, le fragment de Markdown qui pose problème.

## Nom

**Calliope** — muse de l'éloquence et de la poésie épique, la première des neuf Muses,
sœur de Clio. Dans la lignée des noms mythologiques des projets EuropaSoft
(Clio, Morphée, Oralia, Poséidon).

## Licence

MIT — EuropaSoft, Yoann CRAMATTE. Aucun code de l'application GNOME originale
n'est réutilisé : implémentation entièrement indépendante.
