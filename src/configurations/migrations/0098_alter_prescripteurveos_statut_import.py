# Generated by Django 3.2.15 on 2023-12-12 09:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0097_merge_20231211_1835'),
    ]

    operations = [
        migrations.AlterField(
            model_name='prescripteurveos',
            name='STATUT_IMPORT',
            field=models.BooleanField(default=False),
        ),
    ]