# Generated by Django 3.2.15 on 2023-11-01 18:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0072_auto_20231030_1532'),
        ('sinistre', '0043_merge_20231030_1621'),
    ]

    operations = [
        migrations.AddField(
            model_name='dossiersinistre',
            name='bureau',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.bureau'),
        ),
    ]