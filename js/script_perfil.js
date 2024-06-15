let id_geral = $('#id_geral').val();

mostrarPerfil(id_geral);

const validacoes = {
    email: false,
    senha: false,
}

function alertaTemporario(mensagem, tempo) {
    $('#mensagemModal').text(mensagem);
    $('#meuModal').modal('show');

    setTimeout(function() {
             $('#meuModal').modal('hide');
    }, tempo);
}

function buscarUser(id){
    $.ajax({
        url: 'php/manter_usuarios.php',
        method:'POST',
        data:{form:'buscarUser',id: id},
        dataType:'json',
        success: function(result){

            let a = document.getElementById('a-nav');
            let img = document.getElementById('img-user');

            if('error' in result){
                alert(result[0].error);
            }else{
                a.innerText = `Bem-vindo(a), ${result[0].nome_usuario}!`;
                img.src = `Data:image/*;base64,${result[0].imagem_base64}`;
            }
        },
        error: function(xhr, status, error){
            console.error(xhr.responseText);
            console.error(status);
            console.error(error);
        }
    });
}

function mostrarPerfil(id){
    
    $.ajax({
        url: 'php/manter_usuarios.php',
        method:'POST',
        data:{form:'buscarUser',id: id},
        dataType:'json',
        success: function(result){
            let container = document.getElementById('container-content');

            console.log(result);

            if('error' in result){
                alertaTemporario(result.error, 3000)
            }else{
                let conteudo = `
                    <div class="card-informacoes-usuario">
                        <div class=" d-flex justify-content-center text-center">
                            <label class="label-vertical-nav">
                                <img src="Data:image/*;base64,${result[0].imagem_base64}" 
                                    alt="Foto de perfil do usuário" 
                                    class="image-vertical-nav"
                                    onerror="this.onerror=null; this.src='imgs/foto_error.jpeg';"    
                                >
                            </label>
                        </div>
                        <div class="div-informações">
                            <p class="p-informações">
                                Nome: ${result[0].nome_usuario} ${result[0].sobrenome_usuario}
                            </p>
                        </div>
                        <div class="div-informações">
                            <p class="p-informações">
                                E-mail: ${result[0].email}
                            </p>
                        </div>
                        <div class="div-informações table-informaoes-usuario">
                            <table class="table-valores" style="margin-bottom: 10px;">
                                <tbody>
                                    <tr>
                                        <td class="itens-table">Total de projetos</td>
                                        <td class="itens-table">${result[0].total_projetos}</td>
                                    </tr>
                                    <tr>
                                        <td class="itens-table">Projetos concluídos</td>
                                        <td class="itens-table">${result[0].projetos_concluidos}</td>
                                    </tr>
                                    <tr>
                                        <td class="itens-table">Projetos em andamento</td>
                                        <td class="itens-table">${result[0].projetos_em_andamento}</td>
                                    </tr>
                                <tbody>
                            </table>
                        </div>
                        <div class="div-informações d-flex justify-content-center text-center" style="flex-direction: column;">
                            <p class="p-informações">
                                <button type="button" style="margin-left: 30px;" class="btn singin btn-editar" onclick="formAtualizar(${result[0].id_usuario})">Editar</button>
                            </p>
                            <p>
                                <button type="button" style="margin-left: 30px;" class="btn singin btn-editar sair" onclick="deletarConta(${result[0].id_usuario})">Deletar Conta</button>
                            </p>
                        </div>
                    </div>
                `;

                container.innerHTML = conteudo;
            }

        },
        error: function(xhr, status, error){
            console.error(xhr.responseText);
            console.error(status);
            console.error(error);
        }
    });
}

