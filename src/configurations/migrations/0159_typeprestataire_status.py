# Generated by Django 3.2.15 on 2024-04-10 20:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0158_alter_wsboby_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='typeprestataire',
            name='status',
            field=models.BooleanField(default=True),
        ),
    ]
