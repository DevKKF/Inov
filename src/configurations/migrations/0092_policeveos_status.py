# Generated by Django 3.2.15 on 2023-12-11 06:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0091_policeveos_motif'),
    ]

    operations = [
        migrations.AddField(
            model_name='policeveos',
            name='STATUS',
            field=models.CharField(max_length=100, null=True),
        ),
    ]