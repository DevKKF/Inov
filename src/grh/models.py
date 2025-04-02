from django.db import models

from configurations.models import Profession, Pays, Civilite, QualiteBeneficiaire, Bureau, User
from production.models import Police, FormuleGarantie, Mouvement
from shared.enum import Genre, StatutFamilial, Statut, StatutEnrolement, StatutValidite


# Create your models here.

class Campagne(models.Model):
    created_by = models.ForeignKey(User, null=True, on_delete=models.RESTRICT)
    police = models.ForeignKey(Police, null=True, on_delete=models.RESTRICT)
    formulegarantie = models.ForeignKey(FormuleGarantie, null=True, on_delete=models.RESTRICT)
    libelle = models.CharField(max_length=255, blank=False, null=True)
    code = models.CharField(max_length=25, unique=True, blank=False, null=True) # UPDATED
    lien = models.CharField(max_length=255, blank=False, null=True)
    date_debut = models.DateTimeField() # UPDATE
    date_fin = models.DateTimeField() # UPDATED
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    statut = models.fields.CharField(choices=StatutValidite.choices, default=StatutValidite.VALIDE, max_length=15, null=True)

    def __str__(self):
        return self.libelle

    class Meta:
        db_table = 'campagne'
        verbose_name = 'Campagne'
        verbose_name_plural = 'campagnes'


 #  def save(self, *args, **kwargs):
 #      if not self.code:
 #          self.code = f'COM-{self.pk}'
 #          while Campagne.objects.filter(code=self.code).exists():
 #              self.code = f'COM-{self.pk + 1}'
 #      super().save(*args, **kwargs)


class CampagneAppmobile(models.Model):
    created_by = models.ForeignKey(User, null=True, on_delete=models.RESTRICT)
    police = models.ForeignKey(Police, null=True, on_delete=models.RESTRICT)
    formulegarantie = models.ForeignKey(FormuleGarantie, null=True, on_delete=models.RESTRICT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    statut = models.fields.CharField(choices=StatutValidite.choices, max_length=15, null=True)

    def __str__(self):
        return self.id

    class Meta:
        db_table = 'campagne_appmobile'
        verbose_name = 'Campagne_appmobile'
        verbose_name_plural = 'campagne_appmobile'
