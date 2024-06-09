<?php
    header('Content-Type: application.json');

    session_start();

    global $conecta;

    include 'conexao.php';

    session_unset();
    session_destroy();
    header('location: ../index.php');
    