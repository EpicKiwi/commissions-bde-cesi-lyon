# Generated by Django 3.0.3 on 2020-03-02 22:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0004_auto_20200302_2153'),
    ]

    operations = [
        migrations.AddField(
            model_name='quicklink',
            name='expiration',
            field=models.DateTimeField(blank=True, help_text="Le lien rapide peut expirer apres une date définie, dans le cas d'un lien d'une opération ponctuel", null=True),
        ),
    ]