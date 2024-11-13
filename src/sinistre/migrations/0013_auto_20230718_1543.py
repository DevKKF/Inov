# Generated by Django 3.2.19 on 2023-07-18 15:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sinistre', '0012_auto_20230703_1548'),
    ]

    operations = [
        migrations.AddField(
            model_name='sinistre',
            name='veos_code_acte',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='sinistre',
            name='veos_code_affection',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='sinistre',
            name='veos_code_aliment',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='sinistre',
            name='veos_code_cie',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='sinistre',
            name='veos_code_prescripteur',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='sinistre',
            name='veos_code_prestataire',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='sinistre',
            name='veos_id_npol',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='sinistre',
            name='veos_id_sin',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]