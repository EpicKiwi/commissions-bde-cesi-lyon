# Generated by Django 3.0.1 on 2020-01-03 10:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_user_support_member'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='support_member',
            field=models.CharField(blank=True, choices=[('bde', 'BDE'), ('bds', 'BDS')], default=None, max_length=50, null=True),
        ),
    ]