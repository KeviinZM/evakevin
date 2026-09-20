# Eva & Kevin — Save the Date

Samedi **5 juin 2027**, 13h30 — Le Perreux-sur-Marne puis Coulommiers.

Site statique : **un seul fichier**, aucune dépendance, aucun build.
Il suffit de le déposer sur GitHub Pages.

```
index.html            ← tout le site (HTML + CSS + JS)
creer-formulaire.gs   ← script à lancer UNE fois pour créer le Google Form
Moodboard mariage.png ← référence, pas utilisé par le site
```

---

## ⚠️ À confirmer avant la mise en ligne

Ces trois points sont des **approximations** de ma part, à vérifier :

| Quoi | Ce qui est écrit | À vérifier |
|---|---|---|
| Adresse de l'église | `Allée de Bellevue` | Les sources donnent le n° 19 **et** le n° 24 — confirmez le bon |
| Adresse du domaine | `Pontmoulin, 77120 Coulommiers` | L'adresse précise (rue / lieu-dit) n'est pas publiée |
| Horaires église + domaine | « Dans la foulée » | À remplacer par les horaires réels dès que vous les avez |

Le reste est vérifié : la mairie est bien **Place de la Libération, 94170 Le
Perreux-sur-Marne**, et le 5 juin 2027 tombe bien un **samedi**.

Note : il y a **~50 km (≈ 1 h de route)** entre l'église et Pontmoulin. Le site
l'indique aux invités sous le déroulé. Pour retirer ce message :
`showTravelNote: false` dans `CONFIG`.

---

## ✅ Ce qu'il reste à faire

### 1. Créer le Google Form

1. Va sur https://script.google.com/home/projects/create
2. Efface le code affiché, colle le contenu de **`creer-formulaire.gs`**
3. Clique **Exécuter** ▶ et autorise le script
4. Le journal affiche un bloc `form: { ... }` → **colle-le dans `CONFIG`**
   à la place du bloc `form` existant

Le script crée le formulaire **et** la Google Sheet reliée : les réponses
arrivent directement dedans.

### 2. Mettre en ligne sur GitHub Pages

**Domaine :** `evakevin.dpdns.org` (DigitalPlat) · **GitHub :** `KeviinZM`

#### a) Les DNS chez DigitalPlat

Quatre enregistrements **A**, tous nommés `@` (c'est normal, c'est de la
redondance). Ne touche pas aux deux NS existants.

| Tapez | Nom | Valeur | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 3600 |
| A | `@` | `185.199.109.153` | 3600 |
| A | `@` | `185.199.110.153` | 3600 |
| A | `@` | `185.199.111.153` | 3600 |

IPv6 (facultatif, mais recommandé) — quatre enregistrements **AAAA** sur `@` :
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
`2606:50c0:8003::153`.

> Pourquoi des A et pas un CNAME ? Parce que `evakevin.dpdns.org` est une zone
> à part entière (elle a ses propres NS), et un CNAME ne peut pas coexister
> avec les enregistrements NS/SOA à la racine d'une zone.

#### b) Le repo

```bash
cd ~/Desktop/Mariage
git init
git add index.html CNAME README.md creer-formulaire.gs
git commit -m "Save the date — Eva & Kevin"
git branch -M main
git remote add origin https://github.com/KeviinZM/evakevin.git
git push -u origin main
```

Crée d'abord le repo **`evakevin`** sur https://github.com/new — en **public**
(GitHub Pages ne fonctionne pas sur un repo privé avec un compte gratuit), et
**sans** README ni .gitignore, sinon le premier push sera rejeté.

#### c) Activer Pages

**Settings → Pages → Source : `main` / `(root)` → Save.**

Le fichier `CNAME` présent à la racine du repo fait que GitHub reconnaît
automatiquement `evakevin.dpdns.org` comme domaine personnalisé — il n'y a
rien à saisir dans le champ « Custom domain ».

#### d) HTTPS — à ne pas oublier

Une fois les DNS propagés (de quelques minutes à quelques heures), reviens dans
**Settings → Pages** et coche **« Enforce HTTPS »**. GitHub ne peut générer le
certificat qu'après avoir vu les DNS pointer vers lui. Tant que ce n'est pas
fait, le site s'affiche en `http://` avec un avertissement dans le navigateur.

Vérifier la propagation :

```bash
dig +short evakevin.dpdns.org
```

Les quatre IP `185.199.10x.153` doivent apparaître.

### 3. Faire un envoi de test

