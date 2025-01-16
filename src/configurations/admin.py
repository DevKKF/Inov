from pprint import pprint

import pandas as pd
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Permission
from django_json_widget.widgets import JSONEditorWidget
from import_export.admin import ImportExportModelAdmin
from django import forms
from admin_custom.admin import custom_admin_site
from configurations.forms import ActionLogForm, PermissionForm, RegroupementActeForm, SousRubriqueForm, StatExcelWsBobyForm, TarifForm, \
    CompagnieAdminForm, BanqueAdminForm, SousRegroupementActeForm, ApporteurInternationalForm, GroupeInterForm, GarantieBrancheForm, GarantieFormuleForm
from configurations.models import *
from production.models import Quittance, SecteurActivite, TypeDocument, TarifPrestataireClient, Mouvement, Motif

from production.models import Client

admin.site = custom_admin_site
admin.site.site_header = 'INOV'


class AdminGroupeBureauAdmInLine(admin.TabularInline):
    model = AdminGroupeBureau

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "bureau":
            kwargs["queryset"] = Bureau.objects.filter(status=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class ActeWaspitoAdmin(admin.ModelAdmin):
    list_display = ('libelle_fr', 'libelle_en', 'code_waspito','acte','cotation','prix','status')
    list_per_page = 10


class TaxeInline(admin.TabularInline):
    model = BureauTaxe
    extra = 1


class FonctionAdmin(admin.ModelAdmin):
    list_display = ('libelle',)
    search_fields = ('libelle',)
    list_filter = ('libelle',)
    list_per_page = 10


#@admin.register(SinistreVeos)
class SinistreVeosAdmin(ImportExportModelAdmin):
    list_display = ('ID_SIN', 'NUMERO_DOSSIER', 'FRAIS_REEL', 'TICKET_MODERATEUR', 'DEPASSEMENT_EXCLUSION',
                    'PART_ASSURE', 'PART_COMPAGNIE', 'DATE_SINISTRE', 'CODE_ACTE',
                    'CODE_AFFECTION', 'ID_PER_PRESTA', 'ID_NPOL', 'ID_MED_PRESC', 'ID_ADHERENT',
                    'STATUT_IMPORT')
    search_fields = ('ID_SIN', 'NUMERO_DOSSIER', 'ID_PER_PRESTA')
    list_filter = ('STATUT_IMPORT', 'DATE_SINISTRE')
    list_per_page = 10


class TarifAdmin(admin.ModelAdmin):
    form: TarifForm

    list_per_page = 30
    list_display = ('acte', 'lettre_cle_classique', 'coef_classique', 'pu_classique', 'cout_classique', 'pu_mutuelle', 'cout_mutuelle', 'pu_public_hg', 'cout_public_hg', 'pu_public_chu', 'cout_public_chu', 'pu_public_ica', 'cout_public_ica')
    list_filter = ('acte', )  # Vous pouvez ajouter d'autres champs de filtrage si nécessaire
    search_fields = ('acte', )  # Vous pouvez ajouter d'autres champs de recherche si nécessaire


class TarifExcelAdmin(ImportExportModelAdmin):
    list_display = ('CODE_REGROUPEMENT_INOV', 'LIBELLE_ACTE', 'CODE_ACTE', 'LETTRE_CLE_CLASSIQUE', 'COEF_CLASSIQUE', 'PU_CLASSIQUE', 'COUT_CLASSIQUE', 'PU_MUTUELLE', 'COUT_MUTUELLE', 'PU_PUBLIC_HG', 'COUT_PUBLIC_HG')
    list_filter = ('CODE_REGROUPEMENT_INOV', 'LIBELLE_ACTE', 'CODE_ACTE')  # Vous pouvez ajouter d'autres champs de filtrage si nécessaire
    search_fields = ('CODE_REGROUPEMENT_INOV', 'LIBELLE_ACTE', 'CODE_ACTE')  # Vous pouvez ajouter d'autres champs de recherche si nécessaire
    list_per_page = 10


class CompagnieVeosAdmin(ImportExportModelAdmin):
    list_display = ("ID_PER", "CODE", "NOM",  "COM_APPORT_COMPTANT",  "COM_APPORT_TERME",  "COM_GESTION", "TELEPHONE", "EMAIL", "ADRESSE", "BUREAU", "STATUT_IMPORT")
    list_filter = ("CODE", "NOM", "BUREAU")
    search_fields = ("CODE", "NOM", "BUREAU")
    list_per_page = 20


class SecteurActiviteAdmin(admin.ModelAdmin):
    list_display = ('libelle', 'status', 'created_at')


class ClientVeosAdmin(ImportExportModelAdmin):
    list_display = ('ID_PER', 'CODE', 'NOM', 'PRENOMS', 'DATE_NAISSANCE', 'TELEPHONE_FIXE', 'TELEPHONE_MOBILE', 'EMAIL', 'VILLE', 'ADRESSE', 'TYPE_PER', 'LANG', 'PAYS', 'BUREAU', 'STATUT_IMPORT')
    list_filter = ('ID_PER', 'CODE', 'NOM', 'PRENOMS','TYPE_PER','BUREAU', 'STATUT_IMPORT')
    search_fields = ('ID_PER', 'CODE', 'NOM', 'PRENOMS','TYPE_PER','BUREAU', 'STATUT_IMPORT')
    list_per_page = 20


class PoliceVeosAdmin(ImportExportModelAdmin):
    list_display = ('NUMERO',)
    list_per_page = 20


class ApporteurVeosAdmin(ImportExportModelAdmin):
    list_display = ("ID_NPOL", "ID_PER_APPORTEUR", "NOM_APPORTEUR", "PRENOM_APPORTEUR", "STATUT_IMPORT")
    list_filter = ("ID_NPOL", "ID_PER_APPORTEUR", "NOM_APPORTEUR", "PRENOM_APPORTEUR")
    search_fields = ("ID_NPOL", "ID_PER_APPORTEUR", "NOM_APPORTEUR", "PRENOM_APPORTEUR")
    list_per_page = 20


class FormuleVeosAdmin(ImportExportModelAdmin):
    list_display = ("CODE_FORMULE", "LIBELLE_FORMULE", "NOM_ASSURE", "NUMERO_ASSURE", "ID_NPOL", "NUMERO_POLICE", "LIGNE1",  "LIGNE2",  "LIGNE3",  "LIGNE4", "LIGNE5")
    list_filter = ("CODE_FORMULE", "NUMERO_ASSURE", "NUMERO_POLICE", "NUM_SOC")
    search_fields = ("CODE_FORMULE", "NUMERO_ASSURE", "NUMERO_POLICE", "NUM_SOC")
    list_per_page = 20


class AlimentVeosAdmin(ImportExportModelAdmin):
    list_display = ('ID_ALIMENT', 'NOM', 'PRENOMS', 'DATE_NAISSANCE', 'GENRE', 'CODE_POSTAL',
                    'EMAIL', 'NUMERO_FAMILLE', 'TELEPHONE_FIXE', 'TELEPHONE_MOBILE',
                    'ADRESSE', 'VILLE', 'ADHERENT_PRINCIPAL_ID', 'CODE_QUALITE_BENEFICIAIRE',
                    'QUALITE_BENEFICIAIRE', 'DATE_ENTREE', 'DATE_SORTIE', 'CD_FORMULE',
                    'LIB_FORMULE', 'CD_COLLEGE', 'LIB_COLLEGE', 'ID_NPOL', 'NUMERO_CARTE')
    list_filter = ('GENRE', 'CODE_QUALITE_BENEFICIAIRE', 'CD_FORMULE')
    search_fields = ('NOM', 'PRENOMS', 'EMAIL', 'ADRESSE', 'VILLE', 'NUMERO_CARTE')
    list_per_page = 10


class AlimentBaobabAdmin(ImportExportModelAdmin):
    list_display = ('num_benef', 'nom', 'prenom', 'formule', 'formule_id')
    list_filter = ('num_benef', 'nom', 'prenom', 'formule', 'formule_id')
    search_fields = ('num_benef', 'nom', 'prenom', 'formule', 'formule_id')
    list_per_page = 10


class PrestataireVeosAdmin(ImportExportModelAdmin):
    list_display = ('ID_PER', 'CODE', 'NAME', 'TELEPHONE', 'TELEPHONE2', 'TELEPHONE3',
                    'FAX', 'EMAIL', 'ADRESSE', 'VILLE',
                    'SOCIETE', 'TYPE_PRESTATAIRE', 'SECTEUR')
    
    search_fields = ('NAME', 'CODE', 'EMAIL', 'ADRESSE', 'VILLE', 'TYPE_PRESTATAIRE', 'SECTEUR')
    list_per_page = 10


class UtilisateurVeosAdmin(ImportExportModelAdmin):
    list_display = ('ID_PER', 'NOM', 'PRENOM', 'CODE', 'LOGIN', 'EMAIL',
                    'ID_PRESTA', 'NUM_PRESTA', 'NOM_PRESTA', 'SOCIETE')

    search_fields = ('NOM', 'PRENOM', 'CODE', 'LOGIN', 'EMAIL', 'ID_PRESTA', 'NUM_PRESTA', 'NOM_PRESTA', 'SOCIETE')
    list_per_page = 10


class UtilisateurGrhVeosAdmin(ImportExportModelAdmin):
    list_display = ('NOM', 'LOGIN', 'ADMIN', 'SUPERVUE', 'ACCES_SANTE',
                    'NOM_CLIENT', 'CODE_CLIENT')

    search_fields = ('NOM', 'LOGIN', 'ADMIN', 'SUPERVUE', 'ACCES_SANTE',
                    'NOM_CLIENT', 'CODE_CLIENT')
    list_per_page = 10


class ChangementFormuleAdmin(ImportExportModelAdmin):
    list_display = ('NOM', 'PRENOMS', 'NUMERO_CARTE', 'QUALITE_BENEFICIAIRE',
                    'LIB_FORMULE', 'CD_FORMULE', 'DATE_DEBUT')

    search_fields = ('NOM', 'PRENOMS', 'NUMERO_CARTE', 'QUALITE_BENEFICIAIRE',
                    'LIB_FORMULE', 'CD_FORMULE', 'DATE_DEBUT')
    list_per_page = 10


class PrescripteurVeosAdmin(ImportExportModelAdmin):
    list_display = ('id_per', 'numero', 'nom', 'prenom', 'specialite', 'email',
                    'telephone', 'ID_PRESTA', 'NUM_PRESTA', 'NOM_PRESTA')
    
    search_fields = ('id_per', 'numero', 'nom', 'prenom', 'specialite', 'NUM_PRESTA', 'NOM_PRESTA')
    list_per_page = 10


class QuittanceVeosAdmin(ImportExportModelAdmin):
    list_display = ('NUMERO_CLIENT', 'NOM_CLIENT', 'NUMERO_COMPAGNIE', 'NOM_COMPAGNIE', 'NUMERO_APPORTEUR',
                    'NOM_APPORTEUR', 'CODE_PRODUIT', 'LIBELLE_PRODUIT', 'NUMERO_POLICE', 'ID_NPOL', 'NUMERO_QUITTANCE',
                    'DATE_EMIS', 'DATE_DEBUT', 'DATE_FIN', 'CODE_TYPE_QUITTANCE', 'LIBELLE_TYPE_QUITTANCE',
                    'CODE_NATURE_QUITTANCE', 'LIBELLE_NATURE_QUITTANCE', 'CODE_SITUATION_CLIENT',
                    'LIBELLE_SITUATION_CLIENT', 'DATE_SITUATION_CLIENT', 'CODE_SITUATION_COMPAGNIE',
                    'LIBELLE_SITUATION_COMPAGNIE', 'DATE_SITUATION_COMPAGNIE', 'CODE_SITUATION_APPORTEUR',
                    'LIBELLE_SITUATION_APPORTEUR', 'DATE_SITUATION_APPORTEUR', 'MOIS_DE_COMPTE', 'PRIME_NETTE',
                    'CSS', 'CSS_OLEA', 'CARTE_ROSE', 'CONSTAT', 'ACCESSOIRES', 'ACCESSOIRES_CIE', 'TAXES',
                    'TSVL', 'PRIME_TOTALE', 'PRIME_TTC_HORS_CSS_HORS_CARTE', 'PRIME_TTC', 'TAUX', 'COMMISSION',
                    'SOLDE', 'INDICE', 'NUMERO_SOCIETE', 'CODE_MOUVEMENT', 'LIBELLE_MOUVEMENT', 'CODE_MOTIF',
                    'LIBELLE_MOTIF', 'STATUT_IMPORT')
    
    search_fields = ('NUMERO_CLIENT', 'NOM_CLIENT', 'NUMERO_COMPAGNIE', 'NOM_COMPAGNIE', 'NUMERO_APPORTEUR',
                     'NOM_APPORTEUR', 'CODE_PRODUIT', 'LIBELLE_PRODUIT', 'NUMERO_POLICE', 'ID_NPOL', 'NUMERO_QUITTANCE',
                     'DATE_EMIS', 'DATE_DEBUT', 'DATE_FIN', 'CODE_TYPE_QUITTANCE', 'LIBELLE_TYPE_QUITTANCE',
                     'CODE_NATURE_QUITTANCE', 'LIBELLE_NATURE_QUITTANCE', 'CODE_SITUATION_CLIENT',
                     'LIBELLE_SITUATION_CLIENT', 'DATE_SITUATION_CLIENT', 'CODE_SITUATION_COMPAGNIE',
                     'LIBELLE_SITUATION_COMPAGNIE', 'DATE_SITUATION_COMPAGNIE', 'CODE_SITUATION_APPORTEUR',
                     'LIBELLE_SITUATION_APPORTEUR', 'DATE_SITUATION_APPORTEUR', 'MOIS_DE_COMPTE', 'PRIME_NETTE',
                     'CSS', 'CSS_OLEA', 'CARTE_ROSE', 'CONSTAT', 'ACCESSOIRES', 'ACCESSOIRES_CIE', 'TAXES',
                     'TSVL', 'PRIME_TOTALE', 'PRIME_TTC_HORS_CSS_HORS_CARTE', 'PRIME_TTC', 'TAUX', 'COMMISSION',
                     'SOLDE', 'INDICE', 'NUMERO_SOCIETE', 'CODE_MOUVEMENT', 'LIBELLE_MOUVEMENT', 'CODE_MOTIF',
                     'LIBELLE_MOTIF')
    
    list_per_page = 10


class ProfessionAdmin(ImportExportModelAdmin):
    list_filter = ('name', 'code')
    list_display = ('name', 'code')
    search_field = ('name', 'code')
    list_per_page = 10


class BureausAdmin(ImportExportModelAdmin):
    inlines = [TaxeInline]
    list_display = ('nom', 'code', 'telephone', 'fax', 'email','tarif_bureau')
    list_filter = ('nom', 'code', 'telephone', 'fax', 'email', ('pays', admin.RelatedOnlyFieldListFilter))
    search_field = ('nom', 'code', 'telephone', 'fax', 'email')
    list_per_page = 10

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if not request.user.is_superuser:
            queryset = queryset.filter(id=request.user.bureau.id)
        return queryset

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Filtrer les bureaux pour n'afficher que celui de l'utilisateur connecté
        if db_field.name == 'pays':
            kwargs['queryset'] = Pays.objects.filter(pk=request.user.bureau.pays.id)

        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class RetenueAdmin(admin.ModelAdmin):
    list_filter = ('code','libelle')
    list_display = ('code','libelle','taux','secteur','prestataires')
    fields = ['code','libelle','taux','secteur','type_prestataire']
    search_field = ('libelle', 'code')
    list_per_page = 20

    def prestataires(self, obj):
        return ', '.join([ type.name for type in obj.type_prestataire.all() ]) if obj.type_prestataire.count() > 0 else '-'
    prestataires.allow_tags = True
    prestataires.short_description = "Types Prestataires"

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.filter(bureau=request.user.bureau)

        return queryset

    def save_model(self, request, obj, form, change):
        # Renseignez le champ bureau uniquement lors de la création d'une nouvelle compagnie
        if not change:
            obj.bureau = request.user.bureau

        # Appelez la méthode save_model de la classe parente pour effectuer l'enregistrement réel
        super().save_model(request, obj, form, change)


class ParamProduitCompagnieInline(admin.TabularInline):
    model = ParamProduitCompagnie
    extra = 1


class CompagnieAdmin(admin.ModelAdmin):
    inlines = [ParamProduitCompagnieInline]  # , Pres
    list_display = ('nom', 'code', 'groupe_compagnie', 'type_garant', 'telephone', )
    list_filter = ('nom', 'code', 'groupe_compagnie', 'type_garant', 'telephone', 'email')
    search_field = ('nom', 'code', 'groupe_compagnie','type_garant', 'telephone', 'email')
    list_per_page = 10
    form = CompagnieAdminForm

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.filter(bureau=request.user.bureau)

        return queryset


    def save_model(self, request, obj, form, change):
        # Renseignez le champ bureau uniquement lors de la création d'une nouvelle compagnie
        if not change:
            obj.bureau = request.user.bureau

        # Appelez la méthode save_model de la classe parente pour effectuer l'enregistrement réel
        super().save_model(request, obj, form, change)


class MotifAdmin(admin.ModelAdmin):
    list_display = ('code','libelle',)


class PrescripteurAdmin(ImportExportModelAdmin):
    list_filter = ('nom', 'prenoms', 'numero_ordre')
    list_display = ('nom', 'prenoms', 'numero_ordre', 'telephone', 'email',)
    search_field = ('nom', 'prenoms', 'numero_ordre')


class TypePrestataireSpecialiteInline(admin.TabularInline):
    model = SpecialiteTypePresta
    extra = 1


class PrestataireReseauxInline(admin.TabularInline):
    model = PrestataireReseauSoin
    extra = 1


class TarifPrestataireClientInline(admin.TabularInline):
    model = TarifPrestataireClient
    extra = 0


class PrescripteurPrestataireInline(admin.TabularInline):
    model = PrescripteurPrestataire
    extra = 0


class PrestataireAdmin(ImportExportModelAdmin):
    inlines = [TarifPrestataireClientInline, PrescripteurPrestataireInline] #, PrestataireReseauxInline,
    list_filter = ('name', 'bureau')
    list_display = ('name', 'code', 'telephone', 'fax', 'email', 'addresse', 'bureau','fichier_tarifs',)
    search_field = ('name', 'bureau')
    list_per_page = 10


    # overide save_model method to process other actions
    def save_model(self, request, obj, form, change):
        
        super().save_model(request, obj, form, change)

        # get file and use excel to import in prescripteur table
        #si fichier existants
        if obj.liste_prescripteurs:
            filename = obj.liste_prescripteurs.path
            prestataire = Prestataire.objects.get(id=obj.pk)

            df = pd.read_excel(filename)
            for index, row in df.iterrows():
                # Valeur du tableau
                # Access row values using column names
                try:

                    numero_ordre = row['numero_ordre']
                    nom = row['nom']
                    prenoms = row['prenoms']
                    telephone = row['telephone']
                    code_specialite = row['code_specialite']

                    # dd(code_specialite)
                    specialite = Specialite.objects.filter(code=code_specialite).first()
                except:
                    break


                try:
                    # Ne retournera pas d'erreur si le prescripteur existe
                    prescripteur = Prescripteur.objects.get(numero_ordre=numero_ordre)

                except:
                    # Le prescripteur n'existe pas, on le créé
                    prescripteur = Prescripteur.objects.create(
                        nom=nom,
                        prenoms=prenoms,
                        numero_ordre=numero_ordre,
                        telephone=telephone,
                        specialite_id=specialite.pk,
                    )

                # On tente de trouver l'enregistrement de du prescripteur sinon on l'enregistre
                try:
                    prescripteur_prestataire = PrescripteurPrestataire.objects.get(prescripteur_id=prescripteur.id)
                except:
                    PrescripteurPrestataire.objects.create(
                            prescripteur_id=prescripteur.pk,
                            prestataire_id=prestataire.pk
                        )


class TypePrestataireAdmin(admin.ModelAdmin):
    inlines = [TypePrestataireSpecialiteInline]
    list_display = ('name',)
    list_filter = ('name',)
    search_field = ('name',)
    list_per_page = 10


class TypeEtablissementAdmin(admin.ModelAdmin):
    list_display = ('libelle', 'code')
    list_filter = ('libelle', 'code')
    search_field = ('libelle', 'code')
    list_per_page = 10


class SpecialiteAdmin(ImportExportModelAdmin):
    list_filter = ('name', 'status')
    list_display = ('name', 'status')
    search_field = ('name', 'status')
    list_per_page = 10


class ParamActeInline(admin.TabularInline):
    model = ParamActe
    extra = 1

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Filtrer les bureaux pour n'afficher que celui de l'utilisateur connecté
        if db_field.name == 'bureau':
            kwargs['queryset'] = Bureau.objects.filter(pk=request.user.bureau.id)

        return super().formfield_for_foreignkey(db_field, request, **kwargs)


# class ActeAdmin(admin.ModelAdmin):
#     inlines = [ParamActeInline]
#     list_per_page = 30
#     list_filter = ('type_acte', 'rubrique', 'regroupement_acte', 'libelle', 'accord_automatique')
#     list_display = ('code', 'libelle', 'rubrique', 'regroupement_acte', 'lettre_cle', 'base_calcul_tm', 'delais_controle', 'accord_automatique', 'option_seance', 'specialiste_uniquement', 'status')
#     search_field = ('code', 'libelle',)

    # def get_queryset(self, request):
    #     # Filter queryset to show only rows where type_acte is 1
    #     queryset = super().get_queryset(request)
    #     return queryset.filter(status=1, statut_validite=StatutValidite.VALIDE)


class SousRubriqueRegroupementInline(admin.TabularInline):
    model = SousRubriqueRegroupementActe
    extra = 1


class SousRubriqueAdmin(admin.ModelAdmin):
    form = SousRubriqueForm

    inlines = [SousRubriqueRegroupementInline]
    list_per_page = 30
    list_filter = ('rubrique', 'libelle',)
    list_display = ('code', 'libelle', 'rubrique',)
    search_field = ('code', 'libelle',)


class RegroupementActeAdmin(admin.ModelAdmin):
    form = RegroupementActeForm

    list_per_page = 30
    #list_filter = ('rubrique', 'libelle_regroupement', 'code', )
    list_display = ('rubrique', 'libelle_regroupement', 'code', )
    search_field = ('rubrique', 'libelle_regroupement', 'code', )

    def libelle_regroupement(self, obj):
        return obj.libelle

    libelle_regroupement.short_description = 'Regroupement'


class SousRegroupementActeActeInline(admin.TabularInline):
    model = SousRegroupementActeActe
    extra = 1

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Filtrer les bureaux pour n'afficher que celui de l'utilisateur connecté
        if db_field.name == 'acte':
            kwargs['queryset'] = Acte.objects.filter(status=True)# rubrique__code="" filtrer uniquement les actes de la rubrique définit sur le sous-regroupement-acte

        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class SousRegroupementActeAdmin(admin.ModelAdmin):
    form = SousRegroupementActeForm
    inlines = [SousRegroupementActeActeInline]

    list_per_page = 30
    #list_filter = ('rubrique', 'libelle_regroupement', 'code', )
    list_display = ('libelle_regroupement_acte', 'code', )
    search_field = ('libelle_regroupement_acte', 'code', )

    def libelle_regroupement_acte(self, obj):
        return obj.libelle

    libelle_regroupement_acte.short_description = "Sous-regroupement d'actes"


class MedicamentAdmin(ImportExportModelAdmin):
    list_per_page = 30
    list_filter = ('code', 'libelle', 'rubrique', 'accord_automatique',)
    list_display = ('code', 'libelle', 'rubrique', 'accord_automatique')
    search_field = ('code', 'libelle',)

    def get_queryset(self, request):
         # Filter queryset to show only rows where type_acte is 1
         queryset = Acte.objects.filter(type_acte__code="medicament")
         return queryset


# class AffectionAdmin(ImportExportModelAdmin):
#     list_filter = ('libelle', 'code_cim_10', 'categorie')
#     list_display = ('libelle', 'code_cim_10', 'categorie')
#     search_field = ('libelle', 'code_cim_10', 'categorie')
#     list_per_page = 20


class RubiqueAdmin(ImportExportModelAdmin):
    list_filter = ('libelle',)
    list_display = ('code', 'libelle',)
    search_field = ('libelle',)
    list_per_page = 20


class ReseauSoinAdmin(ImportExportModelAdmin):
    inlines = [PrestataireReseauxInline]
    list_filter = ('nom',)
    list_display = ('nom',)
    search_field = ('nom',)
    list_per_page = 20


class LangueAdmin(admin.ModelAdmin):
    list_filter = ('libelle',)
    list_display = ('libelle','code')
    search_field = ('libelle','code')
    list_per_page = 20


class PaysAdmin(admin.ModelAdmin):
    list_filter = ('nom',)
    list_display = ('nom','code','indicatif', 'poligamie', 'devise')
    search_field = ('nom','code')
    list_per_page = 20


class DeviseAdmin(admin.ModelAdmin):
    list_filter = ('libelle',)
    list_display = ('libelle','code')
    search_field = ('code','libelle')
    list_per_page = 20


class ParamProduitCompagnieInline(admin.TabularInline):
    model = ParamProduitCompagnie
    extra = 1

class ProduitAdmin(admin.ModelAdmin):
    inlines = [ParamProduitCompagnieInline]
    list_display = ('code', 'nom', 'branche')
    list_per_page = 20

class BrancheAdmin(admin.ModelAdmin):
    list_filter = ('code', 'nom', 'status')
    list_display = ('code', 'nom', 'status')
    search_field = ('code', 'nom', 'status')
    list_per_page = 20


class TaxeAdmin(admin.ModelAdmin):
    list_filter = ('libelle',)
    list_display = ('libelle','code')
    search_field = ('libelle', 'code')
    list_per_page = 20

@admin.register(BaseCalcul)
class BaseCalculAdmin(admin.ModelAdmin):
    list_display = ('libelle', 'code')
    list_filter = ('libelle', 'code')
    search_field = ('libelle', 'code')


@admin.register(TypeQuittance)
class TypeQuittanceAdmin(admin.ModelAdmin):
    list_display = ('libelle', 'code')
    list_filter = ('libelle', 'code')
    search_field = ('libelle', 'code')

@admin.register(NatureQuittance)
class NatureQuittanceAdmin(admin.ModelAdmin):
    list_display = ('libelle', 'code')
    list_filter = ('libelle', 'code')
    search_field = ('libelle', 'code')


class BanqueAdmin(admin.ModelAdmin):
    list_display = ('code', 'libelle', 'bureau')
    form=BanqueAdminForm

    def save_model(self, request, obj, form, change):
        # Renseignez le champ bureau uniquement lors de la création d'un nouvel utilisateur
        if not change:
            obj.bureau = request.user.bureau
            obj.created_by = request.user

        # Appelez la méthode save_model de la classe parente pour effectuer l'enregistrement réel
        super().save_model(request, obj, form, change)


    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.filter(bureau=request.user.bureau)

        return queryset




class TypeDocumentAdmin(admin.ModelAdmin):
    list_display = ('libelle',)
    list_filter = ('libelle',)
    search_field = ('libelle',)


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'last_name', 'first_name', 'is_active', 'is_superuser')

    list_filter = ('username', 'last_name', 'first_name', 'is_active', 'is_superuser')
    #search_fields = ('username', 'last_name', 'first_name', 'email', 'is_active', 'is_superuser')
    list_per_page = 10
    readonly_fields = ('utilisateur_grh',)

    inlines = [
        AdminGroupeBureauAdmInLine,
    ]

    superuser_fieldsets = (
        (None, {"fields": ("username", "password", "first_name", "last_name", "email")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "is_admin_group",
                    "groups",

                ),
            },
        ),
        # ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    staff_fieldsets = (
        (None, {"fields": ("username", "password", "first_name", "last_name", "email")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    # "is_superuser",
                    "groups",

                ),
            },
        ),
        # ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    superuser_add_fieldsets = (
        (None, {"fields": ("username", "password1", "password2", "first_name", "last_name", "email")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "is_admin_group",
                    "groups",

                ),
            },
        ),
    )

    staff_add_fieldsets = (
        (None, {"fields": (
        "username", "password1", "password2", "first_name", "last_name", "email",
        "client_grh")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    # "is_superuser",
                    # "is_admin_group",
                    "groups",

                ),
            },
        ),
    )

    """def type_prestataire(self, obj):
        return obj.prestataire.type_prestataire if obj.prestataire else None

    type_prestataire.admin_order_field = 'prestataire__type_prestataire'
    type_prestataire.short_description = 'Type Prestataire' """


    def get_fieldsets(self, request, obj=None):
        if not obj:
            if request.user.is_superuser:
                return self.superuser_add_fieldsets
            else:
                return self.staff_add_fieldsets

        if request.user.is_superuser:
            return self.superuser_fieldsets
        else:
            return self.staff_fieldsets


    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        if request.user.is_superuser:
            print("Bureau ", request.user.bureau)
            queryset = queryset.filter(bureau=request.user.bureau)
        else:
            print("Bureau ", request.user.bureau)
            queryset = queryset.filter(bureau=request.user.bureau, is_superuser=False)

        return queryset

    def save_model(self, request, obj, form, change):
        # Renseignez le champ bureau uniquement lors de la création d'un nouvel utilisateur

        if not change:
            obj.bureau = request.user.bureau

        client_grh_ids = form.cleaned_data.get('client_grh')
        if client_grh_ids:
            first_client_grh_id = client_grh_ids[0].id
            obj.utilisateur_grh_id = first_client_grh_id

        # Save the user first to get the primary key
        super().save_model(request, obj, form, change)

    # Fetch user GRH
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "client_grh":
            kwargs["queryset"] = Client.objects.filter(bureau=request.user.bureau, statut=Statut.ACTIF).order_by('nom','prenoms')
        if db_field.name == "prestataire":
            kwargs["queryset"] = Prestataire.objects.filter(bureau=request.user.bureau, status=True).order_by('name')

        return super().formfield_for_foreignkey(db_field, request, **kwargs)



