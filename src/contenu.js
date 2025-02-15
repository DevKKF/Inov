//Création d'un secteur d'activité
$(document).on('click', "#btn_save_secteuractivite", function () {

    let formulaire = $('#form_add_secteuractivite');
    let href = formulaire.attr('action');

    $.validator.setDefaults({ ignore: [] });

    let formData = new FormData();

    if (formulaire.valid()) {

        //demander confirmation
        let n = noty({
            text: "Voulez-vous vraiment enregistrer ce secteur d'activité ?",
            type: 'warning',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                        $noty.close();

                        //confirmation obtenu

                        let data_serialized = formulaire.serialize();
                        $.each(data_serialized.split('&'), function (index, elem) {
                            let vals = elem.split('=');

                            let key = vals[0];
                            let valeur = decodeURIComponent(vals[1].replace(/\+/g, '  '));

                            formData.append(key, valeur);

                        });

                        $.ajax({
                            type: 'post',
                            url: href,
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (response) {

                                if (response.statut == 1) {

                                    notifySuccess(response.message, function () {
                                        location.reload();
                                    });

                                } else {

                                    let errors = JSON.parse(JSON.stringify(response.errors));
                                    let errors_list_to_display = '';
                                    for (field in errors) {
                                        errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                    }

                                    $('#modal-secteuractivite .alert .message').html(errors_list_to_display);

                                    $('#modal-secteuractivite .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                        $(this).slideUp(500);
                                    }).removeClass('alert-success').addClass('alert-warning');

                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur lors de l'enregistrement");
                            }

                        });

                        //fin confirmation obtenue

                    }
                },
                {
                    addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                        //confirmation refusée
                        $noty.close();

                    }
                }
            ]
        });
        //fin demande confirmation


    } else {

        $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

        let validator = formulaire.validate();

        $.each(validator.errorMap, function (index, value) {

            console.log('Id: ' + index + ' Message: ' + value);

        });

        notifyWarning('Veuillez renseigner correctement le forumulaire');
    }

});

//Modification d'un secteur d'activité
$(document).on('click', '.btn_modifier_secteuractivite', function () {

    let model_name = $(this).attr('data-model_name');
    let modal_title = $(this).attr('data-modal_title');
    let href = $(this).attr('data-href');

    $('#olea_std_dialog_box').load(href, function () {

        //appliquer le mask de saisie sur les champs montant
        AppliquerMaskSaisie();

        $('#modal-modification_secteuractivite').attr('data-backdrop', 'static').attr('data-keyboard', false);

        $('#modal-modification_secteuractivite').find('.modal-title').text(modal_title);
        $('#modal-modification_secteuractivite').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
        $('#modal-modification_secteuractivite').find('.modal-dialog').addClass('modal-lg').removeClass('modal-xl');

        //
        $('#modal-modification_secteuractivite').modal();

        //gestion du clique sur valider les modifications
        $("#btn_save_modification_secteuractivite").on('click', function () {

            let formulaire = $('#form_update_secteuractivite');
            let href = formulaire.attr('action');

            $.validator.setDefaults({ ignore: [] });

            let formData = new FormData();

            if (formulaire.valid()) {

                //demander confirmation
                let n = noty({
                    text: "Voulez-vous vraiment modifier ce secteur d'activité ?",
                    type: 'warning',
                    dismissQueue: true,
                    layout: 'center',
                    theme: 'defaultTheme',
                    buttons: [
                        {
                            addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                                $noty.close();

                                //confirmation obtenu

                                let data_serialized = formulaire.serialize();
                                $.each(data_serialized.split('&'), function (index, elem) {
                                    let vals = elem.split('=');

                                    let key = vals[0];
                                    let valeur = decodeURIComponent(vals[1].replace(/\+/g, '  '));

                                    formData.append(key, valeur);

                                });

                                $.ajax({
                                    type: 'post',
                                    url: href,
                                    data: formData,
                                    processData: false,
                                    contentType: false,
                                    success: function (response) {

                                        if (response.statut == 1) {

                                            notifySuccess(response.message, function () {
                                                location.reload();
                                            });

                                        } else {

                                            let errors = JSON.parse(JSON.stringify(response.errors));
                                            let errors_list_to_display = '';
                                            for (field in errors) {
                                                errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                            }

                                            $('#modal-modification_secteuractivite .alert .message').html(errors_list_to_display);

                                            $('#modal-modification_secteuractivite .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                $(this).slideUp(500);
                                            }).removeClass('alert-success').addClass('alert-warning');

                                        }

                                    },
                                    error: function (request, status, error) {

                                        notifyWarning("Erreur lors de l'enregistrement");
                                    }

                                });

                                //fin confirmation obtenue

                            }
                        },
                        {
                            addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                //confirmation refusée
                                $noty.close();

                            }
                        }
                    ]
                });

            } else {

                $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

                let validator = formulaire.validate();

                $.each(validator.errorMap, function (index, value) {

                    console.log('Id: ' + index + ' Message: ' + value);

                });

                notifyWarning('Veuillez renseigner tous les champs obligatoires');
            }

        });

    });

});