function formAtualizar(id){
    let div = document.getElementById('container-content');

    let form = `
        <form id="formAtualizar" class="form-horizontal">
            <h3 class="title">Atualizar dados</h3>
            <div class="form-group">
                <input type="hidden" value="${id}" id="id_usuario" name="id_usuario">
            </div>
            <div class="form-group">
                <input class="form-control" type="text" name="nome" id="nome" placeholder="Seu nome">
            </div>
            <div class="form-group">
                <input class="form-control" type="text" name="sobrenome" id="sobrenome" placeholder="Seu sobrenome">
            </div>
            <div class="form-group">
                <input class="form-control" type="email" name="email" id="email" placeholder="Seu email">
                <small id="smallEmail"></small>
            </div>
            <div class="form-group">
                <input class="form-control" type="password" name="senha" id="senha" placeholder="Sua senha">
            </div>
            <div class="form-group">
                <input class="form-control" type="password" name="confirmarSenha" id="confirmarSenha" placeholder="Confirme sua senha">
                <small id="smallConfirmar"></small>
            </div>
            <div class="form-group d-flex text-center justify-content-center">
                <label class="foto" for="input_da_imagem" tabIndex="0">
                    <span class="imagem_foto">Escolha uma imagem</span>
                    <img id="preview" src="" class="imagem_exibir">
                </label>
                <input type="file" name="input_da_imagem" id="input_da_imagem" style="display: none;" onchange="mostrarImagem(event)">
            </div>
            <div class="form-group">
                <button type="submit" form="formAtualizar" class="btn signin btn-editar">Atualizar</button>
            </div>
        </form>
    `;

    div.innerHTML = form;

    document.getElementById('senha').addEventListener('change', validarSenha);
    document.getElementById('confirmarSenha').addEventListener('change', validarSenha);
    document.getElementById('email').addEventListener('change', confimarEmail);
    document.getElementById('input_da_imagem').addEventListener('change', mostrarImagem);

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

function validarEmail(email){
    let regex = /^[^\s@]{8,}@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function confimarEmail(){
    let emailInput = document.getElementById('email');
    let smallEmail = document.getElementById('smallEmail');

    let email = emailInput.value;

    if(email == ""){
        validacoes['email'] = true;
        emailInput.style.borderColor = '#ced4da'
        smallEmail.innerText = "";
    }else{
        if (validarEmail(email)){    
            $.ajax({
                url: 'php/manter_usuarios.php',
                method: 'POST',
                data: {form: 'verificarEmail', email: email},
                dataType: 'json',
                success: function(result){
                    if (result === false){
                        emailInput.style.borderColor = 'green';
                        validacoes['email'] = true;
                        smallEmail.innerText = '';
                    }else{
                        emailInput.style.borderColor = 'red';
                        smallEmail.innerText = 'Email já existente';
                        smallEmail.style.color = 'red';
                        validacoes['email'] = false;
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
            validacoes['email'] = false;
        }
    
    }
}

function validarSenha(){
    let senhaInput = document.getElementById('senha');
    let senhaConInput = document.getElementById('confirmarSenha');

    let senha = senhaInput.value;
    let senhaConfirma = senhaConInput.value;

    let smallConfimar = document.getElementById('smallConfirmar');

    if(senha == "" && senhaConfirma == ""){
        validacoes['senha'] = true;
        senhaInput.style.borderColor = "#ced4da";
        senhaConInput.style.borderColor = "#ced4da";
        smallConfimar.innerText = "";
    }else{
        if(senha == senhaConfirma){
            validacoes['senha'] = true;
            senhaInput.style.borderColor = "green";
            senhaConInput.style.borderColor = "green";
            smallConfimar.innerText = "As senha conferem";
        }else{
            validacoes['senha'] = false;
            senhaInput.style.borderColor = "red";
            senhaConInput.style.borderColor = "red";
            smallConfimar.innerText = "As senhas não conferem";
        }
    }
}

$(document).on('submit', '#formAtualizar', function(e){
    e.preventDefault();
    
    var valores = new FormData(this);
    
    valores.append('form', 'atualizarCadastro');
    
    $(this).find(':input').each(function() {
        var valor = $(this).val().trim();
        valores.append(this.name, valor === '' ? '' : valor);
    });
    
    $.ajax({
        url: 'php/manter_usuarios.php',
        method: 'POST',
        data: valores,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function(result){
            alertaTemporario(result, 2000);
            setTimeout( function(){
                location.reload();
            },2000);
            $('#formAtualizar')[0].reset();
            console.log('deu certo malandro')
        },
        error: function(xhr, status, error){ 
            console.error(xhr.responseText);

        }
    });
    
});

function acessarProjetos(){
    window.location.href = 'projetos.php';
}

function deletarConta(id){

    if(confirm('Tem certeza que deseja deletar sua conta?')){
        $.ajax({
            url: 'php/manter_usuarios.php',
            method: 'POST',
            data: {form: 'deletarUsuario', id: id},
            dataType: 'json',
            success: function(result){

                if('error' in result){
                    alertaTemporario(result.error, 3000);
                }else{
                    alertaTemporario(result.mensagem, 3000);
                    setTimeout( function(){
                        window.location.href = 'index.php';
                    }, 3000);
                }
            },
            error: function(xhr, status, error){
                console.error(xhr.responseText);
                console.error(status);
                console.error(error);
            }
        });
    }
}