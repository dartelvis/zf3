<?php

namespace App\Controller;

class IndexController extends DefaultController
{
    public function loginAction()
    {
        $_SESSION['usuario'] = [
            "id" => 1,
            "name" => 'José'
        ];

        return $this->sendJson([
            "type" => 'success',
            "msg" => 'Logado com sucesso',
            "data" => $_SESSION['usuario']
        ]);
    }

    public function logadoAction()
    {
        var_dump($_SESSION['usuario']);
    }

    public function logoutAction()
    {
        unset($_SESSION['usuario']);
        return $this->sendJson([
            "type" => 'success',
            "msg" => 'Deslogado com sucesso'
        ]);
    }

    public function getEntitiesAction()
    {
        return $this->sendJson([
            'type' => 'success',
            'msg' => 'Entidades carregadas com sucesso',
            'data' => [
                'user' => (empty($_SESSION['usuario']) ? null : $_SESSION['usuario']),
                'entity' => [
                    'id' => 1,
                    'name' => 'Empresa',
                    'mainColor' => '#2196F3'
                ],
                'entities' => [[
                    'id' => 1,
                    'name' => 'Empresa',
                    'mainColor' => '#2196F3'
                ]]
            ]
        ]);
    }

    public function getBancoAction()
    {
        $smt = $this->getPdo()->query('select id from usuarios order by id desc limit 1');
        return $this->sendJson([
            'type' => 'success',
            'msg' => 'id recuperado com sucesso',
            'data' => $smt->fetchColumn()
        ]);
    }
}