//Suppression d'un secteur d'activité
$(document).on('click', '.btn_supprimer_secteuractivite', function () {
    let modereglement_id = $(this).data('modereglement_id');
    let href = $(this).data('href');
    let n = noty({
        text: "Voulez-vous vraiment supprimer ce secteur d'activité ?",
        type: 'warning',
        dismissQueue: true,
        layout: 'center',
        theme: 'defaultTheme',
        buttons: [
            {
                addClass: 'btn btn-primary', text: 'Supprimer', onClick: function ($noty) {
                    $noty.close();

                    //effectuer la suppression
                    $.ajax({
                        url: href,
                        type: 'post',
                        data: { modereglement_id: modereglement_id },
                        success: function (response) {

                            notifySuccess(response.message, function () {
                                location.reload();
                            });

                        },
                        error: function () {
                            notifyWarning('Erreur lors de la suppression');
                        }
                    });

                }
            },
            {
                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                    //annuler la suppression
                    $noty.close();
                }
            }
        ]
    });
});





















































//TODO ANALYSE & CONTRÔLE
//Création d'un portefeuille par commercial
$(document).on('click', "#btn_save_portefeuille_commercial", function () {

    let formulaire = $('#form_add_portefeuille_comercial');
    let href = formulaire.attr('action');

    $.validator.setDefaults({ ignore: [] });

    let formData = new FormData();

    if (formulaire.valid()) {

        //demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment importer le portefeuille ?',
            type: 'warning',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                        $noty.close();

                        //confirmation obtenu

                        let data_serialized = formulaire.serialize();
                        $.each(data_serialized.split('&'), function (index, elem) {
                            let vals = elem.split('=');

                            let key = vals[0];
                            let valeur = decodeURIComponent(vals[1].replace(/\+/g, '  '));

                            formData.append(key, valeur);

                        });

                        $.ajax({
                            type: 'post',
                            url: href,
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (response) {

                                if (response.statut == 1) {

                                    let fileContent = response.data.file_base64;
                                    let filename = response.data.filename;

                                    // Créer un lien de téléchargement
                                    let link = document.createElement("a");
                                    link.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + fileContent;
                                    link.download = filename;

                                    // Ajouter le lien temporairement au DOM et le cliquer automatiquement
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);

                                    notifySuccess(response.message, function () {
                                        location.reload();
                                    });

                                }
                                if (response.statut == 0){
                                    notifyWarning(response.message);
                                }
                                else {

                                    let errors = JSON.parse(JSON.stringify(response.errors));
                                    let errors_list_to_display = '';
                                    for (field in errors) {
                                        errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                    }

                                    $('#modal-commercial .alert .message').html(errors_list_to_display);

                                    $('#modal-commercial .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                        $(this).slideUp(500);
                                    }).removeClass('alert-success').addClass('alert-warning');

                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur lors de l'enregistrement");
                            }

                        });

                        //fin confirmation obtenue

                    }
                },
                {
                    addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                        //confirmation refusée
                        $noty.close();

                    }
                }
            ]
        });
        //fin demande confirmation


    } else {

        $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

        let validator = formulaire.validate();

        $.each(validator.errorMap, function (index, value) {

            console.log('Id: ' + index + ' Message: ' + value);

        });

        notifyWarning('Veuillez renseigner correctement le forumulaire');
    }

});




//Récupération des polices
function chargementPoliceCommercialTable(commercialId) {
    $("#table_polices_commercial tbody").empty();
    $("#total_ht").text("");
    $("#total_ttc").text("");
    $("#btn_save_portefeuille_commercial").prop("disabled", true);

    $('#message-error').text('').hide();
    $('#message-warning').text('').hide();

    if (!commercialId) {
        $("#polices_commercial").hide();
        return;
    }

    $.ajax({
        url: "/analysecontrole/get_client_by_commercial/",
        type: "GET",
        data: { comercial_id: commercialId },
        success: function (data) {
            if (data && data.polices_par_commercial) {
                $("#polices_commercial").show();
                $("#table_polices_commercial tbody").empty();

                let total_ht = 0;
                let total_ttc = 0;

                for (const [commercial, polices] of Object.entries(data.polices_par_commercial)) {
                    let commercialHeader = `<tr><td colspan="8" class="fw-bold text-primary">${commercial}</td></tr>`;
                    $("#table_polices_commercial tbody").append(commercialHeader);

                    polices.forEach(police => {
                        total_ht += parseFloat(police.prime_ht.replace(/\s/g, '').replace(',', '.')) || 0;
                        total_ttc += parseFloat(police.prime_ttc.replace(/\s/g, '').replace(',', '.')) || 0;

                        let badgeClass = police.statut.includes("A renouveler") ? "badge-warning" :
                                         police.statut.includes("NON renouvelé") ? "badge-danger" :
                                         police.statut.includes("Résilié") ? "badge-yellow" :
                                         "badge-success";

                        let row = `
                            <tr>
                                <td>${police.nom} ${police.prenoms}</td>
                                <td>${police.numero}</td>
                                <td>${police.date_fin_effet}</td>
                                <td><span class="badge ${badgeClass}">${police.statut}</span></td>
                                <td>${police.date_creation}</td>
                                <td>${police.date_resiliation}</td>
                                <td>${police.prime_ht}</td>
                                <td>${police.prime_ttc}</td>
                            </tr>
                        `;
                        $("#table_polices_commercial tbody").append(row);
                    });
                }

                $("#total_ht").text(total_ht.toLocaleString("fr-FR"));
                $("#total_ttc").text(total_ttc.toLocaleString("fr-FR"));
                $("#btn_save_portefeuille_commercial").prop("disabled", false);
            }
        }
    });
}

$("#commercial").change(function () {
    let commercialId = $(this).find(":selected").data("comercial_id");

    if (commercialId) {
        chargementPoliceCommercialTable(commercialId);
    } else {
        $("#polices_commercial").hide(); // Masquer le bloc si aucun compercial n'est sélectionnée
    }
});
