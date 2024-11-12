# Generated by Django 3.2.19 on 2023-07-21 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0023_tarif_tarifexcel'),
    ]

    operations = [
        migrations.AddField(
            model_name='tarif',
            name='coef',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='tarif',
            name='lettre_cle',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='tarif',
            name='prix_unitaire',
            field=models.DecimalField(decimal_places=16, max_digits=50, null=True),
        ),
    ]
