<?php
require "config/model.php";
require_once('config/security.php');
class userController extends security
{
    // Exemple
    // public function get($parametre = null)
    // {
    //     $class = new user;
    //     $result = $class->getall();
    //     echo json_encode($result);
    // }

    // public function delete($parametre = null)
    // {
    //     $class = new user;
    //     $result = $class->delete($parametre["id"]);
    //     echo json_encode($result);
    // }

    // public function connexion($parametre = null)
    // {
    //     $class = new user;
    //     $result = $class->connexion($parametre);
    //     if ($result["COUNT(*)"] == 1 && password_verify($parametre['password'], $result['password'] )== true ) {
    //         $resultToken = md5(uniqid(rand(), true));
    //         $resultInsert = $class->insertToken($resultToken, $result);
    //         if ($resultInsert == true ) {
    //             echo json_encode($resultToken);
    //         }
    //         else {
    //             echo json_encode("Erreur de connection");
    //         }
    //     }
    //     else {
    //         $result = false;
    //         echo json_encode($result);
    //     }
    // }

    // public function insertUser($parametre = null)
    // {
    //     $user = json_decode($parametre['user']);
    //     $class = new user;
    //     $result = $class->insert($user);
    //     echo json_encode($result);
    // }

    // public function updateUser($parametre = null)
    // {
    //     $user = json_decode($parametre['user']);
    //     $class = new user;
    //     $result = $class->update($user,$parametre['id']);
    //     echo json_encode($result);
    // }
    // Public function validationEmail($parametre = null)
    // {
    //     $class = new user;
    //     $result = $class->validationEmail($parametre['email']);
    //     if($result["COUNT(*)"]>0){
    //         $return = false;
    //     }else{
    //         $return = true;
    //     }
    //     echo json_encode($return);
    // }
}