# Generated by Django 3.2.15 on 2023-10-20 18:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('production', '0030_alter_formulegarantie_code'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='alimentformule',
            options={'verbose_name': "Bénéficiaire d'une formule", 'verbose_name_plural': "Bénéficiaires d'un formule"},
        ),
    ]