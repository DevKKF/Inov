# Generated by Django 3.2.19 on 2023-06-17 13:28

from django.db import migrations


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('production', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EncaissementCommission',
            fields=[
            ],
            options={
                'verbose_name': 'Encaissement commissions',
                'verbose_name_plural': 'Encaissements commissions',
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('production.reglement',),
        ),
        migrations.CreateModel(
            name='ReglementApporteurs',
            fields=[
            ],
            options={
                'verbose_name': 'Reglement apporteurs',
                'verbose_name_plural': 'Reglements apporteurs',
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('production.reglement',),
        ),
        migrations.CreateModel(
            name='ReglementCompagnie',
            fields=[
            ],
            options={
                'verbose_name': 'Reglement compagnie',
                'verbose_name_plural': 'Reglements compagnie',
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('production.reglement',),
        ),
    ]
