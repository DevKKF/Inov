#------------------------PAYS----------------------------------

class PaysView(PermissionRequiredMixin,TemplateView):
    template_name = 'pays/pays.html'
    permission_required = "configurations.view_pays"
    model = Pays

    def get(self, request, *args, **kwargs):
        context_original = self.get_context_data(**kwargs)

        pays = Pays.objects.all().order_by('-id')

        context_perso = {'pays': pays}

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
def add_pays(request):

    if request.method == 'POST':

        # Créer une nouveau pays
        pays_created = Pays.objects.create(
            code=request.POST.get('code'),
            nom=request.POST.get('nom'),
            indicatif=request.POST.get('indicatif'),
            poligamie=request.POST.get('poligamie'),
            devise_id=request.POST.get('devise_id'),
            created_at=datetime.now(),
        )

        response = {
            'statut': 1,
            'message': "Enregistrement effectué avec succès !",
            'data': {
                'id': pays_created.pk,
                'libelle': pays_created.libelle,
            }
        }

        return JsonResponse(response)


@login_required
def modifier_pays(request, pays_id):

    pays = Pays.objects.get(id=pays_id)

    if request.method == 'POST':
        user = User.objects.get(id=request.user.id)

        Pays.objects.filter(id=pays_id).update(
            code=request.POST.get('code'),
            nom=request.POST.get('nom'),
            indicatif=request.POST.get('indicatif'),
            poligamie=request.POST.get('poligamie'),
            devise_id=request.POST.get('devise_id'),
        )
        response = {
            'statut': 1,
            'message': "Modification effectuée avec succès !",
            'data': {
                'id': pays.pk,
                'libelle': pays.libelle,
                'statut': pays.statut,
            }
        }

        return JsonResponse(response)

    else:
        devises = Devise.objects.all().order_by('libelle')
        return render(request, 'payss/modal_modifier_pays.html', {'pays': pays, 'devises': devises})


@login_required
def supprimer_pays(request, pays_id):
    if request.method == "POST":

        pays_id = request.POST.get('pays_id')
        print("pays id : ", pays_id)
        pays = Pays.objects.get(id=pays_id)
        if pays.pk is not None:

            pays.delete()

            response = {
                'statut': 1,
                'message': "Pays supprimé avec succès !",
            }

            return JsonResponse(response)

        else:

            response = {
                'statut': 0,
                'message': "Pays non trouvé !",
            }

            return JsonResponse(response)

#------------------------FIN PAYS----------------------------------
















































#
path('pays/', PaysView.as_view(), name='pays'),
path('pays/ajouter', views.add_pays, name='add_pays'),
path('pays/<int:pays_id>/modifier', views.modifier_pays, name='modifier_pays'),
path('pays/delete/<int:pays_id>/', views.supprimer_pays, name='supprimer_pays'),
