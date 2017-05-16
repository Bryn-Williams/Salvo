package salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepo;
    @Autowired
    private GamePlayerRepository gamePlayerRepo;


    @RequestMapping("/games")
    public Map<String,Object> getIds() {

        Map<String, Object> dto = new LinkedHashMap<>();

        dto.put("Games", gameRepo.findAll().stream()
                .map(eachGame -> master(eachGame))
                .collect(Collectors.toList()));

        return dto;
    }

    private Map<String, Object> master(Game game) {

        Map<String, Object> gameInfo = new LinkedHashMap<>();

        gameInfo.put("id", game.getId());
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

         return dto2;
    }

    //Method to return id and email
    private Map<String, Object> returnIdnEmail(Player player){

        Map<String, Object> dto3 = new LinkedHashMap<>();

        dto3.put("id", player.getId());
        dto3.put("email", player.getUserName());

        return dto3;
    }

    //METHOD TO RETURN JSON WITH GAMEPLAYER INFO

    @RequestMapping("/game_view/{nn}")
    private Map<String, Object> returnGamePlayerInfo(@PathVariable Long nn){

        GamePlayer currentGamePlayer = gamePlayerRepo.findOne(nn);
        Game currentGame = currentGamePlayer.getGame();

        Map<String, Object> dto4 = new LinkedHashMap<>();

        dto4.put("id: ", currentGame.getId() );
        dto4.put("created: ", currentGame.getDate());
        dto4.put("gamePlayers: ", currentGame.getGamePlayers().stream().map(eachGP -> getIdAndPlayer(eachGP)).collect(Collectors.toList()));
        dto4.put("ships: ", currentGamePlayer.getMyships().stream().map(eachShip -> getTypeAndLocation(eachShip)).collect(Collectors.toList()));

        return dto4;

    }

    private Map<String, Object> getIdAndPlayer(GamePlayer gamePlayer){

        Map<String, Object> dto5 = new LinkedHashMap<>();

        dto5.put("gamePlayer_id", gamePlayer.getId());
        dto5.put("player", gamePlayer.getPlayer());

        return dto5;

    }

    private Map<String, Object> getTypeAndLocation(Ship ship){

        Map<String, Object> dto6 = new LinkedHashMap<>();

        dto6.put("type", ship.getShipType());
        dto6.put("location", ship.getShipLocation());

        return dto6;

    }




}
