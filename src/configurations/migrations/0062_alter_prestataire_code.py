# Generated by Django 3.2.15 on 2023-10-13 08:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0061_sinistreveos_statut_import'),
    ]

    operations = [
        migrations.AlterField(
            model_name='prestataire',
            name='code',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]