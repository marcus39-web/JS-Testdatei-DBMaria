"use strict";
// Funktion zum Laden und Anzeigen der Daten als Tabelle
function ladeDaten() {
    $.ajax({
        url: 'http://localhost:3000/daten',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            let html = '<table>';
            html += '<tr><th>Name</th><th>Adresse</th><th>Ausbildung</th><th>Aktion</th></tr>';
            data.forEach(function (person) {
                html += '<tr data-id="' + person.id + '">' +
                    '<td>' + person.name + '</td>' +
                    '<td>' + person.adresse + '</td>' +
                    '<td>' + person.ausbildung + '</td>' +
                    '<td>' +
                    '<button class="edit-btn">Ändern</button> '
                    + '<button class="delete-btn">Löschen</button>' +
                    '</td>' +
                    '</tr>';
            });
            $('#ausgabe').html(html);
            // Event-Handler für die neuen Buttons
            $('.delete-btn').off('click').on('click', function () {
                const id = $(this).closest('tr').data('id');
                if (confirm('Wirklich löschen?')) {
                    loescheDatensatz(id);
                }
            });
            $('.edit-btn').off('click').on('click', function () {
                const id = $(this).closest('tr').data('id');
                bearbeiteDatensatz(id);
            });
        },
        error: function () {
            $('#ausgabe').text('Fehler beim Laden der Daten.');
        }
    });
}

// Datensatz löschen
function loescheDatensatz(id) {
    $.ajax({
        url: 'http://localhost:3000/daten/' + id,
        type: 'DELETE',
        success: function () {
            ladeDaten();
        },
        error: function () {
            alert('Fehler beim Löschen!');
        }
    });
}

// Datensatz bearbeiten (Platzhalter, öffnet ein Prompt)
function bearbeiteDatensatz(id) {
    const $tr = $('tr[data-id="' + id + '"]');
    // Hole aktuelle Werte
    const name = $tr.find('td').eq(0).text();
    const adresse = $tr.find('td').eq(1).text();
    const ausbildung = $tr.find('td').eq(2).text();
    // Ersetze Zellen durch Input-Felder
    $tr.find('td').eq(0).html('<input type="text" class="edit-name" value="' + name + '">');
    $tr.find('td').eq(1).html('<input type="text" class="edit-adresse" value="' + adresse + '">');
    $tr.find('td').eq(2).html('<input type="text" class="edit-ausbildung" value="' + ausbildung + '">');
    // Ändere Button zu "Speichern"
    $tr.find('.edit-btn').text('Speichern').off('click').on('click', function () {
        speichereDatensatz(id);
    });
    // Optional: Löschen-Button deaktivieren während Bearbeitung
    $tr.find('.delete-btn').prop('disabled', true);
}

function speichereDatensatz(id) {
    const $tr = $('tr[data-id="' + id + '"]');
    const name = $tr.find('.edit-name').val();
    const adresse = $tr.find('.edit-adresse').val();
    const ausbildung = $tr.find('.edit-ausbildung').val();
    $.ajax({
        url: 'http://localhost:3000/daten/' + id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ name: name, adresse: adresse, ausbildung: ausbildung }),
        success: function () {
            ladeDaten();
        },
        error: function () {
            alert('Fehler beim Ändern!');
        }
    });
}


$(function () {
    // Beim Laden der Seite: Daten anzeigen
    ladeDaten();
    // Formular-Submit abfangen
    $('#addForm').on('submit', function (e) {
        e.preventDefault(); // Standardverhalten verhindern
        // AJAX-Request zum Einfügen der Daten
        $.ajax({
            url: 'http://localhost:3000/daten',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: $('#name').val(),
                adresse: $('#adresse').val(),
                ausbildung: $('#ausbildung').val()
            }),
            success: function () {
                // Nach erfolgreichem Einfügen: Daten neu laden und Formular leeren
                ladeDaten();
                $('#addForm')[0].reset();
            },
            error: function () {
                alert('Fehler beim Einfügen!');
            }
        });
    });
});
