# Generated by Django 3.2.15 on 2024-08-22 17:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0205_merge_20240821_1634'),
    ]

    operations = [
        migrations.AddField(
            model_name='caution',
            name='bureau',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.bureau'),
        ),
        migrations.AddField(
            model_name='caution',
            name='date_debut_effet',
            field=models.DateTimeField(default=None),
        ),
        migrations.AddField(
            model_name='caution',
            name='date_fin_effet',
            field=models.DateTimeField(default=None, null=True),
        ),
    ]