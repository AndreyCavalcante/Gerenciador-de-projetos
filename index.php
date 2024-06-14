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
                                <form id="formIndex" action="php/login.php" method="POST" class="form-horizontal">
                                    <h3 class="title">Bem-vindo</h3>
                                    <span class="description">Ao seu melhor gestor de projetos</span>
                                    <div class="form-group">
                                        <input class="form-control" name="email" id="email" type="email" placeholder="Seu email">
                                    </div>
                                    <div class="form-group">
                                        <input class="form-control" name="senha" id="senha" type="password" placeholder="Sua senha">
                                    </div>
                                    <button type="submit" class="btn signin">Entrar</button>
                                    <button type="button" class="btn signin" onclick="formCadastrar(1)">Resgistra-se</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script src="js/bootstrap.bundle.min.js"></script>
        <script src="js/jquery-3.7.1.min.js"></script>
        <script src="js/script_index.js"></script>
    </body>
</html>