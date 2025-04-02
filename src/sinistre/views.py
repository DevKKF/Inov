import datetime
import json
import os
from ast import literal_eval
from collections import defaultdict
from copy import deepcopy
from datetime import datetime as datetimeJsdecode, timedelta
from decimal import Decimal
from functools import reduce
from pprint import pprint
from sqlite3 import Date

import PyPDF2
import openpyxl
import requests
from django.conf import settings
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.core import serializers
# Create your views here.
from django.core.files.base import File
from django.core.files.storage import FileSystemStorage
from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Count
from django.db.models import Q, Subquery, OuterRef
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum
from django.db.models import Value, F
from django.db.models.functions import Concat
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.template.loader import get_template
#
from django.urls import reverse
from django.utils import timezone
from django.utils.datastructures import MultiValueDictKeyError
from django.utils.decorators import method_decorator
from django.utils.timezone import make_aware, now
from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView, ListView
from num2words import num2words
from xhtml2pdf import pisa

from configurations.helper_config import execute_query, create_query_background_task
from configurations.models import Compagnie, User, Rubrique, \
    TypePriseencharge, Pays, TypeIntervenant, Responsabilite, TypeSinistre, Circonstance, \
    JourFerie, ActionLog, PeriodeComptable, TypeRemboursement, ModeCreation, \
    BackgroundQueryTask, TypePrefinancement
from production.models import Statut, TypeDocument, Client
#
from production.models import Police, HistoriquePolice, PoliceAssureur, Mouvement, AlimentPolice
from production.templatetags.my_filters import money_field
from shared.enum import StatutPolice
from shared.enum import StatutSinistre, StatutSinistreBordereau, StatutSinistrePrestation, StatutValidite, \
    StatutRemboursement, StatutRemboursementSinistre, DesignationRemboursementSinistre, SatutBordereauDossierSinistres, \
    StatutPaiementSinistre, TypeBonConsultation
from sinistre.helper_sinistre import exportation_en_excel_avec_style, \
    extraction_demandes_accords_prealables_traitees_par_medecins_conseil, extraction_des_sinistres_traites_valides, \
    requete_demandes_accords_prealables_traitees_par_les_medecins_conseil, requete_liste_des_sp_client_par_filiale, \
    requete_liste_paiement_sinistre_sante_entre_deux_dates, \
    requete_liste_sinistre_ordonnancee_par_period_par_beneficiaire, \
    requete_liste_sinistre_ordonnancee_par_period, requete_liste_sinistre_entre_2date, requete_analyse_prime_compta, \
    requete_liste_sinistre_saisies_entre_2date, requete_sinistres_traites_et_valides_par_les_gestionnaires, \
    requete_analyse_prime_compta_apporteur, get_retenue_selon_contexte
# Create your views here.
from sinistre.models import PaiementComptable, Sinistre, DossierSinistre, DocumentDossierSinistre, ProrogationSinistre, \
    RemboursementSinistre, BordereauOrdonnancement, HistoriqueOrdonnancementSinistre


@method_decorator(login_required, name='dispatch')
class SaisieSinistreView(TemplateView):
    template_name = 'form_saisie_sinistre.html'
    model = Sinistre

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)

        today = timezone.now().date()
        clients = Client.objects.order_by('-nom')

        context['today'] = today
        context['clients'] = clients

        return self.render_to_response(context)

    def post(self):
        pass

    def get_context_data(self, **kwargs):
        return {
            **super().get_context_data(**kwargs),
            **admin.site.each_context(self.request),
            "opts": self.model._meta,
        }


@csrf_exempt
def recherche_client_police(request):
    if request.method == 'POST':
        numero_client = request.POST.get('nc', '').strip().upper()
        nom_client = request.POST.get('nomc', '').strip().upper()

        if not numero_client and not nom_client:
            return JsonResponse({'success': False, 'message': 'Aucun champ de recherche saisi.'})

        # Recherche stricte par code client si renseigné
        if numero_client:
            clients = Client.objects.filter(code=numero_client)
        else:
            # Sinon, recherche approximative par nom et prénoms
            clients = Client.objects.filter(
                Q(nom__icontains=nom_client) |
                Q(prenoms__icontains=nom_client)
            )

        # Vérification si un client a été trouvé
        if not clients.exists():
            return JsonResponse({'success': False, 'message': 'Client non trouvé.'})

        client = clients.first()  # Récupérer le premier client trouvé
        today = datetime.date.today()

        # Sous-requête pour obtenir la dernière ligne de `historique_police`
        last_historique = HistoriquePolice.objects.filter(
            police=OuterRef('pk')
        ).order_by('-created_at').values('id')[:1]

        # Sous-requête pour obtenir la dernière ligne de `assureur_police`
        last_assureur = PoliceAssureur.objects.filter(
            historique_police=OuterRef('pk')
        ).order_by('-created_at').values('compagnie__nom')[:1]

        # Filtrer les polices valides et récupérer la compagnie via les sous-requêtes
        polices = (Police.objects.filter(
            client=client,
            date_fin_effet__isnull=False

        ).filter(
            Q(date_fin_effet__isnull=True) | Q(date_fin_effet__gt=today)
        ).annotate(
            compagnie_nom=Subquery(last_assureur)
        ).values(
            'id',
            'numero',
            'produit__nom',
            'compagnie_nom',  # Nom de la compagnie récupéré via les sous-requêtes
            'date_debut_effet',
            'date_fin_effet'
        ))

        # Vérification si des polices existent
        if not polices.exists():
            return JsonResponse({'success': False, 'message': 'Aucune police active trouvée pour ce client.'})

        police_list = [
            {
                'id': police['id'],
                'numero': police['numero'],
                'produit': police['produit__nom'],
                'assureur': police['compagnie_nom'] if police['compagnie_nom'] else 'Non défini',
                'date_debut': police['date_debut_effet'],
                'date_echeance': police['date_fin_effet'],
            }
            for police in polices
        ]

        return JsonResponse({'success': True, 'polices': police_list})

    return JsonResponse({'success': False, 'message': 'Méthode non autorisée.'})


