# Paie Registre — mise en service

## 1. Créer la base dans Firebase

Console Firebase → votre projet → **Realtime Database** → *Créer une base de données*
(zone **europe-west1**, mode **verrouillé**).

Onglet **Règles**, remplacez tout par ceci puis **Publier** :

```json
{
  "rules": {
    "paie": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

Ces deux lignes font tout le travail : sans connexion, personne ne lit ni n'écrit les salaires.
Ne les remplacez jamais par `".read": true` — les rémunérations de vos employés
deviendraient lisibles par toute personne connaissant l'adresse de la base.

## 2. Créer les deux comptes

Console Firebase → **Authentication** → *Commencer* → activer **Adresse e-mail/Mot de passe**.

Onglet **Users** → *Ajouter un utilisateur*, deux fois :
- votre adresse email + un mot de passe
- l'adresse du Directeur Général + un mot de passe

Seuls ces deux comptes pourront ouvrir le registre. Pour retirer un accès plus tard :
supprimez l'utilisateur, la déconnexion est immédiate à la prochaine ouverture.

## 3. Relever les deux informations à saisir dans l'application

| Information | Où la trouver |
|---|---|
| **Clé Web API** | Paramètres du projet → Général → *Clé d'API Web* (commence par `AIza…`) |
| **URL de la base** | Realtime Database → en haut (`https://…-default-rtdb.firebaseio.com`) |

## 4. Publier sur GitHub Pages

Déposez à la **racine** du dépôt `SALAIRE-ET-PAIE` :

```
index.html   manifest.json   sw.js   icone-192.png   icone-512.png
```

Vérifiez les noms de fichiers : le navigateur ajoute parfois `(1)` en téléchargeant.
Puis **Settings → Pages → Deploy from a branch → main / (root)**.

## 5. Première ouverture

Sur `https://africavision140.github.io/SALAIRE-ET-PAIE/` :

1. l'application demande la clé API et l'URL de la base — une seule fois par appareil ;
2. connectez-vous avec votre email et votre mot de passe ;
3. saisissez les employés.

Sur l'appareil du DG, mêmes étapes avec son propre compte. Les données sont partagées.

## Au quotidien

- La pastille en bas de la barre latérale indique l'état : **verte** à jour,
  **orange** enregistrement en cours, **rouge** hors connexion.
- Hors connexion, l'application continue de fonctionner ; l'envoi se fait au retour du réseau.
- Si deux personnes modifient en même temps, la dernière modification enregistrée l'emporte.
  À deux utilisateurs, il suffit de ne pas saisir la même paie au même moment.
- **Paramètres → Exporter le registre** reste utile une fois par mois : une sauvegarde
  hors Firebase, dans un fichier que vous gardez.

## À chaque mise à jour du site

Changez le numéro dans `sw.js` (`paie-registre-v2` → `v3`), sinon les téléphones
continueront d'afficher l'ancienne version.

## En cas de blocage

| Message | Cause | Solution |
|---|---|---|
| Accès refusé par les règles de la base | règles non publiées | reprendre l'étape 1 |
| Email ou mot de passe incorrect | compte inexistant | vérifier dans Authentication → Users |
| Serveur injoignable | URL erronée | vérifier l'URL, sans barre oblique finale |
| Page 404 | fichier mal nommé | le fichier doit s'appeler exactement `index.html` |
