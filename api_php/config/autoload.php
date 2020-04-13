<?php
header('Access-Control-Allow-Origin: *');
$list_model=scandir("controller");
foreach($list_model as $value){
    if($value != "." && $value != ".."){
        require_once("controller/".$value);
    }
}
?>