<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-Vindo</title>

        <link rel="icon" href="imgs/favicon.png" type="image/png" style="border-radius: 3px;">

        <link rel="stylesheet" href="css/bootstrap.css">
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>
        <header>
            <div class="modal fade text-bg-dark" id="meuModal" tabindex="-1" role="dialog" aria-labelledby="meuModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content bg-dark">
                    <div class="modal-header">
                      <h5 class="modal-title" id="meuModalLabel">Mensagem</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <p id="mensagemModal"></p>
                    </div>
                  </div>
                </div>
            </div>
        </header>
        <div class="form-bg">
            <div class="container-fluid">
                <div class="row" style="margin-top: 100px">
                    <div class="d-flex text-center justify-content-center">
                        <div class="col-md-offset-3 col-md-6 col-sm-offset-2 col-sm-8">
                            <div id="form-container" class="form-container">
                            <form id="formCadastro" class="form-horizontal">
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
                                <a href="index.php"><button type="button" class="btn signin">Entrar</button></a>
                                <button type="button" class="btn signin" onclick="verificarConfirmacoes()">Registrar</button>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script src="js/bootstrap.bundle.min.js"></script>
        <script src="js/jquery-3.7.1.min.js"></script>
        <script src="js/script_cadastro.js"></script>
    </body>
</html>