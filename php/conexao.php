<?php

    $local = "localhost";
    $user = "root";
    $senha = "";
    $banco = "gerenciador_de_projetos";

    $conecta = new mysqli($local, $user, $senha, $banco);

    if($conecta->connect_error === true){
        die("Deu ruim malandro!");
    }