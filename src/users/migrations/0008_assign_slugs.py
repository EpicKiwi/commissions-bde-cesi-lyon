import datetime
from django.db import migrations, models
from django.utils.timezone import utc

from users.models import User
from random import randrange

def create_slug(apps, schema_editor):
    db = schema_editor.connection.alias

    all_users = User.objects.using(db).all()
    for user in all_users:
        user.slug = ""
        user.save()
        print("Applied new slug for user {}".format(user.id))


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_auto_20200101_1645'),
    ]

    operations = [
        migrations.RunPython(create_slug)
    ]