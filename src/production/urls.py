
from django.urls import path

from . import views
from .views import ClientsView, ExcelFileView, FormulesUniversellesView, FormulesView, DetailsFormuleView, \
    DetailsClientView, PoliceClientView, ContactClientView, FilialeClientView, AcompteClientView, GEDClientView, QuittancesClientView, \
    PoliceBeneficiairesView, PoliceGedView, PoliceAvenantsView, PoliceTarifsSpecifiquesView, PoliceQuittancesView, \
    PoliceSinistresView, PhotosBeneficiairesView, AnnulerQuittanceView, CourrierView

urlpatterns = [
    path("todo_manuel/", views.todo_manuel, name='todo_manuel'),
    path('apporteurs/ajax_apporteurs', views.ajax_apporteurs, name='ajax_apporteurs'),
    path("compagnie/ajax_infos_compagnie/<int:compagnie_id>/<int:produit_id>/", views.ajax_infos_compagnie, name='ajax_infos_compagnie'),
    path("ajax_produits/<int:branche_id>/", views.ajax_produits, name='ajax_produits'),
    path("actes_by_rubrique/<int:rubrique_id>/", views.actes_by_rubrique, name='actes_by_rubrique'),
    path("sous_rubriques_by_rubrique/<int:rubrique_id>/", views.sous_rubriques_by_rubrique, name='sous_rubriques_by_rubrique'),
    path("regroupements_actes_by_rubrique/<int:rubrique_id>/", views.regroupements_actes_by_rubrique, name='regroupements_actes_by_rubrique'),
    path("sous_regroupements_actes_by_rubrique/<int:rubrique_id>/", views.sous_regroupements_actes_by_rubrique, name='sous_regroupements_actes_by_rubrique'),
    path("actes_by_regroupement_acte/<int:regroupement_acte_id>/", views.actes_by_regroupement_acte, name='actes_by_regroupement_acte'),
    path("formules_by_police/<int:police_id>/", views.formules_by_police, name='formules_by_police'),
    path("polices_restantes/<int:police_id>/", views.polices_restantes, name='polices_restantes'),

    path('client/', ClientsView.as_view(), name='clients'),
    path('clients_datatable/', views.clients_datatable, name='clients_datatable'),
    path("client/add_client", views.add_client, name='add_client'),
    path('client/<int:client_id>/modifier', views.modifier_client, name='modifier_client'),
    path('client/<int:client_id>', DetailsClientView.as_view(), name='client_details'),
    path("client/delete", views.supprimer_client, name='supprimer_client'),

    path("client/<int:client_id>/liste-police", PoliceClientView.as_view(), name='client_polices'),
    path("client/<int:client_id>/polices", views.list_polices, name='client_list_polices'),
    path("client/<int:client_id>/add_police", views.add_police, name='add_police'),
    path('import-excel-aliments/', views.import_excel_aliments, name='import_excel_aliments'),
    path('import-formulaire-aliments/', views.import_formulaire_aliments, name='import_formulaire_aliments'),
    path('get_garanties_by_produit/', views.get_garanties_by_produit, name='get_garanties_by_produit'),
    path('get_garanties_by_formule/', views.get_garanties_by_formule, name='get_garanties_by_formule'),
    path('get_garanties_by_formule_modification/', views.get_garanties_by_formule_modification, name='get_garanties_by_formule_modification'),
    path('supprimer_aliment/<int:index>/', views.supprimer_aliment, name='supprimer_aliment'),
    path('clear_session/', views.clear_session, name='clear_session'),
    path('get_compagnies/', views.get_compagnies, name='get_compagnies'),
    path('branche/<int:branche_id>/produits',views.produits_by_branche, name='branche_produits'),

    path("client/<int:client_id>/liste-contact", ContactClientView.as_view(), name='client_contacts'),
    path("client/<int:client_id>/contact/add", views.add_contact, name='client_add_contact'),
    path("contact/<int:contact_id>/modifier", views.modifier_contact, name='modifier_contact'),
    path("contact/delete", views.supprimer_contact, name='supprimer_contact'),

    path("client/<int:client_id>/liste-filiale", FilialeClientView.as_view(), name='client_filiales'),
    path("client/<int:client_id>/filiale/add", views.add_filiale, name='client_add_filiale'),
    path("filiale/<int:filiale_id>/modifier", views.modifier_filiale, name='modifier_filiale'),
    path("filiale/delete", views.supprimer_filiale, name='supprimer_filiale'),

    path("client/<int:client_id>/liste-documents", GEDClientView.as_view(), name='client_documents'),
    path("client/<int:client_id>/document/add", views.add_document, name='client_add_document'),
    path("document/<int:document_id>/modifier", views.modifier_document, name='modifier_document'),
    path("document/delete", views.supprimer_document, name='supprimer_document'),

    path("client/<int:client_id>/liste-acompte", AcompteClientView.as_view(), name='client_acomptes'),
    path("client/<int:client_id>/acompte/add", views.add_acompte, name='client_add_acompte'),
    path("acompte/<int:acompte_id>/modifier", views.modifier_acompte, name='modifier_acompte'),
    path("acompte/delete", views.supprimer_acompte, name='supprimer_acompte'),
    path('mouvement/<int:mouvement_id>/motifs',views.motifs_by_mouvement, name='mouvement_motifs'),

    path("client/<int:client_id>/quittance", QuittancesClientView.as_view(), name='client_quittances'),
    path("client/<int:client_id>/exporter-quittance", views.exporter_quittance, name='exporter_quittance'),

    path('client/<int:client_id>/changement_compagnie',views.changement_compagnie, name='changement_compagnie'),
    path('client/<int:client_id>/transfert_beneficiaires_datatable', views.transfert_beneficiaires_datatable, name='transfert_beneficiaires_datatable'),
    path('client/<int:client_id>/transfert_beneficiaires', views.transfert_beneficiaires, name='transfert_beneficiaires'),
    # path('police/<int:police_id>/details',views.details_police,name='police.details'),
    path('police/<int:police_id>/details', views.DetailsPoliceView.as_view(), name='police.details'),
    path('police/<int:police_id>/historique-details', views.DetailsHistoriquePoliceView.as_view(), name='police.historique.details'),
    path('police/<int:police_id>/quittances', PoliceQuittancesView.as_view(), name='police_quittances'),
    path('police/<int:police_id>/add_quittance', views.add_quittance, name='add_quittance'),
    path('quittance/<int:quittance_id>/police/<int:police_id>/add_document', views.add_document_to_quittance, name='add_document_to_quittance'),
    #
    path('police/<int:police_id>/add_reglement', views.add_reglement, name='add_reglement'),
    path('police/<int:police_id>/add_lettrage', views.add_lettrage, name='add_lettrage'),
    path('quittance/<int:quittance_id>', views.details_quittance, name='details_quittance'),
    path('police/<int:police_id>/avenants', PoliceAvenantsView.as_view(), name='police_avenants'),
    path('police/<int:police_id>/add_avenant', views.add_avenant, name='add_avenant'),
    path('police/<int:police_id>/tarifs_specifiques', PoliceTarifsSpecifiquesView.as_view(), name='police_tarifs_specifiques'),
    path('police/<int:police_id>/add_tarif_specifique', views.add_tarif_specifique, name='add_tarif_specifique'),
    path('del_tarif_specifique', views.del_tarif_specifique, name='del_tarif_specifique'),
    path('police/<int:police_id>/ged', PoliceGedView.as_view(), name='police_ged'),
    path('police/<int:police_id>/add_document', views.police_add_document, name='police_add_document'),


    path('police/<int:police_id>/beneficiaires', PoliceBeneficiairesView.as_view(), name='police_beneficiaires'),
    path('police/<int:police_id>/beneficiaires_datatable', views.police_beneficiaires_datatable, name='police_beneficiaires_datatable'),
    path('police/<int:police_id>/beneficiaires/<int:aliment_id>/', PoliceBeneficiairesView.as_view(), name='auto_open_beneficiaire'),
    path('police/<int:police_id>/export_beneficiaires', views.export_beneficiaires, name='export_beneficiaires'),
    path('police/<int:police_id>/export_sinistres_beneficiaire/<int:aliment_id>', views.export_sinistres_beneficiaire, name='export_sinistres_beneficiaire'),
    path('police/<int:police_id>/export_sinistres_famille/<int:aliment_id>', views.export_sinistres_famille, name='export_sinistres_famille'),
    path('police/<int:police_id>/export_sinistres_police', views.export_sinistres_police, name='export_sinistres_police'),
    #
    path('police/<int:police_id>/details_beneficiaire/<int:aliment_id>/add_membre_famille_beneficiaire', views.police_add_membre_famille_beneficiaire, name='add_membre_famille_beneficiaire'),

    path('police/<int:police_id>/importation_beneficiaire_from_ancienne_police', views.importation_beneficiaire_from_ancienne_police, name='importation_beneficiaire_from_ancienne_police'),
    path('police/get_formules/<int:police_id>/', views.get_formules, name='get_formules'),
    
    path('police/<int:police_id>/import_beneficiaires', views.import_beneficiaires, name='import_beneficiaires'),
    path('police/<int:police_id>/verifier_beneficiaires', views.verifier_beneficiaires, name='verifier_beneficiaires'),
    path('police/<int:police_id>/add_beneficiaire', views.add_beneficiaire, name='add_beneficiaire'),
    path('police/<int:police_id>/update_beneficiaire/<int:aliment_id>', views.update_beneficiaire, name='update_beneficiaire'),
    path('police/<int:police_id>/details_beneficiaire/<int:aliment_id>', views.details_beneficiaire, name='details_beneficiaire'),
    path('police/<int:police_id>/vehicules', views.police_vehicules, name='police_vehicules'),
    path('police/<int:police_id>/add_vehicule', views.add_vehicule, name='add_vehicule'),
    path('police/<int:police_id>/update_vehicule/<int:aliment_police_id>', views.update_vehicule, name='update_vehicule'),
    path('police/<int:police_id>/details_vehicule/<int:aliment_police_id>', views.details_vehicule, name='details_vehicule'),
    path('police/<int:vehicule_id>/details_historique_vehicule/<int:historique_id>', views.details_historique_vehicule, name='details_historique_vehicule'),
    path('police/<int:police_id>/import_vehicules', views.import_vehicules, name='import_vehicules'),
    path("police/<int:police_id>/supprimer_vehicule/<int:vehicule_id>", views.supprimer_vehicule, name='supprimer_vehicule'),
    path('police/<int:police_id>/marchandises', views.police_marchandises, name='police_marchandises'),
    path('police/<int:police_id>/add_marchandise', views.add_marchandise, name='add_marchandise'),
    path('police/<int:police_id>/details_marchandise/<int:marchandise_id>', views.details_marchandise, name='details_marchandise'),
    path('police/<int:police_id>/update_marchandise/<int:marchandise_id>', views.update_marchandise, name='update_marchandise'),
    path("police/<int:police_id>/supprimer_marchandise/<int:marchandise_id>", views.supprimer_marchandise, name='supprimer_marchandise'),
    path('police/<int:police_id>/prime_famille', views.prime_famille, name='prime_famille'),
    path('police/<int:police_id>/modifier', views.modifier_police, name='modifier_police'),
    path('police/<int:police_id>/beneficiaires/photos', PhotosBeneficiairesView.as_view(), name='photos_beneficiaires'),
    path('upload_photo/<int:beneficiaire_id>/', views.upload_photo, name='upload_photo'),
    path('police/<int:police_id>/<int:aliment_id>/upload_benef_picture', views.upload_benef_picture, name='upload_benef_picture'),
    path('police/<int:police_id>/sinistres', PoliceSinistresView.as_view(), name='police_sinistres'),
    path('police/<int:police_id>/sinistres_datatable', views.police_sinistres_datatable, name='police_sinistres_datatable'),

    path('police/<int:police_id>/courriers', CourrierView.as_view(), name='police_courrier'),
    path('police/<int:police_id>/courrier/<int:courrier_id>/pdf/', views.generer_courrier, name='generer_pdf'),
    path('police/<int:police_id>/courrier/<int:courrier_id>/word/', views.generer_word, name='generer_word'),

    # path('generate-word/', generate_word, name='generate_word'),

    path('formules_universelles', FormulesUniversellesView.as_view(), name='formules_universelles'),
    path('police/<int:police_id>/formules', FormulesView.as_view(), name='police_formules'),
    path('police/add_formule_universelle', views.add_formule_universelle, name='add_formule_universelle'),
    path('police/<int:police_id>/add_formule', views.add_formule, name='add_formule'),
    path('formule/<int:formule_id>/modifier', views.modifier_formule, name='modifier_formule'),
    path('formule/<int:formule_id>/update_formule', views.modifier_formule, name='update_formule'),
    path('formule/desactivate_formule', views.desactivate_formule, name='desactivate_formule'),
    path('formule/<int:formule_id>', DetailsFormuleView.as_view(), name='details_formule'),
    path('formule/<int:formule_id>/add_bareme', views.add_bareme, name='add_bareme'),
    path('formule/del_bareme', views.del_bareme, name='del_bareme'),
    path('formule/detail_bareme/<int:bareme_id>', views.detail_bareme, name='detail_bareme'),


    path('aliment/<int:police_id>/change_formule/<int:aliment_id>', views.change_formule, name='change_formule'),
    path('aliment/<int:police_id>/suspension_beneficiaire/<int:aliment_id>', views.suspension_beneficiaire, name='suspension_beneficiaire'),
    path('aliment/<int:police_id>/remise_en_vigueur/<int:aliment_id>', views.remise_en_vigueur, name='remise_en_vigueur'),
    path('aliment/<int:police_id>/sortie_police/<int:aliment_id>', views.sortie_police, name='sortie_police'),
    path('aliment/<int:aliment_id>/add_carte', views.add_carte, name='add_carte'),
    path('aliment/<int:police_id>/imprimer_carte/<int:aliment_id>', views.imprimer_carte, name='imprimer_carte'),
    path('aliment/<int:police_id>/imprimer_cartes', views.imprimer_cartes, name='imprimer_cartes'),
    path('aliment/<int:police_id>/imprimer_cartes_new', views.imprimer_cartes_new, name='imprimer_cartes_new'),
    path('aliment/<int:aliment_id>/aliment_add_document', views.aliment_add_document, name='aliment_add_document'),

    path('download/<str:filename>', views.download, name='download'),

    # test panda excel
    path('text-excel-file/', ExcelFileView.as_view()),

    # generation de qrcode en base pour tous les cartes
    path('generate-qrcode-carte/', views.generate_qrcode, name='generate_qrcode_carte'),

    # generate carte beneficiaire
    path('carte-pdf/', views.beneficiaire_carte_pdf, name='beneficiaire_carte_pdf'),
    path('carte-html/', views.beneficiaire_carte_html, name='beneficiaire_carte_html'),

    # PROSPECTS VIEWS GRH
    path('prospects/', views.ProspectsGrhView.as_view(), name='prospects'),
    path('prospects/export_prospect/', views.export_prospect, name='export_prospect'),

    path('prospect_grh_datatable/', views.prospect_grh_datatable, name='prospect_grh_datatable'),
    # path('update_prospect/<int:prospect_id>', views.update_prospect,name='update_prospect'),
    path('details_prospect/<int:aliment_grh_id>', views.details_prospect,name='details_prospect'),
    path('submit_prospect/<int:aliment_grh_id>/<int:police_id>', views.submit_prospect, name='submit_prospect'),
    path('rejet_prospect/<int:aliment_grh_id>', views.rejet_prospect, name='rejet_prospect'),

    #
    path('annuler_quittance/', AnnulerQuittanceView.as_view(), name='annuler_quittance'),
    path('add_annuler_quittance/', views.add_annuler_quittance, name='add_annuler_quittance'),
]



