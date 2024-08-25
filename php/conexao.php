<?php

    $local = "sql10.freemysqlhosting.net";
    $user = "sql10727706";
    $senha = "RE5uEVYWdE";
    $banco = "sql10727706";

    $conecta = new mysqli($local, $user, $senha, $banco);

    if($conecta->connect_error === true){
        die("Conexão não concluida");
    }
