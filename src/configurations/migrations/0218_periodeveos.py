# Generated by Django 3.2.15 on 2024-09-16 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0217_sinistreveos_session_uuid'),
    ]

    operations = [
        migrations.CreateModel(
            name='PeriodeVeos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ID_NPOL', models.CharField(max_length=255, null=True)),
                ('NUM_POL', models.CharField(max_length=255, null=True)),
                ('DATEEFFET', models.CharField(max_length=255, null=True)),
                ('ECHEANCE', models.CharField(max_length=255, null=True)),
                ('DEBUTEFFETOLD', models.CharField(max_length=255, null=True)),
                ('FINEFFETOLD', models.TextField(null=True)),
                ('OBSERVATION', models.TextField(null=True)),
                ('DUREE', models.CharField(max_length=255, null=True)),
                ('STATUT_IMPORT', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'Période VEOS',
                'verbose_name_plural': 'Période VEOS',
                'db_table': 'periode_veos',
            },
        ),
    ]
