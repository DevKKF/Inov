# Generated by Django 3.2.15 on 2024-06-24 15:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('production', '0102_merge_0099_auto_20240607_1455_0101_operation_uuid'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='police',
            options={'permissions': [('can_do_create_police', 'Peut créer une police'), ('can_do_update_police', 'Peut modifier une police'), ('can_view_polices', 'Peut afficher les polices'), ('can_do_avenants_polices', 'Peut faire des avenants sur une police')], 'verbose_name': 'Police', 'verbose_name_plural': 'Polices'},
        ),
    ]
