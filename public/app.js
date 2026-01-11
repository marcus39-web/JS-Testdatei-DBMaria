// jQuery Document Ready
$(document).ready(function() {
    console.log('jQuery geladen und bereit!');
    
    // Initial die Benutzerliste laden
    loadUsers();

    // Event-Handler für Formular-Absenden
    $('#userForm').on('submit', function(e) {
        e.preventDefault();
        saveUser();
    });

    // Event-Handler für Abbrechen-Button
    $('#cancelBtn').on('click', function() {
        resetForm();
    });

    // Event-Handler für Benutzer laden (JSON)
    $('#loadUsersBtn').on('click', function() {
        loadUsers();
    });

    // Event-Handler für Benutzer laden (XML)
    $('#loadUsersXmlBtn').on('click', function() {
        loadUsersXml();
    });

    // Event-Handler für Statistiken laden
    $('#loadStatsBtn').on('click', function() {
        loadStats();
    });
});

// Funktion zum Laden aller Benutzer (JSON mit AJAX)
function loadUsers() {
    $('#usersList').html('<div class="loading">Lade Benutzerdaten...</div>');
    
    $.ajax({
        url: '/api/users',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log('Benutzer erfolgreich geladen (JSON):', response);
            displayUsers(response.users);
        },
        error: function(xhr, status, error) {
            console.error('Fehler beim Laden der Benutzer:', error);
            showMessage('Fehler beim Laden der Benutzer: ' + error, 'error');
            $('#usersList').html('<div class="empty-state"><p>Fehler beim Laden der Daten</p></div>');
        }
    });
}

// Funktion zum Laden aller Benutzer (XML mit AJAX)
function loadUsersXml() {
    $('#usersList').html('<div class="loading">Lade Benutzerdaten (XML)...</div>');
    
    $.ajax({
        url: '/api/users/xml',
        method: 'GET',
        dataType: 'xml',
        success: function(xmlData) {
            console.log('Benutzer erfolgreich geladen (XML):', xmlData);
            
            // XML anzeigen
            displayXml(xmlData);
            
            // XML parsen und Benutzer extrahieren
            const users = [];
            $(xmlData).find('user').each(function() {
                const user = {
                    id: $(this).find('id').text(),
                    name: $(this).find('name').text(),
                    email: $(this).find('email').text(),
                    age: $(this).find('age').text(),
                    created_at: $(this).find('created_at').text()
                };
                users.push(user);
            });
            
            displayUsers(users);
            showMessage('Benutzer erfolgreich aus XML geladen!', 'success');
        },
        error: function(xhr, status, error) {
            console.error('Fehler beim Laden der Benutzer (XML):', error);
            showMessage('Fehler beim Laden der XML-Daten: ' + error, 'error');
            $('#usersList').html('<div class="empty-state"><p>Fehler beim Laden der XML-Daten</p></div>');
        }
    });
}

// Funktion zum Laden der Statistiken (XML)
function loadStats() {
    $('#statsDisplay').html('<div class="loading">Lade Statistiken...</div>');
    
    $.ajax({
        url: '/api/stats/xml',
        method: 'GET',
        dataType: 'xml',
        success: function(xmlData) {
            console.log('Statistiken erfolgreich geladen (XML):', xmlData);
            
            // XML anzeigen
            displayXml(xmlData);
            
            // Statistiken extrahieren
            const totalUsers = $(xmlData).find('totalUsers').text();
            const avgAge = $(xmlData).find('averageAge').text();
            
            // Statistiken anzeigen
            const statsHtml = `
                <p><strong>Gesamtanzahl Benutzer:</strong> ${totalUsers}</p>
                <p><strong>Durchschnittsalter:</strong> ${avgAge} Jahre</p>
            `;
            $('#statsDisplay').html(statsHtml);
            showMessage('Statistiken erfolgreich geladen!', 'info');
        },
        error: function(xhr, status, error) {
            console.error('Fehler beim Laden der Statistiken:', error);
            showMessage('Fehler beim Laden der Statistiken: ' + error, 'error');
            $('#statsDisplay').html('<p>Fehler beim Laden der Statistiken</p>');
        }
    });
}