Remplis le formulaire une fois depuis le site en ligne et vérifie que la ligne
apparaît bien dans la Google Sheet. **Ne saute pas cette étape** : voir la note
technique plus bas.

---

## ✏️ Modifier le contenu

Tout se change dans le bloc **`CONFIG`** de `index.html` (vers la ligne 580),
et **nulle part ailleurs**.

| Champ | Ce que c'est |
|---|---|
| `name1` / `name2` | Les prénoms |
| `dateISO` | Date + heure exactes — **pilote le compte à rebours** |
| `dateShort` | La date en pied de page |
| `steps[]` | Le déroulé de la journée, dans l'ordre |
| `showTravelNote` | Le mot sur le trajet église → domaine |
| `heroDate` / `heroCity` | La date et le lieu en toutes lettres, en FR et en ES |

Format de `dateISO` : `AAAA-MM-JJTHH:MM:SS+02:00`
(`+02:00` = heure d'été en France, `+01:00` en hiver — juin, c'est `+02:00`).

### Ajouter ou retirer une étape

Ajoute (ou retire) un bloc dans `steps` — le site s'adapte tout seul, la
numérotation romaine et la mise en page se recalculent :

```js
{
  tag:  'party',              // 'civil' | 'religious' | 'party'  (libellés dans I18N)
  name: 'Nom du lieu',
  address: ['Rue', 'CP Ville'],
  time: { fr: '18h00', es: '18:00' }
}
```

Pour un libellé d'étape inédit (ex. « Brunch du lendemain »), ajoute la clé
dans les deux blocs `I18N` puis utilise-la comme `tag`.

---

## 🎨 Le thème

**Salmon `#F5AC99` est la couleur principale.** Comme elle est trop claire pour
du texte sur fond crème, elle se décline en trois tons :

| Variable | Hex | Usage |
|---|---|---|
| `--salmon` | `#F5AC99` | Pantone 14-1323 TPG — aplats, chiffres romains |
| `--salmon-deep` | `#C2745C` | Grands titres, calligraphie, chiffres du compte à rebours |
| `--salmon-ink` | `#A9553C` | Petits textes en capitales, liens, boutons (contraste AA validé) |
| `--blush` | `#FDEDE6` | Fond teinté des sections |

Couleurs secondaires du mood board : Peach Quartz `#F5B997`, Rose Quartz
`#F7C9C9`, Desert Sage `#A7AE9E` (le feuillage des ornements), et le doré
ancien `#A8875C` conservé uniquement en **accent métallique** — les coins des
cartes, qui reprennent les cadres baroques du mood board.

Typographie : **Cormorant Garamond** (serif fin et contrasté), **Jost**
(capitales espacées), **Parisienne** (calligraphie).

Autres détails repris du mood board : double filet façon cadre ancien autour de
la page d'accueil, branche de sauge en séparateur, grain de papier sur le fond.

Toutes les couleurs sont des variables CSS en haut du fichier (`:root`).

---

## ⚙️ Note technique — l'envoi vers Google Forms

Le site envoie les réponses en `POST` vers l'URL `/formResponse` du Google Form,
en `mode: 'no-cors'`. C'est la méthode standard pour garder un formulaire
entièrement à sa charte graphique tout en récupérant les données dans Google.

**Sa limite :** le navigateur interdit de lire la réponse de Google. Le site
affiche donc le message de remerciement dès que la requête est partie, sans
pouvoir confirmer que Google l'a bien acceptée. En pratique ça marche, mais
c'est pour ça que l'envoi de test compte vraiment.

Deux garde-fous sont déjà en place :

- **Aucun champ n'est obligatoire côté Google** (c'est le site qui valide).
  Un champ obligatoire laissé vide ferait échouer l'envoi en silence.
- Si l'`actionUrl` n'est pas renseignée, l'envoi est bloqué avec un message
  explicite plutôt que de perdre les données.

Si tu veux une confirmation d'envoi à 100 % fiable (et un email automatique à
chaque réponse), il faut passer par un Apps Script déployé en « application
web » à la place du POST direct. C'est une évolution possible.

---

## ➕ Ajouter une question au formulaire plus tard

1. Ajoute la question dans le Google Form
2. Récupère son `entry.XXXXX` : dans le Form, menu ⋮ → « Obtenir le lien
   pré-rempli », remplis le champ, « Obtenir le lien » → l'identifiant est
   dans l'URL
3. Ajoute la ligne dans `CONFIG.form.entries`
4. Ajoute le champ HTML correspondant dans le formulaire (avec le même `name`)
5. Ajoute les libellés FR et ES dans le bloc `I18N`
