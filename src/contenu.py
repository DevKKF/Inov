#------------------------SECTEUR D'ACTIVITE----------------------------------

class SecteurActiviteView(PermissionRequiredMixin,TemplateView):
    template_name = 'secteur_activite/secteur_activite.html'
    permission_required = "configurations.view_secteuractivite"
    model = SecteurActivite

    def get(self, request, *args, **kwargs):
        context_original = self.get_context_data(**kwargs)

        secteuractivites = SecteurActivite.objects.all().order_by('-id')

        context_perso = {'secteuractivites': secteuractivites}

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
def add_secteur_activite(request):

    if request.method == 'POST':

        # Créer une nouveau secteur d'activité
        secteur_activite_created = SecteurActivite.objects.create(
            libelle=request.POST.get('libelle'),
            status=request.POST.get('status'),
            created_at=datetime.now(),
        )

        response = {
            'statut': 1,
            'message': "Enregistrement effectué avec succès !",
            'data': {
                'id': secteur_activite_created.pk,
                'libelle': secteur_activite_created.libelle,
            }
        }

        return JsonResponse(response)


@login_required
def modifier_secteur_activite(request, secteur_activite_id):

    secteuractivite = SecteurActivite.objects.get(id=secteur_activite_id)

    if request.method == 'POST':
        user = User.objects.get(id=request.user.id)

        SecteurActivite.objects.filter(id=secteur_activite_id).update(
            libelle=request.POST.get('libelle'),
            status=request.POST.get('status'),
        )
        response = {
            'statut': 1,
            'message': "Modification effectuée avec succès !",
            'data': {
                'id': secteuractivite.pk,
                'libelle': secteuractivite.libelle,
                'statut': secteuractivite.status,
            }
        }

        return JsonResponse(response)

    else:
        return render(request, 'secteur_activite/modal_modifier_secteur_activite.html', {'secteuractivite': secteuractivite})


@login_required
def supprimer_secteur_activite(request, secteur_activite_id):
    if request.method == "POST":

        secteur_activite_id = request.POST.get('secteur_activite_id')
        print("secteur activite id : ", secteur_activite_id)
        secteuractivite = SecteurActivite.objects.get(id=secteur_activite_id)
        if secteuractivite.pk is not None:

            secteuractivite.delete()

            response = {
                'statut': 1,
                'message': "Secteur d'activité supprimé avec succès !",
            }

            return JsonResponse(response)

        else:

            response = {
                'statut': 0,
                'message': "Secteur d'activité non trouvé !",
            }

            return JsonResponse(response)

#------------------------FIN SECTEUR D'ACTIVITE----------------------------------




#
path('secteur_activite/', SecteurActiviteView.as_view(), name='secteur_activite'),
path('secteur_activite/ajouter', views.add_secteur_activite, name='add_secteur_activite'),
path('secteur_activite/<int:secteur_activite_id>/modifier', views.modifier_secteur_activite, name='modifier_secteur_activite'),
path('secteur_activite/delete/<int:secteur_activite_id>/', views.supprimer_secteur_activite, name='supprimer_secteur_activite'),
























































































