# Generated by Django 3.2.15 on 2023-09-27 03:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('production', '0026_auto_20230911_1623'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('configurations', '0056_auto_20230912_1754'),
        ('sinistre', '0025_auto_20230927_0330'),
    ]

    operations = [
        migrations.CreateModel(
            name='SinistreTemporaire',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('veos_id_sin', models.CharField(blank=True, max_length=50, null=True)),
                ('veos_id_npol', models.CharField(blank=True, max_length=50, null=True)),
                ('veos_code_aliment', models.CharField(blank=True, max_length=50, null=True)),
                ('veos_code_cie', models.CharField(blank=True, max_length=50, null=True)),
                ('veos_code_acte', models.CharField(blank=True, max_length=50, null=True)),
                ('veos_code_affection', models.CharField(blank=True, max_length=50, null=True)),
                ('veos_code_prestataire', models.CharField(blank=True, max_length=50, null=True)),
                ('veos_code_prescripteur', models.CharField(blank=True, max_length=50, null=True)),
                ('numero', models.CharField(blank=True, max_length=50, null=True)),
                ('type_sinistre', models.CharField(max_length=100, null=True)),
                ('prix_unitaire', models.IntegerField(default=0, null=True)),
                ('frais_reel', models.DecimalField(decimal_places=16, max_digits=50, null=True)),
                ('ticket_moderateur', models.DecimalField(decimal_places=16, max_digits=50, null=True)),
                ('depassement', models.DecimalField(decimal_places=16, max_digits=50, null=True)),
                ('nombre_demande', models.IntegerField(null=True)),
                ('nombre_accorde', models.IntegerField(null=True)),
                ('plafond_chambre', models.DecimalField(decimal_places=16, max_digits=50, null=True)),
                ('plafond_hospit', models.DecimalField(decimal_places=16, max_digits=50, null=True)),
                ('montant_plafond', models.DecimalField(decimal_places=16, max_digits=50, null=True)),
                ('nombre_plafond', models.IntegerField(null=True)),
                ('nature', models.IntegerField(null=True)),
                ('frequence', models.IntegerField(null=True)),
                ('unite_frequence', models.IntegerField(null=True)),
                ('franchise_min', models.FloatField(null=True)),
                ('franchise_max', models.FloatField(null=True)),
                ('delai_controle', models.IntegerField(null=True)),
                ('part_assure', models.DecimalField(decimal_places=16, max_digits=50, null=True)),
                ('part_compagnie', models.DecimalField(decimal_places=16, max_digits=50, null=True)),
                ('date_survenance', models.DateTimeField(null=True)),
                ('date_entree', models.DateTimeField(null=True)),
                ('date_sortie', models.DateTimeField(null=True)),
                ('motif_rejet', models.CharField(blank=True, max_length=255, null=True)),
                ('statut', models.CharField(choices=[('ACCORDE', 'Accorde'), ('EN ATTENTE', 'Attente'), ('REJETE', 'Rejete')], default='ACCORDE', max_length=15, null=True)),
                ('statut_prestation', models.CharField(choices=[('EFFECTUE', 'Effectue'), ('NON EFFECTUE', 'Attente')], default='NON EFFECTUE', max_length=15, null=True)),
                ('statut_bordereau', models.CharField(choices=[('AJOUTE BORDEREAU', 'Ajoute Bordereau'), ('PAYE', 'Paye'), ('ATTENTE DE PAIEMENT', 'Attente')], default='ATTENTE DE PAIEMENT', max_length=20, null=True)),
                ('statut_synchro_veos', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('reviewed_at', models.DateTimeField(null=True)),
                ('acte', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.acte')),
                ('adherent_principal', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='st_famille', to='production.aliment')),
                ('affection', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.affection')),
                ('aliment', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='production.aliment')),
                ('approuved_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='st_approbateur', to=settings.AUTH_USER_MODEL)),
                ('bareme', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, to='production.bareme')),
                ('compagnie', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.compagnie')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
                ('dossier_sinistre', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='st_sinistres', to='sinistre.dossiersinistre')),
                ('formulegarantie', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='production.formulegarantie')),
                ('medicament', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.medicament')),
                ('periode_couverture', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='production.periodecouverture')),
                ('police', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='production.police')),
                ('prescripteur', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.prescripteur')),
                ('prestataire', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.prestataire')),
                ('served_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='st_serveur', to=settings.AUTH_USER_MODEL)),
                ('updated_price_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='st_updated_price_by', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Sinistre temporaire',
                'verbose_name_plural': 'Sinistres temporaires',
                'db_table': 'sinistres_temporaires',
            },
        ),
    ]
