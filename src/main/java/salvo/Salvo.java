package salvo;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Salvo {

    //INSTANCE VARIABLES AKA FIELDS
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long salvoId;
    private int turnNumber;

    @ElementCollection
    private List<String> salvoLocation = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayers;
    
    //END OF INSTANCE VARIABLES

    //CONSTRUCTOR METHOD

    public Salvo(){}
    public Salvo(int turnNumber , List salvoLocation){

        this.turnNumber = turnNumber;
        this.salvoLocation = salvoLocation;

    }
    //END OF CONSTRUCTOR METHOD

    //ID GETTER AND SETTER
    public long getSalvoId() {
        return salvoId;
    }
    public void setSalvoId(long salvoId) {
        this.salvoId = salvoId;
    }

    //TURN NUMBER GETTER AND SETTER
    public int getTurnNumber() {
        return turnNumber;
    }
    public void setTurnNumber(int turnNumber) {
        this.turnNumber = turnNumber;
    }

    //LIST OF SALVO LOCATIONS GETTER N SETTER
    public List<String> getSalvoLocation() {
        return salvoLocation;
    }
    public void setSalvoLocation(List<String> salvoLocation) {
        this.salvoLocation = salvoLocation;
    }

    //GAMEPLAYER GETTER N SETTER
    public GamePlayer getGamePlayers() {
        return gamePlayers;
    }
    public void setGamePlayers(GamePlayer gamePlayers) {
        this.gamePlayers = gamePlayers;
    }
}
