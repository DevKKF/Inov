import datetime

from django.contrib import admin
from django.contrib.admin.sites import AdminSite
from django.contrib.auth.models import Group
from django.shortcuts import redirect
from django.utils import timezone
from django.utils.timezone import now
from datetime import timedelta

from api.serializers import BureauSerializer
from configurations.models import Affection, Rubrique, Prescripteur, Prestataire, User, Bureau, TypeRemboursement, \
    AdminGroupeBureau
from production.models import Police
from shared.enum import StatutSinistre, Statut, StatutValidite
# Register your models here.
from sinistre.models import DossierSinistre


class CustomAdminSite(admin.AdminSite):
    def index(self, request, extra_context=None):

        if(extra_context is None): extra_context = {}

        user = User.objects.get(id=request.user.id)

        #if user.is_prestataire: return redirect('liste_bordereau')

        if request.user.is_med: return redirect('dossiersinistre')

        if request.user.is_superuser:
            bureaux = Bureau.objects.filter(status=True)
            bureaux_serializer = BureauSerializer(bureaux, many=True).data
        elif request.user.is_admin_group:
            admin_bureaux = AdminGroupeBureau.objects.filter(user=request.user, status=True)
            bureaux = [b.bureau for b in admin_bureaux]
            bureaux_serializer = BureauSerializer(bureaux, many=True).data
        else:
            bureaux_serializer = []

        # Calculs pour les polices
        today = now()
        in_90_days = today + timedelta(days=90)
        print('Date du jour :', today)
        print('Dans 90 jours :', in_90_days)
        count_polices_en_cours = Police.objects.filter(date_fin_effet__gt=today).count()
        count_polices_a_echeance = Police.objects.filter(date_fin_effet__lte=in_90_days, date_fin_effet__gt=today).count()
        count_polices_non_renouvelees_resilies = Police.objects.filter(date_fin_effet__lt=today).count()

        # Ajout au contexte
        extra_context['count_polices_en_cours'] = count_polices_en_cours
        extra_context['count_polices_a_echeance'] = count_polices_a_echeance
        extra_context['count_polices_non_renouvelees_resilies'] = count_polices_non_renouvelees_resilies

        sinistres = []
        prestataires = Prestataire.objects.filter(bureau=user.bureau, status=True)
        centres_prescripteurs = Prestataire.objects.filter(type_prestataire__code="PRES01", bureau=user.bureau, status=True)
        prescripteurs = [p for p in Prescripteur.objects.filter(statut=True) if p.prescripteurprestataire_set.filter(prestataire=request.user.prestataire, statut_validite=StatutValidite.VALIDE).exists()]
        rubriques = Rubrique.objects.all()


        request.session['bureaux'] = bureaux_serializer
        # extra_context['bureaux'] = bureaux
        extra_context['sinistres'] = sinistres
        extra_context['prestataires'] = prestataires
        extra_context['centres_prescripteurs'] = centres_prescripteurs
        extra_context['prescripteurs'] = prescripteurs
        extra_context['rubriques'] = rubriques
        extra_context['affections'] = Affection.objects.filter(status=True)

        extra_context['yesterday'] = datetime.datetime.now(tz=timezone.utc) - datetime.timedelta(days=1)
        extra_context['today'] = datetime.datetime.now(tz=timezone.utc)
#
        return super(CustomAdminSite, self).index(request, extra_context)


# django admin index template
AdminSite.index_template = 'main_index.html'

# new custom admin
custom_admin_site = CustomAdminSite(name='custom_admin')

# get back django auth group app
custom_admin_site.register(Group)