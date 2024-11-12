# Generated by Django 3.2.15 on 2024-04-11 08:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('production', '0086_reglement_date_encaissement_commission'),
        ('comptabilite', '0008_auto_20240409_0942'),
    ]

    operations = [
        migrations.AddField(
            model_name='encaissementcommission',
            name='operation',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='production.operation'),
        ),
    ]
