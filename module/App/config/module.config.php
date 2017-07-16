<?php

namespace App;

use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;
use Zend\ServiceManager\Factory\InvokableFactory;

return [
    'router' => [
        'routes' => [
            'home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
            ],

            'app' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/app/[:controller[/:action]]',
                    'constraints' => [
                        'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                    ],
                ]
            ],

            'react' => array(
                'type'    => 'Segment',
                'options' => array(
                    'defaults' => array(
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ),
                    'route'    => '/[:react]',
                    'constraints' => array(
                        'react' => 'teste',
                    ),
                ),
            ),
        ],
    ],

    'controllers' => [
        'aliases' => [
            'index' => Controller\IndexController::class,
            'teste' =>  Controller\TesteController::class
        ],
        'factories' => [
            Controller\IndexController::class => InvokableFactory::class,
            Controller\TesteController::class => InvokableFactory::class,
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'app/index/index' => __DIR__ . '/../view/app/index/index.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
    ],
];
