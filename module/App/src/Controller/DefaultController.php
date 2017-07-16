<?php
namespace App\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class DefaultController extends AbstractActionController
{
    /**
     * @var \PDO
     */
    private $pdo;

    public function __construct()
    {
        session_start();
    }

    /**
     * @return \PDO
     */
    public function getPdo()
    {
        if (empty($this->pdo)) {
            $this->pdo = new \PDO("pgsql:dbname=dbname;host=localhost;port=5432", 'sysdba', '');
        }
        return $this->pdo;
    }

    public function send($content, $type = 'text/html')
    {
        $response = $this->getResponse();
        $response->setStatusCode(200);
        $response->setContent($content);
        $response->getHeaders()->addHeaderLine('Content-Type', $type);
        return $response;
    }

    public function sendJson($content)
    {
        $response = $this->getResponse();
        $response->setStatusCode(200);
        $response->setContent(gettype($content) === 'string' ? $content : json_encode($content));
        $response->getHeaders()->addHeaderLine('Content-Type', 'application/json');
        return $response;
    }

    public function sendJavaScript($content, $code = 200)
    {
        $response = $this->getResponse();
        $response->setStatusCode($code);
        $response->setContent($content);
        $response->getHeaders()->addHeaderLine('Content-Type', 'text/javascript');
        return $response;
    }

    public function sendForbidden($content)
    {
        return $this->sendJavaScript($content, 403);
    }

    /**
     * Consulta padrão
     *
     * @param type $service
     * @param type $post
     * @return \stdClass
     */
    public function consultaPadrao($service, &$post = null)
    {
        if (!$post) {
            $post = $this->params()->fromPost();
        }

        if (empty($post['sidx'])) {
            $post['sidx'] = 1;
        }
        if (empty($post['filtros'])) {
            $post['filtros'] = [];
        }
        if (empty($post['count'])) {
            $post['count'] = true;
        }

        $data = $service->consultar($post);

        $response = new \stdClass();
        $response->page = $post['page'];
        $response->records = $post['count'];
        if ($response->records > 0) {
            $response->total = ceil($response->records / $post['rows']);
        } else {
            $response->total = 0;
        }
        $response->rows = $data;
        if (!empty($post['userdata'])) {
            $response->userdata = $post['userdata'];
        }

        return $response;
    }
}
