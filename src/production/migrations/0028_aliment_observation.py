# Generated by Django 3.2.15 on 2023-10-09 15:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('production', '0027_police_type_prefinancement'),
    ]

    operations = [
        migrations.AddField(
            model_name='aliment',
            name='observation',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
