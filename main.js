"use strict";
// Funktion zum Laden und Anzeigen der Daten als Tabelle
function ladeDaten() {
    $.ajax({
        url: 'http://localhost:3000/daten',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            let html = '<table>';
            html += '<tr><th>Name</th><th>Adresse</th><th>Ausbildung</th></tr>';
            data.forEach(function (person) {
                html += '<tr>' +
                    '<td>' + person.name + '</td>' +
                    '<td>' + person.adresse + '</td>' +
                    '<td>' + person.ausbildung + '</td>' +
                    '</tr>';
            });
            $('#ausgabe').html(html);
        },
        error: function () {
            $('#ausgabe').text('Fehler beim Laden der Daten.');
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
