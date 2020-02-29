# Generated by Django 3.0.1 on 2020-01-12 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0005_auto_20190930_1832'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='created_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='document',
            name='current_version',
            field=models.BooleanField(default=True, help_text='Le document est il la dernière version qui sera affichée sur le site'),
        ),
        migrations.AlterField(
            model_name='document',
            name='role',
            field=models.CharField(choices=[('status', 'Status'), ('reglement-interieur', 'Règlement interieur'), ('status-bds', 'Status du BDS'), ('reglement-interieur-bds', 'Règlement interieur du BDS'), ('gazette', 'Gazette')], help_text='De quel type de document sagit il', max_length=100),
        ),
    ]