# Generated by Django 5.0.7 on 2024-07-12 09:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("production", "0109_merge_20240712_1010"),
    ]

    operations = [
        migrations.AddField(
            model_name="document",
            name="quittance",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.RESTRICT,
                to="production.quittance",
            ),
        ),
    ]
