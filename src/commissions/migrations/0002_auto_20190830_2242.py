# Generated by Django 2.2.4 on 2019-08-30 22:42

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('commissions', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Commissions',
            new_name='Commission',
        ),
    ]