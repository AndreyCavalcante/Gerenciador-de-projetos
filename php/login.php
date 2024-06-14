<?php

    global $conecta;

    session_start();

    include 'conexao.php';

    $email = $_POST['email'];
    $senha = $_POST['senha'];

    $sql = "SELECT * FROM usuario WHERE email='$email' AND senha='$senha'";

    $resul = $conecta->query($sql);

    if ($resul->num_rows > 0){
        while($row = $resul->fetch_assoc()){
            $_SESSION['email'] = $email;
            $_SESSION['senha'] = $senha;
            $_SESSION['nome'] = $row['nome_usuario'];
            $_SESSION['sobrenome'] = $row['sobrenome_usuario'];
            $_SESSION['id'] = $row['id_usuario'];

            $imagem = base64_encode($row['imagem']);

            unset($row['imagem']);

            $_SESSION['imagem'] = $imagem; 
        }
        echo json_encode($status = true);

    }else{
        session_unset();
        session_destroy();
        echo json_encode($status = false);
    }