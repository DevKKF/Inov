# Generated by Django 3.2.15 on 2024-04-24 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sinistre', '0099_rename_montant_historiqueordonnancementsinistre_montant_ordonnance'),
    ]

    operations = [
        migrations.AddField(
            model_name='dossiersinistre',
            name='commentaire',
            field=models.TextField(null=True),
        ),
    ]