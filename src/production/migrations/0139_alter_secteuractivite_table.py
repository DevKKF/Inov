# Generated by Django 3.2.15 on 2024-11-12 19:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('production', '0138_rename_created_by_secteuractivite_created_at'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='secteuractivite',
            table='secteur_activite',
        ),
    ]