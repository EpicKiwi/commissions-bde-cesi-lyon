import os
from django.apps import AppConfig
from django.db import connections, DEFAULT_DB_ALIAS, OperationalError
from django.db.migrations.executor import MigrationExecutor


def is_database_synchronized(database):
    connection = connections[database]
    connection.prepare_database()
    executor = MigrationExecutor(connection)
    targets = executor.loader.graph.leaf_nodes()
    return not executor.migration_plan(targets)


def check_token(key, username, permissions=None):

    if permissions is None:
        permissions = []

    from rest_framework.authtoken.models import Token
    from users.models import User

    try:
        usr = User.objects.get(
            email=username
        )
    except User.DoesNotExist:
        usr = User.objects.create(
            email=username,
            username=username
        )

    usr.user_permissions.set(permissions)
    usr.save()

    try:
        token = usr.auth_token
    except Token.DoesNotExist:
        token = Token.objects.create(
            key=key,
            user=usr
        )

    if token.key != key:
        token.delete()
        Token.objects.create(
            key=key,
            user=usr
        )


class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):

        if not is_database_synchronized(DEFAULT_DB_ALIAS):
            return print("Database is not updated at the latest migrations, skipping token check")

        from django.contrib.auth.models import Permission

        if os.getenv("POSTS_API_TOKEN"):
            try:
                check_token(
                    key=os.getenv("POSTS_API_TOKEN"),
                    username="special.posts.api@localhost",
                    permissions=[
                        Permission.objects.get(codename="view_commission"),
                        Permission.objects.get(codename="view_user"),
                        Permission.objects.get(codename="view_full_profile"),
                        Permission.objects.get(codename="add_post"),
                        Permission.objects.get(codename="change_post"),
                        Permission.objects.get(codename="delete_post"),
                        Permission.objects.get(codename="view_post"),
                        Permission.objects.get(codename="add_postimage"),
                        Permission.objects.get(codename="change_postimage"),
                        Permission.objects.get(codename="delete_postimage"),
                        Permission.objects.get(codename="view_postimage")
                    ]
                )
            except OperationalError:
                print("Couldn't add tokens, maybe some migrations are missing")

        super(ApiConfig, self).ready()
