# Generated by Django 3.2.15 on 2024-04-09 10:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sinistre', '0090_auto_20240409_1013'),
    ]

    operations = [
        migrations.AddField(
            model_name='sinistretemporaire',
            name='date_reception_facture',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='sinistretemporaire',
            name='reference_facture',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
