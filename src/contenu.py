def generer_exportation_quittance(request, typefichier_id):
    typefichier = TypeFichier.objects.filter(id=typefichier_id).first()

    # Récupérer les paramètres GET
    client = Client.objects.filter(id=request.GET.get('cl')).first()
    police = Police.objects.filter(id=request.GET.get('po')).first()
    date_exportation = request.GET.get('de')
    periode_debut = request.GET.get('pd')
    periode_fin = request.GET.get('pf')

    quittances = Quittance.objects.filter(police_id=police.id, police__client=client,
                                          statut_validite=StatutValidite.VALIDE).order_by('numero')

    if periode_debut and periode_fin:
        periode_debut = convertir_date_multiformat(periode_debut)
        periode_fin = convertir_date_multiformat(periode_fin)

        quittances = quittances.filter(
            Q(date_debut__gte=periode_debut, date_fin__lte=periode_fin) |
            (Q(statut=StatutQuittance.IMPAYE))
        ).order_by('numero')

    site_logo_url = request.build_absolute_uri(static(settings.JAZZMIN_SETTINGS['site_logo']))

    heure_actuelle = datetime.now().strftime('%H:%M:%S')

    quittance_impayees = Quittance.objects.filter(police_id=police.id, police__client=client,
                                                  statut_validite=StatutValidite.VALIDE,
                                                  statut=StatutQuittance.IMPAYE).order_by('numero')
    acomptes = Acompte.objects.filter(client_id=client.id, solde__gt=0)

    solde_acomptes = sum(acompte.solde for acompte in acomptes)
    solde_quittances = sum(quittance_impayee.solde for quittance_impayee in quittance_impayees)

    if solde_quittances > solde_acomptes:
        difference_acomptes_quittances = solde_quittances - solde_acomptes
    else:
        difference_acomptes_quittances = 0

    print('quittances : ', quittances)
    print("date_exportation : ", date_exportation)
    print("periode_debut : ", periode_debut)
    print("periode_fin : ", periode_fin)
    print("heure_actuelle : ", heure_actuelle)
    print("solde_acomptes : ", solde_acomptes)
    print("solde_quittances : ", solde_quittances)
    print("difference_acomptes_quittances : ", difference_acomptes_quittances)
    print("Logo : ", site_logo_url)

    contexte = {
        'client': client,
        'police': police,
        'quittances': quittances,
        'date_exportation': date_exportation,
        'periode_debut': periode_debut,
        'periode_fin': periode_fin,
        'heure_actuelle': heure_actuelle,
        'solde_acomptes': solde_acomptes,
        'solde_quittances': solde_quittances,
        'difference_acomptes_quittances': difference_acomptes_quittances,
        'site_logo_url': site_logo_url,
    }

    print('date_exportation : ', date_exportation)
    print('periode_debut : ', periode_debut)
    print('periode_fin : ', periode_fin)

    if typefichier:
        if typefichier.id == 1:
            pass
        elif typefichier.id == 2:

            pdf = render_pdf('police/courriers/quittances.html', contexte)

            pdf_file = PyPDF2.PdfReader(pdf)
            nombre_pages = len(pdf_file.pages)

            # Ajout du nombre de page obtenu au contexte pour le rendu final
            contexte['nombre_pages'] = nombre_pages
            pdf = render_pdf('police/courriers/quittances.html', contexte)

            # AFFICHER DIRECTEMENT
            return HttpResponse(File(pdf), content_type='application/pdf')

        elif typefichier.id == 3:

            # Chemin du document Word
            doc_path = os.path.join(settings.BASE_DIR, 'production', 'templates', 'police', 'courriers',
                                    "4-quittances.docx")

            doc_path = r"{}".format(doc_path)  # Pour s'assurer que c'est bien une chaîne Unicode

            # Charger le document Word
            document = WordDocument(doc_path)

            # Définir les remplacements de base
            base_replacements = {
                'BUREAU_NOM': client.bureau.nom if client.bureau.nom else '',
                'BUREAU_ADRESSE': client.bureau.addresse if client.bureau.addresse else '',
                'BUREAU_SITUATION_GEOGRAPHIQUE': client.bureau.situation_geographique if client.bureau.situation_geographique else '',
                'BUREAU_TELEPHONE': client.bureau.telephone if client.bureau.telephone else '',
                'BUREAU_FAX': client.bureau.fax if client.bureau.fax else '',
                'BUREAU_EMAIL': client.bureau.email if client.bureau.email else '',
                'POLICE_NUMERO': police.numero if police.numero else '',
                'CLIENT_NOM': client.nom if client.nom else '',
                'CLIENT_PRENOMS': client.prenoms if client.prenoms else '',
                'PERIODE': f"PERIODE {periode_debut} - {periode_fin}" if periode_debut and periode_fin else '',
                'DEVICE': 'XOF',
                'TOTAL_QUITTANCES_IMPAYEES': format_montant(solde_quittances) if solde_quittances else '0',
                'TOTAL_COMPTE_CLIENT': format_montant(solde_acomptes) if solde_acomptes else '0',
                'RESTANT_A_PAYER': format_montant(
                    difference_acomptes_quittances) if difference_acomptes_quittances else '0',
                'LIBRE_TODAY': datetimes.today().strftime('%d/%m/%Y'),
                'LIBRE_TIMEDAY': heure_actuelle,
            }

            replacements = {}
            for key, value in base_replacements.items():
                formats = [
                    f'«{key}»', f'"{key}"', key
                ]
                for fmt in formats:
                    replacements[fmt] = str(value) if value else ""

            # Fonction pour remplacer le logo séparément
            def replace_logo_in_document(document, logo_path):
                if not logo_path:
                    return

                for paragraph in document.paragraphs:
                    if 'LOGO_SOC' in paragraph.text:
                        for run in paragraph.runs:
                            if 'LOGO_SOC' in run.text:
                                run.clear()
                                run.add_picture(logo_path, width=Inches(1.0))
                                break

                # Remplacer dans les en-têtes et les pieds de page également
                for section in document.sections:
                    # En-têtes
                    for paragraph in section.header.paragraphs:
                        if 'LOGO_SOC' in paragraph.text:
                            for run in paragraph.runs:
                                if 'LOGO_SOC' in run.text:
                                    run.clear()
                                    run.add_picture(logo_path, width=Inches(1.0))
                                    break

                    # Pieds de page
                    for paragraph in section.footer.paragraphs:
                        if 'LOGO_SOC' in paragraph.text:
                            for run in paragraph.runs:
                                if 'LOGO_SOC' in run.text:
                                    run.clear()
                                    run.add_picture(logo_path, width=Inches(1.0))
                                    break

            # Fonction pour remplacer les autres placeholders
            def replace_placeholders_in_paragraph(paragraph):
                original_text = paragraph.text
                new_text = original_text

                for placeholder, value in replacements.items():
                    if placeholder in new_text:
                        new_text = new_text.replace(placeholder, value)

                if new_text != original_text:
                    first_run = paragraph.runs[0] if paragraph.runs else paragraph.add_run()
                    first_run.text = new_text
                    for run in paragraph.runs[1:]:
                        run.clear()

            def replace_placeholders_in_document(document):
                for paragraph in document.paragraphs:
                    replace_placeholders_in_paragraph(paragraph)

                for table in document.tables:
                    for row in table.rows:
                        for cell in row.cells:
                            for paragraph in cell.paragraphs:
                                replace_placeholders_in_paragraph(paragraph)

                for section in document.sections:
                    for paragraph in section.header.paragraphs + section.footer.paragraphs:
                        replace_placeholders_in_paragraph(paragraph)
                    for table in section.header.tables + section.footer.tables:
                        for row in table.rows:
                            for cell in row.cells:
                                for paragraph in cell.paragraphs:
                                    replace_placeholders_in_paragraph(paragraph)

            def generate_document_response(document):
                response = HttpResponse(
                    content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                )
                response['Content-Disposition'] = 'attachment; filename="LISTE DES QUITTANCES.docx"'
                document.save(response)
                return response

            # Remplacement du logo

            if client.logo and hasattr(client.logo,
                                       'path') and os.path.isfile(
                client.logo.path):
                logo_path = client.logo.path
                replace_logo_in_document(document, logo_path)
            else:
                # Fonction pour remplacer le texte tout en conservant le format
                def remplacer_texte_avec_format(paragraphs, ancien_texte, nouveau_texte):
                    for para in paragraphs:
                        for run in para.runs:
                            if ancien_texte in run.text:
                                run.text = run.text.replace(ancien_texte, nouveau_texte)

                # Remplacer dans le corps du document
                remplacer_texte_avec_format(document.paragraphs, '«LOGO_SOC»', '')

                # Remplacer également dans les en-têtes (headers)
                for section in document.sections:
                    remplacer_texte_avec_format(section.header.paragraphs, '«LOGO_SOC»', '')

                # Remplacer également dans les pieds de page (footers)
                for section in document.sections:
                    remplacer_texte_avec_format(section.footer.paragraphs, '«LOGO_SOC»', '')

            # Remplacement des autres placeholders
            replace_placeholders_in_document(document)

            return generate_document_response(document)

        else:
            pass



