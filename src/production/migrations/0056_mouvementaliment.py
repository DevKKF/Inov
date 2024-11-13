# Generated by Django 3.2.15 on 2024-01-15 09:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('production', '0055_formulegarantie_reseau_soin'),
    ]

    operations = [
        migrations.CreateModel(
            name='MouvementAliment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('motif', models.CharField(blank=True, max_length=255, null=True)),
                ('date_effet', models.DateField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('aliment', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='production.aliment')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
                ('mouvement', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='production.mouvement')),
            ],
            options={
                'verbose_name': 'Mouvement aliment',
                'verbose_name_plural': 'Mouvements aliment',
                'db_table': 'mouvement_aliment',
            },
        ),
    ]