# Generated by Django 3.2.15 on 2024-09-19 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0219_typequittance_code_veos'),
    ]

    operations = [
        migrations.AddField(
            model_name='naturequittance',
            name='code_veos',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]