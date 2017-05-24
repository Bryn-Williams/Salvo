package salvo;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
public class Ship {

    //INSTANCE VARIABLES
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long ShipId;
    private String shipType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayers;

    @ElementCollection
    private List<String> shipLocation = new ArrayList<>();
    //END OF INSTANCE VARIABLES

    //GETTERS AND SETTERS
    public long getShipId() {
        return ShipId;
    }
    public void setShipId(long shipId) {
        ShipId = shipId;
    }


    public String getShipType() {
        return shipType;
    }
    public void setShipType(String shipType) {
        this.shipType = shipType;
    }

    public GamePlayer getGamePlayers() {
        return gamePlayers;
    }
    public void setGamePlayers(GamePlayer gamePlayers) {
        this.gamePlayers = gamePlayers;
    }

    public List<String> getShipLocation() {
        return shipLocation;
    }
    public void setShipLocation(List<String> shipLocation) {
        this.shipLocation = shipLocation;
    }

    //METHOD TO CREATE INSTANCES AKA CONSTRUCTOR METHOD!!

    public Ship(){}

    public Ship(String shipType, List shipLocation){

        this.shipType = shipType;
        this.shipLocation = shipLocation;
    }
}
