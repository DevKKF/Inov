
from django.urls import path

from shared import veos
from shared.helpers import openai_complete
from . import views
from .views import PrestatairesView, DetailsPrestatairesView, GroupePermissionsView, TarifsView, ReseauxSoinsView, \
    DetailsReseauSoinView, WsBobyView, WsBobyCreateView, WsBobyEditeView, ActesView, ConnectedUsersView, BusinessUnitView, \
    brancheView, banquesView, affectionsView, ApporteurView, ApporteurinternationalView, CategorieView,ViewCourrier, CompagnieView, CarosseriesView



urlpatterns = [

    #path('generate_numero_famille_all/', views.generate_numero_famille_all, name='generate_numero_famille_all'),
    #path('generer_nombre_famille_du_mois_all/', views.generer_nombre_famille_du_mois_all, name='generer_nombre_famille_du_mois_all'),
    #path('create_mouvements_incorporation_aliments/', views.create_mouvements_incorporation_aliments, name='create_mouvements_incorporation_aliments'),
    #path('create_mouvements_sortie_aliments/', views.create_mouvements_sortie_aliments, name='create_mouvements_sortie_aliments'),
    path('recalculer_parts_sinistres_sucaf/', views.recalculer_parts_sinistres_sucaf, name='recalculer_parts_sinistres_sucaf'),
    path('corriger_param_produit_compagnie/', views.corriger_param_produit_compagnie, name='corriger_param_produit_compagnie'),
    path('update_matricule/', views.update_matricule, name='update_matricule'),

    #path('openai_complete/', openai_complete, name='openai_complete'),
    path('disponibilite_upd/', views.disponibilite_upd, name='disponibilite_upd'),
    path('set_bureau/', views.set_bureau, name='set_bureau'),
    path('reseausoin/', ReseauxSoinsView.as_view(), name='reseauxsoins'),
    path('reseauxsoins_datatable/', views.reseauxsoins_datatable, name='reseauxsoins_datatable'),
    path('add_reseau_soin/', views.add_reseau_soin, name='add_reseau_soin'),
    path('update_reseau_soin/<int:reseau_soin_id>', views.update_reseau_soin, name='update_reseau_soin'),
    path('popup_modifier_reseau_soin/<int:reseau_soin_id>', views.popup_modifier_reseau_soin, name='popup_modifier_reseau_soin'),
    path('reseausoin/<int:reseau_soin_id>', DetailsReseauSoinView.as_view(), name='detail_reseau_soin'),
    path('reseausoin/<int:reseau_soin_id>/prestataires', views.reseau_soin_prestataires_datatable, name='reseau_soin_prestataires_datatable'),
    path('reseausoin/<int:reseau_soin_id>/joindre_prestataires', views.popup_joindre_prestataires, name='popup_joindre_prestataires'),
    path('reseausoin/<int:reseau_soin_id>/joindre_prestataires_reseau/', views.joindre_prestataires_reseau, name='joindre_prestataires_reseau'),
    path('reseausoin/<int:reseau_soin_id>/joindre_prestataire_reseau/<int:prestataire_id>/', views.joindre_prestataire_reseau, name='joindre_prestataire_reseau'),
    path('reseausoin/<int:reseau_soin_id>/retirer_prestataire_reseau/<int:prestataire_id>/', views.retirer_prestataire_reseau, name='retirer_prestataire_reseau'),
    path('reseausoin/<int:reseau_soin_id>/prestataires_restants', views.reseau_soin_prestataires_restants_datatable, name='reseau_soin_prestataires_restants_datatable'),

    path('prestataire/', PrestatairesView.as_view(), name='prestataires'),
    path('prestataires_datatable/', views.prestataires_datatable, name='prestataires_datatable'),
    path('export_prestaitaires/', views.export_prestaitaires, name='export_prestaitaires'),
    path('tarif/', TarifsView.as_view(), name='tarif'),
    path('tarifs_datatable/', views.tarifs_datatable, name='tarifs_datatable'),
    path('popup_detail_tarif/<int:tarif_id>', views.popup_detail_tarif, name='popup_detail_tarif'),
    #
    path('generate_modele_tarifs_bureau/', views.generate_modele_tarifs_bureau, name='generate_modele_tarifs_bureau'),
    path('import_tarifs_bureau/', views.import_tarifs_bureau, name='import_tarifs_bureau'),
    #

    path('affection/', affectionsView.as_view(), name='affections'),
    #
    path('apporteur/', ApporteurView.as_view(), name='apporteurs'),
    path('apporteur/ajouter', views.add_apporteur, name='add_apporteur'),
    path('apporteur/<int:apporteur_id>/modifier', views.modifier_apporteur, name='modifier_apporteur'),
    path('apporteur/delete/<int:apporteur_id>/', views.supprimer_apporteur, name='supprimer_apporteur'),
    #
    path('apporteurinternational/', ApporteurinternationalView.as_view(), name='apporteurinternational'),
    #
    path('categorieaffection/', CategorieView.as_view(), name='categorieaffections'),
    #
    path('businessunit/', BusinessUnitView.as_view(), name='business_unit'),
    path('businessunit/ajouter', views.add_businessunit, name='add_businessunit'),
    path('businessunit/<int:businessunit_id>/modifier', views.modifier_businessunit, name='modifier_businessunit'),
    path('businessunit/delete/<int:businessunit_id>/', views.supprimer_businessunit, name='supprimer_businessunit'),

    #
    path('branche/',brancheView.as_view(), name='branche'),
    path('branche/ajouter', views.add_branche, name='add_branche'),
    path('branche/<int:branche_id>/modifier', views.modifier_branche, name='modifier_branche'),
    path('branche/delete/<int:branche_id>/', views.supprimer_branche, name='supprimer_branche'),
    #
    path('banque/',banquesView.as_view(),name='banques'),
    path('banque/ajouter', views.add_banque, name='add_banque'),
    path('banque/<int:banque_id>/modifier', views.modifier_banque, name='modifier_banque'),
    path('banque/delete/<int:banque_id>/', views.supprimer_banque, name='supprimer_banque'),
    #
    path('carosserie/',CarosseriesView.as_view(),name='carosseries'),
    path('carosserie/ajouter', views.add_carosserie, name='add_carosserie'),
    path('carosserie/<int:carosserie_id>/modifier', views.modifier_carosserie, name='modifier_carosserie'),
    path('carosserie/delete/<int:carosserie_id>/', views.supprimer_carosserie, name='supprimer_carosserie'),

    # path('devise/', DeviseView.as_view(), name='devises'),
    #
    path('courriers/', ViewCourrier.as_view(), name='courrier'),
    path('courrier/add_courrier', views.add_courrier, name='add_courrier'),
    path('courrier/<int:courrier_id>/modifier_courrier', views.modifier_courrier, name='modifier_courrier'),
    path("courrier/delete", views.supprimer_courrier, name='supprimer_courrier'),
    #

    path('compagnie/', CompagnieView.as_view(), name='compagnie'),
    path('compagnie/add_compagnie', views.add_compagnie, name='add_compagnie'),
    path('compagnie/<int:compagnie_id>/modifier', views.modifier_compagnie, name='modifier_compagnie'),
    path('compagnie/delete/<int:compagnie_id>/', views.supprimer_compagnie, name='supprimer_compagnie'),

    path('acte/', ActesView.as_view(), name='acte'),
    path('actes_datatable/', views.actes_datatable, name='actes_datatable'),
    path('popup_detail_acte/<int:acte_id>', views.popup_detail_acte, name='popup_detail_acte'),
    path('add_acte/', views.add_acte, name='add_acte'),
    #
    path('acte/<int:acte_id>/add_acte_tarif', views.add_acte_tarif, name='add_acte_tarif'),
    path('acte/<int:acte_id>/desactiver_tarif_acte/<int:tarif_id>', views.desactiver_tarif_acte, name='desactiver_tarif_acte'),
   #
    path('update_acte/<int:acte_id>', views.update_acte, name='update_acte'),
    path('popup_modifier_acte/<int:acte_id>', views.popup_modifier_acte, name='popup_modifier_acte'),
    #
    path('add_prestataire/', views.add_prestataire, name='add_prestataire'),
    path('update_prestataire/<int:prestataire_id>', views.update_prestataire, name='update_prestataire'),
    path('popup_modifier_prestataire/<int:prestataire_id>', views.popup_modifier_prestataire, name='popup_modifier_prestataire'),
    path('prestataire/<int:prestataire_id>', DetailsPrestatairesView.as_view(), name='detail_prestataire'),
    #
    path('prestataire/<int:prestataire_id>/prescripteurs', views.prescripteurs_prestataires_datatable, name='prescripteurs_prestataires_datatable'),
    path('update_prescripteur/<int:prescripteur_id>', views.update_prescripteur, name='update_prescripteur'),
    path('popup_modifier_prescripteur/<int:prescripteur_id>', views.popup_modifier_prescripteur, name='popup_modifier_prescripteur'),
    path('prestataire/<int:prestataire_id>/retirer_prescripteur_prestataire/<int:prescripteur_id>/', views.retirer_prescripteur_prestataire, name='retirer_prescripteur_prestataire'),
    #
    path('add_reseau_soin_prestataire/<int:prestataire_id>', views.add_reseau_soin_prestataire, name='add_reseau_soin_prestataire'),
    path('retirer_reseau_soin_prestataire/<int:prs_id>', views.retirer_reseau_soin_prestataire, name='retirer_reseau_soin_prestataire'),
    path('add_prescripteur/', views.add_prescripteur, name='add_prescripteur'),
    path('import_prescripteurs/<int:prestataire_id>', views.import_prescripteurs, name='import_prescripteurs'),
    path('prescripteurs_by_prestataire/<int:prestataire_id>', views.prescripteurs_by_prestataire, name='prescripteurs_by_prestataire'),
    path('groupes_permissions/<int:groupe_id>', GroupePermissionsView.as_view(), name='groupes_permissions'),
    path('clearcache/', views.clear_cache, name='clear_cache'),
    path('import_compagnie_veos/', veos.import_compagnie_manuellement, name='import_compagnie_veos'),
    path('import_client_veos/', veos.import_client_manuellement, name='import_client_veos'),
    path('import_police_veos/', veos.import_police_manuellement, name='import_police_veos'),
    path('import_formule_veos/', veos.import_formule_manuellement, name='import_formule_veos'),
    path('import_sinistre_veos/', veos.import_sinistre_manuellement, name='import_sinistre_veos'),
    path('import_aliment_veos/', veos.import_aliments_manuellement, name='import_aliment_veos'),
    path('import_prestataire_veos/', veos.import_prestataires_manuellement, name='import_prestataire_veos'),
    path('import_prescripteur_veos/', veos.import_prescripteurs_manuellement, name='import_prescripteur_veos'),
    path('import_utilisateur_veos/', veos.import_utilisateurs_manuellement, name='import_utilisateur_veos'),
    path('import_utilisateur_grh_veos/', veos.import_utilisateurs_grh_manuellement, name='import_utilisateur_grh_veos'),
    path('import_utilisateur_prestataire_veos/', veos.import_utilisateurs_prestataire_manuellement, name='import_utilisateur_prestataire_veos'),
    path('import_quittance_veos/', veos.import_quittances_manuellement, name='import_quittances_veos'),
    path('import_apporteur_veos/', veos.import_apporteurs_manuellement, name='import_apporteur_veos'),
    path('import_apporteur_veos_sans_contrat/', veos.import_apporteurs_manuellement_sans_contrat, name='import_apporteur_veos_sans_contrat'),
    path('updt_mvquittances/', veos.updt_mvquittances, name='updt_mvquittances'),
    path('import_periode_veos/', veos.import_periode_veos_manuellement, name='import_periode_veos'),


    path('generate_modele_tarifs_excel/<int:prestataire_id>', views.generate_modele_tarifs_excel, name='generate_modele_tarifs_excel'),
    path('import_tarif_pestataire/<int:prestataire_id>', views.import_tarif_pestataire, name='import_tarif_pestataire'),
    path('tarifs_prestataire_datatable/<int:prestataire_id>', views.tarifs_prestataire_datatable, name='tarifs_prestataire_datatable'),
    path('change_prestataire_status/<int:prestataire_id>', views.change_prestataire_status, name='change_prestataire_status'),

    path('ws_bobys/', WsBobyView.as_view(), name='ws_bobys'),
    path('ws_boby_datatable/', views.ws_boby_datatable, name='ws_boby_datatable'),

    path('ws_bobys/new/', WsBobyCreateView.as_view(), name='ws_boby_create'),
    path('ws_bobys/<int:ws_boby_id>/edite/', WsBobyEditeView.as_view(), name='ws_boby_edite'),
    
    path('verify-code/', views.verify_code, name='verify_code'),

    #
    path('download-background-query-result/<int:query_id>', views.download_background_query_result, name='download_background_query_result'),

    path('connectedusers/', ConnectedUsersView.as_view(), name='connectedusers'),
    path('logoutuser/<int:user_id>', views.logout_user, name='logoutuser'),

    path('db-super-admin-query/', views.DbSuperAdminQueryView.as_view(), name='db_super_admin_query'),

]
