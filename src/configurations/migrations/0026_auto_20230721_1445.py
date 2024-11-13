# Generated by Django 3.2.19 on 2023-07-21 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0025_auto_20230721_1346'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tarif',
            old_name='prix_unitaire',
            new_name='pu_classique',
        ),
        migrations.RenameField(
            model_name='tarifexcel',
            old_name='PRIX_UNITAIRE',
            new_name='PU_CLASSIQUE',
        ),
        migrations.AddField(
            model_name='tarif',
            name='pu_mutuelle',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='tarif',
            name='pu_public',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='tarifexcel',
            name='PU_MUTUELLE',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='tarifexcel',
            name='PU_PUBLIC',
            field=models.CharField(max_length=100, null=True),
        ),
    ]