<?php
namespace Common\Model\Services;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Query\Expr\Comparison;

abstract class EntityService implements \Zetta\Common\Model\Services\EntityServiceInterface
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    protected $em;

    public function __construct(EntityManager $em = null)
    {
        mb_internal_encoding("UTF-8");
        $this->em = $em;
    }

    /**
     * @return \Doctrine\ORM\EntityManager
     */
    public function getEm()
    {
        return $this->em;
    }

    /**
     * @param \Doctrine\ORM\EntityManager $em
     */
    public function setEm(EntityManager $em)
    {
        $this->em = $em;
    }

    /**
     * @param object $obj
     * @throws \Exception
     */
    public function persist($obj)
    {
        $this->em->persist($obj);
        $this->em->flush();
    }

    /**
     *
     * @param obj $obj
     * @throws \Exception
     */
    public function delete($obj)
    {
        $this->em->remove($obj);
        $this->em->flush();
    }

    /**
     * @param int $id
     * @return object
     * @throws \Exception
     */
    public function getById($id)
    {
        return $this->getRepository()->find($id);
    }

    /**
     * @return object[]
     */
    public function getAll()
    {
        return $this->getRepository()->findAll();
    }

    /**
     * Cria um query builder da entidade vinculada ao service.
     * A Entidade principal sempre terá o alias 'e'. Uma classe filha
     * pode subscrever este método com o intuito de adicionar joins, mas
     * deve cuidar para não alterar o alias da entidade principal.
     *
     * @return \Doctrine\ORM\QueryBuilder
     */
    protected function getQueryBuilder()
    {
        return $qb = $this->getRepository()->createQueryBuilder('e');
    }

    /**
     * executar a Query e retornar o resultado.
     *
     * @param $query
     *
     * @return Object
     */
    public function executeQuery($query)
    {
        $query->setHint(\Doctrine\ORM\Query::HINT_FORCE_PARTIAL_LOAD, true);
        $query->useQueryCache(false);
        return $query->getResult();
    }

    /**
     * @param $params array(
     *  filtros => [campo, valor, adicional]
     *  page => Pagina atual (calc posição do primeiro resultado - offset)
     *  rows => Máximo de resultados (limit)
     *  count => Total de resultados
     *  sidx => Coluna alvo do order by
     *  sord => Direção da ordenação (asc/desc)
     * )
     *
     * @return \ArrayObject
     */
    public function consultar(&$params)
    {
        $firstResult = ($params['rows'] * $params['page']) - $params['rows'];
        $qb = $this->getQueryBuilder();

        $this->getFiltrosConsultaDql($qb, $params['filtros']);
        $select = $qb->getDQLPart('select');

        // Recupera totais de registros
        if ($params['count']) {
            $query2 = $qb->select('COUNT(e)')->getQuery();
            $query2->useQueryCache(false);
            $result2 = $query2->getResult();
            $params['count'] = $result2[0][1];

            if ($firstResult > $params['count']) {
                $firstResult = 0;
                $params['page'] = 1;
            }
        }

        $qb->add('select', array_shift($select));

        if ($firstResult) {
            $qb->setFirstResult($firstResult);
        }
        if ($params['rows']) {
            $qb->setMaxResults($params['rows']);
        }
        if ($params['sidx']) {
            $qb->addOrderBy($params['sidx'], $params['sord']);
        }

        $query = $qb->getQuery();
        return $this->executeQuery($query);
    }

    /**
     * Retorna mapeamento DQL. (tipo do campo recuperado pelos metadados da entidade)
     * É necessario o query builder para saber se foi utilizado algum join
     * na consulta.
     * O alias principal sempre será 'e'. Se o campo informado tiver um alias
     * diferente significa que um join foi utilizado e a consulta dos
     * metadados deve ser feita na entidade associada.
     *
     * @param \Doctrine\ORM\QueryBuilder $qb
     * @param string $campo
     * @return array
     */
    public function getTypeMd(\Doctrine\ORM\QueryBuilder &$qb, &$campo, $repository = null)
    {
        $repository = $repository ?: $this->getRepository();
        $md = $this->em->getClassMetadata($repository->getClassName());
        list($alias, $field) = explode('.', $campo);
        if ('e' !== $alias) {
            $aliasCache = array('e' => $md);
            $joins = $qb->getDQLPart('join')['e'];

            /* @var $join \Doctrine\ORM\Query\Expr\Join */
            foreach ($joins as $join) {

                // O join pode ter os seguinte padrão:
                // alias.coluna ou ser diretamente o nome de uma classe
                if (false !== strpos($join->getJoin(), '.')) {
                    list($alias2, $fieldJoin2) = explode('.', $join->getJoin());
                    $md = $aliasCache[$alias2];
                    $fieldMapping = $md->getAssociationMapping($fieldJoin2);
                    $entidade = $this->em->getClassMetadata($fieldMapping['targetEntity']);
                } else {
                    $entidade = $this->em->getClassMetadata($join->getJoin());
                }
                if ($join->getAlias() === $alias) {
                    $md = $entidade;
                    break;
                }
                $aliasCache[$join->getAlias()] = $entidade;
            }
        }
        $fieldMapping = $md->getFieldMapping($field);
        return $fieldMapping;
    }

    /**
     * Verifica se o campo utilizado na consulta DQL é do tipo numérico.
     *
     * @param array $fieldMapping
     * @return boolean
     */
    public function isNumeric($fieldMapping)
    {
        return in_array($fieldMapping['type'], array('integer', 'bigint', 'decimal', 'boolean'));
    }

    /**
     * Verifica se o campo utilizado na consulta DQL é do tipo data/time.
     *
     * @param array $fieldMapping
     * @return boolean
     */
    public function isDate($fieldMapping)
    {
        return in_array($fieldMapping['type'], array('date', 'datetime'));
    }

    public function getFiltrosConsultaDql(\Doctrine\ORM\QueryBuilder $qb, &$filtros, $camposTipos = [])
    {
        // nu: nulo, nn-não nulo, it: verdadeiro, if: falso
        $operadorEspecial = (!empty($filtros['operador']) && in_array($filtros['operador'], ['nu', 'nn', 'it', 'if']));

        if (!empty($filtros['campo']) && (!empty($filtros['valor']) || $operadorEspecial)) {
            // Controla a condição de pesquisa conforme o tipo do campo.
            // Quando for numero não se pode utilizar like.
            $fieldMapping = !empty($camposTipos[$filtros['campo']])
                    ? $camposTipos[$filtros['campo']] : $this->getTypeMd($qb, $filtros['campo']);
            if (!empty($filtros['operador']) && (!$this->isDate($fieldMapping) || $operadorEspecial)) {
                $qb->andWhere($this->getFiltroByOperador($filtros, $this->isNumeric($fieldMapping)));

            // O valor a ser consultado deve ser numerico
            } elseif ($this->isNumeric($fieldMapping)) {
                if (is_numeric($filtros['valor'])) {
                    $qb->andWhere($qb->expr()->eq($filtros['campo'], $filtros['valor']));
                }

            // Adicionado hora devido ao tipo datetime
            } elseif ($this->isDate($fieldMapping)) {
                $qb->andWhere($filtros['campo'] . " >= '" . $filtros['valor'] . " 00:00:00'");
                $qb->andWhere($filtros['campo'] . " <= '" . $filtros['valor'] . " 23:59:59'");
            } else {
                $qb->andWhere(
                    $qb->expr()->like("lower(" . $filtros['campo'] . ")", "'%" . mb_strtolower($filtros['valor']) ."%'")
                );
            }
        }

        if (!empty($filtros['adicional'])) {
            $qb->andWhere($filtros['adicional']);
        }
    }

    public function getFiltrosConsultaSql(\Doctrine\ORM\QueryBuilder $qb, &$filtros, $camposTipos = [])
    {
        // nu: nulo, nn-não nulo, it: verdadeiro, if: falso
        $operadorEspecial = (!empty($filtros['operador']) && in_array($filtros['operador'], ['nu', 'nn', 'it', 'if']));
        $condicao = ' where ';
        $sql = '';
        if (!empty($filtros['campo']) && (!empty($filtros['valor']) || $operadorEspecial)) {
            // Controla a condição de pesquisa conforme o tipo do campo.
            // Quando for numero não se pode utilizar like.
            $fieldMapping =  !empty($camposTipos[$filtros['campo']])
                    ? $camposTipos[$filtros['campo']] : $this->getTypeMd($qb, $filtros['campo']);

            if (!empty($filtros['operador']) && (!$this->isDate($fieldMapping) || $operadorEspecial)) {
                $filtros['campo'] = $this->dqlToSql($filtros['campo']);
                $sql .= $condicao . $this->getFiltroByOperador($filtros, $this->isNumeric($fieldMapping), true);

            // O valor a ser consultado deve ser numerico
            } elseif ($this->isNumeric($fieldMapping)) {
                if (is_numeric($filtros['valor'])) {
                    $sql .= $condicao . $this->dqlToSql($filtros['campo'] . ' = ' . $filtros['valor']);
                }

            // Adicionado hora devido ao tipo datetime
            } elseif ($this->isDate($fieldMapping)) {
                $sql .= $condicao . $this->dqlToSql($filtros['campo'] . " >= '" . $filtros['valor'] . " 00:00:00'")
                        . ' and ' . $this->dqlToSql($filtros['campo'] . " <= '" . $filtros['valor'] . " 23:59:59'");
            } else {
                $sql .= $condicao . $this->dqlToSql(
                    "lower({$filtros['campo']}) like '%" . mb_strtolower($filtros['valor']) . "%'"
                );
            }
            $condicao = ' and ';
        }

        if (!empty($filtros['adicional'])) {
            $sql .= $condicao . $this->dqlToSql($filtros['adicional']);
        }
        return $sql;
    }

    protected function dqlToSql($dql)
    {
        $transform = function ($matched) {
            return preg_replace_callback('/[A-Z]/', function ($v) {
                $letter = array_shift($v);
                return '_' . $letter;
            }, array_shift($matched));
        };
        return preg_replace_callback('/[a-z]\.\w+/', $transform, $dql);
    }

    protected function sqlToDql($sql)
    {
        $e = explode('_', $sql);
        $dql = '';
        foreach ($e as $i => $v) {
            if (!$i) {
                $dql .= $v;
                continue;
            }
            $dql .= ucfirst($v);
        }
        return $dql;
    }

    private function getFiltroByOperador(&$filtros, $isNumeric, $sql = false)
    {
        $operadores = [
            // ambos
            "eq" => "=", // igual
            "ne" => "!=", // diferente
            "nu" => "is null", // nulo
            "nn" => "is not null", // não nulo
            "in" => "in", // está em
            "ni" => "not in", // não está em

            // numeric
            "lt" => "<", // menor
            "le" => "<=", // menor ou igual
            "gt" => ">", // maior
            "ge" => ">=", // maior ou igual

            // boolean
            "it" => "= true",
            "if" => "= false",

            // string
            "bw" => "like", // inicia com
            "bn" => "not like", // não inicia com
            "ew" => "like", // termina com
            "en" => "not like", // não termina com
            "cn" => "like", // contém
            "nc" => "not like", // não contém
        ];

        $campo = ($isNumeric ? $filtros['campo'] : "lower({$filtros['campo']})");
        $operador = $operadores[$filtros['operador']];
        $valor = mb_strtolower($filtros['valor']);

        switch ($filtros['operador']) {
            case 'eq':
            case 'ne':
                $valor = "'{$valor}'";
                break;

            case 'nu':
            case 'nn':
            case 'it':
            case 'if':
                $valor = '';
                break;

            case 'in':
            case 'ni':
                if ($isNumeric) {
                    $valor = "(" .str_replace(';', ',', $valor)  . ")";
                    break;
                }
                $valor = "('" .str_replace(';', "','", $valor)  . "')";
                break;

            case 'bw':
            case 'bn':
                $valor = "'{$valor}%'";
                break;

            case 'ew':
            case 'en':
                $valor = "'%{$valor}'";
                break;

            case 'cn':
            case 'nc':
                $valor = "'%{$valor}%'";
                break;

            default:
                break;
        }
        return ($sql ? "{$campo} {$operador} {$valor}" : new Comparison($campo, $operador, $valor));
    }

    /**
     * @return \Doctrine\ORM\EntityRepository
     */
    abstract public function getRepository();
}