@csrf_exempt
def recuperer_information_police(request):
    police_id = request.GET.get('police_id')

    try:
        police = Police.objects.get(id=police_id, bureau=request.user.bureau, statut_validite='VALIDE')

        # TODO: Vider les intervenants et des garanties du sinistre
        if 'intervenants' in request.session:
            del request.session['intervenants']

        if 'garanties_sinistre' in request.session:
            del request.session['garanties_sinistre']

        # Récupération de client
        client = Client.objects.get(id=police.client_id)

        # Récupérer le dernier historique
        dernier_historique = HistoriquePolice.objects.filter(police_id=police.id).order_by('-date_du_jour').first()

        # Récupérer les assureurs associés à l'historique
        assureur_police = PoliceAssureur.objects.filter(historique_police_id=dernier_historique.id, type_compagnie_id=1).first() if dernier_historique else None
        today = timezone.now().date()

        mouvements = Mouvement.objects.filter(type_mouvement_id=2).order_by('libelle')
        typesinistres = TypeSinistre.objects.filter(statut=1).order_by('libelle')
        typeintervenants = TypeIntervenant.objects.filter(statut=1).order_by('libelle')
        typedocuments = TypeDocument.objects.filter(is_sinistre=1).order_by('libelle')
        responsabilites = Responsabilite.objects.filter(statut=1)
        circonstances = Circonstance.objects.filter(statut=1, branche_id=police.produit.branche_id).order_by('libelle')

        garanties = ''
        pays = Pays.objects.all().order_by('nom')

        aliments = 0
        aliment = 0
        if police.produit.code in ['10001', '10002', '50001', '50002']:
            aliments = AlimentPolice.objects.filter(police_id=police.id)
        else:
            aliment = AlimentPolice.objects.filter(police_id=police.id).first()

        context = {
            'police': police,
            'client': client,
            'dossiers_sinistres': None,
            'sinistres': None,
            'dernier_historique': dernier_historique,
            'assureur_police': assureur_police,
            'today': today,
            'mouvements': mouvements,
            'typesinistres': typesinistres,
            'typeintervenants': typeintervenants,
            'typedocuments': typedocuments,
            'responsabilites': responsabilites,
            'circonstances': circonstances,
            'garanties': garanties,
            'pays': pays,
            'aliments': aliments,
            'aliment': aliment
        }

        return render(request, 'formulaire_sinistre.html', context)
    except Police.DoesNotExist:
        return JsonResponse({'error': 'Police non trouvée.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def get_intervenants_session(request):
    try:
        police_id = request.GET.get('police_id')
        police = Police.objects.filter(
            id=police_id,
            bureau=request.user.bureau,
            statut_validite=StatutValidite.VALIDE
        ).first()

        if not police:
            return JsonResponse({'success': False, 'message': "Police non trouvée."}, status=404)

        client = Client.objects.filter(id=police.client_id).first()
        intervenants = request.session.setdefault('intervenants', [])

        if client:
            client_intervenant = {
                'id': str(uuid.uuid4()),  # ID unique pour le client
                'police_id': police.id,
                'type_intervenant_id': 1,
                'typeintervenant': 'Tiers Personne',
                'nom': client.nom.strip().upper(),
                'prenoms': client.prenoms.strip().upper(),
                'portable': client.telephone_fixe.strip() if client.telephone_fixe else '',
                'telephone': client.telephone_mobile.strip() if client.telephone_mobile else '',
                'email': client.email.strip().lower() if client.email else '',
                'code_postal': client.adresse,
                'boite_postale': client.adresse_postale,
                'ville': client.ville,
                'pays_id': client.pays_id
            }

            # Vérification simplifiée de l'existence de l'intervenant
            existe_deja = any(
                intervenant['nom'] == client_intervenant['nom'] and
                intervenant['prenoms'] == client_intervenant['prenoms'] and
                intervenant['typeintervenant'] == client_intervenant['typeintervenant']
                for intervenant in intervenants
            )

            if not existe_deja:
                intervenants.insert(0, client_intervenant)
                request.session['intervenants'] = intervenants

        return JsonResponse({'success': True, 'data': intervenants}, status=200)

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


@csrf_exempt
def recuperer_intervenant_police(request):
    police_id = request.GET.get('police_id')

    try:
        police = Police.objects.get(id=police_id, bureau=request.user.bureau, statut_validite='VALIDE')

        # Récupération de client
        client = Client.objects.get(id=police.client_id)

        if client:
            client_intervenant = {
                'id': str(uuid.uuid4()),  # ID unique pour le client
                'police_id': police.id,
                'type_intervenant_id': 1,
                'typeintervenant': 'Tiers Personne',
                'nom': client.nom.strip().upper(),
                'prenoms': client.prenoms.strip().upper(),
                'portable': client.telephone_fixe.strip() if client.telephone_fixe else '',
                'telephone': client.telephone_mobile.strip() if client.telephone_mobile else '',
                'email': client.email.strip().lower() if client.email else '',
                'code_postal': client.adresse,
                'boite_postale': client.adresse_postale,
                'ville': client.ville,
                'pays_id': client.pays_id
            }

            # Vérification simplifiée de l'existence de l'intervenant
            existe_deja = any(
                intervenant['nom'] == client_intervenant['nom'] and
                intervenant['prenoms'] == client_intervenant['prenoms'] and
                intervenant['typeintervenant'] == client_intervenant['typeintervenant']
                for intervenant in intervenants
            )

            if not existe_deja:
                intervenants.insert(0, client_intervenant)
                request.session['intervenants'] = intervenants

        return JsonResponse({'success': True, 'data': intervenants}, status=200)

    except Police.DoesNotExist:
        return JsonResponse({'error': 'Police non trouvée.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)















@method_decorator(login_required, name='dispatch')
class DossierSinistresView(TemplateView):
    template_name = 'liste_dossiers_sinistres.html'
    model = Sinistre

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)


        today = timezone.now().date()
        context['today'] = today
        context['breadcrumbs'] = [
            {'title': 'Prises en charges', 'url': ''},
            {'title': 'Traités', 'url': ''},
        ]

        return self.render_to_response(context)

    def post(self):
        pass

    def get_context_data(self, **kwargs):
        return {
            **super().get_context_data(**kwargs),
            **admin.site.each_context(self.request),
            "opts": self.model._meta,
        }


def dossiersinistre_datatable(request):
    items_per_page = 10
    page_number = request.GET.get('page')
    start = int(request.GET.get('start', 0))
    length = int(request.GET.get('length', items_per_page))
    sort_column_index = int(request.GET.get('order[0][column]'))
    sort_direction = request.GET.get('order[0][dir]')

    search_numero_assure = request.GET.get('num_assure', '')
    search_numero_dossier_sinistre = request.GET.get('num_feuille_soins', '')
    search_date_survenance = request.GET.get('date_prestation', '')
    date_reception_facture = request.GET.get('date_reception_facture', '')
    reference_facture = request.GET.get('reference_facture', '')
    statut_pec = request.GET.get('statut_pec', '')

    if request.user.is_med:  # inclure plus tard le code pays
        # queryset = [x for x in DossierSinistre.objects.filter(statut_validite=StatutValidite.VALIDE, bureau=request.user.bureau).order_by('id') if x.has_sinistre_en_attente or x.has_prorogation_en_attente]

        # SOLUTION POUR OPTIMISER: Créer un champ statut_prorogation qui sera mis à jour à chaque qu'il yy a une prorpogation sur un sinistre
        # et un champ statut_entente qui est mis à jour quand les sinistres en attente existe sur le dossier
        if(search_numero_assure or search_numero_dossier_sinistre or search_date_survenance or date_reception_facture or reference_facture or statut_pec):
            queryset = DossierSinistre.objects.filter(statut_validite=StatutValidite.VALIDE, bureau=request.user.bureau).filter(
                Q(statut_pec=StatutSinistre.ATTENTE) | Q(statut_prorogation=StatutSinistre.ATTENTE)).order_by('id')
                                                    
        else:
            queryset = DossierSinistre.objects.none()
            
        # pprint(queryset)


    elif request.user.is_pres or request.user.is_imag or request.user.is_optic or request.user.is_labo or request.user.is_dentaire:
        #cas de presta : pas besoin d'appliquer de filtre d'optimisation (données reduit)
        queryset = DossierSinistre.objects.filter(statut_validite=StatutValidite.VALIDE).order_by('-id')

    elif request.user.is_pharm:  # Updated on 11102023: remove filtre , is_closed=True, updated on 25112023: filtrer les sinistres et regrouper pour trouver id des dossier_sinistres a afficher
        # queryset_dossier_sinistre_ids = DossierSinistre.objects.filter(statut_validite=StatutValidite.VALIDE).values('id')
        #cas de pharmacie : pas besoin d'appliquer de filtre d'optimisation (données reduit)
        queryset_dossier_sinistre_ids = Sinistre.objects.filter(statut_validite=StatutValidite.VALIDE).values(
            'dossier_sinistre_id')

        # Extracting a list of unique IDs from the queryset_uniq
        list_dossier_sinistre_ids = [item['dossier_sinistre_id'] for item in queryset_dossier_sinistre_ids]

        # Filtering DossierSinistre objects based on the unique IDs
        queryset = DossierSinistre.objects.filter(id__in=list_dossier_sinistre_ids).order_by('-id')


    else:
        if (search_numero_assure or search_numero_dossier_sinistre or search_date_survenance or date_reception_facture or reference_facture or statut_pec):
            queryset = DossierSinistre.objects.filter(statut_validite=StatutValidite.VALIDE,
                                                  bureau=request.user.bureau).order_by('-id')
        else:
            queryset = DossierSinistre.objects.none()

    # la recherche
    if search_numero_assure:
        cartes = Carte.objects.filter(numero__contains=search_numero_assure)
        carte = cartes.first() if cartes else None
        aliment = carte.aliment if carte else None
        queryset = queryset.filter(aliment_id=aliment.pk) if aliment else queryset.filter(numero="nexisterajamais")

    if search_numero_dossier_sinistre:
        queryset = queryset.filter(numero=search_numero_dossier_sinistre)

    if search_date_survenance:
        queryset = queryset.filter(date_survenance__contains=search_date_survenance)

    if date_reception_facture:
        queryset = queryset.filter(date_reception_facture__contains=date_reception_facture)


    if reference_facture:
        queryset = queryset.filter(reference_facture__contains=reference_facture)
        
    if statut_pec:
        queryset = queryset.filter(Q(statut_pec=statut_pec) | Q(statut_prorogation=statut_pec))

    # Map column index to corresponding model field for sorting
    sort_columns = {
        0: '-numero',
        1: 'aliment__nom',
        2: 'statut',
        # Add more columns as needed
    }

    # Default sorting by 'id' if column index is not found
    sort_column = sort_columns.get(sort_column_index, 'id')

    if sort_direction == 'desc':
        sort_column = '-' + sort_column  # For descending order

    # Apply sorting
    # add condition to avoid list has no attribute order_by
    # if not request.user.is_med and not request.user.is_pharm:
    # queryset = queryset.order_by(sort_column)

    # filter les pec dont le statut est EN ATTENTE
    if request.user.is_med:
        queryset_without_accord = [x.id for x in queryset if x.statut == "EN ATTENTE" or x.statut_prorogation == "EN ATTENTE"]
        queryset = queryset.filter(id__in=queryset_without_accord)


    paginator = Paginator(queryset, length)
    page_obj = paginator.get_page(page_number)

    # Prepare the data in the expected format
    data = []
    for c in page_obj:
        detail_url = reverse('details_dossier_sinistre', args=[c.id])  # URL to the detail view# URL to the detail view
        actions_html = f'<a href="{detail_url}"><span class="badge btn-sm btn-details rounded-pill"><i class="fa fa-eye"></i> Détails</span></a>&nbsp;&nbsp;'

        if request.user.is_pharm:
            type_or_numero_carte = c.aliment.carte_active().numero if c.aliment and c.aliment.carte_active() else ''
        else:
            if request.user.is_med and c.type_priseencharge.code == "CONSULT":
                type_or_numero_carte = "PHARMACIE"
            else:
                type_or_numero_carte = c.type_priseencharge.libelle if c.type_priseencharge else ''

        if not c.aliment:
            c.aliment.nom = ''
        if not c.aliment:
            c.aliment.prenoms = ''

        if request.user.is_pharm:
            #total_frais_reel = c.total_frais_reel_medicament
            #total_part_compagnie = c.total_part_compagnie_medicament
            #total_part_assure = c.total_part_assure_medicament

            total_frais_reel = c.total_frais_reel_medicament
        else:
            total_frais_reel = c.new_total_frais_reel
            total_part_compagnie = c.new_total_part_compagnie_gestionnaire
            total_part_assure = c.new_total_part_assure_gestionnaire

        dossier_sinistre_statut = c.statut
        dossier_sinistre_statut_prorogation = c.statut_prorogation
        statut_html = f'<span class="badge badge-{c.statut.lower().replace(" ", "-")}">{dossier_sinistre_statut}</span>'
        # statut_html = f'<span class="badge badge-{c.statut_pec.lower().replace(" ","-")}">{c.statut_pec}</span>'

        cartes = c.aliment.cartes.filter(statut=Statut.ACTIF) if c.aliment else None
        numero_carte = cartes.first().numero if cartes else None

        centre_prescripteur = c.centre_prescripteur.name if c.centre_prescripteur else ""
        nom_pharmacie = c.pharmacie.name if c.pharmacie else ""

        data_iten = {
            "id": c.id,
            "numero": c.numero if c.numero else "",
            "type_or_numero_carte": type_or_numero_carte,
            "nom": c.aliment.nom + ' ' + c.aliment.prenoms,
            "numero_carte": numero_carte,
            "centre_prescripteur": centre_prescripteur,
            "total_frais_reel": money_field(total_frais_reel),
            "total_part_compagnie": money_field(total_part_compagnie),
            "total_part_assure": money_field(total_part_assure),
            "date_prestation": c.date_survenance.strftime("%d/%m/%Y %H:%M") if c.date_survenance else "",
            "statut": statut_html,
            "actions": actions_html,
        }

        if request.user.is_med:
            statut_prorogation_html = f'<span class="badge badge-{c.statut_prorogation.replace(" ", "-").lower()}">{c.statut_prorogation}</span>' if c.statut_prorogation else ""
            data_iten["statut_prorogation"] = statut_prorogation_html


        # if request.user.is_med:
        #    if dossier_sinistre_statut != "ACCORDE":
        #        data.append(data_iten)
        # else:
        #    data.append(data_iten)

        data.append(data_iten)

    return JsonResponse({
        "data": data,
        "recordsTotal": queryset.count(),
        "recordsFiltered": paginator.count,
        "draw": int(request.GET.get('draw', 1)),
    })


@method_decorator(login_required, name='dispatch')
class EntentesPrealablesView(TemplateView):
    template_name = 'liste_ententes_prealables.html'
    model = Sinistre

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)


        today = timezone.now().date()
        context['today'] = today
        context['breadcrumbs'] = [
            {'title': 'Prises en charges', 'url': ''},
            {'title': 'Traités', 'url': ''},
        ]

        return self.render_to_response(context)

    def post(self):
        pass

    def get_context_data(self, **kwargs):
        return {
            **super().get_context_data(**kwargs),
            **admin.site.each_context(self.request),
            "opts": self.model._meta,
        }


def ententes_prealables_datatable(request):
    items_per_page = 10
    page_number = request.GET.get('page')
    start = int(request.GET.get('start', 0))
    length = int(request.GET.get('length', items_per_page))
    sort_column_index = int(request.GET.get('order[0][column]'))
    sort_direction = request.GET.get('order[0][dir]')

    search_numero_assure = request.GET.get('num_assure', '')
    search_numero_dossier_sinistre = request.GET.get('num_feuille_soins', '')
    search_date_survenance = request.GET.get('date_prestation', '')
    date_reception_facture = request.GET.get('date_reception_facture', '')
    reference_facture = request.GET.get('reference_facture', '')
    statut_pec = request.GET.get('statut_pec', '')


    # SOLUTION POUR OPTIMISER: Créer un champ statut_prorogation qui sera mis à jour à chaque qu'il yy a une prorpogation sur un sinistre
    # et un champ statut_entente qui est mis à jour quand les sinistres en attente existe sur le dossier
    if (search_numero_assure or search_numero_dossier_sinistre or search_date_survenance or date_reception_facture or reference_facture or statut_pec):
        queryset = DossierSinistre.objects.filter(statut_validite=StatutValidite.VALIDE,
                                                  bureau=request.user.bureau).filter(
            Q(statut_pec=StatutSinistre.ATTENTE) | Q(statut_prorogation=StatutSinistre.ATTENTE)).order_by('id')

    else:
        queryset = DossierSinistre.objects.none()

    # pprint(queryset)

    # la recherche
    if search_numero_assure:
        cartes = Carte.objects.filter(numero__contains=search_numero_assure)
        carte = cartes.first() if cartes else None
        aliment = carte.aliment if carte else None
        queryset = queryset.filter(aliment_id=aliment.pk) if aliment else queryset.filter(numero="nexisterajamais")

    if search_numero_dossier_sinistre:
        queryset = queryset.filter(numero=search_numero_dossier_sinistre)

    if search_date_survenance:
        queryset = queryset.filter(date_survenance__contains=search_date_survenance)

    if statut_pec:
        queryset = queryset.filter(Q(statut_pec=statut_pec) | Q(statut_prorogation=statut_pec))

    # Map column index to corresponding model field for sorting
    sort_columns = {
        0: '-numero',
        1: 'aliment__nom',
        2: 'statut',
        # Add more columns as needed
    }

    # Default sorting by 'id' if column index is not found
    sort_column = sort_columns.get(sort_column_index, 'id')

    if sort_direction == 'desc':
        sort_column = '-' + sort_column  # For descending order

    # Apply sorting
    # add condition to avoid list has no attribute order_by
    # if not request.user.is_med and not request.user.is_pharm:
    # queryset = queryset.order_by(sort_column)

    # filter les pec dont le statut est EN ATTENTE
    queryset_without_accord = [x.id for x in queryset if
                               x.statut == "EN ATTENTE" or x.statut_prorogation == "EN ATTENTE"]
    queryset = queryset.filter(id__in=queryset_without_accord)

    paginator = Paginator(queryset, length)
    page_obj = paginator.get_page(page_number)

    # Prepare the data in the expected format
    data = []
    for c in page_obj:
        detail_url = reverse('details_dossier_sinistre', args=[c.id])  # URL to the detail view# URL to the detail view
        actions_html = f'<a href="{detail_url}"><span class="badge btn-sm btn-details rounded-pill"><i class="fa fa-eye"></i> Détails</span></a>&nbsp;&nbsp;'

        if request.user.is_med and c.type_priseencharge.code == "CONSULT":
            type_or_numero_carte = "PHARMACIE"
        else:
            type_or_numero_carte = c.type_priseencharge.libelle if c.type_priseencharge else ''

        if not c.aliment:
            c.aliment.nom = ''
        if not c.aliment:
            c.aliment.prenoms = ''

        total_frais_reel = c.total_frais_reel + c.total_frais_reel_medicament
        total_part_compagnie = c.total_part_compagnie + c.total_part_compagnie_medicament
        total_part_assure = c.total_part_assure + c.total_part_assure_medicament

        dossier_sinistre_statut = c.statut
        dossier_sinistre_statut_prorogation = c.statut_prorogation
        statut_html = f'<span class="badge badge-{c.statut.lower().replace(" ", "-")}">{dossier_sinistre_statut}</span>'
        # statut_html = f'<span class="badge badge-{c.statut_pec.lower().replace(" ","-")}">{c.statut_pec}</span>'

        cartes = c.aliment.cartes.filter(statut=Statut.ACTIF) if c.aliment else None
        numero_carte = cartes.first().numero if cartes else None

        centre_prescripteur = c.centre_prescripteur.name if c.centre_prescripteur else ""
        nom_pharmacie = c.pharmacie.name if c.pharmacie else ""

        data_iten = {
            "id": c.id,
            "numero": c.numero if c.numero else "",
            "type_or_numero_carte": type_or_numero_carte,
            "nom": c.aliment.nom + ' ' + c.aliment.prenoms,
            "numero_carte": numero_carte,
            "centre_prescripteur": centre_prescripteur,
            "total_frais_reel": money_field(total_frais_reel),
            "total_part_compagnie": money_field(total_part_compagnie),
            "total_part_assure": money_field(total_part_assure),
            "date_prestation": c.date_survenance.strftime("%d/%m/%Y %H:%M") if c.date_survenance else "",
            "statut": statut_html,
            "actions": actions_html,
        }

        if request.user.is_med:
            statut_prorogation_html = f'<span class="badge badge-{c.statut_prorogation.replace(" ", "-").lower()}">{c.statut_prorogation}</span>' if c.statut_prorogation else ""
            data_iten["statut_prorogation"] = statut_prorogation_html

        # if request.user.is_med:
        #    if dossier_sinistre_statut != "ACCORDE":
        #        data.append(data_iten)
        # else:
        #    data.append(data_iten)

        data.append(data_iten)

    return JsonResponse({
        "data": data,
        "recordsTotal": queryset.count(),
        "recordsFiltered": paginator.count,
        "draw": int(request.GET.get('draw', 1)),
    })


@method_decorator(login_required, name='dispatch')
class DossierSinistresTraitesView(TemplateView):
    template_name = 'liste_dossiers_traites.html'
    model = Sinistre

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)

        today = timezone.now().date()
        context['today'] = today
        context['breadcrumbs'] = [
            {'title': 'Prises en charges', 'url': ''},
            {'title': 'Traités', 'url': ''},
        ]

        return self.render_to_response(context)

    def post(self):
        pass

    def get_context_data(self, **kwargs):
        return {
            **super().get_context_data(**kwargs),
            **admin.site.each_context(self.request),
            "opts": self.model._meta,
        }


def dossiersinistre_traites_datatable(request):
    items_per_page = 10
    page_number = request.GET.get('page')
    start = int(request.GET.get('start', 0))
    length = int(request.GET.get('length', items_per_page))
    sort_column_index = int(request.GET.get('order[0][column]'))
    sort_direction = request.GET.get('order[0][dir]')

    search_numero_assure = request.GET.get('num_assure', '')
    search_numero_dossier_sinistre = request.GET.get('num_feuille_soins', '')
    search_date_survenance = request.GET.get('date_prestation', '')

    today = datetime.datetime.now(tz=timezone.utc)
    yesterday = datetime.datetime.now(tz=timezone.utc) - timedelta(days=3)
    queryset = DossierSinistre.objects.filter(statut_validite=StatutValidite.VALIDE, bureau=request.user.bureau, has_sinistre_traite_bymedecin=True, date_traitement_sinistre_bymedecin__date__gte=yesterday).order_by('-id')
    # dd(queryset)

    # la recherche
    if search_numero_assure:
        cartes = Carte.objects.filter(numero=search_numero_assure)
        carte = cartes.first() if cartes else None
        aliment = carte.aliment if carte else None
        queryset = queryset.filter(aliment_id=aliment.pk) if aliment else queryset.filter(numero="nexisterajamais")

    if search_numero_dossier_sinistre:
        queryset = queryset.filter(numero__contains=search_numero_dossier_sinistre)

    if search_date_survenance:
        queryset = queryset.filter(date_survenance__contains=search_date_survenance)


    # Map column index to corresponding model field for sorting
    sort_columns = {
        0: '-numero',
        1: 'aliment__nom',
        2: 'statut',
        # Add more columns as needed
    }

    # Default sorting by 'id' if column index is not found
    sort_column = sort_columns.get(sort_column_index, 'id')

    if sort_direction == 'desc':
        sort_column = '-' + sort_column  # For descending order

    # Apply sorting
    # add condition to avoid list has no attribute order_by
    # if not request.user.is_med and not request.user.is_pharm:
    # queryset = queryset.order_by(sort_column)

    paginator = Paginator(queryset, length)
    page_obj = paginator.get_page(page_number)

    # Prepare the data in the expected format
    data = []
    for c in page_obj:
        detail_url = reverse('details_dossier_sinistre', args=[c.id])  # URL to the detail view# URL to the detail view
        actions_html = f'<a href="{detail_url}"><span class="badge btn-sm btn-details rounded-pill"><i class="fa fa-eye"></i> Détails</span></a>&nbsp;&nbsp;'

        if request.user.is_pharm:
            type_or_numero_carte = aliment.carte_active if aliment else ''
        else:
            if request.user.is_med and c.type_priseencharge.code == "CONSULT":
                type_or_numero_carte = "PHARMACIE"
            else:
                type_or_numero_carte = c.type_priseencharge.libelle if c.type_priseencharge else ''

        if not c.aliment:
            c.aliment.nom = ''
        if not c.aliment:
            c.aliment.prenoms = ''


        if request.user.is_pharm:
            total_frais_reel = c.total_frais_reel_medicament
            total_part_compagnie = c.total_part_compagnie_medicament
            total_part_assure = c.total_part_assure_medicament
        else:
            total_frais_reel = c.new_total_frais_reel
            total_part_compagnie = c.new_total_part_compagnie_gestionnaire
            total_part_assure = c.new_total_part_assure_gestionnaire


        statut_html = f'<span class="badge badge-{c.statut.lower().replace(" ", "-")}">{c.statut}</span>'

        cartes = c.aliment.cartes.filter(statut=Statut.ACTIF) if c.aliment else None
        numero_carte = cartes.first().numero if cartes else None

        data_iten = {
            "id": c.id,
            "numero": c.numero if c.numero else "",
            "type_or_numero_carte": type_or_numero_carte,
            "nom": c.aliment.nom + ' ' + c.aliment.prenoms,
            "numero_carte": numero_carte,
            "total_frais_reel": money_field(total_frais_reel),
            "total_part_compagnie": money_field(total_part_compagnie),
            "total_part_assure": money_field(total_part_assure),
            "date_prestation": c.date_survenance.strftime("%d/%m/%Y %H:%M") if c.date_survenance else "",
            "date_traitement_bymedecin": c.date_traitement_sinistre_bymedecin.strftime("%d/%m/%Y %H:%M") if c.date_traitement_sinistre_bymedecin else "",
            "statut": statut_html,
            "actions": actions_html,
        }

        if request.user.is_med:
            statut_prorogation_html = f'<span class="badge badge-{c.statut_prorogation.replace(" ", "-").lower()}">{c.statut_prorogation}</span>' if c.statut_prorogation else ""
            data_iten["statut_prorogation"] = statut_prorogation_html

        data.append(data_iten)

    return JsonResponse({
        "data": data,
        "recordsTotal": queryset.count() if not request.user.is_med else len(queryset),
        "recordsFiltered": paginator.count,
        "draw": int(request.GET.get('draw', 1)),
    })


# GESTION DES SAISIES PAR LE GESTIONNAIRE SINISTRE


@method_decorator(login_required, name='dispatch')
class DossiersSinistresPhysiquesGestionnairesView(TemplateView):
    template_name = 'liste_dossiers_sinistres_physiques_gestionnaires.html'
    model = Sinistre

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)

        sinistres = []
        rubriques = Rubrique.objects.all()
        # dossiers_sinistres = [x for x in DossierSinistre.objects.all().order_by('-id') if x.sinistres.filter(statut=StatutSinistre.ATTENTE).exists()]

        # context['bureaux'] = bureaux
        context['sinistres'] = sinistres
        context['rubriques'] = rubriques
        context['types_remboursements'] = TypeRemboursement.objects.filter(status=True)

        context['yesterday'] = datetime.datetime.now(tz=timezone.utc) - datetime.timedelta(days=1)
        context['today'] = datetime.datetime.now(tz=timezone.utc)

        today = datetime.datetime.now(tz=timezone.utc)
        context['today'] = today
        context['breadcrumbs'] = [
            {'title': 'Prises en charges', 'url': ''},
            {'title': 'Traités', 'url': ''},
        ]

        return self.render_to_response(context)

    def post(self):
        pass

    def get_context_data(self, **kwargs):
        return {
            **super().get_context_data(**kwargs),
            **admin.site.each_context(self.request),
            "opts": self.model._meta,
        }


