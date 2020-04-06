<?php
require "config/model.php";
require_once('config/security.php');
class vehiculeController
{
    // Exemple
    // public function get($parametre = null)
    // {
    //     $search = json_decode($parametre['search']);
        
    //     $class = new vehicule;
    //     $result = $class->getall($search);

    //     if($search->datedebut!="" && $search->datefin!="" && count($result)!=0 ){
    //         $datedebut = new DateTime($search->datedebut);
    //         $search->datedebut=$datedebut->format('Y-m-d H:i:s');
    //         $datefin = new DateTime($search->datefin);
    //         $search->datefin=$datefin->format('Y-m-d H:i:s');
    //         $class = new reservation;
    //         foreach($result as $key => $value){
    //             $data = $class->verifReservation($parametre,$value["id"]);
    //             if($data["COUNT(*)"]==1){
    //                 unset($result[$key]);
    //             }
    //         }  
    //     }
    //     sort($result);
    //     echo json_encode($result);
    // }
    // public function getVehiculeForUser($parametre = null)
    // {
    //     $class = new vehicule;
    //     $result = $class->getinfovehiculebyUser($parametre["id"]);
    //     echo json_encode($result);
    // }

    // public function saveVehicule($parametre = null)
    // {
    //     $vehicule = json_decode($parametre['vehicule']);
    //     $class = new vehicule;
    //     $result = $class->saveVehicule($vehicule,$parametre['id']);
    //     echo json_encode($result);
    // }

    // public function updateVehicule($parametre = null)
    // {
    //     $vehicule = json_decode($parametre['vehicule']);
    //     $class = new vehicule;
    //     $result = $class->update($vehicule,$parametre['id']);
    //     echo json_encode($result);
    // }

    // public function delete($parametre = null)
    // {
    //     $class = new vehicule;
    //     $result = $class->delete($parametre["id"]);
    //     echo json_encode($result);
    // }

    // public function getInfoVehiculebyId($parametre = null)
    // {
    //     $class = new vehicule;
    //     $result = $class->getinfovehiculebyid($parametre["id"]);
    //     echo json_encode($result);
    // }
}