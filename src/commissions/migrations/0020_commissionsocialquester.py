# Generated by Django 2.2.6 on 2019-12-02 08:40

import commissions.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('commissions', '0019_postimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='CommissionSocialQuester',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('query', models.CharField(max_length=50, validators=[commissions.models.quester_query_validator])),
                ('since_date', models.DateTimeField()),
                ('commission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='social_questers', to='commissions.Commission')),
            ],
        ),
    ]