@admin.register(ActionLog)
class ActionLogAdmin(admin.ModelAdmin):
    form = ActionLogForm
    list_per_page = 30
    list_display = ('data_before', 'data_after',)
    #list_display = ('done_by', 'table', 'row', 'action', 'description', 'data_before', 'data_after',)
    #search_fields = ('action',)
    #list_filter = ('action',)


# class TypeRemboursementAdmin(admin.ModelAdmin):
#     list_display = ('libelle', 'code')
#     list_filter = ('libelle', 'code')
#     search_field = ('libelle', 'code')
#     list_per_page = 10


# class TypePrefinancementAdmin(admin.ModelAdmin):
#     list_display = ('libelle', 'code')
#     list_filter = ('libelle', 'code')
#     search_field = ('libelle', 'code')
#     list_per_page = 10


@admin.register(PeriodeComptable)
class PeriodeComptableAdmin(ImportExportModelAdmin):
    list_display = ('libelle', 'mois', 'annee', 'date_debut', 'date_fin')
    list_filter = ('libelle', 'mois', 'annee')
    search_field = ('libelle', 'code', 'annee')
    list_per_page = 10


class KeyValueDataAdmin(ImportExportModelAdmin):
    list_display = ('key', 'description', 'statut')
    list_filter = ('key','statut')
    search_field = ('key', 'description', 'data')
    list_per_page = 10
    formfield_overrides = {
        # fields.JSONField: {'widget': JSONEditorWidget}, # if django < 3.1
        models.JSONField: {'widget': JSONEditorWidget(height='500px', width='100%', mode='tree')},
    }


