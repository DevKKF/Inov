# Generated by Django 3.2.15 on 2024-08-22 17:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comptabilite', '0016_encaissementcommission_type_commission'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reglementcompagnie',
            name='banque',
        ),
        migrations.RemoveField(
            model_name='reglementcompagnie',
            name='bureau',
        ),
        migrations.RemoveField(
            model_name='reglementcompagnie',
            name='compagnie',
        ),
        migrations.RemoveField(
            model_name='reglementcompagnie',
            name='compte_tresorerie',
        ),
        migrations.RemoveField(
            model_name='reglementcompagnie',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='reglementcompagnie',
            name='devise',
        ),
        migrations.RemoveField(
            model_name='reglementcompagnie',
            name='mode_reglement',
        ),
        migrations.RemoveField(
            model_name='reglementfacturecompagnie',
            name='bureau',
        ),
        migrations.RemoveField(
            model_name='reglementfacturecompagnie',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='reglementfacturecompagnie',
            name='facture_compagnie',
        ),
        migrations.RemoveField(
            model_name='reglementfacturecompagnie',
            name='reglement_compagnie',
        ),
        migrations.DeleteModel(
            name='FactureCompagnie',
        ),
        migrations.DeleteModel(
            name='ReglementCompagnie',
        ),
        migrations.DeleteModel(
            name='ReglementFactureCompagnie',
        ),
    ]
