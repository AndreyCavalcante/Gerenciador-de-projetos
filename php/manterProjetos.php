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
        case 'pesqProjeto':
            pesqProjeto($conecta);
            break;
        case 'atualizarProjeto':
            atualizarProjeto($conecta);
            break;
        case 'deletarProjeto':
            deletarProjeto($conecta);
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

        $query_status = $_POST['status'];

        $sql = "";

        if($query_status == 'todas'){
            $sql = "SELECT p.id_projeto AS id_projeto, p.nome_projeto AS nome_projeto, p.descricao_projeto AS descricao, 
                p.categoria_projeto AS categoria, p.investimento AS investimento, p.status_projeto AS status_projeto, 
                v.destino AS destino, v.valor AS valor
                FROM projetos p
                INNER JOIN valores v ON v.id_projeto = p.id_projeto
                WHERE p.id_usuario = $id";
        }else{
            $sql = "SELECT p.id_projeto AS id_projeto, p.nome_projeto AS nome_projeto, p.descricao_projeto AS descricao, 
                p.categoria_projeto AS categoria, p.investimento AS investimento, p.status_projeto AS status_projeto, 
                v.destino AS destino, v.valor AS valor
                FROM projetos p
                INNER JOIN valores v ON v.id_projeto = p.id_projeto
                WHERE p.id_usuario = $id AND p.status_projeto = '$query_status'";
        }

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

        $id_usuario = $_POST['id_usuario'];

        $sql = "SELECT p.id_projeto AS id_projeto, p.nome_projeto AS nome_projeto, p.descricao_projeto AS descricao, 
        p.categoria_projeto AS categoria, p.investimento AS investimento, p.status_projeto AS status_projeto, 
        v.destino AS destino, v.valor AS valor, v.id_valor AS id_valor
        FROM projetos p
        INNER JOIN valores v ON v.id_projeto = p.id_projeto
        WHERE p.id_projeto = $id AND p.id_usuario = $id_usuario";
        

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
                    "id_valor" => $row['id_valor'],
                    "destino" => $row['destino'],
                    "valor" => $row['valor']
                );
            }

            echo json_encode(array_values($projetos));
        }else{
            echo json_encode(array('error' => 'Nenhum projeto encontrado!'));
        }
    }

    function pesqProjeto($conecta){

        $id = $_POST['id'];

        $pesq = $_POST['pesq'];

        $sql = "SELECT * FROM projetos WHERE nome_projeto LIKE '%$pesq%' AND id_usuario = $id";
        

        $result = $conecta->query($sql);

        if($result->num_rows > 0){

            $projetos = array();

            while($row = $result->fetch_assoc()){

               $projetos[] = $row; 
            }

            echo json_encode($projetos);
        }else{
            echo json_encode(array('error' => 'Nenhum projeto encontrado!'));
        }
    }

    function atualizarProjeto($conecta){

        $id_projeto = $_POST['id_projeto'];
        $id_user = $_POST['id_user'];
        $nome_projeto = $_POST['nome_projeto'];
        $descricao = $_POST['descricao'];
        $investimento  = $_POST['investimento'];
        $categoria = $_POST['categoria'];
        $status = $_POST['status'];
        
        $id_valor = isset($_POST['id_valor']) ? $_POST['id_valor'] : [];
        $nome_valor = isset($_POST['nome_valor']) ? $_POST['nome_valor'] : [];
        $valores = isset($_POST['valores']) ? $_POST['valores'] : [];

        $novos_destinos = isset($_POST['novos_destinos']) ? $_POST['novos_destinos'] : [];
        $novos_valores = isset($_POST['novos_valores']) ? $_POST['novos_valores'] : [];
        $ids_deletados = isset($_POST['id_deletados']) ? $_POST['id_deletados'] : [];
        

        $sql = "UPDATE projetos SET nome_projeto = '$nome_projeto' , descricao_projeto = '$descricao' ,
                categoria_projeto = '$categoria' ,investimento = $investimento , status_projeto = '$status'
                WHERE id_projeto = $id_projeto AND id_usuario = $id_user";

        if($conecta->query($sql) === true){

            if(count($id_valor) > 0){
                for($i = 0; $i < count($id_valor); $i++){
                    $valor_id = $id_valor[$i];
                    $valor = $valores[$i];
                    $destino = $nome_valor[$i];

                    $sql_valores = "UPDATE valores SET valor = $valor, destino = '$destino' WHERE id_valor = $valor_id";

                    if($conecta->query($sql_valores) !== true){
                        echo json_encode(array('error' => 'Erro ao tentar atualizar valor!'));
                        return;
                    }
                }
            }

            if (count($novos_valores) > 0) {
                for ($i = 0; $i < count($novos_valores); $i++) {
                    $novo_valor = $novos_valores[$i];
                    $novo_destino = $novos_destinos[$i];
    
                    $sql_novos_valores = "INSERT INTO valores (valor, destino, id_projeto) VALUES ('$novo_valor', '$novo_destino', $id_projeto)";
    
                    if ($conecta->query($sql_novos_valores) !== true) {
                        echo json_encode(array('error' => 'Erro ao inserir novo Valor e Destino: '));
                        return;
                    }
                }
            }

            if (count($ids_deletados) > 0) {
                for ($i = 0; $i < count($ids_deletados); $i++) {
                    $id_deletado = $ids_deletados[$i];
    
                    $sql_deletar = "DELETE FROM valores WHERE id_valor = $id_deletado";
    
                    if ($conecta->query($sql_deletar) !== true) {
                        echo json_encode(array('error' => 'Erro ao deletar Valor: '));
                        return;
                    }
                }
            }



            echo json_encode(array('mensagem' => 'Dados do projeto atualizados com sucesso'));
        }else{
            echo json_encode(array('error' => 'Não funcionou MALANDRO'));
        }
    }

    function deletarProjeto($conecta){
        $id = $_POST['id'];

        $sql = "DELETE FROM valores WHERE id_projeto = '$id'";

        if($conecta->query($sql) === true){

            $sql_delete = "DELETE FROM projetos WHERE id_projeto = '$id'";

            if($conecta->query($sql_delete) !== true){
                echo json_encode(array('error' => 'Erro ao deletar Projeto'));
            }else{
                echo json_encode(array('mensagem' => 'Projeto excluído com sucesso!'));
            }

        }else{
            echo json_encode(array('error' => 'Erro ao deletar valores do produto'));
        }
    }