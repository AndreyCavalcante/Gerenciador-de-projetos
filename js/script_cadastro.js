function alertaTemporario(mensagem, tempo) {
    $('#mensagemModal').text(mensagem);
    $('#meuModal').modal('show');

    setTimeout(function() {
             $('#meuModal').modal('hide');
    }, tempo);
}

const confirmações = {
    senha: false,
    email: false
}

function validarEmail(email){
    const regex = /^[^\s@]{8,}@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function confimarEmail(){
    let emailInput = document.getElementById('email');
    let smallEmail = document.getElementById('smallEmail');

    let email = emailInput.value;

    if (validarEmail(email)){    
        $.ajax({
            url: 'php/manter_usuarios.php',
            method: 'POST',
            data: {form: 'verificarEmail', email: email},
            dataType: 'json',
            success: function(result){
                if (result === false){
                    emailInput.style.borderColor = 'green';
                    confirmações['email'] = true;
                    smallEmail.innerText = '';
                }else{
                    emailInput.style.borderColor = 'red';
                    smallEmail.innerText = 'Email já existente';
                    smallEmail.style.color = 'red';
                    confirmações['email'] = false;
                }
            },
            error: function(xhr, status, error){
                console.error(xhr.reponseText);
                console.error(status);
                console.error(error);
            }
        });
    }else{
        emailInput.style.borderColor = 'red';
        smallEmail.innerText = 'Email inválido';
        smallEmail.style.color = 'red';
        confirmações['email'] = false;
    }
}

function confirmarSenha() {
    let senhaInput = document.getElementById('senha');
    let confirmarSenhaInput = document.getElementById('confirmarSenha');

    if (!senhaInput || !confirmarSenhaInput) {
        console.error("Elementos de senha não encontrados.");
        return;
    }

    let senha = senhaInput.value;
    let confirmar = confirmarSenhaInput.value;

    let input = document.getElementById('senha');
    let input2 = document.getElementById('confirmarSenha');
    let small = document.getElementById('smallConfirmar');

    if (senha === confirmar) {
        input.style.borderColor = 'green';
        input2.style.borderColor = 'green';
        small.innerText = 'As senhas conferem';
        small.style.color = 'green';
        confirmações['senha'] = true;
    } else {
        input.style.borderColor = 'red';
        input2.style.borderColor = 'red';
        small.innerText = 'As senhas não conferem';
        small.style.color = 'red';
        confirmações['senha'] = false;
    }
}

function mostrarImagem(e) {
    const input_arquivo = document.querySelector("#input_da_imagem");
    const pictureImage = document.querySelector(".imagem_foto");
    const pictureImageTxt = "Escolha uma imagem";
    const preview = document.getElementById("preview");

    const inputTarget = e.target;
    const file = inputTarget.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function (e) {
            const readerTarget = e.target;
            preview.src = readerTarget.result;
            preview.style.display = 'block';
            pictureImage.style.display = 'none';
        });

        reader.readAsDataURL(file);
    } else {
        pictureImage.innerHTML = pictureImageTxt;
        pictureImage.style.display = 'block';
        preview.style.display = 'none';
    }
}

function verificarConfirmacoes(){
    if((confirmações['email'] === true) && (confirmações['senha'] === true) ){
        cadastrarUser();
    }else{
        alert("Email ou senha inválidos ou incompatíveis");
    }
}

function cadastrarUser(){

    var formData = new FormData();
    formData.append('form', 'cadastrarUser');
    formData.append('nome', document.querySelector('[name="nome"]').value);
    formData.append('sobrenome', document.querySelector('[name="sobrenome"]').value);
    formData.append('email', document.querySelector('[name="email"]').value);
    formData.append('senha', document.querySelector('[name="senha"]').value);
    if (document.querySelector('[name="input_da_imagem"]').files[0]) {
        formData.append('imagem', document.querySelector('[name="input_da_imagem"]').files[0]);
    }

    $.ajax({
        url: 'php/manter_usuarios.php',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(result){
            if (result.error) {
                console.error('Erro:', result.error);
            } else {
                alertaTemporario(result.message, 3000);
                setTimeout( function(){
                    window.location.href = 'index.php';
                },3000);
            }
        },
        error: function(xhr, status, error){
            console.error(xhr.reponseText);
            console.error(status);
            console.error(error);
        }
    });
}

document.getElementById('senha').addEventListener('change', confirmarSenha);
document.getElementById('confirmarSenha').addEventListener('change', confirmarSenha);
document.getElementById('email').addEventListener('change', confimarEmail);
document.getElementById('input_da_imagem').addEventListener('change', mostrarImagem);