<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meus Projetos</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <link rel="stylesheet" href="css/style_page.css">

        <link rel="icon" href="imgs/favicon.png" type="image/png">

        <?php
            session_start();
            if ((!isset($_SESSION['email']) || !isset($_SESSION['senha']))) {
                session_unset();
                session_destroy();
                echo "<script>
                        alert('Email ou senha incorretos!');
                        window.location.href = 'index.php';
                    </script>";
            } else {
                $id = $_SESSION['id'];
                $nome = $_SESSION['nome'];
                $imagem = $_SESSION['imagem'];
            }
        ?>

        <style>
            .card {
                height: 100%;
            }
            .row.g-0 {
                height: 100%;
            }
            .col-md-4 {
                display: flex;
                align-items: stretch;
            }
            .col-md-4 img {
                width: 100%;
                object-fit: cover;
            }
        </style>
    </head>
    <body onload="buscarUser(<?php echo $id;?>)">
        <input type="hidden" name="id_geral" id="id_geral" value="<?php echo $id;?>">
        <div class="modal fade text-bg-dark" id="meuModal" tabindex="-1" role="dialog" aria-labelledby="meuModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content bg-dark">
                <div class="modal-header">
                    <h5 class="modal-title" style="color: white;" id="meuModalLabel">Mensagem</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="color: white;" id="mensagemModal"></p>
                </div>
                </div>
            </div>
        </div>

        <nav class="navbar navbar-expand-lg navbar-dark nav-edit fixed-top">
            <a class="navbar-brand" id="a-nav" href="#"></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#verticalNav" aria-controls="verticalNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="ml-auto d-flex align-items-center nav-box-buttons">
                <div class="pesq-container">
                    <form id="formPesq" class="form-pesq">
                        <input type="text" name="pesq" id="pesq" class="input-nav-pesq">
                        <button type="submit" form="formPesq" class="submit-nav-pesq"><img src="imgs/lupa.png" alt="Pesquisar" class="img-pesq"></button>
                    </form>
                </div>
                <a href="#" style="text-decoration: none;">
                    <button type="button" class="nav-button" onclick="formCriar(<?php echo $id;?>)">
                        <p class="text-button">+</p>
                    </button>
                </a>
            </div>
        </nav>

        <div class="vertical-nav nav-edit" id="verticalNav">
            <div class="d-flex justify-content-center text-center">
                <label class="label-vertical-nav" onclick="acessarPerfil()">
                    <img
                        alt="Foto de perfil do usuário" 
                        class="image-vertical-nav"
                        id="img-user"
                        onerror="this.onerror=null; this.src='imgs/foto_error.jpeg';"
                    >
                </label>
            </div>
            <div class="justify-content-center text-center">
                <button type="button" id="projetos" class="btn signin" onclick="buscarProjetos(<?php echo $id;?>, 'todas')">Projetos</button>
                <button type="button" id="concluidos" class="btn signin" onclick="buscarProjetos(<?php echo $id;?>, 'Concluído')">Concluídos</button>
                <button type="button" style="font-size: 16px;" id="em_andamento" class="btn signin" onclick="buscarProjetos(<?php echo $id;?>, 'Em Andamento')">Em andamento</button>
                <form action="php/logout.php" method="POST"><button type="submit" class="btn signin sair" style="margin-bottom: 10px;">Sair</button></form>
            </div>
        </div>

        <div class="container main-content">
            <div class="row">
                <div class="col-md-10">
                    <div class="container-content d-flex justify-content-center text-center" style="flex-direction: column; align-items: center;" id="container-content">
                        <input type="password" name="" id="senha_teste"><button onclick></button>
                    </div>
                </div>
                <div class="col-md-2"></div>
            </div>
        </div>

        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <script src="js/jquery-3.7.1.min.js"></script>
        <script src="js/bootstrap.bundle.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/script_interface.js"></script>
        <script>
            $(document).ready(function() {
                $('.navbar-toggler').click(function() {
                    $('#verticalNav').toggle();
                });

                function checkWindowSize() {
                    if ($(window).width() < 768) {
                        $('#verticalNav').hide();
                        $('.navbar-toggler').show();
                    } else {
                        $('#verticalNav').show();
                        $('.navbar-toggler').hide();
                    }
                }

                checkWindowSize();

                $(window).resize(function() {
                    checkWindowSize();
                });
            });
        </script>
    </body>
</html>
