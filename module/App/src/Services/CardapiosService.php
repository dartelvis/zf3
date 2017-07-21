<?php

namespace App\Services;

class CardapiosService extends EntityService
{

    public function getTable()
    {
        return 'pratos_alimentos';
    }
    
    public function consultar(&$params)
    {
        $camposTipos = [
            'e.datahora' => ['type' => 'date'],
            'e.valor' => ['type' => 'decimal'],
            'ep.municipio' => ['type' => 'varchar']
        ];
        $firstResult = ($params['rows'] * $params['page']) - $params['rows'];

        $sql = " from entregas e left join enderecos_pessoas ep on (e.endereco_pessoa=ep.id) " 
                .  $this->getFiltrosConsultaSql($params['filtros'], $camposTipos);

        // Total de registros
        $params['count'] = $this->pdo->query("select count(*) as total $sql")->fetch()['total'];
        if ($params['count'] && $firstResult > $params['count']) {
            $firstResult = 0;
            $params['page'] = 1;
        }

        if ($params['sidx']) {
            $sql .= $this->dqlToSql(
                ' order by ' . $params['sidx'] . '  ' . $params['sord'] . ' nulls '
                . ($params['sord'] == 'asc' ? ' first ' : ' last ')
            );
        }
        if ($params['rows']) {
            $sql .= ' limit ' . $params['rows'];
        }
        if ($firstResult > 0) {
            $sql .= ' offset ' . $firstResult;
        }

        $sql = "select e.id, to_char(e.datahora, 'DD/MM/YYYY HH24:MI') datahora, e.valor, ep.municipio " . $sql;

        return $this->pdo->query($sql)->fetchAll();
    }
}