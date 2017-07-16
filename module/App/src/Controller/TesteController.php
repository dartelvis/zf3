<?php

namespace App\Controller;

class TesteController extends DefaultController
{
    public function testeAction()
    {
        var_dump('aki teste controller');exit();
    }

    public function consultarAction()
    {
        var_dump('aki teste controller');exit();

        return $this->sendJson($this->consultaPadrao($service));
    }
}
