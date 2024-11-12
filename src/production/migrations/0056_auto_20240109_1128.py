# Generated by Django 3.2.15 on 2024-01-09 11:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('production', '0055_formulegarantie_reseau_soin'),
    ]

    operations = [
        migrations.AddField(
            model_name='formulegarantie',
            name='infos_carte_ambulatoire',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='formulegarantie',
            name='infos_carte_consultation',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='formulegarantie',
            name='infos_carte_hospitalisation',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='formulegarantie',
            name='infos_carte_numero_police',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='formulegarantie',
            name='infos_carte_vaccination',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='formulegarantie',
            name='infos_carte_vitamine',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
