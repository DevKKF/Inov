#------------------------POSTE DE DOMMAGE----------------------------------

class PosteDommageView(PermissionRequiredMixin,TemplateView):
    template_name = 'postedommages/postedommage.html'
    permission_required = "configurations.view_poste_dommage"
    model = PosteDommage

    def get(self, request, *args, **kwargs):
        context_original = self.get_context_data(**kwargs)

        postedommages = PosteDommage.objects.all().order_by('-id')

        context_perso = {'postedommages': postedommages}

        context = {**context_original, **context_perso}

        return self.render_to_response(context)

    def post(self):
        pass

    def get_context_data(self, **kwargs):
        pprint(kwargs)
        return {
            **super().get_context_data(**kwargs),
            **admin.site.each_context(self.request),
            "opts": self.model._meta,
        }


@login_required
def add_postedommage(request):

    if request.method == 'POST':

        # Créer une nouveau poste de dommage
        postedommage_created = PosteDommage.objects.create(
            libelle=request.POST.get('libelle'),
            statut=request.POST.get('statut'),
            created_at=datetime.now(),
        )

        response = {
            'statut': 1,
            'message': "Enregistrement effectué avec succès !",
            'data': {
                'id': postedommage_created.pk,
                'libelle': postedommage_created.libelle,
            }
        }

        return JsonResponse(response)


@login_required
def modifier_postedommage(request, postedommage_id):

    postedommage = PosteDommage.objects.get(id=postedommage_id)

    if request.method == 'POST':
        user = User.objects.get(id=request.user.id)

        PosteDommage.objects.filter(id=postedommage_id).update(
            libelle=request.POST.get('libelle'),
            statut=request.POST.get('statut'),
            updated_at=datetime.now(),
        )
        response = {
            'statut': 1,
            'message': "Modification effectuée avec succès !",
            'data': {
                'id': postedommage.pk,
                'libelle': postedommage.libelle,
            }
        }

        return JsonResponse(response)

    else:
        return render(request, 'postedommages/modal_modifier_postedommage.html', {'postedommage': postedommage})


@login_required
def supprimer_postedommage(request, postedommage_id):
    if request.method == "POST":

        postedommage_id = request.POST.get('postedommage_id')
        print("postedommage id : ", postedommage_id)
        postedommage = PosteDommage.objects.get(id=postedommage_id)
        if postedommage.pk is not None:

            postedommage.delete()

            response = {
                'statut': 1,
                'message': "Poste de dommage supprimé avec succès !",
            }

            return JsonResponse(response)

        else:

            response = {
                'statut': 0,
                'message': "Poste de dommage non trouvé !",
            }

            return JsonResponse(response)

#------------------------FIN POSTE DE DOMMAGE----------------------------------




#
path('postedommage/', PosteDommageView.as_view(), name='postedommage'),
path('postedommage/ajouter', views.add_postedommage, name='add_postedommage'),
path('postedommage/<int:postedommage_id>/modifier', views.modifier_postedommage, name='modifier_postedommage'),
path('postedommage/delete/<int:postedommage_id>/', views.supprimer_postedommage, name='supprimer_postedommage'),































































































































































































































































































@property
def police_dernier_historique(self, date_du_jour=None):

    historique = HistoriquePolice.objects.filter(police_id=self.id).order_by('-date_du_jour').first()

    print("historique", historique)

    return historique


def controlecommission_datatable(request):
    items_per_page = 10
    page_number = request.GET.get('page')
    start = int(request.GET.get('start', 0))
    length = int(request.GET.get('length', items_per_page))
    sort_column_index = int(request.GET.get('order[0][column]', 0))
    sort_direction = request.GET.get('order[0][dir]', 'asc')

    search_compagnie = request.GET.get('search_compagnie', '').strip()
    search_commercial = request.GET.get('search_commercial', '').strip()
    search_business_unit = request.GET.get('search_business_unit', '').strip()
    search_branche = request.GET.get('search_branche', '').strip()

    nom_compagnie = ""
    nom_commercial = ""

    if not (search_compagnie or search_commercial or search_business_unit or search_branche):
        return JsonResponse({
            "data": [],
            "recordsTotal": 0,
            "recordsFiltered": 0,
            "draw": int(request.GET.get('draw', 1)),
            "show_import_button": False
        })

    subquery = HistoriquePolice.objects.filter(
        police=OuterRef('id')
    ).values('police_id')

    if search_compagnie and search_compagnie != "TOUT":
        if search_compagnie != "AUCUN":
            compagnie = Compagnie.objects.filter(id=search_compagnie).first()
            nom_compagnie = compagnie.nom if compagnie else ''
            subquery = subquery.filter(police_assureurs__compagnie_id=search_compagnie)
        else:
            subquery = subquery.exclude(police_assureurs__compagnie__isnull=False)

    if search_commercial and search_commercial != "TOUT":
        if search_commercial != "AUCUN":
            subquery = subquery.filter(police__commercial__id=search_commercial)
        else:
            subquery = subquery.exclude(police__commercial__isnull=False)

    queryset = Police.objects.filter(id__in=Subquery(subquery))

    if search_business_unit and search_business_unit != "TOUT":
        if search_business_unit != "AUCUN":
            queryset = queryset.filter(client__business_unit__id=search_business_unit)
        else:
            queryset = queryset.exclude(client__business_unit__isnull=False)

    if search_branche:
        queryset = queryset.filter(produit__branche__id=search_branche)

    if sort_direction == 'asc':
        queryset = queryset.order_by('numero')
    else:
        queryset = queryset.order_by('-numero')

    paginator = Paginator(queryset, length)
    page_obj = paginator.get_page(page_number)

    data = []
    for c in page_obj:
        detail_url = reverse('police.details', args=[c.id])
        numero_html = f'<a href="{detail_url}" class="text-center bouton_action" style="color:#F16623;" target="_blank">{c.numero}</a>'
        nom_client = f"{c.client.nom or ''} {c.client.prenoms or ''} - ({c.client.code or ''})"
        nom_com = f"{c.commercial.first_name} {c.commercial.last_name}" if c.commercial else ''

        data.append({
            "id": c.id,
            "nom_client": nom_client.strip(),
            "numero_police": numero_html,
            "nom_produit": c.produit.nom if c.produit else "",
            "nom_compagnie": nom_compagnie,
            "nom_commercial": nom_com,
            "date_echeance": c.police_dernier_historique.date_fin_effet if c.police_dernier_historique else "",
            "comission_compagnie": money_field(
                c.police_dernier_historique.cout_police_compagnie if c.police_dernier_historique else 0),
            "comission_apporteur": money_field(
                c.police_dernier_historique.commission_intermediaires if c.police_dernier_historique else 0),
        })

    return JsonResponse({
        "data": data,
        "recordsTotal": queryset.count(),
        "recordsFiltered": paginator.count,
        "draw": int(request.GET.get('draw', 1)),
        "show_import_button": True if data else False
    })



