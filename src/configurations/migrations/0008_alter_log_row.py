# Generated by Django 3.2.19 on 2023-06-25 00:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0007_log'),
    ]

    operations = [
        migrations.AlterField(
            model_name='log',
            name='row',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
