//Création du poste de dommage
$(document).on('click', "#btn_save_postedommage", function () {

    let formulaire = $('#form_add_postedommage');
    let href = formulaire.attr('action');

    $.validator.setDefaults({ ignore: [] });

    let formData = new FormData();

    if (formulaire.valid()) {

        //demander confirmation
        let n = noty({
            text: "Voulez-vous vraiment enregistrer ce poste de dommage ?",
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

                                    $('#modal-postedommage .alert .message').html(errors_list_to_display);

                                    $('#modal-postedommage .alert ').fadeTo(2000, 500).slideUp(500, function () {
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

//Modification du poste de dommage
$(document).on('click', '.btn_modifier_postedommage', function () {

    let model_name = $(this).attr('data-model_name');
    let modal_title = $(this).attr('data-modal_title');
    let href = $(this).attr('data-href');

    $('#olea_std_dialog_box').load(href, function () {

        //appliquer le mask de saisie sur les champs montant
        AppliquerMaskSaisie();

        $('#modal-modification_postedommage').attr('data-backdrop', 'static').attr('data-keyboard', false);

        $('#modal-modification_postedommage').find('.modal-title').text(modal_title);
        $('#modal-modification_postedommage').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
        $('#modal-modification_postedommage').find('.modal-dialog').addClass('modal-lg').removeClass('modal-xl');

        //
        $('#modal-modification_postedommage').modal();

        //gestion du clique sur valider les modifications
        $("#btn_update_postedommage").on('click', function () {

            let formulaire = $('#form_update_postedommage');
            let href = formulaire.attr('action');

            $.validator.setDefaults({ ignore: [] });

            let formData = new FormData();

            if (formulaire.valid()) {

                //demander confirmation
                let n = noty({
                    text: "Voulez-vous vraiment modifier ce poste de dommage ?",
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

                                            $('#modal-modification_postedommage .alert .message').html(errors_list_to_display);

                                            $('#modal-modification_postedommage .alert ').fadeTo(2000, 500).slideUp(500, function () {
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

//Suppression du poste de dommage
$(document).on('click', '.btn_supprimer_postedommage', function () {
    let postedommage_id = $(this).data('postedommage_id');
    let href = $(this).data('href');
    let n = noty({
        text: "Voulez-vous vraiment supprimer ce poste de dommage ?",
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
                        data: { postedommage_id: postedommage_id },
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












































































































































































































