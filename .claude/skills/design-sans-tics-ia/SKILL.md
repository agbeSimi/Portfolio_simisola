---
name: design-sans-tics-ia
description: Conçoit ou modifie l'apparence du portfolio (mise en page, couleurs, polices, boutons, animations, logo, style.css) sans les réflexes visuels d'un site généré par IA, comme les dégradés cyan-violet, le verre dépoli, les lueurs néon, les particules, l'effet machine à écrire, les cartes qui penchent ou l'écran de chargement. À utiliser pour toute demande qui touche au visuel du site, même petite. Exemples, refonte, nouvelle rubrique, nouveau projet à afficher, « rends ça plus joli », « plus moderne », « plus pro », ajout d'une animation ou d'une carte, changement de couleur ou de police. À charger avant d'écrire la moindre ligne de CSS.
---

# Design sans tics d'IA

## Pourquoi ce skill existe

Un recruteur ou un tuteur de stage ouvre ce portfolio depuis le lien du CV et y passe moins d'une minute. Il a déjà vu, la même semaine, vingt portfolios à fond noir, titres en dégradé cyan-violet, cartes en verre dépoli et particules reliées par des traits. Ce décor est celui que produit un modèle quand on lui demande « un portfolio moderne » sans autre précision. Il dit au lecteur que personne n'a choisi, et il lui fait douter du reste, y compris du code.

L'ancienne version de ce site réunissait presque tous ces réflexes. La version actuelle les a retirés. Ce skill sert à ne pas les faire revenir, une petite retouche après l'autre.

Un tic n'est pas une faute de goût isolée. C'est un choix fait par défaut, parce qu'il vient en premier, sans lien avec le contenu ni avec la personne. La règle utile est donc moins « n'utilise jamais X » que « sache dire pourquoi X est là ».

## Avant de toucher au CSS

1. Lire `references/systeme-design.md`. Le site a un système court (trois couleurs, deux polices, des filets) et toute modification doit s'y tenir.
2. Répondre en une phrase à chacune de ces questions. Si une réponse manque, la demander à l'utilisateur plutôt que de combler avec du décor.
   - Qui lit cette partie, et que doit-il en retenir ?
   - Quel contenu réel faut-il montrer ? Rédiger le texte d'abord (skill `redaction-sans-tics-ia`), la forme ensuite.
   - Quel élément existant du système répond déjà au besoin ?
