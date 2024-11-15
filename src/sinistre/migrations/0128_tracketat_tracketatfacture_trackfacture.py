# Generated by Django 3.2.15 on 2024-09-14 11:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('sinistre', '0127_auto_20240913_0940'),
    ]

    operations = [
        migrations.CreateModel(
            name='TrackEtat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(blank=True, max_length=50, null=True)),
                ('libelle', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Etat',
                'verbose_name_plural': 'Etat',
                'db_table': 'track_etat',
            },
        ),
        migrations.CreateModel(
            name='TrackFacture',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code_systeme', models.CharField(blank=True, max_length=255, null=True)),
                ('reference_facture_prestataire', models.CharField(blank=True, max_length=255, null=True)),
                ('montant_facture', models.DecimalField(decimal_places=6, max_digits=20, null=True)),
                ('nombre_feuilles_soins', models.DecimalField(decimal_places=6, max_digits=20, null=True)),
                ('date_reception', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'track_facture',
                'verbose_name_plural': 'track_facture',
                'db_table': 'track_facture',
            },
        ),
        migrations.CreateModel(
            name='TrackEtatFacture',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observation', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('etat', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='sinistre.sinistre')),
                ('operateur', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
                ('track_facture', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='sinistre.trackfacture')),
            ],
            options={
                'verbose_name': 'Etat Facture',
                'verbose_name_plural': 'Etat Facture',
                'db_table': 'track_etat_facture',
            },
        ),
    ]
