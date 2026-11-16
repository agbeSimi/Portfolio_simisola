---
name: redaction-sans-tics-ia
description: Écrit ou corrige les textes du portfolio en français (présentation, descriptions de projets et d'expériences, titres, libellés de boutons et de liens, balises title et meta, pied de page) sans les tournures qui signalent un texte généré par IA, comme « passionné par », « n'hésitez pas à », les adjectifs vides, les triplets, les tirets cadratins, les majuscules à chaque mot, les points d'exclamation et les émojis. À utiliser dès qu'un mot visible du site change, pour ajouter un projet ou une expérience, pour relire ou raccourcir un texte, et pour les textes voisins du portfolio, README, description du dépôt GitHub, message à un recruteur, lettre de motivation.
---

# Rédaction sans tics d'IA

## Pourquoi ce skill existe

Le lecteur du portfolio est un recruteur ou un tuteur de stage. Il lit en diagonale et cherche des faits : quelle formation, quelles technologies, quels projets, disponible quand, joignable comment. Une phrase comme « Passionné par le développement web, je crée des solutions modernes et intuitives » ne lui apprend rien, et il l'a lue cent fois. Pire, elle a le ton d'un texte que personne n'a écrit, et ce doute se reporte sur tout le reste.

Un texte sans tics n'est pas un texte plat. C'est un texte où chaque phrase porte une information que le lecteur peut vérifier.

## Deux règles avant toutes les autres

**Rien d'inventé.** Les faits viennent du CV (`CV_Simisola_AGBE.pdf`), de ce qui est déjà sur le site, ou de ce que l'utilisateur dit. S'il manque une information pour écrire une phrase (le rôle exact dans un projet en équipe, une durée, un résultat), la demander. Ne jamais la supposer, ne jamais arrondir vers le flatteur. Un chiffre, une date ou une technologie faux se remarquent en entretien.

**Ce que l'utilisateur a retiré reste retiré.** L'historique Git montre qu'il a supprimé « de 4 mois en développement » de la phrase sur le stage. Ne pas remettre une précision qu'il a enlevée, même si elle figure dans le CV. En cas de doute, demander.

## Les tics, et quoi écrire à la place

### Formules

| Tic | Pourquoi | À la place |
|---|---|---|
| « Bonjour, je suis… », « Bienvenue sur mon portfolio » | Le lecteur sait où il est. La première ligne est perdue. | Le nom, puis ce que la personne fait et ce qu'elle cherche. |
| « Passionné par… », « toujours en quête de… », « soif d'apprendre » | Invérifiable, et dit par tout le monde. | Ce qui a été fait : « Stage de 8 semaines : un tuteur de calcul littéral en React et PHP. » |
| « N'hésitez pas à me contacter », « Contactez-moi ! », « Travaillons ensemble » | Une invitation à la place du moyen. | L'adresse et le numéro, directement. |
| « Découvrez mes projets », « Plongez dans… », « Explorez… » | Le ton d'une brochure. | Le nom de la rubrique : « Projets ». |
| « En savoir plus », « Voir plus », « Cliquez ici » | Le lien ne dit pas où il mène (et un lecteur d'écran n'entend que ça). | « Voir le code de LitterAI sur GitHub ». |
| « Tous droits réservés », « Fait avec passion » | Recopié sans y penser. | « © 2026 AGBE Simisola ». |
| « dans un monde en constante évolution », « à l'ère du numérique », « au cœur de », « à la croisée de » | Du remplissage avant la vraie phrase. | Commencer à la vraie phrase. |

### Mots

Adjectifs à supprimer d'abord, puis à remettre seulement s'ils manquent : moderne, innovant, intuitif, robuste, performant, élégant, immersif, dynamique, rigoureux, polyvalent, créatif, motivé, sur mesure, de qualité. Le test : retirer le mot. Si la phrase dit la même chose, il ne servait à rien. Si elle perd quelque chose, remplacer le mot par le fait qu'il résumait (« performant » devient « répond en moins d'une seconde », si c'est mesuré).

Verbes creux : « mettre en œuvre », « mettre en place des solutions », « contribuer à », « participer à » sans dire à quoi. Préférer le verbe de l'action réelle : concevoir, coder, tester, déployer, modéliser, corriger.

Anglicismes inutiles : « features », « skills », « challenge », « process ». Les noms de technologies et les termes du métier sans équivalent courant restent tels quels (front-end, back-end, fullstack, API, chatbot).

### Constructions

| Tic | Exemple | À la place |
|---|---|---|
| Le triplet | « curieux, rigoureux et motivé », « concevoir, développer et déployer » posé par réflexe | Le nombre d'éléments que la réalité contient. Deux si c'est deux, quatre si c'est quatre. |
| Le balancement | « pas seulement un développeur, mais un créateur de solutions », « que ce soit en front ou en back » | Dire directement la seconde moitié. |
| La chute | Une dernière phrase courte qui reformule le paragraphe pour faire de l'effet. | S'arrêter quand l'information est donnée. |
| La question rhétorique | « Un projet en tête ? » | La supprimer. |
| Le tiret cadratin (—) | En incise, en chute, en séparateur de titre | Virgule, deux-points, parenthèses ou point. C'est le signe le plus reconnaissable d'un texte généré : ne pas l'employer sur le site. |
| Les deux-points d'annonce | « Mon objectif : créer… », « Le résultat : une application… » | Une phrase avec un verbe. |
| Le point médian en séparateur | « Stage · 2026 », « React · PHP · API » | Une virgule. |

### Ponctuation et signes

- Pas de point d'exclamation.
- Pas d'émoji, ni dans le texte ni en puce.
- Pas de flèche collée à un libellé (« Voir le projet → »). Un libellé précis s'en passe.

## Typographie française

Ces règles distinguent un texte écrit en français d'un texte calqué sur l'anglais.

- **Majuscules.** Seul le premier mot d'un titre prend la majuscule, avec les noms propres : « Projets récents », pas « Projets Récents ». « Mes Compétences Techniques » est une capitalisation anglaise.
- **Titres.** Un nom seul vaut mieux que « Mes… » ou « Mon… » : « Parcours », « Projets », « Contact ».
- **Espaces insécables** avant `:` `;` `?` `!` et à l'intérieur des guillemets : écrire `&nbsp;` dans le HTML (`Parcours A&nbsp;: réalisation…`). De même entre un nombre et ce qu'il compte (`3<sup>e</sup>&nbsp;année`, `janvier&nbsp;2027`).
- **Apostrophe** typographique `’` dans le texte visible (`l’IUT`, `d’applications`), pas `'`.
- **Guillemets** français « … », pas "…".
- **Ordinaux** : `3<sup>e</sup>`, pas « 3ème » ni « 3° ».
- **Périodes** : « depuis 2023 », « 2023-2026 », « mai-juin 2026 ». Pas de tiret long.
- **Nom** : « AGBE Simisola », nom de famille en capitales, comme sur le CV.
- **Mots du métier** : « e-mail », « fullstack », « front-end », « back-end » en minuscules dans une phrase.

## Écrire une description de projet

Une à deux phrases, dans cet ordre, en ne gardant que ce qui est connu :

1. Ce que fait l'application et pour qui.
2. Le cadre : stage, projet de l'IUT, seul ou en équipe, et le rôle tenu si c'était en équipe.
3. Les technologies, à part, sur leur ligne.

**Exemple**

Avant : « LitterAI — Une plateforme innovante qui révolutionne l'apprentissage des mathématiques grâce à l'intelligence artificielle ! »

Après : « Tuteur IA qui apprend le calcul littéral aux élèves grâce à un chatbot. » Contexte : « Stage, 2026 ». Technologies : « React, PHP, API Groq ».

Ce qui a changé : plus de tiret, plus d'adjectif, plus de promesse (« révolutionne »), plus d'exclamation. Il reste ce que l'outil fait, pour qui, et avec quoi.

## Libellés de boutons et de liens

Un verbe et son objet : « Télécharger mon CV », « Copier l'adresse », « Voir le code de LitterAI sur GitHub ». Le même libellé pour la même action partout sur la page. Après un clic sur « Copier », le bouton répond « Copié », sans point d'exclamation.

## Relire

1. Lire le texte à voix haute. Ce qu'on ne dirait pas à quelqu'un en face se réécrit.
2. Pour chaque phrase, se demander quelle information elle donne. Aucune : la supprimer.
3. Pour chaque fait, retrouver sa source (CV, site, utilisateur). Aucune : le retirer ou poser la question.
4. Chercher les répétitions de structure : trois phrases de suite bâties pareil, trois éléments à chaque énumération.
5. Lancer le script du skill `verifier-tics-ia`. Il repère les formules et les signes listés ici, pas les constructions : la relecture reste nécessaire.

## Textes voisins

Les mêmes règles valent pour le README, la description du dépôt et les messages à un recruteur. Deux précisions :

- **Message de commit** : en français, à l'infinitif ou sous forme de nom, sans point final, sur ce qui change (« Ajout du projet Chasse au trésor », « Correction de la date du stage »). Un message comme « correction » ne dit pas ce qui a changé : préciser quoi.
- **Message à un recruteur** : la première phrase dit qui écrit et pourquoi (le stage, la date). Pas de « Je me permets de vous contacter ». Trois ou quatre phrases, le lien du portfolio, le CV joint.