def dossiersinistre_physique_gestionnaire_datatable(request):
    items_per_page = 10
    page_number = request.GET.get('page')
    start = int(request.GET.get('start', 0))
    length = int(request.GET.get('length', items_per_page))
    sort_column_index = int(request.GET.get('order[0][column]'))
    sort_direction = request.GET.get('order[0][dir]')

    search_numero_assure = request.GET.get('num_assure', '')
    search_numero_dossier_sinistre = request.GET.get('num_feuille_soins', '')
    search_date_survenance = request.GET.get('date_prestation', '')

    pprint("search_numero_assure")
    pprint(search_numero_assure)

    pprint("search_numero_dossier_sinistre")
    pprint(search_numero_dossier_sinistre)

    pprint("search_date_survenance")
    pprint(search_date_survenance)

    queryset = DossierSinistre.objects.filter(bureau=request.user.bureau, statut_validite=StatutValidite.VALIDE, of_gestionnaire=1).order_by('id')
    # dd(queryset)

    if search_numero_assure:
        cartes = Carte.objects.filter(numero=search_numero_assure)
        carte = cartes.first() if cartes else None
        aliment = carte.aliment if carte else None
        queryset = queryset.filter(aliment_id=aliment.pk) if aliment else queryset.filter(numero="nexisterajamais")

    if search_numero_dossier_sinistre:
        queryset = queryset.filter(numero__contains=search_numero_dossier_sinistre)
    if search_date_survenance:
        queryset = queryset.filter(created_at__contains=search_date_survenance)



    # Map column index to corresponding model field for sorting
    sort_columns = {
        0: '-numero',
        1: 'aliment__nom',
        2: 'statut',
        # Add more columns as needed
    }

    # Default sorting by 'id' if column index is not found
    sort_column = sort_columns.get(sort_column_index, 'id')

    if sort_direction == 'desc':
        sort_column = '-' + sort_column  # For descending order

    # Apply sorting
    queryset = queryset.order_by(sort_column)

    paginator = Paginator(queryset, length)
    page_obj = paginator.get_page(page_number)

    # Prepare the data in the expected format
    data = []
    for c in page_obj:
        detail_url = reverse('details_dossier_sinistre', args=[c.id])  # URL to the detail view# URL to the detail view
        actions_html = f'<a href="{detail_url}"><span class="badge btn-sm btn-details rounded-pill"><i class="fa fa-eye"></i> Détails</span></a>&nbsp;&nbsp;'

        if request.user.is_pharm:
            type_or_numero_carte = aliment.carte_active if aliment else ''
        else:
            if request.user.is_med and c.type_priseencharge.code == "CONSULT":
                type_or_numero_carte = "PHARMACIE"
            else:
                type_or_numero_carte = c.type_priseencharge.libelle if c.type_priseencharge else ''

        if not c.aliment:
            c.aliment.nom = ''
        if not c.aliment:
            c.aliment.prenoms = ''


        if request.user.is_pharm:
            total_frais_reel = c.total_frais_reel_medicament
            total_part_compagnie = c.total_part_compagnie_medicament
            total_part_assure = c.total_part_assure_medicament
        else:
            total_frais_reel = c.new_total_frais_reel
            total_part_compagnie = c.new_total_part_compagnie_gestionnaire
            total_part_assure = c.new_total_part_assure_gestionnaire


        statut_html = f'<span class="badge badge-{c.statut.lower()}">{c.statut}</span>'

        data_iten = {
            "id": c.id,
            "numero": c.numero if c.numero else "",
            "type_or_numero_carte": type_or_numero_carte,
            "nom": c.aliment.nom + ' ' + c.aliment.prenoms,
            "total_frais_reel": money_field(total_frais_reel),
            "total_part_compagnie": money_field(total_part_compagnie),
            "total_part_assure": money_field(total_part_assure),
            "date_prestation": c.created_at.strftime("%d/%m/%Y %H:%M"),
            "statut": statut_html,
            "actions": actions_html,
        }

        if request.user.is_med:
            statut_prorogation_html = f'<span class="badge badge-{c.statut_prorogation.replace(" ", "-").lower()}">{c.statut_prorogation}</span>' if c.statut_prorogation else ''
            data_iten["statut_prorogation"] = statut_prorogation_html

        data.append(data_iten)

    return JsonResponse({
        "data": data,
        "recordsTotal": queryset.count(),
        "recordsFiltered": paginator.count,
        "draw": int(request.GET.get('draw', 1)),
    })


@login_required()
# modiifie le statut de verrouillage d'un dossier sinistre depuis le toggle sur la page d' annulation du dossier 
def change_dossier_closing_status(request, dossier_sinistre_id):

    response = None

    if request.method == 'POST':

        dossier_sinistre = DossierSinistre.objects.get(id=dossier_sinistre_id)

        if dossier_sinistre.is_closed == True:
            dossier_sinistre.is_closed = False

        else:
            dossier_sinistre.is_closed = True
        dossier_sinistre.save()
        #gardons des traces
        if dossier_sinistre.is_closed == False:
            ActionLog.objects.create(done_by=request.user, action="update",
                                     description="Déverrouillage d'un dossier sinistre", table="dossier_sinistre",
                                     row=dossier_sinistre.pk,
                                     )
        else:
            ActionLog.objects.create(done_by=request.user, action="update",
                                     description="Déverrouillage d'un dossier sinistre", table="dossier_sinistre",
                                     row=dossier_sinistre.pk,
                                     )

        response = {
            'statut': 1,
            'message': "Statut verrouillage dossier sinistre changé avec succès !",
            'data': {
            }
        }
        print(dossier_sinistre.is_closed)



    return JsonResponse(response)


