package salvo;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long Id;
    private String userName;

    @OneToMany(mappedBy = "player", fetch = FetchType.EAGER)
    Set<GamePlayer> GamePlayers;

    @OneToMany(mappedBy = "player", fetch = FetchType.EAGER)
    Set<Score> scores;
    
    public Player() {}

    public Player(String userName) { this.userName = userName; }

    public long getId() {
        return Id;
    }

    public void setId(long id) {
        this.Id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Set<Score> getScores(Game game) {

        return scores;

    }

    public void setScores(Set<Score> scores) {
        this.scores = scores;
    }

    public String toString() {

        return Id + " " +userName;
    }
}


