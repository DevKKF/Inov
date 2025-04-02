
from django.urls import path

from comptabilite.views import BordereauxOrdonnancesView, BordereauxPayesView, detail_bordereau_ordonnancement_datatable
from . import views
from .views import DossierSinistresView, \
    DetailsDossierSinistreView, DossierSinistresTraitesView, DossiersSinistresPhysiquesGestionnairesView, \
    SaisieSinistreView, AnnulerBordereauOrdonnancementView, EntentesPrealablesView

urlpatterns = [

    path('dossiersinistre/', DossierSinistresView.as_view(), name='dossiersinistre'),
    path('dossiersinistre_datatable/', views.dossiersinistre_datatable, name='dossiersinistre_datatable'),

    path('ententes_prealables/', EntentesPrealablesView.as_view(), name='ententes_prealables'),
    path('ententes_prealables_datatable/', views.dossiersinistre_datatable, name='ententes_prealables_datatable'),

    path('dossierstraites/', DossierSinistresTraitesView.as_view(), name='dossierstraites'),
    path('dossiersinistre_traites_datatable/', views.dossiersinistre_traites_datatable, name='dossiersinistre_traites_datatable'),










    path('saisie_sinistre/', SaisieSinistreView.as_view(), name='saisie_sinistre'),
    path('recherche_client_police/', views.recherche_client_police, name='recherche_client_police'),
    path('recuperer_information_police/', views.recuperer_information_police, name='recuperer_information_police'),
    path('recuperer_intervenant_police/', views.recuperer_intervenant_police, name='recuperer_intervenant_police'),
    path('get_intervenants_session/', views.get_intervenants_session, name='get_intervenants_session'),















    path('liste_prestations/', DossiersSinistresPhysiquesGestionnairesView.as_view(), name='liste_prestations'),
    path('dossiersinistre_physique_gestionnaire_datatable/', views.dossiersinistre_physique_gestionnaire_datatable, name='dossiersinistre_physique_gestionnaire_datatable'),
    path('change_dossier_closing_status/<int:dossier_sinistre_id>', views.change_dossier_closing_status, name='change_dossier_closing_status'),
    path('annuler_bordereau_ordonnancement/', AnnulerBordereauOrdonnancementView.as_view(), name='annuler_bordereau_ordonnancement'),
    path('dossier_sinistre/<int:sinistre_id>', DetailsDossierSinistreView.as_view(), name='details_dossier_sinistre'),
    path('sinistre/<int:sinistre_id>', views.popup_details_sinistre, name='popup_details_sinistre'),
    path('seance/<int:sinistre_id>', views.popup_seance_done, name='popup_seance_done'),
    path('medicament/<int:sinistre_id>', views.popup_modifier_sinistre_medicament, name='popup_modifier_sinistre_medicament'),
    path('delete_sinistre_medicament/<int:sinistre_id>', views.delete_sinistre_medicament, name='delete_sinistre_medicament'),
    path('statuer_acte/', views.statuer_acte, name='statuer_acte'),
    path('approuver_liste_acte', views.approuver_liste_acte, name='approuver_liste_acte'),
    path('rejeter_liste_acte/', views.rejeter_liste_acte, name='rejeter_liste_acte'),
    path('update_date_sortie_sinistre/', views.update_date_sortie_sinistre, name='update_date_sortie_sinistre'),
    path('update_date_sortie_nb_jour/', views.update_date_sortie_nb_jour, name='update_date_sortie_nb_jour'),
    path('update_nombre_accorde_sinistre/', views.update_nombre_accorde_sinistre, name='update_nombre_accorde_sinistre'),

    path('demande_prorogation/<int:sinistre_id>', views.demande_prorogation, name='demande_prorogation'),
    path('approuver_prorogation', views.approuver_prorogation, name='approuver_prorogation'),
    path('rejeter_prorogation', views.rejeter_prorogation, name='rejeter_prorogation'),

    path('dossier_sinistre/<int:dossier_sinistre_id>/add_document',views.dossier_sinistre_add_document,name='dossier_sinistre_add_document'),
    path("dossier_sinistre_document/delete", views.supprimer_document, name='supprimer_document'),

    path('bordereaux_ordonnances/', BordereauxOrdonnancesView.as_view(), name='bordereaux_ordonnances'),
    path('bordereaux_payes/', BordereauxPayesView.as_view(), name='bordereaux_payes'), #a modifier
    #path('bordereau_ordonnancement_paye_datatable/', views.bordereau_ordonnancement_paye_datatable, name='bordereau_ordonnancement_paye_datatable'),
    #path('bordereau_ordonnancement_datatable/', views.bordereau_ordonnancement_datatable, name='bordereau_ordonnancement_datatable'),
    path('bordereau_ordonnancement_datatable/<int:bordereau_id>', detail_bordereau_ordonnancement_datatable, name='bordereau_ordonnancement_detail_datatable'),

    path('generation-br-ordonnancement/<int:sinistre_id>', views.popup_rejet_ordonnancement_sinistre, name='popup_rejet_ordonnancement_sinistre'),

    path('accepter_remboursement/<int:sinistre_id>', views.accepter_remboursement, name='accepter_remboursement'),
    path('refuser_remboursement/<int:sinistre_id>', views.refuser_remboursement, name='refuser_remboursement'),

    path('traiter_liste_remboursement', views.traiter_liste_remboursement, name='traiter_liste_remboursement'),
    path('refuser_liste_remboursement', views.refuser_liste_remboursement, name='refuser_liste_remboursement'),

    path('verif-background-requete-excel/', views.verif_background_requete_excel, name='verif_background_execution_requete_excel'),
]