class ModeCreationAdmin(admin.ModelAdmin):
    list_display = ('code', 'libelle',)


class NatureOperationAdmin(admin.ModelAdmin):
    list_display = ('code', 'libelle',)


class BackgroundQueryTaskAdmin(admin.ModelAdmin):
    list_display = ('name','auteur','created_at','updated_at','fichier_excel','statut',)
    list_filter = ('status','created_at',('created_by__bureau', admin.RelatedOnlyFieldListFilter),'created_by__username')
    search_field = ('name','status','created_by__username')
    readonly_fields = ('created_at','updated_at','error_message','name','created_by','fichier_excel', 'statut')
    list_per_page = 10

    superuser_fieldsets = (
        ('Général', {
            'fields': ('name', 'query','file', 'status')
        }),
        ('Meta Donnée', {
            'fields': (
                'created_at', 'updated_at', 'error_message', 'created_by')
        }),
    )

    staff_fieldsets = (
        ('Général', {
            'fields': ('name','file', 'status')
        }),
        ('Meta Donnée', {
            'fields': (
                'created_at', 'updated_at', 'error_message', 'created_by')
        }),
    )

    add_fieldsets = (
        ('Général', {
            'fields': ('name', 'query', 'status')
        }),
    )

    def get_fieldsets(self, request, obj=None):
        if not obj:
            return self.add_fieldsets
        if request.user.is_superuser:
            return self.superuser_fieldsets
        else:
            return self.staff_fieldsets

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if not request.user.is_superuser:
            queryset = queryset.filter(created_by=request.user, status__in=['ENATT', 'ENCOURS', 'TERMINEE', 'ECHOUEE'])
        return queryset

    def auteur(self, obj):
        return obj.created_by.username

    auteur.short_description = 'Exécuté par'

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_update_permission(self, request, obj=None):
        return False

    class Media:
        js = ("configurations/js/custom.js",)


