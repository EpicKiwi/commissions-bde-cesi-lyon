# Commissions BDE CESI Lyon

Plateforme de gestion des commissions du BDE CESI de Lyon. Une version Live est disponible à l'adresse [bdecesilyon.fr](https://bdecesilyon.fr)

## Installation de développement

Installez les prérequis avec pip

```sh-session
pip install -r requirements.txt
```

Créez le fichier `.env` dans le dossier du projet python.
Ce fichier contiens les paramètres secret de l'application.

```.env
SECRETKEY=azertyuiop
VIACESI_TENANT_ID=12345-67890
VIACESI_APP_ID=12345-67890
VIACESI_APP_SECRET=qsdfghjklm
ENVIRONMENT=development
DB_ENVIRONMENT=development
```

Deployez les migrations

```sh-session
python manage.py migrate
```

Démarrez le serveur de développement

```sh-session
npm run dev
```

Rendez vous sur [localhost:8000](http://localhost:8000)

### Elasticsearch

La recherche s'éfféctue via un serveur Elasticsearch permettant d'indexer les différentes pages.
Par défaut, la fonctionnalité est désactivée en développement pour éviter de surcharger la station de travail ,de developpement.
Mais si vous désirez travailler sur le système de recharche, il est nécéssaire.

Demarrez un serveur Elasticsearch sur votre machine avec Docker
```
docker run --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" elasticsearch:7.6.0
```

Créez les indexes et enregistrez les données dans Elastic
```
cd src
ELASTIC_HOST=localhost:9200 python manage.py search_index --rebuild -f
```

Demarrez le serveur de développement avec la configuration Elastic
```
ELASTIC_HOST=localhost:9200 npm run dev
```

## Installation de production

Assurez vous d'avoir installé Docker, Docker-compose, Python et Pip.
Installez alors les prérequis.

```sh-session
pip install -r requirements.txt
```

Executez le script de déploiement

```sh-session
./deploy.sh
```

## StoryBook

Le site utilise les WebComponents et vous pouvez les tester individuellements et avec documentation en démarrant le StoryBook.

```sh-session
$ npm install
$ npm run storybook
```

## Documentation

La documentation technique est disponible dans la dossier [doc](./doc).

La documentation dite "Guide de la vie Asso" est rédigée sur le repository [EpicKiwi/bdecesilyon-documentation](https://github.com/EpicKiwi/bdecesilyon-documentation).
