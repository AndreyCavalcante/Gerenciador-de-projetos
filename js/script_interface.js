let id_geral = $('#id_geral').val();

function buscarProjetos(id, status){
    $.ajax({
        url: 'php/manterProjetos.php',
        method: 'POST',
        data: {form: 'buscarProjetos', id: id, status: status},
        dataType: 'json',
        success: function(result){

            console.log(result);

            let div = document.getElementById('container-content');
            div.innerHTML = '';

            if('error' in result){

                let texto = `
                    <h1>Nenhum projeto encontrado!</h1><br>
                    <p>Crie um novo projeto no botão acima</p>
                    <p>
                        <button type="button" class="nav-button" onclick="formCriar(${id_geral})">
                            <p class="text-button">+</p>
                        </button>
                    <p>
                `;

                div.innerHTML = texto;
            }else{

                result.forEach(function(projeto){
                    const nome = projeto.nome_projeto;
                    const descricao = projeto.descricao;
                    const categoria = projeto.categoria;
                    const status_projeto = projeto.status;

                    let card = `
                        <div class="card mb-3 " style="max-width: 540px;">
                            <div class="row g-0" style="height: 100%;">
                                <div class="col-md-5" style="display: flex; border-radius: 5px;">
                                    <img src="imgs/${categoria}.png" class="img-fluid rounded-start" style="width: 100%; object-fit: cover; border-radius: 5px;" alt="...">
                                </div>
                                <div class="col-md-7">
                                    <div class="card-body">
                                        <h5 class="card-title">${nome}</h5>
                                        <p class="card-text">${descricao}</p>
                                        <p class="card-text">${status_projeto}</p>
                                        <p class="card-text">
                                            <button type="button" class="btn signin btnedit" onclick="maisDetalhes(${projeto.id_projeto})">
                                                Mais detalhes
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    `;

                    div.innerHTML += card;

                });

            }

        },
        error: function(xhr, status, error){
            console.error(xhr.responseText);
            console.error(status);
            console.error(error);
        }
    });
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
                        <div class="div-informações">
                            <p class="p-informações">
                                Total de Projetos: ${result[0].total_projetos}
                            </p>
                        </div>
                        <div class="div-informações">
                            <p class="p-informações">
                                Projetos concluídos: ${result[0].projetos_concluidos}
                            </p>
                        </div>
                        <div class="div-informações">
                            <p class="p-informações">
                                projetos em andamento: ${result[0].projetos_em_andamento}
                            </p>
                        </div>
                        <div class="div-informações">
                            <p class="p-informações">
                                <button type="button" class="btn singin btn-editar" onclick="formAtualizar(${result[0].id_usuario})">Editar</button>
                            </p>
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
                <label class="picture" for="picture__input" tabIndex="0">
                    <span class="picture__image">Escolha uma imagem</span>
                </label>
                
                <input type="file" name="picture__input" id="picture__input">
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
    document.getElementById('picture__input').addEventListener('change', showImage);

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

const validacoes = {
    email: false,
    senha: false,
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
            location.reload();
            alertaTemporario(result, 2000);
            $('#formAtualizar')[0].reset();
            console.log('deu certo malandro')
        },
        error: function(xhr, status, error){ 
            console.error(xhr.responseText); 
        }
    });
    
});

