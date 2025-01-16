$(document).ready(function () {

    //$('.onglets_sante_uniquement').hide();//Commented on 20102023: Appli uniquement santé
    function alert_pop() {
        alert("open modal benef");
    }
    //dérouler le menu prise en charge
    //$('.nav-item nav-item_reglements-apporteurs').hide();
    //$('.nav-item_liste-des-prises-en-charge').closest('ul').find('p').closest('a').first().addClass('active');

    //var menuItem = $('.nav-item_liste-des-prises-en-charge').closest('ul').closest('li').addClass('menu-is-opening menu-open');

    //
    if (typeof $.fn.select2 === 'function') {

        $('.tags-multiple_affection_soins_amb').select2();
        $('.tags-multiple').select2();
        $('#affection_id').select2();
        $('.form-beneficiaire-select').select2();
        $('.tags-multiple_affection').select2();
        $('.tags-multiple_affection_sa').select2();
        $('.tags-multiple_affection_hospit').select2();
        $('.liste_medicament').select2({
            placeholder: 'Sélectionner un médicament',
            width: '100%',
            dropdownAutoWidth: true
        });
        $('#form_add_sinistre_soins_ambulatoires #affection_id').select2();
        $('#affection_id').select2();
        $('#code_affection_detail_ds').select2();



        /*$('.select').select2();
        $('select:not(.not_select2)').select2();
        */

        $('.select2-container').css({
            'width': '100%'
        });
        $('.select2-container--default').css({
            'color': 'black'
        });
        $('.select2-container--multiple').css({
            'color': 'black'
        });
        $('.select2-container__choice').css({
            'color': 'black'
        });
    }

    //init datatables
    $('.dataTable:not(.customDataTable)').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
        },
        order: [[0, 'desc']],
        lengthMenu: [
            [100, 250, 500, -1],
            [100, 250, 500, 'Tout'],
        ]
    });


    //    //liste pour les autres:ordre décroissant
    //    $('#table_dossiers_sinistre').DataTable({
    //        "language": {
    //            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
    //        },
    //        order: [[0, 'desc']],
    //        lengthMenu: [
    //            [100, 250, 500, -1],
    //            [100, 250, 500, 'Tout'],
    //        ]
    //    });
    //
    //    //liste pour medecin:ordre croissant
    //    $('#table_dossiers_sinistre_med').DataTable({
    //        "language": {
    //            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
    //        },
    //        order: [[0, 'asc']],
    //        lengthMenu: [
    //            [100, 250, 500, -1],
    //            [100, 250, 500, 'Tout'],
    //        ]
    //    });


    /*
    //init datatables
    $('.dataTable:not(.customDataTable)').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
        },
        order: [[0, 'desc']],
        lengthMenu: [
            [100, 250, 500, -1],
            [100, 250, 500, 'Tout'],
        ]
    });

    $('.dataTable:not(.customDataTable2)').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
        },
        // order: [[6, 'desc']],
        lengthMenu: [
            [100, 250, 500, -1],
            [100, 250, 500, 'Tout'],
        ]
    });

    // Custom 2 order date
    $('#table_dossiers_sinistre2_med').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
        },
        order: [[6, 'desc']],
        lengthMenu: [
            [100, 250, 500, -1],
            [100, 250, 500, 'Tout'],
        ]
    });

    //liste pour medecin:ordre croissant
    $('#table_dossiers_sinistre_med').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
        },
        order: [[0, 'asc']],
        lengthMenu: [
            [100, 250, 500, -1],
            [100, 250, 500, 'Tout'],
        ]
    });
    */

    $('#table_apporteurs_details_police').DataTable({
        order: [[0, 'desc']],
        sDom: "<'row'<'col-sm-6'>>t<'row'<'col-sm-6'><'col-sm-6'>>",
        paging: true,
        searching: true,
        lengthChange: true,
    });


    if ($('#accordionClient').length) {
        showCurentTab();
    } else {
        localStorage.removeItem('active_button');
        localStorage.removeItem('active_collapse');
    }

    //init modal-add-sinistre-autre
    //hideAndEmptyOrShowSibbling("varAlimentSinistreAutre", "form_add_sinistre_autre","hide");


    // using jQuery
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie != '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    $.ajaxSetup({ headers: { "X-CSRFToken": csrftoken } });


    $(document).on('click', "#accordionClient .info-box", function () {

        //sauvegarder pour afficher le meme onglet si on recharge/actualise la page
        localStorage.setItem("active_button", $(this).attr('id'));
        localStorage.setItem("active_collapse", $(this).attr('href'));

        //Afficher l'onglet sélectionné
        showCurentTab();


    });


    function ucfirst(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    //Afficher le contenu de l'onglet actif
    function showCurentTab() {

        let active_button = localStorage.getItem("active_button");
        let active_collapse = localStorage.getItem("active_collapse");

        if (active_button != null && active_collapse != null) {

            //les libellés
            $("#accordionClient .info-box").removeClass('active');

            $('#' + active_button).addClass('active');


            //les contenus
            $("#accordionClient .collapse").hide();

            $(active_collapse).show();

        }

    }


    //****************** INTERFACE CLIENT ******************//

    //----------- AJOUT, MODIFICATION DU CLIENT ------------//

    //ajout d'un client
    //gestion selection type personne (morale, physique)
    function manage_type_personne_change() {

        let type_personne_id = parseInt($('#modal-client #type_personne_id').val());

        $('.champ_variable_client').hide();
        $('.champ_variable_client input').removeAttr('required')
        $('.champ_variable_client select').removeAttr('required')

        switch (type_personne_id) {
            default:
            case 1://personne physique
                $('.if_personne_physique').show();
                $('.if_personne_physique input').attr('required', 'required');
                $('.if_personne_physique select').attr('required', 'required');
                $('#date_naissance').closest('.form-group').show();
                $('#date_creation').closest('.form-group').hide();
                break;
            case 2://personne morale
                $('.if_personne_morale').show();
                $('.if_personne_morale input').attr('required', 'required');
                $('.if_personne_morale select').attr('required', 'required');
                $('#date_naissance').closest('.form-group').hide();
                $('#date_creation').closest('.form-group').show();
                break;
        }
    }

    manage_type_personne_change();
    $(document).on('change', "#modal-client #type_personne_id", function () {
        manage_type_personne_change();
    });

    //modification
    function manage_type_personne_change_modification() {

        let type_personne_id = parseInt($('#modal-modification_client #type_personne_id').val());

        $('.champ_variable_client').hide();
        $('.champ_variable_client input').removeAttr('required')
        $('.champ_variable_client select').removeAttr('required')

        switch (type_personne_id) {
            default:
            case 1://personne physique
                $('.if_personne_physique').show();
                $('.if_personne_physique input').attr('required', 'required');
                $('.if_personne_physique select').attr('required', 'required');
                $('#date_naissance').closest('.form-group').show();
                $('#date_creation').closest('.form-group').hide();
                break;
            case 2://personne morale
                $('.if_personne_morale').show();
                $('.if_personne_morale input').attr('required', 'required');
                $('.if_personne_morale select').attr('required', 'required');
                $('#date_naissance').closest('.form-group').hide();
                $('#date_creation').closest('.form-group').show();
                break;
        }
    }

    manage_type_personne_change_modification();
    $(document).on('change', "#modal-modification_client #type_personne_id", function () {
        manage_type_personne_change_modification();
    });



    $(document).on('click', "#btn_save_client", function () {

        let formulaire = $('#form_add_client');
        let href = formulaire.attr('action');

        $.validator.setDefaults({ ignore: [] });

        let formData = new FormData();
        let files = $('#form_add_client #logo_client')[0].files;

        if (formulaire.valid()) {

            //demander confirmation
            let n = noty({
                text: 'Voulez-vous vraiment enregistrer ce client ?',
                type: 'warning',
                dismissQueue: true,
                layout: 'center',
                theme: 'defaultTheme',
                buttons: [
                    {
                        addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                            $noty.close();

                            //confirmation obtenu

                            if (files.length > 0) {
                                formData.append('logo_client', files[0]);
                            }

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

                                        /*
                                        let client = response.data;

                                        let t = $('#table_clients').DataTable();

                                        t.row.add([
                                                    client.nom + ' ' + client.prenoms,
                                                    client.type_client,
                                                    client.type_personne,
                                                    client.ville,
                                                    client.created_at,
                                                    client.statut,
                                                    '<span></span>',
                                                    ])
                                                    .draw(false);
                                                    */

                                        //Vider le formulaire
                                        resetFields('#' + formulaire.attr('id'));

                                        location.reload();

                                    } else {

                                        let errors = JSON.parse(JSON.stringify(response.errors));
                                        let errors_list_to_display = '';
                                        for (field in errors) {
                                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                        }

                                        $('#modal-client .alert .message').html(errors_list_to_display);

                                        $('#modal-client .alert ').fadeTo(2000, 500).slideUp(500, function () {
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


    //fin ajout d'un client


    //modification d'un client
    $(document).on('click', '.btn_modifier_client', function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        $('#olea_std_dialog_box').load(href, function () {

            manage_type_personne_change_modification();

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-modification_client').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-modification_client').find('.modal-title').text(modal_title);
            $('#modal-modification_client').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-modification_client').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-modification_client').modal();

            //gestion du clique sur valider les modifications
            $("#btn_save_modification_client").on('click', function () {

                let formulaire = $('#form_update_client');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                let formData = new FormData();
                let files = $('#form_update_client #logo_client')[0].files;

                if (formulaire.valid()) {

                    //demander confirmation
                    let n = noty({
                        text: 'Voulez-vous vraiment modifier ce client ?',
                        type: 'warning',
                        dismissQueue: true,
                        layout: 'center',
                        theme: 'defaultTheme',
                        buttons: [
                            {
                                addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                                    $noty.close();

                                    //confirmation obtenu

                                    if (files.length > 0) {
                                        formData.append('logo', files[0]);
                                    }

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

                                                $('#modal-modification_client .alert .message').html(errors_list_to_display);

                                                $('#modal-modification_client .alert ').fadeTo(2000, 500).slideUp(500, function () {
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

                    notifyWarning('Veuillez renseigner tous les champs obligatoires');
                }


            });


        });


    });

    //fin modification d'un client

    //suppression un client
    $(document).on('click', '.btn_supprimer_client', function () {
        let client_id = $(this).data('client_id');

        let n = noty({
            text: 'Voulez-vous vraiment supprimer ce client ?',
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
                            url: '/production/client/delete',
                            type: 'post',
                            data: { client_id: client_id },
                            success: function (e) {

                                location.reload();

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
    //fin suppression d'un client


    //----------- FIN AJOUT, MODIFICATION DU CLIENT ------------//



    //----------------- AJOUT DE CONTACT ------------------//
    // TODO AJOUT DE CONTACT DU CLIENT
    //Ajout contact
    $("#btn_enregistrer_contact_client").on('click', function () {

        let btn_enregistrer_contact_client = $(this);

        let formulaire = $('#form_contact_client');

        $.validator.setDefaults({ ignore: [] });

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: $('#form_contact_client').serialize(),
                beforeSend: function () {
                    $('#loading_gif').show();
                    btn_enregistrer_contact_client.hide();
                },
                success: function (response) {

                    $('#loading_gif').hide();
                    //btn_enregistrer_contact_client.hide();

                    if (response.statut == 1) {

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (response) {
                    console.log(response);
                    btn_enregistrer_contact_client.show();
                }
            });

        } else {
            let validator = formulaire.validate();
            notifyWarning("Veuillez renseigner tout les champs obligatoire");
        }

    });

    //Standard: ouvrir les popups de modification
    $(document).on("click", ".btn_modifier_on_modal", function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        $('#modal-dynamique').find('.modal-title').text(modal_title);
        $('#modal-dynamique').find('#btn_valider_modification').attr({ 'data-model_name': model_name, 'data-href': href });

        $('#modal-dynamique').modal({ backdrop: "static ", keyboard: false }).find('.modal-body').text("Chargement en cours...").load(href);

    });

    //Valider les modifications
    //$("#btn_valider").on('click', function(){
    $(document).on("click", "#btn_valider_modification", function (e) {
        e.stopPropagation();

        let model_name = $(this).attr('data-model_name');
        let href = $(this).attr('data-href');
        let formulaire = $('#modal-dynamique').find('form');

        switch (model_name) {

            case 'document':

                let formData = new FormData();
                let files = $('#modal-dynamique #fichier')[0].files;
                let type_document = $('#modal-dynamique #type_document').val();
                let nom = $('#modal-dynamique #nom').val();
                let confidentialite = $('#modal-dynamique #confidentialite').val();
                let commentaire = $('#modal-dynamique #commentaire').val();

                $.validator.setDefaults({ ignore: [] });
                if (formulaire.valid()) {

                    //formData.append('client_id', client_id);
                    formData.append('fichier', files[0]);
                    formData.append('type_document', type_document);
                    formData.append('nom', nom);
                    formData.append('confidentialite', confidentialite);
                    formData.append('commentaire', commentaire);

                    $.ajax({
                        type: 'post',
                        url: href,
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (response) {

                            if (response.statut == 1) {

                                notifySuccess(response.message);
                                //location.reload();

                            } else {

                                let errors = JSON.parse(JSON.stringify(response.errors));
                                let errors_list_to_display = '';
                                for (field in errors) {
                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                }

                                $('#modal-dynamique .alert .message').html(errors_list_to_display);

                                $('#modal-dynamique .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                    $(this).slideUp(500);
                                }).removeClass('alert-success').addClass('alert-warning');

                            }

                        },
                        error: function () {

                        }
                    });

                } else {
                    notifyWarning('Veuillez renseigner tous les champs obligatoires');
                }


                break;

            default:

                $.ajax({
                    url: href,
                    type: 'post',
                    data: formulaire.serialize(),
                    success: function (response) {

                        if (response.statut == 1) {

                            $('#modal-dynamique .alert .message').text(response.message);

                            $('#modal-dynamique .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                $(this).slideUp(500);
                                $("#modal-dynamique").modal('toggle');

                                notifySuccess(response.message);
                                location.reload();

                            }).removeClass('alert-warning').addClass('alert-success');

                        } else {

                            $('#modal-dynamique .alert .message').text(response.message);

                            $('#modal-dynamique .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                $(this).slideUp(500);
                            }).removeClass('alert-success').addClass('alert-warning');

                        }

                    },
                    error: function () {
                        notifyWarning('Erreur lors de la modification');
                    }
                });

                break;

        }

    });


    // Suppression d'un contact
    $(document).on('click', '.btn_supprimer_contact', function () {
        let contact_id = $(this).data('contact_id');

        let n = noty({
            text: 'Voulez-vous vraiment supprimer ce contact ?',
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
                            url: '/production/client/delete',
                            type: 'post',
                            data: { contact_id: contact_id },
                            success: function (e) {

                                location.reload();

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


    //----------------- FIN AJOUT DE CONTACT ------------------//


    //----------------- AJOUT DE FILIALE ------------------//
    /*$(document).on('click', "#modal-filiale #btn_save_filiale", function () {

        let client_id = $("#modal-filiale #client_id").val();

        $.ajax({
            type: 'post',
            url: '/production/client/' + client_id + '/filiale/add',
            data: $("#modal_form_filiale").serialize(),
            success: function (response) {

                if (response.statut == 1) {

                    //mettre à jour le tableau
                    let filiale = response.data;
                    let t = $('#table_filiales').DataTable();
                    t.row.add([filiale.nom, filiale.pays, filiale.ville, filiale.adresse, '<td class=""><span class="btn_supprimer_filiale" data-filiale_id="' + filiale.id + '" onClick="supprimer_filiale(' + filiale.id + ')" style="cursor:pointer;"><i class="fa fa-times text-danger"></i></span>&nbsp;&nbsp;&nbsp;<span class="btn_modifier_on_modal" data-modal_title="Modification d\'une filiale" data-model_name="filiale" data-href="/production/filiale/' + filiale.id + '/modifier" title="Modifier" style="cursor:pointer;"><i class="fas fa-edit text-warning"></i></span></td>']).draw(false);

                    //Afficher le message de succès et fermer la fenêtre
                    $("#modal_form_filiale input[type=text]").val("");
                    $("#modal_form_filiale input[type=email]").val("");
                    $("#modal_form_document select").prop('selectedIndex', 0);

                    $('#modal_form_filiale .alert .message').text(response.message);

                    $('#modal_form_filiale .alert ').fadeTo(2000, 500).slideUp(500, function () {
                        $(this).slideUp(500);
                        $("#modal-filiale").modal('toggle');
                    }).removeClass('alert-warning').addClass('alert-success');

                } else {

                    $('#modal_form_filiale .alert .message').text(response.message);

                    $('#modal_form_filiale .alert ').fadeTo(2000, 500).slideUp(500, function () {
                        $(this).slideUp(500);
                    }).removeClass('alert-success').addClass('alert-warning');

                }


            },
            error: function () {

                $('#modal_form_filiale .alert .message').text("Erreur lors de l'enregistrement !");

                $('#modal_form_filiale .alert ').fadeTo(2000, 500).slideUp(500, function () {
                    $(this).slideUp(500);
                }).removeClass('alert-success').addClass('alert-warning');

            }
        });

    });*/

    // TODO AJOUT DE FILIALE DU CLIENT
    //Ajout filiale
    $("#btn_enregistrer_filiale_client").on('click', function () {

        let btn_enregistrer_filiale_client = $(this);

        let formulaire = $('#form_filiale_client');

        $.validator.setDefaults({ ignore: [] });

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: $('#form_filiale_client').serialize(),
                beforeSend: function () {
                    $('#loading_gif').show();
                    btn_enregistrer_filiale_client.hide();
                },
                success: function (response) {

                    $('#loading_gif').hide();
                    //btn_enregistrer_filiale_client.hide();

                    if (response.statut == 1) {

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (response) {
                    console.log(response);
                    btn_enregistrer_filiale_client.show();
                }
            });

        } else {
            let validator = formulaire.validate();
            notifyWarning("Veuillez renseigner tout les champs obligatoire");
        }

    });

    $(document).on('click', '.btn_supprimer_filiale', function () {
        let filiale_id = $(this).data('filiale_id');

        let n = noty({
            text: 'Voulez-vous vraiment supprimer cette filiale ?',
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
                            url: '/production/filiale/delete',
                            type: 'post',
                            data: { filiale_id: filiale_id },
                            success: function (e) {

                                location.reload();

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

    //----------------- FIN AJOUT DE FILIALE ------------------//


    //----------------- AJOUT DE DOCUMENT ------------------//
    $(document).on("click", "#btn_save_document", function () {

        let modal_id = $(this).closest('.modal').attr('id');

        let formulaire = $(this).closest('form');
        $.validator.setDefaults({ ignore: [] });


        let confidentialite = 'NON';

        let action_url = $(this).closest('form').attr('action');

        let option = $(this).data('option');

        let client_id = $('#' + modal_id + ' #client_id').val();

        let formData = new FormData();
        let files = $('#' + modal_id + ' #fichier')[0].files;
        let type_document = $('#' + modal_id + ' #type_document').val();
        let nom = $('#' + modal_id + ' #nom').val();
        confidentialite = $('#' + modal_id + ' #confidentialite:checked').val();
        let commentaire = $('#' + modal_id + ' #commentaire').val();
        if (typeof (confidentialite) == 'undefined') {
            confidentialite = 'NON';
        }

        if (formulaire.valid()) {

            formData.append('client_id', client_id);
            formData.append('fichier', files[0]);
            formData.append('type_document', type_document);
            formData.append('nom', nom);
            formData.append('confidentialite', confidentialite);
            formData.append('commentaire', commentaire);

            $.ajax({
                type: 'post',
                url: action_url,
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {

                    if (response.statut == 1) {

                        //mettre à jour le tableau
                        let document = response.data;
                        let t = $('#' + modal_id + ' #table_documents').DataTable();
                        t.row.add([document.nom, document.type_document, document.fichier, '<td class=""><span class="btn_supprimer_document" data-document_id="' + document.id + '" onClick="supprimer_document(' + document.id + ')" style="cursor:pointer;"><i class="fa fa-times text-danger"></i></span>&nbsp;&nbsp;&nbsp;<span class="btn_modifier_on_modal" data-modal_title="Modification d\'un document" data-model_name="document" data-href="/production/document/' + document.id + '/modifier" title="Modifier" style="cursor:pointer;"><i class="fas fa-edit text-warning"></i></span></td>']).draw(false);

                        //Afficher le message de succès et fermer la fenêtre
                        $('#' + modal_id + ' input[type=file]').val("");
                        $('#' + modal_id + ' input[type=text]').val("");
                        $('#' + modal_id + ' textarea').val("");
                        $('#' + modal_id + ' select').prop('selectedIndex', 0);

                        notifySuccess(response.message);

                    } else {

                        $('#' + modal_id + ' .alert .message').text(response.message);

                        $('#' + modal_id + ' .alert ').fadeTo(2000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-warning');

                    }


                },
                error: function () {

                    $('#' + modal_id + ' .alert .message').text("Erreur lors de l'enregistrement !");

                    $('#' + modal_id + ' .alert ').fadeTo(2000, 500).slideUp(500, function () {
                        $(this).slideUp(500);
                    }).removeClass('alert-success').addClass('alert-warning');

                }
            });

        } else {
            notifyWarning("Veuillez renseigner tous les champs obligatoires");
        }

    });

    // TODO AJOUT DE DOCUMENT DU CLIENT
    //Ajout document
    $("#btn_enregistrer_document_client").on('click', function () {

        let btn_enregistrer_document_client = $(this);

        let formulaire = $('#form_document_client');

        $.validator.setDefaults({ ignore: [] });

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: $('#form_document_client').serialize(),
                beforeSend: function () {
                    $('#loading_gif').show();
                    btn_enregistrer_document_client.hide();
                },
                success: function (response) {

                    $('#loading_gif').hide();
                    //btn_enregistrer_document_client.hide();

                    if (response.statut == 1) {

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (response) {
                    console.log(response);
                    btn_enregistrer_filiale_client.show();
                }
            });

        } else {
            let validator = formulaire.validate();
            notifyWarning("Veuillez renseigner tout les champs obligatoire");
        }

    });

    $(document).on('click', '.btn_supprimer_document', function () {
        let document_id = $(this).data('document_id');

        let n = noty({
            text: 'Voulez-vous vraiment supprimer cette document ?',
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
                            url: '/production/document/delete',
                            type: 'post',
                            data: { document_id: document_id },
                            success: function (e) {

                                location.reload();

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


    $(document).ready(function () {
        // Ensure Noty and jQuery are loaded
        if (typeof $.noty === 'undefined' || typeof $ === 'undefined') {
            console.error("Noty or jQuery not loaded");
            return;
        }

        // Event delegation for dynamically added elements
        $(document).on('click', '.btn_supprimer_document', function () {
            let document_id = $(this).data('document_id');
            supprimer_document(document_id);
        });
    });


    $(document).on("click", "#btn_save_document_dossier_sinistre", function () {

        const button = $(this); // Sauvegarder le bouton cliqué
        button.prop('disabled', true).text('Chargement'); // Désactive le bouton et change le texte

        let modal_id = $(this).closest('.modal').attr('id');

        let formulaire = $(this).closest('form');
        $.validator.setDefaults({ ignore: [] });

        let action_url = $(this).closest('form').attr('action');

        let dossier_sinistre_id = $('#' + modal_id + ' #dossier_sinistre_id').val();

        let formData = new FormData();

        let form_validity = false

        //let files = $('#'+ modal_id +' #fichier')
        //let type_documents = $('#'+ modal_id +' #type_document');

        //let array_type_documents = [];
        //let array_files = [];

        for (let i = 0; i < 6; i++) {
            file = $('#' + modal_id + ' #fichier_' + i)[0].files[0];
            type_document = $('#' + modal_id + ' #type_document_' + i).val();
            console.log(file);
            console.log(type_document);
            if (file) {
                form_validity = true;
                formData.append('fichier_' + i, file);
                formData.append('type_document_' + i, type_document);
            }
        }
        //console.log(type_documents[3].value);
        //console.log(formulaire.valid());
        //console.log(files);
        //console.log(array_files);
        //console.log(array_type_documents);
        //return false;

        if (form_validity == true) {

            formData.append('dossier_sinistre_id', dossier_sinistre_id);
            //formData.append('fichiers', array_files);
            //formData.append('type_documents', array_type_documents);

            $.ajax({
                type: 'post',
                url: action_url,
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    //console.log(response);
                    //return false;
                    if (response.statut == 1) {
                        for (var d = 0; d < response.documents.length; d++) {
                            //mettre à jour le tableau
                            let document = response.documents[d];
                            let t = $('#table_documents').DataTable();
                            t.row.add([document.type_document, document.fichier, '<td class=""><span class="btn_delete_document_dossier_sinistre" id="btn_delete_document_dossier_sinistre" data-document_id="' + document.id + '" onClick="dossier_sinistre_supprimer_document(' + document.id + ')" style="cursor:pointer;"><i class="fa fa-times text-danger"></i></span></td>']).draw(false);

                            //Afficher le message de succès et fermer la fenêtre
                            $('#' + modal_id + ' input[type=file]').val("");
                            $('#' + modal_id + ' input[type=text]').val("");
                            $('#' + modal_id + ' textarea').val("");
                            $('#' + modal_id + ' select').prop('selectedIndex', 0);
                        }
                        $('#' + modal_id).modal('hide');
                        notifySuccess(response.message, function () {
                            location.reload();
                        });
                    } else {

                        $('#' + modal_id + ' .alert .message').text(response.message);

                        $('#' + modal_id + ' .alert ').fadeTo(2000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-warning');

                    }


                },
                error: function () {

                    button.prop('disabled', false).text('Valider');

                    $('#' + modal_id + ' .alert .message').text("Erreur lors de l'enregistrement !");

                    $('#' + modal_id + ' .alert ').fadeTo(2000, 500).slideUp(500, function () {
                        $(this).slideUp(500);
                    }).removeClass('alert-success').addClass('alert-warning');

                }
            });

        } else {
            notifyWarning("Veuillez charger au moins un fichier");
            button.prop('disabled', false).text('Valider');
        }

    });


    $(document).on("click", ".btn_delete_document_dossier_sinistre", function (e) {
        let document_id = $(this).data('document_id');
        let href = '/sinistre/dossier_sinistre_document/delete';

        //demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment supprimer ce document ?',
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
                            data: { document_id: document_id },
                            success: function (response) {

                                if (response.statut == 1) {

                                    notifySuccess(response.message, function () {
                                        location.reload();
                                    });

                                } else {
                                    notifyWarning("Erreur lors de la suppression du tarif");
                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur lors du traitement");
                            }

                        });

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

    });


    //----------------- FIN AJOUT DE DOCUMENT ------------------//


    //----------------- BORDEREAU -----------------------------//

    $(document).on("click", "#btn_generation_bordereau_validation", function (e) {

        //demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment générer le bordereau ?',
            type: 'warning',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                        $noty.close();

                        $('#btn_generation_bordereau_validation').prop('disabled', true);
                        $('#loader').show();
                        $.ajax({
                            type: 'post',
                            url: '/sinistre/submit-generation-br-validation',
                            data: {
                                'search_periode_comptable': $('#search_periode_comptable').val(),
                                'search_prestataire': $('#search_prestataire').val(),
                                'search_numero_bordereau': $('#search_numero_bordereau').val(),
                                'search_type_remboursement': $('#search_type_remboursement').val(),
                                'search_adherent_principal': $('#search_adherent_principal').val(),
                                'search_assure': $('#search_assure').val(),
                                'montant_remb_total': $('#montant_remb_total').html().replaceAll("&nbsp;", ""),
                                'montant_rejet_total': $('#montant_rejet_total').html().replaceAll("&nbsp;", ""),
                                'montant_accepte_total': $('#montant_accepte_total').html().replaceAll("&nbsp;", ""),
                                'par_compagnie': $('#par_compagnie').is(':checked')
                            },
                            success: function (response) {

                                console.log(response);

                                if (response.statut == 1) {

                                    $('#btn_generation_bordereau_validation').prop('disabled', false);
                                    var link = response.bordereau_pdf;
                                    var a = document.createElement('a');
                                    a.href = link;
                                    a.download = link.substr(link.lastIndexOf('/') + 1);
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);

                                    location.reload();

                                } else {
                                    notifyWarning(response.message);
                                    $('#loader').hide();
                                }

                            },
                            error: function () {
                                notifyWarning("Erreur lors de la génération du bordereau");
                                $('#loader').hide();
                            }

                        });



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

    });

    $(document).on("click", "#btn_generation_bordereau_ordonnancement", function (e) {

        //demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment générer le bordereau ?',
            type: 'warning',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                        $noty.close();

                        $('#btn_generation_bordereau_ordonnancement').prop('disabled', true);
                        $('#loader').show();
                        $.ajax({
                            type: 'post',
                            url: '/sinistre/submit-generation-br-ordonnancement',
                            data: {
                                'search_facture': $('#search_facture').val(),
                                'search_periode_comptable': $('#search_periode_comptable').val(),
                                'search_prestataire': $('#search_prestataire').val(),
                                'search_type_remboursement': $('#search_type_remboursement').val(),
                                'search_adherent_principal': $('#search_adherent_principal').val(),
                                'search_assure': $('#search_assure').val(),
                                'search_numero_bordereau': $('#search_numero_bordereau').val(),
                                'montant_remb_total': $('#montant_remb_total').html().replaceAll("&nbsp;", ""),
                                'montant_rejet_total': $('#montant_rejet_total').html().replaceAll("&nbsp;", ""),
                                'montant_accepte_total': $('#montant_accepte_total').html().replaceAll("&nbsp;", ""),
                                'ordre_de': $('#ordre_de').val(),
                                'par_compagnie': $('#par_compagnie').is(':checked')
                            },
                            success: function (response) {

                                console.log(response);

                                if (response.statut == 1) {

                                    $('#btn_generation_bordereau_ordonnancement').prop('disabled', false);
                                    var link = response.bordereau_pdf;
                                    var a = document.createElement('a');
                                    a.href = link;
                                    a.download = link.substr(link.lastIndexOf('/') + 1);
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);

                                    location.reload();

                                } else {
                                    notifyWarning(response.message);
                                    $('#btn_generation_bordereau_ordonnancement').prop('disabled', false);
                                    $('#loader').hide();
                                }

                            },
                            error: function () {
                                notifyWarning("Erreur lors de la génération du bordereau");
                                $('#btn_generation_bordereau_ordonnancement').prop('disabled', false);
                                $('#loader').hide();
                            }

                        });



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

    });


    //----------------- AJOUT DE ACOMPTE ------------------//
    $(document).on('click', "#modal-acompte #btn_save_acompte", function () {

        let client_id = $("#modal-acompte #client_id").val();

        $.ajax({
            type: 'post',
            url: '/production/client/' + client_id + '/acompte/add',
            data: $("#modal_form_acompte").serialize(),
            success: function (response) {

                if (response.statut == 1) {

                    //mettre à jour le tableau
                    let acompte = response.data;
                    let t = $('#table_acomptes').DataTable();
                    t.row.add([acompte.montant, acompte.date_versement, '<td class=""><span class="btn_supprimer_acompte" data-acompte_id="' + acompte.id + '" onClick="supprimer_acompte(' + acompte.id + ')" style="cursor:pointer;"><i class="fa fa-times text-danger"></i></span>&nbsp;&nbsp;&nbsp;<span class="btn_modifier_on_modal" data-modal_title="Modification d\'un acompte" data-model_name="acompte" data-href="/production/acompte/' + acompte.id + '/modifier" title="Modifier" style="cursor:pointer;"><i class="fas fa-edit text-warning"></i></span></td>']).draw(false);

                    //Afficher le message de succès et fermer la fenêtre
                    $("#modal_form_acompte input[type=number]").val("");
                    $("#modal_form_acompte input[type=date]").val("");

                    $('#modal_form_acompte .alert .message').text(response.message);

                    $('#modal_form_acompte .alert ').fadeTo(2000, 500).slideUp(500, function () {
                        $(this).slideUp(500);
                        $("#modal-acompte").modal('toggle');
                    }).removeClass('alert-warning').addClass('alert-success');

                } else {

                    $('#modal_form_acompte .alert .message').text(response.message);

                    $('#modal_form_acompte .alert ').fadeTo(2000, 500).slideUp(500, function () {
                        $(this).slideUp(500);
                    }).removeClass('alert-success').addClass('alert-warning');

                }


            },
            error: function () {

                $('#modal_form_acompte .alert .message').text("Erreur lors de l'enregistrement !");

                $('#modal_form_acompte .alert ').fadeTo(2000, 500).slideUp(500, function () {
                    $(this).slideUp(500);
                }).removeClass('alert-success').addClass('alert-warning');

            }

        });

    });

    // TODO AJOUT DE ACOMPTE DU CLIENT
    //Ajout filiale
    $("#btn_enregistrer_acompte_client").on('click', function () {

        let btn_enregistrer_acompte_client = $(this);

        let formulaire = $('#form_acompte_client');

        $.validator.setDefaults({ ignore: [] });

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: $('#form_acompte_client').serialize(),
                beforeSend: function () {
                    $('#loading_gif').show();
                    btn_enregistrer_acompte_client.hide();
                },
                success: function (response) {

                    $('#loading_gif').hide();
                    //btn_enregistrer_acompte_client.hide();

                    if (response.statut == 1) {

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (response) {
                    console.log(response);
                    btn_enregistrer_acompte_client.show();
                }
            });

        } else {
            let validator = formulaire.validate();
            notifyWarning("Veuillez renseigner tout les champs obligatoire");
        }

    });

    $(document).on('click', '.btn_supprimer_acompte', function () {
        let acompte_id = $(this).data('acompte_id');

        let n = noty({
            text: 'Voulez-vous vraiment supprimer cet acompte ?',
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
                            url: '/production/acompte/delete',
                            type: 'post',
                            data: { acompte_id: acompte_id },
                            success: function (e) {

                                location.reload();

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

    //----------------- FIN AJOUT DE ACOMPTE ------------------//


    //TRAITEMENT PAGE POLICE


    // Button changement de formule
    $("#btn_changement_formules").on('click', function () {

        let href = $(this).attr('data-href');
        let formulaire = $('#form_importation_beneficiaire')[0];

        let formData = new FormData(formulaire);
        let police_id = $('#modal_importation_beneficiaires #police_id').val();

        formData.append('police_id', police_id);

        $.ajax({
            type: 'post',
            url: href,
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {

                if (response.statut == 1) {

                    //Vider le formulaire
                    resetFields('#' + formulaire.id);

                    notifySuccess(response.message, function () {
                        location.reload();
                    });

                } else {

                    let errors = JSON.parse(JSON.stringify(response.errors));
                    let errors_list_to_display = '';
                    for (field in errors) {
                        errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                    }

                    $('#modal_importation_beneficiaires .alert .message').html(errors_list_to_display);

                    $('#modal_importation_beneficiaires .alert ').fadeTo(2000, 500).slideUp(500, function () {
                        $(this).slideUp(500);
                    }).removeClass('alert-success').addClass('alert-warning');

                }

            },
            error: function () {

            }
        });


    });

    // Ajax pour afficher le select de la liste de formule en fonction de la police

    // Ajoutez un gestionnaire d'événements au changement de la police
    $('#police_sortante_id').change(function () {
        // Récupérez la valeur sélectionnée
        var policeId = $(this).val();


        var href = $(this).data('href').replace('0', policeId);

        // Effectuez une requête AJAX pour récupérer les formules associées
        $.ajax({
            url: href,
            type: 'GET',
            dataType: 'json', // Assurez-vous que votre vue renvoie du JSON
            success: function (data) {
                // Mettre à jour le contenu du menu déroulant formules de la police choisi
                var formuleDropdown = $('#formule_sortante_code');
                formuleDropdown.empty();
                $.each(data.formules, function (key, formule) {
                    formuleDropdown.append('<option value="' + formule.code + '">' + formule.libelle + '</option>');
                });
            },
            error: function () {
                console.error('Erreur lors de la récupération des formules.');
            }
        });
    });


    //TODO VERIFICATION IMPORT DES BENEFICIAIRES

    // DISABLE IMPORTER BUTTON
    $(document).ready(function () {
        $('#btn_importer_beneficiaires').prop('disabled', true);
    });

    $("#btn_verifier_beneficiaires").on('click', function () {

        let href = $(this).attr('data-href');
        let formulaire = $('#modal_form_import_beneficiaire');

        let formData = new FormData();
        let files = $('#modal_form_import_beneficiaire #fichier')[0].files;
        let police_id = $('#modal_form_import_beneficiaire #police_id').val();

        if (files.length > 0) {

            formData.append('police_id', police_id);
            formData.append('fichier', files[0]);

            $('#btn_importer_beneficiaires').hide();
            $('#btn_verifier_beneficiaires').prop('disabled', true);
            $('#import_beneficiaires_loader').show();

            $.ajax({
                type: 'post',
                url: href,
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.statut == 1) {
                        notifySuccess(response.message);
                        $('#import_beneficiaires_loader').hide();
                        $('#btn_verifier_beneficiaires').prop('disabled', false);
                        $('#btn_importer_beneficiaires').prop('disabled', false);
                        $('#btn_importer_beneficiaires').show();
                    } else {
                        let errors = response.errors ?? [];
                        let errors_list_to_display = '<strong>Erreurs:</strong><br/>';
                        console.log(errors);
                        errors.forEach(function (error) {
                            console.log(error);
                            errors_list_to_display += '- Ligne: ' + error.row + ', Collonne: ' + error.collunmName + ' | ' + error.message + '<br/>';
                        });
                        $('#modal-import_beneficiaires .alert .message').html(errors_list_to_display);
                        $('#modal-import_beneficiaires .alert').fadeTo(30000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-danger');
                        $('#import_beneficiaires_loader').hide();
                        $('#btn_verifier_beneficiaires').prop('disabled', false);
                        $('#btn_importer_beneficiaires').show();
                    }
                },
                error: function (response) {
                    console.log(response.errors);
                    console.log(response);
                    $('#import_beneficiaires_loader').hide();
                    $('#btn_importer_beneficiaires').show();
                    $('#btn_verifier_beneficiaires').prop('disabled', true);
                }
            });

        } else {
            notifyWarning('Veuillez chosisr un fichier');
        }
    });
    //

    // TODO IMPORTATION DES BENEFICIAIRES
    $("#btn_importer_beneficiaires").on('click', function () {

        let href = $(this).attr('data-href');
        let formulaire = $('#modal_form_import_beneficiaire');

        let formData = new FormData();
        let files = $('#modal_form_import_beneficiaire #fichier')[0].files;
        let police_id = $('#modal_form_import_beneficiaire #police_id').val();

        if (files.length > 0) {

            formData.append('police_id', police_id);
            formData.append('fichier', files[0]);

            $('#btn_importer_beneficiaires').hide();
            $('#import_beneficiaires_loader').show();
            $('#btn_verifier_beneficiaires').prop('disabled', true);

            $.ajax({
                type: 'post',
                url: href,
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {

                    if (response.statut == 1) {

                        //Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        let errors = response.errors ?? [];
                        let errors_list_to_display = '<strong>Erreurs:</strong><br/>';
                        console.log(errors);
                        errors.forEach(function (error) {
                            console.log(error);
                            errors_list_to_display += '- Ligne: ' + error.row + ', Collonne: ' + error.collunmName + ' | ' + error.message + '<br/>';
                        });

                        $('#modal-import_beneficiaires .alert .message').html(errors_list_to_display);

                        $('#modal-import_beneficiaires .alert').fadeTo(30000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-danger');

                        $('#btn_importer_beneficiaires').show();
                        $('#import_beneficiaires_loader').hide();
                        $('#btn_verifier_beneficiaires').prop('disabled', false);
                    }
                },
                error: function (response) {
                    console.log(response.errors);
                    console.log(response);
                    $('#btn_importer_beneficiaires').show();
                    $('#import_beneficiaires_loader').hide();
                    $('#btn_verifier_beneficiaires').prop('disabled', false);
                }
            });

        } else {
            notifyWarning('Veuillez chosisr un fichier');
            //        $('#import_beneficiaires_loader').hide();
        }
    });


    // TODO CHANGEMENT DE COMPAGNIE
    $("#btn_valider_changement_compagnie").on('click', function () {

        let btn_valider_changement_compagnie = $(this);

        let formulaire = $('#form_changement_compagnie');

        $.validator.setDefaults({ ignore: [] });

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: $('#form_changement_compagnie').serialize(),
                beforeSend: function () {
                    $('#loading_gif').show();
                    btn_valider_changement_compagnie.hide();
                },
                success: function (response) {

                    $('#loading_gif').hide();
                    //btn_valider_changement_compagnie.hide();

                    if (response.statut == 1) {

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (response) {
                    console.log(response);
                    btn_valider_changement_compagnie.show();
                }
            });

        } else {
            let validator = formulaire.validate();
            notifyWarning("Veuillez sélectionner les polices");
        }

    });


    //gestion changement de genre/sexe
    $(document).on('click', '#genre', function () {

        let genre = $(this).val();

        if (genre == 'F') {
            $('#box_nom_jeune_fille').show();
        } else {
            $('#box_nom_jeune_fille').hide();
        }

    });
    //fin gestion changement de genre/sexe


    //ajout d'un bénéficiaire sur une police

    $(document).on('click', "#btn_save_beneficiaire", function () {
        let btn_save_beneficiaire = $(this);
        let formulaire = $('#form_add_beneficiaire');
        let href = formulaire.attr('action');
        let matricule_salarie_field = $('input[name="matricule_employe"]');
        let matricule_salarie_value = matricule_salarie_field.val().trim();
        let alphanumericRegex = /^[a-zA-Z0-9]*$/;
        if (matricule_salarie_value === '') {
            matricule_salarie_field.val('');
        } else {
            if (!alphanumericRegex.test(matricule_salarie_value)) {
                notifyWarning("Aucun caractère spécial ou espace n'est autorisé");
                return;
            }
            matricule_salarie_field.val(matricule_salarie_value);
        }

        $.validator.setDefaults({ ignore: [] });
        let formData = new FormData();
        let files = $('#form_add_beneficiaire #photo')[0].files;

        // Validate the form
        if (formulaire.valid()) {
            btn_save_beneficiaire.attr('disabled', true);
            let n = noty({
                text: 'Voulez-vous vraiment enregistrer ce bénéficiaire ?',
                type: 'warning',
                dismissQueue: true,
                layout: 'center',
                theme: 'defaultTheme',
                buttons: [
                    {
                        addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                            $noty.close();
                            if (files.length > 0) {
                                formData.append('photo', files[0]);
                            }
                            let data_serialized = formulaire.serialize();
                            $.each(data_serialized.split('&'), function (index, elem) {
                                let vals = elem.split('=');
                                let key = vals[0];
                                let valeur = decodeURIComponent(vals[1].replace(/\+/g, ' '));
                                formData.append(key, valeur);
                            });
                            $.ajax({
                                type: 'post',
                                url: href,
                                data: formData,
                                processData: false,
                                contentType: false,
                                success: function (response) {
                                    btn_save_beneficiaire.removeAttr('disabled');
                                    if (response.statut == 1) {
                                        let aliment = response.data;
                                        let t = $('#table_beneficiaires').DataTable();
                                        t.row.add([
                                            aliment.nom,
                                            aliment.prenoms,
                                            aliment.date_naissance,
                                            aliment.genre,
                                            aliment.qualite_beneficiaire,
                                            aliment.matricule_cie,
                                            aliment.numero_famille,
                                            aliment.formule,
                                            aliment.statut,
                                            aliment.date_sortie
                                        ])
                                            .draw(false);
                                        // Clear the form
                                        resetFields('#' + formulaire.attr('id'));
                                        notifySuccess(response.message);
                                        location.reload();
                                        btn_save_beneficiaire.removeAttr('disabled');
                                    } else {
                                        let errors = JSON.parse(JSON.stringify(response.errors));
                                        let errors_list_to_display = '';
                                        for (field in errors) {
                                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                        }
                                        $('#modal-beneficiaire .alert .message').html(errors_list_to_display);
                                        $('#modal-beneficiaire .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                            $(this).slideUp(500);
                                        }).removeClass('alert-success').addClass('alert-warning');
                                    }
                                },
                                error: function (request, status, error) {
                                    btn_save_beneficiaire.removeAttr('disabled');
                                    notifyWarning("Erreur lors de l'enregistrement");
                                }
                            });
                        }
                    },
                    {
                        addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                            $noty.close();
                        }
                    }
                ]
            });
        } else {
            btn_save_beneficiaire.removeAttr('disabled');
            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');
            let validator = formulaire.validate();
            $.each(validator.errorMap, function (index, value) {
                console.log('Id: ' + index + ' Message: ' + value);
            });
            notifyWarning('Veuillez renseigner tous les champs obligatoires');
        }
    });


    $("#btn_save_vehicule").on('click', function () {
        let btn_submit = $(this);

        btn_submit.attr('disabled', true);

        let formulaire = $('#form_add_vehicule');
        let href = formulaire.attr('action');

        $.validator.setDefaults({ ignore: [] });

        let formData = new FormData();

        if (formulaire.valid()) {

            // Enregistrement direct sans confirmation
            let data_serialized = formulaire.serialize();
            $.each(data_serialized.split('&'), function (index, elem) {
                let vals = elem.split('=');

                let key = vals[0];
                let valeur = decodeURIComponent(vals[1].replace(/\+/g, '  '));

                formData.append(key, valeur);
            });

            // Récupérer les garanties cochées
            $('.garantie-checkbox:checked').each(function () {
                let garantieId = $(this).val(); // ID de la garantie
                let franchise = $(`input[name="franchise_${garantieId}"]`).val() || ''; // Franchise associée
                let capital = $(`input[name="capital_${garantieId}"]`).val() || ''; // Capital associé

                // Ajouter ces données au FormData
                formData.append(`garanties[${garantieId}][id]`, garantieId);
                formData.append(`garanties[${garantieId}][franchise]`, franchise);
                formData.append(`garanties[${garantieId}][capital]`, capital);
            });

            $.ajax({
                type: 'post',
                url: href,
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {

                    btn_submit.removeAttr('disabled');

                    if (response.statut == 1) {

                        let police = response.data;

                        // Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    }
                    if (response.statut == 2) {

                        notifyWarning(response.message);

                    } else {

                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for (field in errors) {
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-vehicule .alert .message').html(errors_list_to_display);

                        $('#modal-vehicule .alert').fadeTo(5000, 2000).slideUp(2000, function () {
                            $(this).slideUp(2000);
                        }).removeClass('alert-success').addClass('alert-warning');
                    }
                },
                error: function (request, status, error) {
                    btn_submit.removeAttr('disabled');
                    notifyWarning("Erreur lors de l'enregistrement ");
                }
            });

        } else {
            // Validation échouée
            btn_submit.removeAttr('disabled');

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {
                console.log('Id: ' + index + ' Message: ' + value);
            });

            notifyWarning('Veuillez renseigner tous les champs obligatoires');
        }
    });


    $("#btn_save_marchandise").on('click', function () {
        let btn_submit = $(this);

        btn_submit.attr('disabled', true);

        let formulaire = $('#form_add_marchandise');
        let href = formulaire.attr('action');

        $.validator.setDefaults({ ignore: [] });

        let formData = new FormData();

        if (formulaire.valid()) {

            // Enregistrement direct sans confirmation
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

                    btn_submit.removeAttr('disabled');

                    if (response.statut == 1) {

                        let police = response.data;

                        // Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    }
                    if (response.statut == 2) {

                        notifyWarning(response.message);

                    } else {

                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for (field in errors) {
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-vehicule .alert .message').html(errors_list_to_display);

                        $('#modal-vehicule .alert').fadeTo(5000, 2000).slideUp(2000, function () {
                            $(this).slideUp(2000);
                        }).removeClass('alert-success').addClass('alert-warning');
                    }
                },
                error: function (request, status, error) {
                    btn_submit.removeAttr('disabled');
                    notifyWarning("Erreur lors de l'enregistrement ");
                }
            });

        } else {
            // Validation échouée
            btn_submit.removeAttr('disabled');

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {
                console.log('Id: ' + index + ' Message: ' + value);
            });

            notifyWarning('Veuillez renseigner tous les champs obligatoires');
        }
    });


    $(document).on('click', ".btn_supprimer_vehicule", function () {

        let vehicule_id = $(this).data('vehicule_id');

        let n = noty({
            text: 'Voulez-vous vraiment supprimer ce vehicule ?',
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
                            url: '/production/police/delete',
                            type: 'post',
                            data: { vehicule_id: vehicule_id },
                            success: function (e) {

                                location.reload();

                            },
                            error: function () {
                                notifyWarning('Erreur lors de la suppression du vehicule');
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

    //ajout bénéficiaire
    $(document).on('click', '#btn_add_beneficiaire', function () {

        //let model_name = $(this).attr('data-model_name');
        //let modal_title = $(this).attr('data-modal_title');
        // alert('hello');
        let href = $(this).attr('data-href');
        $('#btn_add_beneficiaire').hide();
        $('#loader-btn_add_beneficiaire').show();
        $('#olea_std_dialog_box').load(href, function () {
            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();
            $('#modal-beneficiaire').attr('data-backdrop', 'static').attr('data-keyboard', false);
            $('#modal-beneficiaire').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');
            $('#modal-beneficiaire').modal();

            $('#btn_add_beneficiaire').show();
            $('#loader-btn_add_beneficiaire').hide();

            //gestion selection qualité bénéficiaire et adhérent principal
            $("#qualite_beneficiaire_id").on('change', function () {

                let qualite_code = $(this).children('option:selected').data('qualite_code');
                if (qualite_code == "AD") {

                    $('select#adherent_principal').removeAttr('required');
                    $('div#box_adherent_principal').hide();
                    //alert('qualite');
                } else {
                    $('select#adherent_principal').attr('required', 'required');
                    $('div#box_adherent_principal').show();
                    //alert('code');
                }

            });


        });


    });

    //modification de beneficiaire
    $(document).on('click', '.btn_modifier_beneficiaire', function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let aliment_id = $(this).attr('data-aliment_id');
        let href = $(this).attr('data-href');
        let btn = $(this)

        btn.hide();
        $('#loder-aliment-' + aliment_id).show();

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-modification_beneficiaire').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-modification_beneficiaire').find('.modal-title').text(modal_title);
            $('#modal-modification_beneficiaire').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-modification_beneficiaire').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-modification_beneficiaire').modal();

            //
            btn.show();
            $('#loder-aliment-' + aliment_id).hide();

            //gestion du clique sur valider les modifications

            $("#btn_save_modification_beneficiaire").on('click', function () {
                let formulaire = $('#form_update_beneficiaire');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });
                let matricule_salarie_field = $('input[name="matricule_employe"]');
                let matricule_salarie_value = matricule_salarie_field.val().trim();
                let alphanumericRegex = /^[a-zA-Z0-9]*$/;
                if (matricule_salarie_value === '') {
                    matricule_salarie_field.val('');
                } else {
                    matricule_salarie_field.val(matricule_salarie_value);
                    if (!alphanumericRegex.test(matricule_salarie_value)) {
                        notifyWarning("Aucun caractère spécial ou espace n'est autorisé");
                        return;
                    }
                }

                let formData = new FormData();
                let files = $('#form_update_beneficiaire #photo')[0].files;
                let currentPhoto = $('#current_photo').val();

                if (formulaire.valid()) {
                    if (files.length > 0) {
                        formData.append('photo', files[0]);
                    } else {
                        formData.append('current_photo', currentPhoto);
                    }

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
                                notifySuccess(response.message);
                                location.reload();
                            } else {
                                let errors = JSON.parse(JSON.stringify(response.errors));
                                let errors_list_to_display = '';
                                for (field in errors) {
                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                }
                                $('#modal-beneficiaire .alert .message').html(errors_list_to_display);
                                $('#modal-beneficiaire .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                    $(this).slideUp(500);
                                }).removeClass('alert-success').addClass('alert-warning');
                            }
                        },
                        error: function (request, status, error) {
                            notifyWarning("Erreur lors de l'enregistrement");
                        }
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



    //fin modification de beneficiaire

    //DETAILS de beneficiaire
    $(document).on("click", ".btn_details_beneficiaire", function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        //let dialog_box = $("<div>").addClass('olea_std_dialog_box').appendTo('body');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-details_beneficiaire .dataTable:not(.customDataTable_)').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'desc']],
                lengthMenu: [
                    [100],
                    [100],
                ],
                searching: false,
                lengthChange: false,
            });

            let i = 0;
            /*
            $('.dropzone_area').each(function(myElement){
                let zone_id = $(this).data('zone_id');
                let href = $(this).attr('action');

                let dropzone = new Dropzone("#"+zone_id, { url: href, dictDefaultMessage: ""});

            });
            */

            $('#modal-details_beneficiaire').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-details_beneficiaire').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-details_beneficiaire').modal();





        });


    });

    //DETAILS de prospect
    $(document).on("click", ".btn_details_prospect", function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        //let dialog_box = $("<div>").addClass('olea_std_dialog_box').appendTo('body');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-details_beneficiaire .dataTable:not(.customDataTable_)').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'desc']],
                lengthMenu: [
                    [100],
                    [100],
                ],
                searching: false,
                lengthChange: false,
            });

            let i = 0;
            /*
            $('.dropzone_area').each(function(myElement){
                let zone_id = $(this).data('zone_id');
                let href = $(this).attr('action');

                let dropzone = new Dropzone("#"+zone_id, { url: href, dictDefaultMessage: ""});

            });
            */

            $('#modal-details_prospect').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-details_prospect').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-details_prospect').modal();





        });


    });


    $(document).on("click", "#btn_rejet_prospect", function (e) {
        //    alert('Voulez-vous vraiment rejeter ce prospect ?');
        let prospect_id = $(this).attr('data-prospect_id');
        let href = $(this).attr('data-href');

        let btn_rejet_prospect = $(this);
        btn_rejet_prospect.attr('disabled', true);
        $("#btn_submit_prospect").attr('disabled', true);

        $.ajax({
            type: 'post',
            url: href,
            data: { prospect_id: prospect_id },
            success: function (response) {
                if (response.status == 1) {

                    notifySuccess(response.message, function () {
                        location.reload();
                    });
                    //btn_rejet_prospect.removeAttr('disabled');
                } else {
                    notifyWarning(response.message);
                }
            },
            error: function (request, status, error) {
                btn_rejet_prospect.removeAttr('disabled');
                $("#btn_submit_prospect").removeAttr('disabled');
                notifyWarning("Erreur lors de l'enregistrement");
            }

        });

    });


    $(document).on("click", "#btn_submit_prospect", function (e) {
        //    alert('Voulez-vous vraiment rejeter ce prospect ?');
        let prospect_id = $(this).attr('data-prospect_id');
        let police_id = $(this).attr('data-police_id');
        let href = $(this).attr('data-href');
        let url_police_benef = $(this).attr('data-url_police_benef');

        let btn_submit_prospect = $(this);
        btn_submit_prospect.attr('disabled', true);
        $("#btn_rejet_prospect").attr('disabled', true);

        $.ajax({
            type: 'post',
            url: href,
            data: {
                prospect_id: prospect_id,
                police_id: police_id
            },
            success: function (response) {
                if (response.status == 1) {

                    notifySuccess(response.message, function () {
                        window.open(url_police_benef, '_blank').focus();
                        location.reload();
                    });
                    //btn_submit_prospect.removeAttr('disabled');
                } else {
                    notifyWarning(response.message);
                }
            },
            error: function (request, status, error) {
                btn_submit_prospect.removeAttr('disabled');
                $("#btn_rejet_prospect").removeAttr('disabled');
                notifyWarning("Erreur lors de l'enregistrement");
            }

        });

    });

    //Moved from inside details beneficiaire to here

    //gestion détails carte
    $(document).on("click", "#modal-details_beneficiaire .btn_details_carte", function () {
        let numero_carte = $(this).data('numero_carte');
        let statut_carte = $(this).data('statut_carte');
        let qrcode_carte = $(this).data('qrcode_carte');

        $('#qrcode_carte').attr("src", qrcode_carte);
        $('#apercu_carte_numero').text(numero_carte);

        if (statut_carte == "INACTIF") {
            $('#apercu_carte_statut').html('<span style="color:red;letter-spacing:5px;margin-left:15px;">INACTIVE</span>');
            $('#btn_imprimer_carte').hide();
        } else {
            $('#apercu_carte_statut').html('<span style="color:green;letter-spacing:5px;"></span>');
            $('#btn_imprimer_carte').show();
        }


        $("#apercu_carte").animate({
            opacity: 0.25,
        }, 500, function () {
            // on Animation complete.

            $("#apercu_carte").css({ opacity: 0.99 });
        });

    });


    //gestion détails carte
    $(document).on("click", "#btn_save_carte", function (e) {
        e.stopPropagation();

        let btn_save_carte = $(this);
        btn_save_carte.attr('disabled', true);

        let formulaire = $('#form_add_carte');
        let href = formulaire.attr('action');

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: href,
                data: formulaire.serialize(),
                success: function (response) {

                    btn_save_carte.removeAttr('disabled');

                    if (response.statut == 1) {

                        carte = response.data;
                        let t = $('#table_cartes').DataTable();

                        t.row.add([
                            carte.numero,
                            carte.date_edition.substr(0, 10),
                            carte.date_desactivation,
                            carte.statut,
                            carte.id,
                        ])
                            .draw(false);

                        //Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        notifySuccess(response.message);
                        location.reload();

                        btn_save_carte.removeAttr('disabled');

                    } else {

                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for (field in errors) {
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-carte .alert .message').html(errors_list_to_display);

                        $('#modal-carte .alert ').fadeTo(2000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-warning');

                    }

                },
                error: function (request, status, error) {
                    btn_save_carte.removeAttr('disabled');
                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {

            btn_save_carte.removeAttr('disabled');

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {

                console.log('Id: ' + index + ' Message: ' + value);

            });

            notifyWarning('Veuillez renseigner tous les champs obligatoires');
        }

    });


    //changement de formule
    $(document).on("click", "#btn_save_changement_formule", function (e) {
        e.stopPropagation();

        let btn_valider = $(this);

        let formulaire = $('#form_changement_formule');
        let href = formulaire.attr('action');

        if (formulaire.valid()) {

            //demander confirmation
            let n = noty({
                text: 'Voulez-vous vraiment changer de formule ?',
                type: 'warning',
                dismissQueue: true,
                layout: 'center',
                theme: 'defaultTheme',
                buttons: [
                    {
                        addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                            $noty.close();

                            //confirmation obtenu

                            btn_valider.prop('disabled', true).attr('disabled', true);

                            $.ajax({
                                type: 'post',
                                url: href,
                                data: formulaire.serialize(),
                                success: function (response) {

                                    btn_valider.removeAttr('disabled');

                                    if (response.statut == 1) {

                                        //Fermer le modal
                                        $('#modal-changement_formule').modal('hide');

                                        avenant = response.data;
                                        let t = $('#table_avenants_beneficiaire').DataTable();

                                        t.row.add([
                                            avenant.libelle,
                                            avenant.date_effet,
                                            avenant.motif,
                                            avenant.created_by
                                        ])
                                            .draw(false);

                                        $("#date_fin_aliment_formule_" + avenant.old_id).html(avenant.old_date_fin);

                                        //ligne de formules
                                        aliment_police = response.data;

                                        let tcf = $('#table_forumules').DataTable();

                                        tcf.row.add([
                                            aliment_police.formule_libelle_formule,
                                            aliment_police.formule_code_formule,
                                            aliment_police.date_effet,
                                            '',
                                            ''
                                        ])
                                            .draw(false);

                                        tcf.order([0, 'desc']).draw();

                                        //Vider le formulaire
                                        resetFields('#' + formulaire.attr('id'));

                                        notifySuccess(response.message);
                                        //location.reload();

                                    } else {
                                        notifyWarning(response.message);

                                    }

                                },
                                error: function (request, status, error) {
                                    btn_valider.removeAttr('disabled');
                                    notifyWarning("Erreur lors de l'enregistrement" + request.responseText);
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

            btn_valider.removeAttr('disabled');

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {

                console.log('Id: ' + index + ' Message: ' + value);

            });

            notifyWarning('Veuillez renseigner tous les champs obligatoires');
        }

    });


    $(document).on("click", "#btn_save_suspension_beneficiaire", function (e) {

        //alert('yes');

        e.stopPropagation();

        let btn_valider = $(this);
        let ligne_tr = $(this).closest('tr');

        let formulaire = $('#form_suspension_beneficiaire');
        let href = formulaire.attr('action');

        if (formulaire.valid()) {

            btn_valider.prop('disabled', true).attr('disabled', true);

            //demander confirmation
            let n = noty({
                text: 'Voulez-vous vraiment le suspendre le bénéficiaire ?',
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

                                    btn_valider.removeAttr('disabled');

                                    if (response.statut == 1) {

                                        //Fermer le modal
                                        $('#modal-suspension_beneficiaire').modal('hide');

                                        avenant = response.data;
                                        let t = $('#table_avenants_beneficiaire').DataTable();

                                        t.row.add([
                                            avenant.libelle,
                                            avenant.date_effet,
                                            avenant.motif,
                                            avenant.created_by
                                        ])
                                            .draw(false);

                                        //Vider le formulaire
                                        resetFields('#' + formulaire.attr('id'));

                                        notifySuccess(response.message);

                                    } else {
                                        /*
                                        let errors = JSON.parse(JSON.stringify(response.errors));
                                        let errors_list_to_display = '';
                                        for(field in errors){
                                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                        }

                                        $('#modal-carte .alert .message').html(errors_list_to_display);

                                        $('#modal-carte .alert ').fadeTo(2000, 500).slideUp(500, function(){
                                            $(this).slideUp(500);
                                        }).removeClass('alert-success').addClass('alert-warning');
                                        */
                                    }

                                },
                                error: function (request, status, error) {
                                    btn_valider.removeAttr('disabled');
                                    notifyWarning("Erreur lors de l'enregistrement" + request.responseText);
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
            btn_valider.prop('disabled', false).attr('disabled', false);
            btn_valider.removeAttr('disabled');

        } else {

            btn_valider.removeAttr('disabled');

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {

                console.log('Id: ' + index + ' Message: ' + value);

            });

            notifyWarning('Veuillez renseigner tous les champs obligatoires');
        }

    });


    $(document).on("click", "#btn_save_remise_en_vigueur", function (e) {

        //alert('yes');

        e.stopPropagation();

        let btn_valider = $(this);
        let ligne_tr = $(this).closest('tr');

        let formulaire = $('#form_remise_en_vigueur');
        let href = formulaire.attr('action');

        if (formulaire.valid()) {

            btn_valider.prop('disabled', true).attr('disabled', true);

            //demander confirmation
            let n = noty({
                text: 'Voulez-vous vraiment le remettre en vigueur le bénéficiaire ?',
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

                                    btn_valider.removeAttr('disabled');

                                    if (response.statut == 1) {

                                        //Fermer le modal
                                        $('#modal-remise_en_vigueur').modal('hide');

                                        avenant = response.data;
                                        let t = $('#table_avenants_beneficiaire').DataTable();

                                        t.row.add([
                                            avenant.libelle,
                                            avenant.date_effet,
                                            avenant.motif,
                                            avenant.created_by
                                        ])
                                            .draw(false);


                                        //Vider le formulaire
                                        resetFields('#' + formulaire.attr('id'));

                                        notifySuccess(response.message);

                                    } else {

                                    }

                                },
                                error: function (request, status, error) {
                                    btn_valider.removeAttr('disabled');
                                    notifyWarning("Erreur lors de l'enregistrement" + request.responseText);
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
            btn_valider.prop('disabled', false).attr('disabled', false);
            btn_valider.removeAttr('disabled');

        } else {

            btn_valider.removeAttr('disabled');

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {

                console.log('Id: ' + index + ' Message: ' + value);

            });

            notifyWarning('Veuillez renseigner tous les champs obligatoires');
        }

    });


    //sortir le bénéficiaire de la police
    $(document).on("click", ".btn_sortie_beneficiaire_formule", function () {
        var id = $(this).data('id');
        //var motif = $(this).data('motif');
        $("#modal-sortie_police #msp-id").val(id);
        //$("#modal-sortie_police #msp-motif").val(motif);
        // As pointed out in comments,
        // it is unnecessary to have to manually call the modal.
        // $('#addBookDialog').modal('show');
    });


    $(document).on("click", "#btn_save_sortie_police", function (e) {

        e.stopPropagation();

        let btn_valider = $(this);

        let ligne_tr = $(this).closest('tr');

        let formulaire = $('#form_sortie_police');
        let href = formulaire.attr('action');

        if (formulaire.valid()) {

            btn_valider.prop('disabled', true).attr('disabled', true);

            //demander confirmation
            let n = noty({
                text: 'Voulez-vous vraiment le sortir de la police ?',
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

                                    btn_valider.removeAttr('disabled');

                                    if (response.statut == 1) {

                                        //Fermer le modal
                                        $('#modal-sortie_police').modal('hide');

                                        avenant = response.data;
                                        let t = $('#table_avenants_beneficiaire').DataTable();

                                        t.row.add([
                                            avenant.libelle,
                                            avenant.date_effet,
                                            avenant.motif,
                                            avenant.created_by
                                        ])
                                            .draw(false);


                                        //Vider le formulaire
                                        resetFields('#' + formulaire.attr('id'));

                                        notifySuccess(response.message, function () {
                                            location.href = '';
                                        });

                                    } else {

                                        notifyWarning(response.message);

                                    }

                                },
                                error: function (request, status, error) {
                                    btn_valider.removeAttr('disabled');
                                    notifyWarning("Erreur lors de l'enregistrement" + request.responseText);
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
            btn_valider.prop('disabled', false).attr('disabled', false);
            btn_valider.removeAttr('disabled');

        }

    });


    //DETAILS de vehicule
    $(document).on("click", ".btn_details_vehicule", function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        //let dialog_box = $("<div>").addClass('olea_std_dialog_box').appendTo('body');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-details_vehicule .dataTable:not(.customDataTable_)').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'desc']],
                lengthMenu: [
                    [100],
                    [100],
                ],
                searching: false,
                lengthChange: false,
            });

            let i = 0;
            $('.dropzone_area').each(function (myElement) {
                let zone_id = $(this).attr('id');
                let href = $(this).attr('action');

                let dropzone = new Dropzone("#" + zone_id, { url: href, dictDefaultMessage: "" });

            });

            $('#modal-details_vehicule').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-details_vehicule').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-details_vehicule').modal();

        });


    });


    //Modification de véhicule
    $(document).on('click', '.btn_modifier_vehicule', function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-modification_vehicule').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-modification_vehicule').find('.modal-title').text(modal_title);
            $('#modal-modification_vehicule').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-modification_vehicule').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-modification_vehicule').modal();

            //gestion du clique sur valider les modifications
            $("#btn_save_modification_vehicule").on('click', function () {

                let formulaire = $('#form_update_vehicule');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                let formData = new FormData();

                if (formulaire.valid()) {

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

                                notifySuccess(response.message);
                                location.reload();

                            }
                             if (response.statut == 2) {

                                notifyWarning(response.message);

                            } else {

                                let errors = JSON.parse(JSON.stringify(response.errors));
                                let errors_list_to_display = '';
                                for (field in errors) {
                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                }

                                $('#modal-vehicule .alert .message').html(errors_list_to_display);

                                $('#modal-vehicule .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                    $(this).slideUp(500);
                                }).removeClass('alert-success').addClass('alert-warning');

                            }

                        },
                        error: function (request, status, error) {

                            notifyWarning("Erreur lors de l'enregistrement");
                        }

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


    //DETAILS de l'historique du vehicule
    $(document).on("click", ".btn_details_historique_vehicule", function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');
           alert(model_name);
        //let dialog_box = $("<div>").addClass('olea_std_dialog_box').appendTo('body');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-historique_vehicule .dataTable:not(.customDataTable_)').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'desc']],
                lengthMenu: [
                    [100],
                    [100],
                ],
                searching: false,
                lengthChange: false,
            });

            let i = 0;
            $('.dropzone_area').each(function (myElement) {
                let zone_id = $(this).attr('id');
                let href = $(this).attr('action');

                let dropzone = new Dropzone("#" + zone_id, { url: href, dictDefaultMessage: "" });

            });

            $('#modal-historique_vehicule').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-historique_vehicule').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-historique_vehicule').modal();

        });


    });


    // Importation véhicules
    $("#btn_importer_vehicules").on('click', function () {

        let href = $(this).attr('data-href');
        let formulaire = $('#modal_form_import_vehicules');

        let formData = new FormData();
        let files = $('#modal_form_import_vehicules #fichier')[0].files;
        let police_id = $('#modal_form_import_vehicules #police_id').val();

        if (files.length > 0) {

            formData.append('police_id', police_id);
            formData.append('fichier', files[0]);

            $.ajax({
                type: 'post',
                url: href,
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {

                    if (response.statut == 1) {

                        //Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {

                        notifyWarning(response.message, function () {
                            //location.reload();
                        });

                    }

                },
                error: function () {

                }
            });

        } else {
            notifyWarning('Veuillez chosisr un fichier');
        }


    });


    //DETAILS de marchandise
    $(document).on("click", ".btn_details_marchandise", function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        //let dialog_box = $("<div>").addClass('olea_std_dialog_box').appendTo('body');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-details_marchandise .dataTable:not(.customDataTable_)').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'desc']],
                lengthMenu: [
                    [100],
                    [100],
                ],
                searching: false,
                lengthChange: false,
            });

            let i = 0;
            $('.dropzone_area').each(function (myElement) {
                let zone_id = $(this).attr('id');
                let href = $(this).attr('action');

                let dropzone = new Dropzone("#" + zone_id, { url: href, dictDefaultMessage: "" });

            });

            $('#modal-details_marchandise').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-details_marchandise').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-details_marchandise').modal();

        });
    });


    //Modification de marchandise
    $(document).on('click', '.btn_modifier_marchandise', function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-modification_marchandise').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-modification_marchandise').find('.modal-title').text(modal_title);
            $('#modal-modification_marchandise').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-modification_marchandise').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-modification_marchandise').modal();

            //gestion du clique sur valider les modifications
            $("#btn_save_modification_marchandise").on('click', function () {

                let formulaire = $('#form_update_marchandise');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                let formData = new FormData();

                if (formulaire.valid()) {

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

                                notifySuccess(response.message);
                                location.reload();

                            }
                             if (response.statut == 2) {

                                notifyWarning(response.message);

                            } else {

                                let errors = JSON.parse(JSON.stringify(response.errors));
                                let errors_list_to_display = '';
                                for (field in errors) {
                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                }

                                $('#modal-vehicule .alert .message').html(errors_list_to_display);

                                $('#modal-vehicule .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                    $(this).slideUp(500);
                                }).removeClass('alert-success').addClass('alert-warning');

                            }

                        },
                        error: function (request, status, error) {

                            notifyWarning("Erreur lors de l'enregistrement");
                        }

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


    //Suppression de marchandise
    $(document).on('click', ".btn_supprimer_marchandise", function () {

        let police_id = $(this).data('police_id');
        let marchandise_id = $(this).data('marchandise_id');
        let href = $(this).data('href');
        //alert(href);
        let n = noty({
            text: 'Voulez-vous vraiment supprimer cette marchandise ?',
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
                            data: { police_id: police_id, marchandise_id: marchandise_id },
                            success: function (e) {
                                notifySuccess("Marchandise non trouvée !");
                                location.reload();
                            },
                            error: function () {
                                notifyWarning('Erreur lors de la suppression de la marchandise');
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


    //DETAILS de l'historique de la marchandise
    $(document).on("click", ".btn_details_histo_marchandise", function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        //let dialog_box = $("<div>").addClass('olea_std_dialog_box').appendTo('body');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-details_marchandise_histo .dataTable:not(.customDataTable_)').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'desc']],
                lengthMenu: [
                    [100],
                    [100],
                ],
                searching: false,
                lengthChange: false,
            });

            let i = 0;
            $('.dropzone_area').each(function (myElement) {
                let zone_id = $(this).attr('id');
                let href = $(this).attr('action');

                let dropzone = new Dropzone("#" + zone_id, { url: href, dictDefaultMessage: "" });

            });

            $('#modal-details_marchandise_histo').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-details_marchandise_histo').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-details_marchandise_histo').modal();

        });
    });

    //fin modification de beneficiaire


    //ajout d'un avenant sur une police

    $("#btn_save_avenant").on('click', function () {

        let formulaire = $('#form_add_avenant');
        let href = formulaire.attr('action');
        let href_police = $(this).attr('data-href_police');
        let mouvement = $('#mouvement').val();
        // console.log('href_police', href_police);
        // console.log('formulaire.serialize()', formulaire.serialize());
        // // Get form mouvement value
        // console.log('mouvement', $('#mouvement').val());
        // alert(href_police);

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: href,
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        //Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));
                        console.log(mouvement);
                        console.log(typeof(mouvement));
                        if(mouvement === '5' || mouvement === '16'){
                            helper_modification_police(href_police)
                        }else{
                             notifySuccess(response.message, function () {
                                location.reload();
                            });
                        }


                        /*
                        $('#modal-avenant .alert .message').text(response.message);

                        $('#modal-avenant .alert ').fadeTo(2000, 500).slideUp(500, function(){
                            $(this).slideUp(500);

                            avenant = response.data;
                            let t = $('#table_avenants').DataTable();

                            t.row.add([
                                        avenant.mouvement,
                                        avenant.motif ,
                                        avenant.date_effet,
                                        avenant.date_fin_periode_garantie
                                        ])
                                        .draw(false);

                            //Vider le formulaire
                            resetFields('#'+formulaire.attr('id'));

                            notifySuccess(response.message, function(){
                                location.reload();
                            });

                        }).removeClass('alert-warning').addClass('alert-success');
                        */

                    } else {

                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for (field in errors) {
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-avenant .alert .message').html(errors_list_to_display);

                        $('#modal-avenant .alert ').fadeTo(2000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-warning');

                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

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


    //Changement de mouvement, charger les motifs liés
    $('#mouvement').on('change', function () {

        let mouvement_id = $(this).val();
        $('#motif').html('<option value="">---------------------------</option>');

        $.ajax({
            type: 'get',
            url: '/production/mouvement/' + mouvement_id + '/motifs',
            success: function (motifs) {

                $('#motif').html('').append('<option value="">Sélectionnez un motif</option>');

                motifs.forEach(function (motif) {
                    $('#motif').append('<option value="' + motif.pk + '">' + motif.fields.libelle + '</option>');
                });

            },
            error: function () { }
        });

        //
        if (mouvement_id == 5) {
            $('#box_date_fin_periode_garantie').show();
            $('#date_fin_periode_garantie').attr('required', 'true');
        } else {
            $('#box_date_fin_periode_garantie').hide();
            $('#date_fin_periode_garantie').removeAttr('required');
        }


    });

    //fin ajout d'un avenant sur une police


    //ajout d'une formule universelle
    $(document).on("click", "#btn_save_formule_universelle", function () {

        $('.required_field').attr('required', true);
        let formulaire = $('#form_add_formule');
        let href = formulaire.attr('action');

        //if (formulaire.valid() && $("#option_mode_prefinancement").val() != "") {
        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: href,
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        formule = response.data;

                        //Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {

                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for (field in errors) {
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-forumule .alert .message').html(errors_list_to_display);

                        $('#modal-forumule .alert ').fadeTo(2000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-warning');

                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {

                console.log('Id: ' + index + ' Message: ' + value);

            });

            notifyWarning('Veuillez renseigner correctement le formulaire');
        }


    });


    //ajout d'une formule sur une police
    $(document).on("click", "#btn_save_formule", function () {

        let formulaire = $('#form_add_formule');
        let href = formulaire.attr('action');

        if (formulaire.valid() && $("#option_mode_prefinancement").val() != "") {

            $.ajax({
                type: 'post',
                url: href,
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        formule = response.data;

                        /*
                        let t = $('#table_formules').DataTable();


                        t.row.add([
                                    formule.libelle,
                                    '<span style="text-align:right"display:block;>'+formule.taux_couverture + ' %</span>',
                                    formule.territorialite,
                                    formule.type_tarif,
                                    formule.date_debut.split('-').reverse().join('/'),
                                    "",
                                    '<span class="badge badge-success>'+formule.statut+'</span>',
                                    '<span data-href="/production/formule/'+formule.id+'" class="btn badge btn-sm btn-details rounded-pill popup-detail_formule_bareme"><i class="fa fa-eye"></i> Détails</span></a>&nbsp;&nbsp;&nbsp;'
                                     +'<span title="Désactiver" data-href="/production/formule/del_bareme" data-bareme_id="{{ bareme.id }}" data-libelle="{{ bareme.acte.libelle }}" class="text-danger btn_supprimer_bareme" style="cursor:pointer;font-weight:normal;"><i class="fa fa-times"></i></span>',
                                    ])
                                    .draw(false);
                                    */


                        //Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {

                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for (field in errors) {
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-forumule .alert .message').html(errors_list_to_display);

                        $('#modal-forumule .alert ').fadeTo(2000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-warning');

                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {

                console.log('Id: ' + index + ' Message: ' + value);

            });

            notifyWarning('Veuillez renseigner correctement le formulaire');
        }


    });


    //modification d'une formule de garantie

    //ouverture du dialog
    $(document).on("click", ".btn-modal-modifier_formule", function () {

        let href = $(this).attr('data-href');

        $('#olea_std_dialog_box').load(href, function () {

            AppliquerMaskSaisie();

            $('#modal-formule-update').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-formule-update').find('.modal-dialog').addClass('modal-m');

            $('#modal_formule_update').modal();
        });

    });


    //ouverture du dialog pour assurance universelle
    $(document).on("click", ".btn-modal-modifier_formule_universelle", function () {

        let href = $(this).attr('data-href');

        $('#olea_std_dialog_box').load(href, function () {

            AppliquerMaskSaisie();

            $('#modal-formule-update').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-formule-update').find('.modal-dialog').addClass('modal-m');

            $('#modal_formule_update_universelle').modal();
        });

    });


    //modification proprement dite
    $(document).on("click", "#btn_update_formule_universelle", function () {

        let formulaire = $(this).closest('form');
        let href = formulaire.attr('action');

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: href,
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        formule = response.data;

                        //Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {

                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for (field in errors) {
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-forumule .alert .message').html(errors_list_to_display);

                        $('#modal-forumule .alert ').fadeTo(2000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-warning');

                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {

                console.log('Id: ' + index + ' Message: ' + value);

            });

            notifyWarning('Veuillez renseigner correctement le formulaire');
        }

    });


    //modification proprement dite
    $(document).on("click", "#btn_update_formule", function () {

        let formulaire = $(this).closest('form');
        let href = formulaire.attr('action');

        if (formulaire.valid() && $("#option_mode_prefinancement_update").val() != "") {

            $.ajax({
                type: 'post',
                url: href,
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        formule = response.data;

                        //Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {

                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for (field in errors) {
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-forumule .alert .message').html(errors_list_to_display);

                        $('#modal-forumule .alert ').fadeTo(2000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-warning');

                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {

                console.log('Id: ' + index + ' Message: ' + value);

            });

            notifyWarning('Veuillez renseigner correctement le formulaire');
        }

    });


    //desactivation d'une formule de garantie
    $(document).on("click", ".btn-modal-formule-desactivate", function () {
        let href = $(this).data('href');
        let formulaire = $("#form_desactivate_formule");
        formulaire.attr('action', href);

        var id = $(this).data('id');
        var type = "desactivate";
        var libelle = $(this).data('libelle');
        var taux_couverture = $(this).data('tauxcouverture');
        var territorialite = $(this).data('territorialite');
        var date_debut = $(this).data('datedebut');
        var date_fin = $(this).data('datefin');
        var statut = $(this).data('statut');
        $("#modal-formule-desactivate #mbu-id").val(id);
        $("#modal-formule-desactivate #mbu-type").val(type);
        $("#modal-formule-desactivate #mbu-libelle").val(libelle);
        //$("#modal-formule-desactivate #mbu-date_fin").val(date_fin);

        $("#modal-formule-desactivate #mbu-title").html("DESACTIVATION D'UNE FORMULE DE GARANTIE");
        $("#modal-formule-desactivate #mbu-libelle").parent().parent().hide();
        $("#modal-formule-desactivate #mbu-date_fin").parent().parent().show();

    });


    //Added on 10102023: ajout d'un bouton pour afficher la zone de modification de l'affection
    $(document).on('click', '#btn_show_form_update_affection', function () {
        $('#form_Add_affection_hopit').show();
        $(this).hide();
    });


    //showing selon choix type prefinancement
    $(document).on('change', '#option_mode_prefinancement, #option_mode_prefinancement_update', function () {

        $('.if_tpp').addClass("d-none");
        $('.if_tpp .form-control').removeAttr('required');
        // $('.champ_variable input').removeAttr('required')

        let option_mode_prefinancement = $(this).val();

        switch (option_mode_prefinancement) {
            case "TPP"://prime par famille
                $('.if_tpp').removeClass("d-none");
                $('.if_tpp .form-control').attr('required', 'required');
                //$('.if_prime_famille input:not(.not_required)').attr('required','required');
                break;
        }

    });


    //showing selon choix type prefinancement
    $(document).on('change', '#formule_rubriques, #formule_rubriques_update', function () {

        $(".select2-selection__choice__display").css("color", "#000");

    });


    $(document).on('click', '#btnAddAffectionToDossierSinistre', function () {
        let formulaire = $('#form_Add_affection_hopit');
        let href = formulaire.attr('action');
        $.ajax({
            type: 'post',
            url: href,
            data: formulaire.serialize(),
            success: function (response) {

                if (response.statut == 1) {
                    notifySuccess(response.message, function () {
                        location.reload();
                    });

                } else {
                    notifySuccess(response.message);
                }

            },
            error: function (request, status, error) {

                notifyWarning("Erreur lors de l'ajout de l'affection");
            }

        });
    })


    $(document).on("click", "#btn_save_bareme", function () {

        let formulaire = $('#form_add_bareme');
        let href = formulaire.attr('action');

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: href,
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        ligne_bareme = response.data;
                        let t = $('#table_baremes').DataTable();
                        if (ligne_bareme.is_garanti == "GARANTI") {
                            ligne_bareme.is_garanti = '<span class="badge badge-success">GARANTI</span>';
                        } else {
                            ligne_bareme.is_garanti = '<span class="badge badge-danger">EXCLU</span>';
                        }

                        //statut actif par défaut
                        ligne_bareme.statut = '<span class="badge badge-success">ACTIF</span>';

                        let actions_buttons = '<span data-href="" class="btn badge btn-sm btn-details rounded-pill btn-popup_details_ligne_bareme"><i class="fa fa-eye"></i> Détails</span></a>&nbsp;&nbsp;&nbsp;'
                            + '<span title="Modifier" data-href="" class="text-warning btn-popup_details_ligne_bareme" style="cursor:pointer;font-weight:normal;"><i class="fa fa-edit"></i></span>&nbsp;&nbsp;&nbsp;'
                            + '<span title="Désactiver" data-href="" class="text-danger btn-popup_details_ligne_bareme" style="cursor:pointer;font-weight:normal;"><i class="fa fa-times"></i></span>';

                        t.row.add([ligne_bareme.rubrique,
                        ligne_bareme.sous_rubrique,
                        ligne_bareme.regroupement_acte,
                        ligne_bareme.acte,
                        ligne_bareme.qualite_beneficiaire,
                        ligne_bareme.age_minimum,
                        ligne_bareme.age_maximum,
                        ligne_bareme.is_garanti,
                        ligne_bareme.taux_couverture,
                        ligne_bareme.plafond_rubrique,
                        ligne_bareme.plafond_sous_rubrique,
                        ligne_bareme.plafond_regroupement_acte,
                        ligne_bareme.plafond_acte,
                        ligne_bareme.date_debut.split('-').reverse().join('/'),
                        ligne_bareme.date_fin.split('-').reverse().join('/'),
                            //ligne_bareme.statut,
                            actions_buttons
                        ])
                            .draw(false);

                        //Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        formulaire.find(".tags-multiple").val('').trigger('change');
                        formulaire.find("#acte").empty('change');

                        //$('#'+formulaire + " select").val('').trigger('change');
                        //$('#'+formulaire).val("").trigger("change");

                        notifySuccess(response.message, function () {
                            //location.reload();
                        });

                    } else {

                        notifyWarning(response.message);

                        /*
                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for(field in errors){
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-bareme .alert .message').html(errors_list_to_display);

                        $('#modal-bareme .alert ').fadeTo(2000, 500).slideUp(500, function(){
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-warning');
                        */

                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {

                console.log('Id: ' + index + ' Message: ' + value);

            });

            notifyWarning('Veuillez renseigner correctement le formulaire');
        }


    });


    //afficher le modal de saisi de la date de realisation d'une seance sinistre
    $(document).on("click", ".popup-detail_formule_bareme", function (e) {

        e.preventDefault();

        href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            $('#modal-details_bareme').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-details_bareme').find('.modal-dialog').addClass('modal-lg');

            //
            $('#modal-details_bareme').modal();

        });
    });


    //afficher le modal de désactivation d'un barème
    $(document).on("click", ".popup-desactiver_bareme", function (e) {

        e.preventDefault();

        let bareme_id = $(this).data('bareme_id');
        let libelle = $(this).data('libelle');

        let tr = $(this).closest('tr');


        $('#modal-desactiver_bareme #bareme_id').val(bareme_id);
        //let tr = $('#table_apporteurs_police tbody tr:first');

        let timestamp = Date.now();

        $('#table_bareme_a_supprimer tbody')
            .append('<tr id="tr_x">' + tr.html() + '</tr>')
            .ready(function () {
                tr = $('#tr_x');
                tr.find('td:last').remove();
                tr.find('td:last').remove();
                tr.find('td:last').remove();
                AppliquerMaskSaisie();
            });

        $('#modal-desactiver_bareme').attr('data-backdrop', 'static').attr('data-keyboard', false);

        $('#modal-desactiver_bareme').find('.modal-dialog').addClass('modal-lg');

        //
        $('#modal-desactiver_bareme').modal();

    });

    //au changement de rubrique
    $(document).on("change", "#form_add_bareme #rubrique", function () {
        rubrique_id = $(this).val();
        let href = $(this).data('href_load_actes');

        $('#form_add_bareme #regroupement_acte').html('').append('<option value="">Choisir</option>');
        $('#form_add_bareme #acte').html('').append('<option value="">Choisir</option>');

        //charger les actes
        $.ajax({
            type: 'get',
            url: '/production/actes_by_rubrique/' + rubrique_id,
            dataType: 'json',
            success: function (actes) {
                $('#form_add_bareme #acte').html('').append('<option value="">Choisir</option>');

                actes.forEach(function (acte) {
                    $('#form_add_bareme #acte').append('<option value="' + acte.pk + '">' + acte.fields.libelle + '</option>');
                });
            },
            error: function () {
                console.log('Erreur lors du chargement des actes ');
            }
        });


        //charger les regroupements d'actes
        $.ajax({
            type: 'get',
            url: '/production/regroupements_actes_by_rubrique/' + rubrique_id,
            dataType: 'json',
            success: function (regroupements_actes) {
                $('#form_add_bareme #regroupement_acte').html('').append('<option value="">Choisir</option>');

                regroupements_actes.forEach(function (regroupement_acte) {
                    $('#form_add_bareme #regroupement_acte').append('<option value="' + regroupement_acte.pk + '">' + regroupement_acte.fields.libelle + '</option>');
                });
            },
            error: function () {
                console.log("Erreur lors du chargement des regroupements d'actes");
            }
        });


        //charger les sous-regroupements d'actes
        $.ajax({
            type: 'get',
            url: '/production/sous_regroupements_actes_by_rubrique/' + rubrique_id,
            dataType: 'json',
            success: function (sous_regroupements_actes) {
                $('#form_add_bareme #sous_regroupement_acte').html('').append('<option value="">Choisir</option>');

                sous_regroupements_actes.forEach(function (sous_regroupement_acte) {
                    $('#form_add_bareme #sous_regroupement_acte').append('<option value="' + sous_regroupement_acte.pk + '">' + sous_regroupement_acte.fields.libelle + '</option>');
                });
            },
            error: function () {
                console.log("Erreur lors du chargement des sous-regroupements d'actes");
            }
        });


        //charger les sous-rubriques
        $.ajax({
            type: 'get',
            url: '/production/sous_rubriques_by_rubrique/' + rubrique_id,
            dataType: 'json',
            success: function (sous_rubriques) {
                $('#form_add_bareme #sous_rubrique').html('').append('<option value="">Choisir</option>');

                sous_rubriques.forEach(function (sous_rubrique) {
                    $('#form_add_bareme #sous_rubrique').append('<option value="' + sous_rubrique.pk + '">' + sous_rubrique.fields.libelle + '</option>');
                });
            },
            error: function () {
                console.log('Erreur lors du chargement des sous-rubrique ');
            }
        });


    });


    $(document).on("change", "#form_add_bareme #regroupement_acte", function () {


        regroupement_acte_id = $(this).val();
        let href = $(this).data('href_load_actes');

        if (regroupement_acte_id != "") {

            //vider le champ sous-rubrique
            $('#form_add_bareme #sous_rubrique').val('').trigger('change');

            //charger les actes du regroupement
            $.ajax({
                type: 'get',
                url: '/production/actes_by_regroupement_acte/' + regroupement_acte_id,
                dataType: 'json',
                success: function (actes) {
                    $('#form_add_bareme #acte').html('').append('<option value="">Choisir</option>');


                    actes.forEach(function (acte) {
                        $('#form_add_bareme #acte').append('<option value="' + acte.pk + '">' + acte.fields.libelle + '</option>');
                    });
                },
                error: function () {
                    console.log('Erreur lors du chargement des actes ');
                }
            });

        } else {
            //recharger la liste des acteqs de la rubrique
            let rubrique_id = $('#form_add_bareme #rubrique').val();

            $.ajax({
                type: 'get',
                url: '/production/actes_by_rubrique/' + rubrique_id,
                dataType: 'json',
                success: function (actes) {
                    $('#form_add_bareme #acte').html('').append('<option value="">Choisir</option>');


                    actes.forEach(function (acte) {
                        $('#form_add_bareme #acte').append('<option value="' + acte.pk + '">' + acte.fields.libelle + '</option>');
                    });
                },
                error: function () {
                    console.log('Erreur lors du chargement des actes ');
                }
            });

        }

    });


    $(document).on("change", "#form_add_bareme #sous_rubrique", function () {

        sous_rubrique_id = $(this).val();
        let href = $(this).data('href_load_actes');

        if (sous_rubrique_id != "") {
            $('#form_add_bareme #regroupement_acte').val('').trigger('change');
            $('#form_add_bareme #acte').val('').trigger('change');
        }

    });


    //a la fermeture du dialog, rafraichir la page
    $("#modal-bareme").on("hidden.bs.modal", function () {
        location.href = '';
    });


    //suppression de bareme
    $(document).on("click", "#btn_desactiver_bareme", function (e) {
        let formulaire = $(this).closest("form");

        let href = formulaire.attr('action');

        let bareme_id = $('#bareme_id').val();
        let date_fin = $('#date_fin_bareme').val();

        if (bareme_id != '' && date_fin != "") {

            let n = noty({
                text: 'Voulez-vous vraiment désactiver cette spécificité ?',
                type: 'warning',
                dismissQueue: true,
                layout: 'center',
                theme: 'defaultTheme',
                buttons: [
                    {
                        addClass: 'btn btn-primary', text: 'Supprimer', onClick: function ($noty) {
                            $noty.close();

                            //confirmation obtenu
                            $.ajax({
                                type: 'post',
                                url: href,
                                data: formulaire.serialize(),
                                success: function (response) {

                                    if (response.statut == 1) {

                                        notifySuccess(response.message, function () {
                                            location.reload();
                                        });

                                    } else {
                                        notifyWarning(response.response);
                                    }

                                },
                                error: function (request, status, error) {

                                    notifyWarning("Erreur lors du traitement");
                                }

                            });

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
            notifyWarning("Veuillez saisir la date fin SVP");
        }


    });

    //fin ajout d'un bareme sur une police


    // Impression des cartes des bénéficiaires d'une police
    $("#parametre_impression").on('change', function () {
        let parametre_impression = $(this).val();
        if (parametre_impression == 'all') {
            $('.if_plage').hide();
            $('.if_plage').find('input').removeAttr('required');
        } else {
            $('.if_plage').show();
            $('.if_plage').find('input#numero_fin').attr('required', true);
        }
    });


    $("#btn_imprimer_cartes").on('click', function () {
        let btn_valider = $(this);

        let formulaire = $('#form_imprimer_cartes');
        let href = formulaire.attr('action');

        if (formulaire.valid()) {

            btn_valider.hide();
            $('#imprimer_cartes_loader').show();

            $.ajax({
                type: 'post',
                url: href,
                data: formulaire.serialize(),
                cache: false,
                xhr: function () {
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 2) {
                            if (xhr.status == 200) {
                                xhr.responseType = "blob";
                            } else {
                                xhr.responseType = "json";
                            }
                        }
                    };
                    return xhr;
                },
                success: function (data) {
                    fileName = "polices_cartes_beneficiaires.pdf";
                    //Convert the Byte Data to BLOB object.
                    var blob = new Blob([data], { type: "application/octetstream" });

                    //Check the Browser type and download the File.
                    var isIE = false || !!document.documentMode;
                    if (isIE) {
                        window.navigator.msSaveBlob(blob, fileName);
                    } else {
                        var url = window.URL || window.webkitURL;
                        link = url.createObjectURL(blob);
                        var a = $("<a />");
                        a.attr("download", fileName);
                        a.attr("href", link);
                        $("body").append(a);
                        a[0].click();
                        $("body").remove(a);
                    }

                    btn_valider.show();
                    $('#imprimer_cartes_loader').hide();

                },
                error: function () {
                    btn_valider.show();
                    $('#imprimer_cartes_loader').hide();

                    notifyWarning("Erreur lors de l'impression des cartes");

                    let errors = JSON.parse(JSON.stringify(response.errors));
                    let errors_list_to_display = '';
                    for (field in errors) {
                        errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                    }

                    $('#modal-edition_cartes .alert .message').html(errors_list_to_display);

                    $('#modal-edition_cartes .alert ').fadeTo(2000, 500).slideUp(500, function () {
                        $(this).slideUp(500);
                    }).removeClass('alert-success').addClass('alert-warning');
                }
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


    $("#execution_requete_excel").on('click', function () {
        let btn_valider = $(this);

        let formulaire = $('#form_execution_requete_excel');
        let href = formulaire.attr('action');
        let taskVerifUrl = formulaire.attr('data-task-url');
        //alert(taskVerifUrl);

        if (formulaire.valid()) {

            btn_valider.hide();
            $('#loader').show();

            $.ajax({
                type: 'post',
                url: href,
                data: formulaire.serialize(),
                cache: false,
                xhr: function () {
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 2) {
                            if (xhr.status == 200) {
                                xhr.responseType = "blob";
                            } else {
                                xhr.responseType = "json";
                            }
                        }
                    };
                    return xhr;
                },
                success: function (data) {
                    // SUIVI SP CLIENT PAR FILIALE
                    // fileName = "LISTE_DE_SINISTRES_ORDONNANCES.xlsx";
                    fileName = $('select[name="query_name"]').val() + ".xlsx";
                    //Convert the Byte Data to BLOB object.
                    var blob = new Blob([data], { type: "application/octetstream" });

                    //Check the Browser type and download the File.
                    var isIE = false || !!document.documentMode;
                    if (isIE) {
                        window.navigator.msSaveBlob(blob, fileName);
                    } else {
                        var url = window.URL || window.webkitURL;
                        link = url.createObjectURL(blob);
                        var a = $("<a />");
                        a.attr("download", fileName);
                        a.attr("href", link);
                        $("body").append(a);
                        a[0].click();
                        $("body").remove(a);
                    }

                    btn_valider.show();
                    $('#loader').hide();

                    // Background query task delect
                    $.ajax({ type: 'post', url: taskVerifUrl, data: {} });


                },
                error: function (response) {
                    console.log(response);
                    btn_valider.show();
                    $('#loader').hide();

                    // Background query task init
                    // $.ajax({type:'post',url:taskVerifUrl,data:{"task_event":"ENCOURS"}});
                    //notifyWarning(response.message)
                    notifyWarning("Votre requête a dépassé le temps limite d'exécution. Nous la traitons en arrière-plan et vous notifierons dès que celle-ci sera terminée. Merci pour votre patience.");

                }
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


    $("#execution_requete_super_admin").on('click', function () {
        let btn_valider = $(this);

        let formulaire = $('#form_execution_requete_super_admin');
        let href = formulaire.attr('action');
        // let taskVerifUrl = formulaire.attr('data-task-url');
        //alert(taskVerifUrl);

        if (formulaire.valid()) {

            btn_valider.hide();
            $('#loader').show();
            $('#msg-box').html("");

            //demander confirmation
            let n = noty({
                        text: "Voulez-vous vraiment effectuer l'action ?",
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
                                        success: function (data) {
                                            console.log('success',data);
                                            btn_valider.show();
                                            $('#loader').hide();
                                            $('#msg-box').html(data.message);
                                        },
                                        error: function (response) {
                                            console.log('error', response);
                                            btn_valider.show();
                                            $('#loader').hide();
                                            $('#msg-box').html(response.responseJSON.message);

                                        }
                                    });

                                    //fin confirmation obtenue

                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();
                                    btn_valider.show();
                                    $('#loader').hide();

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

            // notifyWarning('Veuillez renseigner tous les champs obligatoires');
        }

    });



    $("#execution_requete_excel_compta").on('click', function () {
        let btn_valider = $(this);

        let formulaire = $('#form_execution_requete_excel_compta');
        let href = formulaire.attr('action');

        if (formulaire.valid()) {

            btn_valider.hide();
            $('#loader_compta').show();

            $.ajax({
                type: 'post',
                url: href,
                data: formulaire.serialize(),
                cache: false,
                xhr: function () {
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 2) {
                            if (xhr.status == 200) {
                                xhr.responseType = "blob";
                            } else {
                                xhr.responseType = "json";
                            }
                        }
                    };
                    return xhr;
                },
                success: function (data) {
                    fileName = $('select[name="query_name"]').val() + ".xlsx";
                    //Convert the Byte Data to BLOB object.
                    var blob = new Blob([data], { type: "application/octetstream" });

                    //Check the Browser type and download the File.
                    var isIE = false || !!document.documentMode;
                    if (isIE) {
                        window.navigator.msSaveBlob(blob, fileName);
                    } else {
                        var url = window.URL || window.webkitURL;
                        link = url.createObjectURL(blob);
                        var a = $("<a />");
                        a.attr("download", fileName);
                        a.attr("href", link);
                        $("body").append(a);
                        a[0].click();
                        $("body").remove(a);
                    }

                    btn_valider.show();
                    $('#loader_compta').hide();

                },
                error: function (response) {
                    console.log(response);
                    btn_valider.show();
                    $('#loader_compta').hide();
                    notifyWarning("Une erreur c'est produite lors de l'execution de la requête");

                }
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

    //fin


    //Standard: ouvrir les popups de modification
    $(".btn_open_on_modal").on('click', function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        $('#modal-dynamique').find('.modal-title').text(modal_title);
        $('#modal-dynamique').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
        $('#modal-dynamique').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

        $('#modal-dynamique').modal({ backdrop: "static ", keyboard: false }).find('.modal-body').text("Chargement en cours...").load(href, function () {
            alert('Data loaded ');
        });

    });


    //Valider les modifications
    $("#btn_valider").on('click', function () {

        let model_name = $(this).attr('data-model_name');
        let href = $(this).attr('data-href');
        let formulaire = $('#modal-dynamique').find('form');

        switch (model_name) {

            default:

                $.ajax({
                    url: href,
                    type: 'post',
                    data: formulaire.serialize(),
                    success: function (response) {

                        if (response.statut == 1) {

                            $('#modal-dynamique .alert .message').text(response.message);

                            $('#modal-dynamique .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                $(this).slideUp(500);
                                $("#modal-dynamique").modal('toggle');

                                notifySuccess(response.message);
                                location.reload();

                            }).removeClass('alert-warning').addClass('alert-success');

                        } else {

                            $('#modal-dynamique .alert .message').text(response.message);

                            $('#modal-dynamique .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                $(this).slideUp(500);
                            }).removeClass('alert-success').addClass('alert-warning');

                        }

                    },
                    error: function () {
                        notifyWarning('Erreur lors de la modification');
                    }
                });

                break;

        }

    });



    //*************** AJOUT ET MODIFICATION DE POLICE *****************//

    //ajout d'une police

    //gestion champs à afficher ou ne pas afficher selon l'option de calcul de la prime choisie
    $('.champ_variable').hide();//cacher tout par défaut
    $('.champ_variable input').removeAttr('required');

    $(document).on('change', '#option_calcul_prime, #option_calcul_prime_modification', function () {

        $('.champ_variable').hide();
        $('.champ_variable input').removeAttr('required')

        let option_calcul_prime_id = parseInt($(this).val());
        let option_calcul_prime_code = $(this).children('option:selected').data('code');

        switch (option_calcul_prime_id) {
            case 1://prime par famille
                $('.if_prime_famille').show();
                //$('.if_prime_famille input:not(.not_required)').attr('required','required');
                break;
            case 2://prime par personne
                $('.if_prime_personne').show();
                //$('.if_prime_personne input:not(.not_required)').attr('required','required');
                break;
            case 3://prime par adulte/enfant
                $('.if_prime_adulte_enfant').show();
                //$('.if_prime_adulte_enfant input:not(.not_required)').attr('required','required');
                break;
            case 4://prime proportionnelle
                $('.if_prime_proportionnelle').show();
                //$('.if_prime_proportionnelle input:not(.not_required)').attr('required','required');
                break;
        }

    });


    //fin champ liés à l'option de calcul de la prime

    $("#btn_save_police").on('click', function () {
        let btn_submit = $(this);

        btn_submit.attr('disabled', true);

        let formulaire = $('#form_add_police');
        let href = formulaire.attr('action');

        $.validator.setDefaults({ ignore: [] });

        let formData = new FormData();

        if (formulaire.valid()) {

            // Enregistrement direct sans confirmation
            let data_serialized = formulaire.serialize();
            $.each(data_serialized.split('&'), function (index, elem) {
                let vals = elem.split('=');

                let key = vals[0];
                let valeur = decodeURIComponent(vals[1].replace(/\+/g, '  '));

                formData.append(key, valeur);
            });

            // Récupérer les garanties cochées
            $('.garantie-checkbox:checked').each(function () {
                let garantieId = $(this).val(); // ID de la garantie
                let franchise = $(`input[name="franchise_${garantieId}"]`).val() || ''; // Franchise associée
                let capital = $(`input[name="capital_${garantieId}"]`).val() || ''; // Capital associé

                // Ajouter ces données au FormData
                formData.append(`garanties[${garantieId}][id]`, garantieId);
                formData.append(`garanties[${garantieId}][franchise]`, franchise);
                formData.append(`garanties[${garantieId}][capital]`, capital);
            });

            // Ajout du fichier logo_partenaire au FormData
            let logo_partenaire_input = $('#logo_partenaire')[0];
            let logo_partenaire_file = logo_partenaire_input.files[0];

            formData.append('logo_partenaire', logo_partenaire_file);

            $.ajax({
                type: 'post',
                url: href,
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {

                    btn_submit.removeAttr('disabled');

                    if (response.statut == 1) {

                        let police = response.data;

                        // Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));
                        resetFields('#form_add_autres_taxes');

                        // Vider les cookies enregistrées pour l'occasion
                        document.cookie = "taxes=";

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    }
                    if (response.statut == 2) {

                        notifyInfo(response.message, function () {
                            location.reload();
                        });

                    } else {

                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for (field in errors) {
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-police .alert .message').html(errors_list_to_display);

                        $('#modal-police .alert').fadeTo(5000, 2000).slideUp(2000, function () {
                            $(this).slideUp(2000);
                        }).removeClass('alert-success').addClass('alert-warning');
                    }
                },
                error: function (request, status, error) {
                    btn_submit.removeAttr('disabled');
                    notifyWarning("Erreur lors de l'enregistrement ");
                }
            });

        } else {
            // Validation échouée
            btn_submit.removeAttr('disabled');

            $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {
                console.log('Id: ' + index + ' Message: ' + value);
            });

            notifyWarning('Veuillez renseigner tous les champs obligatoires');
        }
    });


    //actualiser le taux de commission au changement de la compagnie
    $("#modal-police #branche").on('change', function () {

        let branche_id = $(this).val();
        let branche_code = $(this).find('option:selected').data('branche_code');

        $.ajax({
            type: 'get',
            url: '/production/ajax_produits/' + branche_id,
            dataType: 'json',
            success: function (produits) {
                $('#modal-police #produit').html('').append('<option value="">Choisir</option>');

                produits.forEach(function (produit) {
                    $('#modal-police #produit').append('<option value="' + produit.pk + '">' + produit.fields.nom + '</option>');
                });
            },
            error: function () {
                console.log('Erreur loading produits ');
            }
        });

        //si ce n'est pas la santé, retirer les onglets option de calcul de la prime et coeficients stats

        if (branche_code == "SANTE") {
            $('.onglets_sante_uniquement').show();
            $('.required_field').attr('required', true);
        } else {
            $('.onglets_sante_uniquement').hide();
            $('.required_field').removeAttr('required');
        }


    });

    //actualiser la liste des apporteurs
    $("#btn_refresh_liste_apporteurs").on('click', function () {
        //alert("btn_refresh_liste_apporteurs");

        let href_apporteurs = $(this).data('href');

        $.ajax({
            type: 'get',
            url: href_apporteurs,
            dataType: 'json',
            success: function (apporteurs) {
                $('#modal-police .intermediaire').each(function () {
                    var $intermediaire = $(this);
                    if ($intermediaire.val() === "") {
                        $intermediaire.html('').append('<option value="">Choisir</option>');
                    }
                });

                apporteurs.forEach(function (apporteur) {
                    $('#modal-police .intermediaire').each(function () {
                        var $intermediaire = $(this);
                        if ($intermediaire.val() === "") {
                            $intermediaire.append('<option value="' + apporteur.pk + '">' + apporteur.fields.nom + ' ' + apporteur.fields.prenoms + '</option>');
                        }
                    });
                });
            },
            error: function () {
                console.log('Erreur de chargement des apporteurs ');
            }
        });

    });

    //fin ajout d'un police sur une police


    //TODO:modification de police
    $(".btn_modifier_police").on('click', function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        $('#olea_std_dialog_box').load(href, function () {

            //Added on 23032023: charger la liste des produits

            let branche_id = $("#modal-modification_police #branche_modification").val();
            let branche_code = $("#modal-modification_police #branche_modification").find('option:selected').data('branche_code');

            //si ce n'est pas la santé, retirer les onglets option de calcul de la prime et coeficients stats
            if (branche_code == "SANTE") {
                $('.onglets_sante_uniquement').show();
                $('.required_field').attr('required', true);
            } else {
                $('.onglets_sante_uniquement').hide();
                $('.required_field').removeAttr('required');
            }


            //actualiser le taux de commission au changement de la compagnie
            $("#modal-modification_police #branche_modification").on('change', function () {

                let branche_id = $(this).val();
                let branche_code = $(this).find('option:selected').data('branche_code');

                $.ajax({
                    type: 'get',
                    url: '/production/ajax_produits/' + branche_id,
                    dataType: 'json',
                    success: function (produits) {
                        $('#modal-modification_police #produit_modification').html('').append('<option value="">Choisir</option>');

                        produits.forEach(function (produit) {
                            let selected = (produit.branche_id == branche_id) ? ' selected ' : '';
                            $('#modal-modification_police #produit_modification').append('<option ' + selected + ' value="' + produit.pk + '">' + produit.fields.nom + '</option>');
                        });
                    },
                    error: function () {
                        console.log('Erreur loading produits ');
                    }
                });


                //si ce n'est pas la santé, retirer les onglets option de calcul de la prime et coeficients stats
                if (branche_code == "SANTE") {
                    $('.onglets_sante_uniquement').show();
                    $('.required_field').attr('required', true);
                } else {
                    $('.onglets_sante_uniquement').hide();
                    $('.required_field').removeAttr('required');
                }


            });


            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-modification_police').attr('data-backdrop', 'static').attr('data-keyboard', false);

            //$('#modal-modification_police').find('.modal-title').text(modal_title);
            $('#modal-modification_police').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-modification_police').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-modification_police').modal();

            $('#option_calcul_prime_modification').change();

            //actualiser le taux de commission au changement de la compagnie
            $("#modal-modification_police #compagnie_modification, #modal-modification_police #produit_modification").on('change', function () {
                let compagnie_id = $("#modal-modification_police #compagnie_modification").val();
                let produit_id = $('#modal-modification_police #produit_modification').val();

                $.ajax({
                    type: 'get',
                    url: '/production/compagnie/ajax_infos_compagnie/' + compagnie_id + '/' + produit_id,
                    dataType: 'json',
                    success: function (data) {

                        let taux_com_gestion = data.taux_com_gestion;
                        let taux_com_courtage = data.taux_com_courtage;

                        $('#modal-modification_police #taux_com_gestion_modification').val(taux_com_gestion);
                        $('#modal-modification_police #taux_com_courtage_modification').val(taux_com_courtage);

                        calculer_montant_divers_police_modification();

                    },
                    error: function () {
                        console.log('Erreur de chargement : ajax_infos_compagnie ');
                    }
                });


            });


            //pendant la saisie de la prime net




            //gestion du clique sur valider les modifications
            $("#btn_save_modification_police").on('click', function () {

                let formulaire = $('#form_update_police');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                let formData = new FormData();

                if (formulaire.valid()) {

                    //demander confirmation
                    let n = noty({
                        text: 'Voulez-vous vraiment modifier cette police ?',
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

                                    // Add logo_partenaire file to FormData
                                    let logo_partenaire_input = $('#logo_partenaire_modification')[0];
                                    let logo_partenaire_file = logo_partenaire_input.files[0];

                                    formData.append('logo_partenaire', logo_partenaire_file);


                                    $.ajax({
                                        type: 'post',
                                        url: href,
                                        data: formData,
                                        processData: false,
                                        contentType: false,
                                        xhrFields: {
                                            withCredentials: true
                                        },
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

                                                $('#modal-police .alert .message').html(errors_list_to_display);

                                                $('#modal-police .alert ').fadeTo(2000, 500).slideUp(500, function () {
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

                    notifyWarning('Il y a des erreurs de saisie dans le formulaire');
                }


            });


        });


    });

    // creer une function
    function helper_modification_police(href, modal_title, model_name) {
        // let model_name = $(this).attr('data-model_name');
        // let modal_title = $(this).attr('data-modal_title');
        // let href = $(this).attr('data-href');
        // alert('hello helper_modification_police');
        $('#olea_std_dialog_box').load(href, function () {

            //Added on 23032023: charger la liste des produits

            let branche_id = $("#modal-modification_police #branche_modification").val();
            let branche_code = $("#modal-modification_police #branche_modification").find('option:selected').data('branche_code');

            //si ce n'est pas la santé, retirer les onglets option de calcul de la prime et coeficients stats
            if (branche_code == "SANTE") {
                $('.onglets_sante_uniquement').show();
                $('.required_field').attr('required', true);
            } else {
                $('.onglets_sante_uniquement').hide();
                $('.required_field').removeAttr('required');
            }


            //actualiser le taux de commission au changement de la compagnie
            $("#modal-modification_police #branche_modification").on('change', function () {

                let branche_id = $(this).val();
                let branche_code = $(this).find('option:selected').data('branche_code');

                $.ajax({
                    type: 'get',
                    url: '/production/ajax_produits/' + branche_id,
                    dataType: 'json',
                    success: function (produits) {
                        $('#modal-modification_police #produit_modification').html('').append('<option value="">Choisir</option>');

                        produits.forEach(function (produit) {
                            let selected = (produit.branche_id == branche_id) ? ' selected ' : '';
                            $('#modal-modification_police #produit_modification').append('<option ' + selected + ' value="' + produit.pk + '">' + produit.fields.nom + '</option>');
                        });
                    },
                    error: function () {
                        console.log('Erreur loading produits ');
                    }
                });


                //si ce n'est pas la santé, retirer les onglets option de calcul de la prime et coeficients stats
                if (branche_code == "SANTE") {
                    $('.onglets_sante_uniquement').show();
                    $('.required_field').attr('required', true);
                } else {
                    $('.onglets_sante_uniquement').hide();
                    $('.required_field').removeAttr('required');
                }


            });


            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-modification_police').attr('data-backdrop', 'static').attr('data-keyboard', false);

            //$('#modal-modification_police').find('.modal-title').text(modal_title);
            $('#modal-modification_police').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-modification_police').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-modification_police').modal();

            $('#option_calcul_prime_modification').change();

            //actualiser le taux de commission au changement de la compagnie
            $("#modal-modification_police #compagnie_modification, #modal-modification_police #produit_modification").on('change', function () {
                let compagnie_id = $("#modal-modification_police #compagnie_modification").val();
                let produit_id = $('#modal-modification_police #produit_modification').val();

                $.ajax({
                    type: 'get',
                    url: '/production/compagnie/ajax_infos_compagnie/' + compagnie_id + '/' + produit_id,
                    dataType: 'json',
                    success: function (data) {

                        let taux_com_gestion = data.taux_com_gestion;
                        let taux_com_courtage = data.taux_com_courtage;

                        $('#modal-modification_police #taux_com_gestion_modification').val(taux_com_gestion);
                        $('#modal-modification_police #taux_com_courtage_modification').val(taux_com_courtage);

                        calculer_montant_divers_police_modification();

                    },
                    error: function () {
                        console.log('Erreur de chargement : ajax_infos_compagnie ');
                    }
                });


            });


            //pendant la saisie de la prime net




            //gestion du clique sur valider les modifications
            $("#btn_save_modification_police").on('click', function () {

                let formulaire = $('#form_update_police');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                let formData = new FormData();

                if (formulaire.valid()) {

                    //demander confirmation
                    let n = noty({
                        text: 'Voulez-vous vraiment modifier cette police ?',
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

                                    // Add logo_partenaire file to FormData
                                    let logo_partenaire_input = $('#logo_partenaire_modification')[0];
                                    let logo_partenaire_file = logo_partenaire_input.files[0];

                                    formData.append('logo_partenaire', logo_partenaire_file);


                                    $.ajax({
                                        type: 'post',
                                        url: href,
                                        data: formData,
                                        processData: false,
                                        contentType: false,
                                        xhrFields: {
                                            withCredentials: true
                                        },
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

                                                $('#modal-police .alert .message').html(errors_list_to_display);

                                                $('#modal-police .alert ').fadeTo(2000, 500).slideUp(500, function () {
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

                    notifyWarning('Il y a des erreurs de saisie dans le formulaire');
                }


            });


        });
    }

    //fin modification de police

    //calculs divers

    $("#modal-police #compagnie, #modal-police #produit").on('change', function () {

        let compagnie_id = $("#modal-police #compagnie").val();
        let produit_id = $('#modal-police #produit').val();

        // Réinitialiser les champs si l'un des sélecteurs est modifié
        $('#modal-police #taux_com_courtage').val('');
        $('#modal-police #taux_com_courtage_terme').val('');
        $('#modal-police #taux_com_gestion').val('');

        if (compagnie_id && produit_id) {
            $.ajax({
                type: 'get',
                url: '/production/compagnie/ajax_infos_compagnie/' + compagnie_id + '/' + produit_id,
                dataType: 'json',
                success: function (data) {

                    let taux_com_courtage = parseFloat(data.taux_com_courtage);
                    let taux_com_courtage_terme = parseFloat(data.taux_com_courtage_terme);
                    let taux_com_gestion = parseFloat(data.taux_com_gestion);

                    $('#modal-police #taux_com_courtage').val(taux_com_courtage);
                    $('#modal-police #taux_com_courtage_terme').val(taux_com_courtage_terme);
                    $('#modal-police #taux_com_gestion').val(taux_com_gestion);

                    calculer_montant_divers_police();
                },
                error: function () {
                    console.log('Erreur de chargement : ajax_infos_compagnie ');
                }
            });
        }

    });
    function calculer_commissions_modification_police() {


    }

    //
    $(document).on("keyup change", "#modal-police .calculs_handler_police", function (event) {

        if (event.which == 13) {
            event.preventDefault();
        }

        calculer_montant_divers_police();

    });

    function calculer_montant_divers_police() {

        let prime_ht = parseInt($('#modal-police #prime_ht').val().replaceAll(' ', ''));
        let cout_police_compagnie = parseInt($('#modal-police #cout_police_compagnie').val().replaceAll(' ', ''));
        let cout_police_courtier = parseInt($('#modal-police #cout_police_courtier').val().replaceAll(' ', ''));
        let taxe = parseInt($('#modal-police #taxe').val().replaceAll(' ', ''));
        let autres_taxes = parseInt($('#modal-police #autres_taxes').val().replaceAll(' ', ''));

        let taux_com_gestion = parseFloat($('#modal-police #taux_com_gestion').val());
        let taux_com_courtage = parseFloat($('#modal-police #taux_com_courtage').val());
        let taux_com_courtage_terme = parseFloat($('#modal-police #taux_com_courtage_terme').val());

        if (isNaN(prime_ht)) { prime_ht = 0; }
        if (isNaN(cout_police_compagnie)) { cout_police_compagnie = 0; }
        if (isNaN(cout_police_courtier)) { cout_police_courtier = 0; }
        if (isNaN(taxe)) { taxe = 0; }
        if (isNaN(autres_taxes)) { autres_taxes = 0; }
        if (isNaN(taux_com_gestion)) { taux_com_gestion = 0; }
        if (isNaN(taux_com_courtage)) { taux_com_courtage = 0; }
        if (isNaN(taux_com_courtage_terme)) { taux_com_courtage_terme = 0; }

        let prime_ttc = prime_ht + cout_police_compagnie + cout_police_courtier + taxe + autres_taxes;

        console.log('prime_ht', prime_ht);
        console.log('cout_police_compagnie', cout_police_compagnie);
        console.log('cout_police_courtier', cout_police_courtier);
        console.log('taxe', taxe);
        console.log('autres_taxes', autres_taxes);
        console.log('taux_com_gestion', taux_com_gestion);
        console.log('taux_com_courtage', taux_com_courtage);
        console.log('taux_com_courtage_terme', taux_com_courtage_terme);
        console.log('prime_ttc', prime_ttc);


        let montant_commission_gestion = (taux_com_gestion / 100) * prime_ht;
        let montant_commission_courtage = (taux_com_courtage / 100) * prime_ht;


        let total_taux_com_affaire_nouvelle = 0;
        let total_taux_com_renouvelement = 0;
        let montant_commission_intermediaire = 0;
        let total_montant_commission_intermediaire = 0;

        $('.taux_com_affaire_nouvelle').each(function () {

            let taux_com_affaire_nouvelle = parseFloat($(this).val());
            let taux_com_renouvelement = parseFloat($(this).closest('tr').find('.taux_com_renouvelement').val());
            let base_calcul_taux_retrocession = $(this).closest('tr').find('.base_calcul_taux_retrocession').val();
            let intermediaire = $(this).closest('tr').find('.intermediaire').val();

            if (intermediaire != "" && base_calcul_taux_retrocession != "" && taux_com_affaire_nouvelle > 0) {

                if (base_calcul_taux_retrocession == 1) {//sur prime ht

                    montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * prime_ht;

                } else if (base_calcul_taux_retrocession == 2) {//sur com courtage

                    montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * montant_commission_courtage;

                } else if (base_calcul_taux_retrocession == 3) {//sur com gestion

                    montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * montant_commission_gestion;

                } else if (base_calcul_taux_retrocession == 4) {//sur com total (courtage + gestion)

                    montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * (montant_commission_courtage + montant_commission_gestion);

                }

                console.log(montant_commission_intermediaire);

                total_montant_commission_intermediaire = total_montant_commission_intermediaire + montant_commission_intermediaire;

                console.log(total_montant_commission_intermediaire);

            }


        });


        $('#modal-police #prime_ttc').val(prime_ttc);

        $('#modal-police #commission_courtage').val(montant_commission_courtage);

        $('#modal-police #commission_gestion').val(montant_commission_gestion);

        $('#modal-police #total_commission_intermediaire').val(total_montant_commission_intermediaire);


    }


    $(document).on("keyup change", "#modal-modification_police .calculs_handler_police_modification", function (event) {

        if (event.which == 13) {
            event.preventDefault();
        }

        calculer_montant_divers_police_modification();

    });

    function calculer_montant_divers_police_modification() {

        let prime_ht = parseInt($('#modal-modification_police #prime_ht_modification').val().replaceAll(' ', ''));
        let cout_police_compagnie = parseInt($('#modal-modification_police #cout_police_compagnie_modification').val().replaceAll(' ', ''));
        let cout_police_courtier = parseInt($('#modal-modification_police #cout_police_courtier_modification').val().replaceAll(' ', ''));
        let taxe = parseInt($('#modal-modification_police #taxe_modification').val().replaceAll(' ', ''));
        let autres_taxes = parseInt($('#modal-modification_police #autres_taxes_modification').val().replaceAll(' ', ''));

        let taux_com_gestion = parseFloat($('#modal-modification_police #taux_com_gestion_modification').val());
        let taux_com_courtage = parseFloat($('#modal-modification_police #taux_com_courtage_modification').val());

        if (isNaN(prime_ht)) { prime_ht = 0; }
        if (isNaN(cout_police_compagnie)) { cout_police_compagnie = 0; }
        if (isNaN(cout_police_courtier)) { cout_police_courtier = 0; }
        if (isNaN(taxe)) { taxe = 0; }
        if (isNaN(autres_taxes)) { autres_taxes = 0; }
        if (isNaN(taux_com_gestion)) { taux_com_gestion = 0; }
        if (isNaN(taux_com_courtage)) { taux_com_courtage = 0; }

        let prime_ttc = prime_ht + cout_police_compagnie + cout_police_courtier + taxe + autres_taxes;

        console.log('prime_ht_modification', prime_ht);
        console.log('cout_police_compagnie_modification', cout_police_compagnie);
        console.log('cout_police_courtier_modification', cout_police_courtier);
        console.log('taxe_modification', taxe);
        console.log('autres_taxes_modification', autres_taxes);
        console.log('taux_com_gestion_modification', taux_com_gestion);
        console.log('taux_com_courtage_modification', taux_com_courtage);
        console.log('prime_ttc_modification', prime_ttc);


        let montant_commission_gestion = (taux_com_gestion / 100) * prime_ht;
        let montant_commission_courtage = (taux_com_courtage / 100) * prime_ht;


        let total_taux_com_affaire_nouvelle = 0;
        let total_taux_com_renouvelement = 0;
        let montant_commission_intermediaire = 0;
        let total_montant_commission_intermediaire = 0;

        $('.taux_com_affaire_nouvelle_modification').each(function () {

            let taux_com_affaire_nouvelle = parseFloat($(this).val());
            let taux_com_renouvelement = parseFloat($(this).closest('tr').find('.taux_com_renouvelement_modification').val());
            let base_calcul_taux_retrocession = $(this).closest('tr').find('.base_calcul_taux_retrocession_modification').val();
            let intermediaire = $(this).closest('tr').find('.intermediaire_modification').val();

            if (intermediaire != "" && base_calcul_taux_retrocession != "" && taux_com_affaire_nouvelle > 0) {

                if (base_calcul_taux_retrocession == 1) {//sur prime ht

                    montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * prime_ht;

                } else if (base_calcul_taux_retrocession == 2) {//sur com courtage

                    montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * montant_commission_courtage;

                } else if (base_calcul_taux_retrocession == 3) {//sur com gestion

                    montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * montant_commission_gestion;

                } else if (base_calcul_taux_retrocession == 4) {//sur com total (courtage + gestion)

                    montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * (montant_commission_courtage + montant_commission_gestion);

                }

                console.log(montant_commission_intermediaire);

                total_montant_commission_intermediaire = total_montant_commission_intermediaire + montant_commission_intermediaire;

                console.log(total_montant_commission_intermediaire);

            }


        });


        $('#modal-modification_police #prime_ttc_modification').val(prime_ttc);

        $('#modal-modification_police #commission_courtage_modification').val(montant_commission_courtage);

        $('#modal-modification_police #commission_gestion_modification').val(montant_commission_gestion);

        $('#modal-modification_police #total_commission_intermediaire_modification').val(total_montant_commission_intermediaire);


    }


    // Participation
    function on_change_participation(participation, mode) {
        let modal_id = mode === 'modification' ? '#modal-modification_police' : '#modal-police';
        let box_id = mode === 'modification' ? '#box_taux_participation_modification' : '#box_taux_participation';
        let taux_id = mode === 'modification' ? '#taux_participation_modification' : '#taux_participation';

        if (participation === 'OUI') {
            if ($(`${modal_id} ${box_id}`).length) {
                $(`${modal_id} ${box_id}`).show();
                $(`${modal_id} ${taux_id}`).attr('required', true);
                $(`${modal_id} ${box_id}`).find('label').html('Taux de participation <span class="text-red">*</span>');
            } else {
                console.error(`Element ${box_id} not found in ${modal_id}`);
            }
        } else {
            if ($(`${modal_id} ${box_id}`).length) {
                $(`${modal_id} ${box_id}`).hide();
                $(`${modal_id} ${taux_id}`).val('0').removeAttr('required');
                $(`${modal_id} ${box_id}`).find('label').html('Taux de participation');
            } else {
                console.error(`Element ${box_id} not found in ${modal_id}`);
            }
        }
    }

    $(document).on("change", "#modal-police .participation", function () {
        let participation = $(this).val();
        on_change_participation(participation, 'creation');
    });

    $(document).on("change", "#modal-modification_police .participation_modification", function () {
        let participation = $(this).val();
        on_change_participation(participation, 'modification');
    });

    // Initialisation pour le mode modification
    $(document).ready(function () {
        let participation_modification = $("#modal-modification_police .participation_modification:checked").val();
        if (participation_modification) {
            on_change_participation(participation_modification, 'modification');
        }
    });

    //gestion autres taxes

    function appendToStorage(name, data) {
        let old = localStorage.getItem(name);
        try {
            old = JSON.parse(old);
        } catch (e) {
            old = [];
        }
        localStorage.setItem(name, JSON.stringify(old.concat(data)));
    }

    $(document).on("keyup", "#form_add_autres_taxes .montant_taxe", function () {

        if (event.which == 13) {
            event.preventDefault();
        }

        let montant_total_autres_taxes = parseInt(0);

        $("#modal-autres_taxes .montant_taxe").each(function (index, element) {

            //element = this
            let montant = parseInt($(element).val().replaceAll(' ', ''));
            montant = (montant != '') ? montant : parseInt(0);

            if (isNaN(montant)) {
                montant = parseInt(0);
            }

            //console.log('montant: '+ isNaN(montant));

            montant_total_autres_taxes += montant;

        });

        //console.log('total: '+montant_total_autres_taxes);

        $('#modal-police #autres_taxes').val(montant_total_autres_taxes);
        $('#modal-autres_taxes .total_autres_taxes').text(montant_total_autres_taxes);

        calculer_montant_divers_police();

    });


    $('#modal-apporteurs').on('show.bs.modal', function (e) {
        $(this).find('table').css({ width: '100%' });

        let intermediaire = $(e.relatedTarget).closest('tr').find('.intermediaire:first');
        let intermediaire_nom_prenoms = $(e.relatedTarget).closest('tr').find('.intermediaire_nom_prenoms:first');

        $('.selected_field_intermediaire_id').removeClass('selected_field_intermediaire_id');
        $('.selected_field_intermediaire_nom_prenoms').removeClass('selected_field_intermediaire_nom_prenoms');

        intermediaire.addClass('selected_field_intermediaire_id');
        intermediaire_nom_prenoms.addClass('selected_field_intermediaire_nom_prenoms');

        $(document).on("click", "#modal-apporteurs .btnSetSelectedApporteur", function () {

            let selected_apporteur_id = $(this).data('apporteur_id');
            let selected_apporteur_nom_prenoms = $(this).data('apporteur_nom_prenoms');


            $('.selected_field_intermediaire_id').val(selected_apporteur_id);
            $('.selected_field_intermediaire_nom_prenoms').val(selected_apporteur_nom_prenoms);

            calculer_montant_divers_police();

        });

        //init datatables
        if (!$.fn.DataTable.isDataTable('#table_apporteurs')) {

            $('#table_apporteurs').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'desc']],
                lengthMenu: [
                    [50, 100],
                    [50, 100],
                ],
                //scrollY: '100px',
                //scrollX: true,
                //scrollCollapse: false,
                paging: true,
                processing: false,
                serverSide: false,
                fnDrawCallback: function (oSettings) {
                    //$(".radio_apporteur").prop('checked', false);//décocher les radios
                    //$(this).css({width:'100%', display: 'inline-block'});
                }
            });

        }


    });


    //A la fermeture de la fenetre des autres taxes, sauvegarder les données dans les cookies pour pouvoir les récupérer coté serveur
    $('#modal-autres_taxes').on('hidden.bs.modal', function () {
        $('body').addClass('modal-open');

        //Enregistrer les autres taxes saisies

        if (typeof (Storage) !== "undefined") {

            localStorage.setItem('taxes', "");

            // Code for localStorage
            $("#modal-autres_taxes .montant_taxe").each(function (index, element) {

                //element = this
                let taxe_id = $(element).attr('data-taxe_id');
                let montant = parseInt($(element).val().replaceAll(' ', ''));
                montant = (montant != '') ? montant : parseInt(0);

                if (isNaN(montant)) {
                    montant = parseInt(0);
                }

                let taxe = {
                    id: taxe_id,
                    montant: montant,
                }

                appendToStorage('taxes', taxe);

            });

            let taxes_result = localStorage.getItem('taxes');

            console.log(taxes_result);

            //enregistrer dans le cookies pour l'utiliser coté serveur avec python
            document.cookie = "taxes=" + taxes_result;


        } else {
            notifyWarning('No web storage Support.');
        }


    });



    //Insertion ligne supplémantaire dans l'onglet INTERMEDIAIRES/APPORTAUERS - lors de l'ajout de police
    $(document).on("click", "#table_apporteurs_police #btnAddLigneApporteur", function () {
        let tr = $('#table_apporteurs_police tbody tr:first');

        let timestamp = Date.now();

        $('#table_apporteurs_police tbody tr:last')
            .after('<tr id="tr_' + timestamp + '">' + tr.html() + '</tr>')
            .ready(function () {
                //$('#table_apporteurs_police select').removeClass('select2').hide();
                AppliquerMaskSaisie();


            });

    });

    //
    $(document).on("click", ".btnSupprimerLigneApporteur", function () {
        let nombre_ligne = $('#table_apporteurs_police tbody tr').length;

        if (nombre_ligne > 1) {
            $(this).parent().parent().remove();

            //recalculer les primes divers
            calculer_montant_divers_police();

        } else {
            let tr_ligne_id = $('#table_apporteurs_police tbody tr').attr('id');
            resetFields('#' + tr_ligne_id);
            //notifyWarning('Au moins une ligne doit être conservée')
        }

    });


    //FIN Insertion ligne supplémantaire dans l'onglet INTERMEDIAIRES/APPORTAUERS - lors de l'ajout de police

    //Insertion ligne supplémantaire dans l'onglet INTERMEDIAIRES/APPORTAUERS - lors de la modification de police
    $(document).on("click", "#table_apporteurs_police_modification #btnAddLigneApporteur_modification", function () {
        let tr = $('#table_apporteurs_police_modification tbody tr:first');

        let timestamp = Date.now();

        $('#table_apporteurs_police_modification tbody tr:last')
            .after('<tr id="tr_' + timestamp + '">' + tr.html() + '</tr>')
            .ready(function () {

                AppliquerMaskSaisie();


            });

    });

    //
    $(document).on("click", "#table_apporteurs_police_modification .btnSupprimerLigneApporteur_modification", function () {
        let nombre_ligne = $('#table_apporteurs_police_modification tbody tr').length;

        if (nombre_ligne > 1) {
            $(this).parent().parent().remove();

            //recalculer les primes divers
            calculer_montant_divers_police_modification();

        } else {
            //notifyWarning('Au moins une ligne doit être conservée')
        }

    });


    //FIN Insertion ligne supplémantaire dans l'onglet INTERMEDIAIRES/APPORTAUERS - lors de la modification de police

    //GESTION MODIFICATION AUTRES TAXES
    $(document).on("keyup", "#form_add_autres_taxes_modification .montant_taxe", function (event) {

        if (event.which == 13) {
            event.preventDefault();
        }

        let montant_total_autres_taxes = parseInt(0);

        $("#modal-autres_taxes_modification .montant_taxe").each(function (index, element) {

            //element = this
            let montant = parseInt($(element).val().replaceAll(' ', ''));
            montant = (montant != '') ? montant : parseInt(0);

            if (isNaN(montant)) {
                montant = parseInt(0);
            }

            //console.log('montant: '+ isNaN(montant));

            montant_total_autres_taxes += montant;

        });

        //console.log('total: '+montant_total_autres_taxes);

        $('#modal-modification_police #autres_taxes_modification').val(montant_total_autres_taxes);
        $('#modal-autres_taxes_modification .total_autres_taxes_modification').text(montant_total_autres_taxes);

        calculer_montant_divers_police_modification();

    });




    //A la fermeture de la fenetre des autres taxes, sauvegarder les données dans les cookies pour pouvoir les récupérer coté serveur
    $(document).on("hidden.bs.modal", "#modal-autres_taxes_modification", function () {
        $('body').addClass('modal-open');

        //Enregistrer les autres taxes saisies

        if (typeof (Storage) !== "undefined") {

            localStorage.setItem('taxes_modification', "");

            // Code for localStorage
            $("#modal-autres_taxes_modification .montant_taxe").each(function (index, element) {

                //element = this
                let taxe_id = $(element).attr('data-taxe_id');
                let montant = parseInt($(element).val().replaceAll(' ', ''));
                montant = (montant != '') ? montant : parseInt(0);

                if (isNaN(montant)) {
                    montant = parseInt(0);
                }

                let taxe = {
                    id: taxe_id,
                    montant: montant,
                }

                appendToStorage('taxes_modification', taxe);

            });

            let taxes_result = localStorage.getItem('taxes_modification');

            console.log(taxes_result);

            //enregistrer dans le cookies pour l'utiliser coté serveur avec python
            //document.cookie="taxes_modification="+taxes_result+";SameSite=None;Secure";

            //mettre dans un champ du formulaire de modification; vu que les cookies ne marchent pas, surement à cause du popup load dynamiquement
            $('#modal-modification_police #liste_autres_taxes_modification').val(taxes_result);

        } else {
            notifyWarning('No web storage Support.');
        }


    });



    //FIN GESTION MODIFICATION AUTRES TAXES


    //************* FIN AJOUT ET MODIFICATION DE POLICE ***************//


    //************* AJOUT DE QUITTANCES ***************//
    $("#btnOpenDialogAddQuittance").on('click', function () {

        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-quittance').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-quittance').find('.modal-title').text(modal_title);
            $('#modal-quittance').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-quittance').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-quittance').modal();

            //Bouton d'enregistrement de la quittance
            $("#btn_save_quittance").on('click', function () {

                let btn_save_quittance = $(this);


                let formulaire = $('#form_add_quittance');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                if (formulaire.valid()) {

                    //désactiver le bouton Valider, pour empecher une double soumission du formulaire
                    btn_save_quittance.attr('disabled', true);

                    //enregistrer les taxes dans le storage
                    $('#modal-autres_taxes_quittance #btn_save_taxe').click();
                    //alert($('#modal-autres_taxes_quittance #btn_save_taxe').text());

                    //demander confirmation
                    let n = noty({
                        text: 'Voulez-vous vraiment créer cette quittance ?',
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

                                                $('#modal-quittance .alert .message').html(errors_list_to_display);

                                                $('#modal-quittance .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                    $(this).slideUp(500);
                                                }).removeClass('alert-success').addClass('alert-warning');

                                            }

                                        },
                                        error: function (request, status, error) {

                                            notifyWarning("Erreur lors de l'enregistrement");

                                            btn_save_quittance.removeAttr('disabled');

                                        }

                                    });

                                    //fin confirmation obtenue

                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();

                                    btn_save_quittance.removeAttr('disabled');

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

                    btn_save_quittance.removeAttr('disabled');

                }

            });


            //gestion de la fenetre interne des taxes
            $("#form_add_autres_taxes_quittance .montant_taxe").on('keyup', function (event) {

                if (event.which == 13) {
                    event.preventDefault();
                }

                let montant_total_autres_taxes_quittance = parseInt(0);

                $("#modal-autres_taxes_quittance .montant_taxe").each(function (index, element) {

                    //element = this
                    let montant = parseInt($(element).val().replaceAll(' ', ''));
                    montant = (montant != '') ? montant : parseInt(0);

                    if (isNaN(montant)) {
                        montant = parseInt(0);
                    }

                    montant_total_autres_taxes_quittance += montant;

                });

                $('#modal-quittance #autres_taxes').val(montant_total_autres_taxes_quittance);
                $('#modal-autres_taxes_quittance .total_autres_taxes').text(montant_total_autres_taxes_quittance);

                calculer_montant_divers_quittance();

            });


            //A la fermeture de la fenetre des autres taxes, sauvegarder les données dans les cookies pour pouvoir les récupérer coté serveur
            $('#modal-autres_taxes_quittance').on('hidden.bs.modal', function () {
                $('body').addClass('modal-open');

                //Enregistrer les autres taxes saisies
                if (typeof (Storage) !== "undefined") {

                    localStorage.setItem('taxes_quittance', "");

                    // Code for localStorage
                    $("#modal-autres_taxes_quittance .montant_taxe").each(function (index, element) {

                        //element = this
                        let taxe_id = $(element).attr('data-taxe_id');
                        let montant = parseInt($(element).val().replaceAll(' ', ''));
                        montant = (montant != '') ? montant : parseInt(0);

                        if (isNaN(montant)) {
                            montant = parseInt(0);
                        }

                        let taxe = {
                            id: taxe_id,
                            montant: montant,
                        }

                        appendToStorage('taxes_quittance', taxe);

                    });

                    let taxes_result = localStorage.getItem('taxes_quittance');

                    console.log(taxes_result);

                    //enregistrer dans le cookies pour l'utiliser coté serveur avec python
                    document.cookie = "taxes_quittance=" + taxes_result;


                } else {
                    notifyWarning('No web storage Support.');
                }


            });



        });


    });


    $(document).on("keyup change", "#modal-quittance .calculs_handler_police", function (event) {

        if (event.which == 13) {
            event.preventDefault();
        }

        calculer_montant_divers_quittance();

    });

    function calculer_montant_divers_quittance() {

        let type_quittance_code = $('#modal-quittance #type_quittance option:selected').data('code');
        //Action d'activation et de désactivation de champ.
        if (type_quittance_code === "HONORAIRE") {
            $("#cout_police_compagnie, #cout_police_courtier").prop('disabled', true).addClass('disabled-field').val(0);
        } else {
            $("#cout_police_compagnie, #cout_police_courtier").prop("disabled", false).removeClass("disabled-field");
        }

        let nature_quittance_id = $('#modal-quittance #nature_quittance').val();
        let type_quittance_id = $('#modal-quittance #type_quittance').val();
        let prime_ht = parseInt($('#modal-quittance #prime_ht').val().replaceAll(' ', ''));
        let cout_police_compagnie = parseInt($('#modal-quittance #cout_police_compagnie').val().replaceAll(' ', ''));
        let cout_police_courtier = parseInt($('#modal-quittance #cout_police_courtier').val().replaceAll(' ', ''));
        let taxe = parseInt($('#modal-quittance #taxe').val().replaceAll(' ', ''));
        let autres_taxes = parseInt($('#modal-quittance #autres_taxes').val().replaceAll(' ', ''));

        let taux_com_gestion = parseFloat($('#modal-quittance #taux_com_gestion').val());
        let taux_com_courtage = parseFloat($('#modal-quittance #taux_com_courtage').val());
        let taux_com_courtage_terme = parseFloat($('#modal-quittance #taux_com_courtage_terme').val());

        //Added on 10022024:0302: si terme, prendre le taux_com_courtage_terme comme taux_com_courtage
        if (nature_quittance_id == 2) {
            taux_com_courtage = taux_com_courtage_terme;
        }

        if (isNaN(prime_ht)) { prime_ht = 0; }
        if (isNaN(cout_police_compagnie)) { cout_police_compagnie = 0; }
        if (isNaN(cout_police_courtier)) { cout_police_courtier = 0; }
        if (isNaN(taxe)) { taxe = 0; }
        if (isNaN(autres_taxes)) { autres_taxes = 0; }
        if (isNaN(taux_com_gestion)) { taux_com_gestion = 0; }
        if (isNaN(taux_com_courtage)) { taux_com_courtage = 0; }
        if (isNaN(taux_com_courtage_terme)) { taux_com_courtage_terme = 0; }

        /* accorder les montant selon la nature de la quittance */
        if ((prime_ht > 0 && nature_quittance_id == 3) || (prime_ht < 0 && nature_quittance_id != 3)) {
            prime_ht = prime_ht * (-1);
        }
        $('#modal-quittance #prime_ht').val(prime_ht);
        /*
        if((cout_police_compagnie > 0 && nature_quittance_id == 3) || (cout_police_compagnie < 0 && nature_quittance_id != 3)){
            cout_police_compagnie = cout_police_compagnie * (-1);
        }
        if((cout_police_courtier > 0 && nature_quittance_id == 3) || (cout_police_courtier < 0 && nature_quittance_id != 3)){
            cout_police_courtier = cout_police_courtier * (-1);
        }
        if((taxe > 0 && nature_quittance_id == 3) || (taxe < 0 && nature_quittance_id != 3)){
            taxe = taxe * (-1);
        }
        if((autres_taxes > 0 && nature_quittance_id == 3) || (autres_taxes < 0 && nature_quittance_id != 3)){
            autres_taxes = autres_taxes * (-1);
        }
        if((taux_com_gestion > 0 && nature_quittance_id == 3) || (taux_com_gestion < 0 && nature_quittance_id != 3)){
            taux_com_gestion = taux_com_gestion * (-1);
        }
        if((taux_com_courtage > 0 && nature_quittance_id == 3) || (taux_com_courtage < 0 && nature_quittance_id != 3)){
            taux_com_courtage = taux_com_courtage * (-1);
        }
        if((taux_com_courtage_terme > 0 && nature_quittance_id == 3) || (taux_com_courtage_terme < 0 && nature_quittance_id != 3)){
            taux_com_courtage_terme = taux_com_courtage_terme * (-1);
        }
        $('#modal-quittance #cout_police_compagnie').val(cout_police_compagnie);
        $('#modal-quittance #cout_police_courtier').val(cout_police_courtier);
        $('#modal-quittance #taxe').val(taxe);
        $('#modal-quittance #autres_taxes').val(autres_taxes);
        $('#modal-quittance #taux_com_gestion').val(taux_com_gestion);
        $('#modal-quittance #taux_com_courtage').val(taux_com_courtage);
        $('#modal-quittance #taux_com_courtage_terme').val(taux_com_courtage_terme);
        */

        let prime_ttc = prime_ht + cout_police_compagnie + cout_police_courtier + taxe + autres_taxes;

        let montant_commission_gestion = (taux_com_gestion / 100) * prime_ht;
        let montant_commission_courtage = (taux_com_courtage / 100) * prime_ht;
        let montant_commission_courtage_terme = (taux_com_courtage_terme / 100) * prime_ht;

        //selon type de quittance : honnoraire pas de com
        if (type_quittance_id == 2) {
            montant_commission_gestion = 0;
            montant_commission_courtage = 0;
            montant_commission_courtage_terme = 0;
        }

        console.log('nature_quittance_id', nature_quittance_id);
        console.log('type_quittance_id', type_quittance_id);
        console.log('prime_ht', prime_ht);
        console.log('cout_police_compagnie', cout_police_compagnie);
        console.log('cout_police_courtier', cout_police_courtier);
        console.log('taxe', taxe);
        console.log('autres_taxes', autres_taxes);
        console.log('taux_com_gestion', taux_com_gestion);
        console.log('taux_com_courtage', taux_com_courtage);
        console.log('taux_com_courtage_terme', taux_com_courtage_terme);
        console.log('montant_commission_gestion', montant_commission_gestion);
        console.log('montant_commission_courtage', montant_commission_courtage);
        console.log('montant_commission_courtage_terme', montant_commission_courtage_terme);
        console.log('prime_ttc', prime_ttc);


        let total_taux_com_affaire_nouvelle = 0;
        let total_taux_com_renouvelement = 0;
        let montant_commission_intermediaire = 0;
        let total_montant_commission_intermediaire = 0;

        $('.taux_com_affaire_nouvelle').each(function () {

            let taux_com_affaire_nouvelle = parseFloat($(this).val());
            let taux_com_renouvelement = parseFloat($(this).closest('tr').find('.taux_com_renouvelement').val());
            let base_calcul_taux_retrocession = $(this).closest('tr').find('.base_calcul_taux_retrocession').val();
            let intermediaire = $(this).closest('tr').find('.intermediaire').val();

            if (intermediaire != "" && base_calcul_taux_retrocession != "" && taux_com_affaire_nouvelle > 0) {

                if (nature_quittance_id == 1) {//quittance comptant: on prend les taux de com affaire nouvelle

                    if (base_calcul_taux_retrocession == 1) {//sur prime ht

                        montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * prime_ht;

                    } else if (base_calcul_taux_retrocession == 2) {//sur com courtage

                        montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * montant_commission_courtage;

                    } else if (base_calcul_taux_retrocession == 3) {//sur com gestion

                        montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * montant_commission_gestion;

                    } else if (base_calcul_taux_retrocession == 4) {//sur com total (courtage + gestion)

                        montant_commission_intermediaire = (taux_com_affaire_nouvelle / 100) * (montant_commission_courtage + montant_commission_gestion);

                    }

                } else if (nature_quittance_id == 2) {//quittance Terme: on prend les taux de com renouvellement

                    if (base_calcul_taux_retrocession == 1) {//sur prime ht

                        montant_commission_intermediaire = (taux_com_renouvelement / 100) * prime_ht;

                    } else if (base_calcul_taux_retrocession == 2) {//sur com courtage

                        montant_commission_intermediaire = (taux_com_renouvelement / 100) * montant_commission_courtage;

                    } else if (base_calcul_taux_retrocession == 3) {//sur com gestion

                        montant_commission_intermediaire = (taux_com_renouvelement / 100) * montant_commission_gestion;

                    } else if (base_calcul_taux_retrocession == 4) {//sur com total (courtage + gestion)

                        montant_commission_intermediaire = (taux_com_renouvelement / 100) * (montant_commission_courtage + montant_commission_gestion);

                    }

                }

                console.log('montant_commission_intermediaire', montant_commission_intermediaire);

                total_montant_commission_intermediaire = total_montant_commission_intermediaire + montant_commission_intermediaire;

                console.log('total_montant_commission_intermediaire', total_montant_commission_intermediaire);

            }


        });

        $('#modal-quittance #prime_ttc').val(prime_ttc);

        $('#modal-quittance #commission_courtage').val(montant_commission_courtage);

        $('#modal-quittance #commission_courtage_terme').val(montant_commission_courtage_terme);

        $('#modal-quittance #commission_gestion').val(montant_commission_gestion);

        $('#modal-quittance #total_commission_intermediaire').val(total_montant_commission_intermediaire);


    }

    $(document).on("change", "#modal-quittance #nature_quittance", function (event) {
        let nature_quittance_id = $(this).val();

        if (nature_quittance_id == 1) {
            $('.show_if_nature_quittance_terme').hide();
            $('.show_if_nature_quittance_comptant').show();
        } else {
            $('.show_if_nature_quittance_comptant').hide();
            $('.show_if_nature_quittance_terme').show();
        }

    });
    //************* FIN AJOUT DE QUITTANCES ***************//

    //********* DETAILS QUITTANCE ***********//

    $(".btnOpenDialogDetailQuittance").on('dblclick', function () {

        $(".btnOpenDialogDetailQuittance").removeClass('tr_selected');
        $(this).addClass('tr_selected');


        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-details_quittance').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-details_quittance').find('.modal-title').text(modal_title);
            $('#modal-details_quittance').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-details_quittance').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-details_quittance').modal();

            //init datatables
            if (!$.fn.DataTable.isDataTable('#table_reglements')) {

                $('#table_reglements').DataTable({
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                    },
                    order: [[0, 'desc']],
                    lengthMenu: [
                        [50, 100],
                        [50, 100],
                    ],
                });

            }

        });

    });
    //********* FIN DETAILS QUITTANCE ***********//



    //********* FAIRE UN REGLEMENT ***********//

    $("#btnOpenDialogAddReglement").on('click', function () {

        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {
            // Appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-reglement')
                .attr('data-backdrop', 'static')
                .attr('data-keyboard', false)
                .find('.modal-title')
                .text(modal_title);

            $('#modal-reglement').find('#btn_valider').attr({
                'data-model_name': model_name,
                'data-href': href
            });

            $('#modal-reglement')
                .find('.modal-dialog')
                .addClass('modal-xl')
                .removeClass('modal-lg');

            $('#modal-reglement').modal();

            // Activer ou désactiver le bouton en fonction des validations
            function toggleSaveButton() {
                let montant_total_a_regler = parseFloat($('.montant_total_a_regler').val()) || 0;
                if (montant_total_a_regler > 0) {
                    $('#btn_save_reglement').removeAttr('disabled');
                } else {
                    $('#btn_save_reglement').attr('disabled', 'true');
                }
            }

            // Gérer le clic sur les checkboxes
            $(document).on('change', '.checkbox_quittance_a_regler', function () {
                let row = $(this).closest('tr');
                let input_montant_a_regler = row.find('.montant_a_regler');
                let solde_quittance = parseFloat(row.find('.solde_quittance').val()) || 0;
                let input_solde_apres = row.find('.solde_apres');

                if (this.checked) {
                    input_montant_a_regler
                        .removeAttr('readonly')
                        .attr('required', true)
                        .val(solde_quittance);
                    input_solde_apres.val(0);
                } else {
                    input_montant_a_regler
                        .attr('readonly', true)
                        .removeAttr('required')
                        .val(0);
                    input_solde_apres.val(solde_quittance);
                }

                calculer_montant_total_a_regler();
            });

            // Gestion des montants à régler
            $(document).on('change keyup', '.montant_a_regler', function () {
                let row = $(this).closest('tr');
                let montant_a_regler = parseFloat($(this).val().replaceAll(' ', '')) || 0;
                let solde_quittance = parseFloat(row.find('.solde_quittance').val()) || 0;
                let input_solde_apres = row.find('.solde_apres');

                if (montant_a_regler > 0 && montant_a_regler <= solde_quittance) {
                    input_solde_apres.val(solde_quittance - montant_a_regler);
                } else {
                    $(this).val(0);
                    input_solde_apres.val(solde_quittance);
                }

                calculer_montant_total_a_regler();
            });

            // Calcul du montant total à régler
            function calculer_montant_total_a_regler() {
                let montant_total_a_regler = 0;

                $('.montant_a_regler').each(function () {
                    let montant = parseFloat($(this).val().replaceAll(' ', '')) || 0;
                    let solde_quittance = parseFloat($(this).closest('tr').find('.solde_quittance').val()) || 0;

                    if (montant > 0 && montant <= solde_quittance) {
                        montant_total_a_regler += montant;
                    } else {
                        $(this).val(0);
                    }
                });

                $('.montant_total_a_regler').val(montant_total_a_regler);
                toggleSaveButton();
            }

            // Changer le mode de règlement
            $(document).on('change', '#mode_reglement', function () {
                if ($(this).val() == 1) {
                    $('#numero_piece').removeAttr('required');
                    $('#banque').removeAttr('required');
                    $('#libelle_numero_piece_required').html('');
                    $('#libelle_banque_required').html('');
                } else {
                    $('#numero_piece').attr('required', true);
                    $('#libelle_numero_piece_required').html('*');
                }
            });

            // Enregistrer le formulaire
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

    //********* FIN FAIRE UN REGLEMENT ***********//

    //********* FAIRE UN LETTRAGE ***********//

    $("#btnOpenDialogAddLettrage").on('click', function () {

        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-lettrage').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-lettrage').find('.modal-title').text(modal_title);
            $('#modal-lettrage').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-lettrage').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-lettrage').modal();

            // Gestion des cases à cocher des acomptes
            $(document).on('change', '.checkbox_acompte_a_utiliser', function () {
                calculer_montant_acompte_lettrage();
                verifier_et_activer_quittances();

                // Réinitialisation des quittances si un acompte est décoché après qu'une quittance est cochée
                if (!$('.checkbox_acompte_a_utiliser:checked').length) {
                    $('.checkbox_quittance_a_regler:checked').each(function () {
                        let checkbox = $(this);
                        let input_montant_a_regler = checkbox.closest('tr').find('.montant_a_regler');
                        let solde_quittance = parseFloat(checkbox.closest('tr').find('.solde_quittance').val()) || 0;
                        let input_solde_apres = checkbox.closest('tr').find('.solde_apres');
                        let montant_retire = parseFloat(input_montant_a_regler.val()) || 0;

                        // Réinitialiser les champs de la quittance
                        checkbox.prop('checked', false);
                        input_montant_a_regler.val(0).attr('readonly', true);
                        input_solde_apres.val(solde_quittance);

                        // Remettre le montant retiré au cumul des acomptes
                        let montant_acompte_cumul = parseFloat($('#hidden_select_montant_acompte_cumul').val()) || 0;
                        montant_acompte_cumul += montant_retire;
                        $('#hidden_select_montant_acompte_cumul').val(montant_acompte_cumul.toFixed(2));
                        $('#montant_acompte_cumul').val(montant_acompte_cumul.toFixed(2));

                        console.log('montant_retire',montant_retire);
                        console.log('montant_acompte_cumul',montant_acompte_cumul);
                    });

                    // Désactiver les cases des quittances
                    $('.checkbox_quittance_a_regler').attr('disabled', true);
                }
            });

            // Gestion des cases à cocher des quittances
            $(document).on('change', '.checkbox_quittance_a_regler', function () {
                let checkbox = $(this);
                let input_montant_a_regler = checkbox.closest('tr').find('.montant_a_regler');
                let solde_quittance = parseFloat(checkbox.closest('tr').find('.solde_quittance').val()) || 0;
                let input_solde_apres = checkbox.closest('tr').find('.solde_apres');
                let montant_acompte_cumul = parseFloat($('#hidden_select_montant_acompte_cumul').val()) || 0;

                if (checkbox.is(':checked')) {
                    // Si on coche une quittance
                    if (montant_acompte_cumul >= solde_quittance) {
                        // Déduction complète
                        input_montant_a_regler.val(solde_quittance).attr('readonly', true);
                        input_solde_apres.val(0); // Tout est payé
                        montant_acompte_cumul -= solde_quittance;
                    } else {
                        // Déduction partielle
                        input_montant_a_regler.val(montant_acompte_cumul).attr('readonly', true);
                        input_solde_apres.val(solde_quittance - montant_acompte_cumul); // Reste à payer
                        montant_acompte_cumul = 0; // Tout l'acompte est utilisé
                    }
                }
                else {
                    // Si on décoche une quittance
                    let montant_retire = parseFloat(input_montant_a_regler.val().replace(/\s/g, '')) || 0; // Retirer les espaces avant conversion

                    // Rendre l'acompte
                    montant_acompte_cumul += montant_retire;

                    // Réinitialisation des valeurs
                    input_montant_a_regler.val(0).attr('readonly', true);
                    input_solde_apres.val(solde_quittance); // Retour à l'état initial
                }

                // Mise à jour des champs cumulés
                $('#hidden_select_montant_acompte_cumul').val(montant_acompte_cumul.toFixed(2));
                $('#montant_acompte_cumul').val(montant_acompte_cumul.toFixed(2));

                // Mise à jour du montant total à régler
                calculer_lettrage_montant_total_a_regler();
            });

            $(document).on('change', '.checkbox_acompte_a_utiliser', function () {
                calculer_montant_acompte_lettrage();
                verifier_et_activer_quittances();

                // Vérification après modification des acomptes
                let montant_acompte_cumul = parseFloat($('#hidden_select_montant_acompte_cumul').val()) || 0;

                $('.checkbox_quittance_a_regler:checked').each(function () {
                    let checkbox = $(this);
                    let input_montant_a_regler = checkbox.closest('tr').find('.montant_a_regler');
                    let solde_quittance = parseFloat(checkbox.closest('tr').find('.solde_quittance').val()) || 0;
                    let input_solde_apres = checkbox.closest('tr').find('.solde_apres');

                    // Vérifier si l'acompte cumulé peut toujours couvrir cette quittance
                    if (montant_acompte_cumul >= solde_quittance) {
                        montant_acompte_cumul -= solde_quittance; // Déduction
                    } else {
                        // Si le montant des acomptes restants est insuffisant, décocher la quittance
                        checkbox.prop('checked', false);
                        input_montant_a_regler.val(0).attr('readonly', true);
                        input_solde_apres.val(solde_quittance); // Retour à l'état initial
                    }
                });

                // Mise à jour des champs cumulés après vérification
                $('#hidden_select_montant_acompte_cumul').val(montant_acompte_cumul.toFixed(2));
                $('#montant_acompte_cumul').val(montant_acompte_cumul.toFixed(2));
            });

            //enregistrement
            $('#btn_save_lettrage').on('click', function () {

                let btn_save_lettrage = $(this);

                let formulaire = $('#form_add_lettrage');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                if (formulaire.valid()) {

                    //désactiver le bouton Valider, pour empecher une double soumission du formulaire
                    btn_save_lettrage.attr('disabled', true);

                    //demander confirmation

                    let n = noty({
                        text: 'Voulez-vous vraiment effectuer ce lettrage de compte ?',
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

                                                $('#modal-lettrage .alert .message').html(errors_list_to_display);

                                                $('#modal-lettrage .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                    $(this).slideUp(500);
                                                }).removeClass('alert-success').addClass('alert-warning');

                                            }

                                        },
                                        error: function (request, status, error) {

                                            notifyWarning("Erreur lors de l'enregistrement");

                                            btn_save_lettrage.removeAttr('disabled');

                                        }

                                    });

                                    //fin confirmation obtenue

                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();

                                    btn_save_lettrage.removeAttr('disabled');

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

                    btn_save_lettrage.removeAttr('disabled');

                }


            });

        });

    });

    // Fonction pour activer/désactiver les cases quittances
    function verifier_et_activer_quittances() {
        let acomptes_actifs = $('.checkbox_acompte_a_utiliser:checked').length > 0;

        $('.checkbox_quittance_a_regler').each(function () {
            $(this).prop('disabled', !acomptes_actifs);
        });
    }

    // Fonction de calcul du montant cumulé des acomptes
    function calculer_montant_acompte_lettrage() {
        let montant_acompte_cumul = 0;

        $('.checkbox_acompte_a_utiliser:checked').each(function () {
            let solde_acompte = parseFloat($(this).closest('tr').find('.solde_acompte').val()) || 0;
            montant_acompte_cumul += solde_acompte;
        });

        // Mise à jour des champs cumulés
        $('#montant_acompte_cumul').val(montant_acompte_cumul.toFixed(2));
        $('#hidden_select_montant_acompte_cumul').val(montant_acompte_cumul.toFixed(2));
    }

    // Fonction de calcul du montant total à régler
    function calculer_lettrage_montant_total_a_regler() {
        let montant_total_a_regler = 0;

        $('.montant_a_regler').each(function () {
            let montant_a_regler = parseFloat($(this).val().replaceAll(' ', '')) || 0;
            montant_total_a_regler += montant_a_regler;
        });

        // Mise à jour du champ total
        $('.montant_total_a_regler').val(montant_total_a_regler.toFixed(2));

        // Activer ou désactiver le bouton de sauvegarde
        if (montant_total_a_regler > 0) {
            $('#btn_save_lettrage').removeAttr('disabled');
        } else {
            $('#btn_save_lettrage').attr('disabled', true);
        }
    }

    // Initialisation : désactiver toutes les quittances au chargement
    verifier_et_activer_quittances();

    //********* FIN FAIRE UN LETTRAGE ***********//


    //********* FAIRE UN ENCAISSEMENT DE COMMISSION ***********//

    $(".btnOpenDialogDetailCompagnieEncaissement").on('dblclick', function () {

        $(".btnOpenDialogDetailCompagnieEncaissement").removeClass('tr_selected');
        $(this).addClass('tr_selected');
        let compagnie = $(this).data('compagnie');
        $("#btnOpenDialogAddEncaissementCommision").trigger("click");

    });


    $("#btnOpenDialogAddEncaissementCommision").on('click', function () {

        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-encaissement').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-encaissement').find('.modal-title').text(modal_title);
            $('#modal-encaissement').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-encaissement').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-encaissement').modal();

            $('#modal-encaissement').on('shown.bs.modal', function () {
                compagnie = $('.tr_selected').data('compagnie');
                if (compagnie && compagnie != "") {
                    $('#modal-encaissement #compagnie option[value=' + compagnie + ']').attr('selected', 'selected');
                    $("#modal-encaissement #compagnie").trigger('change');
                }
            })

            //gestion des saisies des montants à regler
            $(document).on('change', '.checkbox_quittance_a_encaisser', function () {
                let input_montant_encaisse_court = $(this).closest('tr').find('.montant_encaisse_court');
                let input_montant_encaisse_gest = $(this).closest('tr').find('.montant_encaisse_gest');
                let solde_quittance = $(this).closest('tr').find('.solde_quittance').val();
                let input_solde_apres = $(this).closest('tr').find('.solde_apres');
                let montant_com_solde = parseFloat($(this).data('montant_com_solde'));
                let montant_com_courtage = 0; //parseFloat($(this).data('reglement_montant_com_courtage'));
                let montant_com_gestion = 0; //parseFloat($(this).data('reglement_montant_com_gestion'));


                //input_montant_a_encaisser.val(0);
                input_solde_apres.val(solde_quittance);
                //$('#restant_total').val(montant_com_solde);
                $(this).closest('tr').find('.restant_total').val(montant_com_solde);




                if (this.checked) {
                    input_montant_encaisse_court.removeAttr('readonly');
                    input_montant_encaisse_court.attr('required', true);
                    input_montant_encaisse_court.val(0);//montant_com_courtage;
                    input_montant_encaisse_gest.removeAttr('readonly');
                    input_montant_encaisse_gest.attr('required', true);
                    input_montant_encaisse_gest.val(0);//montant_com_gestion);
                } else {
                    input_montant_encaisse_court.attr('readonly', true);
                    input_montant_encaisse_court.removeAttr('required');
                    input_montant_encaisse_court.val(0);
                    input_montant_encaisse_gest.attr('readonly', true);
                    input_montant_encaisse_gest.removeAttr('required');
                    input_montant_encaisse_gest.val(0);
                }

                calculer_montant_total_a_encaisser();


            });

            //montant_a_regler
            $(document).on('change keyup', '.handle_calculer_montant_total_a_encaisser', function () {
                //console.log('handle_calculer_montant_total_a_encaisser');
                calculer_montant_total_a_encaisser();

            });

            $(document).on('change keyup', '#debit_difference', function () {
                $('#credit_difference').val("");
                //calculer_montant_total_a_encaisser();
            });
            $(document).on('change keyup', '#credit_difference', function () {
                $('#debit_difference').val("");
                //calculer_montant_total_a_encaisser();
            });

            $(document).on('change', '#modal-encaissement #compagnie', function () {
                let href_reglements_reverses = $(this).children('option:selected').data('href_reglements_reverses');

                calculer_montant_total_a_encaisser();//vider les champs d'aperçu

                $('.montant_total_com').val(0);

                $('#btn_save_encaissement').attr('disabled', 'true');

                $('#box_reglements_reverses').load(href_reglements_reverses, function () {
                    $('#table_reglements_reverses').DataTable({
                        "language": {
                            "url": "../../static/admin_custom/js/French.json"
                        },
                        //order: [[0, 'desc']],
                        lengthMenu: [
                            [100, 250, 500, 1000, -1], [100, 250, 500, 1000, "Tout"]
                        ],
                        //sDom: "<'row'<'col-sm-6'>>t<'row'<'col-sm-6'><'col-sm-6'>>",
                        paging: false,
                        searching: true,
                        lengthChange: true,
                        bSort: false,
                        scrollX: true,
                    });
                });

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
            $('#btn_save_encaissement').on('click', function () {

                let btn_save_encaissement = $(this);

                let formulaire = $('#form_add_encaissement_commission');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                if (formulaire.valid()) {

                    //désactiver le bouton Valider, pour empecher une double soumission du formulaire
                    btn_save_encaissement.attr('disabled', true);

                    //demander confirmation
                    let n = noty({
                        text: 'Voulez-vous vraiment effectuer cet encaissement ?',
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

                                                    window.open('../generer_bordereau_encaissement_compagnie_pdf/' + response.data.operation_id, '_blank');

                                                    //rediriger pour afficher le bordereau de reglement compagnie en pdf
                                                    //console.log(response.data.pdf_url);
                                                    //operation_id = response.data.operation_id;
                                                    //console.log(operation_id);
                                                    //location.href = 'comptabilite/generer_bordereau_encaissement_compagnie_pdf/'+operation_id;
                                                    //window.open('comptabilite/generer_bordereau_encaissement_compagnie_pdf/'+operation_id);
                                                    //location.href = 'comptabilite/generer_bordereau_encaissement_compagnie_pdf/'+operation_id;
                                                    //alert(operation_id);
                                                    //alert(location.href);

                                                    location.reload();


                                            } else {

                                                let errors = JSON.parse(JSON.stringify(response.errors));
                                                let errors_list_to_display = '';
                                                for (field in errors) {
                                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                                }

                                                $('#modal-encaissement .alert .message').html(errors_list_to_display);

                                                $('#modal-encaissement .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                    $(this).slideUp(500);
                                                }).removeClass('alert-success').addClass('alert-warning');

                                            }

                                        },
                                        error: function (request, status, error) {

                                            notifyWarning("Erreur lors de l'enregistrement");

                                            btn_save_encaissement.removeAttr('disabled');

                                        }

                                    });

                                    //fin confirmation obtenue

                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();

                                    btn_save_encaissement.removeAttr('disabled');

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

                    btn_save_encaissement.removeAttr('disabled');

                }


            });

        });

    });


    function calculer_montant_total_a_encaisser() {

        let montant_total_reglements_coches = 0;
        let montant_total_a_regler_compagnie = 0;
        let montant_total_com_gestion = 0;
        let montant_total_com_courtage = 0;
        let montant_total_a_encaisser = 0;
        let montant_solde = 0;
        let difference_match = false;
        let erreur_difference = false
        // $('.montant_total_com').val(0);


        let credit_difference = $('#credit_difference').val().replaceAll(" ", "");
        credit_difference = credit_difference === "" || isNaN(credit_difference) ? 0 : parseFloat(credit_difference);
        let debit_difference = parseFloat($('#debit_difference').val().replaceAll(" ", ""));
        debit_difference = debit_difference === "" || isNaN(debit_difference) ? 0 : parseFloat(debit_difference);

        $('.checkbox_quittance_a_encaisser:checked').each(function (element) {

            let montant_reglement = parseFloat($(this).data('reglement_montant'));
            let montant_compagnie = parseFloat($(this).data('reglement_montant_compagnie'));
            let montant_com_gestion = parseFloat($(this).data('reglement_montant_com_gestion'));
            let montant_com_courtage = parseFloat($(this).data('reglement_montant_com_courtage'));

            let montant_a_encaisser = parseFloat($(this).closest('tr').find('.montant_a_encaisser').val());
            //montant_a_encaisser = montant_a_encaisser === "" ? 0 : parseFloat(montant_a_encaisser);
            let montant_a_encaisser_court = parseFloat($(this).closest('tr').find('.montant_encaisse_court').val().replaceAll(" ", ""));
            montant_a_encaisser_court = montant_a_encaisser_court === "" || isNaN(montant_a_encaisser_court) ? 0 : parseFloat(montant_a_encaisser_court);
            let montant_a_encaisser_gest = parseFloat($(this).closest('tr').find('.montant_encaisse_gest').val().replaceAll(" ", ""));
            montant_a_encaisser_gest = montant_a_encaisser_gest === "" || isNaN(montant_a_encaisser_gest) ? 0 : parseFloat(montant_a_encaisser_gest);

            montant_total_reglements_coches = montant_total_reglements_coches + montant_reglement;
            montant_total_a_regler_compagnie = montant_total_a_regler_compagnie + montant_compagnie;
            montant_total_com_gestion = montant_total_com_gestion + montant_a_encaisser_gest;
            montant_total_com_courtage = montant_total_com_courtage + montant_a_encaisser_court;
            //montant_total_a_encaisser       = montant_total_a_encaisser + montant_a_encaisser;
            montant_total_a_encaisser = montant_total_com_courtage + montant_total_com_gestion;

            difference = montant_com_courtage - montant_a_encaisser_court + montant_com_gestion - montant_a_encaisser_gest
            $(this).closest('tr').find('.restant_total').val(difference);

            if (debit_difference == difference && difference_match == false && difference > 0 && difference < 3000) {
                difference_match = true;
            }

            if (difference < 0) {
                erreur_difference = true;
            }

            if (montant_com_courtage < montant_a_encaisser_court || montant_com_gestion < montant_a_encaisser_gest) {
                erreur_difference = true;
            }

            montant_solde = montant_solde + difference;

            /*
            difference = montant_com_courtage-montant_a_encaisser_court+montant_com_gestion-montant_a_encaisser_gest
            if (difference > 0 && difference < 3000){
                $('#debit_difference').val(difference);
                $('#credit_difference').val("");
                $('#credit_difference').attr('readonly','true');
            }
            */

        });

        $('.montant_total_reglements_coches').val(montant_total_reglements_coches);
        $('.montant_total_a_regler_compagnie').val(montant_total_a_regler_compagnie);
        $('.montant_total_com_gestion').val(montant_total_com_gestion);
        $('.montant_total_com_courtage').val(montant_total_com_courtage);
        $('.montant_total_com').val(montant_total_a_encaisser + credit_difference);
        //$('.montant_total_com').val(montant_total_a_encaisser);

        if (montant_total_a_encaisser > 0 || (montant_total_a_encaisser == 0 && debit_difference > 0)) {
            $('#btn_save_encaissement').removeAttr('disabled');
        } else {
            $('#btn_save_encaissement').attr('disabled', 'true');
        }

        if (((credit_difference > 0 || debit_difference > 0) && $('#compte_difference').val() == "") || debit_difference > 3000 || (debit_difference > 0 && difference_match == false) || ($('#compte_difference').val() != "" && debit_difference == 0 && credit_difference == 0) || (montant_solde > 0 && credit_difference > 0) || erreur_difference == true) {
            $('#btn_save_encaissement').attr('disabled', 'true');
        }

    }


    //********* FIN FAIRE UN ENCAISSEMENT ***********//


    //********* FAIRE UN ENCAISSEMENT DE COMMISSION COURTAGE / GESTION ***********//

    $(".btnOpenDialogDetailCompagnieEncaissementCourtGest").on('dblclick', function () {

        $(".btnOpenDialogDetailCompagnieEncaissementCourtGest").removeClass('tr_selected');
        $(this).addClass('tr_selected');
        let compagnie = $(this).data('compagnie');
        $("#datatable_stock_input_com").html("");
        $("#btnOpenDialogAddEncaissementCommisionCourtGest").trigger("click");

    });


    $("#btnOpenDialogAddEncaissementCommisionCourtGest").on('click', function () {

        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');
        $("#datatable_stock_input_com").html("");

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-encaissement-court-gest').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-encaissement-court-gest').find('.modal-title').text(modal_title);
            $('#modal-encaissement-court-gest').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-encaissement-court-gest').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-encaissement-court-gest').modal();

            $('#modal-encaissement-court-gest').on('shown.bs.modal', function () {
                compagnie = typeof $('.tr_selected') !== 'undefined' ? $('.tr_selected').data('compagnie') : "";
                if (compagnie && compagnie != "") {
                    $('#modal-encaissement-court-gest #compagnie option[value=' + compagnie + ']').attr('selected', 'selected');
                    $("#modal-encaissement-court-gest #compagnie").trigger('change');
                }
            })

            //gestion des saisies des montants à regler
            $(document).on('click', '.checkbox_quittance_a_encaisser_com_gest', function () {
                let input_montant_encaisse_court = $(this).closest('tr').find('.montant_encaisse_court');
                let input_montant_encaisse_gest = $(this).closest('tr').find('.montant_encaisse_gest');
                let solde_quittance = $(this).closest('tr').find('.solde_quittance').val();
                let input_solde_apres = $(this).closest('tr').find('.solde_apres');
                let montant_com_solde = parseFloat($(this).data('montant_com_solde'));
                let montant_com_courtage = 0; //parseFloat($(this).data('reglement_montant_com_courtage'));
                let montant_com_gestion = 0; //parseFloat($(this).data('reglement_montant_com_gestion'));
                let com_type = $("#com_type").val(); //le type de commision auquel on a affaire soit courtage ou gestion

                //input_montant_a_encaisser.val(0);
                input_solde_apres.val(solde_quittance);
                //$('#restant_total').val(montant_com_solde);
                if (com_type == "courtage") {
                    $(this).closest('tr').find('.restant_total').val(parseFloat($(this).data('reglement_montant_com_courtage')));
                } else {
                    $(this).closest('tr').find('.restant_total').val(parseFloat($(this).data('reglement_montant_com_gestion')));

                }

                if (this.checked) {
                    if (com_type == "courtage") {
                        input_montant_encaisse_court.removeAttr('readonly');
                        input_montant_encaisse_court.attr('required', true);
                        input_montant_encaisse_court.val(0);//montant_com_courtage;
                    } else {
                        input_montant_encaisse_gest.removeAttr('readonly');
                        input_montant_encaisse_gest.attr('required', true);
                        input_montant_encaisse_gest.val(0);//montant_com_gestion);
                    }
                    /// parade pour evider les doublons lors d'evenements
                    already_exist = $("#datatable_stock_input_com").find("#input_stock_" + $(this).val());
                    /// console.log(already_exist.length);
                    if (already_exist.length == 0) {
                        /** parade pour eviter que lors du filtre des lignes la somme ne soient plus calculer correctement, pour cela creer des champs dynamique de stockage qui seront calculer en lieu et place des chechbox de base **/
                        $("#datatable_stock_input_com").append("<input type='text' class='input_stock' id='input_stock_" + $(this).val() + "' data-reglement_id='" + parseFloat($(this).data('reglement_id')) + "' data-reglement_montant='" + parseFloat($(this).data('reglement_montant')) + "'  data-reglement_montant_com_courtage='" + parseFloat($(this).data('reglement_montant_com_courtage')) + "'  data-reglement_montant_com_gestion='" + parseFloat($(this).data('reglement_montant_com_gestion')) + "' data-reglement_montant_compagnie='" + parseFloat($(this).data('reglement_montant_compagnie')) + "'>");
                    }
                } else {
                    if (com_type == "courtage") {
                        input_montant_encaisse_court.attr('readonly', true);
                        input_montant_encaisse_court.removeAttr('required');
                        input_montant_encaisse_court.val(0);
                    } else {
                        input_montant_encaisse_gest.attr('readonly', true);
                        input_montant_encaisse_gest.removeAttr('required');
                        input_montant_encaisse_gest.val(0);
                    }
                    //console.log("a supprimer");
                    $("#input_stock_" + $(this).val()).remove();
                }

                calculer_montant_total_a_encaisser_court_gest(com_type);


            });

            //montant_a_regler
            $(document).on('change keyup', '.handle_calculer_montant_total_a_encaisser', function () {
                let com_type = $("#com_type").val(); //le type de commision auquel on a affaire soit courtage ou gestion
                //console.log($(this).closest('tr').find('td:first-child input').val());
                $("#input_stock_" + $(this).closest('tr').find('td:first-child input').val()).val($(this).val());
                //console.log(com_type)
                //console.log('handle_calculer_montant_total_a_encaisser');
                calculer_montant_total_a_encaisser_court_gest(com_type);

            });

            $(document).on('change keyup', '#debit_difference', function () {
                $('#credit_difference').val("");
                //calculer_montant_total_a_encaisser();
            });
            $(document).on('change keyup', '#credit_difference', function () {
                $('#debit_difference').val("");
                //calculer_montant_total_a_encaisser();
            });

            $(document).on('change', '#modal-encaissement-court-gest #compagnie', function () {
                let href_reglements_reverses = $(this).children('option:selected').data('href_reglements_reverses');
                let com_type = $("#com_type").val(); //le type de commision auquel on a affaire soit courtage ou gestion
                //console.log(com_type)

                //reinitialisons les points important pour la commission
                $("#datatable_stock_input_com").html("");
                $('#credit_difference').val("");
                $('#debit_difference').val("");

                calculer_montant_total_a_encaisser_court_gest(com_type);//vider les champs d'aperçu

                $('.montant_total_com').val(0);

                $('#btn_save_encaissement').attr('disabled', 'true');

                $('#box_reglements_reverses').load(href_reglements_reverses, function () {
                    $('#table_reglements_reverses').DataTable({
                        "language": {
                            "url": "../../static/admin_custom/js/French.json"
                        },
                        //order: [[0, 'desc']],
                        lengthMenu: [
                            [100, 250, 500, 1000, -1], [100, 250, 500, 1000, "Tout"]
                        ],
                        //sDom: "<'row'<'col-sm-6'>>t<'row'<'col-sm-6'><'col-sm-6'>>",
                        paging: false,
                        searching: true,
                        lengthChange: true,
                        bSort: false,
                        scrollX: true,
                    });
                });

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
                    //$('#banque').attr('required', true);
                    $('#libelle_numero_piece_required').html('*');
                    //$('#libelle_banque_required').html('*');
                }

            });

            //enregistrement
            $('#btn_save_encaissement').on('click', function () {

                let btn_save_encaissement = $(this);

                let formulaire = $('#form_add_encaissement_commission');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                let com_type = $("#com_type").val(); //le type de commision auquel on a affaire soit courtage ou gestion

                if (formulaire.valid()) {

                    //désactiver le bouton Valider, pour empecher une double soumission du formulaire
                    btn_save_encaissement.attr('disabled', true);

                    //demander confirmation
                    let n = noty({
                        text: 'Voulez-vous vraiment effectuer cet encaissement ?',
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

                                                notifySuccess(response.message, function () {

                                                    $("#datatable_stock_input_com").html("");
                                                    window.open('../generer_bordereau_encaissement_compagnie_pdf/' + response.data.operation_id + '?type=' + com_type, '_blank');

                                                    //rediriger pour afficher le bordereau de reglement compagnie en pdf
                                                    //console.log(response.data.pdf_url);
                                                    //operation_id = response.data.operation_id;
                                                    //console.log(operation_id);
                                                    //location.href = 'comptabilite/generer_bordereau_encaissement_compagnie_pdf/'+operation_id;
                                                    //window.open('comptabilite/generer_bordereau_encaissement_compagnie_pdf/'+operation_id);
                                                    //location.href = 'comptabilite/generer_bordereau_encaissement_compagnie_pdf/'+operation_id;
                                                    //alert(operation_id);
                                                    //alert(location.href);

                                                    location.reload();
                                                });


                                            } else {

                                                let errors = JSON.parse(JSON.stringify(response.errors));
                                                let errors_list_to_display = '';
                                                for (field in errors) {
                                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                                }

                                                $('#modal-encaissement-court-gest .alert .message').html(errors_list_to_display);

                                                $('#modal-encaissement-court-gest .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                    $(this).slideUp(500);
                                                }).removeClass('alert-success').addClass('alert-warning');

                                            }

                                        },
                                        error: function (request, status, error) {

                                            notifyWarning("Erreur lors de l'enregistrement");

                                            btn_save_encaissement.removeAttr('disabled');

                                        }

                                    });

                                    //fin confirmation obtenue

                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();

                                    btn_save_encaissement.removeAttr('disabled');

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

                    btn_save_encaissement.removeAttr('disabled');

                }


            });

        });

    });


    function calculer_montant_total_a_encaisser_court_gest(com_type) {

        let montant_total_reglements_coches = 0;
        let montant_total_a_regler_compagnie = 0;
        let montant_total_com_gestion = 0;
        let montant_total_com_courtage = 0;
        let montant_total_a_encaisser = 0;
        let montant_solde = 0;
        let difference_match = false;
        let erreur_difference = false
        // $('.montant_total_com').val(0);


        let credit_difference = $('#credit_difference').val().replaceAll(" ", "");
        credit_difference = credit_difference === "" || isNaN(credit_difference) ? 0 : parseFloat(credit_difference);
        let debit_difference = parseFloat($('#debit_difference').val().replaceAll(" ", ""));
        debit_difference = debit_difference === "" || isNaN(debit_difference) ? 0 : parseFloat(debit_difference);
        let text_compte_difference = $('#compte_difference option:selected').text();
        let is_perte_compte_difference = (text_compte_difference.indexOf("6511000") >= 0)
        console.log(is_perte_compte_difference);

        $('.input_stock').each(function (element) {

            let montant_reglement = parseFloat($("#input_stock_" + $(this).data('reglement_id')).data('reglement_montant'));
            let montant_compagnie = parseFloat($("#input_stock_" + $(this).data('reglement_id')).data('reglement_montant_compagnie'));
            if (com_type == "courtage") {
                let montant_com_courtage = parseFloat($("#input_stock_" + $(this).data('reglement_id')).data('reglement_montant_com_courtage'));
                let montant_a_encaisser_court = parseFloat($("#input_stock_" + $(this).data('reglement_id')).val().replaceAll(" ", ""));
                montant_a_encaisser_court = montant_a_encaisser_court === "" || isNaN(montant_a_encaisser_court) ? 0 : parseFloat(montant_a_encaisser_court);
                montant_total_com_courtage = montant_total_com_courtage + montant_a_encaisser_court;
                montant_total_a_encaisser = montant_total_com_courtage;
                difference = montant_com_courtage - montant_a_encaisser_court;
                if (montant_com_courtage < montant_a_encaisser_court) {
                    erreur_difference = false; //true; car peut encaisser un montant superieur
                }
            }
            else {
                let montant_com_gestion = parseFloat($("#input_stock_" + $(this).data('reglement_id')).data('reglement_montant_com_gestion'));
                let montant_a_encaisser_gest = parseFloat($("#input_stock_" + $(this).data('reglement_id')).val().replaceAll(" ", ""));
                montant_a_encaisser_gest = montant_a_encaisser_gest === "" || isNaN(montant_a_encaisser_gest) ? 0 : parseFloat(montant_a_encaisser_gest);
                montant_total_com_gestion = montant_total_com_gestion + montant_a_encaisser_gest;
                montant_total_a_encaisser = montant_total_com_gestion;
                difference = montant_com_gestion - montant_a_encaisser_gest;
                if (montant_com_gestion < montant_a_encaisser_gest) {
                    erreur_difference = false; //true; car peut encaisser un montant superieur
                }
            }

            let montant_a_encaisser = parseFloat($("#checkbox_quittance_a_encaisser_" + $(this).data('reglement_id')).closest('tr').find('.montant_a_encaisser').val());
            //montant_a_encaisser = montant_a_encaisser === "" ? 0 : parseFloat(montant_a_encaisser);


            montant_total_reglements_coches = montant_total_reglements_coches + montant_reglement;
            montant_total_a_regler_compagnie = montant_total_a_regler_compagnie + montant_compagnie;
            //montant_total_a_encaisser       = montant_total_a_encaisser + montant_a_encaisser;

            $("#checkbox_quittance_a_encaisser_" + $(this).data('reglement_id')).closest('tr').find('.restant_total').val(difference);

            if (debit_difference == difference && difference_match == false && difference > 0 && ((difference < 3000 && is_perte_compte_difference==true) || (is_perte_compte_difference==false))) {
                difference_match = true;
                if (debit_difference == difference && difference > 0) {
                    $("#checkbox_quittance_a_encaisser_" + $(this).data('reglement_id')).closest('tr').find('.restant_total').val(difference - debit_difference);
                    $("#checkbox_quittance_a_encaisser_" + $(this).data('reglement_id')).closest('tr').find('.handle_calculer_montant_total_a_encaisser').removeAttr('required');
                }
            }

            if (credit_difference == (-1 * difference) && difference_match == false && credit_difference > 0) {
                difference_match = true;
                if (credit_difference == (-1 * difference)) {
                    $("#checkbox_quittance_a_encaisser_" + $(this).data('reglement_id')).closest('tr').find('.restant_total').val(difference + credit_difference);
                    $("#checkbox_quittance_a_encaisser_" + $(this).data('reglement_id')).closest('tr').find('.handle_calculer_montant_total_a_encaisser').removeAttr('required');
                }
            }

            if (difference < 0) {
                erreur_difference = false; //true; car peut encaisser un montant superieur
            }

            montant_solde = montant_solde + difference;

            /*
            difference = montant_com_courtage-montant_a_encaisser_court+montant_com_gestion-montant_a_encaisser_gest
            if (difference > 0 && difference < 3000){
                $('#debit_difference').val(difference);
                $('#credit_difference').val("");
                $('#credit_difference').attr('readonly','true');
            }
            */

        });

        $('.montant_total_reglements_coches').val(montant_total_reglements_coches);
        $('.montant_total_a_regler_compagnie').val(montant_total_a_regler_compagnie);
        if (com_type == "courtage") {
            $('.montant_total_com_gestion').val(montant_total_com_gestion);
        } else {
            $('.montant_total_com_courtage').val(montant_total_com_courtage);
        }
        // $('.montant_total_com').val(montant_total_a_encaisser + credit_difference);
        $('.montant_total_com').val(montant_total_a_encaisser);

        if (montant_total_a_encaisser != 0 || (montant_total_a_encaisser == 0 && debit_difference > 0) || (montant_total_a_encaisser == 0 && credit_difference > 0)) {
            $('#btn_save_encaissement').removeAttr('disabled');
            console.log("enabled");
        } else {
            $('#btn_save_encaissement').attr('disabled', 'true');
            console.log("disabled 1");
        }

        if (((credit_difference > 0 || debit_difference > 0) && $('#compte_difference').val() == "")
            || (debit_difference > 3000 && is_perte_compte_difference==true)
            || (debit_difference > 0 && difference_match == false)
            || (credit_difference > 0 && difference_match == false)
            || ($('#compte_difference').val() != "" && debit_difference == 0 && credit_difference == 0)
            //|| (montant_solde > 0 && credit_difference > 0)
            || erreur_difference == true) {
            $('#btn_save_encaissement').attr('disabled', 'true');
            console.log("disabled 2");
        }

    }


    //********* FIN FAIRE UN ENCAISSEMENT COURTAGE / GESTION ***********//


    //********* FAIRE UN REGLEMENT COMPAGNIE ***********//

    $(".btnOpenDialogDetailCompagnieEncaissementReglement").on('dblclick', function () {

        $(".btnOpenDialogDetailCompagnieEncaissementReglement").removeClass('tr_selected');
        $(this).addClass('tr_selected');
        let compagnie = $(this).data('compagnie');
        $("#datatable_stock_input_com").html("");
        $("#btnOpenDialogAddReglementCompagnie").trigger("click");

    });

    $("#btnOpenDialogAddReglementCompagnie").on('click', function () {

        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');
        $("#datatable_stock_input_reg").html("");

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-reglement_compagnie').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-reglement_compagnie').find('.modal-title').text(modal_title);
            $('#modal-reglement_compagnie').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-reglement_compagnie').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-reglement_compagnie').modal();

            $('#modal-reglement_compagnie').on('shown.bs.modal', function () {
                compagnie = $('.tr_selected').data('compagnie');
                if (compagnie && compagnie != "") {
                    $('#modal-reglement_compagnie #compagnie option[value=' + compagnie + ']').attr('selected', 'selected');
                    $("#modal-reglement_compagnie #compagnie").trigger('change');
                }
            })


            $('.form-add_reglement_compagnie-select').select2();

            //
            $(document).on('change', '#modal-reglement_compagnie #compagnie', function () {

                $("#datatable_stock_input_reg").html("");
                let href_reglements_a_reverser = $(this).children('option:selected').data('href_reglements_a_reverser');

                calculer_montant_total_a_regler_compagnie();//vider les champs d'aperçu

                $('#box_reglements_a_reverser_compagnie').load(href_reglements_a_reverser, function () {
                    $('#table_reglements_a_reverser_compagnie').DataTable({
                        "language": {
                            "url": "../../static/admin_custom/js/French.json"
                        },
                        //order: [[0, 'desc']],
                        lengthMenu: [
                            [100, 250, 500, 1000, -1], [100, 250, 500, 1000, "Tout"]
                        ],
                        //sDom: "<'row'<'col-sm-6'>>t<'row'<'col-sm-6'><'col-sm-6'>>",
                        paging: true,
                        searching: true,
                        lengthChange: true,
                        bSort: false,
                    });
                });

            });

            //gestion des saisies des montants à regler
            $(document).on('click', '.checkbox_quittance_a_regler', function () {

                /** parade pour eviter que lors du filtre des lignes la somme ne soient plus calculer correctement, pour cela creer des champs dynamique de stockage qui seront calculer en lieu et place des chechbox de base **/
                if ($(this).is(":checked")) {
                    /// parade pour evider les doublons lors d'evenements
                    already_exist = $("#datatable_stock_input_reg").find("#input_stock_" + $(this).val());
                    /// console.log(already_exist.length);
                    if (already_exist.length == 0) {
                        /** parade pour eviter que lors du filtre des lignes la somme ne soient plus calculer correctement, pour cela creer des champs dynamique de stockage qui seront calculer en lieu et place des chechbox de base **/
                        $("#datatable_stock_input_reg").append("<input type='text' class='input_stock' id='input_stock_" + $(this).val() + "' value='" + $(this).val() + "' data-reglement_montant='" + parseFloat($(this).data('reglement_montant')) + "'  data-reglement_montant_com_courtage='" + parseFloat($(this).data('reglement_montant_com_courtage')) + "'  data-reglement_montant_com_gestion='" + parseFloat($(this).data('reglement_montant_com_gestion')) + "' data-reglement_montant_compagnie='" + parseFloat($(this).data('reglement_montant_compagnie')) + "'>");
                    }
                }
                else {
                    //console.log("a supprimer");
                    $("#input_stock_" + $(this).val()).remove();
                }

                calculer_montant_total_a_regler_compagnie();

            });


            //champs obligatoires variables selon le mode de règlement
            $(document).on('change', '#mode_reglement', function () {
                //si espèce
                /*if($(this).val() == 1){
                    $('#numero_piece').removeAttr('required');
                    $('#banque').removeAttr('required');
                    $('#libelle_numero_piece_required').html('');
                    $('#libelle_banque_required').html('');
                }else{
                    $('#numero_piece').attr('required', true);
                    $('#banque').attr('required', true);
                    $('#libelle_numero_piece_required').html('*');
                    $('#libelle_banque_required').html('*');
                }*/

            });

            //enregistrement
            $('#btn_save_reglement_compagnie').on('click', function () {

                let btn_save_reglement_compagnie = $(this);

                let formulaire = $('#form_add_reglement_compagnie');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                if (formulaire.valid()) {

                    //désactiver le bouton Valider, pour empecher une double soumission du formulaire
                    btn_save_reglement_compagnie.attr('disabled', true);

                    //demander confirmation
                    let n = noty({
                        text: "Voulez-vous vraiment effectuer ce règlement de l'assureur ?",
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

                                                notifySuccess(response.message, function () {
                                                    //rediriger pour afficher le bordereau de reglement compagnie en pdf
                                                    operation_id = response.data.operation_id;

                                                    window.open('../generer_bordereau_reglement_compagnie_pdf/' + operation_id, '_blank');

                                                    location.reload();

                                                });


                                            } else {

                                                let errors = JSON.parse(JSON.stringify(response.errors));
                                                let errors_list_to_display = '';
                                                for (field in errors) {
                                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                                }

                                                $('#modal-reglement_compagnie .alert .message').html(errors_list_to_display);

                                                $('#modal-reglement_compagnie .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                    $(this).slideUp(500);
                                                }).removeClass('alert-success').addClass('alert-warning');

                                            }

                                        },
                                        error: function (request, status, error) {

                                            notifyWarning("Erreur lors de l'enregistrement");

                                            btn_save_reglement_compagnie.removeAttr('disabled');

                                        }

                                    });

                                    //fin confirmation obtenue

                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();

                                    btn_save_reglement_compagnie.removeAttr('disabled');

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

                    btn_save_reglement_compagnie.removeAttr('disabled');

                }


            });

        });

    });

    //********* FIN FAIRE UN REGLEMENT COMPAGNIE ***********//

    //********* FAIRE UNE EXPORTATION DES QUITTANCES ***********//

    $("#btnOpenDialogExporterQuittance").on('click', function () {

        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            $('#modal-exporter_quittance').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-exporter_quittance').find('.modal-title').text(modal_title);
            $('#modal-exporter_quittance').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-exporter_quittance').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            $('#modal-exporter_quittance').modal();

            // Désactivation initiale du bouton
            $('#btn_save_exporter_quittance').prop('disabled', true);

            // Validation du type de fichier au changement
            $('#type_fichier').on('change', function () {
                let typeFichier = $(this).val();
                if (typeFichier) {
                    $('#btn_save_exporter_quittance').prop('disabled', false);
                } else {
                    $('#btn_save_exporter_quittance').prop('disabled', true);
                }
            });

            // Validation du formulaire avec jQuery Validation
            let formulaire = $('#modal_form_exporter_quittance'); // Assurez-vous que c'est le bon ID

            // Initialisation de la validation
            formulaire.validate({
                rules: {
                    type_fichier: {
                        required: true
                    }
                },
                messages: {
                    type_fichier: {
                        required: "Veuillez choisir un type de fichier"
                    }
                },
                errorPlacement: function (error, element) {
                    error.appendTo(element.closest('.form-group'));
                }
            });

            // Enregistrement
            $('#btn_save_exporter_quittance').on('click', function () {

                let btn_save_exporter_quittance = $(this);
                let href = formulaire.attr('action');

                // Vérification si le formulaire est valide avant soumission
                if (formulaire.valid()) {

                    // Désactiver le bouton Valider pour empêcher une double soumission du formulaire
                    btn_save_exporter_quittance.attr('disabled', true);

                    // Demander confirmation
                    let n = noty({
                        text: 'Voulez-vous vraiment effectuer cette exportation ?',
                        type: 'warning',
                        dismissQueue: true,
                        layout: 'center',
                        theme: 'defaultTheme',
                        buttons: [
                            {
                                addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                                    $noty.close();

                                    // Confirmation obtenue
                                    $.ajax({
                                        type: 'post',
                                        url: href,
                                        data: formulaire.serialize(),
                                        success: function (response) {

                                            if (response.statut == 1) {

                                                window.open('../generer_exportation_quittance/', '_blank');
                                                //location.reload();

                                            } else {

                                                let errors = JSON.parse(JSON.stringify(response.errors));
                                                let errors_list_to_display = '';
                                                for (field in errors) {
                                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                                }

                                                $('#modal-exporter_quittance .alert .message').html(errors_list_to_display);

                                                $('#modal-exporter_quittance .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                    $(this).slideUp(500);
                                                }).removeClass('alert-success').addClass('alert-warning');

                                            }

                                        },
                                        error: function (request, status, error) {

                                            notifyWarning("Erreur lors de l'exportation");

                                            btn_save_exporter_quittance.removeAttr('disabled');

                                        }

                                    });

                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    // Confirmation refusée
                                    $noty.close();

                                    btn_save_exporter_quittance.removeAttr('disabled');

                                }
                            }
                        ]
                    });
                } else {
                    // Si la validation échoue, désactivez le bouton et affichez un message d'avertissement
                    $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');
                    let validator = formulaire.validate();
                    $.each(validator.errorMap, function (index, value) {
                        console.log('Id: ' + index + ' Message: ' + value);
                    });

                    notifyWarning('Veuillez renseigner tous les champs obligatoires');
                    btn_save_exporter_quittance.removeAttr('disabled');
                }

            });

        });

    });

    //********* FIN FAIRE UNE EXPORTATION DES QUITTANCES ***********//


    //********** FAIRE UN REGLEMENT BORDEREAU D"ORDONNANCEMENT */
    $("#btnOpenDialogAddReglementBordereau").on('click', function () {

        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');

        //alert(href);

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-reglement_ordonnancement').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-reglement_ordonnancement').find('.modal-title').text(modal_title);
            $('#modal-reglement_ordonnancement').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-reglement_ordonnancement').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-reglement_ordonnancement').modal();


            //enregistrement
            $('#btn_save_reglement_ordonnancement').on('click', function () {

                let btn_save_reglement_ordonnancement = $(this);

                let formulaire = $('#form_add_reglement_ordonnancement');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                if (formulaire.valid()) {

                    //désactiver le bouton Valider, pour empecher une double soumission du formulaire
                    btn_save_reglement_ordonnancement.attr('disabled', true);

                    //demander confirmation
                    let n = noty({
                        text: 'Voulez-vous vraiment éffectuer ce règlement de paiement ?',
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

                                                notifySuccess(response.message, function () {
                                                    //rediriger pour afficher le bordereau de reglement compagnie en pdf
                                                    operation_id = response.data.operation_id;
                                                    //alert("operation_id = response.data.operation_id " + operation_id)

                                                    location.href = 'comptabilite/generer_bordereau_reglement_ordonnancement_pdf/' + operation_id;
                                                    ///alert(location_href);

                                                    location.reload();

                                                });


                                            } else {

                                                let errors = JSON.parse(JSON.stringify(response.errors));
                                                let errors_list_to_display = '';
                                                for (field in errors) {
                                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                                }

                                                $('#modal-reglement_ordonnancement .alert .message').html(errors_list_to_display);

                                                $('#modal-reglement_ordonnancement .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                    $(this).slideUp(500);
                                                }).removeClass('alert-success').addClass('alert-warning');

                                            }

                                        },
                                        error: function (request, status, error) {

                                            notifyWarning("Erreur lors de l'enregistrement");

                                            btn_save_reglement_ordonnancement.removeAttr('disabled');

                                        }

                                    });

                                    //fin confirmation obtenue

                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();

                                    btn_save_reglement_ordonnancement.removeAttr('disabled');

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

                    btn_save_reglement_ordonnancement.removeAttr('disabled');

                }


            });

        });

    });


    //********** FAIRE UN REGLEMENT BORDEREAU D"ORDONNANCEMENT PAR GARANT */
    $("#btnOpenDialogAddReglementBordereauParGarant").on('click', function () {

        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-reglement_ordonnancement_par_garant').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-reglement_ordonnancement_par_garant').find('.modal-title').text(modal_title);
            $('#modal-reglement_ordonnancement_par_garant').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-reglement_ordonnancement_par_garant').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-reglement_ordonnancement_par_garant').modal();


            //enregistrement
            //TODO REGLEMENT PAR GARANT
            $('#btn_save_reglement_ordonnancement_par_garant').on('click', function () {

                let btn_save_reglement_ordonnancement_par_garant = $(this);

                let formulaire = $('#form_add_reglement_ordonnancement_par_garant');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                if (formulaire.valid()) {

                    //désactiver le bouton Valider, pour empecher une double soumission du formulaire
                    btn_save_reglement_ordonnancement_par_garant.attr('disabled', true);

                    //demander confirmation
                    let n = noty({
                        text: 'Voulez-vous vraiment effectuer ce paiement ?',
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
                                        beforeSend: function () {
                                            $('#loading_gif_reglement_ordonnancement_par_garant').show();
                                            btn_save_reglement_ordonnancement_par_garant.hide();
                                        },
                                        success: function (response) {

                                            if (response.statut == 1) {

                                                notifySuccess(response.message, function () {
                                                    // Rediriger pour afficher le bordereau de reglement compagnie en PDF
                                                    let bordereau_pdf = response.bordereau_pdf;
                                                    // Ouvrir le PDF dans une nouvelle fenêtre
                                                    window.open(bordereau_pdf, '_blank');
                                                    // Recharger la page après un délai de 2 secondes (2000 millisecondes)
                                                    setTimeout(function () {

                                                        if (response.statut_bordereau_pour_redirection == "PAYE") {
                                                            window.location.href = "../../bordereauordonnance";
                                                        }
                                                        else {
                                                            location.reload();
                                                        }
                                                    }, 2000);

                                                });


                                            } else {

                                                $('#loading_gif_reglement_ordonnancement_par_garant').hide();
                                                btn_save_reglement_ordonnancement_garant.show();

                                                btn_save_reglement_ordonnancement_garant.removeAttr('disabled');

                                                let errors = JSON.parse(JSON.stringify(response.errors));
                                                let errors_list_to_display = '';
                                                for (field in errors) {
                                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                                }

                                                $('#modal-reglement_ordonnancement_par_garant .alert .message').html(errors_list_to_display);

                                                $('#modal-reglement_ordonnancement_par_garant .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                    $(this).slideUp(500);
                                                }).removeClass('alert-success').addClass('alert-warning');

                                            }

                                        },
                                        error: function (request, status, error) {

                                            notifyWarning("Erreur lors de l'enregistrement");
                                            $('#loading_gif_reglement_ordonnancement_par_garant').hide();
                                            btn_save_reglement_ordonnancement_garant.show();

                                            btn_save_reglement_ordonnancement_garant.removeAttr('disabled');

                                        }

                                    });

                                    //fin confirmation obtenue

                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();
                                    $('#loading_gif_reglement_ordonnancement_par_garant').hide();
                                    btn_save_reglement_ordonnancement_garant.show();

                                    btn_save_reglement_ordonnancement_garant.removeAttr('disabled');

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

                    $('#loading_gif_reglement_ordonnancement_par_garant').hide();
                    btn_save_reglement_ordonnancement_garant.show();

                    btn_save_reglement_ordonnancement_garant.removeAttr('disabled');

                }


            });

        });

    });



    //********** FAIRE UNE INITIALISATION DE LA CAUTION D'UN GARANT | SUIVI DE TRÉSORERIE */
    $("#btnOpenDialogInitialiserFDRGarant").on('click', function () {

        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-initialiser_fdr_garant').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-initialiser_fdr_garant').find('.modal-title').text(modal_title);
            $('#modal-initialiser_fdr_garant').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-initialiser_fdr_garant').find('.modal-dialog').addClass('modal-lg');

            //
            $('#modal-initialiser_fdr_garant').modal();


            //enregistrement
            $('#btn_save_initialiser_fdr_garant').on('click', function () {

                let btn_save_initialiser_fdr_garant = $(this);

                let formulaire = $('#form_add_initialiser_fdr_garant');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                if (formulaire.valid()) {

                    btn_save_initialiser_fdr_garant.attr('disabled', true);

                    //demander confirmation
                    let n = noty({
                        text: "Veuillez svp confirmer l'enregistrement de la caution ?",
                        type: 'warning',
                        dismissQueue: true,
                        layout: 'center',
                        theme: 'defaultTheme',
                        buttons: [
                            {
                                addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                                    //désactiver le bouton Valider, pour empecher une double soumission du formulaire
                                    $noty.close();

                                    //confirmation obtenu
                                    $.ajax({
                                        type: 'post',
                                        url: href,
                                        data: formulaire.serialize(),
                                        beforeSend: function () {
                                            $('#loading_gif_initialiser_fdr_garant').show();
                                            btn_save_initialiser_fdr_garant.hide();
                                        },
                                        success: function (response) {

                                            if (response.statut == 1) {

                                                notifySuccess(response.message, function () {
                                                    // Réinitialiser le formulaire
                                                    location.href = '';

                                                });

                                            } else {

                                                $('#loading_gif_initialiser_fdr_garant').hide();
                                                btn_save_initialiser_fdr_garant.show();

                                                btn_save_initialiser_fdr_garant.removeAttr('disabled');

                                                let errors = JSON.parse(JSON.stringify(response.errors));
                                                let errors_list_to_display = '';
                                                for (field in errors) {
                                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                                }

                                                $('#modal-initialiser_fdr_garant .alert .message').html(errors_list_to_display);

                                                $('#modal-initialiser_fdr_garant .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                    $(this).slideUp(500);
                                                }).removeClass('alert-success').addClass('alert-warning');

                                            }

                                        },
                                        error: function (request, status, error) {

                                            notifyWarning("Erreur lors de l'enregistrement : " + error);

                                            $('#loading_gif_initialiser_fdr_garant').hide();
                                            btn_save_initialiser_fdr_garant.show();
                                            btn_save_initialiser_fdr_garant.removeAttr('disabled');

                                        }

                                    });

                                    //fin confirmation obtenue

                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();
                                    $('#loading_gif_initialiser_fdr_garant').hide();
                                    btn_save_reglement_ordonnancement_garant.show();

                                    btn_save_reglement_ordonnancement_garant.removeAttr('disabled');

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

                    $('#loading_gif_initialiser_fdr_garant').hide();
                    btn_save_reglement_ordonnancement_garant.show();

                    btn_save_reglement_ordonnancement_garant.removeAttr('disabled');

                }


            });

        });

    });

    //********** FAIRE UN REGLEMENT FACTURES GARANTS | SUIVI DE TRÉSORERIE */
    $("#btnOpenDialogReglementFacturesGarant").on('click', function () {

        let model_name = $(this).data('model_name');
        let modal_title = $(this).data('modal_title');
        let href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-reglement_factures_garant').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-reglement_factures_garant').find('.modal-title').text(modal_title);
            $('#modal-reglement_factures_garant').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-reglement_factures_garant').find('.modal-dialog').addClass('modal-xl');

            //
            $('#modal-reglement_factures_garant').modal();


            //enregistrement
            $('#btn_save_reglement_factures_garant').on('click', function () {

                let btn_save_reglement_factures_garant = $(this);

                let formulaire = $('#form_add_reglement_factures_garant');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                if (formulaire.valid()) {



                    //demander confirmation
                    let n = noty({
                        text: 'Voulez-vous vraiment effectuer ce paiement ?',
                        type: 'warning',
                        dismissQueue: true,
                        layout: 'center',
                        theme: 'defaultTheme',
                        buttons: [
                            {
                                addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                                    //désactiver le bouton Valider, pour empecher une double soumission du formulaire
                                    btn_save_reglement_factures_garant.attr('disabled', true);
                                    $noty.close();

                                    //confirmation obtenu
                                    $.ajax({
                                        type: 'post',
                                        url: href,
                                        data: formulaire.serialize(),
                                        beforeSend: function () {
                                            $('#loading_gif_reglement_factures_garant').show();
                                            btn_save_reglement_factures_garant.hide();
                                        },
                                        success: function (response) {

                                            if (response.statut == 1) {

                                                notifySuccess(response.message, function () {
                                                    // Rediriger pour afficher le bordereau de reglement compagnie en PDF
                                                    let bordereau_pdf = response.bordereau_pdf;
                                                    // Ouvrir le PDF dans une nouvelle fenêtre
                                                    window.open(bordereau_pdf, '_blank');
                                                    // Recharger la page après un délai de 2 secondes (2000 millisecondes)
                                                    setTimeout(function () {

                                                        if (response.statut_bordereau_pour_redirection == "PAYE") {
                                                            window.location.href = "../../bordereauordonnance";
                                                        }
                                                        else {
                                                            location.reload();
                                                        }
                                                    }, 2000);

                                                });


                                            } else {

                                                $('#loading_gif_reglement_factures_garant').hide();
                                                btn_save_reglement_ordonnancement_garant.show();

                                                btn_save_reglement_ordonnancement_garant.removeAttr('disabled');

                                                let errors = JSON.parse(JSON.stringify(response.errors));
                                                let errors_list_to_display = '';
                                                for (field in errors) {
                                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                                }

                                                $('#modal-reglement_factures_garant .alert .message').html(errors_list_to_display);

                                                $('#modal-reglement_factures_garant .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                    $(this).slideUp(500);
                                                }).removeClass('alert-success').addClass('alert-warning');

                                            }

                                        },
                                        error: function (request, status, error) {

                                            notifyWarning("Erreur lors de l'enregistrement");
                                            $('#loading_gif_reglement_factures_garant').hide();
                                            btn_save_reglement_ordonnancement_garant.show();

                                            btn_save_reglement_ordonnancement_garant.removeAttr('disabled');

                                        }

                                    });

                                    //fin confirmation obtenue

                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();
                                    $('#loading_gif_reglement_factures_garant').hide();
                                    btn_save_reglement_ordonnancement_garant.show();

                                    btn_save_reglement_ordonnancement_garant.removeAttr('disabled');

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

                    $('#loading_gif_reglement_factures_garant').hide();
                    btn_save_reglement_ordonnancement_garant.show();

                    btn_save_reglement_ordonnancement_garant.removeAttr('disabled');

                }


            });

        });

    });


    // Reglement de facture garant unique / TRESO
    $(document).on('click', '.btn_regler_facture_compagnie_treso', function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-regler_facture_compagnie_treso').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-regler_facture_compagnie_treso').find('.modal-title').text(modal_title);
            $('#modal-regler_facture_compagnie_treso').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-regler_facture_compagnie_treso').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-regler_facture_compagnie_treso').modal();

            //gestion du clique sur valider les modifications
            $("#btn_save_reglement_facture_compagnie_treso").on('click', function () {

                let $button = $(this);

                // Désactivation le bouton pour éviter les clics multiples
                $button.prop('disabled', true);

                console.log('Button disabled:', $button.prop('disabled')); // l'état du bouton dans la console

                let formulaire = $('#form_regler_facture_unique');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                let formData = new FormData();

                if (formulaire.valid()) {

                    //demander confirmation
                    let n = noty({
                        text: 'Vous confirmez le réglement sur cette facture ?',
                        type: 'warning',
                        dismissQueue: true,
                        layout: 'center',
                        theme: 'defaultTheme',
                        buttons: [
                            {
                                addClass: 'btn bg-primary', text: 'OUI', onClick: function ($noty) {
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
                                            }

                                            else if (response.statut == 0) {

                                                notifyWarning(response.message, function () {
                                                    // Réactiver le button
                                                    $button.prop('disabled', false);
                                                });

                                            } else {

                                                let errors = JSON.parse(JSON.stringify(response.errors));
                                                let errors_list_to_display = '';
                                                for (field in errors) {
                                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                                }

                                                $('#modal-regler_facture_compagnie_treso .alert .message').html(errors_list_to_display);

                                                $('#modal-regler_facture_compagnie_treso .alert ').fadeTo(2000, 500).slideUp(500, function () {
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

                                    // réactivation le bouton
                                    $button.prop('disabled', false);


                                }
                            }

                        ]
                    });
                    //fin demande confirmation


                } else {
                    // réactivation le bouton
                    $button.prop('disabled', false);

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
    //fin reglement de facture garant unique / TRESO

    // Annulation de facture garant / TRESO
    $(document).on('click', '.btn_annuler_une_facture_compagnie_treso', function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-annuler_une_facture_compagnie_treso').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-annuler_une_facture_compagnie_treso').find('.modal-title').text(modal_title);
            $('#modal-annuler_une_facture_compagnie_treso').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-annuler_une_facture_compagnie_treso').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-annuler_une_facture_compagnie_treso').modal();

            //gestion du clique sur valider les modifications
            $("#btn_annuler_une_facture_compagnie_treso").on('click', function () {

                let $button = $(this);

                // Désactivation le bouton pour éviter les clics multiples
                $button.prop('disabled', true);

                console.log('Button disabled:', $button.prop('disabled')); // l'état du bouton dans la console

                let formulaire = $('#form_annuler_facture_garant');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                let formData = new FormData();

                if (formulaire.valid()) {

                    //demander confirmation
                    let n = noty({
                        text: 'Souhaitez-vous annuler cette facture ?',
                        type: 'warning',
                        dismissQueue: true,
                        layout: 'center',
                        theme: 'defaultTheme',
                        buttons: [
                            {
                                addClass: 'btn bg-primary', text: 'OUI', onClick: function ($noty) {
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
                                            }

                                            else if (response.statut == 0) {

                                                notifyWarning(response.message, function () {
                                                    // Réactiver le button
                                                    $button.prop('disabled', false);
                                                });

                                            } else {

                                                let errors = JSON.parse(JSON.stringify(response.errors));
                                                let errors_list_to_display = '';
                                                for (field in errors) {
                                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                                }

                                                $('#modal-annuler_une_facture_compagnie_treso .alert .message').html(errors_list_to_display);

                                                $('#modal-annuler_une_facture_compagnie_treso .alert ').fadeTo(2000, 500).slideUp(500, function () {
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
                                addClass: 'btn btn-danger', text: 'NON', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();

                                    // réactivation le bouton
                                    $button.prop('disabled', false);


                                }
                            }

                        ]
                    });
                    //fin demande confirmation


                } else {
                    // réactivation le bouton
                    $button.prop('disabled', false);

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
    //fin Annulation de facture garant / TRESO


    // Editer fonds de roulement compagnie / TRESO
    $(document).on('click', '.btn_editer_fdr_compagnie', function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modal-editer_fdr_garant').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-editer_fdr_garant').find('.modal-title').text(modal_title);
            $('#modal-editer_fdr_garant').find('#btn_valider').attr({ 'data-model_name': model_name, 'data-href': href });
            $('#modal-editer_fdr_garant').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-editer_fdr_garant').modal();

            //gestion du clique sur valider la modifications
            $("#btn_save_editer_fdr_compagnie").on('click', function () {

                let $button = $(this);

                // Désactivation le bouton pour éviter les clics multiples
                $button.prop('disabled', true);

                console.log('Button disabled:', $button.prop('disabled')); // l'état du bouton dans la console

                let formulaire = $('#form_editer_fdr_compagnie');
                let href = formulaire.attr('action');

                $.validator.setDefaults({ ignore: [] });

                let formData = new FormData();

                if (formulaire.valid()) {

                    //demander confirmation
                    let n = noty({
                        text: 'Souhaitez-vous valider l\'initialisation ?',
                        type: 'warning',
                        dismissQueue: true,
                        layout: 'center',
                        theme: 'defaultTheme',
                        buttons: [
                            {
                                addClass: 'btn bg-primary', text: 'OUI', onClick: function ($noty) {
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
                                            }

                                            else if (response.statut == 0) {

                                                notifyWarning(response.message, function () {
                                                    // Réactiver le button
                                                    $button.prop('disabled', false);
                                                });

                                            } else {

                                                let errors = JSON.parse(JSON.stringify(response.errors));
                                                let errors_list_to_display = '';
                                                for (field in errors) {
                                                    errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                                }

                                                $('#modal-editer_fdr_garant .alert .message').html(errors_list_to_display);

                                                $('#modal-editer_fdr_garant .alert ').fadeTo(2000, 500).slideUp(500, function () {
                                                    $(this).slideUp(500);
                                                }).removeClass('alert-success').addClass('alert-warning');

                                            }

                                        },
                                        error: function (request, status, error) {

                                            notifyWarning("Erreur lors de l'édition");
                                        }

                                    });

                                    //fin confirmation obtenue



                                }
                            },
                            {
                                addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                                    //confirmation refusée
                                    $noty.close();

                                    // réactivation le bouton
                                    $button.prop('disabled', false);


                                }
                            }

                        ]
                    });
                    //fin demande confirmation


                } else {
                    // réactivation le bouton
                    $button.prop('disabled', false);

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
    //fin Editer fonds de roulement compagnie / TRESO


    function calculer_montant_total_a_regler_compagnie() {

        let montant_total_reglements_coches = 0;
        let montant_total_a_regler_compagnie = 0;
        //let montant_total_com_gestion = 0;
        let montant_total_com_courtage = 0;

        $('.input_stock').each(function (element) { // on parcours les champs hidden qui stock les valeurs stocké lors du check des case à cocher

            let montant_reglement = parseFloat($("#input_stock_" + $(this).val()).data('reglement_montant'));
            let montant_compagnie = parseFloat($("#input_stock_" + $(this).val()).data('reglement_montant_compagnie'));
            //let montant_com_gestion = parseFloat($("#input_stock_" + $(this).val()).data('reglement_montant_com_gestion'));
            let montant_com_courtage = parseFloat($("#input_stock_" + $(this).val()).data('reglement_montant_com_courtage'));

            montant_total_reglements_coches = montant_total_reglements_coches + montant_reglement;
            montant_total_a_regler_compagnie = montant_total_a_regler_compagnie + montant_compagnie;
            //montant_total_com_gestion = montant_total_com_gestion + montant_com_gestion;
            montant_total_com_courtage = montant_total_com_courtage + montant_com_courtage;

        });

        $('.montant_total_reglements_coches').val(montant_total_reglements_coches);
        $('.montant_total_a_regler_compagnie').val(montant_total_a_regler_compagnie);
        //$('.montant_total_com_gestion').val(montant_total_com_gestion);
        $('.montant_total_com_courtage').val(montant_total_com_courtage);
        $('.montant_total_com').val(montant_total_com_courtage);

        if (montant_total_a_regler_compagnie > 0) {
            $('#btn_save_reglement_compagnie').removeAttr('disabled');
        } else {
            $('#btn_save_reglement_compagnie').attr('disabled', 'true');
        }

    }

    //********* FIN FAIRE UN REGLEMENT COMPAGNIE ***********//




    //GESTION SINISTRE


    //ouverture de la boite de dialog
    $('.modal-sinistre').on('shown.bs.modal', function () {
        let formulaire = $(this).find('form');
        formulaire.trigger('reset');
        $('#acte').trigger('reset');
        $('.numero_carte').val('');
        hideAndEmptyOrShowSibbling('varAlimentSinistreAutre', formulaire, 'hide');
    })
        .on('hidden.bs.modal', function () {
            let formulaire = $(this).find('form');
            formulaire.trigger('reset');
            $('#acte').trigger('reset');
            $('.numero_carte').val('');
            hideAndEmptyOrShowSibbling('varAlimentSinistreAutre', formulaire, 'hide');

            //location.reload();
        });

    //recherche d'un sinistré par son numéro de carte
    $(document).on('click', '.btnSearchAlimentSinistreAutre', function () {
        performSearchAliment($(this));
    });

    $(document).on('keydown', '.numero_carte', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            performSearchAliment($(event.target));
        }
    });

    function performSearchAliment(element) {

        let formulaire = element.closest('form');
        let date_survenance = formulaire.find('#date_survenance').val();
        let prestataire_id = formulaire.find('.prestataire_executant_id').val();
        let numero_carte = formulaire.find('.numero_carte').val();
        let type_prise_en_charge_id = formulaire.find('.type_prise_en_charge_id').val();
        let href = element.data('href');

        //
        formulaire.find('#actes_du_tableau').val('');
        formulaire.find('#box_table_actes_selected').html('');
        //REMPLIR avec ses actes garantis
        remplir_select_acte_prestation(formulaire.find('.acte_prestation'));

        //alert(date_survenance);

        $.ajax({
            type: 'post',
            url: href,
            data: { numero_carte: numero_carte, date_survenance: date_survenance, prestataire_id: prestataire_id, type_prise_en_charge_id: type_prise_en_charge_id },
            beforeSend: function () {
                $('.varAlimentSinistreAutre').hide();
            },
            success: function (response) {

                if (response.statut == 1) {

                    formulaire.find('.error_box_aliment_not_found').html("").hide();

                    hideAndEmptyOrShowSibbling('varAlimentSinistreAutre', formulaire, 'show');

                    let aliment = response.data;
                    formulaire.find('#current_searched_aliment_id').val(aliment.id);
                    formulaire.find('#span-nom').html(aliment.nom);
                    formulaire.find('#span-prenoms').html(aliment.prenoms);
                    formulaire.find('#span-date_naissance').html(aliment.date_naissance);
                    formulaire.find('#span-age').html(aliment.age);
                    formulaire.find('#photo').attr('src', aliment.photo);
                    formulaire.find('#span-assureur').html(aliment.nom_compagnie);
                    formulaire.find('#span-police').html(aliment.nom_client + ' (' + aliment.numero_police + ')');
                    formulaire.find('#span-taux').html(aliment.taux + " %");
                    formulaire.find('#span-qualite_beneficiaire').html(aliment.qualite_beneficiaire);
                    formulaire.find('#span-formule').html(aliment.formule);
                    formulaire.find('#span-plafond_chambre').html(aliment.plafond_chambre);
                    formulaire.find('#span-plafond_hospitalisation').html(aliment.plafond_hospitalisation);
                    formulaire.find('#span-plafond_accouchement').html(aliment.plafond_accouchement);
                    formulaire.find('#span-plafond_consommation_famille').html(aliment.plafond_consommation_famille);
                    formulaire.find('#span-plafond_consommation_individuelle').html(aliment.plafond_consommation_individuelle);

                    //alert(aliment.nom_client + ' (' + aliment.numero_police + ')');

                    //remplir la liste des actes garantis
                    let actes_garantis_json = aliment.actes_garantis;
                    actes_garantis = JSON.parse(actes_garantis_json);

                    //REMPLIR avec ses actes garantis
                    remplir_select_acte_prestation(formulaire.find('.acte_prestation'));

                    //vérrouiller le champ de recherche de numero_assure
                    formulaire.find('.numero_carte').attr('readonly', 'readonly');


                } else {
                    //notifyWarning(response.message);
                    formulaire.find('.error_box_aliment_not_found').html(response.message).show();

                    $('.varAlimentSinistreAutre').hide();

                    formulaire.find('#current_searched_aliment_id').val("");
                    formulaire.find('#span-nom').html("");
                    formulaire.find('#span-prenoms').html("");
                    formulaire.find('#span-date_naissance').html("");
                    formulaire.find('#span-age').html("");
                    formulaire.find('#photo').attr('src', "");
                    formulaire.find('#span-assureur').html("");
                    formulaire.find('#span-police').html("");
                    formulaire.find('#span-taux').html("");
                    formulaire.find('#span-qualite_beneficiaire').html("");
                    formulaire.find('#span-formule').html("");
                    formulaire.find('#span-plafond_chambre').html("");
                    formulaire.find('#span-plafond_hospitalisation').html("");
                    formulaire.find('#span-plafond_accouchement').html("");
                    formulaire.find('#span-plafond_consommation_famille').html("");
                    formulaire.find('#span-plafond_consommation_individuelle').html("");

                }

            },
            error: function (request, status, error) {

                //notifyWarning("Erreur lors de la recherche");
                formulaire.find('.error_box_aliment_not_found').html("ERREUR LORS DE LA RECHERCHE").show();

                $('.varAlimentSinistreAutre').hide();

                formulaire.find('#current_searched_aliment_id').val("");
                formulaire.find('#span-nom').html("");
                formulaire.find('#span-prenoms').html("");
                formulaire.find('#span-date_naissance').html("");
                formulaire.find('#span-age').html("");
                formulaire.find('#photo').attr('src', "");
                formulaire.find('#span-assureur').html("");
                formulaire.find('#span-police').html("");
                formulaire.find('#span-taux').html("");
                formulaire.find('#span-qualite_beneficiaire').html("");
                formulaire.find('#span-formule').html("");
                formulaire.find('#span-plafond_chambre').html("");
                formulaire.find('#span-plafond_hospitalisation').html("");
                formulaire.find('#span-plafond_accouchement').html("");
                formulaire.find('#span-plafond_consommation_famille').html("");
                formulaire.find('#span-plafond_consommation_individuelle').html("");

            }

        });
    }

    $(".numero_carte").on("keydown", function () {
        let formulaire = $(this).closest('form');
        hideAndEmptyOrShowSibbling('varAlimentSinistreAutre', formulaire, 'hide');

        formulaire.find('.error_box_aliment_not_found').html("").hide();
    });

    function hideAndEmptyOrShowSibbling(classDependance, form, etat) {

        form.find("#current_searched_aliment_id").val("");
        $("." + classDependance + "").hide();
        $("." + classDependance + " input:not(.not_resetable)").val("");
        if (etat == "show") {
            $("." + classDependance + "").show();
        }
    }

    //au changement de centre_prescripteur, charger les medecins du centre sélectionné
    $(document).on("change", "#centre_prescripteur", function () {
        prestataire_id = $(this).val();
        let formulaire = $(this).closest('form');

        $.ajax({
            type: 'get',
            url: '/configurations/prescripteurs_by_prestataire/' + prestataire_id,
            dataType: 'json',
            success: function (prescripteurs) {
                $('#prescripteur_optique').html('').append('<option value="">Choisir</option>');

                prescripteurs.forEach(function (prescripteur) {
                    $('#prescripteur_optique').append('<option value="' + prescripteur.pk + '">' + prescripteur.fields.nom + ' ' + prescripteur.fields.prenoms + '</option>');
                });
            },
            error: function () {
                console.log('Erreur lors du chargement des prescripteurs du centre ');
            }
        });

    });


    function is_specials_keys(keyCode) {
        return (keyCode == 8 || keyCode == 9 || keyCode == 46 || keyCode == 37 || keyCode == 39);
    }

    $('#nombre_jours').on('blur', function (e) {//keydown keyup change
        // Récupérer le code de la touche pressée
        var keyCode = e.keyCode || e.which;
        console.log(keyCode);

        //faire le traitement
        let formulaire = $(this).closest('form');
        // Supprimer les caractères non numériques
        let input_value = $(this).val();
        var newValue = input_value.replace(/[^0-9]/g, '');
        //if (newValue > 5){newValue = 5;}
        $(this).val(newValue);
        console.log(newValue);

        //
        let nombre_jours = parseInt($(this).val());
        var date_entree = $('#date_entree').val();

        if (date_entree != '' && !isNaN(nombre_jours)) {
            var date1 = new Date(date_entree);
            date1.setHours(0, 0, 0, 0); // Définir l'heure à 00:00:00

            var date2 = new Date(date1.getTime());
            date2.setDate(date2.getDate() + nombre_jours);

            var year = date2.getFullYear();
            var month = date2.getMonth() + 1;
            var day = date2.getDate();

            var formattedDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;

            $('#date_sortie').val(formattedDate);
            console.log(formattedDate);

            //Si l'acte est renseigné :
            let acte_id = formulaire.find('.acte_prestation').val();
            //alert(acte_id);
            if (acte_id != "") {
                // Simuler un onchange de acte pour que le calcul soit fait
                formulaire.find('.acte_prestation').trigger('change');
            }

        } else {
            $('#date_sortie').val("");
        }


    });

    var xhr_change_acte = '';
    //recherche de cout et tx franchise de l'acte
    $(document).on("change", ".acte_prestation", function () {


        let cet_element = $(this);
        let formulaire = $(this).closest('form');

        let type_prise_en_charge = formulaire.find('#type_prise_en_charge').val();
        let type_prise_en_charge_id = formulaire.find('.type_prise_en_charge_id').val();
        let type_prise_en_charge_code = formulaire.find('.type_prise_en_charge_code').val();


        //Si hospit s'assurer que le nombre de jour est renseigné
        if (type_prise_en_charge_id == 3) {
            let nombre_jours = parseInt(formulaire.find('#nombre_jours').val().replaceAll(' ', ''));
            let cout_acte = parseInt(formulaire.find('#cout_acte').val().replaceAll(' ', ''));
            if (isNaN(cout_acte)) {
                cout_acte = parseInt(0);
            }

            //if (isNaN(cout_acte) || isNaN(nombre_jours) || cout_acte == 0 || nombre_jours == 0) return ;
            if (isNaN(cout_acte) || isNaN(nombre_jours) || nombre_jours == 0) return;

            console.log("continue");
        }

        formulaire.find('.btn_save_sinistre').attr('disabled', "disabled");
        formulaire.find('#box_table_actes_selected').hide();
        formulaire.find('#loading_shimmer_box').show();

        let href_get_infos_selected_actes = $(this).data('href_get_infos_selected_actes');

        //ajouter les lignes déjà dans le tableau
        let table_actes_sinistres_autre = formulaire.find('#table_actes_sinistres_autre');
        let str_actes_du_tableau = '';
        //updated on 21062024: replace $('.selected_acte_info').each(..) by formulaire.find('.selected_acte_info').each(...)
        formulaire.find('.selected_acte_info').each(function () {
            var acteId = $(this).data('acte_id');

            //gestion cas particulier de la consultation le 01062024
            if (type_prise_en_charge_id == 1) {
                let new_selected_acte_id = cet_element.val();
                //alert("new_acte_selected: " + new_selected_acte_id + " - acteId existing in table:" + acteId);

                if (new_selected_acte_id != acteId) {
                    formulaire.find('#cout_acte').val('0');//réinitialiser
                }
            }


            //added on 21062023: prendre en compte les quantié déjà renseignées, ou le montant pour optique et dentiste
            //fusionner les deux: acte_id:quantite:cout_acte
            var acteCout = $(this).closest('tr').find('.cout_acte').val();

            var acteQuantite = $(this).closest('tr').find('.nombre_seance').val();

            str_actes_du_tableau += acteId + ':' + acteQuantite + ':' + acteCout + ',';

            //alert(str_actes_du_tableau);


        });
        formulaire.find('#actes_du_tableau').val(str_actes_du_tableau);

        xhr_change_acte = $.ajax({
            type: 'POST',
            url: href_get_infos_selected_actes,
            data: formulaire.serialize(),
            success: function (response) {

                if (response.statut == 0) {

                    notifyWarning(response.message);

                    formulaire.find('#loading_shimmer_box').hide();

                    //si consultation, cacher le tableau des actes
                    if (type_prise_en_charge_id == 1) {
                        formulaire.find('#box_table_actes_selected').hide();
                    } else {
                        formulaire.find('#box_table_actes_selected').show();
                    }

                    //alert(type_prise_en_charge_id);


                } else {

                    formulaire.find('#box_table_actes_selected').html(response);

                    //appliquer le mask de saisie sur les champs montant
                    AppliquerMaskSaisie();
                    //alert("exec AppliquerMaskSaisie");



                    formulaire.find('.btn_save_sinistre').removeAttr('disabled');

                    formulaire.find('#box_table_actes_selected').show();
                    formulaire.find('#loading_shimmer_box').hide();

                    //alert(type_prise_en_charge_id);
                    //Added on 23052023::si soins ambulatoire : rafraichir la liste en supprimant celle qui vient d'etre ajouté
                    if (type_prise_en_charge_id != 1 && type_prise_en_charge_id != 3) {
                        remplir_select_acte_prestation(cet_element);

                        //désactiver le require du champ select
                        $('.acte_prestation').removeAttr('required');
                    }

                    //scroller la liste pour aller en bas:: ne marche pas pour l'instant
                    let scrollableDiv = formulaire.find('#box_table_actes_selected');
                    scrollableDiv.scrollTop = scrollableDiv[0].scrollHeight - scrollableDiv.height();

                }

            },
            error: function () {

                notifyError("Erreur lors du chargement");

                formulaire.find('#box_table_actes_selected').show();
                formulaire.find('#loading_shimmer_box').hide();
            }
        });

    });

    //Pendant la saisie des coûts des actes, désactiver le bouton valider pour l'activer après le calcul
    $(document).on("keydown", ".cout_acte", function () {
        //vérifier si la valeur a changé avant de recalculer
        var new_cout_acte = parseInt($(this).val().replaceAll(' ', ''));
        var old_cout_acte = parseInt($(this).closest('tr').find('.selected_acte_info').data('frais_reel'));

        //en cas de changement de valeur simuler un onchange de acte pour que le calcul soit fait
        if (new_cout_acte != old_cout_acte) {
            $('.btn_save_sinistre').attr('disabled', true);
        }
    });

    //Pour optique et dentaire, au changement de cout_acte sur chaque ligne
    $(document).on("blur", ".cout_acte", function () {
        let formulaire = $(this).closest('form');

        //vérifier si la valeur a changé avant de recalculer
        var new_cout_acte = parseInt($(this).val().replaceAll(' ', ''));
        var old_cout_acte = parseInt($(this).closest('tr').find('.selected_acte_info').data('frais_reel'));


        //en cas de changement de valeur simuler un onchange de acte pour que le calcul soit fait
        if (new_cout_acte != old_cout_acte) {
            formulaire.find('.acte_prestation').trigger('change');
        }

    });

    //Pour soins ambulatoire, au changement de nombre_seance sur chaque ligne
    $(document).on("blur", ".nombre_seance", function () {
        let formulaire = $(this).closest('form');
        //simuler un onchange de acte pour que le calcul soit fait
        formulaire.find('.acte_prestation').trigger('change');
    });

    //pour hospit, rechercher au changement du montant
    $(document).on("blur", "#cout_acte", function () {
        let formulaire = $(this).closest('form');
        //simuler un onchange de acte pour que le calcul soit fait
        formulaire.find('.acte_prestation').trigger('change');
    });

    //Added on 06102023: désactiver ce fonctionnement - Lionel et Dr Amien
    //si affection renseigné désactiver required sur renseignement clinique
    /*$(document).on("change", "#affection_id" , function() {
        let formulaire = $(this).closest('form');

        let affection_id = $(this).val();
        let renseignement_clinique = formulaire.find('#renseignement_clinique').val();

        if(affection_id != ""){
            formulaire.find('.renseignement_clinique').removeAttr('required');
            formulaire.find('.label_renseignement_clinique_required').text('');
        }else{
            formulaire.find('.renseignement_clinique').attr('required', 'true');
            formulaire.find('.label_renseignement_clinique_required').text('*');
        }

    });

    //si affection renseigné désactiver required sur renseignement clinique
    $(document).on("keyup", "#renseignement_clinique" , function() {
        let formulaire = $(this).closest('form');

        let affection_id = $(this).val();
        let renseignement_clinique = formulaire.find('#renseignement_clinique').val();

        if(renseignement_clinique.length >= 3){
            formulaire.find('#affection_id').removeAttr('required');
            formulaire.find('.label_affection_required').text('');
        }else{
            formulaire.find('#affection_id').attr('required', 'true');
            formulaire.find('.label_affection_required').text('*');
        }

    });
    */


    var actes_garantis = '';

    function remplir_select_acte_prestation(select_acte_prestation) {

        //récupérer les actes à exclure
        let actes_exclus = [];
        $('.selected_acte_info').each(function () {
            actes_exclus.push($(this).val());

        });

        select_acte_prestation.empty();
        let option = $('<option>').val("").text("Choisir");
        select_acte_prestation.append(option);

        $.each(actes_garantis, function (index, acte) {

            if (!actes_exclus.includes(acte.id.toString())) {
                let option = $('<option>').val(acte.id).text(acte.libelle).data('type_pec', acte.rubrique__type_priseencharge__code);
                select_acte_prestation.append(option);
            }

        });

    }

    //Suppression d'un élément du tableau - cas ambulatoire
    $(document).on("click", ".btnSupprimerLigneActe", function (e) {
        let ligne_acte = $(this).closest('tr');
        let select_acte_prestation = $(this).closest('form').find('.acte_prestation');

        //demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment supprimer cette ligne ?',
            type: 'warning',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                        $noty.close();


                        //confirmation obtenu
                        ligne_acte.remove();
                        //remplir le champs tableau_
                        //ajouter les lignes déjà dans le tableau
                        let str_actes_du_tableau = '';
                        $('.selected_acte_info').each(function () {
                            var acteId = $(this).data('acte_id');
                            str_actes_du_tableau += acteId + ',';
                        });
                        $('#actes_du_tableau').val(str_actes_du_tableau);

                        remplir_select_acte_prestation(select_acte_prestation);

                        //calculer
                        //calculer_total_actes();

                        let formulaire = $(this).closest('form');
                        //simuler un onchange de acte pour que le calcul soit fait
                        //formulaire.find('.acte_prestation').trigger('change').hide();

                        select_acte_prestation.trigger('change');
                        //alert("trigger");

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

    });


    function calculer_total_actes() {
        let total_frais_reel = 0;
        let total_part_compagnie = 0;
        let total_part_assure = 0;
        let cpt = 0;

        var formulaire = $(this).closest('form');
        var type_prise_en_charge_id = formulaire.find(".type_prise_en_charge_id").val();

        $('.selected_acte_info').each(function () {
            let ligne_acte = $(this).closest('tr');

            let nombre_seance = parseInt(ligne_acte.find('.nombre_seance').val());

            let frais_reel = 0;
            if (isNaN(nombre_seance)) {
                let cout_acte = parseInt(ligne_acte.find('.cout_acte').val());
                //alert(cout_actes);

                frais_reel = cout_acte;
            } else {
                frais_reel = parseInt($(this).data('frais_reel'));
            }


            var part_compagnie = parseInt($(this).data('part_compagnie'));
            var part_assure = parseInt($(this).data('part_assure'));

            total_frais_reel += isNaN(frais_reel) ? 0 : frais_reel * nombre_seance;
            total_part_compagnie += isNaN(part_compagnie) ? 0 : part_compagnie * nombre_seance;
            total_part_assure += isNaN(part_assure) ? 0 : part_assure * nombre_seance;

            cpt++;

        });

        $('#total_frais_reel').text(total_frais_reel);
        $('#total_part_compagnie').text(total_part_compagnie);
        $('#total_part_assure').text(total_part_assure);

        // cacher le tableau si aucune donnée restante
        if (cpt === 0) {
            $('#box_table_actes_selected').hide();
            $('.acte_prestation').attr('required', 'true');
        }
    }


    //soumission du formulaire de sinistre
    $(document).on("click", ".btn_save_sinistre", function (e) {
        e.preventDefault();

        let formulaire = $(this).closest('form');
        var type_prise_en_charge_id = formulaire.find(".type_prise_en_charge_id").val();

        if (formulaire.valid()) {

            //vérifier s'il y a des coût de l'acte vide
            has_error_cout_acte = false;
            cpt_error = 0;
            let nombre_cout_acte = $('.cout_acte').length;
            if (nombre_cout_acte > 0) {

                $('.cout_acte').each(function (element) {
                    let valeur = $(this).val();
                    if (valeur == 0) {
                        $(this).addClass('error');
                        has_error_cout_acte = true;
                        cpt_error++;

                    } else {
                        $(this).removeClass('error');
                    }

                });

            }


            if (!has_error_cout_acte) {

                //demander confirmation
                let n = noty({
                    text: 'Voulez-vous vraiment enregistrer ?',
                    type: 'warning',
                    dismissQueue: true,
                    layout: 'center',
                    theme: 'defaultTheme',
                    buttons: [
                        {
                            addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                                $noty.close();

                                //confirmation obtenu
                                formulaire.submit();
                                $('.form_sinistre_overlay').show();

                                if (type_prise_en_charge_id == 1) {//CONSULTATION
                                    location.reload();
                                }

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
                let texte = (cpt_error > 1) ? "le coût de chaque acte" : "le coût de l'acte";
                notifyWarning("Veuillez renseigner " + texte);
            }

        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });


    //soumission du formulaire de modification du cout d'un sinistre hospit
    $(document).on("click", "#btn_update_sinistre", function (e) {
        e.preventDefault();

        let formulaire = $(this).closest('form');
        var type_prise_en_charge_id = formulaire.find(".type_prise_en_charge_id").val();

        if (formulaire.valid()) {

            //demander confirmation
            let n = noty({
                text: 'Voulez-vous vraiment enregistrer ?',
                type: 'warning',
                dismissQueue: true,
                layout: 'center',
                theme: 'defaultTheme',
                buttons: [
                    {
                        addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                            $noty.close();

                            //confirmation obtenu
                            //formulaire.submit();
                            //$('.form_sinistre_overlay').show();
                            //confirmation obtenu
                            $.ajax({
                                type: 'post',
                                url: formulaire.attr('action'),
                                data: formulaire.serialize(),
                                success: function (response) {

                                    if (response.statut == 1) {

                                        notifySuccess(response.message, function () {
                                            location.reload();
                                        });

                                    } else {
                                        notifyWarning(response.message);
                                    }

                                },
                                error: function (request, status, error) {

                                    notifyWarning("Erreur, lors de la mise à jour du coût de l'hospitalisation");
                                }

                            });
                            //fin confirmation obtenu


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
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });


    //DEMANDE DE PROROGATION
    //Enregistrer une demande de prorogation
    $(document).on("click", "#btn_save_demande_prorogation", function (e) {
        e.preventDefault();

        let formulaire = $(this).closest('form');

        if (formulaire.valid()) {

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement de la demande de prorogation");
                }

            });
            //fin confirmation obtenu



        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });


    //dialog approuver
    $(document).on("click", "#btn_open_modal_approuver_prorogation", function () {
        let prorogation_id = $(this).data('prorogation_id');
        let jour_demande = $(this).data('jour_demande');

        let input_prorogation = $('#form_approuver_prorogation #prorogation_id');
        let input_jour_demande = $('#form_approuver_prorogation #jour_demande');
        let input_jour_accorde = $('#form_approuver_prorogation #jour_accorde');
        input_prorogation.val(prorogation_id);
        input_jour_demande.val(jour_demande);
        input_jour_accorde.val(jour_demande);

        $('#modal_approuver_prorogation').modal();

    });


    //Approuver une demande de prorogation
    $(document).on("click", "#btn_approuver_prorogation", function (e) {

        var formulaire = $(this).closest('form');

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    console.log(response);
                    if (response.statut == 1) {

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'approbation de la demande de prorogation");
                }

            });

        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });


    //dialog rejeter
    $(document).on("click", "#btn_open_modal_rejeter_prorogation", function () {
        let prorogation_id = $(this).data('prorogation_id');

        let input_prorogation = $('#form_rejeter_prorogation #prorogation_id');
        input_prorogation.val(prorogation_id);

        $('#modal_rejeter_prorogation').modal();

    });


    //Rejeter une demande de prorogation
    $(document).on("click", "#btn_rejeter_prorogation", function (e) {

        var formulaire = $(this).closest('form');

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    console.log(response);
                    if (response.statut == 1) {

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'approbation de la demande de prorogation");
                }

            });

        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }


    }
    );

    //FIN DEMANDE DE PROROGATION

    // TODO : DEMANDE DE REMBOURSEMENT JS
    //DEMANDE DE REMBOURSEMENT
    // Multiple select checkbox
    //    $('#selectAllRemboursements').click(function(e){
    //        var table= $(e.target).closest('table');
    //        $('td input:checkbox',table).prop('checked',this.checked);
    //    });

    // Activation/Desactivation du bouton de traitement de la demande de remboursement lors de la selection
    //    $(document).on("change",'td input:checkbox',function(e){
    //        alert($('td input:checkbox').length);
    //        if( $(this).is(':checked') ){
    //            if( $('td input:checkbox').length > 0){
    //                $('#btn_bulk_traitement_remboursement').prop('disabled', false);
    //            }
    //        }else{
    //            if( $('td input:checkbox').length == 0){
    //                $('#btn_bulk_traitement_remboursement').prop('disabled', true);
    //            }
    //        }
    //    });



    // bulk traitement de la demande de remboursement selectionnées

    //     $(document).on("click", "#btn_bulk_traitement_remboursement" , function(e) {
    //
    //        //demander confirmation
    //         let n = noty({
    //         text        : 'Voulez-vous vraiment traiter la selection ?',
    //         type        : 'warning',
    //         dismissQueue: true,
    //         layout      : 'center',
    //         theme       : 'defaultTheme',
    //         buttons     : [
    //                 {addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
    //                     $noty.close();
    //
    //                     $('#btn_bulk_traitement_remboursement').prop('disabled', true);
    //
    //                      var formulaire = $('#bulk_traitement_remboursement_form').closest('form');
    //                      console.log(formulaire.serialize());
    //
    //                      if(formulaire.valid()){
    //                        $.ajax({
    //                        type:'post',
    //                        url:formulaire.attr('action'),
    //                        data: formulaire.serialize(),
    //                        success: function(response){
    //
    //                            console.log(response);
    //
    //                            if (response.statut == 1){
    //
    //                                notifySuccess(response.message, function(){
    //                                    location.reload();
    //                                });
    //
    //
    //                            }else{
    //                                notifyWarning(response.message);
    //                                $('#btn_bulk_traitement_remboursement').prop('disabled', false);
    //                            }
    //
    //                        },
    //                        error: function(){
    //                            notifyWarning("Erreur lors de la génération du bordereau");
    //                        }
    //
    //                    });
    //                       }
    //
    //
    //                     }
    //                 },
    //                 {addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
    //                     //confirmation refusée
    //                     $noty.close();
    //                 }
    //                 }
    //             ]
    //         });
    //         //fin demande confirmation
    //
    //    });

    // Valider la demande de remboursement
    $(document).on("click", "#btnValiderRemboursementsSelectionnes", function (e) {

        //demander confirmation
        let n = noty({
            text: 'Voulez-vous valider la facture prestataire ?',
            type: 'warning',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                        $noty.close();

                        $('#btnValiderRemboursementsSelectionnes').prop('disabled', true);

                        console.log("valider facture prestataire", $('#btnValiderRemboursementsSelectionnes').data('href'));

                        $.ajax({
                            type: 'get',
                            url: $('#btnValiderRemboursementsSelectionnes').data('href'),

                            success: function (response) {

                                console.log(response);

                                if (response.statut == 1) {
                                    location.href = $('#btnValiderRemboursementsSelectionnes').data('redirection');

                                } else {
                                    notifyWarning(response.message);
                                    $('#btnValiderRemboursementsSelectionnes').prop('disabled', false);
                                }

                            },
                            error: function () {
                                notifyWarning("Erreur lors de la génération du bordereau");
                            }

                        });



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

    });



    //Enregistrer une demande de prorogation
    $(document).on("click", "#btn_save_demande_remboursement", function (e) {
        e.preventDefault();

        let formulaire = $(this).closest('form');

        if (formulaire.valid()) {

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement de la demande de prorogation");
                }

            });
            //fin confirmation obtenu



        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });

    // Calcule du montant à rembourser
    $(document).on("blur", "#montant_refuse", function () {
        var montantRefuse = parseInt($(this).val().replaceAll(' ', ''));
        var montantRembourse = parseInt($('#montant_rembourse').val().replaceAll(' ', ''));
        var montantAccepte = montantRembourse - montantRefuse;
        if (montantAccepte < 0) {
            notifyWarning("Le montant refusé ne peut pas être supérieur au montant de base");
            $(this).val(0);
            //            $('#btn_accepter_remboursement').prop("disabled",true);
        } else {
            $('#montant_accepte').val(montantAccepte);
            //            $('#btn_accepter_remboursement').prop("disabled",false);
        }
    });


    //Accepter une demande de prorogation
    $(document).on("click", "#btn_accepter_remboursement", function (e) {

        var formulaire = $(this).closest('form');

        if (formulaire.valid()) {

            if ($('#montant_refuse').val() != '0' && $('#motif').val() == '') {
                // alert($('#montant_refuse').val());
                // alert($('#motif').val());
                // alert($('#montant_refuse').val() != '0');
                // alert($('#motif').val() == '');
                // alert($('#montant_refuse').val() != '0' && $('#motif').val() == '');
                notifyWarning("Veuillez renseigner correctement le formulaire");
                formulaire.submit(function (e) {
                    return false;
                });
            } else {

                $('#btn_accepter_remboursement').prop("disabled", true);
                $.ajax({
                    type: 'post',
                    url: formulaire.attr('action'),
                    data: formulaire.serialize(),
                    success: function (response) {

                        console.log(response);
                        if (response.statut == 1) {

                            notifySuccess(response.message, function () {
                                location.reload();
                            });

                        } else {
                            notifyWarning(response.message);
                        }

                    },
                    error: function (request, status, error) {

                        notifyWarning("Erreur lors de l'acceptation de la demande de remboursement");
                        $('#btn_accepter_remboursement').prop("disabled", false);
                    }

                });

            }

        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });


    //Rejeter une demande de remboursement
    $(document).on("click", "#btn_refuser_remboursement", function (e) {

        var formulaire = $(this).closest('form');

        if (formulaire.valid()) {
            $('#btn_refuser_remboursement').prop("disabled", true);
            $('#btn_annuler_remboursement').prop("disabled", true);
            $('#loader_modal').show();
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    console.log(response);
                    if (response.statut == 1) {
                        $('#loader_modal').hide();
                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors du refus de la demande de remboursement");
                    $('#btn_refuser_remboursement').prop("disabled", false);
                    $('#btn_annuler_remboursement').prop("disabled", false);
                    $('#loader_modal').hide();
                }

            });

        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }


    }
    );

    //Annuler une demande de remboursement
    $(document).on("click", "#btn_annuler_remboursement", function (e) {

        var formulaire = $(this).closest('form');

        console.log(formulaire.data('action'));

        if (formulaire.valid()) {
            $('#btn_refuser_remboursement').prop("disabled", true);
            $('#btn_annuler_remboursement').prop("disabled", true);
            $('#loader_modal').show();
            $.ajax({
                type: 'post',
                url: formulaire.data('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    console.log(response);
                    if (response.statut == 1) {
                        $('#loader_modal').hide();
                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors du refus de la demande de remboursement");
                    $('#btn_refuser_remboursement').prop("disabled", false);
                    $('#btn_annuler_remboursement').prop("disabled", false);
                    $('#loader_modal').hide();
                }

            });

        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }


    }
    );


    //afficher le modal de rejet d'ordonnancement d'un sinistre
    $(document).on("click", ".btn-open_modal_rejeter_remboursement_ordonnancement", function (e) {
        e.preventDefault();

        href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            $('#modal-rejeter_remboursement_ordonnancement').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-rejeter_remboursement_ordonnancement').find('.modal-dialog').addClass('modal-md').removeClass('modal-lg');

            AppliquerMaskSaisie();



            //
            $('#modal-rejeter_remboursement_ordonnancement').modal();

            //alert("opened details_sinistre");

        });


    });

    //FIN DEMANDE DE REMBOURSEMENT


    //afficher le détail d'un sinistre
    $(document).on("click", ".btn-popup_details_sinistre", function (e) {
        e.preventDefault();

        href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            $('#modal-details_sinistre').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-details_sinistre').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            AppliquerMaskSaisie();

            //appliquer datatable
            $('#table_historique_acte').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'asc']],
                paging: false,
                searching: false,
                lengthChange: false,
            });

            //
            $('#modal-details_sinistre').modal();

            //alert("opened details_sinistre");

        });


    });

    $('#modal-details_sinistre').on('shown.bs.modal', function () {
        //alert("opened");
    })


    //afficher le modal de saisi de la date de realisation d'une seance sinistre
    $(document).on("click", ".btn-popup_seance_done", function (e) {
        e.preventDefault();

        href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            $('#modal-seance_done').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-seance_done').find('.modal-dialog').addClass('modal-lg');

            //
            $('#modal-seance_done').modal();

        });
    });


    // Btn submit marquer la seance comme terminée
    $(document).on("click", "#btn_seance_done", function (e) {


        // var sinistre_id = $(this).data("acte_id");


        var formulaire = $('#form_mark_seance_done');

        if (formulaire.valid()) {


            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    console.log(response);
                    if (response.statut == 1) {

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur, les séances n'ont pas été marquée comme éffectué");
                }

            });
            //fin confirmation obtenu

        } else {
            notifyWarning("La date de réalisation est obligatoire!");
        }


    }
    );
    // Fin Btn submit marquer la seance comme terminée


    //afficher le modal de modification dun sinistre medicament
    $(document).on("click", ".btn_popup_modifier_medicament", function (e) {
        e.preventDefault();

        href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            $('#modal-details_sinistre').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-details_sinistre').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modal-details_sinistre').modal();

        });


    });



    //POUR ACTE
    // Sélectionner/désélectionner | APPROUVER OU REJETER DES ACTES
    $(document).on("click", ".libelle_btnSelectAll", function (e) {

        $("#btnSelectAll").trigger("click");
    });

    $(document).on("click", "#btnSelectAll", function (e) {
        var isChecked = $(this).prop('checked');
        $('#card_liste_actes .select-row:not(:disabled)').prop('checked', isChecked);

        let total_checked = $('#card_liste_actes .select-row:checked:not(:disabled)').length;
        if (total_checked > 0) {
            $('.btnActionDesActes').removeAttr('disabled');
        } else {
            $('.btnActionDesActes').attr('disabled', 'true');
        }

    });

    // Hide the btnActionDesActes buttons initially

    // Vérifier si toutes les lignes sont sélectionnées pour cocher le bouton "Sélectionner tout"
    $(document).on("change", "#card_liste_actes .select-row", function (e) {
        let cpt_selected = 0;

        let total_not_disabled = $('#card_liste_actes .select-row:not(:disabled)').length;
        let total_checked = $('#card_liste_actes .select-row:checked:not(:disabled)').length;

        // Cacher ou afficher le groupe de boutons en fonction de la sélection
        if (total_not_disabled === total_checked) {
            $('#btnSelectAll').prop('checked', true);
        } else {
            $('#btnSelectAll').prop('checked', false);
        }

        if (total_checked > 0) {
            $('.btnActionDesActes').removeAttr('disabled');
        } else {
            $('.btnActionDesActes').attr('disabled', 'disabled');
        }
    });


    //POUR MEDICAMENT
    // Sélectionner/désélectionner | APPROUVER OU REJETER DES ACTES
    $(document).on("click", ".libelle_btnSelectAllMedicament", function (e) {

        $("#btnSelectAllMedicament").trigger("click");
    });

    $(document).on("click", "#btnSelectAllMedicament", function (e) {
        var isChecked = $(this).prop('checked');
        $('#card_liste_medicaments .select-row:not(:disabled)').prop('checked', isChecked);

        let total_checked = $('#card_liste_medicaments .select-row:checked:not(:disabled)').length;
        if (total_checked > 0) {
            $('.btnActionDesMedicaments').removeAttr('disabled');
        } else {
            $('.btnActionDesMedicaments').attr('disabled', 'true');
        }

    });

    // Hide the btnActionDesMedicaments buttons initially

    // Vérifier si toutes les lignes sont sélectionnées pour cocher le bouton "Sélectionner tout"
    $(document).on("change", "#card_liste_medicaments .select-row", function (e) {
        let cpt_selected = 0;

        let total_not_disabled = $('#card_liste_medicaments .select-row:not(:disabled)').length;
        let total_checked = $('#card_liste_medicaments .select-row:checked:not(:disabled)').length;

        // Cacher ou afficher le groupe de boutons en fonction de la sélection
        if (total_not_disabled === total_checked) {
            $('#btnSelectAllMedicament').prop('checked', true);
        } else {
            $('#btnSelectAllMedicament').prop('checked', false);
        }

        if (total_checked > 0) {
            $('.btnActionDesMedicaments').removeAttr('disabled');
        } else {
            $('.btnActionDesMedicaments').attr('disabled', 'disabled');
        }
    });


    // Sélectionner/désélectionner | APPROUVER OU REJETER DES ACTES

    // button editer date de sortie dans details bulletin de sinistre
    $(document).on("click", "#btnEditDateSortie", function (e) {
        e.preventDefault();
        var current_date = $("#pre_empty_date").data("current_date_value");
        // alert(current_date);
        var parts = current_date.split("/");
        var formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
        // alert(formattedDate)
        // Get the current date
        var today = new Date().toISOString().split("T")[0];
        $("#pre_empty_date").hide()
        $(this).replaceWith(`
    <input type="date" id="date_sortie" min="`+ today + `" value="` + formattedDate + `" class="" required>
    <button id="btnSaveEditDateSortie" class="btn btn-sm m-0 p-1 pl-2 bg-success" type="button"><i class="fa fa-check text-white"></i></button>
    `);
    });


    // Mettre a jour la date de sortie
    $(document).on("click", "#btnSaveEditDateSortie", function (e) {
        var sinistreData = $("#sinHiddenData");
        var date_sortie = $("#date_sortie");

        if (!date_sortie.val()) {
            notifyWarning("La date de sortie ne peut pas être vide lorsque vous voulez la mettre à jour", function () {
                // location.reload();
            });
            e.preventDefault();

        } else {

            let n = noty({
                text: 'Mettre à jour la date de sortie ?',
                type: 'warning',
                dismissQueue: true,
                layout: 'center',
                theme: 'defaultTheme',
                buttons: [
                    {
                        addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                            //confirmation refusée
                            $noty.close();
                        }
                    },
                    {
                        addClass: 'btn btn-primary', text: 'Mettre à jour', onClick: function ($noty) {
                            $noty.close();
                            //confirmation obtenu

                            // Make the AJAX request
                            $.ajax({
                                url: sinistreData.data("action_path"),
                                method: 'POST', // or 'GET' depending on your needs
                                data: {
                                    date_sortie: date_sortie.val(),
                                    id_sinistre: sinistreData.data("id_sinistre"),
                                },
                                success: function (response) {
                                    // Handle the success response
                                    console.log(response);
                                    if (response.statut == 1) {

                                        notifySuccess(response.message, function () {
                                            location.href = $.datapath + '/' + response.dossier_sinistre_id
                                            location.reload();
                                        });

                                    } else {
                                        notifyWarning("La date de sortie n'a pas été mise à jour");
                                    }
                                },
                                error: function (error) {
                                    // Handle the error
                                    console.error(error);
                                    notifyWarning("Erreur survenue lors la mise à jour.");
                                }
                            });
                        }
                    }
                ]
            }
            );

        }
    }
    );
    // FIN Mettre a jour la date de sortie

    // Mettre à jour nombre de jour hospitalisation

    $('#nombre_jour_date').on('keydown keyup change', function () {

        var date_entree = $("#date_entree").html();
        var nombre_jour = $(this).val();
        var date_sortieField = $("#date_sortie_calcul");

        var date = moment(date_entree, "DD/MM/YYYY");
        date.add(nombre_jour, 'days');
        new_date = date.format("DD/MM/YYYY");
        date_sortieField.html(new_date);
    });

    $(document).on("click", "#save_nombre_accorde_hositalisation", function (e) {
        var sinHiddenDateNumber = $("#sinHiddenDateNumber");
        var date_entree = $("#date_entree").html();
        var date_sortieField = $("#date_sortie_calcul");
        var date_sortie = date_sortieField.html();
        var nombre_jour = $('#nombre_jour_date').val();

        var date = moment(date_entree, "DD/MM/YYYY");
        date.add(nombre_jour, 'days');
        new_date = date.format("DD/MM/YYYY");
        date_sortieField.html(new_date);

        if (nombre_jour < 1) {
            notifyWarning("La date de sortie ne peut pas être 0.", function () {
                // location.reload();
            });
            e.preventDefault();

        } else {

            let n = noty({
                text: 'Mettre à jour la date de sortie ?',
                type: 'warning',
                dismissQueue: true,
                layout: 'center',
                theme: 'defaultTheme',
                buttons: [
                    {
                        addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                            //confirmation refusée
                            $noty.close();
                        }
                    },
                    {
                        addClass: 'btn btn-primary', text: 'Mettre à jour', onClick: function ($noty) {
                            $noty.close();
                            //confirmation obtenu

                            // Make the AJAX request
                            $.ajax({
                                url: sinHiddenDateNumber.data("action_path"),
                                method: 'POST', // or 'GET' depending on your needs
                                data: {
                                    date_sortie: date_sortieField.html(),
                                    id_sinistre: sinHiddenDateNumber.data("id_sinistre"),
                                },
                                success: function (response) {
                                    // Handle the success response
                                    console.log(response);
                                    if (response.statut == 1) {

                                        notifySuccess(response.message, function () {
                                            location.href = $.datapath + '/' + response.dossier_sinistre_id
                                            location.reload();
                                        });

                                    } else {
                                        notifyWarning("La date de sortie n'a pas été mise à jour");
                                    }
                                },
                                error: function (error) {
                                    // Handle the error
                                    console.error(error);
                                    notifyWarning("Erreur survenue lors la mise à jour.");
                                }
                            });
                        }
                    }
                ]
            }
            );

        }
    });
    // FIN Mettre à jour nombre de jour hospitalisation

    // button editer date de sortie dans details bulletin de sinistre
    $(document).on("click", "#btnEditNombreAccorde", function (e) {
        e.preventDefault();
        var nombre_accorde = $("#pre_empty_nombre_accorde").text();

        $("#pre_empty_nombre_accorde").hide();
        $(this).replaceWith(`
    <input type="number" id="nombre_accorde" value="` + nombre_accorde + `" class="" required>
    <button id="btnSaveNombreAccorde" class="btn btn-sm m-0 p-1 pl-2 bg-success" type="button"><i class="fa fa-check text-white"></i></button>
    `);
    });


    // Mettre a jour la date de sortie
    $(document).on("click", "#btnSaveNombreAccorde", function (e) {
        let href = $('#update_nombre_accorde_sinistre').val();

        var sinistreData = $("#sinHiddenData");
        var nombre_accorde = $("#nombre_accorde").val();

        if (nombre_accorde == 0) {
            notifyWarning("Veuillez renseigner le nombre accordé", function () {
                // location.reload();
            });
            e.preventDefault();

        } else {

            let n = noty({
                text: 'Mettre à jour le nombre accordé ?',
                type: 'warning',
                dismissQueue: true,
                layout: 'center',
                theme: 'defaultTheme',
                buttons: [
                    {
                        addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                            //confirmation refusée
                            $noty.close();
                        }
                    },
                    {
                        addClass: 'btn btn-primary', text: 'Mettre à jour', onClick: function ($noty) {
                            $noty.close();
                            //confirmation obtenu

                            $.ajax({
                                url: href,
                                method: 'POST',
                                data: {
                                    nombre_accorde: nombre_accorde,
                                    id_sinistre: sinistreData.data("id_sinistre"),
                                },
                                success: function (response) {

                                    console.log(response);
                                    if (response.statut == 1) {

                                        notifySuccess(response.message, function () {
                                            //location.href = $.datapath + '/'+response.dossier_sinistre_id
                                            //location.reload();
                                        });

                                    } else {
                                        notifyWarning("La date de sortie n'a pas été mise à jour");
                                    }
                                },
                                error: function (error) {
                                    console.error(error);
                                    notifyWarning("Erreur survenue lors la mise à jour.");
                                }
                            });
                        }
                    }
                ]
            }
            );

        }
    }
    );
    // FIN Mettre a jour le nombre accordé

    // APPROUVER LA SELECTION D'UN ACTE
    $(document).on("click", "#btn_approuver_sinistre", function (e) {
        // e.preventDefault();
        //var buttonApprouver = document.getElementById('btn_approuver_sinistre');
        var buttonApprouver = $(this);


        sinistre_id = $(this).data("acte_id");
        let nombre_demande = $(this).data("nombre_demande");
        let nombre_accorde = $('#nombre_accorde').val();
        let motif_rejet = $('#detail_motif_modif').val();
        let date_sortie_accorde = $('#date_sortie_accorde').val();

        type_operation = $(this).data("type_operation");


        if (nombre_accorde && nombre_accorde < nombre_demande) {
            //        alert(nombre_demande);
            motif_rejet = $('#detail_motif_modif').val();

            //    alert(motif_rejet);
            if (motif_rejet.length < 1) {
                // ON ARRETE LE REJET
                return notifyWarning("Veuillez saisir le motif de la modification");
            }

        }

        if (true) {

            buttonApprouver.attr('disabled', true);

            let n = noty({
                text: 'Voulez-vous vraiment approuver cet acte ?',
                type: 'warning',
                dismissQueue: true,
                layout: 'center',
                theme: 'defaultTheme',
                buttons: [
                    {
                        addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                            //confirmation refusée
                            $noty.close();
                            buttonApprouver.removeAttr('disabled');
                        }
                    },
                    {
                        addClass: 'btn btn-primary', text: 'Approuver', onClick: function ($noty) {
                            $noty.close();
                            //confirmation obtenu

                            // Make the AJAX request
                            $.ajax({
                                url: '/sinistre/statuer_acte/',
                                method: 'POST', // or 'GET' depending on your needs
                                data: {
                                    sinistre_id: sinistre_id,
                                    type_operation: type_operation,
                                    nombre_accorde: nombre_accorde,
                                    motif_rejet: motif_rejet,
                                },
                                success: function (response) {
                                    // Handle the success response
                                    console.log(response);
                                    if (response.statut == 1) {

                                        notifySuccess(response.message, function () {
                                            //location.reload();
                                            location.href = response.redirectto;
                                        });

                                    } else {
                                        notifyWarning(response.message);
                                        buttonApprouver.removeAttr('disabled');
                                    }
                                },
                                error: function (error) {
                                    // Handle the error
                                    console.error(error);
                                    notifyWarning("Erreur survenue à l'approbation de l'acte.");
                                    buttonApprouver.removeAttr('disabled');
                                }
                            });
                        }
                    }
                ]
            }
            );

        }
    }
    );
    // FIN APPROUVER LA SELECTION D'UN ACTE


    // REJETER LA SELECTION D'UN ACTE
    $(document).on("click", "#btn_rejeter_sinistre_un", function (e) {
        // e.preventDefault();
        //var buttonRejeter = document.getElementById('btn_rejeter_sinistre_un');
        var buttonRejeter = $(this);

        sinistre_id = buttonRejeter.attr("data-acte_id");
        type_operation = buttonRejeter.attr("data-type_operation");
        motif_rejet = $('#detail_motif_rejet').val();

        //    alert(motif_rejet);
        if (motif_rejet.length < 1) {
            // ON ARRETE LE REJET
            return notifyWarning("Veuillez saisir le motif du rejet");
        }

        buttonRejeter.attr('disabled', true);
        // Make the AJAX request
        $.ajax({
            url: '/sinistre/statuer_acte/',
            method: 'POST', // or 'GET' depending on your needs
            data: {
                sinistre_id: sinistre_id,
                type_operation: type_operation,
                motif_rejet: motif_rejet,
            },
            success: function (response) {
                // Handle the success response
                console.log(response);
                if (response.statut == 1) {

                    notifySuccess(response.message, function () {
                        //location.reload();
                        location.href = response.redirectto;
                    });

                } else {
                    notifyWarning("Erreur lors de l'approbation de l'acte");
                    buttonRejeter.removeAttr("disabled");
                }
            },
            error: function (error) {
                // Handle the error
                console.error(error);
                notifyWarning("Erreur survenue à l'approbation de l'acte.");
                buttonRejeter.removeAttr("disabled");
            }
        });


    });
    // FIN REJETER LA SELECTION D'UN ACTE


    // APPROUVER LISTE DES ACTES SELECTIONNES
    $(document).on("click", "#btnApprouverActesSelectionnes", function (e) {

        let href_approuver_liste_actes = $(this).data('href');
        var formulaire = $('#formulaire_liste_actes_selectionnes');

        let btn_approuver_actes_selectionnes = $(this);
        btn_approuver_actes_selectionnes.attr('disabled', true);

        //demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment approuver tous les actes sélectionnés ?',
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
                            url: href_approuver_liste_actes,
                            data: formulaire.serialize(),
                            success: function (response) {

                                console.log(response);
                                if (response.statut == 1) {

                                    notifySuccess(response.message, function () {
                                        //location.reload();
                                        location.href = response.redirectto;
                                    });

                                } else {
                                    notifyWarning(response.message);
                                    btn_approuver_actes_selectionnes.removeAttr('disabled');
                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur, les actes sélectionnés n'ont pas été approuvé");
                                btn_approuver_actes_selectionnes.removeAttr('disabled');
                            }

                        });

                    }
                },
                {
                    addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                        //confirmation refusée
                        $noty.close();
                        btn_approuver_actes_selectionnes.removeAttr('disabled');
                    }
                }
            ]
        });
        //fin demande confirmation


    });
    // FIN APPROUVER LISTE DES ACTES SELECTIONNES

    // REJETER LISTE DES ACTES SELECTIONNES
    $(document).on("click", "#btnRejeterActesSelectionnes", function (e) {

        let reject_action_url = $(this).data('reject_action_url');

        var formulaire = $('#formulaire_liste_actes_selectionnes');

        let motif = $('#motif_rejet_modal').val();

        if (formulaire.valid() && motif != "") {

            let btn_rejeter_actes_selectionnes = $(this);
            btn_rejeter_actes_selectionnes.attr('disabled', true);

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: reject_action_url + '?motif_rejet=' + motif,
                data: formulaire.serialize(),
                success: function (response) {

                    console.log(response);
                    if (response.statut == 1) {

                        //désélectionner les lignes
                        $('.select-row').prop('checked', false);
                        //$('#btnSelectAll').prop('checked', false);
                        $("#btnSelectAll").trigger("click");//pour déselectionner tout et grisé les boutons rejetertout et approuvertout

                        notifySuccess(response.message, function () {
                            //location.reload();
                            location.href = response.redirectto;
                        });

                    } else {
                        notifyWarning(response.message);
                        btn_rejeter_actes_selectionnes.removeAttr('disabled');
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur, les actes sélectionnés n'ont pas été rejété");
                    btn_rejeter_actes_selectionnes.removeAttr('disabled');
                }

            });


        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }
    });
    // FIN REJJETER LISTE DES ACTES SELECTIONNES


    // APPROUVER LISTE DES ACTES SELECTIONNES
    $(document).on("click", "#btnApprouverMedicamentsSelectionnes", function (e) {

        let href_approuver_liste_actes = $(this).data('href');
        var formulaire = $('#formulaire_liste_medicaments_selectionnes');

        let btn_approuver_medicaments_selectionnes = $(this);
        btn_approuver_medicaments_selectionnes.attr('disabled', true);


        //demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment approuver tous les médicaments sélectionnés ?',
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
                            url: href_approuver_liste_actes,
                            data: formulaire.serialize(),
                            success: function (response) {

                                console.log(response);
                                if (response.statut == 1) {

                                    notifySuccess(response.message, function () {
                                        //location.reload();
                                        location.href = response.redirectto;
                                    });

                                } else {
                                    notifyWarning(response.message);
                                    btn_approuver_medicaments_selectionnes.removeAttr('disabled');
                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur, les actes sélectionnés n'ont pas été approuvé");
                                btn_approuver_medicaments_selectionnes.removeAttr('disabled');
                            }

                        });

                    }
                },
                {
                    addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                        //confirmation refusée
                        $noty.close();
                        btn_approuver_medicaments_selectionnes.removeAttr('disabled');

                    }
                }
            ]
        });
        //fin demande confirmation


    });
    // FIN APPROUVER LISTE DES ACTES SELECTIONNES

    // REJETER LISTE DES MEDICAMENTS SELECTIONNES
    $(document).on("click", "#btnRejeterMedicamentsSelectionnes", function (e) {

        let reject_action_url = $(this).data('reject_action_url');

        var formulaire = $('#formulaire_liste_medicaments_selectionnes');

        let motif = $('#motif_rejet_modal_medicament').val();

        if (formulaire.valid() && motif != "") {

            let btn_rejeter_actes_selectionnes = $(this);
            btn_rejeter_medicaments_selectionnes.attr('disabled', true);

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: reject_action_url + '?motif_rejet=' + motif,
                data: formulaire.serialize(),
                success: function (response) {

                    console.log(response);
                    if (response.statut == 1) {

                        //désélectionner les lignes
                        $('.select-row').prop('checked', false);
                        //$('#btnSelectAll').prop('checked', false);
                        $("#btnSelectAllMedicament").trigger("click");//pour déselectionner tout et grisé les boutons rejetertout et approuvertout

                        notifySuccess(response.message, function () {
                            //location.reload();
                            location.href = response.redirectto;
                        });

                    } else {
                        notifyWarning(response.message);
                        btn_rejeter_medicaments_selectionnes.removeAttr('disabled');
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur, les médicaments sélectionnés n'ont pas été rejété");
                    btn_rejeter_medicaments_selectionnes.removeAttr('disabled');
                }

            });


        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }
    });
    // FIN REJJETER LISTE DES MEDICAMENTS SELECTIONNES


    //FIN GESTION SINISTRE

    //GESTION PRESTATAIRE

    $(document).on("change", "#secteur_id", function () {
        secteur_id = $(this).val();
        secteur_code = $(this).find(":selected").data("secteur_code");

        if (secteur_code == "PRIVE") {
            $("#type_etablissement_id").val("");
            $("#box_type_etablissement").hide();
        } else {
            $("#box_type_etablissement").show();
        }

    });


    $(document).on("click", "#btn_save_prestataire", function (e) {
        e.preventDefault();

        console.log("Création du prestataire");

        let formulaire = $('#form_add_prestataire');

        if (formulaire.valid()) {

            //demander confirmation
            let n = noty({
                text: 'Voulez-vous créer un prestataire ?',
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
                                url: formulaire.attr('action'),
                                data: formulaire.serialize(),
                                success: function (response) {

                                    if (response.statut == 1) {

                                        resetFields('#form_add_prestataire');

                                        notifySuccess(response.message, function () {
                                            location.reload();
                                        });

                                    } else {
                                        notifyWarning(response.message);
                                    }

                                },
                                error: function (request, status, error) {

                                    notifyWarning("Erreur lors de l'enregistrement");
                                }

                            });

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
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });


    //Modifier un prestataire modal
    $(document).on("click", ".btn_modifier_prestataire", function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        //let dialog_box = $("<div>").addClass('olea_std_dialog_box').appendTo('body');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modifier_modal_prestataire .dataTable:not(.customDataTable_)').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'desc']],
                lengthMenu: [
                    [100],
                    [100],
                ],
                searching: false,
                lengthChange: false,
            });

            let i = 0;
            $('.dropzone_area').each(function (myElement) {
                let zone_id = $(this).attr('id');
                let href = $(this).attr('action');

                let dropzone = new Dropzone("#" + zone_id, { url: href, dictDefaultMessage: "" });

            });

            $('#modifier_modal_prestataire').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modifier_modal_prestataire').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modifier_modal_prestataire').modal();


        });


    });

    //Modifier un prestataire sauvegarde
    $(document).on("click", "#btn_update_prestataire", function (e) {
        e.preventDefault();

        console.log("Modification du prestataire");

        let formulaire = $('#form_update_prestataire');

        if (formulaire.valid()) {

            //demander confirmation
            let n = noty({
                text: 'Voulez-vous modifier ce prestataire ?',
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
                                url: formulaire.attr('action'),
                                data: formulaire.serialize(),
                                success: function (response) {

                                    if (response.statut == 1) {

                                        resetFields('#form_update_prestataire');

                                        notifySuccess(response.message, function () {
                                            location.reload();
                                        });

                                    } else {
                                        notifyWarning(response.message);
                                    }

                                },
                                error: function (request, status, error) {

                                    notifyWarning("Erreur lors de l'enregistrement");
                                }

                            });

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
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });


    $(document).on("click", "#btn_save_reseau_soin_prestataire", function (e) {
        e.preventDefault();

        let formulaire = $('#form_add_reseau_soin_prestataire');

        if (formulaire.valid()) {

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        resetFields('#form_add_reseau_soin_prestataire');

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning("Erreur lors de l'ajout des réseaux de soins");
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });


        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });

    $(document).on("click", ".btn_retirer_reseau_soin_prestataire", function () {
        let ce_bouton = $(this);
        let href = $(this).data('href');

        //demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment retirer le prestataire de ce réseau de soins ?',
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
                            success: function (response) {

                                if (response.statut == 1) {

                                    location.href = '';

                                } else {
                                    notifyWarning(response.message);
                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur lors du retrait du prestataire du réseau de soins");
                            }

                        });

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


    });

    //soumission du formulaire
    $(document).on("click", "#btn_save_prescripteur", function (e) {
        e.preventDefault();

        let formulaire = $('#form_add_prescripteur');

        if (formulaire.valid()) {

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        resetFields('#form_add_prescripteur');

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning("Erreur lors de la création du prestataire");
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });


        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });

    //added on 01062023
    $(document).on("click", "#btn_importer_prescripteurs", function (e) {
        e.preventDefault();

        let formulaire = $(this).closest('form');

        if (formulaire.valid()) {

            let formData = new FormData();
            let files = $('#fichier_import_prescripteurs')[0].files;
            formData.append('fichier_import_prescripteurs', files[0]);

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {

                    if (response.statut == 1) {

                        resetFields('#form_add_prescripteur');

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'importation");
                }

            });

        } else {
            notifyWarning("Veuillez joindre un fichier svp");
        }

    });


    //added on 21122023
    $(document).on("click", "#btn_importer_tarif_pestataire", function (e) {
        e.preventDefault();

        let btn_importer_tarif_pestataire = $(this);

        let formulaire = $(this).closest('form');

        if (formulaire.valid()) {

            let formData = new FormData();
            let files = $('#fichier_import_tarif')[0].files;
            formData.append('fichier_import_tarif', files[0]);

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formData,
                processData: false,
                contentType: false,
                beforeSend: function () {
                    $('#loading_gif').show();
                    btn_importer_tarif_pestataire.hide();
                },
                success: function (response) {

                    if (response.statut == 1) {

                        resetFields('#form_importer_tarif_pestataire');

                        $('#loading_gif').hide();
                        btn_importer_tarif_pestataire.show();

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning("Erreur lors de l'importaion des tarifs");
                    }

                },
                error: function (request, status, error) {
                    $('#loading_gif').hide();
                    btn_importer_tarif_pestataire.show();
                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {
            notifyWarning("Veuillez joindre un fichier svp");
        }

    });


    //added on 21122023
    $(document).on("click", "#btn_valider_tarif_prestataire", function (e) {
        e.preventDefault();

        let formulaire = $(this).closest('form');

        //confirmation obtenu
        $.ajax({
            type: 'post',
            url: formulaire.attr('action'),
            success: function (response) {

                if (response.statut == 1) {

                    notifySuccess(response.message, function () {
                        location.reload();
                    });

                } else {
                    notifyWarning("Erreur lors de la validation des tarifs");
                }

            },
            error: function (request, status, error) {

                notifyWarning("Erreur lors du traitement");
            }
        });

    });

    //added on 202062023
    $(document).on("click", "#btn_add_tarif_prestataire_client", function (e) {
        e.preventDefault();

        let formulaire = $(this).closest('form');

        if (formulaire.valid()) {

            let prestataire_id = formulaire.find('#prestataire').val();
            let formule_police_id = formulaire.find('#formule_police').val();

            let formData = new FormData();
            let files = $('#fichier_tarif')[0].files;
            formData.append('fichier_tarif', files[0]);
            formData.append('prestataire_id', prestataire_id);
            formData.append('formule_police_id', formule_police_id);

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {

                    if (response.statut == 1) {

                        resetFields('#form_add_tarif_prestataire_client');

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning("Erreur lors de l'enregistrement");
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {
            notifyWarning("Veuillez joindre un fichier svp");
        }

    });


    $(document).on("click", ".btn_supprimer_tarif_specifique", function (e) {
        let tarif_id = $(this).data('tarif_specifique_id');
        let href = $(this).data('href');

        //demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment supprimer ce tarif ?',
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
                            data: { tarif_id: tarif_id },
                            success: function (response) {

                                if (response.statut == 1) {

                                    notifySuccess(response.message, function () {
                                        location.reload();
                                    });

                                } else {
                                    notifyWarning("Erreur lors de la suppression du tarif");
                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur lors du traitement");
                            }

                        });

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

    });

    // PRESCRIPTEUR

    $(document).on("click", ".btn_retirer_prescripteur", function () {

        console.warn('btn retirer clicked !');

        let ce_bouton = $(this);
        let href = $(this).data('href');

        //demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment retirer ce prescripteur ?',
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
                            success: function (response) {

                                if (response.statut == 1) {

                                    location.href = '';

                                } else {
                                    notifyWarning(response.message);
                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur lors du retrait du prescripteur");
                            }

                        });

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
    });

    //

    $(document).on("click", ".btn_modifier_prescripteur", function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        $('#olea_std_dialog_box').load(href, function () {

            AppliquerMaskSaisie();

            $('#modifier_modal_prescripteur .dataTable:not(.customDataTable_)').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'desc']],
                lengthMenu: [
                    [100],
                    [100],
                ],
                searching: false,
                lengthChange: false,
            });

            let i = 0;
            $('.dropzone_area').each(function (myElement) {
                let zone_id = $(this).attr('id');
                let href = $(this).attr('action');

                let dropzone = new Dropzone("#" + zone_id, { url: href, dictDefaultMessage: "" });

            });

            $('#modifier_modal_prescripteur').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modifier_modal_prescripteur').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            $('#modifier_modal_prescripteur').modal();

        });


    });

    //

    $(document).on("click", "#btn_update_prescripteur", function (e) {

        e.preventDefault();
        console.log("Modification de prescripteur");
        let formulaire = $('#form_update_prescripteur');

        if (formulaire.valid()) {

            let n = noty({

                text: 'Voulez-vous modifier ce prescripteur ?',
                type: 'warning',
                dismissQueue: true,
                layout: 'center',
                theme: 'defaultTheme',
                buttons: [

                    {
                        addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {

                            $noty.close();

                            $.ajax({
                                type: 'post',
                                url: formulaire.attr('action'),
                                data: formulaire.serialize(),
                                success: function (response) {

                                    if (response.statut == 1) {

                                        resetFields('#form_update_prescripteur');

                                        notifySuccess(response.message, function () {
                                            location.reload();
                                        });

                                    } else {
                                        notifyWarning(response.message);
                                    }

                                },
                                error: function (request, status, error) {

                                    notifyWarning("Erreur lors de l'enregistrement");
                                }

                            });

                        }

                    },

                ]

            });

        } else {

            notifyWarning("Veuillez renseigner correctement le formulaire");

        }

    });
    // FIN PRESCRIPTEUR

    //FIN GESTION PRESTATAIRE

    //GESTION DES RESEAUX DE SOINS

    $(document).on("click", "#btn_save_reseau_soin", function (e) {
        e.preventDefault();

        let formulaire = $('#form_add_reseau_soin');

        if (formulaire.valid()) {

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        resetFields('#form_add_reseau_soin');

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });


    //afficher le modal de modification
    $(document).on("click", ".btn_modifier_reseau_soin", function (e) {
        e.preventDefault();

        href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            $('#modal_modifier_reseau_soin').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal_modifier_reseau_soin').find('.modal-dialog').addClass('modal-lg');

            $('#modal_modifier_reseau_soin').modal();

        });

    });


    $(document).on("click", "#btn_update_reseau_soin", function (e) {
        e.preventDefault();

        let formulaire = $('#form_update_reseau_soin');

        if (formulaire.valid()) {

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        resetFields('#form_update_reseau_soin');

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });



    //afficher le modal pour joindre des prestataires à un réseau de soins
    $(document).on("click", "#btn_modal_joindre_prestataires", function (e) {
        e.preventDefault();

        href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            $('#modal_joindre_prestataires').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal_joindre_prestataires').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            $('#modal_joindre_prestataires').modal();

        });

    });


    //a la fermeture du dialog, rafraichir la page
    $("#modal_joindre_prestataires").on("hidden.bs.modal", function () {
        location.href = '';
    });


    $(document).on("click", ".btn_integrer_prestataire", function () {
        let ce_bouton = $(this);
        let href = $(this).data('href');

        //confirmation obtenu
        $.ajax({
            type: 'post',
            url: href,
            success: function (response) {

                if (response.statut == 1) {

                    ce_bouton.replaceWith('<span class="badge badge-success"><i class="fa fa-check"></i> Intégré</span>');

                } else {
                    notifyWarning(response.message);
                }

            },
            error: function (request, status, error) {

                notifyWarning("Erreur lors de l'enregistrement");
            }

        });

    });

    $(document).on("click", ".btn_retirer_prestataire", function () {
        let ce_bouton = $(this);
        let href = $(this).data('href');

        //demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment retirer ce prestataire du réseau de soins ?',
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
                            success: function (response) {

                                if (response.statut == 1) {

                                    location.href = '';

                                } else {
                                    notifyWarning(response.message);
                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur lors du retrait du prestataire du réseau de soins");
                            }

                        });

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


    });
    //


    //GESTION TARIFS

    //afficher le détail d'un sinistre
    $(document).on("click", ".btn-popup_details_tarif", function (e) {
        e.preventDefault();

        href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            $('#modal-details_tarif').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-details_tarif').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            $('#modal-details_tarif').modal();

        });

    });

    // IMPORT TARIFS

    $(document).on("click", "#btn_importer_tarifs_bureau", function (e) {
        e.preventDefault();

        let btn_importer_tarifs_bureau = $(this);

        let formulaire = $(this).closest('form');

        if (formulaire.valid()) {

            let formData = new FormData();
            let files = $('#fichier_import_tarif')[0].files;
            formData.append('fichier_import_tarif', files[0]);

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formData,
                processData: false,
                contentType: false,
                beforeSend: function () {
                    $('#loading_gif').show();
                    btn_importer_tarifs_bureau.hide();
                },
                success: function (response) {

                    if (response.statut == 1) {

                        resetFields('#form_importer_tarifs_bureau');

                        $('#loading_gif').hide();
                        btn_importer_tarifs_bureau.show();

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {

                        $('#loading_gif').hide();
                        btn_importer_tarifs_bureau.show();

                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {
                    $('#loading_gif').hide();
                    btn_importer_tarifs_bureau.show();
                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {
            notifyWarning("Veuillez joindre un fichier svp");
        }

    });

    //FIN GESTION TARIS


    //******************** GLOBALS ********************//





    // PHARMACIE
    $(document).on('keydown', '#numero_carte_pharmacie', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            performSearchAlimentPharmacie($(event.target));
        }
    });
    // recherche patient par numero_carte
    $(document).on("click", "#btnSearchAssurePharmacie", function (e) {
        performSearchAlimentPharmacie($(this));
    });


    function performSearchAlimentPharmacie(element) {
        let formulaire = element.closest('form');
        var action = formulaire.attr('action');
        //  var numero_carte = $("#numero_carte_pharmacie").val();
        var numero_carte = $("#numero_carte_pharmacie").val().trim();

        $.ajax({
            type: 'post',
            url: action,
            data: { numero_carte: numero_carte },
            success: function (response) {

                console.log(response);
                if (response.statut == 1) {

                    location.href = response.redirect;

                } else {
                    notifyWarning(response.message);
                }

            },
            error: function (request, status, error) {

                notifyWarning("Erreur lors du traitement");
            }

        });

    }

    // Sélectionnez le modal
    var modal = $('#AddMedication');
    // Sélectionnez le bouton de fermeture du modal
    var closeButton = $('.close');
    var closeModalButton = $('.closeModal');

    var combinedSelection = closeButton.add(closeModalButton);
    // Ajoutez un gestionnaire d'événement pour fermer le modal
    combinedSelection.click(function () {
        // Exécutez votre script ici
        console.log('Modal fermé');
        location.reload();

        // Fermez le modal
        modal.hide();
    });


    $(document).on("click", '#btn_save_sinistre_medicament', function (e) {
        btn_save_sinistre_medicament = $(this);

        btn_save_sinistre_medicament.prop('disabled', true);

        let formulaire = $('#formSaveMedication');
        var formserialize = formulaire.serialize();

        if (formulaire.valid()) {
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formserialize,
                success: function (response) {

                    if (response.statut == 1) {
                        // $('#btn_save_sinistre_medicament').prop('disabled', false);
                        var row = '<tr>' +
                            '<td>' + response.data.medicament + '</td>' +
                            '<td style="text-align:center">' + response.data.qte_demande + '</td>' +
                            '<td style="text-align:center">' + response.data.qte_servie + '</td>' +
                            '<td style="text-align:center">' + response.data.prix_unitaire + '</td>' +
                            '<td style="text-align:center">' + response.data.prix_total + '</td>' +
                            '<td style="text-align:center">' + response.data.part_assureur + '</td>' +
                            '<td style="text-align:center">' + response.data.part_assure + '</td>' +
                            '<td><span class="badge badge-' + response.data.statut + '">' + response.data.statut + '</span></td>' +
                            '<td class="text-center">' +
                            '<a  class="btn text-gray"><i class="fas fa-lock"></i></a>' +
                            '</td>' +
                            '</tr>';

                        $('#medicament_table').append(row);
                        notifySuccess(response.message, function () {
                            $('.liste_medicament').val([]).trigger('change');
                            $('#formSaveMedication').find('#qte_medicament, #prix_unitaire_medicament').val('');
                            // resetFields('#formSaveMedication');
                            // location.reload();

                            btn_save_sinistre_medicament.removeAttr('disabled');

                        });

                    } else {
                        notifyWarning(response.message, function () {
                            btn_save_sinistre_medicament.removeAttr('disabled');
                        });
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement", function () {
                        btn_save_sinistre_medicament.removeAttr('disabled');
                    });
                }
            });

        } else {
            //$('label.error').css({display:'none',height:'0px'}).removeClass('error').text('');

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {

                console.log('Id: ' + index + ' Message: ' + value);

            });

            notifyWarning('Veuillez renseigner correctement le forumulaire', function () {
                $('#btn_save_sinistre_medicament').removeAttr('disabled');
            });

        }



    });



    $(document).on("click", '.btn_update_medicament_sinistre', function (e) {
        btn_update_medicament_sinistre = $(this);

        btn_update_medicament_sinistre.prop('disabled', true);

        let formulaire = $(this).closest('form');
        var formserialize = formulaire.serialize();

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formserialize,
                success: function (response) {

                    if (response.statut == 1) {
                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message, function () {
                            btn_update_medicament_sinistre.removeAttr('disabled');
                        });
                    }

                },
                error: function (request, status, error) {
                    notifyWarning("Erreur lors de l'enregistrement", function () {
                        btn_update_medicament_sinistre.removeAttr('disabled');
                    });
                }
            });

        } else {

            let validator = formulaire.validate();

            $.each(validator.errorMap, function (index, value) {

                console.log('Id: ' + index + ' Message: ' + value);

            });

            notifyWarning('Veuillez renseigner correctement le forumulaire', function () {
                $('#btn_save_sinistre_medicament').removeAttr('disabled');
            });

        }

    });



    //suppression de sinistre medicament
    $(document).on("click", ".btn_supprimer_sinistre", function (e) {
        let sinistre_id = $(this).data("sinistre_id");
        let href = $(this).data("href");
        let libelle = $(this).data("libelle");

        let n = noty({
            text: 'Voulez-vous vraiment supprimer ' + libelle + ' ?',
            type: 'warning',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'Supprimer', onClick: function ($noty) {
                        $noty.close();

                        //confirmation obtenu
                        $.ajax({
                            type: 'post',
                            url: href,
                            data: { sinistre_id: sinistre_id },
                            success: function (response) {

                                if (response.statut == 1) {

                                    notifySuccess(response.message, function () {
                                        location.reload();
                                    });

                                } else {
                                    notifyWarning(response.response);
                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur lors du traitement");
                            }

                        });

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
    });

    $(document).on("click", "#CloseTheBs", function (e) {

        dossier_sinistre_id = $(this).data("dossier_sinistre_id");
        href = $(this).data("close_dossier_sinistre_href");

        let n = noty({
            text: 'Voulez-vous cloturer cette feuille de soin ?',
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
                            data: { dossier_sinistre_id: dossier_sinistre_id },
                            success: function (response) {

                                if (response.statut == 1) {

                                    notifySuccess(response.message, function () {
                                        location.reload();

                                    });

                                } else {
                                    notifyWarning(response.response);
                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur lors du traitement");
                            }

                        });

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
    });


    // FIN PHARMACIE


    //Added on 25112023 05:18
    //MODULE SINISTRE
    //AJOUT DES MEDICAMENTS SUR UN DOSSIER SINISTRE EXISTANT PAR LES GESTIONNAIRES

    //afficher le popup
    $(document).on("click", "#btn-popup_add_medicament_gestionnaire", function (e) {
        e.preventDefault();

        href = $(this).data('href');


        $('#olea_std_dialog_box').load(href, function () {

            $('#modal_add_medicament').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal_add_medicament').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //appliquer datatable
            $('#table_medicaments_gestionnaire').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'asc']],
                paging: false,
                searching: false,
                lengthChange: false,
            });

            //
            $('#modal_add_medicament_gestionnaire').modal();

        });


    });


    //Ajout du médicament
    $(document).on("click", "#btn_save_medicament_gestionnaire", function (e) {

        let formulaire = $('#form_add_medicament_gestionnaire');
        if (formulaire.valid()) {

            $.ajax({
                type: 'POST',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    //notifySuccess(response.message);

                    $('#quantite').val("1");
                    $('#prix_unitaire').val("0");
                    //$('#medicament_id').prop('selectedIndex',0);
                    $('#medicament_id').val(null).trigger('change');


                    //table_medicaments
                    medicament = response.data;
                    let t = $('#table_medicaments_gestionnaire').DataTable();

                    t.row.add([
                        medicament.libelle,
                        '<span style="text-align:right"display:block;>' + medicament.taux_couverture + ' %</span>',
                        medicament.qte_servie,
                        medicament.prix_unitaire,
                        medicament.prix_total,
                        medicament.part_assureur,
                        medicament.depassement,
                        medicament.part_assure,
                        medicament.actions_html,
                    ])
                        .draw(false);

                },
                error: function (error) {
                    notifyWarning("Erreur lors du traitement");
                }
            });

        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });


    //Suppression d'un médicament de la session
    $(document).on("click", ".btnSupprimerLigneMedicamentGestionnaire", function (e) {
        let ligne_acte = $(this).closest('tr');
        let href = $(this).data('href');
        //let medicament_id = $(this).data('medicament_id');
        let medicamentLibelle = ligne_acte.find('td:first').text();

        $.ajax({
            type: 'post',
            url: href,
            success: function (response) {
                ligne_acte.remove();

                let t = $('#table_medicaments_gestionnaire').DataTable();

                // Trouver la ligne correspondante dans le DataTable et la supprimer
                t.rows().every(function (rowIdx, tableLoop, rowLoop) {
                    let rowData = this.data();
                    if (rowData[0] === medicamentLibelle) {
                        this.remove().draw(false);
                        return false; // Sortir de la boucle après la suppression
                    }
                    return true; // Continuer à parcourir les lignes
                });


            },
            error: function () {
                notifyWarning("Erreur lors de la suppression");
            }
        });
    });


    //valider pour enregistrer l'ensemble
    $(document).on("click", "#btn_save_sinistre_medicament_gestionnaire", function (e) {
        let href = $(this).data('href');

        $.ajax({
            type: 'post',
            url: href,
            data: $('#form_add_medicament_gestionnaire').serialize(),
            success: function (response) {

                if (response.statut == 1) {
                    notifySuccess(response.message, function () {
                        location.reload();
                    });

                } else {
                    notifyWarning(response.message);
                }

            },
            error: function () {
                notifyWarning("Erreur lors de l'enregistrement");
            }
        });

    });



    //FIN AJOUT DES MEDICAMENTS SUR UN DOSSIER EXISTANT PAR LES GESTIONNAIRES




    // C0NTROLE SUR LE PARAMETRAGE DU BAREME DE GARANTIE

    $(document).on("change", "#form_add_bareme #rubrique", function () {
        let rubrique_id = $(this).val();

        if (rubrique_id == '') {
            $('#form_add_bareme #plafond_rubrique').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_acte').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_sous_rubrique').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_regroupement_acte').attr('readonly', 'readonly');
        } else {
            $('#form_add_bareme #plafond_rubrique').removeAttr('readonly');
            $('#form_add_bareme #plafond_acte').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_sous_rubrique').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_regroupement_acte').attr('readonly', 'readonly');
        }

    });

    $(document).on("change", "#form_add_bareme #sous_rubrique", function () {
        let sous_rubrique_id = $(this).val();

        if (sous_rubrique_id == '') {
            $('#form_add_bareme #plafond_sous_rubrique').attr('readonly', 'readonly');
        } else {
            $('#form_add_bareme #plafond_sous_rubrique').removeAttr('readonly');
            $('#form_add_bareme #plafond_acte').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_rubrique').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_regroupement_acte').attr('readonly', 'readonly');
        }

    });

    $(document).on("change", "#form_add_bareme #regroupement_acte", function () {
        let regroupement_acte_id = $(this).val();

        if (regroupement_acte_id == '') {
            $('#form_add_bareme #plafond_regroupement_acte').attr('readonly', 'readonly');
        } else {
            $('#form_add_bareme #plafond_regroupement_acte').removeAttr('readonly');
            $('#form_add_bareme #plafond_acte').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_rubrique').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_sous_rubrique').attr('readonly', 'readonly');
        }

    });

    $(document).on("change", "#form_add_bareme #sous_regroupement_acte", function () {
        let sous_regroupement_acte_id = $(this).val();

        if (sous_regroupement_acte_id == '') {
            $('#form_add_bareme #plafond_sous_regroupement_acte').attr('readonly', 'readonly');
        } else {
            $('#form_add_bareme #plafond_sous_regroupement_acte').removeAttr('readonly');
            $('#form_add_bareme #plafond_acte').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_rubrique').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_sous_rubrique').attr('readonly', 'readonly');
        }

    });

    $(document).on("change", "#form_add_bareme #acte", function () {
        let acte_id = $(this).val();

        if (acte_id == '') {
            $('#form_add_bareme #plafond_rubrique').removeAttr('readonly');
            $('#form_add_bareme #plafond_acte').attr('readonly', 'readonly');
        } else {
            $('#form_add_bareme #plafond_acte').removeAttr('readonly');
            $('#form_add_bareme #plafond_rubrique').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_sous_rubrique').attr('readonly', 'readonly');
            $('#form_add_bareme #plafond_regroupement_acte').attr('readonly', 'readonly');
        }

    });

    // FIN DU C0NTROLE SUR LE PARAMETRAGE DU BAREME DE GARANTIE


    //CONTROLE DU TRAITEMENT DE REMBOURSEMENT
    // Sélectionner/désélectionner | APPROUVER OU REJETER DES ACTES
    $(document).on("click", ".libelle_btnSelectAllRemboursements", function (e) {
        $("#btnSelectAllRemboursements").trigger("click");
    });

    $(document).on("click", "#btnSelectAllRemboursements", function (e) {
        var isChecked = $(this).prop('checked');
        $('#card_liste_remboursements .select-row:not(:disabled)').prop('checked', isChecked);

        let total_checked = $('#card_liste_remboursements .select-row:checked:not(:disabled)').length;
        if (total_checked > 0) {
            $('.btnActionDesRemboursements').removeAttr('disabled');
        } else {
            $('.btnActionDesRemboursements').attr('disabled', 'true');
        }

    });

    // Vérifier si toutes les lignes sont sélectionnées pour cocher le bouton "Sélectionner tout"
    $(document).on("change", "#card_liste_remboursements .select-row", function (e) {
        let cpt_selected = 0;

        let total_not_disabled = $('#card_liste_remboursements .select-row:not(:disabled)').length;
        let total_checked = $('#card_liste_remboursements .select-row:checked:not(:disabled)').length;

        // Cacher ou afficher le groupe de boutons en fonction de la sélection
        if (total_not_disabled === total_checked) {
            $('#btnSelectAllRemboursements').prop('checked', true);
        } else {
            $('#btnSelectAllRemboursements').prop('checked', false);
        }

        if (total_checked > 0) {
            $('.btnActionDesRemboursements').removeAttr('disabled');
        } else {
            $('.btnActionDesRemboursements').attr('disabled', 'disabled');
        }
    });

    //FIN DU TRAITEMENT DE REMBOURSEMENT



    // DEBUT ACTE

    $(document).on("click", ".btn-popup_details_acte", function (e) {
        e.preventDefault();

        href = $(this).data('href');

        $('#olea_std_dialog_box').load(href, function () {

            $('#modal-details_acte').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-details_acte').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            $('#modal-details_acte').modal();

        });

    });


    $(document).on("click", "#btn_save_acte", function (e) {
        e.preventDefault();

        let formulaire = $('#form_add_acte');

        if (formulaire.valid()) {

            //confirmation obtenu
            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        resetFields('#form_add_acte');

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {
            console.log('form not valid -> notifyWarning should appear !');
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });

    //Modifier un acte modal
    $(document).on("click", ".btn_modifier_acte", function () {

        let model_name = $(this).attr('data-model_name');
        let modal_title = $(this).attr('data-modal_title');
        let href = $(this).attr('data-href');

        //let dialog_box = $("<div>").addClass('olea_std_dialog_box').appendTo('body');

        $('#olea_std_dialog_box').load(href, function () {

            //appliquer le mask de saisie sur les champs montant
            AppliquerMaskSaisie();

            $('#modifier_modal_acte .dataTable:not(.customDataTable_)').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json"
                },
                order: [[0, 'desc']],
                lengthMenu: [
                    [100],
                    [100],
                ],
                searching: false,
                lengthChange: false,
            });

            let i = 0;
            $('.dropzone_area').each(function (myElement) {
                let zone_id = $(this).attr('id');
                let href = $(this).attr('action');

                let dropzone = new Dropzone("#" + zone_id, { url: href, dictDefaultMessage: "" });

            });

            $('#modifier_modal_acte').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modifier_modal_acte').find('.modal-dialog').addClass('modal-xl').removeClass('modal-lg');

            //
            $('#modifier_modal_acte').modal();

        });
    });

    $(document).on("click", "#btn_update_acte", function (e) {

        e.preventDefault();
        console.log("Modification du l'acte");
        let formulaire = $('#form_update_acte');

        if (formulaire.valid()) {

            let n = noty({

                text: 'Voulez-vous modifier cet acte ?',
                type: 'warning',
                dismissQueue: true,
                layout: 'center',
                theme: 'defaultTheme',
                buttons: [

                    {
                        addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {

                            $noty.close();

                            $.ajax({
                                type: 'post',
                                url: formulaire.attr('action'),
                                data: formulaire.serialize(),
                                success: function (response) {

                                    if (response.statut == 1) {

                                        resetFields('#form_update_acte');

                                        notifySuccess(response.message, function () {
                                            location.reload();
                                        });

                                    } else {
                                        notifyWarning(response.message);
                                    }

                                },
                                error: function (request, status, error) {

                                    notifyWarning("Erreur lors de l'enregistrement");
                                }

                            });

                        }

                    },

                ]

            });

        } else {

            notifyWarning("Veuillez renseigner correctement le formulaire");

        }

    });

    // ADD NEW ACTE_TARIF
    $(document).on("click", "#btn_save_acte_tarif", function (e) {

        e.preventDefault();

        let formulaire = $('#form_add_acte_tarif');

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: formulaire.attr('action'),
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        resetFields('#form_add_acte_tarif');

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {
                        notifyWarning(response.message);
                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {
            notifyWarning("Veuillez renseigner correctement le formulaire");
        }

    });

    // DESACTIVER ACTE_TARIF

    $(document).on("click", ".btn_desactiver_acte_tarif", function () {

        let ce_bouton = $(this);
        let href = $(this).data('href');

        let n = noty({
            text: 'Voulez-vous vraiment désactiver ce tarif ?',
            type: 'warning',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                        $noty.close();

                        $.ajax({
                            type: 'post',
                            url: href,
                            success: function (response) {

                                if (response.statut == 1) {

                                    notifySuccess(response.message, function () {
                                        location.reload();
                                    });
                                } else {
                                    notifyWarning(response.message);
                                }

                            },
                            error: function (request, status, error) {

                                notifyWarning("Erreur lors de désactivaton du tarif");
                            }

                        });

                    }
                },
                {
                    addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                        $noty.close();
                    }
                }
            ]
        });

    });

    // FIN ACTE


    // MISSING CODE JS
    // ADD MEMBRE FAMILLE D'UN BENEFICIAIRE
    $(document).on('click', "#btn_save_membre_famille_beneficiaire", function () {

        let formulaire = $('#form_add_membre_famille_beneficiaire');
        let href = formulaire.attr('action');

        $.validator.setDefaults({ ignore: [] });

        let formData = new FormData();
        let files = $('#form_add_membre_famille_beneficiaire #photo')[0].files;

        if (formulaire.valid()) {

            if (files.length > 0) {
                formData.append('photo', files[0]);
            }

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

                        let aliment = response.data;

                        let t = $('#table_famille').DataTable();

                        //  console.log(JSON.stringify(aliment));

                        //Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        notifySuccess(response.message);
                        location.reload();

                    } else {

                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for (field in errors) {
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-beneficiaire .alert .message').html(errors_list_to_display);

                        $('#modal-beneficiaire .alert ').fadeTo(2000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-warning');

                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

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


    $(document).on("keypress", "input[type=number]", function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

        return true;
    });


    function isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

        return true;
    }


    function resetFields(formulaire) {

        //$(formulaire + " input[type=text]:not(.notreset)").val("");
        $(formulaire + " input:not(.notreset)").val("");
        $(formulaire + " input[type=number]:not(.notreset)").val("");
        $(formulaire + " input[type=date]:not(.notreset)").val("");
        $(formulaire + " input[type=email]:not(.notreset)").val("");
        $(formulaire + " select:not(.notreset)").prop('selectedIndex', 0);

    }



    function AppliquerMaskSaisie() {

        $('.money_field_avec_virgule').inputmask({
            alias: 'numeric',
            groupSeparator: ' ',
            autoGroup: true,
            digits: 2,
            digitsOptional: false,
            prefix: '',
            rightAlign: false,
            allowMinus: false,
            placeholder: '0',
            removeMaskOnSubmit: true
        });

        $('.money_field_only_positive').inputmask({
            alias: 'numeric',
            groupSeparator: ' ',
            autoGroup: true,
            digits: 0,
            digitsOptional: false,
            prefix: '',
            rightAlign: false,
            allowMinus: false,
            placeholder: '0',
            removeMaskOnSubmit: true
        });

        $('.float_field_only_positive').inputmask({
            alias: 'numeric',
            groupSeparator: '',
            autoGroup: true,
            digits: 2,
            digitsOptional: true,
            prefix: '',
            rightAlign: false,
            allowMinus: false,
            placeholder: '0.00',
            removeMaskOnSubmit: true,
            onBeforePaste: function (pastedValue) {
                // Convertir la valeur collée en format numérique
                return pastedValue.replace(',', '.'); // Remplacer la virgule par un point si nécessaire
            }
        });


        //appliquer le mask de saisie sur les champs montant
        Inputmask("currency", {
            prefix: "",
            groupSeparator: " ",//désactiver pour
            alias: "numeric",
            digits: 0,// nombre de caractère après la virgule
            onKeyDown: function (event) {
                var key = event.keyCode || event.charCode;

                // Empêcher la saisie du signe négatif
                if (key === 189 || key === 109) { // Les codes 189 et 109 correspondent au signe moins (-)
                    event.preventDefault();
                    return false;
                }
            }
        }).mask('.money_field');

        Inputmask("currency", {
            prefix: "",
            groupSeparator: " ",//désactiver pour
            alias: "numeric",
            digits: 0,// nombre de caractère après la virgule
            onKeyDown: function (event) {
                var key = event.keyCode || event.charCode;

                // Empêcher la saisie du signe négatif
                if (key === 189 || key === 109) { // Les codes 189 et 109 correspondent au signe moins (-)
                    event.preventDefault();
                    return false;
                }
            }
        }).mask('.total_autres_taxes');

        //appliquer le mask de saisie sur les champs montant
        Inputmask("currency", {
            prefix: "",
            groupSeparator: " ",//désactiver pour
            alias: "numeric",
            digits: 0,// nombre de caractère après la virgule
            onKeyDown: function (event) {
                var key = event.keyCode || event.charCode;

                // Empêcher la saisie du signe négatif
                /*
                if (key === 189 || key === 109) { // Les codes 189 et 109 correspondent au signe moins (-)
                    event.preventDefault();
                    return false;
                }
                */
            }
        }).mask('.money_field_negative');

        /*
        new Cleave('.money_field', {
            numeral: true,
            numeralThousandsGroupStyle: 'thousand'
            //delimiter: ' ',
        });
        alert("cleve init");


        if ($('.money_field').length > 0) {

           AutoNumeric.multiple('.money_field', {
              currencySymbol: '',
              digitGroupSeparator: ' ',
              decimalCharacter: '.',
              decimalPlaces: 0
            });

        }
        */

    }
    AppliquerMaskSaisie();



    var my_noty;//variale global pour pouvoir le fermer de popup de l'extérieur
    function notifySuccess(message, fnCallback) {
        my_noty = noty({
            text: message,
            type: 'success',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'OK', onClick: function ($noty) {

                        if (typeof fnCallback === 'function') fnCallback();

                        $noty.close();
                    }
                }
            ]
        });
    }

    function notifyWarning(message, fnCallback) {
        if (my_noty) {
            my_noty.close();
        }

        my_noty = noty({
            text: message,
            type: 'warning',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'OK', onClick: function ($noty) {

                        if (typeof fnCallback === 'function') fnCallback();

                        $noty.close();
                    }
                }
            ]
        });

    }

    function notifyError(message, fnCallback) {
        my_noty = noty({
            text: message,
            type: 'error',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'OK', onClick: function ($noty) {

                        if (typeof fnCallback === 'function') fnCallback();

                        $noty.close();
                    }
                }
            ]
        });
    }

    function notifyInfo(message, fnCallback) {
        my_noty = noty({
            text: message,
            type: 'info',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-info', text: 'OK', onClick: function ($noty) {

                        if (typeof fnCallback === 'function') fnCallback();

                        $noty.close();
                    }
                }
            ]
        });
    }

    function addInputAlphaNumValidation(inputSelector, errorId) {
        var previousValue = ""; // Déclarer previousValue en dehors de la fonction
        $(inputSelector).on("input", function () {
            var inputValue = $(this).val();
            // var alphanumericRegex = /^[a-zA-Z0-9]*$/;
            var alphanumericRegex = /^[a-zA-Z0-9\/\-_]*$/;
            var errorMessage = $("#" + errorId);

            if (!alphanumericRegex.test(inputValue)) {
                errorMessage.css("display", "block");
                $(this).val(previousValue);
                setTimeout(function () {
                    errorMessage.css("display", "none");
                }, 5000);
            } else {
                previousValue = inputValue;
                errorMessage.css("display", "none");
            }
        });
    }

    $(document).ready(function () {
        addInputAlphaNumValidation(".alpha_num_input", "error-message");
    });
});

$(document).ready(function () {

    function getCSRFToken() {
        let csrfToken = null;
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            if (key === 'csrftoken') {
                csrfToken = value;
            }
        });
        return csrfToken;
    }

    const csrf_token = getCSRFToken();

    // Masquer les onglets spécifiques au chargement
    $('#garantie-tab, #risque-tab, #aliment-tab, #vehicule-tab, #marchandise-tab').addClass('d-none');

    // Gérer le changement de produit
    $("#produit").on('change', function () {
        // Récupérer les données de l'option sélectionnée
        let produit_id = $(this).val();
        let typeproduit_id = $(this).find('option:selected').data('typeproduit_id');
        let branche_code = $(this).find('option:selected').data('branche_code');

        // Masquer les onglets spécifiques par défaut
        $('#garantie-tab, #risque-tab, #aliment-tab, #vehicule-tab, #marchandise-tab').addClass('d-none');

        // Réinitialiser les champs obligatoires
        $('.aliment_champ_obligatoire').removeAttr('required');
        $('.marchandise_champ_obligatoire').removeAttr('required');

        // Logique pour afficher les onglets en fonction des conditions
        if (typeproduit_id == 1) {

            // Effacer les lignes existantes du tableau
            const tbody = $('#table_liste_aliment tbody');
            tbody.empty();

            $('#garantie-tab').removeClass('d-none');

            if (branche_code == 100991) {
                $('#vehicule-tab').removeClass('d-none');
                $('.aliment_champ_obligatoire').attr('required', true);
            }
            if (branche_code == 100992) {
                $('#aliment-tab').removeClass('d-none');
                $('.aliment_champ_obligatoire').prop('required', false);
                $('.money_field').prop('disabled', false);
            }
            if ([101004, 101005].includes(branche_code)) {
                $('#marchandise-tab').removeClass('d-none');
                $('.marchandise_champ_obligatoire').prop('required', false);
                $('.money_field').prop('disabled', false);
            }

        } else if (typeproduit_id == 2) {
            $('#risque-tab').removeClass('d-none');
            $('.aliment_champ_obligatoire').prop('required', false);
            $('.money_field').prop('disabled', false);
        }
    });

    // Pour le téléchargement du fichier modèle de création d'aliment
    $('#telecharger_modele').on('click', function () {
        // Récupérer le chemin du fichier depuis l'attribut "download-fichier"
        const filePath = $(this).attr('download-fichier');

        // Vérifier l'existence du fichier via une requête fetch
        fetch(filePath, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // Si le fichier existe, déclencher le téléchargement
                    const link = document.createElement('a');
                    link.href = filePath;
                    link.download = filePath.split('/').pop();
                    link.click();
                } else {
                    // Si le fichier n'existe pas, afficher un message d'erreur
                    alert('Le fichier demandé est introuvable.');
                }
            })
            .catch(error => {
                // Gérer les erreurs réseau ou autres
                console.error('Erreur lors de la vérification du fichier:', error);
                alert('Une erreur est survenue. Veuillez réessayer plus tard.');
            });
    });

    // Apporteur
    function on_change_apporteur(response, mode) {
        let modal_id = mode === 'modification' ? '#modal-modification_police' : '#modal-police';
        let box_id = mode === 'modification' ? '#test_modification' : '#test';
        let total_id = mode === 'modification' ? '#total_commission_intermediaire_modification' : '#total_commission_intermediaire';

        if (response === 'OUI') {
            if ($(`${modal_id} ${box_id}`).length) {
                $(`${modal_id} ${box_id}`).show();
                $(`${modal_id} ${box_id} input, ${modal_id} ${box_id} select, ${modal_id} ${box_id} textarea`).attr('required', true);
            } else {
                console.error(`Element ${box_id} not found in ${modal_id}`);
            }
        } else {
            if ($(`${modal_id} ${box_id}`).length) {
                $(`${modal_id} ${box_id}`).hide();
                $(`${modal_id} ${box_id} input, ${modal_id} ${box_id} select, ${modal_id} ${box_id} textarea`).val('').removeAttr('required');
                $(`${modal_id} ${total_id}`).val('0');
            } else {
                console.error(`Element ${box_id} not found in ${modal_id}`);
            }
        }
    }

    // Attachement des événements pour les boutons radio apporteur
    $(document).on("change", "#modal-police input[name='apporteur']", function () {
        let response = $(this).val();
        on_change_apporteur(response, 'creation');
    });

    $(document).on("change", "#modal-modification_police input[name='apporteur']", function () {
        let response = $(this).val();
        on_change_apporteur(response, 'modification');
    });

    // Initialisation pour le mode modification
    $(document).ready(function () {
        let apporteur_response_modification = $("#modal-modification_police input[name='apporteur']:checked").val();
        if (apporteur_response_modification) {
            on_change_apporteur(apporteur_response_modification, 'modification');
        }

        let apporteur_response_creation = $("#modal-police input[name='apporteur']:checked").val();
        if (apporteur_response_creation) {
            on_change_apporteur(apporteur_response_creation, 'creation');
        }
    });

    function on_change_garantie(response, mode) {
        let modal_id = mode === 'modification' ? '#modal-modification_police' : '#modal-police';
        let box_id = mode === 'modification' ? '#test_garantie_modification' : '#test_garantie';
        let formule_id = mode === 'modification' ? '#formule_block_modification' : '#formule_block';

        if (response === 'OUI') {
            if ($(`${modal_id} ${box_id}`).length && $(`${modal_id} ${formule_id}`).length) {
                $(`${modal_id} ${box_id}`).show();
                $(`${modal_id} ${formule_id}`).show();
                $(`${modal_id} ${box_id} input`).show();
            } else {
                console.error(`Elements ${box_id} or ${formule_id} not found in ${modal_id}`);
            }
        } else {
            if ($(`${modal_id} ${box_id}`).length && $(`${modal_id} ${formule_id}`).length) {
                $(`${modal_id} ${box_id}`).hide();
                $(`${modal_id} ${formule_id}`).hide();
                $(`${modal_id} ${box_id} input`).val('').removeAttr('required');
            } else {
                console.error(`Elements ${box_id} or ${formule_id} not found in ${modal_id}`);
            }
        }
    }

    // Attachement des événements pour les boutons radio garantie
    $(document).on("change", "#modal-police input[name='garantie']", function () {
        let response = $(this).val();
        on_change_garantie(response, 'creation');
    });

    $(document).on("change", "#modal-modification_police input[name='garantie']", function () {
        let response = $(this).val();
        on_change_garantie(response, 'modification');
    });

    // Initialisation pour le mode modification
    $(document).ready(function () {
        let garantie_response_modification = $("#modal-modification_police input[name='garantie']:checked").val();
        if (garantie_response_modification) {
            on_change_garantie(garantie_response_modification, 'modification');
        }

        let garantie_response_creation = $("#modal-police input[name='garantie']:checked").val();
        if (garantie_response_creation) {
            on_change_garantie(garantie_response_creation, 'creation');
        }
    });


    function chargementGarantiesFormuleTable(formuleId) {
        // Efface le contenu existant du tableau sauf l'entête
        $("#table_garantie_police tbody").empty();

        // Effacer tout message précédent
        $('#garantie-message-error').text('').hide();
        $('#garantie-message-warning').text('').hide();

        // Vérifie qu'un ID produit a été sélectionné
        if (!formuleId) {
            return;
        }

        // Appel AJAX pour récupérer les garanties liées au produit
        $.ajax({
            url: "/production/get_garanties_by_formule/",
            type: "GET",
            data: { formule_id: formuleId },
            success: function (data) {
                if (data && data.garanties) {
                    // Parcourt les garanties et les ajoute dans le tableau
                    data.garanties.forEach((garantie, index) => {
                        let row = `
                            <tr>
                                <td style="vertical-align:middle;">
                                    <input type="checkbox" class="form-control garantie-checkbox" name="garantie_${garantie.id}" value="${garantie.id}" style="width: 1rem; height: 1.25rem;">
                                </td>
                                <td style="vertical-align:middle;">${garantie.nom}</td>
                                <td style="vertical-align:middle;padding:5px;">
                                    <input type="text" class="form-control form-control-sm franchise-input" name="franchise_${garantie.id}" value="" onkeypress="isInputNumber(event)" oninput="formatMontant(this)" disabled>
                                </td>
                                <td style="vertical-align:middle;padding:5px;">
                                    <input type="text" class="form-control form-control-sm capital-input" name="capital_${garantie.id}" value="" onkeypress="isInputNumber(event)" oninput="formatMontant(this)" disabled>
                                </td>
                            </tr>
                        `;
                        $("#table_garantie_police tbody").append(row);
                    });
                } else {
                    $('#garantie-message-warning').text('Aucune garantie trouvée pour ce produit.').show();
                    setTimeout(() => $('#garantie-message-error').fadeOut(), 5000);
                }
            },
            error: function (xhr, status, error) {
                $('#message-error').text(response.error || 'Erreur lors de la récupération des garanties.').show();
                setTimeout(() => $('#garantie-message-error').fadeOut(), 5000);
            },
        });

    }

    // Événement sur le changement de la formule sélectionnée
    $("#formule").change(function () {
        let formuleId = $(this).find(":selected").data("formule_id");
        if (formuleId) {
            chargementGarantiesFormuleTable(formuleId);
        }
    });

    // Surveiller les changements des cases à cocher
    $(document).on('change', '.garantie-checkbox', function () {
        // Récupérer la ligne parente (tr) de la case cochée/décochée
        const parentRow = $(this).closest('tr');

        // Trouver les champs franchise et capital associés
        const franchiseInput = parentRow.find('.franchise-input');
        const capitalInput = parentRow.find('.capital-input');

        if ($(this).is(':checked')) {
            // Activer les champs si la case est cochée
            franchiseInput.prop('disabled', false);
            capitalInput.prop('disabled', false);
        } else {
            // Désactiver et vider les champs si la case est décochée
            franchiseInput.prop('disabled', true).val('');
            capitalInput.prop('disabled', true).val('');
        }
    });

    // Lorsque le modal est complètement fermé
    $('#modal-police').on('hidden.bs.modal', function () {
        $.ajax({
            url: '/production/clear_session/',
            type: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            success: function (response) {
                if (response.success) {
                    console.log(response.message);
                } else {
                    console.error(response.error || 'Erreur lors de la suppression de la session.');
                }
            },
            error: function () {
                console.error('Erreur de communication avec le serveur.');
            }
        });
    });

    // Fonction pour récupérer le CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    $("#importation_aliment").on("click", function () {
        const inputFichier = $("#fichier_aliment");
        const fichier = inputFichier.prop("files")[0];

        if (!fichier) {
            inputFichier.css("border-color", "red");
            $("#message-warning").text("Veuillez sélectionner un fichier.").delay(5000).fadeOut();
            return;
        }

        inputFichier.css("border-color", "");

        const formData = new FormData();
        formData.append("fichier_aliment", fichier);

        $.ajax({
            url: "/production/import-excel-aliments/",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            success: function (response) {
                if (response.success) {
                    // Réinitialiser tous les champs du formulaire
                    $("#fichier_aliment").trigger("reset");
                    $("#message-success").text(response.message).show().delay(5000).fadeOut();
                    console.log(response.data);
                    // Mettre à jour le tableau avec les nouvelles données
                    const tbody = $("#table_liste_aliment tbody");
                    response.data.forEach((row, index) => {
                        tbody.append(`
                            <tr data-index="${index}">
                                <td>
                                    <button class="btn btn-danger btn-sm" onclick="supprimerAliment(${index})">
                                        <i class="fa fa-trash-o"></i>
                                    </button>
                                </td>
                                <td>${row.immat || ''}</td>
                                <td>${row.marque || ''}</td>
                                <td>${row.modele || ''}</td>
                                <td>${row.T_categorie_id || ''}</td>
                                <td>${row.date_entree || ''}</td>
                                <td>${row.proprietaire || ''}</td>
                                <td>${row.conducteur || ''}</td>
                            </tr>
                        `);
                    });

                    $('#fichier_aliment').removeClass('is-valid').removeClass('is-invalid');

                } else {
                    $("#message-warning").text(response.message).delay(5000).fadeOut();
                }
            },
            error: function (xhr) {
                // Gérer les erreurs 500 ou autres erreurs inattendues
                const response = xhr.responseJSON;
                if (xhr.status === 500) {
                    $("#message-error").text(response?.message || "Une erreur interne du serveur est survenue. Veuillez réessayer plus tard.").show().delay(5000).fadeOut();
                } else if (xhr.status === 400) {
                    $("#message-warning").text(response?.message || "Erreur dans les données soumises. Veuillez vérifier votre fichier.").show().delay(5000).fadeOut();
                } else {
                    $("#message-error").text(response?.message || "Une erreur inattendue est survenue. Veuillez réessayer.").show().delay(5000).fadeOut();
                }
            },
        });
    });


    $('#btn_save_police_aliment').on('click', function () {
        // Supprimer les erreurs précédentes
        $('.mod_aliment_champ_obligatoire').removeClass('is-invalid').removeClass('is-valid');
        $('#message-modal-error').text('').hide();
        $('#message-modal-warning').text('').hide();
        $('#message-modal-success').text('').hide();

        // Valider les champs obligatoires
        let valide = true;
        $('.mod_aliment_champ_obligatoire').each(function () {
            if (!$(this).val().trim()) {
                $(this).addClass('is-invalid'); // Ajouter classe invalide
                valide = false;
            } else {
                $(this).removeClass('is-invalid').addClass('is-valid'); // Ajouter classe valide
            }
        });

        if (!valide) {
            // Afficher un message si un champ obligatoire est vide
            $('#message-modal-error').text('Veuillez remplir tous les champs obligatoires.').show();
            setTimeout(() => $('#message-modal-error').fadeOut(), 5000);
            return;
        }

        // Récupérer les données du formulaire
        const formData = new FormData($('#form_add_police_aliment')[0]);

        // Requête Ajax pour envoyer les données au backend
        $.ajax({
            url: '/production/import-formulaire-aliments/',
            type: 'POST',
            data: formData,
            processData: false, // Indique que nous envoyons un FormData
            contentType: false, // Pour ne pas encoder les données
            success: function (response) {
                if (response.success) {
                    // Afficher le message de succès
                    $("#message-modal-success").text(response.message).show().delay(5000).fadeOut();

                    // Mettre à jour le tableau avec les nouvelles données
                    const tbody = $("#table_liste_aliment tbody");
                    response.data.forEach((row, index) => {
                        tbody.append(`
                            <tr data-index="${index}">
                                <td>
                                    <button class="btn btn-danger btn-sm" onclick="supprimerAliment(${index})">
                                        <i class="fa fa-trash-o"></i>
                                    </button>
                                </td>
                                <td>${row.immat || ''}</td>
                                <td>${row.marque || ''}</td>
                                <td>${row.modele || ''}</td>
                                <td>${row.T_categorie_id || ''}</td>
                                <td>${row.date_entree || ''}</td>
                                <td>${row.proprietaire || ''}</td>
                                <td>${row.conducteur || ''}</td>
                            </tr>
                        `);
                    });

                    // Réinitialiser tous les champs du formulaire
                    $("#form_add_police_aliment").trigger("reset");
                    $("#form_add_police_aliment select").prop('selectedIndex', 0);
                    $('.mod_aliment_champ_obligatoire').removeClass('is-valid').removeClass('is-invalid');

                } else {
                    // Afficher un message d'avertissement
                    $("#message-modal-warning").text(response.message).show().delay(5000).fadeOut();
                }
            },
            error: function (xhr) {
                // Gérer les erreurs 500 ou autres erreurs inattendues
                const response = xhr.responseJSON;
                if (xhr.status === 500) {
                    $("#message-modal-error").text(response?.message || "Une erreur interne du serveur est survenue. Veuillez réessayer plus tard.").show().delay(5000).fadeOut();
                } else if (xhr.status === 400) {
                    $("#message-modal-warning").text(response?.message || "Erreur dans les données soumises. Veuillez vérifier votre fichier.").show().delay(5000).fadeOut();
                } else {
                    $("#message-modal-error").text(response?.message || "Une erreur inattendue est survenue. Veuillez réessayer.").show().delay(5000).fadeOut();
                }
            },
        });
    });


    $(document).on('click', '.btn-danger', function () {
        const index = $(this).closest('tr').data('index');
        supprimerAliment(index);
    });

    // Fonction pour supprimer un aliment via AJAX en utilisant l'index
    function supprimerAliment(index) {
        $.ajax({
            url: `/production/supprimer_aliment/${index}/`,
            type: 'POST',
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            success: function (response) {
                if (response.success) {
                    // Si la suppression est réussie, supprime la ligne correspondante du tableau
                    $(`tr[data-index="${index}"]`).remove();
                } else {
                    console.error(response.error || 'Erreur lors de la suppression.');
                }
            },
            error: function () {
                console.error('Erreur de communication avec le serveur.');
            }
        });
    }

    //Changement de branche, charger les produits liés
    $('#branche').on('change', function () {

        let branche_id = $(this).val();
        $('#produit').html('<option value="">---------------------------</option>');

        $.ajax({
            type: 'get',
            url: '/production/branche/' + branche_id + '/produits',
            success: function (produits) {

                $('#produit').html('').append('<option value="">Sélectionnez un produit</option>');

                produits.forEach(function (produit) {
                    $('#produit').append('<option value="' + produit.pk + '">' + produit.fields.libelle + '</option>');
                });

            },
            error: function () { }
        });
    });

    // Initialisation lors du chargement de la page
    $("#typecompagnie").val("");
    $(".box_typecompagnie").hide();
    $("#box_compagnie").hide();
    $("#compagnie_id").empty().append('<option value="">Choisir</option>');

    // Gestion du changement dans le champ "compagnie"
    $("#compagnie").on("change", function () {
        const selectedCompagnieId = $(this).val();

        if (selectedCompagnieId) {
            // Si une compagnie est choisie, afficher le champ "Autre assureur"
            $(".box_typecompagnie").show();
            $("#typecompagnie").val("");
            $("#box_compagnie").hide();
            $("#compagnie_id").empty().append('<option value="">Choisir</option>');
        } else {
            // Si aucune compagnie n'est choisie, cacher le champ "Autre assureur" et réinitialiser
            $(".box_typecompagnie").hide();
            $("#typecompagnie").val("");
            $("#box_compagnie").hide();
            $("#compagnie_id").empty().append('<option value="">Choisir</option>');
        }
    });

    // Gestion du changement dans le champ "typecompagnie"
    $("#typecompagnie").on("change", function () {
        const selectedTypeId = $(this).val();
        const selectedCompagnieId = $("#compagnie").val();

        if (selectedTypeId) {
            // Si un type de compagnie est sélectionné, afficher les compagnies associées
            $("#box_compagnie").show();
            $.ajax({
                url: "/production/get_compagnies/",
                method: "GET",
                data: {
                    type_id: selectedTypeId,
                    compagnie_id: selectedCompagnieId
                },
                success: function (response) {
                    const compagnieSelect = $("#compagnie_id");
                    compagnieSelect.empty().append('<option value="">Choisir</option>');

                    // Ajouter les options retournées par l'API
                    response.compagnies.forEach(function (compagnie) {
                        compagnieSelect.append(`<option value="${compagnie.id}">${compagnie.nom}</option>`);
                    });
                },
                error: function () {
                    alert("Une erreur est survenue lors du chargement des compagnies.");
                }
            });
        } else {
            // Réinitialiser si aucun type n'est sélectionné
            $("#box_compagnie").hide();
            $("#compagnie_id").empty().append('<option value="">Choisir</option>');
        }
    });

    // Rendre le champ "compagnie_id" non obligatoire si la liste est masquée
    $("form").on("submit", function () {
        if ($("#box_compagnie").is(":hidden")) {
            $("#compagnie_id").prop("required", false);
        } else {
            $("#compagnie_id").prop("required", true);
        }
    });

    $(document).on("keyup change", "#modal-police .calculs_marchandise_montant_police", function (event) {

        if (event.which == 13) {
            event.preventDefault();
        }

        calculer_montant_marchandise_police();

    });

    function calculer_montant_marchandise_police() {

        // Récupération des valeurs saisies
        let valeur_assuree = parseInt($('#modal-police #valeur_assuree').val().replaceAll(' ', ''));
        let taux_risque_ordinaire = parseInt($('#modal-police #taux_risque_ordinaire').val().replaceAll(' ', ''));
        let taux_risque_guerre = parseInt($('#modal-police #taux_risque_guerre').val().replaceAll(' ', ''));
        let taux_supprime = parseInt($('#modal-police #taux_supprime').val().replaceAll(' ', ''));
        let taux_reduction_commerciale = parseInt($('#modal-police #taux_reduction_commerciale').val().replaceAll(' ', ''));
        let taux_taxe = parseInt($('#modal-police #taux_taxe').val().replaceAll(' ', ''));
        let accessoires = parseInt($('#modal-police #accessoires').val().replaceAll(' ', ''));
        let autres_frais = parseInt($('#modal-police #autres_frais').val().replaceAll(' ', ''));

        if (isNaN(valeur_assuree)) { valeur_assuree = 0; }
        if (isNaN(taux_risque_ordinaire)) { taux_risque_ordinaire = 0; }
        if (isNaN(taux_risque_guerre)) { taux_risque_guerre = 0; }
        if (isNaN(taux_supprime)) { taux_supprime = 0; }
        if (isNaN(taux_reduction_commerciale)) { taux_reduction_commerciale = 0; }
        if (isNaN(taux_taxe)) { taux_taxe = 0; }
        if (isNaN(accessoires)) { accessoires = 0; }
        if (isNaN(autres_frais)) { autres_frais = 0; }

        // Calcul des valeurs saisies
        let prime_risque_ordinaire = (taux_risque_ordinaire / 100) * valeur_assuree;
        let prime_risque_guerre = (taux_risque_guerre / 100) * valeur_assuree;
        let prime_supprime = (taux_supprime / 100) * valeur_assuree;
        let prime_brut = prime_risque_ordinaire + prime_risque_guerre + prime_supprime;
        let prime_reduction = (taux_reduction_commerciale / 100) * prime_brut;
        let total_taxe = (taux_taxe / 100) * prime_brut;
        let prime_ttc_mar = (prime_brut - prime_reduction) + total_taxe + accessoires + autres_frais;

        console.log('valeur_assuree', valeur_assuree);
        console.log('taux_risque_ordinaire', taux_risque_ordinaire);
        console.log('prime_risque_ordinaire', prime_risque_ordinaire);
        console.log('taux_risque_guerre', taux_risque_guerre);
        console.log('prime_risque_guerre', prime_risque_guerre);
        console.log('prime_supprime', prime_supprime);
        console.log('prime_risque_guerre', prime_risque_guerre);
        console.log('prime_brut', prime_brut);
        console.log('taux_reduction_commerciale', taux_reduction_commerciale);
        console.log('prime_reduction', prime_reduction);
        console.log('total_taxe', total_taxe);
        console.log('accessoires', accessoires);
        console.log('autres_frais', autres_frais);
        console.log('prime_ttc_mar', prime_ttc_mar);

        $('#modal-police #prime_risque_ordinaire').val(prime_risque_ordinaire);
        $('#modal-police #prime_risque_guerre').val(prime_risque_guerre);
        $('#modal-police #prime_supprime').val(prime_supprime);
        $('#modal-police #prime_brut').val(prime_brut);
        $('#modal-police #prime_reduction').val(prime_reduction);
        $('#modal-police #total_taxe').val(total_taxe);
        $('#modal-police #prime_ttc_mar').val(prime_ttc_mar);
    }

    $(document).on("keyup change", "#modal-marchandise_add .calculs_add_marchandise_montant_police", function (event) {

        if (event.which == 13) {
            event.preventDefault();
        }

        calculer_montant_add_marchandise_police();

    });

    function calculer_montant_add_marchandise_police() {

        // Récupération des valeurs saisies
        let valeur_assuree = parseInt($('#modal-marchandise_add #valeur_assuree').val().replaceAll(' ', ''));
        let taux_risque_ordinaire = parseInt($('#modal-marchandise_add #taux_risque_ordinaire').val().replaceAll(' ', ''));
        let taux_risque_guerre = parseInt($('#modal-marchandise_add #taux_risque_guerre').val().replaceAll(' ', ''));
        let taux_supprime = parseInt($('#modal-marchandise_add #taux_supprime').val().replaceAll(' ', ''));
        let taux_reduction_commerciale = parseInt($('#modal-marchandise_add #taux_reduction_commerciale').val().replaceAll(' ', ''));
        let taux_taxe = parseInt($('#modal-marchandise_add #taux_taxe').val().replaceAll(' ', ''));
        let accessoires = parseInt($('#modal-marchandise_add #accessoires').val().replaceAll(' ', ''));
        let autres_frais = parseInt($('#modal-marchandise_add #autres_frais').val().replaceAll(' ', ''));

        if (isNaN(valeur_assuree)) { valeur_assuree = 0; }
        if (isNaN(taux_risque_ordinaire)) { taux_risque_ordinaire = 0; }
        if (isNaN(taux_risque_guerre)) { taux_risque_guerre = 0; }
        if (isNaN(taux_supprime)) { taux_supprime = 0; }
        if (isNaN(taux_reduction_commerciale)) { taux_reduction_commerciale = 0; }
        if (isNaN(taux_taxe)) { taux_taxe = 0; }
        if (isNaN(accessoires)) { accessoires = 0; }
        if (isNaN(autres_frais)) { autres_frais = 0; }

        // Calcul des valeurs saisies
        let prime_risque_ordinaire = (taux_risque_ordinaire / 100) * valeur_assuree;
        let prime_risque_guerre = (taux_risque_guerre / 100) * valeur_assuree;
        let prime_supprime = (taux_supprime / 100) * valeur_assuree;
        let prime_brut = prime_risque_ordinaire + prime_risque_guerre + prime_supprime;
        let prime_reduction = (taux_reduction_commerciale / 100) * prime_brut;
        let total_taxe = (taux_taxe / 100) * prime_brut;
        let prime_ttc_mar = (prime_brut - prime_reduction) + total_taxe + accessoires + autres_frais;

        console.log('valeur_assuree', valeur_assuree);
        console.log('taux_risque_ordinaire', taux_risque_ordinaire);
        console.log('prime_risque_ordinaire', prime_risque_ordinaire);
        console.log('taux_risque_guerre', taux_risque_guerre);
        console.log('prime_risque_guerre', prime_risque_guerre);
        console.log('prime_supprime', prime_supprime);
        console.log('prime_risque_guerre', prime_risque_guerre);
        console.log('prime_brut', prime_brut);
        console.log('taux_reduction_commerciale', taux_reduction_commerciale);
        console.log('prime_reduction', prime_reduction);
        console.log('total_taxe', total_taxe);
        console.log('accessoires', accessoires);
        console.log('autres_frais', autres_frais);
        console.log('prime_ttc_mar', prime_ttc_mar);

        $('#modal-marchandise_add #prime_risque_ordinaire').val(prime_risque_ordinaire);
        $('#modal-marchandise_add #prime_risque_guerre').val(prime_risque_guerre);
        $('#modal-marchandise_add #prime_supprime').val(prime_supprime);
        $('#modal-marchandise_add #prime_brut').val(prime_brut);
        $('#modal-marchandise_add #prime_reduction').val(prime_reduction);
        $('#modal-marchandise_add #total_taxe').val(total_taxe);
        $('#modal-marchandise_add #prime_ttc_mar').val(prime_ttc_mar);
    }

    $(document).on("keyup change", "#modal-modification_marchandise .calculs_marchandise_montant_police_modification", function (event) {

        if (event.which == 13) {
            event.preventDefault();
        }

        calculer_montant_marchandise_modification();

    });

    function calculer_montant_marchandise_modification() {

        let valeur_assuree = parseInt($('#modal-modification_marchandise #valeur_assuree_modification').val().replaceAll(' ', ''));
        let taux_risque_ordinaire = parseInt($('#modal-modification_marchandise #taux_risque_ordinaire_modification').val().replaceAll(' ', ''));
        let taux_risque_guerre = parseInt($('#modal-modification_marchandise #taux_risque_guerre_modification').val().replaceAll(' ', ''));
        let taux_supprime = parseInt($('#modal-modification_marchandise #taux_supprime_modification').val().replaceAll(' ', ''));
        let taux_reduction_commerciale = parseInt($('#modal-modification_marchandise #taux_reduction_commerciale_modification').val().replaceAll(' ', ''));
        let taux_taxe = parseInt($('#modal-modification_marchandise #taux_taxe_modification').val().replaceAll(' ', ''));
        let accessoires = parseInt($('#modal-modification_marchandise #accessoires_modification').val().replaceAll(' ', ''));
        let autres_frais = parseInt($('#modal-modification_marchandise #autres_frais_modification').val().replaceAll(' ', ''));

        if (isNaN(valeur_assuree)) { valeur_assuree = 0; }
        if (isNaN(taux_risque_ordinaire)) { taux_risque_ordinaire = 0; }
        if (isNaN(taux_risque_guerre)) { taux_risque_guerre = 0; }
        if (isNaN(taux_supprime)) { taux_supprime = 0; }
        if (isNaN(taux_reduction_commerciale)) { taux_reduction_commerciale = 0; }
        if (isNaN(taux_taxe)) { taux_taxe = 0; }
        if (isNaN(accessoires)) { accessoires = 0; }
        if (isNaN(autres_frais)) { autres_frais = 0; }

        // Calcul des valeurs saisies
        let prime_risque_ordinaire = (taux_risque_ordinaire / 100) * valeur_assuree;
        let prime_risque_guerre = (taux_risque_guerre / 100) * valeur_assuree;
        let prime_supprime = (taux_supprime / 100) * valeur_assuree;
        let prime_brut = prime_risque_ordinaire + prime_risque_guerre + prime_supprime;
        let prime_reduction = (taux_reduction_commerciale / 100) * prime_brut;
        let total_taxe = (taux_taxe / 100) * prime_brut;
        let prime_ttc_mar = (prime_brut - prime_reduction) + total_taxe + accessoires + autres_frais;

        console.log('valeur_assuree', valeur_assuree);
        console.log('taux_risque_ordinaire', taux_risque_ordinaire);
        console.log('prime_risque_ordinaire', prime_risque_ordinaire);
        console.log('taux_risque_guerre', taux_risque_guerre);
        console.log('prime_risque_guerre', prime_risque_guerre);
        console.log('prime_supprime', prime_supprime);
        console.log('prime_risque_guerre', prime_risque_guerre);
        console.log('prime_brut', prime_brut);
        console.log('taux_reduction_commerciale', taux_reduction_commerciale);
        console.log('prime_reduction', prime_reduction);
        console.log('total_taxe', total_taxe);
        console.log('accessoires', accessoires);
        console.log('autres_frais', autres_frais);
        console.log('prime_ttc_mar', prime_ttc_mar);

        $('#modal-modification_marchandise #prime_risque_ordinaire_modification').val(prime_risque_ordinaire);
        $('#modal-modification_marchandise #prime_risque_guerre_modification').val(prime_risque_guerre);
        $('#modal-modification_marchandise #prime_supprime_modification').val(prime_supprime);
        $('#modal-modification_marchandise #prime_brut_modification').val(prime_brut);
        $('#modal-modification_marchandise #prime_reduction_modification').val(prime_reduction);
        $('#modal-modification_marchandise #total_taxe_modification').val(total_taxe);
        $('#modal-modification_marchandise #prime_ttc_mar_modification').val(prime_ttc_mar);
    }

    const searchInput = $('#search_all');
    const suggestionsBox = $('#suggestions');

    // Écouteur sur la saisie
    searchInput.on('input', function () {
        const query = $(this).val().trim();

        if (query.length > 0) {
            // Faire une requête AJAX pour récupérer les suggestions
            $.ajax({
                url: `/api/suggestions`,
                method: 'GET',
                data: { numero: query },
                success: function (data) {
                    displaySuggestions(data);
                },
                error: function (xhr, status, error) {
                    console.error('Erreur lors de la récupération des suggestions:', error);
                }
            });
        } else {
            // Si aucune saisie, cacher les suggestions
            suggestionsBox.addClass('d-none');
        }
    });

    // Affiche les suggestions
    function displaySuggestions(data) {
        if (data.length > 0) {
            suggestionsBox.empty();
            $.each(data, function (index, item) {
                // Structure de l'affichage d'une suggestion
                const suggestion = $(`
                    <div class="list-group-item list-group-item-action">
                        <a href="${item.details_url}" class="btn btn-link p-0 text-dark" style="text-decoration:none" target="_blank">
                            N° Police :<strong>${item.numero_police}</strong> / Client : <strong>${item.client_nom}</strong>
                        </a>
                    </div>
                `).on('click', function () {
                    // Lorsqu'une suggestion est cliquée
                    searchInput.val(item.numero_police);
                    suggestionsBox.addClass('d-none');
                });
                suggestionsBox.append(suggestion);
            });
            suggestionsBox.removeClass('d-none');
        } else {
            suggestionsBox.html('<div class="list-group-item">Aucun résultat</div>');
            suggestionsBox.removeClass('d-none');
        }
    }

    // Cacher les suggestions lorsqu'on clique en dehors
    $(document).on('click', function (e) {
        if (!suggestionsBox.is(e.target) && !searchInput.is(e.target) && suggestionsBox.has(e.target).length === 0) {
            suggestionsBox.addClass('d-none');
        }
    });

    /*
    function toggleDisabledFields() {
        var valeurAssuree = parseFloat($('#valeur_assuree').val().replace(/,/g, ''));
        var disableFields = isNaN(valeurAssuree) || valeurAssuree === 0;

        // Sélectionne TOUS les champs à griser
        var fieldsToDisable = $('#taux_risque_ordinaire, #taux_risque_guerre, #taux_supprime, #taux_reduction_commerciale, #taux_taxe, #accessoires, #autres_frais');

        fieldsToDisable.prop('disabled', disableFields);

        if (disableFields) {
          fieldsToDisable.addClass('disabled-field');
          // Vide les champs si valeur_assuree est vide ou 0
          fieldsToDisable.val('');
        } else {
          fieldsToDisable.removeClass('disabled-field');
        }
    }

    // Initialisation au chargement de la page
    toggleDisabledFields();

    // Événement de changement sur le champ valeur_assuree
    $('#valeur_assuree').on('input', function() {
        toggleDisabledFields();
    }); */

    function toggleDisabledFields(prefix) {
        var valeurAssuree = parseFloat($('#valeur_assuree' + prefix).val().replace(/,/g, ''));
        var disableFields = isNaN(valeurAssuree) || valeurAssuree === 0;

        var fieldsToDisable = $(
            '#taux_risque_ordinaire' + prefix + ', ' +
            '#taux_risque_guerre' + prefix + ', ' +
            '#taux_supprime' + prefix + ', ' +
            '#taux_reduction_commerciale' + prefix + ', ' +
            '#taux_taxe' + prefix + ', ' +
            '#accessoires' + prefix + ', ' +
            '#autres_frais' + prefix
        );

        fieldsToDisable.prop('disabled', disableFields);

        if (disableFields) {
            fieldsToDisable.addClass('disabled-field');
            // Important : Vider les champs ici pour effacer les valeurs affichées
            fieldsToDisable.val('');
        } else {
            fieldsToDisable.removeClass('disabled-field');
        }
    }

    // Initialisation et gestion des événements pour les deux formulaires
    toggleDisabledFields("");
    $('#valeur_assuree').on('input', function() {
        toggleDisabledFields("");
    });

    toggleDisabledFields("_modification");
    $('#valeur_assuree_modification').on('input', function() {
        toggleDisabledFields("_modification");
    });

    // Récupérer les éléments
    const $yesRadio = $("#yes_garantie_modification");
    const $noRadio = $("#no_garantie_modification");
    const $garantieTableBody = $("#table_garantie_police_modification tbody");
    const $garantieTableContainer = $("#test_garantie_modification");
    const $formuleBlock = $("#formule_block_modification");

    // Fonction pour afficher ou masquer le tableau des garanties et le champ de formule
    function toggleGarantieTable() {
        if ($yesRadio.is(":checked")) {
            // Afficher le tableau et le champ de formule si OUI est sélectionné
            $garantieTableContainer.show(); // Afficher le conteneur du tableau
            $formuleBlock.show(); // Afficher le champ de choix de formule
        } else {
            // Si NON est sélectionné, vider le contenu du tableau, masquer le conteneur et le champ de formule
            $garantieTableBody.empty(); // Vider le contenu du tableau
            $garantieTableContainer.hide(); // Masquer le conteneur du tableau
            $formuleBlock.hide(); // Masquer le champ de choix de formule
        }
    }

    // Écouter les événements de clic sur les boutons radio
    $yesRadio.on("click", toggleGarantieTable);
    $noRadio.on("click", toggleGarantieTable);

    // Initialiser l'état du tableau et du champ de formule au chargement de la page
    toggleGarantieTable();

//---------------------------------BUSINESSUNIT-----------------------------------------------------
//ajouter un business unit


  $(document).on('click', "#btn_save_businessunit", function () {

    let formulaire = $('#form_add_business');
    let href = formulaire.attr('action');

    $.validator.setDefaults({ ignore: [] });

    let formData = new FormData();

    if (formulaire.valid()) {

        // Demander confirmation
        let n = noty({
            text: 'Voulez-vous vraiment enregistrer cette Business Unit ?',
            type: 'warning',
            dismissQueue: true,
            layout: 'center',
            theme: 'defaultTheme',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'OUI', onClick: function ($noty) {
                        $noty.close();

                        let data_serialized = formulaire.serialize();
                        $.each(data_serialized.split('&'), function (index, elem) {
                            let vals = elem.split('=');
                            let key = vals[0];
                            let valeur = decodeURIComponent(vals[1].replace(/\+/g, ' '));

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
                                       console.log("Succès détecté. Rechargement en cours...");
                                    // Réinitialiser le formulaire
                                    document.getElementById(formulaire.attr('id')).reset();

                                    // Fermer le modal
                                    $('#modal-business').modal('hide');

                                    // Notification de succès
                                    location.reload();


                                } else {
                                    // Afficher les erreurs renvoyées par le backend
                                    let errors = JSON.parse(JSON.stringify(response.errors));
                                    let errors_list_to_display = '';
                                    for (let field in errors) {
                                        errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                                    }

                                    $('#modal-business .alert .message').html(errors_list_to_display);

                                    $('#modal-business .alert').fadeTo(2000, 500).slideUp(500, function () {
                                        $(this).slideUp(500);
                                    }).removeClass('alert-success').addClass('alert-warning');
                                }

                            },
                            error: function (request, status, error) {
                                // Gestion des erreurs AJAX
                                notifyWarning("Erreur lors de l'enregistrement");
                            }
                        });
                    }
                },
                {
                    addClass: 'btn btn-danger', text: 'Annuler', onClick: function ($noty) {
                        // Confirmation refusée
                        $noty.close();
                    }
                }
            ]
        });
        // Fin demande confirmation

    } else {
        // Afficher les erreurs de validation
        let validator = formulaire.validate();
        $.each(validator.errorMap, function (index, value) {
            console.log('Id: ' + index + ' Message: ' + value);
        });

        notifyWarning('Veuillez renseigner correctement le formulaire');
    }

});



//Modifier businessunit

  //ouverture du dialog
    $(document).on("click", ".btn-modal-modifier_business", function () {

        let href = $(this).attr('data-href');

        $('#olea_std_dialog_box').load(href, function () {



            $('#modal-business-update').attr('data-backdrop', 'static').attr('data-keyboard', false);

            $('#modal-business-update').find('.modal-dialog').addClass('modal-m');

            $('#modal_business_update').modal();
        });

    });

    //Valider les modifications

//modification proprement dite
    $(document).on("click", "#btn_update_businessunit", function () {

        let formulaire = $(this).closest('form');
        let href = formulaire.attr('action');

        if (formulaire.valid()) {

            $.ajax({
                type: 'post',
                url: href,
                data: formulaire.serialize(),
                success: function (response) {

                    if (response.statut == 1) {

                        business = response.data;

                        //Vider le formulaire
                        resetFields('#' + formulaire.attr('id'));

                        notifySuccess(response.message, function () {
                            location.reload();
                        });

                    } else {

                        let errors = JSON.parse(JSON.stringify(response.errors));
                        let errors_list_to_display = '';
                        for (field in errors) {
                            errors_list_to_display += '- ' + ucfirst(field) + ' : ' + errors[field] + '<br/>';
                        }

                        $('#modal-business .alert .message').html(errors_list_to_display);

                        $('#modal-business .alert ').fadeTo(2000, 500).slideUp(500, function () {
                            $(this).slideUp(500);
                        }).removeClass('alert-success').addClass('alert-warning');

                    }

                },
                error: function (request, status, error) {

                    notifyWarning("Erreur lors de l'enregistrement");
                }

            });

        } else {

        $('label.error').css({ display: 'none', height: '0px' }).removeClass('error').text('');

        let validator = formulaire.validate();

        $.each(validator.errorMap, function (index, value) {

            console.log('Id: ' + index + ' Message: ' + value);

        });

            notifyWarning('Veuillez renseigner correctement le formulaire');
        }

    });




//Suppression d'un businessunit
 $(document).on('click', '.btn_supprimer_business', function () {
        let business_id = $(this).data('business_id');

        let n = noty({
            text: 'Voulez-vous vraiment supprimer ce businessunit ?',
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
                            url: '/configurations/businessunit/delete',
                            type: 'post',
                            data: { business_id: business_id },
                            success: function (e) {

                                location.reload();

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



