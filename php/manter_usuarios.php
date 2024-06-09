<?php
      global $conecta;

    header('Content-Type: application/json');

    include 'conexao.php';

    if($conecta->connect_error === true){
        die("Deu ruim malandro!");
    }

    $form = $_POST['form'];

    switch($form){
        case 'verificarEmail':
            verificarEmail($conecta);
            break;
        case 'cadastrarUser':
            cadastrarUser($conecta);
            break;
        case 'atualizarCadastro':
            atualizarCadastro($conecta);
            break;
        case 'buscarUser':
            buscarUser($conecta, $_POST['id']);
            break;
        default:
            break;
    }

    function verificarEmail($conecta){

        $email = $_POST['email'];
        $email = $conecta->real_escape_string($email);

        $sql = "SELECT nome_usuario FROM usuario WHERE email='$email'";

        $result = $conecta->query($sql);

        if($result->num_rows > 0){
            $status = true;
        }else{
            $status = false;
        }

        echo json_encode($status);
    }

    function cadastrarUser($conecta) {
        try {
            $nome = $_POST['nome'];
            $sobrenome = $_POST['sobrenome'];
            $email = $_POST['email'];
            $senha = $_POST['senha'];
    
            if (!empty($_FILES['imagem']['tmp_name']) && is_uploaded_file($_FILES['imagem']['tmp_name'])) {
                $imagem_nome = $_FILES['imagem']['name'];
                $imagem_temp = $_FILES['imagem']['tmp_name'];
    
                $imagem_binario = file_get_contents($imagem_temp);
                $imagem_binario_escaped = mysqli_real_escape_string($conecta, $imagem_binario);
                $nome_imagem = ", nome_imagem, imagem";
                $valores_imagem = ", '$imagem_nome', '$imagem_binario_escaped'";
            } else {
                $nome_imagem = "";
                $valores_imagem = "";
            }
    
            $sql = "INSERT INTO usuario (nome_usuario, sobrenome_usuario, email, senha $nome_imagem) 
                    VALUES ('$nome', '$sobrenome', '$email', '$senha' $valores_imagem)";
    
            if ($conecta->query($sql) === true) {
                echo json_encode(array('message' => 'Usuário cadastrado com sucesso!'));
            } else {
                echo json_encode(array('message' => 'Erro ao cadastrar usuário', 'error' => $conecta->error));
            }
        } catch (Exception $e) {
            echo json_encode(array('message' => 'Erro ao processar solicitação', 'error' => $e->getMessage()));
        }
    }

    function atualizarCadastro($conecta){
        $id = $_POST['id_usuario'];
        $nome = $_POST['nome'];
        $sobrenome = $_POST['sobrenome'];
        $email = $_POST['email'];
        $senha = $_POST['senha'];

        $sql = "UPDATE usuario SET ";

        if(!empty($nome)){
            $sql .= "nome_usuario = '$nome', ";
        }
        if (!empty($sobrenome)){
            $sql .= "sobrenome_usuario = $sobrenome, ";
        }
        if(!empty($email)){
            $sql .= "email = $email, ";
        }
        if(!empty($senha)){
            $sql .= "senha = $senha, ";
        }
        if (!empty($_FILES['picture__input']['name'])) {
            $imagem_nome = $_FILES['picture__input']['name'];
            $sql .= "nome_imagem = '$imagem_nome', ";

            $imagem_temp = $_FILES['picture__input']['tmp_name'];
            $imagem_binario = addslashes(file_get_contents($imagem_temp));
            $sql .= "imagem = '$imagem_binario', ";
        }

        $sql = rtrim($sql, ', ');

        $sql .= " WHERE id_usuario = '$id'";

        if($conecta->query($sql) === true){
            echo json_encode("Usuário atualizado com sucesso!");
        }else{
            echo json_encode("Erro ao atualizar cadastro!");
        }
    }

    function buscarUser($conecta, $id) {
        $sql = "
        SELECT 
            u.id_usuario,
            u.nome_usuario,
            u.sobrenome_usuario,
            u.email,
            COUNT(p.id_projeto) AS total_projetos,
            SUM(CASE WHEN p.status_projeto = 'concluido' THEN 1 ELSE 0 END) AS projetos_concluidos,
            SUM(CASE WHEN p.status_projeto = 'em andamento' THEN 1 ELSE 0 END) AS projetos_em_andamento,
            u.imagem
        FROM 
            usuario u
        LEFT JOIN 
            projetos p ON u.id_usuario = p.id_usuario
        WHERE 
            u.id_usuario = '$id'
        GROUP BY 
            u.id_usuario, u.nome_usuario, u.sobrenome_usuario, u.email, u.imagem";
    
        $result = $conecta->query($sql);
    
        if ($result->num_rows > 0) {
            $dados = array();
    
            while ($row = $result->fetch_assoc()) {
                if (isset($row['imagem'])) {
                    $row['imagem_base64'] = base64_encode($row['imagem']);
                    unset($row['imagem']);
                }
    
                $dados[] = $row;
            }
    
            echo json_encode($dados);
        } else {
            echo json_encode(array('error' => 'Erro ao buscar os dados do usuário'));
        }
    }