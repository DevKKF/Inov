# Generated by Django 3.2.15 on 2023-12-18 09:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0113_alter_paramacte_unique_together'),
        ('production', '0043_photoidentite'),
    ]

    operations = [
        migrations.AddField(
            model_name='aliment',
            name='bureau',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.bureau'),
        ),
    ]
