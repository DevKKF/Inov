# Generated by Django 3.2.15 on 2023-12-21 23:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0114_merge_20231219_1921'),
    ]

    operations = [
        migrations.AddField(
            model_name='tarif',
            name='coef_prestataire',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='tarif',
            name='cout_prestataire',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='tarif',
            name='lettre_cle_prestataire',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='tarif',
            name='pu_prestataire',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='tarif',
            name='coef_classique',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='tarif',
            name='coef_mutuelle',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='tarif',
            name='coef_public_chu',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='tarif',
            name='coef_public_hg',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='tarif',
            name='coef_public_ica',
            field=models.IntegerField(null=True),
        ),
    ]
