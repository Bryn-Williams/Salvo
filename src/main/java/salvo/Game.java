package salvo;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
public class Game {

    //INSTANCE VARIABLES
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long Id;

    private Date date = new Date();

    @OneToMany(mappedBy = "game", fetch = FetchType.EAGER)
    Set<GamePlayer> GamePlayers;

    @OneToMany(mappedBy = "game", fetch = FetchType.EAGER)
    Set<Score> scores;
    //END OF INSTANCE VARIABLES


    public Set<GamePlayer> getGamePlayers() {
        return GamePlayers;
    }

    public Game() {}

    public long getId() {
        return Id;
    }

    public void setId(long id) {
        Id = id;
    }

    public Date getDate() { return date; }

    public void setDate(Date date) {
        this.date = date;
    }

    public Set<Score> getScores() {
        return scores;
    }

    public void setScores(Set<Score> scores) {
        this.scores = scores;
    }

}

