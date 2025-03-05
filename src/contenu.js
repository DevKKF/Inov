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





































































































//********* FAIRE UN REGLEMENT ***********//

$("#btnOpenDialogAddReglement").on('click', function () {

    let model_name = $(this).data('model_name');
    let modal_title = $(this).data('modal_title');
    let href = $(this).data('href');

    $('#olea_std_dialog_box').load(href, function () {

        //appliquer le mask de saisie sur les champs montant
        AppliquerMaskSaisie();

        $('#modal-reglement').attr('data-backdrop', 'static').attr('data-keyboard', false);

        $('#modal-reglement').find('.modal-title').text(modal_title);
        $('#modal-reglement').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
        $('#modal-reglement').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

        //
        $('#modal-reglement').modal();

        //gestion des saisies des montants à regler
        $(document).on('change', '.checkbox_quittance_a_regler', function () {
            let input_montant_a_regler = $(this).closest('tr').find('.montant_a_regler');
            let solde_quittance = $(this).closest('tr').find('.solde_quittance').val();
            let input_solde_apres = $(this).closest('tr').find('.solde_apres');

            let input_montant_courtier_regle = $(this).closest('tr').find('.montant_courtier_regle');
            let montant_cout_police_courtier = $(this).closest('tr').find('.montant_cout_police_courtier').val();
            let input_solde_courtier_regle_apres = $(this).closest('tr').find('.solde_courtier_regle_apres');

            calculer_montant_total_a_regler();

            if (this.checked) {
                input_montant_a_regler.val(solde_quittance);
                input_solde_apres.val(0);
                input_montant_a_regler.removeAttr('readonly');
                input_montant_a_regler.attr('required', true);

                input_montant_courtier_regle.val(montant_cout_police_courtier);
                input_solde_courtier_regle_apres.val(0);
                input_montant_courtier_regle.removeAttr('readonly');
                input_montant_courtier_regle.attr('required', true);


                // Déclencher l'événement 'change' manuellement
                input_montant_a_regler.trigger('change');
                input_montant_courtier_regle.trigger('change');
            } else {
                input_montant_a_regler.val(0);
                input_solde_apres.val(solde_quittance);
                input_montant_a_regler.attr('readonly', true);
                input_montant_a_regler.removeAttr('required');

                input_montant_courtier_regle.val(0);
                input_solde_courtier_regle_apres.val(0);
                input_montant_courtier_regle.attr('readonly', true);
                input_montant_courtier_regle.removeAttr('required');

                // Déclencher l'événement 'change' manuellement
                input_montant_a_regler.trigger('change');
                input_montant_courtier_regle.trigger('change');
            }

        });

        //montant_a_regler
        $(document).on('change keyup', '.handle_calculer_montant_total_a_regler', function () {
            console.log('handle_calculer_montant_total_a_regler');
            calculer_montant_total_a_regler();

        });

        //montant_courtier_regle
        $(document).on('change keyup', '.handle_calculer_montant_courtier_regle', function () {
            console.log('handle_calculer_montant_courtier_regle');
            calculer_montant_total_a_regler();

        });

        //champs obligatoires variables selon le mode de règlement
        $(document).on('change', '#mode_reglement', function () {
            //si espèce
            if ($(this).val() == 1) {
                $('#numero_piece').removeAttr('required');
                $('#banque').removeAttr('required');
                $('#libelle_numero_piece_required').html('');
                $('#libelle_banque_required').html('');
            } else {
                $('#numero_piece').attr('required', true);
                // $('#banque').attr('required', true);
                $('#libelle_numero_piece_required').html('*');
                // $('#libelle_banque_required').html('*');
            }

        });

        //enregistrement
        $('#btn_save_reglement').on('click', function () {

            let btn_save_reglement = $(this);

            let formulaire = $('#form_add_reglement');
            let href = formulaire.attr('action');

            $.validator.setDefaults({ ignore: [] });

            if (formulaire.valid()) {

                //désactiver le bouton Valider, pour empecher une double soumission du formulaire
                btn_save_reglement.attr('disabled', true);

                //demander confirmation
                let n = noty({
                    text: 'Voulez-vous vraiment effectuer ce règlement ?',
                    type: 'warning',
                    dismissQueue: true,
                    layout: 'center',
                    theme: 'defaultTheme',
                    buttons: [
                        {
                            addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                                $noty.close();

                                //confirmation obtenu
                                $.ajax({
                                    type: 'post',
                                    url: href,
                                    data: formulaire.serialize(),
                                    success: function (response) {

                                        if (response.statut == 1) {

                                            location.reload();

                                        } else {

                                            let errors = JSON.parse(JSON.stringify(response.errors));
                                            let errors_list_to_display = '';
                                            for (field in errors) {
                                                errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                            }

                                            $('#modal-reglement .alert .message').html(errors_list_to_display);

                                            $('#modal-reglement .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                $(this).slideUp(500);
                                            }).removeClass('alert-success').addClass('alert-warning');

                                        }

                                    },
                                    error: function (request, status, error) {

                                        notifyWarning("Erreur lors de l'enregistrement");

                                        btn_save_reglement.removeAttr('disabled');

                                    }

                                });

                                //fin confirmation obtenue

                            }
                        },
                        {
                            addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                //confirmation refusée
                                $noty.close();

                                btn_save_reglement.removeAttr('disabled');

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

                notifyWarning('Veuillez renseigner tous les champs obligatoires');

                btn_save_reglement.removeAttr('disabled');

            }


        });

    });

});

function calculer_montant_total_a_regler() {

    let montant_total_a_regler = 0;

    $('.montant_a_regler').each(function (element) {

        let montant_a_regler = parseFloat($(this).val().replaceAll(' ', ''));
        let solde_quittance = $(this).closest('tr').find('.solde_quittance').val();
        let solde_apres = solde_quittance;//init

        if (montant_a_regler > 0 && montant_a_regler <= solde_quittance) {

            console.log(montant_a_regler + ' réglé sur ' + solde_quittance);
            montant_total_a_regler = montant_total_a_regler + montant_a_regler;

            solde_apres = solde_quittance - montant_a_regler;

            //console.log(montant_total_a_regler);

        } else {
            solde_apres = solde_quittance;
            $(this).val('0');
        }

        $(this).closest('tr').find('.solde_apres').val(solde_apres);

    });

    $('.montant_courtier_regle').each(function (element) {

        let montant_courtier_regle = parseFloat($(this).val().replaceAll(' ', ''));
        let solde_cout_police_courtier = $(this).closest('tr').find('.montant_cout_police_courtier').val();
        let solde_courtier_regle_apres = solde_cout_police_courtier;//init

        if (montant_courtier_regle > 0 && montant_courtier_regle <= solde_cout_police_courtier) {

            console.log(montant_courtier_regle + ' réglé sur ' + solde_cout_police_courtier);
            montant_total_a_regler = montant_total_a_regler + montant_courtier_regle;

            solde_courtier_regle_apres = solde_cout_police_courtier - montant_courtier_regle;

            //console.log(montant_total_a_regler);

        } else {
            solde_courtier_regle_apres = solde_cout_police_courtier;
            $(this).val('0');
        }

        $(this).closest('tr').find('.solde_courtier_regle_apres').val(solde_courtier_regle_apres);

    });

    $('.montant_total_a_regler').val(montant_total_a_regler);

    if (montant_total_a_regler > 0) {
        $('#btn_save_reglement').removeAttr('disabled');
    } else {
        $('#btn_save_reglement').attr('disabled', 'true');
    }

}

//********* FIN FAIRE UN REGLEMENT ***********//




