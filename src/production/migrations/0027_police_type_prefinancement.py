# Generated by Django 3.2.15 on 2023-10-05 11:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configurations', '0060_typeprefinancement'),
        ('production', '0026_auto_20230911_1623'),
    ]

    operations = [
        migrations.AddField(
            model_name='police',
            name='type_prefinancement',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='configurations.typeprefinancement'),
        ),
    ]