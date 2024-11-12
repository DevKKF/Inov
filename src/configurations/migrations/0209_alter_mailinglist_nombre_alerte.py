# Generated by Django 4.2.14 on 2024-08-23 16:45

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0208_rename_diffusion_mail_mailinglist_mail_de_diffusion'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mailinglist',
            name='nombre_alerte',
            field=models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0)]),
        ),
    ]
