# Generated by Django 4.0.3 on 2023-11-17 17:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('configurations', '0074_typeremboursement_status'),
        ('sinistre', '0057_auto_20231116_1607'),
    ]

    operations = [
        migrations.CreateModel(
            name='BordereauOrdonnancement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('fichier', models.FileField(blank=True, default=None, null=True, upload_to='dossiers_sinistres/bordereaux')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('montant_remb_total', models.FloatField(null=True)),
                ('montant_rejet_total', models.FloatField(null=True)),
                ('montant_accepte_total', models.FloatField(null=True)),
                ('ordre_de', models.CharField(blank=True, max_length=255, null=True)),
                ('par_compagnie', models.BooleanField(default=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
                ('periode_comptable', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.periodecomptable')),
                ('prestataire', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.prestataire')),
            ],
            options={
                'verbose_name': 'Bordereau de ordonnancement',
                'verbose_name_plural': 'Bordereaux de ordonnancements',
                'db_table': 'bordereau_ordonnancement',
                'permissions': [],
            },
        ),
        migrations.AddField(
            model_name='remboursementsinistre',
            name='is_invalid',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='remboursementsinistre',
            name='is_invalid_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='remboursements_rejetes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='sinistre',
            name='motif_rejet_ordonnancement',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='factureprestataire',
            name='statut',
            field=models.CharField(choices=[('ATTENTE', 'Attente'), ('VALIDE', 'Valide'), ('REJETE', 'Rejete'), ('ORDONNANCE', 'Ordonnance'), ('PAYE', 'Paye'), ('ANNULE', 'Annule')], default='ATTENTE', max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='remboursementsinistre',
            name='created_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='remboursements_crees', to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='BordereauValidation',
        ),
        migrations.AddField(
            model_name='sinistre',
            name='bordereau_ordonnancement',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='sinistre.bordereauordonnancement'),
        ),
    ]
