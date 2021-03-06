# Generated by Django 2.2.6 on 2019-10-15 19:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('commissions', '0011_auto_20190930_1819'),
    ]

    operations = [
        migrations.CreateModel(
            name='Membre_Commission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('permission', models.CharField(max_length=5)),
                ('identification', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='membre', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='commission',
            name='members',
            field=models.ManyToManyField(blank=True, to='commissions.Membre_Commission'),
        ),
    ]
