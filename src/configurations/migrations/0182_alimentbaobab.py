# Generated by Django 3.2.15 on 2024-06-11 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0181_bureau_fuseau_horaire'),
    ]

    operations = [
        migrations.CreateModel(
            name='AlimentBaobab',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num_benef', models.CharField(blank=True, max_length=100, null=True)),
                ('prenom', models.CharField(blank=True, max_length=100, null=True)),
                ('nom', models.CharField(blank=True, max_length=100, null=True)),
                ('naissance', models.CharField(blank=True, max_length=100, null=True)),
                ('sexe', models.CharField(blank=True, max_length=100, null=True)),
                ('carte', models.CharField(blank=True, max_length=100, null=True)),
                ('lien', models.CharField(blank=True, max_length=100, null=True)),
                ('famille', models.CharField(blank=True, max_length=100, null=True)),
                ('etat', models.CharField(blank=True, max_length=100, null=True)),
                ('entree', models.CharField(blank=True, max_length=100, null=True)),
                ('sortie', models.CharField(blank=True, max_length=100, null=True)),
                ('formule', models.CharField(blank=True, max_length=100, null=True)),
                ('formule_id', models.CharField(blank=True, max_length=100, null=True)),
                ('statut_traitement', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'verbose_name': 'Aliment Baobab',
                'verbose_name_plural': 'Aliments Baobab',
                'db_table': 'aliment_baobab',
            },
        ),
    ]
