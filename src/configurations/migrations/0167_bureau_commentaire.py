# Generated by Django 3.2.15 on 2024-05-02 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0166_bureau_ville'),
    ]

    operations = [
        migrations.AddField(
            model_name='bureau',
            name='commentaire',
            field=models.TextField(null=True),
        ),
    ]