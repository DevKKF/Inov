# Generated by Django 4.2.14 on 2024-08-23 16:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0207_mailinglist'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mailinglist',
            old_name='diffusion_mail',
            new_name='mail_de_diffusion',
        ),
    ]