# Generated by Django 3.2.15 on 2024-05-06 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0170_utilisateurgrhveos'),
    ]

    operations = [
        migrations.AddField(
            model_name='utilisateurgrhveos',
            name='BUREAU',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
