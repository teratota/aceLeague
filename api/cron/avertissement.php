<?php
/*try {
    include('config/config_logs.php');
        try {
            $data_base = new PDO("mysql:host=$host;port=$port;dbname=$database",$user,$pass);
        } catch (PDOException $e) {
            print "Erreur !: " . $e->getMessage() . "<br/>";
        die();
        }
    $select = $data_base->prepare("Select
    reesrvation.ref_id_user,
    reservation.date_fin,
    reservation.date_debut
    FROM
    reservation 
    ");
    $select->execute();
    $data=$select->fetchAll();
    return $data;
} catch (PDOException $e) {
    return "Erreur !: " . $e->getMessage() . "<br/>";
    die();
}
$date1 = new DateTime("now");
$date1=$date1->format('Y-m-d');
foreach($data as $value){
    $datedebut = new DateTime($avelue["date_debut"]);
    $datedebut=$datedebut->format('Y-m-d');
    $datefin = new DateTime($avelue["date_fin"]);
    $datefin=$datefin->format('Y-m-d');
    if($datedebut == $date1){
        try {
            $data_base=$this->connection();
            $select = $data_base->prepare("Select user.mail From user Where user.id = :id");
            $select->bindParam(':id',$user);
            $select->execute();
            $data=$select->fetch(PDO::FETCH_ASSOC);
            return $data;
        } catch (PDOException $e) {
            return "Erreur !: " . $e->getMessage() . "<br/>";
            die();
        }
        $to = $data['mail'];
        $subject = "Information" ;
        $txt = "Noubliez pas de venir chercher votre vehicule";
        $headers = "From: emotion@emotion.com";
        mail($to,$subject,$txt,$headers);

    }
    if($datefin == $date1){
        try {
            $data_base=$this->connection();
            $select = $data_base->prepare("Select user.mail From user Where user.id = :id");
            $select->bindParam(':id',$user);
            $select->execute();
            $data=$select->fetch(PDO::FETCH_ASSOC);
            return $data;
        } catch (PDOException $e) {
            return "Erreur !: " . $e->getMessage() . "<br/>";
            die();
        }
        $to = $data['mail'];
        $subject = "Information" ;
        $txt = "votre resevation se termine aujourd'hui";
        $headers = "From: emotion@emotion.com";
        mail($to,$subject,$txt,$headers);

    }
}*/
?>