class ApporteurInternationalAdmin(admin.ModelAdmin):
    list_display = ('code', 'nom', 'pays')
    form=ApporteurInternationalForm


class GroupeInterAdmin(admin.ModelAdmin):
    list_display = ('code', 'nom', 'apporteur', 'status')
    form=GroupeInterForm

    def has_add_permission(self, request):
        if request.user.is_superuser:
            return True
        else:
            return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            return False

    def has_update_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            return False


class ModelLettreChequeAdmin(admin.ModelAdmin):
    list_display = ('libelle','banque','auteur','statut',)
    list_filter = ('statut',('bureau', admin.RelatedOnlyFieldListFilter),('banque', admin.RelatedOnlyFieldListFilter))
    search_field = ('libelle','banque__libelle')
    # readonly_fields = ('created_at','updated_at','error_message','name','created_by','fichier_excel', 'statut')
    list_per_page = 10

    fieldsets = (
        ('Général', {
            'fields': ('libelle', 'banque', 'model', 'statut')
        }),
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.filter(bureau=request.user.bureau).order_by('-created_at')
        return queryset

    def auteur(self, obj):
        return obj.created_by.username

    auteur.short_description = 'Créé par'

    def save_model(self, request, obj, form, change):
        # Renseignez le champ bureau uniquement lors de la création d'un nouvel utilisateur
        if not change:
            obj.created_by = request.user
            obj.bureau = request.user.bureau

        # Appelez la méthode save_model de la classe parente pour effectuer l'enregistrement réel
        super().save_model(request, obj, form, change)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "banque":
            kwargs["queryset"] = Banque.objects.filter(bureau=request.user.bureau, status=True).order_by('libelle')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class BordereauLettreChequeAdmin(admin.ModelAdmin):
    list_display = ('libelle','created_at','nombre','edite_par','action',)
    list_filter = ('libelle', 'created_at',)
    search_field = ('libelle', 'created_at','created_by')
    readonly_fields = ('created_at','edite_par','fichier_pdf',)
    list_per_page = 10

    superuser_fieldsets = (
        ('Général', {
            'fields': ('libelle', 'model_lettre_cheque','nombre', 'fichier_pdf')
        }),
        ('Meta Donnée', {
            'fields': (
                'created_at', 'updated_at', 'edite_par')
        }),
    )

    staff_fieldsets = (
        ('Général', {
            'fields': ('libelle','nombre', 'fichier_pdf', 'edite_par')
        }),
    )

    add_fieldsets = (
        ('Général', {
            'fields': ('libelle', 'model_lettre_cheque','nombre', 'fichier')
        }),
    )

    def get_fieldsets(self, request, obj=None):
        if not obj:
            return self.add_fieldsets
        if request.user.is_superuser:
            return self.superuser_fieldsets
        else:
            return self.staff_fieldsets

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.filter(bureau=request.user.bureau)
        return queryset

    def edite_par(self, obj):
        return f'{obj.created_by.first_name} {obj.created_by.last_name}' if obj.created_by else ''

    def action(self, obj):
        return obj.fichier_pdf

    edite_par.short_description = 'Edité par'

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_update_permission(self, request, obj=None):
        return False

    # class Media:
    #     js = ("configurations/js/custom.js",)


class MailingListAdminForm(forms.ModelForm):
    class Meta:
        model = MailingList
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            # Si l'instance existe déjà, ne pas modifier created_by
            self.fields['created_by'].required = False
            self.fields['updated_by'].required = False
        else:
            # Si l'instance n'existe pas (donc nouvelle), définir created_by à l'utilisateur connecté
            user = self.initial.get('user')
            if user:
                self.fields['created_by'].initial = user
                self.fields['updated_by'].initial = user
                
class MailingListAdmin(admin.ModelAdmin):
    form = MailingListAdminForm

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.user = request.user  # Passe l'utilisateur connecté au formulaire
        return form

    def save_model(self, request, obj, form, change):
        if not change:  # Si l'objet est nouveau (création)
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)

