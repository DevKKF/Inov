# Generated by Django 3.2.15 on 2023-12-06 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0082_auto_20231205_0957'),
    ]

    operations = [
        migrations.CreateModel(
            name='PrestataireVeos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ID_PER', models.CharField(max_length=100, null=True)),
                ('CODE', models.CharField(max_length=100, null=True)),
                ('NAME', models.CharField(max_length=100, null=True)),
                ('TELEPHONE', models.CharField(max_length=100, null=True)),
                ('TELEPHONE2', models.CharField(max_length=1, null=True)),
                ('TELEPHONE3', models.CharField(max_length=100, null=True)),
                ('FAX', models.CharField(max_length=100, null=True)),
                ('EMAIL', models.CharField(max_length=100, null=True)),
                ('ADRESSE', models.CharField(max_length=100, null=True)),
                ('VILLE', models.CharField(max_length=100, null=True)),
                ('SOCIETE', models.CharField(max_length=100, null=True)),
                ('TYPE_PRESTATAIRE', models.CharField(max_length=100, null=True)),
                ('SECTEUR', models.CharField(max_length=100, null=True)),
                ('STATUT_IMPORT', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'prestataire_veos',
            },
        ),
    ]