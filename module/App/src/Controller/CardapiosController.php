<?php

namespace App\Controller;

class CardapiosController extends DefaultController
{
    /**
     * @var CardapiosService
     */
    private $service;

    public function getService()
    {
        if ($this->service == null) {
            $this->service = new \App\Services\CardapiosService($this->getPdo());
        }
        return $this->service;
    }

    public function consultarAction()
    {
        $post = json_decode(file_get_contents("php://input"), true);
//        $sql = "select e.datahora, e.valor, ep.municipio from entregas e left join enderecos_pessoas ep on (e.endereco_pessoa=ep.id)"
        return $this->sendJson($this->consultaPadrao($this->getService(), $post));
    }
    
    public function persistirAction()
    {
        $post = json_decode(file_get_contents("php://input"), true);
        $prato = $this->getPdo()->query("insert into pratos (usuario) values (1) returning id")->fetchColumn();
        $valorTotal = 0;
        foreach ($post["alimentos"] as $alimento) {
            $valorTotal += $alimento["alimento"]["valor"] * $alimento["quantidade"];
            $this->getPdo()->query("insert into pratos_alimentos (quantidade, alimento, prato) 
                values ({$alimento["quantidade"]}, {$alimento["alimento"]["id"]}, {$prato})");
        }
        
        $sql = "insert into entregas (datahora, valor, usuario, prato, endereco_pessoa) 
            values ('{$post["datahora"]}', {$valorTotal}, 1, {$prato}, {$post["endereco"]})";
        $this->getPdo()->query($sql);
        
        return $this->sendJson(["type" => "success"]);
    }
}