#
# class PeriodeVeosAdmin(ImportExportModelAdmin):
#     list_display = ('ID_NPOL', 'NUM_POL', 'DATEEFFET', 'ECHEANCE',	'DEBUTEFFETOLD', 'FINEFFETOLD',	'DUREE')

    search_fields = ('ID_NPOL', 'NUM_POL', 'DATEEFFET', 'ECHEANCE',	'DEBUTEFFETOLD', 'FINEFFETOLD',	'DUREE')
    list_per_page = 10

class StatExcelWsBobyAdmin(admin.ModelAdmin):
    list_display = ('libelle_fr', 'code_ws', 'status')
    form=StatExcelWsBobyForm

    def has_add_permission(self, request):
        if request.user.is_superuser:
            return True
        else:
            return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            return False

    def has_update_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            return False
        


class ComptePrestataireVeosAdmin(ImportExportModelAdmin):
    list_display = ('CODE_PRESTATAIRE', 'NOM_PRESTATAIRE', 'EMAIL', 'REMBOURSEMENT_ORDRE_DE',	'TYPE_PRESTATAIRE', 'SECTEUR_PRESTATAIRE',	'OBSERVATION')

    search_fields = ('CODE_PRESTATAIRE', 'NOM_PRESTATAIRE', 'EMAIL', 'REMBOURSEMENT_ORDRE_DE',	'TYPE_PRESTATAIRE', 'SECTEUR_PRESTATAIRE',	'OBSERVATION')
    list_per_page = 10


