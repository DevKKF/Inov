# Generated by Django 3.2.19 on 2023-06-30 11:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('production', '0003_auto_20230625_1307'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='code',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
