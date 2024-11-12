# Generated by Django 3.2.15 on 2024-01-01 23:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0127_apporteur_bureau'),
        ('sinistre', '0070_auto_20231227_1610'),
    ]

    operations = [
        migrations.AddField(
            model_name='dossiersinistre',
            name='pharmacie',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='pharmacie', to='configurations.prestataire'),
        ),
    ]
