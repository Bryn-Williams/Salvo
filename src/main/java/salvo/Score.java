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

    private double thescore;

    //END OF FIELDS or INSTANCE VARS
    //CONSTRUCTORS

    public Score(){}

    public Score(GamePlayer gameplayer, double thescore ){

        this.game = gameplayer.getGame();
        this.player = gameplayer.getPlayer();
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

    public double getThescore() {
        return thescore;
    }

    public void setThescore(double thescore) {
        this.thescore = thescore;
    }

    //END OF GETTERS AND SETTERS
}