// Funktion zum Anzeigen von Benutzern
function displayUsers(users) {
    if (!users || users.length === 0) {
        $('#usersList').html('<div class="empty-state"><p>Keine Benutzer vorhanden</p><p>Fügen Sie einen neuen Benutzer hinzu!</p></div>');
        return;
    }

    let html = '';
    users.forEach(function(user) {
        const age = user.age ? user.age + ' Jahre' : 'Nicht angegeben';
        html += `
            <div class="user-card" data-id="${user.id}">
                <div class="user-info">
                    <h3>${escapeHtml(user.name)}</h3>
                    <p><strong>E-Mail:</strong> ${escapeHtml(user.email)}</p>
                    <p><strong>Alter:</strong> ${age}</p>
                    <p><small>Erstellt: ${formatDate(user.created_at)}</small></p>
                </div>
                <div class="user-actions">
                    <button class="btn btn-edit" onclick="editUser(${user.id})">Bearbeiten</button>
                    <button class="btn btn-delete" onclick="deleteUser(${user.id})">Löschen</button>
                </div>
            </div>
        `;
    });

    $('#usersList').html(html);
}

// Funktion zum Speichern eines Benutzers (Erstellen oder Aktualisieren)
function saveUser() {
    const userId = $('#userId').val();
    const userData = {
        name: $('#name').val(),
        email: $('#email').val(),
        age: $('#age').val() || null
    };

    const isEdit = userId !== '';
    const url = isEdit ? `/api/users/${userId}` : '/api/users';
    const method = isEdit ? 'PUT' : 'POST';

    $.ajax({
        url: url,
        method: method,
        data: JSON.stringify(userData),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            console.log('Benutzer erfolgreich gespeichert:', response);
            showMessage(response.message, 'success');
            resetForm();
            loadUsers();
        },
        error: function(xhr, status, error) {
            console.error('Fehler beim Speichern des Benutzers:', error);
            const errorMsg = xhr.responseJSON ? xhr.responseJSON.error : error;
            showMessage('Fehler: ' + errorMsg, 'error');
        }
    });
}

// Funktion zum Bearbeiten eines Benutzers
function editUser(id) {
    $.ajax({
        url: `/api/users/${id}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            const user = response.user;
            $('#userId').val(user.id);
            $('#name').val(user.name);
            $('#email').val(user.email);
            $('#age').val(user.age || '');
            $('#submitBtn').text('Aktualisieren');
            $('#cancelBtn').show();
            
            // Zum Formular scrollen
            $('html, body').animate({
                scrollTop: $('#userForm').offset().top - 20
            }, 500);
        },
        error: function(xhr, status, error) {
            console.error('Fehler beim Laden des Benutzers:', error);
            showMessage('Fehler beim Laden des Benutzers', 'error');
        }
    });
}

// Funktion zum Löschen eines Benutzers
function deleteUser(id) {
    if (!confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
        return;
    }

    $.ajax({
        url: `/api/users/${id}`,
        method: 'DELETE',
        dataType: 'json',
        success: function(response) {
            console.log('Benutzer erfolgreich gelöscht:', response);
            showMessage(response.message, 'success');
            loadUsers();
        },
        error: function(xhr, status, error) {
            console.error('Fehler beim Löschen des Benutzers:', error);
            showMessage('Fehler beim Löschen: ' + error, 'error');
        }
    });
}

// Funktion zum Zurücksetzen des Formulars
function resetForm() {
    $('#userForm')[0].reset();
    $('#userId').val('');
    $('#submitBtn').text('Hinzufügen');
    $('#cancelBtn').hide();
}

// Funktion zum Anzeigen von Nachrichten
function showMessage(message, type) {
    const $messageBox = $('#messageBox');
    $messageBox.removeClass('success error info').addClass(type);
    $messageBox.text(message);
    $messageBox.fadeIn();
    
    setTimeout(function() {
        $messageBox.fadeOut();
    }, 3000);
}

// Funktion zum Anzeigen von XML
function displayXml(xmlData) {
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlData);
    const formattedXml = formatXml(xmlString);
    $('#xmlDisplay').text(formattedXml);
}

// Funktion zum Formatieren von XML
function formatXml(xml) {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;
    
    xml = xml.replace(reg, '$1\n$2$3');
    
    return xml.split('\n').map(function(node) {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/) && pad > 0) {
            pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }
        
        const padding = PADDING.repeat(pad);
        pad += indent;
        
        return padding + node;
    }).join('\n');
}

// Funktion zum Escapen von HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text ? text.replace(/[&<>"']/g, function(m) { return map[m]; }) : '';
}

// Funktion zum Formatieren von Datum
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE') + ' ' + date.toLocaleTimeString('de-DE');
}
