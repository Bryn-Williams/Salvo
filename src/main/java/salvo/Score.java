package salvo;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Score {
    //FIELDS or INSTANCE VARS

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long scoreId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_id")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game;

    @OneToMany(mappedBy = "score")
    private Set<GamePlayer> gameplayer;

    private double thescore;

    //END OF FIELDS or INSTANCE VARS
    //CONSTRUCTORS

    public Score(){}

    public Score(Game gameid, Player playerid, double thescore ){

        this.game = gameid;
        this.player = playerid;
        this.thescore = thescore;

    }

    //GETTERS AND SETTERS
    public long getScoreId() {
        return scoreId;
    }

    public void setScoreId(long scoreId) {
        this.scoreId = scoreId;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Set<GamePlayer> getGameplayer() {
        return gameplayer;
    }

    public void setGameplayer(Set<GamePlayer> gameplayer) {
        this.gameplayer = gameplayer;
    }

    public double getThescore() {
        return thescore;
    }

    public void setThescore(double thescore) {
        this.thescore = thescore;
    }

    //END OF GETTERS AND SETTERS
}
