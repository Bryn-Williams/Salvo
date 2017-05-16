package salvo;

import javax.persistence.*;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
public class GamePlayer {

    //INSTANCE VARIABLES
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long Id;
    private Date date = new Date();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_id")
    private Player player;


    @OneToMany(mappedBy = "gamePlayers", fetch = FetchType.EAGER)
    private Set<Ship> myships = new LinkedHashSet<>();
    //END OF INSTANCE VARIABLES


    public GamePlayer() {};

    public GamePlayer(Game game, Player player) {
        this.game = game;
        this.player = player;
    }

    public Player getPlayer() {
        return player;
    }

    public Set<Ship> getMyships() {
        return myships;
    }

    public void setMyships(Set<Ship> myships) {
        this.myships = myships;
    }

    public Game getGame() {
        return game;
    }

    public void addShip(Ship ship){

        ship.setGamePlayers(this);
        myships.add(ship);

    }



    // ID METHOD
    public long getId() {
        return Id;
    }
    public void setId(long id) {
        Id = id;
    }
    //DATE METHOD
    public Date getDate() {
        return date;
    }
    public void setDate(Date date) {
        this.date = date;
    }



}