class BusinessUnitAdmin(ImportExportModelAdmin):
    list_filter = ('libelle', 'status', 'created_at')
    list_display = ('libelle', 'status', 'created_at')
    search_field = ('libelle', 'status', 'created_at')
    list_per_page = 10

class GarantieBrancheAdmin(admin.ModelAdmin):
    form = GarantieBrancheForm

    list_display = ['branche', 'get_garanties', 'status', 'created_at', 'updated_at']
    list_filter = ['branche', 'status']
    search_fields = ['branche__nom', 'garantie__nom']

    def save_model(self, request, obj, form, change):
        """
        Gérer la sauvegarde en associant branche et garanties via IDs
        """
        branche = form.cleaned_data['branche']
        garanties_selected = form.cleaned_data['garanties']
        status = form.cleaned_data['status']

        # Supprimer les anciennes associations pour la branche
        GarantieBranche.objects.filter(branche=branche).delete()

        try:
            # Créer les nouvelles associations
            GarantieBranche.objects.bulk_create([
                GarantieBranche(
                    branche=branche,
                    garantie=garantie,
                    status=status
                ) for garantie in garanties_selected
            ])
        except Exception as e:
            self.message_user(request, f"Erreur : {e}", level='error')

    def get_garanties(self, obj):
        """
        Afficher les garanties associées à une branche
        """
        garanties = GarantieBranche.objects.filter(branche=obj.branche).values_list('garantie__nom', flat=True)
        return ', '.join(garanties)

    get_garanties.short_description = "Garanties"



