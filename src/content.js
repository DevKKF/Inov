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