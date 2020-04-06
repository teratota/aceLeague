<?php
require_once('config/config.php');

class token extends config
{
    function verifconnectionuser($parametre)
    {
        try {
            $data_base=$this->connection();
            $select = $data_base->prepare("Select COUNT(*) From token WHERE token=:token");
            $select->bindParam(':token',$parametre['token']);
            $select->execute();
            $data=$select->fetchAll();
            return $data;
        } catch (PDOException $e) {
            return "Erreur !: " . $e->getMessage() . "<br/>";
            die();
        }
    }

    function verifconnectionadmin($parametre)
    {
        try {
            $role = 1;
            $data_base=$this->connection();
            $select = $data_base->prepare("Select COUNT(*) From token Inner Join
            user On token.ref_id_user = user.id  WHERE token.token=:token and user.ref_id_role = :role");
            $select->bindParam(':token',$parametre['token']);
            $select->bindParam(':role',$role);
            $select->execute();
            $data=$select->fetchAll();
            return $data;
        } catch (PDOException $e) {
            return "Erreur !: " . $e->getMessage() . "<br/>";
            die();
        }
    }

    function getinfouser($parametre)
    {
        try {
            $data_base=$this->connection();
            $select = $data_base->prepare("Select
            user.id,
            user.nom,
            user.prenom,
            user.mail,
            user.genre,
            user.anniversaire,
            user.telephone,
            user.npermis,
            adresse.code_postal,
            adresse.rue,
            adresse.pays,
            adresse.villes,
            user.`point`
            From
            token Inner Join
            user On token.ref_id_user = user.id Inner Join
            adresse On adresse.ref_id_user = user.id WHERE token.token=:token");
            $select->bindParam(':token',$parametre['token']);
            $select->execute();
            $data=$select->fetch(PDO::FETCH_ASSOC);
            return $data;
        } catch (PDOException $e) {
            return "Erreur !: " . $e->getMessage() . "<br/>";
            die();
        }
    }


    function deleteCookie($token)
    {
        try {
            $data_base=$this->connection();
            $delete = $data_base->prepare("DELETE FROM token WHERE token=:token");
            $delete->bindParam(':token',$token);
            $delete->execute();
            return true;
        } catch (PDOException $e) {
            return "Erreur !: " . $e->getMessage() . "<br/>";
            die();
        }
    }
}