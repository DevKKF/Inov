# Generated by Django 3.2.15 on 2023-11-03 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sinistre', '0048_auto_20231103_1413'),
    ]

    operations = [
        migrations.AlterField(
            model_name='controleplafond',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='documentdossiersinistre',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='dossiersinistre',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='factureprestataire',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='prorogationsinistre',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='sinistre',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='sinistretemporaire',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