@method_decorator(login_required, name='dispatch')
class AnnulerBordereauOrdonnancementView(TemplateView):
    template_name = 'annuler_bordereau_ordonnancement.html'
    model = BordereauOrdonnancement

    # traitement à l'appel du lien en get
    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)

        context['breadcrumbs'] = [
            {'title': 'Factures', 'url': ''},
            {'title': 'Annulation', 'url': ''},
        ]
        return self.render_to_response(context)



    # traitement à l'appel du lien en post pour la recherche de dossier et la suppresion de dossier ou sinistre
    def post(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        # recuperation de tout ce qui peut venir en post que ca soit pour la recherche ou la suppression
        btn_recherche = self.request.POST.get('recherche', None)
        submit_delete_item = self.request.POST.get('submit_delete_item', None)
        id_item = self.request.POST.get('id_item', None)
        motif_delete_item = self.request.POST.get('motif_delete_item', None)
        code_bordereau = self.request.POST.get('code_bordereau', None)
        context['breadcrumbs'] = [
            {'title': 'Factures', 'url': ''},
            {'title': 'Annulation', 'url': ''},
        ]
        dossier_sinistre = None

        # cette condition précise que nous venons faire la recherche
        if btn_recherche and code_bordereau:
            bordereau_ordonnancement = BordereauOrdonnancement.objects.filter(numero=code_bordereau, bureau=request.user.bureau, statut_paiement=StatutPaiementSinistre.ORDONNANCE, statut_validite=StatutValidite.VALIDE).first()

            context['code_bordereau'] = code_bordereau
            context['bordereau_ordonnancement'] = bordereau_ordonnancement

        # cette condition précise que nous venons faire l'annulation de la facture
        if submit_delete_item and id_item:

            bordereau_ordonnancement = BordereauOrdonnancement.objects.filter(id=id_item, bureau=request.user.bureau, statut_paiement=StatutPaiementSinistre.ORDONNANCE, statut_validite=StatutValidite.VALIDE).first()

            if bordereau_ordonnancement:
                # traitement facture
                bordereau_ordonnancement.bo_deleted_by = request.user
                bordereau_ordonnancement.statut_paiement = StatutPaiementSinistre.ATTENTE
                bordereau_ordonnancement.statut = StatutValidite.SUPPRIME
                bordereau_ordonnancement.observation = motif_delete_item
                bordereau_ordonnancement.save()
                context['old_facture'] = bordereau_ordonnancement.numero

                # récuperation sinistres associés
                sinistres = Sinistre.objects.filter(bordereau_ordonnancement=bordereau_ordonnancement)
                if sinistres:
                    for sinistre in sinistres:
                        sinistre.bordereau_ordonnancement = None
                        sinistre.statut_paiement = StatutPaiementSinistre.ATTENTE
                        #sinistre.observation = str(sinistre.observation)
                        sinistre.save()

                        #historiser les lignes qui étaient sur le bordereau
                        HistoriqueOrdonnancementSinistre.objects.create(created_by=request.user, bordereau_ordonnancement=bordereau_ordonnancement, sinistre=sinistre, montant_ordonnance=sinistre.montant_remb_accepte, observation=motif_delete_item)


                # enregistrer dans les log
                ActionLog.objects.create(done_by=request.user, action="annulation_bordereau_ordonnancement",
                                         description="Annulation d'un bordereau d'ordonnancement",
                                         table="bordereau_ordonnancement",
                                         row=bordereau_ordonnancement.pk)

            # print(code_dossier_sinistre)
        return self.render_to_response(context)

    def get_context_data(self, **kwargs):
        return {
            **super().get_context_data(**kwargs),
            **admin.site.each_context(self.request),
            "opts": self.model._meta,
        }


def remove_medicament_session_gestionnaire(request, medicament_id):
    if request.method == 'POST':

        liste_medicaments = request.session.get('liste_medicaments', [])

        pprint(medicament_id)
        # Utiliser une boucle ou une compréhension de liste pour supprimer l'élément avec l'acte_id correspondant
        liste_medicaments = [item for item in liste_medicaments if item['medicament_id'] != medicament_id]
        pprint(liste_medicaments)

        # Mettre à jour les données de session
        request.session['liste_medicaments'] = liste_medicaments

        response = {
            "statut": 1,
            "message": "Suppression effectuée avec succès"
        }

    else:

        response = {
            "statut": 0,
            "message": "Erreur survenu lors de la suppression du medicament",
            "data": {}
        }

    return JsonResponse(response)


@login_required
@never_cache
def statuer_acte(request):
    if request.method == "POST":

        # vider toute la session de calcul de prise en charge pour reprendre
        session_pec = request.user.id
        vider_sinistres_temporaires(session_pec)

        sinistre_id = request.POST.get('sinistre_id')
        type_operation = request.POST.get('type_operation')
        nombre_accorde = request.POST.get('nombre_accorde')
        # dd(nombre_accorde)
        motif_rejet = request.POST.get('motif_rejet')

        nombre_accorde = int(nombre_accorde) if nombre_accorde else 1

        # Retrieve the Sinistre object based on the provided sinistre_id
        sinistre = get_object_or_404(Sinistre, id=sinistre_id)

        # Update the status of the Acte
        if type_operation == "Confirm":

            # Added on 28092023: refaire le calcul pour controler les plafonds
            # vider toute la session de calcul de prise en charge pour reprendre
            session_pec = request.user.id
            vider_sinistres_temporaires(session_pec)

            pprint(request.POST)

            type_prise_en_charge_code = sinistre.acte.rubrique.type_priseencharge.code
            pprint("type_prise_en_charge_code")
            pprint(type_prise_en_charge_code)
            cout_acte = sinistre.frais_reel
            prescripteur_id = sinistre.prescripteur.pk if sinistre.prescripteur else None
            aliment_id = sinistre.aliment.pk
            aliment = sinistre.aliment
            date_survenance = sinistre.date_survenance

            acte = sinistre.acte
            acte_id = acte.pk

            # récupérer ses consommations individuel et par famille
            periode_couverture_encours = aliment.formule.police.periode_couverture_encours
            consommation_individuelle = Sinistre.objects.filter(
                periode_couverture_id=periode_couverture_encours.pk,
                aliment_id=aliment.id,
                statut=StatutSinistre.ACCORDE, statut_remboursement__in=[StatutRemboursement.ATTENTE, StatutRemboursement.DEMANDE, StatutRemboursement.ACCEPTE, StatutRemboursement.ACCEPTE_PARTIELLEMENT], statut_validite=StatutValidite.VALIDE
            ).aggregate(Sum('part_compagnie'))['part_compagnie__sum'] or 0

            consommation_famille = Sinistre.objects.filter(
                periode_couverture_id=periode_couverture_encours.pk,
                adherent_principal_id=aliment.adherent_principal.id,
                statut=StatutSinistre.ACCORDE, statut_remboursement__in=[StatutRemboursement.ATTENTE, StatutRemboursement.DEMANDE, StatutRemboursement.ACCEPTE, StatutRemboursement.ACCEPTE_PARTIELLEMENT], statut_validite=StatutValidite.VALIDE
            ).aggregate(Sum('part_compagnie'))['part_compagnie__sum'] or 0

            pprint(infos_acte['statut'])

            if infos_acte['statut'] == 0:
                response = {
                    'statut': 0,
                    'message': infos_acte['message'],
                    'data': {}
                }
                return JsonResponse(response)

            else:

                '''if acte.option_seance:
                    frais_reel = infos_acte['data']['frais_reel'] / int(nombre_accorde)
                    part_compagnie = infos_acte['data']['part_compagnie'] / int(nombre_accorde)
                    part_assure = infos_acte['data']['part_assure'] / int(nombre_accorde)
                    ticket_moderateur = infos_acte['data']['ticket_moderateur'] / int(nombre_accorde)
                    depassement = infos_acte['data']['depassement'] / int(nombre_accorde)
                else:'''
                frais_reel = infos_acte['data']['frais_reel']
                part_compagnie = infos_acte['data']['part_compagnie']
                part_assure = infos_acte['data']['part_assure']
                ticket_moderateur = infos_acte['data']['ticket_moderateur']
                depassement = infos_acte['data']['depassement']

                plafond_acte = infos_acte['data']['plafond_acte']
                nombre_acte = infos_acte['data']['nombre_acte']
                frequence = infos_acte['data']['frequence']
                unite_frequence = infos_acte['data']['unite_frequence']
                garanti = infos_acte['data']['garanti']
                bareme_id = infos_acte['data']['bareme_id']

                # mettre à jour les parts après recalcul
                sinistre.frais_reel = frais_reel
                sinistre.part_compagnie = part_compagnie
                sinistre.part_assure = part_assure
                sinistre.ticket_moderateur = ticket_moderateur
                sinistre.depassement = depassement

                sinistre.statut = StatutSinistre.ACCORDE
                sinistre.nombre_accorde = nombre_accorde

                # SI HOSPIT, Mettre à jour la date de sortie
                if sinistre.dossier_sinistre.type_priseencharge.code == "HOSPIT":
                    date_entree = sinistre.date_entree.date()
                    date_sortie = date_entree + datetime.timedelta(days=nombre_accorde)
                    sinistre.date_sortie = date_sortie

                texte_opereation = "accordé"

                sinistre.approuved_by = request.user
                sinistre.reviewed_at = datetime.datetime.now(tz=timezone.utc)
                sinistre.save()

                #signaler sur le dossier qu'il est traité par medecin conseil
                update_dossier_traitement_by_med_cons(sinistre)

                # dd(sinistre.nombre_accorde)

                notifier_waspito(sinistre)

                # enregistrer dans les log
                ActionLog.objects.create(done_by=request.user, action="accorde",
                                         description="Accord d'un sinistre", table="sinistre",
                                         row=sinistre.pk)

                # si c'est un acte avec séance, dupliquer les lignes de séance en fonction du nombre accordé
                if sinistre.acte.option_seance:
                    cpt = 1
                    for _ in range(sinistre.nombre_accorde - 1):
                        new_sinistre = deepcopy(sinistre)  # Copie de l'objet

                        new_sinistre.id = None
                        new_sinistre.numero = None
                        new_sinistre.nombre_demande = 1
                        new_sinistre.nombre_accorde = 1
                        new_sinistre.date_survenance = None
                        new_sinistre.statut_prestation = StatutSinistrePrestation.ATTENTE
                        new_sinistre.approuved_by = request.user
                        new_sinistre.reviewed_at = datetime.datetime.now(tz=timezone.utc)
                        new_sinistre.save()

                        # générer le numéro
                        code_bureau = sinistre.dossier_sinistre.bureau.code
                        new_sinistre.numero = str(code_bureau) + str(Date.today().year)[-2:] + '-' + str(
                            new_sinistre.pk).zfill(7) + '-SP'
                        new_sinistre.save()

                        cpt += 1
                        pprint("duplicata de l'acte - séance N° " + str(cpt))

                        # notifier_waspito(new_sinistre)

                        # enregistrer dans les log
                        ActionLog.objects.create(done_by=request.user, action="accorde",
                                                 description="Accord d'un sinistre", table="sinistre",
                                                 row=new_sinistre.pk)

                sinistre.motif_rejet = motif_rejet
                sinistre.save()



        else:
            sinistre.approuved_by = request.user
            sinistre.reviewed_at = datetime.datetime.now(tz=timezone.utc)
            sinistre.statut = StatutSinistre.REJETE
            sinistre.motif_rejet = motif_rejet
            texte_opereation = "rejeté"
            sinistre.save()

            # signaler sur le dossier qu'il est traité par medecin conseil
            update_dossier_traitement_by_med_cons(sinistre)

            notifier_waspito(sinistre)

            # enregistrer dans les log
            ActionLog.objects.create(done_by=request.user, action="rejete",
                                     description="Rejet d'un sinistre", table="sinistre",
                                     row=sinistre.pk)

        # si tous les sinistres ont été traité, rediriger à la liste des prises en charges, sinon actualiser la page
        sinistres_en_attente = Sinistre.objects.filter(dossier_sinistre_id=sinistre.dossier_sinistre_id,
                                                       statut=StatutSinistre.ATTENTE)
        redirectto = '' if sinistres_en_attente else reverse('admin:index')

        # mettre à jour la date validation du dossier_sinistre
        # Mettre à jour le statut_pec de dossier_sinistre
        update_statut_pec_dossier_sinistre(sinistre.dossier_sinistre)

        response = {
            'statut': 1,
            'message': "Acte " + texte_opereation + " avec succèss.",
            'redirectto': redirectto,
            'data': {
                'id': sinistre_id,
                'type': type_operation,
            }
        }

    else:

        response = {
            'statut': 0,
            'message': "Aucune demande d'approbation ou de reject lancée",
        }

    return JsonResponse(response)


@login_required
@never_cache
def approuver_liste_acte(request):
    response = {}  # Initialiser la variable response en dehors de la boucle

    if request.method == 'POST':
        for key in request.POST:
            if key.startswith('acte_'):
                sinistre_id = key.split('_')[1]
                print("mise à jour du sinistre : " + sinistre_id)
                # Retrieve the Sinistre object based on the provided sinistre_id
                sinistre = get_object_or_404(Sinistre, id=sinistre_id)
                if request.POST.getlist(key) == ['on']:
                    sinistre.statut = StatutSinistre.ACCORDE
                    sinistre.reviewed_at = datetime.datetime.now(tz=timezone.utc)
                    sinistre.approuved_by = request.user

                    # accorder le nombre demandé
                    sinistre.nombre_accorde = sinistre.nombre_demande

                    # SI HOSPIT, Mettre à jour la date de sortie
                    if sinistre.dossier_sinistre.type_priseencharge.code == "HOSPIT":
                        date_entree = sinistre.date_entree.date()
                        date_sortie = date_entree + datetime.timedelta(days=sinistre.nombre_demande)
                        sinistre.date_sortie = date_sortie

                    sinistre.save()

                    #signaler sur le dossier qu'il est traité par medecin conseil
                    update_dossier_traitement_by_med_cons(sinistre)

                    notifier_waspito(sinistre)

                    # enregistrer dans les log
                    ActionLog.objects.create(done_by=request.user, action="accorde",
                                             description="Accord d'un sinistre", table="sinistre",
                                             row=sinistre.pk)

                    # si c'est un acte avec séance, dupliquer les lignes de séance en fonction du nombre accordé
                    if sinistre.acte.option_seance:
                        cpt = 1  # vu qu'il y a déjà une ligne de séance sur laquelle on est
                        nombre_total = sinistre.nombre_accorde

                        for _ in range(sinistre.nombre_accorde - 1):
                            new_sinistre = deepcopy(sinistre)  # Copie de l'objet

                            new_sinistre.id = None
                            new_sinistre.numero = None
                            new_sinistre.nombre_demande = 1
                            new_sinistre.nombre_accorde = 1
                            new_sinistre.date_survenance = None
                            new_sinistre.statut_prestation = StatutSinistrePrestation.ATTENTE
                            new_sinistre.reviewed_at = datetime.datetime.now(tz=timezone.utc)
                            new_sinistre.approuved_by = request.user
                            new_sinistre.save()

                            # générer le numéro
                            code_bureau = sinistre.dossier_sinistre.bureau.code
                            new_sinistre.numero = str(code_bureau) + str(Date.today().year)[-2:] + '-' + str(
                                new_sinistre.pk).zfill(7) + '-SP'
                            new_sinistre.save()

                            cpt += 1

                            notifier_waspito(new_sinistre)

                            # enregistrer dans les log
                            ActionLog.objects.create(done_by=request.user, action="accorde",
                                                     description="Accord d'un sinistre", table="sinistre",
                                                     row=new_sinistre.pk)

                            pprint("cpt")
                            pprint(cpt)
                            pprint("sinistre.nombre_demande")
                            pprint(sinistre.nombre_demande)

                    else:
                        print("L'acte n'est pas avec séance")

                    response = {
                        'statut': 1,
                        'message': "Tous les actes sélectionnés ont été approuvés avec succèss.",
                        'data': {
                        }
                    }

            else:

                response = {
                    'statut': 0,
                    'message': "Aucun acte sélectionné pour approuver",
                    'data': {}
                }

        sinistres_en_attente = Sinistre.objects.filter(dossier_sinistre_id=sinistre.dossier_sinistre_id,
                                                       statut=StatutSinistre.ATTENTE)
        redirectto = '' if sinistres_en_attente else reverse('admin:index')

        # Mettre à jour le statut_pec de dossier_sinistre
        update_statut_pec_dossier_sinistre(sinistre.dossier_sinistre)

        response = {
            'statut': 1,
            'message': "Tous les actes sélectionnés ont été approuvés avec succèss.",
            'redirectto': redirectto,
            'data': {
            }
        }


    else:
        response = {
            'statut': 0,
            'message': "Erreur, non autorisé",
            'data': {
            }
        }

    return JsonResponse(response)


def update_statut_pec_dossier_sinistre(dossier_sinistre):
    pprint("update_statut_pec_dossier_sinistre")
    pprint(dossier_sinistre)

    sinistres_en_attente = dossier_sinistre.sinistres.filter(statut=StatutSinistre.ATTENTE)
    sinistres_accordes = dossier_sinistre.sinistres.filter(statut=StatutSinistre.ACCORDE)
    if sinistres_en_attente:
        dossier_sinistre.statut_pec = StatutSinistre.ATTENTE
    else:
        # si pas de accorde
        if sinistres_accordes:
            dossier_sinistre.statut_pec = StatutSinistre.ACCORDE
        else:
            dossier_sinistre.statut_pec = StatutSinistre.REJETE

    dossier_sinistre.save()


@login_required
@never_cache
def approuver_liste_acte_new(request):
    response = {}  # Initialiser la variable response en dehors de la boucle

    if request.method == 'POST':

        # vider toute la session de calcul de prise en charge pour reprendre
        session_pec = request.user.id
        vider_sinistres_temporaires(session_pec)

        dossier_sinistre_id = request.GET.get('dossier_sinistre_id', "0")

        for key in request.POST:
            if key.startswith('acte_'):
                sinistre_id = key.split('_')[1]
                print("mise à jour du sinistre : " + sinistre_id)
                # Retrieve the Sinistre object based on the provided sinistre_id
                sinistre = get_object_or_404(Sinistre, id=sinistre_id)
                if request.POST.getlist(key) == ['on']:

                    # Added on 28092023: permettre de recalculer à la validation par le medecin

                    type_prise_en_charge_code = sinistre.acte.rubrique.type_priseencharge.code
                    cout_acte = sinistre.frais_reel
                    prescripteur_id = sinistre.prescripteur.pk
                    aliment_id = sinistre.aliment.pk
                    aliment = sinistre.aliment
                    date_survenance = sinistre.date_survenance

                    acte = sinistre.acte
                    acte_id = acte.pk
                    nombre_accorde = sinistre.nombre_demande  # accorde ce qui est demandé

                    # récupérer ses consommations individuel et par famille
                    periode_couverture_encours = aliment.formule.police.periode_couverture_encours
                    consommation_individuelle = Sinistre.objects.filter(
                        periode_couverture_id=periode_couverture_encours.pk,
                        aliment_id=aliment.id,
                        statut=StatutSinistre.ACCORDE, statut_remboursement__in=[StatutRemboursement.ATTENTE, StatutRemboursement.DEMANDE, StatutRemboursement.ACCEPTE, StatutRemboursement.ACCEPTE_PARTIELLEMENT], statut_validite=StatutValidite.VALIDE
                    ).aggregate(Sum('part_compagnie'))['part_compagnie__sum'] or 0

                    consommation_famille = Sinistre.objects.filter(
                        periode_couverture_id=periode_couverture_encours.pk,
                        adherent_principal_id=aliment.adherent_principal.id,
                        statut=StatutSinistre.ACCORDE, statut_remboursement__in=[StatutRemboursement.ATTENTE, StatutRemboursement.DEMANDE, StatutRemboursement.ACCEPTE, StatutRemboursement.ACCEPTE_PARTIELLEMENT], statut_validite=StatutValidite.VALIDE
                    ).aggregate(Sum('part_compagnie'))['part_compagnie__sum'] or 0

                    '''if acte.option_seance:
                        frais_reel = infos_acte['data']['frais_reel'] / int(nombre_accorde)
                        part_compagnie = infos_acte['data']['part_compagnie'] / int(nombre_accorde)
                        part_assure = infos_acte['data']['part_assure'] / int(nombre_accorde)
                        ticket_moderateur = infos_acte['data']['ticket_moderateur'] / int(nombre_accorde)
                        depassement = infos_acte['data']['depassement'] / int(nombre_accorde)
                    else:'''
                    frais_reel = infos_acte['data']['frais_reel']
                    part_compagnie = infos_acte['data']['part_compagnie']
                    part_assure = infos_acte['data']['part_assure']
                    ticket_moderateur = infos_acte['data']['ticket_moderateur']
                    depassement = infos_acte['data']['depassement']

                    plafond_acte = infos_acte['data']['plafond_acte']
                    nombre_acte = infos_acte['data']['nombre_acte']
                    frequence = infos_acte['data']['frequence']
                    unite_frequence = infos_acte['data']['unite_frequence']
                    garanti = infos_acte['data']['garanti']
                    bareme_id = infos_acte['data']['bareme_id']

                    # mettre à jour les parts après recalcul
                    sinistre.frais_reel = frais_reel
                    sinistre.part_compagnie = part_compagnie
                    sinistre.part_assure = part_assure
                    sinistre.ticket_moderateur = ticket_moderateur
                    sinistre.depassement = depassement

                    sinistre.statut = StatutSinistre.ACCORDE
                    sinistre.approuved_by = request.user
                    sinistre.reviewed_at = datetime.datetime.now(tz=timezone.utc)

                    # accorder le nombre demandé
                    sinistre.nombre_accorde = nombre_accorde

                    # SI HOSPIT, Mettre à jour la date de sortie
                    if sinistre.dossier_sinistre.type_priseencharge.code == "HOSPIT":
                        date_entree = sinistre.date_entree.date()
                        date_sortie = date_entree + datetime.timedelta(days=sinistre.nombre_demande)
                        sinistre.date_sortie = date_sortie

                    sinistre.save()

                    #signaler sur le dossier qu'il est traité par medecin conseil
                    update_dossier_traitement_by_med_cons(sinistre)

                    ActionLog.objects.create(done_by=request.user, action="accorde",
                                             description="Accord d'un sinistre", table="sinistre",
                                             row=sinistre.pk)

                    # si c'est un acte avec séance, dupliquer les lignes de séance en fonction du nombre accordé
                    if sinistre.acte.option_seance:
                        cpt = 1  # vu qu'il y a déjà une ligne de séance sur laquelle on est
                        nombre_total = sinistre.nombre_accorde

                        while cpt < nombre_total:  # si c'est approuver tout, on considère le nombre demandé
                            new_sinistre = sinistre
                            new_sinistre.__dict__.update(sinistre.__dict__)
                            new_sinistre.id = None
                            new_sinistre.nombre_demande = 1
                            new_sinistre.nombre_accorde = 1
                            new_sinistre.date_survenance = None
                            new_sinistre.statut_prestation = StatutSinistrePrestation.ATTENTE
                            new_sinistre.approuved_by = request.user
                            new_sinistre.reviewed_at = datetime.datetime.now(tz=timezone.utc)
                            new_sinistre.save()
                            cpt += 1

                            ActionLog.objects.create(done_by=request.user, action="accorde",
                                                     description="Accord d'un sinistre", table="sinistre",
                                                     row=new_sinistre.pk)

                            pprint("cpt")
                            pprint(cpt)
                            pprint("sinistre.nombre_demande")
                            pprint(sinistre.nombre_demande)

                    else:
                        print("L'acte n'est pas avec séance")

                    response = {
                        'statut': 1,
                        'message': "Tous les actes sélectionnés ont été approuvés avec succèss.",
                        'data': {
                        }
                    }

            else:

                response = {
                    'statut': 0,
                    'message': "Aucun acte sélectionné pour approuver",
                    'data': {}
                }

        sinistres_en_attente = Sinistre.objects.filter(dossier_sinistre_id=dossier_sinistre_id,
                                                       statut=StatutSinistre.ATTENTE)
        redirectto = '' if sinistres_en_attente else reverse('admin:index')

        # Mettre à jour le statut_pec de dossier_sinistre
        update_statut_pec_dossier_sinistre(sinistre.dossier_sinistre)

        response = {
            'statut': 1,
            'message': "Tous les actes sélectionnés ont été approuvés avec succèss.",
            'redirectto': redirectto,
            'data': {
            }
        }


    else:
        response = {
            'statut': 0,
            'message': "Erreur, non autorisé",
            'data': {
            }
        }

    return JsonResponse(response)


@login_required
@never_cache
def rejeter_liste_acte(request):
    response = {}  # Initialiser la variable response en dehors de la boucle

    if request.method == 'POST':
        motif_rejet = request.GET.get('motif_rejet', "")
        dossier_sinistre_id = request.GET.get('dossier_sinistre_id', "0")
        pprint("dossier_sinistre_id")
        pprint(dossier_sinistre_id)

        for key in request.POST:
            if key.startswith('acte_'):
                sinistre_id = key.split('_')[1]
                print("mise à jour du sinistre : " + sinistre_id)
                # Retrieve the Sinistre object based on the provided sinistre_id
                sinistre = get_object_or_404(Sinistre, id=sinistre_id)

                if request.POST.getlist(key) == ['on']:
                    sinistre.motif_rejet = motif_rejet
                    sinistre.statut = StatutSinistre.REJETE
                    sinistre.approuved_by = request.user
                    sinistre.reviewed_at = datetime.datetime.now(tz=timezone.utc)
                else:
                    print("Nothing to do ")
                sinistre.save()

                #signaler sur le dossier qu'il est traité par medecin conseil
                update_dossier_traitement_by_med_cons(sinistre)

                notifier_waspito(sinistre)

                # Enregistre dans les logs
                ActionLog.objects.create(done_by=request.user, action="rejete",
                                         description="Rejet d'un sinistre", table="sinistre",
                                         row=sinistre.pk)

                response = {
                    'statut': 1,
                    'message': "Tous les actes sélectionnés ont été rejété avec succèss.",
                    'data': {
                    }
                }
            else:

                response = {
                    'statut': 0,
                    'message': "Aucun acte n'a été sélectionné pour rejéter",
                    'data': {}
                }

        sinistres_en_attente = Sinistre.objects.filter(dossier_sinistre_id=dossier_sinistre_id,
                                                       statut=StatutSinistre.ATTENTE)
        redirectto = '' if sinistres_en_attente else reverse('admin:index')

        # Mettre à jour le statut_pec de dossier_sinistre
        update_statut_pec_dossier_sinistre(sinistre.dossier_sinistre)

        response = {
            'statut': 1,
            'message': "Tous les actes sélectionnés ont été rejété avec succèss.",
            'redirectto': redirectto,
            'data': {
            }
        }


    else:
        response = {
            'statut': 0,
            'message': "Erreur, non autorisé",
            'data': {
            }
        }

    return JsonResponse(response)


# signaler sur le dossier qu'il est traité par medecin conseil
def update_dossier_traitement_by_med_cons(sinistre):
    if sinistre.dossier_sinistre.has_sinistre_traite_bymedecin is False:
        dossier_sinistre = sinistre.dossier_sinistre
        dossier_sinistre.has_sinistre_traite_bymedecin = True
        dossier_sinistre.date_traitement_sinistre_bymedecin = timezone.now()
        dossier_sinistre.save()

@login_required
@never_cache
def update_date_sortie_sinistre(request):
    if request.method == 'POST':
        sinistre_id = request.POST.get("id_sinistre")
        date_sortie = request.POST.get("date_sortie")
        sinistre = get_object_or_404(Sinistre, id=sinistre_id)
        sinistre.date_sortie = date_sortie
        sinistre.save()

        response = {
            'statut': 1,
            'message': "La date de sortie a été mise à jour !",
            'data': {
            }
        }
    else:
        response = {
            'statut': 0,
            'message': "Erreur la date de sortie n'a pas été mise à jour :/",
            'data': {
            }
        }

    return JsonResponse(response)


@login_required
@never_cache
def update_date_sortie_nb_jour(request):
    if request.method == 'POST':
        sinistre_id = request.POST.get("id_sinistre")
        date_sortie_encoded = request.POST.get("date_sortie")

        date_object = datetimeJsdecode.strptime(date_sortie_encoded, '%d/%m/%Y')
        # pri(date_sortie)
        formatted_date = date_object.strftime('%Y-%m-%d')
        sinistre = get_object_or_404(Sinistre, id=sinistre_id)
        sinistre.date_sortie = formatted_date
        sinistre.statut = StatutSinistre.ACCORDE
        sinistre.save()

        response = {
            'statut': 1,
            'message': "La date de sortie a été mise à jour !",
            'data': {
            }
        }
    else:
        response = {
            'statut': 0,
            'message': "Erreur la date de sortie n'a pas été mise à jour :/",
            'data': {
            }
        }

    return JsonResponse(response)


@login_required
@never_cache
def update_nombre_accorde_sinistre(request):
    if request.method == 'POST':
        sinistre_id = request.POST.get("id_sinistre")
        nombre_accorde = request.POST.get("nombre_accorde")
        sinistre = get_object_or_404(Sinistre, id=sinistre_id)
        sinistre.nombre_accorde = nombre_accorde
        sinistre.save()

        response = {
            'statut': 1,
            'message': "Le nombre accordé a été mise à jour !",
            'data': {
            }
        }

    else:
        response = {
            'statut': 0,
            'message': "Erreur le nombre accordé n'a pas été mise à jour :/",
            'data': {
            }
        }

    return JsonResponse(response)


def add_sinistre_waspito(sinistre):
    # dossier_sinistre = DossierSinistre.objects.create(sinistre)

    # dd(sinistre)
    return sinistre


# demande de prorogation
@login_required
def demande_prorogation(request, sinistre_id):
    if request.method == 'POST':

        pprint(request.POST)

        jour_demande = request.POST.get('nombre_jours_prorogation')
        motif = request.POST.get('motif_prorogation')

        date_entree = datetime.datetime.now(tz=timezone.utc)
        date_sortie = datetime.datetime.now(tz=timezone.utc)

        ProrogationSinistre.objects.create(created_by=request.user,
                                           sinistre_id=sinistre_id,
                                           jour_demande=jour_demande,
                                           jour_accorde=0,
                                           motif_demande=motif,
                                           date_entree=date_entree,
                                           date_sortie=date_sortie,
                                           )

        # mettre à jour le statut_prorogation du dossier_sinistre
        sinistre = Sinistre.objects.get(id=sinistre_id)
        dossier_sinistre = sinistre.dossier_sinistre
        dossier_sinistre.statut_prorogation = StatutSinistre.ATTENTE
        dossier_sinistre.save()

        # notifier du succès
        response = {
            'statut': 1,
            'message': "Demande de prorogation effectuée avec succès !",
            'data': ""
        }

        return JsonResponse(response)

    else:

        return redirect('/')


@login_required
def approuver_prorogation(request):
    if request.method == 'POST':

        pprint(request.POST)

        prorogation_id = request.POST.get('prorogation_id')
        jour_accorde = request.POST.get('jour_accorde')
        motif = request.POST.get('motif')

        date_entree = datetime.datetime.now(tz=timezone.utc)
        date_sortie = datetime.datetime.now(tz=timezone.utc)

        ProrogationSinistre.objects.filter(id=prorogation_id).update(reviewed_by=request.user,
                                                                     jour_accorde=jour_accorde,
                                                                     motif_rejet=motif,
                                                                     statut=StatutSinistre.ACCORDE
                                                                     )

        # mettre à jour le statut_prorogation du dossier_sinistre

        prorogation_sinistre = ProrogationSinistre.objects.get(id=prorogation_id)
        sinistre = prorogation_sinistre.sinistre
        dossier_sinistre = sinistre.dossier_sinistre

        # si pas d'autre demandes de prorogation en attente: le dossier d'hospit a un seul sinistre
        prorogations_en_attentes = ProrogationSinistre.objects.filter(sinistre=sinistre, statut=StatutSinistre.ATTENTE)
        if not prorogations_en_attentes:
            dossier_sinistre.statut_prorogation = StatutSinistre.ACCORDE
            dossier_sinistre.save()

        # notifier du succès
        response = {
            'statut': 1,
            'message': "Demande de prorogation approuvée avec succès !",
            'data': ""
        }

        return JsonResponse(response)

    else:

        return redirect('/')


@login_required
def rejeter_prorogation(request):
    if request.method == 'POST':

        pprint(request.POST)

        prorogation_id = request.POST.get('prorogation_id')
        motif = request.POST.get('motif')

        date_entree = datetime.datetime.now(tz=timezone.utc)
        date_sortie = datetime.datetime.now(tz=timezone.utc)

        ProrogationSinistre.objects.filter(id=prorogation_id).update(reviewed_by=request.user,
                                                                     jour_accorde=0,
                                                                     motif_rejet=motif,
                                                                     statut=StatutSinistre.REJETE
                                                                     )

        # mettre à jour le statut_prorogation du dossier_sinistre
        prorogation_sinistre = ProrogationSinistre.objects.get(id=prorogation_id)
        sinistre = prorogation_sinistre.sinistre
        dossier_sinistre = sinistre.dossier_sinistre

        # si pas d'autre demandes de prorogation en attente: le dossier d'hospit a un seul sinistre
        prorogations_en_attentes = ProrogationSinistre.objects.filter(sinistre=sinistre, statut=StatutSinistre.ATTENTE)
        if not prorogations_en_attentes:
            dossier_sinistre.statut_prorogation = StatutSinistre.ACCORDE
            dossier_sinistre.save()

        # notifier du succès
        response = {
            'statut': 1,
            'message': "Demande de prorogation rejetée avec succès !",
            'data': ""
        }

        return JsonResponse(response)

    else:

        return redirect('/')


# TODO : accepter_remboursement
@login_required
def accepter_remboursement(request, sinistre_id):
    if request.method == 'POST':

        pprint(request.POST)

        sinistre = Sinistre.objects.get(id=sinistre_id)

        motif = request.POST.get('motif')
        montant_accepte = request.POST.get('montant_accepte').replace(' ', '')
        montant_refuse = request.POST.get('montant_refuse').replace(' ', '')
                    
        # if montant_accepte == '': montant_accepte = 0
        if montant_refuse == '': montant_refuse = '0'

        montant_refuse = int(montant_refuse)
        if sinistre.tm_prefinanced:
            montant_accepte = int(sinistre.frais_reel) - int(montant_refuse)
        else:
            montant_accepte = int(sinistre.part_compagnie) - int(montant_refuse)

        montant_tps=int((montant_accepte*sinistre.taux_retenue)/100)

        rb_sinistre = RemboursementSinistre.objects.filter(sinistre=sinistre, is_invalid=False).first()

        if rb_sinistre is None:
            # save remboursement sinistre accepted
            RemboursementSinistre.objects.create(created_by=request.user,
                                                 designation=DesignationRemboursementSinistre.NET_A_PAYER,
                                                 sinistre=sinistre,
                                                 montant=montant_accepte,
                                                 statut=StatutRemboursementSinistre.ACCEPTE)
            # save remboursement sinistre refused
            RemboursementSinistre.objects.create(created_by=request.user,
                                                 designation=DesignationRemboursementSinistre.MONTANT_REFUSE,
                                                 sinistre=sinistre,
                                                 montant=montant_refuse,
                                                 motif=motif,
                                                 statut=StatutRemboursementSinistre.REFUSE)
            if sinistre.taux_retenue is not None :
                RemboursementSinistre.objects.create(created_by=request.user,
                                                    designation=DesignationRemboursementSinistre.TAXT,
                                                    sinistre=sinistre,
                                                    montant=montant_tps,
                                                    motif=motif,
                                                    statut=StatutRemboursementSinistre.TAXT)
            # Added on 04052024:mettre à jour le montant_remboursement_accepte
            sinistre.montant_remboursement_accepte = montant_accepte
            sinistre.montant_remboursement_refuse = montant_refuse
            sinistre.tps = montant_tps 

            # Added on 07062024: mettre à jour le statut remboursement dont on tiendra compte dans le calcul de la conso
            if montant_accepte == 0:
                sinistre.statut_remboursement = StatutRemboursement.REFUSE
            elif montant_refuse == 0:
                sinistre.statut_remboursement = StatutRemboursement.ACCEPTE
            else:
                sinistre.statut_remboursement = StatutRemboursement.ACCEPTE_PARTIELLEMENT

            sinistre.is_ges_processed = True
            sinistre.save()


            #si tm_prefinancé, recalculer les parts à refacturer
            recalcule_montant_refacture_compagnie_et_client(sinistre)


        # notifier du succès
        response = {
            'statut': 1,
            'message': f'Demande de remboursement acceptée avec succès !',
            'data': ""
        }

        return JsonResponse(response)

    else:

        return redirect('/')


# TODO : refuser_remboursement
@login_required
def refuser_remboursement(request, sinistre_id):
    if request.method == 'POST':

        pprint(request.POST)

        motif = request.POST.get('motif')

        sinistre = Sinistre.objects.get(id=sinistre_id)

        if sinistre.tm_prefinanced:
            montant_refuse = int(sinistre.frais_reel)
        else:
            montant_refuse = int(sinistre.part_compagnie)

        rb_sinistre = RemboursementSinistre.objects.filter(sinistre=sinistre, is_invalid=False).first()

        if rb_sinistre is None:
            # save remboursement sinistre accepted
            RemboursementSinistre.objects.create(created_by=request.user,
                                                 designation=DesignationRemboursementSinistre.NET_A_PAYER,
                                                 sinistre=sinistre,
                                                 montant=0,
                                                 statut=StatutRemboursementSinistre.ACCEPTE)
            # save remboursement sinistre refused
            RemboursementSinistre.objects.create(created_by=request.user,
                                                 designation=DesignationRemboursementSinistre.MONTANT_REFUSE,
                                                 sinistre=sinistre,
                                                 montant=montant_refuse,
                                                 motif=motif,
                                                 statut=StatutRemboursementSinistre.REFUSE)

            # Added on 04052024:mettre à jour le montant_remboursement_accepte
            sinistre.montant_remboursement_accepte = 0
            sinistre.montant_remboursement_refuse = montant_refuse

            #Added on 07062024: mettre à jour le statut remboursement dont on tiendra compte dans le calcul de la conso
            sinistre.statut_remboursement = StatutRemboursement.REFUSE

            sinistre.is_ges_processed = True
            sinistre.save()

            # si tm_prefinancé, recalculer les parts à refacturer
            recalcule_montant_refacture_compagnie_et_client(sinistre)


        # notifier du succès
        response = {
            'statut': 1,
            'message': "Demande de remboursement rejetée avec succès !",
            'data': ""
        }

        return JsonResponse(response)

    else:

        return redirect('/')


@login_required
@never_cache
def traiter_liste_remboursement(request):
    if request.method == 'POST':

        pprint(request.POST)
        sinistres_ids = request.POST.getlist('sinistres_ids[]')
        pprint(sinistres_ids)

        for sinistre_id in sinistres_ids:
            sinistre = Sinistre.objects.get(id=sinistre_id)

            motif = "RAS"
            if sinistre.tm_prefinanced:
                montant_accepte = int(sinistre.frais_reel)
            else:
                montant_accepte = int(sinistre.part_compagnie)

            sinistre = Sinistre.objects.get(id=sinistre_id)

            rb_sinistre = RemboursementSinistre.objects.filter(sinistre=sinistre, is_invalid=False).first()

            if rb_sinistre is None:

                montant_tps=int((montant_accepte*sinistre.taux_retenue)/100)

                # save remboursement sinistre accepted
                RemboursementSinistre.objects.create(created_by=request.user,
                                                     designation=DesignationRemboursementSinistre.NET_A_PAYER,
                                                     sinistre=sinistre,
                                                     montant=montant_accepte,
                                                     motif=motif,
                                                     statut=StatutRemboursementSinistre.ACCEPTE)
                if sinistre.taux_retenue is not None:
                    RemboursementSinistre.objects.create(created_by=request.user,
                                                        designation=DesignationRemboursementSinistre.TAXT,
                                                        sinistre=sinistre,
                                                        montant=montant_tps,
                                                        motif=motif,
                                                        statut=StatutRemboursementSinistre.TAXT)

                # Added on 04052024:mettre à jour le montant_remboursement_accepte
                sinistre.montant_remboursement_accepte = montant_accepte
                sinistre.montant_remboursement_refuse = 0
                sinistre.tps = montant_tps

                # Added on 07062024: mettre à jour le statut remboursement dont on tiendra compte dans le calcul de la conso
                sinistre.statut_remboursement = StatutRemboursement.ACCEPTE

                sinistre.is_ges_processed = True
                sinistre.save()

                # si tm_prefinancé, recalculer les parts à refacturer
                recalcule_montant_refacture_compagnie_et_client(sinistre)

        # notifier du succès
        response = {
            'statut': 1,
            'message': "Demande de remboursement acceptée avec succès !",
            'data': ""
        }

        return JsonResponse(response)

    else:

        return redirect('/')


@login_required
@never_cache
def refuser_liste_remboursement(request):
    if request.method == 'POST':

        pprint(request.POST)
        sinistres_ids = request.POST.getlist('sinistres_ids[]')
        pprint(sinistres_ids)
        motif = request.POST.get('motif')
        pprint(motif)

        for sinistre_id in sinistres_ids:
            sinistre = Sinistre.objects.get(id=sinistre_id)

            # motif = "RAS"
            if sinistre.tm_prefinanced:
                montant_refuser = int(sinistre.frais_reel)
            else:
                montant_refuser = int(sinistre.part_compagnie)

            sinistre = Sinistre.objects.get(id=sinistre_id)

            rb_sinistre = RemboursementSinistre.objects.filter(sinistre=sinistre, is_invalid=False).first()
            if rb_sinistre is None:
                # save remboursement sinistre accepted
                RemboursementSinistre.objects.create(created_by=request.user,
                                                     designation=DesignationRemboursementSinistre.NET_A_PAYER,
                                                     sinistre=sinistre,
                                                     montant=0,
                                                     statut=StatutRemboursementSinistre.ACCEPTE)

                # save remboursement sinistre refused
                RemboursementSinistre.objects.create(created_by=request.user,
                                                     designation=DesignationRemboursementSinistre.MONTANT_REFUSE,
                                                     sinistre=sinistre,
                                                     montant=montant_refuser,
                                                     motif=motif,
                                                     statut=StatutRemboursementSinistre.REFUSE)

                # Added on 04052024:mettre à jour le montant_remboursement_accepte
                sinistre.montant_remboursement_accepte = 0
                sinistre.montant_remboursement_refuse = montant_refuser

                # Added on 07062024: mettre à jour le statut remboursement dont on tiendra compte dans le calcul de la conso
                sinistre.statut_remboursement = StatutRemboursement.REFUSE

                sinistre.is_ges_processed = True
                sinistre.save()

                # si tm_prefinancé, recalculer les parts à refacturer
                recalcule_montant_refacture_compagnie_et_client(sinistre)

        # notifier du succès
        response = {
            'statut': 1,
            'message': "Demande de remboursement acceptée avec succès !",
            'data': ""
        }

        return JsonResponse(response)

    else:

        return redirect('/')


@method_decorator(login_required, name='dispatch')
class DetailsDossierSinistreView(TemplateView):
    # permission_required = "sinistre.view_sinistre"
    template_name = 'details_dossier_sinistre.html'
    model = Sinistre

    def get(self, request, sinistre_id, *args, **kwargs):

        dossier_sinistre = Sinistre.objects.filter(id=sinistre_id)

        if dossier_sinistre:

            context = self.get_context_data(**kwargs)
            context['dossier_sinistre'] = dossier_sinistre

            return self.render_to_response(context)

        else:
            return redirect('/')

    def get_context_data(self, **kwargs):
        return {
            **super().get_context_data(**kwargs),
            **admin.site.each_context(self.request),
            "opts": self.model._meta,
        }


def dossier_sinistre_add_document(request, dossier_sinistre_id):
    response = {
        'statut': 0,
        'message': "Veuillez renseigner correctement le formulaire !",
        # 'errors': form.errors,
    }

    if request.method == "POST":

        # form = DocumentForm(request.POST, request.FILES)

        # files = request.FILES['fichiers']
        # files = []
        # type_documents = []
        documents = []

        dossier_sinistre = DossierSinistre.objects.get(id=dossier_sinistre_id)

        # print(request.POST)
        # print(request.FILES)
        types_documents = TypeDocument.objects.all()

        for i in range(types_documents.count()):
            if request.FILES.get(f'fichier_{i}'):

                type_document_id = request.POST.get(f'type_document_{i}')

                #
                try:

                    file = request.FILES[f'fichier_{i}']

                    fs = FileSystemStorage()
                    # file_name_renamed = 'doc_' + str(dossier_sinistre_id) + '_' + str(uuid.uuid4()) +'_'+ file.name.replace(" ", "_")
                    file_name_renamed = 'doc_' + str(dossier_sinistre_id) + '_' + file.name.replace(" ", "_")
                    file_upload_path = 'dossiers_sinistres/documents/' + file_name_renamed

                    fs.save(file_upload_path, file)

                    type_document = TypeDocument.objects.get(id=type_document_id)
                    document = DocumentDossierSinistre.objects.create(dossier_sinistre=dossier_sinistre,
                                                                      type_document=type_document,
                                                                      fichier=file_upload_path)

                    print(vars(document))

                    documents.append({
                        'id': document.pk,
                        # 'nom': document.nom,
                        'fichier': '<a href="' + document.fichier.url + '"><i class="fa fa-file" title="Aperçu"></i> Afficher</a>',
                        'type_document': document.type_document.libelle,
                        # 'confidentialite': document.confidentialite,
                    })


                except MultiValueDictKeyError:
                    file_upload_path = ''

                #

        # print(files)
        # print(type_documents)
        response = {
            # 'files':files,
            # 'type_documents':type_documents,
            'statut': 1,
            'message': "Enregistrement effectué avec succès !",
            'documents': list(documents),
        }

    return JsonResponse(response)


def handle_uploaded_document(f, filename):
    path_ot_db = '/dossiers_sinistres/documents/'
    dirname = settings.MEDIA_URL.replace('/', '') + path_ot_db
    path = os.path.join(dirname)

    if not os.path.exists(path):
        os.makedirs(path)

    with open(dirname + '/' + filename, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

    return path_ot_db + '/' + filename


def supprimer_document(request):
    if request.method == "POST":

        document_id = request.POST.get('document_id')

        document = DocumentDossierSinistre.objects.get(id=document_id)
        if document.pk is not None:
            document.delete()

            response = {
                'statut': 1,
                'message': "Document supprimé avec succès !",
            }

        else:

            response = {
                'statut': 0,
                'message': "Document non trouvé !",
            }

        return JsonResponse(response)


# TODO : popup_details_sinistre
def popup_details_sinistre(request, sinistre_id):
    sinistre = Sinistre.objects.get(id=sinistre_id)
    sinistres_historique_acte = Sinistre.objects.filter(acte_id=sinistre.acte_id,
                                                        aliment_id=sinistre.aliment_id).exclude(
        id=sinistre.pk).order_by('-id')[:3]
    prorogations = ProrogationSinistre.objects.filter(sinistre_id=sinistre_id)

    return render(request, 'modal_details_sinistre.html',
                  {'sinistre': sinistre, 'sinistres_historique_acte': sinistres_historique_acte,
                   'prorogations': prorogations})


def popup_seance_done(request, sinistre_id):
    sinistre = Sinistre.objects.get(id=sinistre_id)
    today = datetime.datetime.now(tz=timezone.utc)

    if request.method == 'POST':
        date_survenance = request.POST.get('date_survenance')
        sinistre.statut_prestation = StatutSinistrePrestation.EFFECTUE
        sinistre.date_survenance = date_survenance
        sinistre.save()

        response = {
            "statut": 1,
            "message": "Séance marquée comme éffectuée",
            "data": {
            }
        }

        return JsonResponse(response)

    return render(request, 'modal_seance_done.html', {'sinistre': sinistre, 'today': today})


def popup_modifier_sinistre_medicament(request, sinistre_id):
    sinistre = Sinistre.objects.get(id=sinistre_id)

    return render(request, 'modal_details_sinistre.html', {'sinistre': sinistre})


@login_required()
def delete_sinistre_medicament(request, sinistre_id):
    if request.method == 'POST':

        sinistre = Sinistre.objects.get(id=sinistre_id)
        sinistre.statut = StatutValidite.SUPPRIME  # à analyser
        sinistre.statut_validite = StatutValidite.SUPPRIME
        sinistre.deleted_author = request.user
        sinistre.deleted_at = datetime.datetime.now(tz=timezone.utc)
        sinistre.save()

        response = {
            "statut": 1,
            "message": "Suppression effectué avec succès",
            "data": {
            }
        }

        return JsonResponse(response)

    else:
        return redirect('/')



def borderau_validation_pdf_old(request, liste_sinistre, beneficiaire, par_compagnie=False):

    liste_compagnies_concernes = liste_sinistre.values('compagnie_id').annotate(
        nombre_sinistres=Count('compagnie_id'),
    )

    results = []

    for groupe in liste_compagnies_concernes:
        sinistres = liste_sinistre.filter(compagnie_id=groupe['compagnie_id'])
        compagnie = Compagnie.objects.filter(id=groupe['compagnie_id']).first()

        # Montant net a payer est maintenant une propriété montant_remb_accepte
        montant_remb_accepte_par_compagnie = sum(s.montant_remb_accepte for s in sinistres)

        total_part_assure = sum(s.total_part_assure for s in sinistres)
        total_part_compagnie = sum(s.total_part_compagnie for s in sinistres)
        total_part_beneficiare = sum(s.total_part_assure for s in sinistres)
        total_frais_reel = sum(s.total_frais_reel for s in sinistres)

        total_base_remboursement = sum(s.total_part_compagnie or 0 for s in sinistres)
        total_rejete = sum(s.montant_remb_refuse or 0 for s in sinistres)
        total_accepte = sum(s.montant_remb_accepte or 0 for s in sinistres)

        total_base_taxable = total_accepte

        # total_base_taxable = sum(s.base_taxable or 0 for s in sinistres)
        total_taxe_far = sum(s.montant_taxe_far or 0 for s in sinistres)
        total_taxe_tbs = sum(s.montant_taxe_tbs or 0 for s in sinistres)
        total_taxes = int(total_taxe_tbs) + int(total_taxe_far)

        result = {
            'beneficiaire': beneficiaire,
            'compagnie': compagnie.nom,
            'total_part_assure': total_part_assure,
            'total_part_compagnie': total_part_compagnie,
            'total_part_beneficiare': total_part_beneficiare,
            'total_frais_reel': total_frais_reel,
            'total_rejete': total_rejete,
            'total_base_remboursement': total_base_remboursement,
            'total_base_taxable': total_base_taxable,
            'total_taxe_far': total_taxe_far,
            'total_taxe_tbs': total_taxe_tbs,
            'total_taxes': total_taxes,
            'total_nombre_sinistres': len(sinistres),
            'montant_remb_accepte_par_compagnie': montant_remb_accepte_par_compagnie,
            'sinistres': sinistres,
        }

        results.append(result)

    total_global_nombre_sinistres = sum(r['total_nombre_sinistres'] for r in results)
    total_global_part_assure = sum(r['total_part_assure'] for r in results)
    total_global_part_compagnie = sum(r['total_part_compagnie'] for r in results)
    total_global_part_beneficiare = sum(r['total_part_assure'] for r in results)
    total_global_frais_reel = sum(r['total_frais_reel'] for r in results)
    total_global_rejete = sum(r['total_rejete'] for r in results)
    total_global_base_remboursement = sum(r['total_base_remboursement'] for r in results)
    total_global_base_taxable = sum(r['total_base_taxable'] for r in results)
    total_global_taxe_tbs = sum(r['total_taxe_tbs'] for r in results)
    total_global_taxe_far = sum(r['total_taxe_far'] for r in results)
    total_global_taxes = total_global_taxe_far + total_global_taxe_tbs
    total_global_net_a_payer = sum(r['montant_remb_accepte_par_compagnie'] for r in results)

    #
    currency_code = request.user.bureau.pays.devise.code

    pdf = render_pdf('courriers/borderau_validation.html', {'sinistres_groupes': results, 'beneficiaire': beneficiaire, 'currency_code': currency_code})

    pdf_file = PyPDF2.PdfReader(pdf)
    nombre_pages = len(pdf_file.pages)

    contexte = {
        'resultats': results,
        'total_global_nombre_sinistres': total_global_nombre_sinistres,
        'total_global_part_assure': total_global_part_assure,
        'total_global_part_compagnie': total_global_part_compagnie,
        'total_global_part_beneficiare': total_global_part_beneficiare,
        'total_global_frais_reel': total_global_frais_reel,
        'total_global_rejete': total_global_rejete,
        'total_global_base_remboursement': total_global_base_remboursement,
        'total_global_base_taxable': total_global_base_taxable,
        'total_global_taxes': total_global_taxes,
        'total_global_net_a_payer': total_global_net_a_payer,
        'nombre_pages': nombre_pages,
        'beneficiaire': beneficiaire,
        'currency_code': currency_code
    }
    pdf = render_pdf('courriers/borderau_validation.html', contexte)

    return pdf

    # #AFFICHER DIRECTEMENT
    # return HttpResponse(File(pdf), content_type='application/pdf')


def borderau_validation_pdf(request, liste_sinistre, beneficiaire, par_compagnie=False):
    liste_compagnies_concernes = liste_sinistre.values('compagnie_id').annotate(
        nombre_sinistres=Count('compagnie_id'),
    )

    results = []

    for groupe in liste_compagnies_concernes:
        sinistres = liste_sinistre.filter(compagnie_id=groupe['compagnie_id'])
        compagnie = Compagnie.objects.filter(id=groupe['compagnie_id']).first()

        # Montant net a payer est maintenant une propriété montant_remb_accepte
        montant_remb_accepte_par_compagnie = sum(s.montant_remb_accepte for s in sinistres)

        total_frais_reel = sum(s.total_frais_reel for s in sinistres)
        total_part_assure = sum((0 if s.tm_prefinanced else s.total_part_assure) for s in sinistres) #identique a total_part_beneficiare

        total_base_remboursement = sum((s.total_frais_reel if s.tm_prefinanced else s.total_part_compagnie) or 0 for s in sinistres)
        total_rejete = sum(s.montant_remb_refuse or 0 for s in sinistres)
        total_accepte = sum(s.montant_remb_accepte or 0 for s in sinistres)

        total_base_taxable = total_accepte

        # total_base_taxable = sum(s.base_taxable or 0 for s in sinistres)
        total_taxe_far = sum(s.montant_taxe_far or 0 for s in sinistres)
        total_taxe_tbs = sum(s.montant_taxe_tbs or 0 for s in sinistres)
        total_taxes = int(total_taxe_tbs) + int(total_taxe_far)
        total_net_a_payer = total_base_taxable + total_taxes

        result = {
            'beneficiaire': beneficiaire,
            'compagnie': compagnie.nom,
            'total_part_assure': total_part_assure,
            'total_frais_reel': total_frais_reel,
            'total_rejete': total_rejete,
            'total_base_remboursement': float(total_base_remboursement),
            'total_base_taxable': total_base_taxable,
            'total_taxe_far': total_taxe_far,
            'total_taxe_tbs': total_taxe_tbs,
            'total_taxes': total_taxes,
            'total_nombre_sinistres': len(sinistres),
            #'montant_remb_accepte_par_compagnie': montant_remb_accepte_par_compagnie,
            'total_net_a_payer': total_net_a_payer,
            'sinistres': sinistres,
        }

        results.append(result)

    total_global_nombre_sinistres = sum(r['total_nombre_sinistres'] for r in results)
    total_global_part_assure = sum(r['total_part_assure'] for r in results)
    #total_global_part_beneficiare = sum(r['total_part_assure'] for r in results)
    total_global_frais_reel = sum(r['total_frais_reel'] for r in results)
    total_global_rejete = sum(r['total_rejete'] for r in results)
    total_global_base_remboursement = sum(r['total_base_remboursement'] for r in results)
    total_global_base_taxable = sum(r['total_base_taxable'] for r in results)
    total_global_taxe_tbs = sum(r['total_taxe_tbs'] for r in results)
    total_global_taxe_far = sum(r['total_taxe_far'] for r in results)
    total_global_taxes = total_global_taxe_far + total_global_taxe_tbs
    total_global_net_a_payer = sum(r['total_net_a_payer'] for r in results)
    #
    currency_code = request.user.bureau.pays.devise.code

    pdf = render_pdf('courriers/borderau_validation.html', {'sinistres_groupes': results, 'beneficiaire': beneficiaire, 'resultats': results, 'currency_code': currency_code})

    pdf_file = PyPDF2.PdfReader(pdf)
    nombre_pages = len(pdf_file.pages)

    contexte = {
        'resultats': results,
        'total_global_nombre_sinistres': total_global_nombre_sinistres,
        'total_global_part_assure': total_global_part_assure,
        #'total_global_part_beneficiare': total_global_part_beneficiare,
        'total_global_frais_reel': total_global_frais_reel,
        'total_global_rejete': total_global_rejete,
        'total_global_base_remboursement': total_global_base_remboursement,
        'total_global_taxe_tbs': total_global_taxe_tbs,
        'total_global_base_taxable': total_global_base_taxable,
        'total_global_taxes': total_global_taxes,
        'total_global_net_a_payer': total_global_net_a_payer,
        'nombre_pages': nombre_pages,
        'beneficiaire': beneficiaire,
        'currency_code': currency_code
    }
    pdf = render_pdf('courriers/borderau_validation.html', contexte)

    return pdf

    # #AFFICHER DIRECTEMENT
    # return HttpResponse(File(pdf), content_type='application/pdf')

def borderau_ordonnancement_rd_pdf(request, liste_sinistre, adherent_principal, bordereau_ordonnancement):
    from itertools import groupby

    pprint("adherent_principal à payer")
    pprint(adherent_principal)

    # Regrouper les sinistres par compagnie
    sinistres_par_compagnie = {}
    for compagnie, sinistres_groupe in groupby(liste_sinistre, key=lambda x: x.compagnie):
        sinistres_par_compagnie[compagnie] = list(sinistres_groupe)

    # Calculer les totaux pour chaque compagnie
    resultats = []
    for compagnie, sinistres in sinistres_par_compagnie.items():
        total_nombre_sinistres = len(sinistres)

        total_frais_reel = sum(s.total_frais_reel for s in sinistres)
        total_part_assure = sum((0 if s.tm_prefinanced else s.total_part_assure) for s in sinistres) #identique a total_part_beneficiare

        total_base_remboursement = sum((s.total_frais_reel if s.tm_prefinanced else s.total_part_compagnie) or 0 for s in sinistres)
        total_rejete = sum(s.montant_remb_refuse or 0 for s in sinistres)
        total_accepte = sum(s.montant_remb_accepte or 0 for s in sinistres)

        total_base_taxable = total_accepte

        # total_base_taxable = sum(s.base_taxable or 0 for s in sinistres)
        total_taxe_far = sum(s.montant_taxe_far or 0 for s in sinistres)
        total_taxe_tbs = sum(s.montant_taxe_tbs or 0 for s in sinistres)
        total_taxes = int(total_taxe_tbs) + int(total_taxe_far)
        total_net_a_payer = total_base_taxable + total_taxes


        # Ajouter les résultats pour cette compagnie à la liste de résultats
        resultats.append({
            'adherent_principal': adherent_principal,
            'compagnie': compagnie.nom,
            'total_nombre_sinistres': total_nombre_sinistres,
            'total_part_assure': total_part_assure,
            #'total_part_compagnie': total_part_compagnie,
            #'total_part_beneficiare': total_part_assure,
            'total_frais_reel': total_frais_reel,
            'total_rejete': total_rejete,
            'total_base_remboursement': float(total_base_remboursement),
            'total_base_taxable': total_base_taxable,
            'total_taxe_far': total_taxe_far,
            'total_taxe_tbs': total_taxe_tbs,
            'total_taxes': total_taxes,
            'total_net_a_payer': total_net_a_payer,
            'sinistres': sinistres,
        })

    # Calcul des totaux globaux
    total_global_nombre_sinistres = sum(resultat['total_nombre_sinistres'] for resultat in resultats)
    total_global_part_assure = sum(resultat['total_part_assure'] for resultat in resultats)
    #total_global_part_compagnie = sum(resultat['total_part_compagnie'] for resultat in resultats)
    #total_global_part_beneficiare = sum(resultat['total_part_beneficiare'] for resultat in resultats)
    total_global_frais_reel = sum(resultat['total_frais_reel'] for resultat in resultats)
    total_global_rejete = sum(resultat['total_rejete'] for resultat in resultats)
    total_global_base_remboursement = sum(resultat['total_base_remboursement'] for resultat in resultats)
    total_global_base_taxable = sum(resultat['total_base_taxable'] for resultat in resultats)
    total_global_taxe_tbs = sum(resultat['total_taxe_tbs'] for resultat in resultats)
    total_global_taxe_far = sum(resultat['total_taxe_far'] for resultat in resultats)
    total_global_taxes = total_global_taxe_far + total_global_taxe_tbs
    total_global_net_a_payer = sum(resultat['total_net_a_payer'] for resultat in resultats)
    #
    currency_code = request.user.bureau.pays.devise.code

    pdf = render_pdf('courriers/borderau_ordonnancement_rd.html', {'sinistres_groupes': resultats, 'adherent_principal': adherent_principal, 'resultats': resultats, 'currency_code': currency_code})

    pdf_file = PyPDF2.PdfReader(pdf)
    nombre_pages = len(pdf_file.pages)

    contexte = {
        'resultats': resultats,
        'total_global_nombre_sinistres': total_global_nombre_sinistres,
        'total_global_part_assure': total_global_part_assure,
        'total_global_frais_reel': total_global_frais_reel,
        'total_global_rejete': total_global_rejete,
        'total_global_base_remboursement': total_global_base_remboursement,
        'total_global_base_taxable': total_global_base_taxable,
        'total_global_taxe_tbs': total_global_taxe_tbs,
        'total_global_taxes': total_global_taxes,
        'total_global_net_a_payer': total_global_net_a_payer,
        'nombre_pages': nombre_pages,
        'adherent_principal': adherent_principal,
        'currency_code': currency_code,
        'bordereau_ordonnancement': bordereau_ordonnancement
    }
    pdf = render_pdf('courriers/borderau_ordonnancement_rd.html', contexte)

    return pdf


def borderau_ordonnancement_rd_assure_pdf(request, liste_sinistre, assure, bordereau_ordonnancement):
    from itertools import groupby

    pprint("assure à payer")
    pprint(assure)

    # Regrouper les sinistres par compagnie
    sinistres_par_adherent = defaultdict(list)
    for sinistre in liste_sinistre:
        adherent_id = sinistre.adherent_principal.id
        sinistres_par_adherent[adherent_id].append(sinistre)

    # for compagnie, sinistres_groupe in groupby(liste_sinistre, key=lambda x: x.compagnie):
    #     sinistres_par_compagnie[compagnie] = list(sinistres_groupe)

    # Calculer les totaux pour chaque compagnie
    resultats = []
    for adherent_id, sinistres in sinistres_par_adherent.items():
        total_nombre_sinistres = len(sinistres)

        total_frais_reel = sum(s.total_frais_reel for s in sinistres)
        total_part_assure = sum((0 if s.tm_prefinanced else s.total_part_assure) for s in sinistres) #identique a total_part_beneficiare

        total_base_remboursement = sum((s.total_frais_reel if s.tm_prefinanced else s.total_part_compagnie) or 0 for s in sinistres)
        total_rejete = sum(s.montant_remb_refuse or 0 for s in sinistres)
        total_accepte = sum(s.montant_remb_accepte or 0 for s in sinistres)

        total_base_taxable = total_accepte

        # total_base_taxable = sum(s.base_taxable or 0 for s in sinistres)
        total_taxe_far = sum(s.montant_taxe_far or 0 for s in sinistres)
        total_taxe_tbs = sum(s.montant_taxe_tbs or 0 for s in sinistres)
        total_taxes = int(total_taxe_tbs) + int(total_taxe_far)
        total_net_a_payer = total_base_taxable + total_taxes


        # Ajouter les résultats pour cette compagnie à la liste de résultats
        resultats.append({
            'assure': assure,
            "adherent": sinistres[0].adherent_principal.nom_prenoms,
            'total_nombre_sinistres': total_nombre_sinistres,
            'total_part_assure': total_part_assure,
            #'total_part_compagnie': total_part_compagnie,
            #'total_part_beneficiare': total_part_assure,
            'total_frais_reel': total_frais_reel,
            'total_rejete': total_rejete,
            'total_base_remboursement': float(total_base_remboursement),
            'total_base_taxable': total_base_taxable,
            'total_taxe_far': total_taxe_far,
            'total_taxe_tbs': total_taxe_tbs,
            'total_taxes': total_taxes,
            'total_net_a_payer': total_net_a_payer,
            'sinistres': sinistres,
        })

    # Calcul des totaux globaux
    total_global_nombre_sinistres = sum(resultat['total_nombre_sinistres'] for resultat in resultats)
    total_global_part_assure = sum(resultat['total_part_assure'] for resultat in resultats)
    #total_global_part_compagnie = sum(resultat['total_part_compagnie'] for resultat in resultats)
    #total_global_part_beneficiare = sum(resultat['total_part_beneficiare'] for resultat in resultats)
    total_global_frais_reel = sum(resultat['total_frais_reel'] for resultat in resultats)
    total_global_rejete = sum(resultat['total_rejete'] for resultat in resultats)
    total_global_base_remboursement = sum(resultat['total_base_remboursement'] for resultat in resultats)
    total_global_base_taxable = sum(resultat['total_base_taxable'] for resultat in resultats)
    total_global_taxe_tbs = sum(resultat['total_taxe_tbs'] for resultat in resultats)
    total_global_taxe_far = sum(resultat['total_taxe_far'] for resultat in resultats)
    total_global_taxes = total_global_taxe_far + total_global_taxe_tbs
    total_global_net_a_payer = sum(resultat['total_net_a_payer'] for resultat in resultats)
    #
    currency_code = request.user.bureau.pays.devise.code

    pdf = render_pdf('courriers/borderau_ordonnancement_rd_assure.html', {'sinistres_groupes': resultats, 'assure': assure, 'resultats': resultats, 'currency_code': currency_code})

    pdf_file = PyPDF2.PdfReader(pdf)
    nombre_pages = len(pdf_file.pages)

    contexte = {
        'resultats': resultats,
        'total_global_nombre_sinistres': total_global_nombre_sinistres,
        'total_global_part_assure': total_global_part_assure,
        'total_global_frais_reel': total_global_frais_reel,
        'total_global_rejete': total_global_rejete,
        'total_global_base_remboursement': total_global_base_remboursement,
        'total_global_base_taxable': total_global_base_taxable,
        'total_global_taxe_tbs': total_global_taxe_tbs,
        'total_global_taxes': total_global_taxes,
        'total_global_net_a_payer': total_global_net_a_payer,
        'nombre_pages': nombre_pages,
        'assure': assure,
        'currency_code': currency_code,
        'bordereau_ordonnancement': bordereau_ordonnancement
    }
    pdf = render_pdf('courriers/borderau_ordonnancement_rd_assure.html', contexte)

    return pdf


def uploaded_file_url(file):
    # Simulation de l'upload du fichier sur le serveur
    fs = FileSystemStorage()
    file_path = fs.save(file.name, file)
    return fs.url(file_path)


def popup_rejet_ordonnancement_sinistre(request, sinistre_id):
    sinistre = Sinistre.objects.get(id=sinistre_id)

    return render(request, 'modal_rejet_ordonnancement_sinistre.html',
                  {'sinistre': sinistre})



def verif_background_requete_excel(request):
    task_id = request.session.get('task_id',None)
    task_event = request.POST.get('task_event', None)
    print(task_id)

    if task_id:
        try:
            task = BackgroundQueryTask.objects.get(id=task_id)
            if task_event:
                task.status = "ENCOURS"
                task.save()
            else:
                task.delete()

            return JsonResponse({
                "status": "OK",
                "task_id": task_id
            }, status=200)
        except BackgroundQueryTask.DoesNotExist:
            return JsonResponse({
                "status": "KO",
                "task_id": task_id
            }, status=404)

    return JsonResponse({
        "status": "KO",
        "task_id": task_id
    }, status=404)





