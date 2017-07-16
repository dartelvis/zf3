<?php
namespace App;

//use Zend\Mvc\ModuleRouteListener;
//use Zend\Mvc\MvcEvent;

class Module
{
    const VERSION = '3.0.3-dev';

//    public function onBootstrap(MvcEvent $e)
//    {
//        $eventManager = $e->getApplication()->getEventManager();
//        $moduleRouteListener = new ModuleRouteListener();
//        $moduleRouteListener->attach($eventManager);
//
//        $eventManager->attach(MvcEvent::EVENT_ROUTE, function (MvcEvent $e) {
//
//            $matchedRoute = $e->getRouteMatch();
//            if (null === $matchedRoute) {
//                return;
//            }
//
////            $routeName = $matchedRoute->getMatchedRouteName();
////            $moduleName = substr($routeName, 0, (strpos($routeName, '/') ?: strlen($routeName)));
////            if (in_array($moduleName, ['api', 'oauth'])) {
////                return;
////            }
//
//            /* @var $controllerManager \Zend\Mvc\Controller\ControllerManager */
//
//            $controllerManager = $e->getApplication()->getServiceManager()->get('ControllerManager');
//            $controller = $matchedRoute->getParam('controller');
//            $controllerClass = $controller . 'Controller';
//
//            var_dump(get_class($controllerManager));
//
//            if (class_exists($controllerClass)) {
//                $controllerObject = new $controllerClass;
//                $controllerObject->setServiceLocator($e->getApplication()->getServiceManager());
//                $controllerManager->setService($controller, $controllerObject);
//            }
//        }, -1);
//    }

    public function getConfig()
    {
        return include __DIR__ . '/../config/module.config.php';
    }
}
