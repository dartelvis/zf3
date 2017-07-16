<?php

namespace App\Controller;

class TesteController extends DefaultController
{
    /**
     * @var TesteService
     */
    private $service;

    public function getService()
    {
        if ($this->service == null) {
            $this->service = new \App\Services\TesteService($this->getPdo());
        }
        return $this->service;
    }

    public function consultarAction()
    {
        $post = json_decode(file_get_contents("php://input"), true);
        return $this->sendJson($this->consultaPadrao($this->getService(), $post));
    }
}