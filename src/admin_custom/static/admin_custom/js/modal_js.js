$(document).ready(function() {

    // Fonction pour formater un montant en séparateurs de milliers
    function formatThousands(value) {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    function chargementGarantiesFormuleTableModification(formuleId) {
        $("#table_garantie_police_modification tbody").empty();

        $('#garantie-message-error').text('').hide();
        $('#garantie-message-warning').text('').hide();

        // Vérifie qu'un ID produit a été sélectionné
        if (!formuleId) {
            return;
        }

        let policeId = $("#police_id").val();

        // Appel AJAX pour récupérer les garanties liées au produit
        $.ajax({
            url: "/production/get_garanties_by_formule_modification/",
            type: "GET",
            data: { formule_id: formuleId, police_id: policeId },
            success: function (data) {
                if (data && data.garanties) {
                    data.garanties.forEach((garantie, index) => {
                        let row = `
                            <tr>
                                <td style="vertical-align:middle;">
                                    <input type="checkbox" class="form-control garantie-checkbox" name="garantie_${garantie.id}" value="${garantie.id}" style="width: 1rem; height: 1.25rem;" ${garantie.active ? 'checked' : ''}>
                                </td>
                                <td style="vertical-align:middle;">${garantie.nom}</td>
                                <td style="vertical-align:middle;padding:5px;">
                                    <input type="text" class="form-control form-control-sm franchise-input" name="franchise_${garantie.id}" value="${formatThousands(garantie.franchise)}" onkeypress="isInputNumber(event)" oninput="formatMontant(this)" ${garantie.active ? '' : 'disabled'}>
                                </td>
                                <td style="vertical-align:middle;padding:5px;">
                                    <input type="text" class="form-control form-control-sm capital-input" name="capital_${garantie.id}" value="${formatThousands(garantie.capital)}" onkeypress="isInputNumber(event)" oninput="formatMontant(this)" ${garantie.active ? '' : 'disabled'}>
                                </td>
                            </tr>
                        `;
                        $("#table_garantie_police_modification tbody").append(row);
                    });
                } else {
                    $('#garantie-message-warning').text('Aucune garantie trouvée pour cette formule.').show();
                    setTimeout(() => $('#garantie-message-warning').fadeOut(), 5000);
                }
            },
            error: function (xhr, status, error) {
                $('#message-error').text(response.error || 'Erreur lors de la récupération des garanties.').show();
                setTimeout(() => $('#garantie-message-error').fadeOut(), 5000);
            },
        });
    }

    // Événement sur le changement de la formule sélectionnée
    $("#formule_modification").change(function () {
        let formuleId = $(this).find(":selected").data("formule_id");
        if (formuleId) {
            chargementGarantiesFormuleTableModification(formuleId);
        }
    });

});