3. Écrire le changement le plus petit qui répond au besoin.
4. Vérifier avec le skill `verifier-tics-ia` (script, puis captures d'écran).

## Les tics, pourquoi ils trahissent, quoi faire à la place

### Couleur

| Tic | Ce qu'il trahit | À la place |
|---|---|---|
| Fond presque noir avec accents cyan, violet, magenta | La palette par défaut de « futuriste ». Rien ne la relie à la personne. | Les trois encres du site. Aucune quatrième. |
| Dégradé sur un titre, un bouton, une bordure | Un moyen d'avoir l'air travaillé sans décider d'une couleur. | Un aplat. |
| Couleurs en transparence empilées (`rgba(…, 0.05)` partout) | Des surfaces floues, jamais franches. | Des couleurs opaques nommées dans `:root`. |
| Violet ou indigo d'interface (#6366f1, #8b5cf6) | La couleur par défaut des bibliothèques de composants. | Idem : les variables du site. |

### Effets

| Tic | Ce qu'il trahit | À la place |
|---|---|---|
| Lueur néon (`box-shadow: 0 0 20px`, `text-shadow`) | L'effet remplace la hiérarchie. | La taille, la graisse, un fond plein, un filet. |
| Verre dépoli (`backdrop-filter`) | Suppose une image derrière. Ici il n'y en a pas. | Un fond opaque. |
| Canvas de particules, grille en fond, halo qui suit la souris | Du mouvement permanent qui concurrence le texte et fait tourner le processeur. | Rien. Le fond est une couleur. |
| Image de fond décorative | L'ancienne pesait 8,7 Mo pour être affichée à 8 % d'opacité. | Rien. |
| Carte qui penche en 3D, bouton aimanté, reflet qui suit la souris | Le site réagit pour montrer qu'il sait réagir. | Un survol net : le fond ou la couleur change. |
| Ombres douces sous chaque bloc, coins très arrondis, pilules | L'allure d'un gabarit de tableau de bord. | Angles droits, filets, pas d'ombre. |

### Mouvement

| Tic | Ce qu'il trahit | À la place |
|---|---|---|
| Écran de chargement (« Initialisation du système… ») | Une page statique de quelques kilo-octets n'a rien à charger. L'attente est fabriquée. | La page s'affiche tout de suite. |
| Effet machine à écrire qui fait défiler des rôles | Le lecteur doit attendre pour lire une information qui tient en une ligne. | La phrase, écrite. |
| Texte qui glitche, dégradé qui défile, logo qui pulse | Une animation en boucle sans cause. | Rien ne bouge sans action du lecteur. |
| Apparition au défilement (fondu, glissement, flou) | Le contenu est caché jusqu'à ce qu'on le mérite. Sans JavaScript, il reste invisible. | Tout est là dès le chargement. |
| Barre de progression de lecture, bouton flottant « retour en haut » | Des accessoires pour une page de trois écrans. | Un lien « Haut de la page » en bas. |

Les seules transitions du site durent 0,15 s et accompagnent un survol ou un focus.

### Typographie

| Tic | Ce qu'il trahit | À la place |
|---|---|---|
| Orbitron, Space Grotesk, Inter, Poppins, Montserrat, Syne | Les premières polices proposées par défaut. | League Gothic pour les titres, Libre Franklin pour le texte. |
| Police à chasse fixe pour des dates, des libellés, des étiquettes | Un costume de développeur. | Libre Franklin. La chasse fixe sert à montrer du code. |
| Sur-titre en petites capitales espacées au-dessus de chaque titre | Un échafaudage qui répète le titre. | Le titre seul. |
| Numérotation décorative (`01 //`, `02 //`) | Suggère un ordre qui n'existe pas. | Pas de numéro, sauf pour une vraie suite d'étapes. |
| Trois polices ou plus | Aucune n'a de rôle clair. | Deux. |

### Mise en page

| Tic | Ce qu'il trahit | À la place |
|---|---|---|
| Tout centré | Aucun axe, aucun point d'entrée pour l'œil. | Aligné à gauche sur les axes de la grille. |
| Bloc d'accueil forcé à 100 % de la hauteur d'écran | Cache la suite. Le lecteur ne sait pas qu'il y a autre chose. | La hauteur du contenu. Le filet de la rubrique suivante se voit. |
| Grille de trois cartes identiques pour tout | La forme choisie avant le contenu. | Des lignes : une information par colonne, lisible en diagonale. |
| Trois boutons de même poids côte à côte | Pas de décision sur l'action principale. | Un bouton (le CV) et un lien. |
| Icône dans un carré arrondi au-dessus de chaque titre de carte | Remplit le vide sans rien dire. | Pas d'icône. Si elle manque vraiment, c'est que le libellé est flou. |
| Grille de logos de technologies | Des images de tailles et de fonds disparates, et moins lisibles que leur nom. | Les noms, composés en League Gothic. |
| Menu hamburger pour quatre liens | Cache une navigation qui tenait à l'écran. | Les quatre liens visibles, même sur téléphone. |

### Habillage « développeur »

Invite de commande (`$`), balises `</>` en guise d'icône, suffixe `.dev` dans le logo, accolades, « hello_world », logo dans un hexagone : ce sont des accessoires de déguisement. Le métier se lit dans la liste des projets et dans le code lié.

## Trois tests rapides

- **Le test du nom.** Si on remplace « AGBE Simisola » par un autre nom, le design irait-il à n'importe qui ? Alors il n'appartient à personne.
- **Le test de la suppression.** Retirer l'élément ajouté. Si la page ne perd aucune information et ne devient pas plus difficile à lire, il ne servait à rien.
- **Le test du pourquoi.** Pour chaque couleur, effet ou animation, pouvoir finir la phrase « c'est là parce que… » autrement que par « ça fait moderne ».

## Quand l'utilisateur demande un tic

Le site est le sien. S'il demande « ajoute des particules » ou « remets un dégradé », dire en une ou deux phrases ce que ça coûte (ce que le lecteur y perd, ce que ça signale), proposer une autre façon d'obtenir ce qu'il cherche au fond (souvent : plus de caractère, plus de présence), puis faire ce qu'il décide. Un tic voulu et assumé se marque d'un commentaire `tics-ok : raison` sur la ligne, pour que le script de vérification le laisse passer.

## Ajouter au système sans le casser

Un vrai besoin nouveau (des captures d'écran de projet, une rubrique « Expériences », une version anglaise) se traite en prolongeant le système : mêmes couleurs, mêmes polices, mêmes filets, même grille en lignes. Si le système ne suffit pas, modifier d'abord `references/systeme-design.md` et expliquer le changement à l'utilisateur, puis le CSS. Le document doit toujours décrire le site tel qu'il est.
