;
$( document ).ready(function()
{
  
  var CODE_STATUSES = new Array();

  CODE_STATUSES[200] = 'Message envoyé avec succès';
  CODE_STATUSES[400] = 'Un des paramètres obligatoires est manquant';
  CODE_STATUSES[402] = 'Trop de SMS ont été envoyés en trop peu de temps';
  CODE_STATUSES[403] = "Le service n'est pas activé sur l'espace abonné, ou login / clé incorrect";
  CODE_STATUSES[403] = "Erreur côté serveur d'envoi, veuillez réessayer ultérieurement";
  CODE_STATUSES[500] = "Erreur fatale du serveur, veuillez me contacter";

  var RESULT_DIV = $('#result');

  var SMS_FORM = $('#sms_form');
  SMS_FORM.ajaxStart(function () {
    $(this).find(':input').prop('disabled', true);
  });
  SMS_FORM.ajaxStop(function () {
    $(this).find(':input').prop('disabled', false);
  });

  function rememberDetails() {
    localStorage.setItem("dest", $('input[name="dest"]:checked').val());
    localStorage.setItem("from", $('input[name="from"]').val());
  }

  function fillForm() {
    var dest = localStorage.getItem('dest');
    var from = localStorage.getItem('from');
    if (dest) {
      $('input[name="dest"][value=' + dest + ']').parent().button('toggle');
    }
    if (from) {
      $('input[name="from"]').val(from);
    }
  }

  function sendSMS()
  {
    $.ajax({
      url: 'send',
      type: 'POST',
      dataType: 'json',
      data: {
        text: $('textarea[name="content"]').val(),
        dest: $('input[name="dest"]:checked').val(),
        from: $('input[name="from"]').val()
      },
      complete: function() {
        $("#resultModal").modal();
      },
      success: function (json) {
        var message = CODE_STATUSES[json.code];
        if (message === undefined) {
          message = "Code de retour non connu";
        }
        RESULT_DIV.text(message);
        RESULT_DIV.removeClass();
        if (json.code === 200) {
          RESULT_DIV.addClass('alert alert-success text-center');
          // Clear the form
          $('textarea[name="content"]').val('');
        } else {
          RESULT_DIV.addClass('alert alert-danger text-center');
        }
        
      },
      error: function (xhr, status, errorThrown) {
        RESULT_DIV.text("Impossible d'envoyer le SMS, veuiller me contacter si le problème persiste");
        RESULT_DIV.removeClass();
        RESULT_DIV.addClass('alert alert-danger text-center');
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      }
    });
  }

  fillForm();
  $('#sms_form').submit(function (event) {
    sendSMS();
    // Remember details
    rememberDetails();
    event.preventDefault();
  });

});
