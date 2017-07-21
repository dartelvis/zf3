<?php

namespace App\Controller;

class AlimentosController extends DefaultController
{
    /**
     * @var AlimentosService
     */
    private $service;

    public function getService()
    {
        if ($this->service == null) {
            $this->service = new \App\Services\AlimentosService($this->getPdo());
        }
        return $this->service;
    }

    public function consultarAction()
    {
        $post = json_decode(file_get_contents("php://input"), true);
        return $this->sendJson($this->consultaPadrao($this->getService(), $post));
    }
    
    public function getByDescricaoAction()
    {
        $post = json_decode(file_get_contents("php://input"), true);
        $alimentos = $this->getPdo()->query("select id, descricao, peso::integer || ' g' peso, valor from alimentos "
                . "where descricao ilike '%{$post["descricao"]}%' limit 5")->fetchAll(\PDO::FETCH_ASSOC);
        
        return $this->sendJson(["type" => "success", "data" => $alimentos]);
    }
}