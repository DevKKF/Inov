# Generated by Django 3.2.15 on 2024-06-28 15:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0189_auto_20240628_1502'),
        ('production', '0104_auto_20240624_1849'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='groupe_international',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.groupeinter'),
        ),
    ]
