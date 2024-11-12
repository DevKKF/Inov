# Generated by Django 3.2.19 on 2023-07-14 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('production', '0011_auto_20230713_1035'),
    ]

    operations = [
        migrations.AddField(
            model_name='aliment',
            name='veos_adherent_principal',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='aliment',
            name='veos_code_aliment',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='aliment',
            name='veos_code_college',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='aliment',
            name='veos_code_formule',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='aliment',
            name='veos_code_qualite_beneficiaire',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='aliment',
            name='veos_numero_carte',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
