# Generated by Django 3.2.15 on 2023-10-20 18:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0064_auto_20231019_0825'),
    ]

    operations = [
        migrations.DeleteModel(
            name='AlimentSante',
        ),
        migrations.AlterField(
            model_name='alimentveos',
            name='DATE_ENTREE',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='alimentveos',
            name='DATE_SORTIE',
            field=models.DateField(null=True),
        ),
    ]