class GarantieFormuleAdmin(admin.ModelAdmin):
    form = GarantieFormuleForm

    list_display = ['formule', 'get_garanties', 'status', 'created_at', 'updated_at']
    list_filter = ['formule', 'status']
    search_fields = ['formule__libelle', 'garantie__nom']

    def save_model(self, request, obj, form, change):
        """
        Gérer la sauvegarde en associant branche et garanties via IDs
        """
        formule = form.cleaned_data['formule']
        garanties_selected = form.cleaned_data['garanties']
        status = form.cleaned_data['status']

        # Supprimer les anciennes associations pour la branche
        GarantieFormule.objects.filter(formule=formule).delete()

        try:
            # Créer les nouvelles associations
            GarantieFormule.objects.bulk_create([
                GarantieFormule(
                    formule=formule,
                    garantie=garantie,
                    status=status
                ) for garantie in garanties_selected
            ])
        except Exception as e:
            self.message_user(request, f"Erreur : {e}", level='error')

    def get_garanties(self, obj):
        """
        Afficher les garanties associées à une branche
        """
        garanties = GarantieFormule.objects.filter(formule=obj.formule).values_list('garantie__nom', flat=True)
        return ', '.join(garanties)

    get_garanties.short_description = "Garanties"


class ConditionsAssuranceAdmin(admin.ModelAdmin):
    list_filter = ('libelle',)
    list_display = ('libelle','code', 'status')
    search_field = ('libelle', 'code', 'status')
    list_per_page = 20


class MoyensTransportAdmin(admin.ModelAdmin):
    list_filter = ('libelle',)
    list_display = ('libelle','code', 'status')
    search_field = ('libelle', 'code', 'status')
    list_per_page = 20


admin.site.register(Bureau, BureausAdmin)
admin.site.register(Compagnie, CompagnieAdmin)
#admin.site.register(Prescripteur, PrescripteurAdmin)
# admin.site.register(Prestataire, PrestataireAdmin)
# admin.site.register(TypePrestataire, TypePrestataireAdmin)
# admin.site.register(Specialite, SpecialiteAdmin)
# admin.site.register(Rubrique, RubiqueAdmin)
# admin.site.register(SousRubrique, SousRubriqueAdmin)
# admin.site.register(Acte)
# admin.site.register(RegroupementActe, RegroupementActeAdmin)
# admin.site.register(SousRegroupementActe, SousRegroupementActeAdmin)
# admin.site.register(TypeActe)
admin.site.register(Prestataire, PrestataireAdmin)
admin.site.register(TypePrestataire, TypePrestataireAdmin)
admin.site.register(CategorieAffection)
# admin.site.register(Affection)
admin.site.register(Profession, ProfessionAdmin)
admin.site.register(Civilite)
# admin.site.register(TypeAssure)
# admin.site.register(ReseauSoin, ReseauSoinAdmin)
# admin.site.register(TypeClient)
#admin.site.register(SecteurActivite, SecteurActiviteAdmin)
admin.site.register(TypeClient)
admin.site.register(TypePersonne)
# admin.site.register(Langue, LangueAdmin)
admin.site.register(Pays, PaysAdmin)
admin.site.register(Branche, BrancheAdmin)
admin.site.register(Produit, ProduitAdmin)
admin.site.register(Fractionnement,)
admin.site.register(ModeReglement,)
admin.site.register(NatureOperation, NatureOperationAdmin)
admin.site.register(Banque, BanqueAdmin)
admin.site.register(Devise,DeviseAdmin)
# admin.site.register(Regularisation,)
# admin.site.register(TicketModerateur,)
# admin.site.register(Territorialite,)
#admin.site.register(Duree,) #à réactiver plus tard
# admin.site.register(QualiteBeneficiaire,)
# admin.site.register(TypeAssurance,)
# admin.site.register(Devise)
# admin.site.register(ModeCalcul,)
# admin.site.register(TypeTarif,)
#admin.site.register(Medicament, MedicamentAdmin)
admin.site.register(Taxe, TaxeAdmin)
admin.site.register(TypePriseencharge)
admin.site.register(TypeEtablissement, TypeEtablissementAdmin)
admin.site.register(Tarif, TarifAdmin)
admin.site.register(TypeQuittance, TypeQuittanceAdmin)
# admin.site.register(CompagnieVeos, CompagnieVeosAdmin)
# admin.site.register(ClientVeos, ClientVeosAdmin)
# admin.site.register(PoliceVeos, PoliceVeosAdmin)
# admin.site.register(FormuleVeos, FormuleVeosAdmin)
# admin.site.register(AlimentVeos, AlimentVeosAdmin)
#admin.site.register(AlimentBaobab, AlimentBaobabAdmin)
# admin.site.register(PrestataireVeos, PrestataireVeosAdmin)
# admin.site.register(UtilisateurVeos, UtilisateurVeosAdmin)
# admin.site.register(UtilisateurGrhVeos, UtilisateurGrhVeosAdmin)
#admin.site.register(ChangementFormule, ChangementFormuleAdmin)
# admin.site.register(PrescripteurVeos, PrescripteurVeosAdmin)
# admin.site.register(SinistreVeos, SinistreVeosAdmin)
# admin.site.register(TypeGarant)
# admin.site.register(Tarif, TarifAdmin)
# admin.site.register(TypePrefinancement, TypePrefinancementAdmin)
# admin.site.register(PeriodeComptable, PeriodeComptableAdmin)
# admin.site.register(ModeCreation, ModeCreationAdmin)
# admin.site.register(TypeRemboursement, TypeRemboursementAdmin)
# admin.site.register(TypeQuittance, TypeQuittanceAdmin)
#admin.site.register(Quittance)
# admin.site.register(QuittanceVeos, QuittanceVeosAdmin)
admin.site.register(KeyValueData, KeyValueDataAdmin)
admin.site.register(TypeApporteur)
admin.site.register(CompteTresorerie)
admin.site.register(BackgroundQueryTask, BackgroundQueryTaskAdmin)
# admin.site.register(ModelLettreCheque, ModelLettreChequeAdmin)
admin.site.register(BordereauLettreCheque, BordereauLettreChequeAdmin)
admin.site.register(BusinessUnit, BusinessUnitAdmin)
admin.site.register(TypeProduit)
admin.site.register(CategorieVehicule)
admin.site.register(Carburant)
admin.site.register(Usage)
admin.site.register(Carosserie)
admin.site.register(Garantie)
admin.site.register(GarantieBranche, GarantieBrancheAdmin)
admin.site.register(Formule)
admin.site.register(GarantieFormule, GarantieFormuleAdmin)
admin.site.register(ConditionsAssurance, ConditionsAssuranceAdmin)
admin.site.register(MoyensTransport, MoyensTransportAdmin)
admin.site.register(User, CustomUserAdmin)
# admin.site.register(Retenue, RetenueAdmin)

