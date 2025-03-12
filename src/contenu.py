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

from decimal import Decimal, InvalidOperation


@csrf_exempt
def sauvegarder_provisions_depuis_session(request):
    if request.method == "POST":
        try:


            return JsonResponse({"success": True, "message": "Données enregistrées avec succès"})

        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    return JsonResponse({"success": False, "message": "Méthode non autorisée"}, status=400)



detail_url = reverse('details_dossier_sinistre', args=[c.dossier_sinistre.id]) if c.dossier_sinistre else None # URL to the detail view# URL to the detail view
        actions_html = f'<a href="{detail_url}" class="text-center"><span class="badge btn-sm btn-details rounded-pill"><i class="fa fa-eye"></i> {_("Détails")}</span></a>&nbsp;&nbsp;'



























































