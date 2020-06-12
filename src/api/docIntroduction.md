API du site permettant de lire, et éditer les données de la vie asso comme les Commissions, Membres, etc.

**Filtrage** : Il est possible de filtrer les résulats de (presque) tout les endpoints `list*`.
Pour cela, l'API utilise la bibliothèque django-url-filter qui permet un filtrage via les paramètres de l'URL. Vous trouverez quelques exemple de la manière de formater les URL sur la [page de documentation](https://github.com/miki725/django-url-filter#usage-example).

**Pro Tip** : Vous pouvez expérimenter l'API dans la console de votre navigateur. Sur la page de documentation (`/api/_docs`), utilisez les fonction globales `apiGET`, `apiPOST` et `apiPATCH`. Les fontionnalités d'authentification sont incluses.
*Exemple* : Tapez `apiGET("/api/commissions").then(result => console.log(result))` pour afficher le JSON parsé de toutes les commissions.

**Authorisations** : La documentation que vous avez sous les yeux est dépendante de vos permissions sur le site.
Un utilisateur avec plus de droits aura (paut être) plus d'endpoints disponibles.

L'authentification des requètes sur le site est éfféctuée via les Cookies et ne nécéssite pas d'action supplémentaire.
En revanche, pour une utilisation externe au site, il est nécéssaire de se procurer un token permettant de vous authentifier.
Veuillez contacter le BDE pour obtenir une clé personnel.

**Validation des requètes mutatives** : Afin de réduire les risques d'attaque CSRF, les requètes POST, PATCH et PUT nécéssitent l'utilisation d'un token CSRF disponibles dans le cookie `csrftoken` dans un champ header `X-CSRFToken`.