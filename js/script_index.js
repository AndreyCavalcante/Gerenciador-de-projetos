function alertaTemporario(mensagem, tempo) {
    $('#mensagemModal').text(mensagem);
    $('#meuModal').modal('show');

    setTimeout(function() {
             $('#meuModal').modal('hide');
    }, tempo);
}

const confirmacoes = {
    email: false
}

function validarEmail(){
    let emailInput = document.getElementById('email');
    let smallEmail = document.getElementById('smallEmail');

    let email = $('#email').val();

    $.ajax({
        url: 'php/manter_usuarios.php',
        method: 'POST',
        data: {form: 'verificarEmail', email: email},
        dataType: 'json',
        success: function(result){
            if (result === false){
                emailInput.style.borderColor = 'red';
                confirmacoes['email'] = false;
                smallEmail.style.color = 'red';
                smallEmail.innerText = 'Email não encontrado!';
            }else{
                emailInput.style.borderColor = 'green';
                smallEmail.innerText = '';
                confirmacoes['email'] = true;
            }

        },
        error: function(xhr, status, error){
            console.error(xhr.responseText);
            console.error(status);
            console.error(error);
        }
    });
}

$(document).on('submit', '#formIndex', function(e){
    e.preventDefault();

    validarEmail();

    let email = $('#email').val();
    let senha = $('#senha').val();

    if(confirmacoes['email'] === true){
        $.ajax({
            url: 'php/login.php',
            method: 'POST',
            data: {email: email, senha: senha},
            dataType: 'json',
            success: function(result){
                if(result === true){
                    window.location.href = 'perfil.php';
                }else{
                    alertaTemporario('Dados incorretos, tente novamente!', 3000);
                }
            },
            error: function(xhr, status, error){
                console.error(xhr.responseText);
                console.error(status);
                console.error(error);
            }
        });
    }else{
        alertaTemporario('Email inexistente ou inválido!', 3000);
        setTimeout( function(){
        }, 3000);
    }
});

document.getElementById('email').addEventListener('change', validarEmail);