# admin.site.register(MailingList)

# admin.site.register(PeriodeVeos, PeriodeVeosAdmin)
# admin.site.register(ComptePrestataireVeos, ComptePrestataireVeosAdmin)

#admin.site.register(ActeWaspito, ActeWaspitoAdmin)
#admin.site.register(GroupeInter, GroupeInterAdmin)
#admin.site.register(StatExcelWsBoby, StatExcelWsBobyAdmin)
#admin.site.register(TypePrefinancement, TypePrefinancementAdmin)
#admin.site.register(PeriodeComptable, PeriodeComptableAdmin)
#admin.site.register(ModeCreation, ModeCreationAdmin)
#admin.site.register(TypeRemboursement, TypeRemboursementAdmin)
#admin.site.register(User)
# admin.site.register(ActeWaspito, ActeWaspitoAdmin)
#admin.site.register(GroupeInter, GroupeInterAdmin)
# admin.site.register(StatExcelWsBoby, StatExcelWsBobyAdmin)
#admin.site.register(Retenue, RetenueAdmin)
#admin.site.register(MailingList)
#admin.site.register(PeriodeVeos, PeriodeVeosAdmin)
#admin.site.register(ComptePrestataireVeos, ComptePrestataireVeosAdmin)
#admin.site.register(Quittance)
#admin.site.register(QuittanceVeos, QuittanceVeosAdmin)
#admin.site.register(ApporteurVeos, ApporteurVeosAdmin)
#admin.site.register(ApporteurInternational, ApporteurInternationalAdmin)
#admin.site.register(ModelLettreCheque, ModelLettreChequeAdmin)
#admin.site.register(CompagnieVeos, CompagnieVeosAdmin)
#admin.site.register(ClientVeos, ClientVeosAdmin)
#admin.site.register(PoliceVeos, PoliceVeosAdmin)
#admin.site.register(FormuleVeos, FormuleVeosAdmin)
#admin.site.register(AlimentVeos, AlimentVeosAdmin)
#admin.site.register(AlimentBaobab, AlimentBaobabAdmin)
#admin.site.register(PrestataireVeos, PrestataireVeosAdmin)
#admin.site.register(UtilisateurVeos, UtilisateurVeosAdmin)
#admin.site.register(UtilisateurGrhVeos, UtilisateurGrhVeosAdmin)
#admin.site.register(ChangementFormule, ChangementFormuleAdmin)
#admin.site.register(PrescripteurVeos, PrescripteurVeosAdmin)
#admin.site.register(SinistreVeos, SinistreVeosAdmin)
#admin.site.register(TypeGarant)
#admin.site.register(Regularisation,)
#admin.site.register(TicketModerateur,)
#admin.site.register(Territorialite,)
#admin.site.register(Duree,) #à réactiver plus tard
#admin.site.register(QualiteBeneficiaire,)
#admin.site.register(TypeAssurance,)
#admin.site.register(ModeCalcul,)
#admin.site.register(TypeTarif,)
#admin.site.register(Medicament, MedicamentAdmin)
#admin.site.register(RegroupementActe, RegroupementActeAdmin)
#admin.site.register(SousRegroupementActe, SousRegroupementActeAdmin)
#admin.site.register(TypeActe)
#admin.site.register(Specialite, SpecialiteAdmin)
#admin.site.register(Rubrique, RubiqueAdmin)
#admin.site.register(SousRubrique, SousRubriqueAdmin)
#admin.site.register(Prescripteur, PrescripteurAdmin)
#admin.site.register(TypeAssure)
#admin.site.register(ReseauSoin, ReseauSoinAdmin)
#admin.site.register(SecteurActivite, SecteurActiviteAdmin)
#admin.site.register(Langue, LangueAdmin)

#admin.site.register(MarqueVehicule) #à réactiver plus tard
#admin.site.register(TypeCarosserie) #à réactiver plus tard


#admin.site.register(TypeDocument,TypeDocumentAdmin) #à réactiver plus tard
#admin.site.register(Mouvement) #à réactiver plus tard
#admin.site.register(Motif, MotifAdmin) #à réactiver plus tard
