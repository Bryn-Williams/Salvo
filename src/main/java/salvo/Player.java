package salvo;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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

    private String password;

    //END OF FIELDS

    public Player() {}

    public Player(String userName, String password) {

        this.userName = userName;
        this.password = password;
    }

    //START OF GETTERS AND SETTERS
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

    public Score getScores(Game game) {

        Optional<Score> oneGameScore = scores.stream().filter(eachScore -> eachScore.getGame().equals(game)).findFirst();
        if (oneGameScore.isPresent()){

            return oneGameScore.get();
        }else{

            return null;
        }
    }

    public void setScores(Set<Score> scores) {
        this.scores = scores;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String toString() {

        return Id + " " +userName;
    }

    public double getNumberOfWins(){

        List<Double> allscores = new ArrayList<>();
        double total;

        //ADD SCORES TO LIST<OBJECT>
        for(Score x : scores){

            if(x.getThescore() == 1){

                allscores.add(x.getThescore());
            }
        }

        // COUNT THE LIST OF OBJECTS
        total = allscores.size();

        return total;
    }

    public double getNumberOfLosses(){

        List<Double> allscores = new ArrayList<>();
        double total;

        //ADD SCORES TO LIST<OBJECT>
        for(Score x : scores){

            if(x.getThescore() == 0){

                allscores.add(x.getThescore());
            }
        }

        // COUNT THE LIST OF OBJECTS
        total = allscores.size();

        return total;

    }

    public double getNumberOfTies(){


        List<Double> allscores = new ArrayList<>();
        double total;

        //ADD SCORES TO LIST<OBJECT>
        for(Score x : scores){

            if(x.getThescore() == 0.5){

                allscores.add(x.getThescore());
            }
        }

        // COUNT THE LIST OF OBJECTS
        total = allscores.size();

        return total;
    }

    public double getTotalScore(){

        double noOfWins = getNumberOfWins();
        double noOfLosses = getNumberOfLosses();
        double noOfTies = getNumberOfTies();

        double pointsFromWins = noOfWins;
        double pointsFromTies = noOfTies/2;


        double totalScore = pointsFromWins + pointsFromTies;

        return totalScore;

    }


    public Set<GamePlayer> getGamePlayers() {
        return GamePlayers;
    }

    public void setGamePlayers(Set<GamePlayer> gamePlayers) {
        GamePlayers = gamePlayers;
    }


}


