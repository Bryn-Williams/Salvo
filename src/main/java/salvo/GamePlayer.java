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

    private String gameOutcome = "";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_id")
    private Player player;

    @OneToMany(mappedBy = "gamePlayers", fetch = FetchType.EAGER)
    private Set<Ship> myships = new LinkedHashSet<>();

    @OneToMany(mappedBy = "gamePlayers", fetch = FetchType.EAGER)
    private Set<Salvo> mysalvoes = new LinkedHashSet<>();


    //END OF INSTANCE VARIABLES

    //START OF METHOD CONSTRUCTOR
    public GamePlayer() {};

    public GamePlayer(Game game, Player player) {
        this.game = game;
        this.player = player;
    }
    //END OF METHOD CONSTRUCTOR

    public Game getGame() {
        return game;
    }

    public Player getPlayer() {
        return player;
    }

    public Set<Ship> getMyships() {
        return myships;
    }

    public void setMysalvoes(Set<Salvo> mysalvoes) {
        this.mysalvoes = mysalvoes;
    }

    public Set<Salvo> getMysalvoes() {
        return mysalvoes;
    }

    //ADD SHIP(S) TO EMPTY INSTANCE VARIABLE ABOVE
    public void addShip(Ship ship){

        ship.setGamePlayers(this);
        myships.add(ship);
    }
    //ADD SALVO(ES) TO EMPTY INSTANCE VARIABLE ABOVE
    public void addSalvo(Salvo salvo){

        salvo.setGamePlayers(this);
        mysalvoes.add(salvo);

    };

    public Score getScore(){

        return player.getScores(this.game);
    }


    // ID GETTER AND SETTER
    public long getId() {
        return Id;
    }
    public void setId(long id) {
        Id = id;
    }
    //DATE GETTER AND SETTER
    public Date getDate() {
        return date;
    }
    public void setDate(Date date) {
        this.date = date;
    }

  //GETTER AND SETTER FOR GAMEOUTCOME
      public String getGameOutcome() {
          return gameOutcome;
      }

        public void setGameOutcome(String gameOutcome) {
            this.gameOutcome = gameOutcome;
        }



}