function formCriar(id){
    let container = document.getElementById('container-content');

    let form = `
        <form id="formProjetos">
            <h3>Novo projeto</h3>
            <div class="form-group">
                <input type="hidden" class="form-control input-form" value="${id}" name="id_usuario" id="id_usuario" required>
            </div>
            <div class="form-group">
                <input type="text" class="form-control input-form" id="nome_projeto" name="nome_projeto" placeholder="Nome do projeto" required>
            </div>
            <div class="form-group">
                <textarea id="descricao" class="form-control input-form" name="descricao" placeholder="Descrição do projeto" required></textarea>
            </div>
            <div class="form-group">
                <h5>Categoria:</h5>
                <div class="radio-group">
                    <input type="radio" id="viagem" name="categoria" value="viagem" checked>
                    <label for="viagem">Viagem</label>
                </div>
                <div class="radio-group">
                    <input type="radio" id="construcao" name="categoria" value="construcao">
                    <label for="construcao">Construção</label>
                </div>
                <div class="radio-group">
                    <input type="radio" id="empreendimento" name="categoria" value="empreendimento">
                    <label for="empreendimento">Empreendimento</label>
                </div>
                <div class="radio-group">
                    <input type="radio" id="outros" name="categoria" value="outros">
                    <label for="outros">Outros</label>
                </div>
            </div>
            <div class="form-group">
                <input type="number" class="form-control input-form" id="investimento" name="investimento" step="1" min="1" max="99000000.00" placeholder="Investimento do Projeto" required>
                <small id="smallInvest"></small>
            </div>
            <div id="item-container" class="form-group">
                <div class="form-group">
                    <div class="item-container">
                        <button type="button" class="nav-button remove" onclick="removerItem(this)"><p class="p-button">-</p></button>
                        <div class="item-inputs">
                            <input type="hidden">
                            <input type="text" name="nome_valor[]" class="form-control input-form" placeholder="Destino" required>
                            <input type="number" name="valor_item[]" class="form-control input-form valor-item" step="1" min="1" max="99000000.00" placeholder="Valor" required>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <button type="submit" class="btn signin btnedit" onclick="registrarProjeto()">Salvar Projeto</button>
            </div>
        </form>
        <div class="justify-content-center text-center align-items-center">
            <p>Novo gasto: </p>
            <div class="d-flex justify-content-center text-center">
                <button type="button" class="nav-button contrario" onclick="novoItem(event)">
                    <p class="text-button">+</p>
                </button>
            </div>
        </div>
    `;

    container.innerHTML = form;

    document.getElementById('investimento').addEventListener('change', validarValores);
    document.querySelectorAll('.valor-item').forEach(input => {
        input.addEventListener('change', validarValores);
    });
}

function novoItem(event){
    event.preventDefault();

    let div = document.getElementById('item-container');

    let item = `
        <div class="form-group">
            <div class="item-container">
                <button type="button" class="nav-button remove" onclick="removerItem(this)"><p class="p-button">-</p></button>
                <div class="item-inputs">
                    <input type="text" name="nome_valor[]" class="form-control input-form" placeholder="Destino" required>
                    <input type="number" name="valor_item[]" class="form-control input-form valor-item" step="1" min="1" max="99000000.00" placeholder="Valor" required>
                </div>
            </div>
        </div>
    `;

    div.insertAdjacentHTML('beforeend', item);
    document.querySelectorAll('.valor-item').forEach(input => {
        input.addEventListener('change', validarValores);
    });
}

function removerItem(button) {
    
    button.parentElement.parentElement.remove();
    validarValores();
}

const validacoesValores = {
    invest: false
};

function validarValores(){
    let valores = $('input[name="valor_item[]"]').map(function(){
        return $(this).val();
    }).get();

    let smallInvest = document.getElementById('smallInvest');
    let investimentoInput = document.getElementById('investimento');
    let investimento = $('#investimento').val();

    let soma = valores.reduce((acc, val) => acc + parseFloat(val || 0), 0);

    if(soma > investimento){
        investimentoInput.style.borderColor = "red";
        smallInvest.style.color = "red";
        smallInvest.innerText = "Valor insuficiente, aumente o investimento ou economize mais";
        validacoesValores['invest'] = false;
    }else if(soma < investimento){
        investimentoInput.style.borderColor = "green";
        smallInvest.style.color = "green";
        smallInvest.innerText = "";
        validacoesValores['invest'] = true;
    }else if(soma == investimento){
        investimentoInput.style.borderColor = "yellow";
        smallInvest.style.color = "yellow";
        smallInvest.innerText = "Cuidado, os gastos estão no limite do investimento";
        validacoesValores['invest'] = true;
    }
}

$(document).on('submit', '#formProjetos', function(e){

    e.preventDefault();
    
    let id_usuario = $('#id_usuario').val();
    let nome_projeto = $('#nome_projeto').val();
    let descricao = $('#descricao').val();

    let categoria = document.getElementsByName('categoria');
    let categoria_val;

    for (let i = 0; i < categoria.length; i++) {
        if (categoria[i].checked) {
            categoria_val = categoria[i].value;
            break;
        }
    }

    let investimento = $('#investimento').val();

    let nome_valor = $('input[name="nome_valor[]"]').map(function(){
        return $(this).val();
    }).get();

    let valores = $('input[name="valor_item[]"]').map(function(){
        return $(this).val();
    }).get();

    if(validacoesValores['invest'] == false){
        alertaTemporario('Investimento insuficiente, tente economizar mais ou aumente o investimento', 3000);
    }else{
        $.ajax({
            url: 'php/manterProjetos.php',
            method: 'POST',
            data: {
                form: 'registrarProjetos', 
                id: id_usuario, 
                nome_projeto: nome_projeto,
                descricao: descricao,
                investimento: investimento,
                nome_valor: nome_valor,
                valores: valores,
                categoria: categoria_val
            },
            dataType: 'json',
            success: function(result){
                alertaTemporario(result, 3000);

                setTimeout( function(){
                    location.reload();
                }, 3000);
            },
            error: function(xhr, status, error){
                console.error(xhr.responseText);
                console.error(status);
                console.error(error);
            }
        });
    }
});

