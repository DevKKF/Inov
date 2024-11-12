# Generated by Django 3.2.15 on 2024-03-26 11:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('production', '0085_auto_20240325_1214'),
        ('sinistre', '0085_bordereauordonnancement_bureau'),
        ('configurations', '0158_alter_wsboby_name'),
        ('comptabilite', '0004_paiementcomptable'),
    ]

    operations = [
        migrations.AddField(
            model_name='paiementcomptable',
            name='compagnie',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.compagnie'),
        ),
        migrations.AlterField(
            model_name='paiementcomptable',
            name='aliment',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='production.aliment'),
        ),
        migrations.AlterField(
            model_name='paiementcomptable',
            name='bordereau_ordonnancement',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='sinistre.bordereauordonnancement'),
        ),
        migrations.AlterField(
            model_name='paiementcomptable',
            name='prestataire',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.prestataire'),
        ),
    ]
