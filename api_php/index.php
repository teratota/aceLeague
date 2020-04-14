<?php
require 'config/autoload.php';
$url=$_SERVER["REQUEST_URI"];
$adresse = explode('/',$url);

// il faut decouper l'url pour avoir "nom du controller"/"fonction a utilisé"

$controller = $adresse[1]."Controller";
$fonction = $adresse[2];
$parametre = $_POST;

$class = new $controller;
$class->$fonction($parametre);

?>