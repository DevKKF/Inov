# Generated by Django 3.2.15 on 2024-02-06 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0150_apporteur_type_personne'),
    ]

    operations = [
        migrations.AddField(
            model_name='apporteurveos',
            name='CD_PAYS',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
