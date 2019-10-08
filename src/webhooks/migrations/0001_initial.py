# Generated by Django 2.2.6 on 2019-10-08 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Webhook',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(help_text="Un nom décrivant l'utilisation du WebHook", max_length=255)),
                ('is_active', models.BooleanField(default=True, help_text='Si le WebHook est actif et peut être utilisé')),
                ('event', models.CharField(choices=[('commission-create', 'Creation de commission')], help_text="L'événement déclanchant l'appel au WebHook", max_length=100)),
                ('type', models.CharField(choices=[('discord', 'Discord')], help_text='Le format qui doit être utilisé pour éfféctuer la requète', max_length=100)),
                ('url', models.CharField(help_text="L'URL à appeler pour éxécuter le WebHook", max_length=512)),
            ],
        ),
    ]
