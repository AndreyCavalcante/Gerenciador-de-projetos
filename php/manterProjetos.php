<?php

    global $conecta;

    include 'conexao.php';

    $form = $_POST['form'];

    switch($form){
        case 'registrarProjetos':
            registrarProjetos($conecta);
            break;
        case 'buscarProjetos':
            buscarProjetos($conecta);
            break;
        case 'maisDetalhes':
            maisDetalhes($conecta);
            break;
        default:
            break;
    }

    function registrarProjetos($conecta){

        $id = $_POST['id'];
        $nome_projeto = $_POST['nome_projeto'];
        $descricao = $_POST['descricao'];
        $investimento = $_POST['investimento'];
        $nome_valor = $_POST['nome_valor'];
        $valores = $_POST['valores'];
        $categoria = $_POST['categoria'];

        $sql = "INSERT INTO projetos (nome_projeto, descricao_projeto, categoria_projeto, investimento, status_projeto, id_usuario)
                VALUES ('$nome_projeto', '$descricao', '$categoria', $investimento, 'Em Andamento', $id)";

        if($conecta->query($sql) === true){

            $ultimo_id = $conecta->insert_id;

            for($i = 0; $i < count($valores); $i++){
                $destino = $nome_valor[$i];
                $valor = $valores[$i];

                $sql_values = "INSERT INTO valores (destino, valor, id_projeto) VALUES ('$destino', $valor, $ultimo_id)";

                if($conecta->query($sql_values) !== true){

                    echo json_encode('Erro ao inserir destino ou valor!');
                }
            }

            echo json_encode('Projeto Salvo com sucesso!');
        }else{
            echo json_encode('Erro ao salvar projeto!');
        }
    }

    function buscarProjetos($conecta){

        $id = $_POST['id'];

        $sql = "SELECT p.id_projeto AS id_projeto, p.nome_projeto AS nome_projeto, p.descricao_projeto AS descricao, 
                p.categoria_projeto AS categoria, p.investimento AS investimento, p.status_projeto AS status_projeto, 
                v.destino AS destino, v.valor AS valor
                FROM projetos p
                INNER JOIN valores v ON v.id_projeto = p.id_projeto
                WHERE p.id_usuario = $id";

        $result = $conecta->query($sql);

        if($result->num_rows > 0){

            $projetos = array();

            while($row = $result->fetch_assoc()){

                $id_projeto = $row['id_projeto'];

                if(!isset($projetos[$id_projeto])){
                    $projetos[$id_projeto] = array(
                        "id_projeto" => $row['id_projeto'],
                        "nome_projeto" => $row['nome_projeto'],
                        "descricao" => $row['descricao'],
                        "categoria" => $row['categoria'],
                        "investimento" => $row['investimento'],
                        "status" => $row['status_projeto'],
                        "valores" => array()
                    );
                }

                $projetos[$id_projeto]['valores'][] = array(
                    "destino" => $row['destino'],
                    "valor" => $row['valor']
                );
            }

            echo json_encode(array_values($projetos));
        }else{
            echo json_encode(array('error' => 'Nenhum projeto encontrado!'));
        }
    }


    function maisDetalhes($conecta){
        $id = $_POST['id'];

        $sql = "SELECT p.id_projeto AS id_projeto, p.nome_projeto AS nome_projeto, p.descricao_projeto AS descricao, 
                p.categoria_projeto AS categoria, p.investimento AS investimento, p.status_projeto AS status_projeto, 
                v.destino AS destino, v.valor AS valor
                FROM projetos p
                INNER JOIN valores v ON v.id_projeto = p.id_projeto
                WHERE p.id_projeto = $id";

        $result = $conecta->query($sql);

        if($result->num_rows > 0){

            $projetos = array();

            while($row = $result->fetch_assoc()){

                $id_projeto = $row['id_projeto'];

                if(!isset($projetos[$id_projeto])){
                    $projetos[$id_projeto] = array(
                        "id_projeto" => $row['id_projeto'],
                        "nome_projeto" => $row['nome_projeto'],
                        "descricao" => $row['descricao'],
                        "categoria" => $row['categoria'],
                        "investimento" => $row['investimento'],
                        "status" => $row['status_projeto'],
                        "valores" => array()
                    );
                }

                $projetos[$id_projeto]['valores'][] = array(
                    "destino" => $row['destino'],
                    "valor" => $row['valor']
                );
            }

            echo json_encode(array_values($projetos));
        }else{
            echo json_encode(array('error' => 'Nenhum projeto encontrado!'));
        }
    }