<?php

namespace App\Controller;

class EnderecosController extends DefaultController
{
    /**
     * @var EnderecosService
     */
    private $service;

    public function getService()
    {
        if ($this->service == null) {
            $this->service = new \App\Services\EnderecosService($this->getPdo());
        }
        return $this->service;
    }

    public function consultarAction()
    {
        $post = json_decode(file_get_contents("php://input"), true);
        return $this->sendJson($this->consultaPadrao($this->getService(), $post));
    }
    
    public function getByMunicipioAction()
    {
        $post = json_decode(file_get_contents("php://input"), true);
        $enderecos = $this->getPdo()->query("select id, municipio from enderecos_pessoas "
                . "where municipio ilike '%{$post["municipio"]}%' limit 5")->fetchAll();
        
        return $this->sendJson(["type" => "success", "data" => $enderecos]);
    }
}