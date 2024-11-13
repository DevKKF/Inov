# Generated by Django 3.2.15 on 2024-04-11 18:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0159_typeprestataire_status'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('comptabilite', '0009_encaissementcommission_operation'),
    ]

    operations = [
        migrations.CreateModel(
            name='CompteComptable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(blank=True, max_length=255, null=True)),
                ('libelle', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Compte comptable',
                'verbose_name_plural': 'Comptes comptables',
                'db_table': 'compte_comptable',
            },
        ),
        migrations.CreateModel(
            name='Journal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sens', models.CharField(blank=True, max_length=1, null=True)),
                ('montant', models.CharField(blank=True, max_length=1, null=True)),
                ('designation', models.CharField(blank=True, max_length=1, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('bureau', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='configurations.bureau')),
                ('compte_comptable', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='comptabilite.comptecomptable')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
                ('encaissement_commission', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='comptabilite.encaissementcommission')),
            ],
            options={
                'verbose_name': 'Journal',
                'verbose_name_plural': 'Journaux',
                'db_table': 'journal',
            },
        ),
    ]