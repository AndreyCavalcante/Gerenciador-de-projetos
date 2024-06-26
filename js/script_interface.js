let id_geral = $('#id_geral').val();

function acessarPerfil(){
    window.location.href = 'perfilUser.php';
}

function buscarProjetos(id, status){
    $.ajax({
        url: 'php/manterProjetos.php',
        method: 'POST',
        data: {form: 'buscarProjetos', id: id, status: status},
        dataType: 'json',
        success: function(result){

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
                    <input type="radio" id="viagem" name="categoria" value="Viagem" checked>
                    <label for="viagem">Viagem</label>
                </div>
                <div class="radio-group">
                    <input type="radio" id="construcao" name="categoria" value="Construção">
                    <label for="construcao">Construção</label>
                </div>
                <div class="radio-group">
                    <input type="radio" id="empreendimento" name="categoria" value="Empreendimento">
                    <label for="empreendimento">Empreendimento</label>
                </div>
                <div class="radio-group">
                    <input type="radio" id="outros" name="categoria" value="Outros">
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

    document.getElementById('investimento').addEventListener('change', atualizarValores);
    document.querySelectorAll('.valor-item').forEach(input => {
        input.addEventListener('change', atualizarValores);
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
        input.addEventListener('change', atualizarValores);
    });
}

function removerItem(button) {
    button.parentElement.parentElement.remove();
    atualizarValores();
}

const validacoesValores = {
    invest: false
};

function atualizarValores(){
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

    console.log(validacoesValores);
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
        data: {form: 'maisDetalhes', id: id, id_usuario: id_geral},
        dataType: 'json',
        success: function(result){

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
                            <div class="div-botao-editar">
                                <button type="button" class="botao-editar" onclick="criarEditarProjeto(${projeto.id_projeto})">
                                    <img src="imgs/editar.png" class="img-editar" alt="Editar" text="Editar">
                                </button>
                                <button type="button" class="botao-voltar delete" onclick="deletarProjeto(${projeto.id_projeto})">
                                    <img src="imgs/lixeira.png" class="img-voltar" alt="Editar" text="Editar">
                                </button>
                            </div>
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
})

function gerarRadio(categoria){
    let viagem = `
        <div class="radio-group">
            <input type="radio" id="viagem" name="categoria" value="Viagem">
            <label for="viagem">Viagem</label>
        </div>
    `;
    let construcao = `
        <div class="radio-group">
            <input type="radio" id="construcao" name="categoria" value="Construção">
            <label for="construcao">Construção</label>
        </div>
    `;
    let empreendimento = `
        <div class="radio-group">
            <input type="radio" id="empreendimento" name="categoria" value="Empreendimento">
            <label for="empreendimento">Empreendimento</label>
        </div>
    `;
    let outros = `
        <div class="radio-group">
            <input type="radio" id="outros" name="categoria" value="Outros">
            <label for="outros">Outros</label>
        </div>
    `;
    switch(categoria){
        case 'Viagem':
            viagem = `
                <div class="radio-group">
                    <input type="radio" id="viagem" name="categoria" value="Viagem" checked>
                    <label for="viagem">Viagem</label>
                </div>
            `;
            break;
        case 'Construção':
            construcao = `
                <div class="radio-group">
                    <input type="radio" id="construcao" name="categoria" value="Construção" checked>
                    <label for="construcao">Construção</label>
                </div>
            `;           
            break;
        case 'Empreendimento':
            empreendimento = `
                <div class="radio-group">
                    <input type="radio" id="empreendimento" name="categoria" value="Empreendimento" checked>
                    <label for="empreendimento">Empreendimento</label>
                </div>
            `;
            break;
        case 'Outros':
            outros = `
                <div class="radio-group">
                    <input type="radio" id="outros" name="categoria" value="Outros" checked>
                    <label for="outros">Outros</label>
                </div>
            `;
            break;
        default:
            break;
    }
    
    let retorno = `
        ${viagem}
        ${construcao}
        ${empreendimento}
        ${outros}
    `;

    return retorno;
}

function gerarRadioStatus(categoria){

    let radio = ``;

    if(categoria === 'Concluído'){
        radio = `
            <h5>Status do projeto:</h5>
            <div class="radio-group">
                <input type="radio" id="Conculído" name="status_projeto_radio" value="Concluído" checked>
                <label for="viagem">Concluído</label>
            </div>
            <div class="radio-group">
                <input type="radio" id="Em_Andamento" name="status_projeto_radio" value="Em Andamento">
                <label for="viagem">Em Andamento</label>
            </div>
        `;
    }else{
        radio = `
            <h5>Status do projeto:</h5>
            <div class="radio-group">
                <input type="radio" id="Conculído" name="status_projeto_radio" value="Concluído">
                <label for="viagem">Concluído</label>
            </div>
            <div class="radio-group">
                <input type="radio" id="Em_Andamento" name="status_projeto_radio" value="Em Andamento" checked>
                <label for="viagem">Em Andamento</label>
            </div>
        `;
    }

    return radio;
}

function atualizarValores(){
    let valores = $('input[name="valor_item[]"]').map(function(){
        return $(this).val();
    }).get() || [];

    let novos_valores = $('input[name="novo_valor[]"]').map(function(){
        return $(this).val();
    }).get() || []; 

    let smallInvest = document.getElementById('smallInvest');
    let investimentoInput = document.getElementById('investimento');
    let investimento = $('#investimento').val();

    let velha_soma = valores.reduce((acc, val) => acc + parseFloat(val || 0), 0);

    let nova_soma = novos_valores.length ? novos_valores.reduce((acc, val) => acc + parseFloat(val || 0), 0) : 0;

    let soma = velha_soma + nova_soma; 

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

    console.log(validacoesValores);
}

function criarEditarProjeto(id_projeto){

    $.ajax({
        url: 'php/manterProjetos.php',
        method: 'POST',
        data: {form: 'maisDetalhes', id: id_projeto, id_usuario: id_geral},
        dataType: 'json',
        success: function(result){
            console.log(result);
            
            let div = document.getElementById('container-content');

            let inputs_valores = ``;

            let investimentoF = result[0].investimento;

            let investimento = parseFloat(investimentoF);
            let nome = result[0].nome_projeto;
            let descricao = result[0].descricao;

            let status_projeto = result[0].status;


            let categoria_html = gerarRadio(result[0].categoria);

            result.forEach( function(projetos){
                const valores = projetos.valores;
                const status_projeto = projetos.status;

                valores.forEach(function(valores){
                    const id = valores.id_valor;
                    const destino = valores.destino;
                    const valorF = valores.valor;
                    const valor = parseFloat(valorF);

                    inputs_valores += `
                        <div class="form-group">
                            <div class="item-container">
                                <button type="button" class="nav-button remove" onclick="removerValorAntigo(this)"><p class="p-button">-</p></button>
                                <div class="item-inputs">
                                    <input type="hidden" value="${id}" id="id_valor[]" class="id_valor" name="id_valor[]">
                                    <input type="text" name="nome_valor[]" class="form-control input-form" placeholder="Destino" value="${destino}" required>
                                    <input type="number" name="valor_item[]" class="form-control input-form valor-item" step="1" min="1" max="99000000.00" placeholder="Valor" value="${valor.toFixed(2)}" required>
                                </div>
                            </div>
                        </div>
                    `;
                });
            });

            let form = `
                <div class="container-atualizar-projeto">
                    <div class="div-botao-voltar">
                        <button type="button" class="botao-voltar" onclick="maisDetalhes(${id_projeto})">
                            <img src="imgs/voltar.png" alt="Voltar" text="Voltar">
                        </button>
                    </div>
                    <form id="formAtualizarProjeto" class="form-atualizar-projeto">
                        <h3>Novo projeto</h3>
                        <div class="form-group">
                            <input type="hidden" class="form-control input-form" value="${id_geral}" name="id_usuario" id="id_usuario" required>
                            <input type="hidden" class="form-control input-form" value="${id_projeto}" name="id_projeto" id="id_projeto" required>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control input-form" id="nome_projeto" name="nome_projeto" placeholder="Nome do projeto" value="${nome}"  required>
                        </div>
                        <div class="form-group">
                            <textarea id="descricao" class="form-control input-form" name="descricao" placeholder="Descrição do projeto" required>${descricao}</textarea>
                        </div>
                        <div class="form-group">
                            ${gerarRadioStatus(status_projeto)}
                        </div>
                        <div class="form-group">
                            <h5>Categoria:</h5>
                            ${categoria_html}
                        </div>
                        <div class="form-group">
                            <input type="number" class="form-control input-form" id="investimento" name="investimento" value="${investimento.toFixed(2)}" step="1" min="1" max="99000000.00" placeholder="Investimento do Projeto" required>
                            <small id="smallInvest"></small>
                        </div>
                        <div id="item-container" class="form-group">
                            ${inputs_valores}
                        </div>
                        <div id="itens-novos-container" class="form-group">

                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn signin btnedit">Salvar Alterações</button>
                        </div>
                    </form>
                    <div class="justify-content-center text-center align-items-center">
                        <p>Novo gasto: </p>
                        <div class="d-flex justify-content-center text-center">
                            <button type="button" class="nav-button contrario" onclick="adicionarItem(event)">
                                <p class="text-button">+</p>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            div.innerHTML = form;

            document.getElementById('investimento').addEventListener('change', atualizarValores);
            document.querySelectorAll('.valor-item').forEach(input => {
                input.addEventListener('change', atualizarValores);
            });


        },
        error: function(xhr, status, error){
            console.error(xhr.responseText);
            console.error(status);
            console.error(error);
        }
    });
}

function adicionarItem(event){
    event.preventDefault();

    let div = document.getElementById('itens-novos-container');

    let item = `
        <div class="form-group">
            <div class="item-container">
                <button type="button" class="nav-button remove" onclick="removerItem(this)"><p class="p-button">-</p></button>
                <div class="item-inputs">
                    <input type="text" name="novo_destino[]" class="form-control input-form" placeholder="Destino" required>
                    <input type="number" name="novo_valor[]" class="form-control input-form novo_valor" step="1" min="1" max="99000000.00" placeholder="Valor" required>
                </div>
            </div>
        </div>
    `;

    div.insertAdjacentHTML('beforeend', item);
    document.querySelectorAll('.novo_valor').forEach(input => {
        input.addEventListener('change', atualizarValores);
    });
}

const ids_deletados = [];

function removerValorAntigo(button){
    
    let item_container = button.parentElement;

    let id_str = item_container.querySelector('.id_valor').value;

    let id = Number(id_str);

    ids_deletados.push(id);

    console.log(ids_deletados);

    button.parentElement.parentElement.remove();
    atualizarValores();
}

$(document).on('submit', '#formAtualizarProjeto', function(e){
    e.preventDefault();

    let id_projeto = $('#id_projeto').val();

    let id_projeto_int = Number(id_projeto);

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

    let status_projeto_radio = document.getElementsByName('status_projeto_radio');
    let status_projeto_value = "";

    for (let i = 0; i < status_projeto_radio.length; i++) {
        if (status_projeto_radio[i].checked) {
            status_projeto_value = status_projeto_radio[i].value;
            break;
        }
    }

    let investimento = $('#investimento').val();

    let id_valores = $('input[name="id_valor[]"]').map(function(){
        return $(this).val();
    }).get() || [];
    let nome_valor = $('input[name="nome_valor[]"]').map(function(){
        return $(this).val();
    }).get() || [];
    let valores = $('input[name="valor_item[]"]').map(function(){
        return $(this).val();
    }).get() || [];
    let novos_destinos = $('input[name="novo_destino[]"]').map(function(){
        return $(this).val();
    }).get() || '';
    let novos_valores = $('input[name="novo_valor[]"]').map(function(){
        return $(this).val();
    }).get() || '';

    atualizarValores();

    if(validacoesValores['invest'] === false){
        alertaTemporario('Investimento insulficiente. Tente economizar mais ou aumante o investimento', 3000);
    }else{
        $.ajax({
            url: 'php/manterProjetos.php',
            method: 'POST',
            data: {
                form: 'atualizarProjeto',
                id_projeto: id_projeto,
                id_user: id_usuario,
                nome_projeto: nome_projeto,
                descricao: descricao,
                categoria: categoria_val,
                status: status_projeto_value,
                investimento: investimento,
                id_valor: id_valores,
                nome_valor: nome_valor,
                valores: valores,
                novos_destinos: novos_destinos,
                novos_valores: novos_valores,
                id_deletados: ids_deletados
            },
            dataType: 'json',
            success: function(result){
                
                if('error' in result){
                    alertaTemporario(result.error, 3000);
                }else{
                    alertaTemporario(result.mensagem, 3000);
                    setTimeout(function(){
                        maisDetalhes(id_projeto_int);
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

});

function deletarProjeto(id){

    if(confirm("Realmente deseja excluir esse projeto?")){
        $.ajax({
            url: 'php/manterProjetos.php',
            method: 'POST',
            data: {form: 'deletarProjeto', id: id},
            dataType: 'json',
            success: function(result){

                if('error' in result){
                    alertaTemporario(result.error, 3000);
                }else{
                    alertaTemporario(result.mensagem, 3000);
                    setTimeout( function(){
                        location.reload();
                    }, 3000);
                }
            }
        });
    }
}