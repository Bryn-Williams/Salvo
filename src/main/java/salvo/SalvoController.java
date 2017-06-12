package salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepo;
    @Autowired
    private GamePlayerRepository gamePlayerRepo;
    @Autowired
    private PlayerRepository playerRepo;


   @RequestMapping("/games")
    public Map<String,Object> getIds(Authentication authentication) {

        Map<String, Object> dto = new LinkedHashMap<>();

        dto.put("currentPlayer", getInfoOfLoggedOnPlayer(authentication));

        dto.put("games", gameRepo.findAll().stream()
                .map(eachGame -> getGameInfo(eachGame))
                .collect(Collectors.toList()));

        dto.put("listOfPlayers", playerRepo.findAll().stream()
               .map(eachPlayer -> getPlayer(eachPlayer))
               .collect(Collectors.toList()));

       return dto;
    }

    Map<String, Object> getInfoOfLoggedOnPlayer(Authentication authentication){

        if(authentication != null){

            Map<String, Object> dtoxx = new LinkedHashMap<>();

            List<Player> thisPlayerId = playerRepo.findByUserName(authentication.getName());

            Player theMoFRO = thisPlayerId.get(0);

            dtoxx.put("id", theMoFRO.getId());
            dtoxx.put("name", theMoFRO.getUserName());

            return dtoxx;

        }else {
            return null;
        }
    }

    private Map<String, Object> getPlayer(Player player) {

        Map<String, Object> playerInfo = new LinkedHashMap<>();

        playerInfo.put("NameOfPlayer", player.getUserName());
        playerInfo.put("Totalscore", player.getTotalScore());
        playerInfo.put("Wins", player.getNumberOfWins());
        playerInfo.put("Losses", player.getNumberOfLosses());
        playerInfo.put("Ties", player.getNumberOfTies());

        return playerInfo;
    };

    private Map<String, Object> getGameInfo(Game game) {

        Map<String, Object> gameInfo = new LinkedHashMap<>();

        gameInfo.put("gameId", game.getId());
        gameInfo.put("created", game.getDate());
        gameInfo.put("gamePlayers", game.getGamePlayers().stream()
                .map(eachGP -> returnIDnP(eachGP))
                .collect(Collectors.toList()));

        return gameInfo;
    }

    //METHOD TO RETURN GAMEPLAYER ID AND PLAYER
    private Map<String, Object> returnIDnP(GamePlayer gameplayer) {

        Map<String, Object> dto2 = new LinkedHashMap<>();

        dto2.put("id", gameplayer.getId());
        dto2.put("player", returnIdnEmail(gameplayer.getPlayer()));
        if(gameplayer.getScore() != null) {
            dto2.put("score", gameplayer.getScore().getThescore());
        }else{

            dto2.put("score", null);
        }

        return dto2;
    }

    //METHOD TO RETURN ID AND EMAIL
    private Map<String, Object> returnIdnEmail(Player player){

        Map<String, Object> dto3 = new LinkedHashMap<>();

        dto3.put("id", player.getId());
        dto3.put("email", player.getUserName());

        return dto3;
    }


    //METHOD TO RETURN JSON WITH GAMEPLAYER INFO
    @RequestMapping("/game_view/{nn}")
    private ResponseEntity<Map<String, Object>> returnGamePlayerInfo(@PathVariable Long nn, Authentication authentication){

        GamePlayer currentGamePlayer = gamePlayerRepo.findOne(nn);
        Game currentGame = currentGamePlayer.getGame();

        Long theLoggedinPlayer = getloggedPlayer(authentication);

        Map<String, Object> dto4 = new LinkedHashMap<>();


        dto4.put("id", currentGame.getId() );
        dto4.put("created", currentGame.getDate());
        dto4.put("gamePlayers", currentGame.getGamePlayers().stream()
                .map(eachGP -> getIdAndPlayer(eachGP))
                .collect(Collectors.toList()));

        dto4.put("ships", currentGamePlayer.getMyships().stream()
                .map(eachShip -> getTypeAndLocation(eachShip))
                .collect(Collectors.toList()));

        dto4.put("salvoes", currentGame.getGamePlayers().stream()
                .map(eachGamePlayer -> getSalvoes(eachGamePlayer))
                .collect(Collectors.toList()));

        if(currentGamePlayer.getPlayer().getId() == theLoggedinPlayer){

             return new ResponseEntity<>(dto4, HttpStatus.ACCEPTED);

        }else{

            return new ResponseEntity<Map<String, Object>>(makeMap("error", "YOU CANT SEE THIS"), HttpStatus.UNAUTHORIZED);

        }


    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    private Map<String, Object> getIdAndPlayer(GamePlayer gamePlayer){

        Map<String, Object> dto5 = new LinkedHashMap<>();

        dto5.put("gamePlayer_id", gamePlayer.getId());
        dto5.put("player", gamePlayer.getPlayer().getUserName());

        return dto5;
    }

    private Map<String, Object> getTypeAndLocation(Ship ship){

        Map<String, Object> dto6 = new LinkedHashMap<>();

        dto6.put("type", ship.getShipType());
        dto6.put("location", ship.getShipLocation());

        return dto6;
    }

    //RETURN SALVOES
    private List<Map<String, Object>> getSalvoes(GamePlayer gamePlayer) {

        Set<Salvo> salvoes = gamePlayer.getMysalvoes();

        List<Map<String, Object>> dto999 = new ArrayList<>();

        for (Salvo salvoe : salvoes) {
            Map<String, Object> themap = new HashMap<>();

            themap.put("turn", salvoe.getTurnNumber());
            themap.put("locations", salvoe.getSalvoLocation());
            themap.put("gamePlayer", salvoe.getGamePlayers().getPlayer().getId());
            dto999.add(themap);
        }

       return dto999;

    }

    private Map<String,Object> getListOfGamesOfLoggedInPlayer(Player theLoggedinPlayer){

        Map<String,Object> listofgames = new LinkedHashMap<>();

        listofgames.put("GamesOfLoggedInPlayer", theLoggedinPlayer.getGamePlayers().stream()
                .map(gamePlayerrr -> gamePlayerrr.getId())
                .collect(Collectors.toList()));

        return listofgames;

    };


    public Long getloggedPlayer(Authentication authentication){

        List<Player> thisPlayerId = playerRepo.findByUserName(authentication.getName());

        Player theloggedinplayer = thisPlayerId.get(0);

        Long person = theloggedinplayer.getId();

        return person;

    };



    //METHODS TO CREATE NEW PLAYERS
    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<String> createUser(@RequestParam String name, @RequestParam String pwd) {

        List<Player> player = playerRepo.findByUserName(name);

        if (name.isEmpty()) {
            return new ResponseEntity<>("No name given", HttpStatus.FORBIDDEN);
        }

        if (!player.isEmpty()) {
            return new ResponseEntity<>("Name already used", HttpStatus.CONFLICT);
        }

        playerRepo.save(new Player(name, pwd));
        return new ResponseEntity<>("Named added", HttpStatus.CREATED);
    }

    //METHOD TO CREATE NEW GAME
    @RequestMapping(path = "/games", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createGame(Authentication authentication){

        if(authentication == null){

            return new ResponseEntity<>(makeMap("error", "YOU MUST SIGN IN TO CREATE") , HttpStatus.UNAUTHORIZED);
        }

        else{

            List<Player> thisPlayerId = playerRepo.findByUserName(authentication.getName());

            Player theloggedinplayer = thisPlayerId.get(0);

            //CREATE GAME
            Game newGame = new Game();
            gameRepo.save(newGame);

            //CREATE GAMEPLAYER FOR THIS GAME - THE LOGGED IN PERSON
            GamePlayer newGamePlayer = new GamePlayer(newGame, theloggedinplayer);
            gamePlayerRepo.save(newGamePlayer);

            return new ResponseEntity<>(makeMap("newGamePlayerId", newGamePlayer.getId()), HttpStatus.ACCEPTED);
        }

    }



    //METHOD TO JOIN GAME
    @RequestMapping(path = "/games/{xx}/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> joinGame(@PathVariable Long xx, Authentication authentication) {

        Game currentGame = gameRepo.findOne(xx);

        List<Player> thisPlayerId = playerRepo.findByUserName(authentication.getName());

        Player theloggedinplayer = thisPlayerId.get(0);


        //IF NOBODY HAS SIGNED IN,
        if (authentication == null) {
            return new ResponseEntity<>(makeMap("error", "YOU MUST SIGN IN TO JOIN"), HttpStatus.UNAUTHORIZED);
        }


        if (currentGame == null) {
            return new ResponseEntity<>(makeMap("error", "THIS GAME DOESNT EXIST"), HttpStatus.FORBIDDEN);
        }

        //lets check that the game has only one player

        if (currentGame.getGamePlayers().size() == 2) {
            return new ResponseEntity<>(makeMap("error", "THIS GAME IS FULL"), HttpStatus.FORBIDDEN);
        }

        //CREATE GAMEPLAYER
        GamePlayer theGPWhoIsGoingToJoin = new GamePlayer(currentGame, theloggedinplayer);

        //SAVE GAMEPLAYER
        gamePlayerRepo.save(theGPWhoIsGoingToJoin);

        return new ResponseEntity<>(makeMap("newGpID", theGPWhoIsGoingToJoin.getId()), HttpStatus.CREATED);

    }
}
