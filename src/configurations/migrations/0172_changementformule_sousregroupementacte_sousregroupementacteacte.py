# Generated by Django 3.2.15 on 2024-05-24 10:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0171_utilisateurgrhveos_bureau'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChangementFormule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('NOM', models.CharField(max_length=100, null=True)),
                ('PRENOMS', models.CharField(max_length=100, null=True)),
                ('NUMERO_CARTE', models.CharField(max_length=100, null=True)),
                ('QUALITE_BENEFICIAIRE', models.CharField(max_length=100, null=True)),
                ('LIB_FORMULE', models.CharField(max_length=100, null=True)),
                ('CD_FORMULE', models.CharField(max_length=100, null=True)),
                ('DATE_DEBUT', models.DateField(null=True)),
                ('STATUT_IMPORT', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'Changement formule',
                'verbose_name_plural': 'Changements formule',
                'db_table': 'changement_formule',
            },
        ),
        migrations.CreateModel(
            name='SousRegroupementActe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('libelle', models.CharField(max_length=255)),
                ('code', models.CharField(blank=True, default=None, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.BooleanField(default=True)),
                ('rubrique', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.rubrique')),
            ],
            options={
                'verbose_name': "Sous-regroup. d'acte",
                'verbose_name_plural': "Sous-regroup. d'actes",
                'db_table': 'sous_regroupement_acte',
            },
        ),
        migrations.CreateModel(
            name='SousRegroupementActeActe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('statut', models.BooleanField(default=True)),
                ('acte', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.acte')),
                ('sous_regroupement_acte', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='configurations.sousregroupementacte')),
            ],
            options={
                'verbose_name': "Contenu du sous-regroupement d'actes",
                'verbose_name_plural': "Contenus du sous-regroupement d'actes",
                'db_table': 'sous_regroupement_acte_acte',
            },
        ),
    ]
