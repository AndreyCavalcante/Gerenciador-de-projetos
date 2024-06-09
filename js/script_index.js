function alertaTemporario(mensagem, tempo) {
    $('#mensagemModal').text(mensagem);
    $('#meuModal').modal('show');

    setTimeout(function() {
             $('#meuModal').modal('hide');
    }, tempo);
}

function formCadastrar(valor){
    
    let div = document.getElementById('form-container');
    let  form = '';
    let id = '';
    
    if (valor === 1){
        id = 'formCadastro';
        form = `
            <form id="${id}" class="form-horizontal">
                <h3 class="title">Registra-se</h3>
                <span class="description">Faça seu cadastro no melhor gestor de projetos</span>
                <div class="form-group">
                    <input class="form-control" type="text" name="nome" id="nome" placeholder="Seu nome" required>
                </div>
                <div class="form-group">
                    <input class="form-control" type="text" name="sobrenome" id="sobrenome" placeholder="Seu sobrenome" required>
                </div>
                <div class="form-group">
                    <input class="form-control" type="email" name="email" id="email" placeholder="Seu email" required>
                    <small id="smallEmail"></small>
                </div>
                <div class="form-group">
                    <input class="form-control" type="password" name="senha" id="senha" placeholder="Sua senha" required>
                    <small id="smallSenha"></small>
                </div>
                <div class="form-group">
                    <input class="form-control" type="password" name="confirmaSenha" id="confirmarSenha" placeholder="Confirme sua senha" required>
                    <small id="smallConfirmar"></small>
                </div>
                <div class="form-group d-flex text-center justify-content-center">
                <label class="picture" for="picture__input" tabIndex="0">
                    <span class="picture__image">Escolha uma imagem</span>
                </label>
                
                <input type="file" name="picture__input" id="picture__input">
                </div>
                <button type="button" class="btn signin" onclick="formCadastrar(2)">Entrar</button>
                <button type="button" class="btn signin" onclick="verificarConfirmacoes()">Registrar</button>
            </form>
        `;
    }else{
        id = "formIndex",
        form = `
            <form id="${id}" action="php/login.php" method="POST" class="form-horizontal">
                <h3 class="title">Bem-vindo</h3>
                <span class="description">Ao seu melhor gestor de projetos</span>
                <div class="form-group">
                    <input class="form-control" name="email" id="email" type="email" placeholder="Seu email">
                </div>
                <div class="form-group">
                    <input class="form-control" name="senha" id="senha" type="password" placeholder="Sua senha">
                </div>
                <button type="submit" class="btn signin" onclick="">Entrar</button>
                <button type="button" class="btn signin" onclick="formCadastrar(1)">Resgistra-se</button>
            </form>
        `;
    }
    
    div.innerHTML = form;

    if (valor === 1) {
        document.getElementById('senha').addEventListener('change', confirmarSenha);
        document.getElementById('confirmarSenha').addEventListener('change', confirmarSenha);
        document.getElementById('email').addEventListener('change', confimarEmail);
        document.getElementById('picture__input').addEventListener('change', showImage);
    }
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

function showImage(e){
    const inputFile = document.querySelector("#picture__input");
    const pictureImage = document.querySelector(".picture__image");
    const pictureImageTxt = "Escolha uma imagem";
    pictureImage.innerHTML = pictureImageTxt;

    
        const inputTarget = e.target;
        const file = inputTarget.files[0];

        if (file) {
            const reader = new FileReader();

            reader.addEventListener("load", function (e) {
                const readerTarget = e.target;

                const img = document.createElement("img");
                img.src = readerTarget.result;
                img.classList.add("picture__img");

                pictureImage.innerHTML = "";
                pictureImage.appendChild(img);
            });

            reader.readAsDataURL(file);
        } else {
            pictureImage.innerHTML = pictureImageTxt;
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
    if (document.querySelector('[name="picture__input"]').files[0]) {
        formData.append('imagem', document.querySelector('[name="picture__input"]').files[0]);
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
                location.reload();
                alertaTemporario(result.message, 3000);
            }
        },
        error: function(xhr, status, error){
            console.error(xhr.reponseText);
            console.error(status);
            console.error(error);
        }
    });
}