buscarProjetos(id_geral, 'todas');

function maisDetalhes(id){

    $.ajax({
        url: 'php/manterProjetos.php',
        method: 'POST',
        data: {form: 'maisDetalhes', id: id},
        dataType: 'json',
        success: function(result){
            console.log(result);

            let container = document.getElementById('container-content');

            container.innerHTML = "";

            let novo = "";

            result.forEach(function(projeto){
                const nome = projeto.nome_projeto;
                const descricao = projeto.descricao;
                const categoria = projeto.categoria;
                const status_projeto = projeto.status;
                const investimentoF = projeto.investimento;
                const investimento = parseFloat(investimentoF);
                

                novo = `
                    <div class="container-informacoes">
                        <div class="div-botao-voltar">
                            <button type="button" class="botao-voltar" onclick="voltar(event)">
                                <img src="imgs/voltar.png" alt="Voltar" text="Voltar">
                            </button>
                        </div>
                        <div>
                            <button type="button" class="botao-editar" onclick="editarProjeto(${projeto.id_projeto})">

                            </button>
                        </div>
                        <div class="informacoes">
                            <div>
                                <h1>${nome}</h1>
                            </div>
                            <div class="div_descricao">
                                <p class="descricao">${descricao}</p>
                            </div>
                            <div>
                                <p>Categoria: ${categoria}</p>
                            </div>
                            <div>
                                <p>Status: ${status_projeto}</p>
                            </div>
                            <div>
                                <p>Investimento: R$ ${investimento.toFixed(2)}</p>
                            </div>
                            <h5>Gastos:</h5>
                            <table class="table-valores">
                                <tbody>
                `;

                

                projeto.valores.forEach(function(valores_pro){
                    const destino = valores_pro.destino;
                    const valorf = valores_pro.valor;
                    const valor = parseFloat(valorf);

                    let p = `
                        <tr>
                            <td class="itens-table">${destino}: </td>
                            <td class="itens-table">R$${valor.toFixed(2)}</td>
                        </tr>
                    `;

                    novo += p;
                });
                novo += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                    `;
            });

            container.innerHTML = novo;

        },
        error: function(xhr, status, error){
            console.error(xhr.responseText);
            console.error(status);
            console.error(error);
        }
    });
}

function voltar(e){
    e.preventDefault();
    location.reload();
}

$(document).on('submit', '#formPesq', function(e){
    e.preventDefault()
    
    pesq = $('#pesq').val();

    $.ajax({
        url: 'php/manterProjetos.php',
        method: 'POST',
        data: {form: 'pesqProjeto', id: id_geral, pesq: pesq},
        dataType: 'json',
        success: function(result){
            
            let div = document.getElementById('container-content');
            div.innerHTML = '';

            if('error' in result){

                let texto = `
                    <h1>Nenhum projeto encontrado!</h1><br>
                    <p>Crie um novo projeto cliando no botão abaixo</p>
                    <p>
                        <button type="button" class="nav-button" onclick="formCriar(${id_geral})">
                            <p class="text-button">+</p>
                        </button>
                    <p>
                `;

                div.innerHTML = texto;
            }else{

                result.forEach(function(projeto){
                    const nome = projeto.nome_projeto;
                    const descricao = projeto.descricao_projeto;
                    const categoria = projeto.categoria_projeto;
                    const status_projeto = projeto.status_projeto;

                    let card = `
                        <div class="card mb-3 " style="max-width: 540px;">
                            <div class="row g-0" style="height: 100%;">
                                <div class="col-md-4" style="display: flex; border-radius: 5px;">
                                    <img src="imgs/${categoria}.png" class="img-fluid rounded-start" style="width: 100%; object-fit: cover; border-radius: 5px;" alt="...">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title">${nome}</h5>
                                        <p class="card-text">${descricao}</p>
                                        <p class="card-text">${status_projeto}</p>
                                        <p class="card-text">
                                            <button type="button" class="btn signin btnedit" onclick="maisDetalhes(${projeto.id_projeto})">
                                                Mais detalhes
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    div.innerHTML += card;

                });

            }
        },
        error: function(xhr, status, error){
            console.error(xhr.responseText);
            console.error(status);
            console.error(error);
        }
    });
})

function editarProjeto(){

}