def add_document(request, client_id):
    if request.method == "POST":

        form = DocumentForm(request.POST, request.FILES)

        if form.is_valid():

            police = Client.objects.get(id=client_id)
            type_document_id = request.POST.get('type_document')

            document = form.save(commit=False)
            document.client = client
            document.type_document = TypeDocument.objects.get(id=type_document_id)
            document.save()

            pprint("document.fichier")
            pprint(document.fichier.path)

            response = {
                'statut': 1,
                'message': _("Enregistrement effectue avec succes !"),
                'data': {
                    'id': document.pk,
                    'nom': document.nom,
                    'fichier': '<a href="' + document.fichier.url + '"><i class="fa fa-file" title="Aperçu"></i> Afficher</a>',
                    'type_document': document.type_document.libelle,
                    'confidentialite': document.confidentialite,
                }
            }

            return JsonResponse(response)

        else:

            response = {
                'statut': 0,
                'message': _("Veuillez renseigner correctement le formulaire !"),
                'errors': form.errors,
            }

            return JsonResponse(response)

    
    

@login_required
def add_document(request, client_id):
    if request.method == "POST":

        form = DocumentForm(request.POST, request.FILES)

        if form.is_valid():

            client = Client.objects.get(id=client_id)
            type_document_id = request.POST.get('type_document')

            # Use the ORM to create and update the Document instance
            document = form.save(commit=False)
            document.client = client
            document.type_document = TypeDocument.objects.get(id=type_document_id)
            document.save()

            pprint("document.fichier")

            response = {
                'statut': 1,
                'message': "Enregistrement effectué avec succès !",
                'data': {
                    'id': document.pk,
                    'nom': document.nom,
                    'fichier': '<a href="' + document.fichier.url + '"><i class="fa fa-file" title="Aperçu"></i> Afficher</a>',
                    'type_document': document.type_document.libelle,
                    'confidentialite': document.confidentialite,
                }
            }

            return JsonResponse(response)

        else:

            response = {
                'statut': 0,
                'message': "Veuillez renseigner correctement le formulaire !",
                'errors': form.errors,
            }

            return JsonResponse(response)

    
    
    
