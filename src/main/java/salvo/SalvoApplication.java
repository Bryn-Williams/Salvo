package salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.Arrays;


@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);

	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository, SalvoRepository salvoRepository, ScoreRepository scoreRepository) {
		return (args) -> {

			//CREATE PLAYERS
			Player pOne = new Player("Jack Bauer");
			Player pTwo = new Player("Chloe O'Brian");
			Player pThree = new Player("Kim Bauer");

			// SAVE PLAYERS
			playerRepository.save(pOne);
			playerRepository.save(pTwo);
			playerRepository.save(pThree);

			//CREATE GAMES
			Game gameOne = new Game();
			Game gameTwo = new Game();
			Game gameThree = new Game();

			//save games
			gameRepository.save(gameOne);
			gameRepository.save(gameTwo);
			gameRepository.save(gameThree);

			//CREATE GAMEPLAYER
			GamePlayer gp1 = new GamePlayer(gameOne, pOne);
			GamePlayer gp2 = new GamePlayer(gameOne, pTwo);
			GamePlayer gp3 = new GamePlayer(gameTwo, pThree);

			//CREATE SHIP
			Ship ship1 = new Ship("Carrier", new ArrayList<>(Arrays.asList("A1", "A2", "A3", "A4", "A5")));
			Ship ship2 = new Ship("Battleship", new ArrayList<>(Arrays.asList("B1", "B2", "B3", "B4")));
			Ship ship3 = new Ship("Submarine", new ArrayList<>(Arrays.asList("C1", "C2", "C3")));
			Ship ship4 = new Ship("Destroyer", new ArrayList<>(Arrays.asList("D1", "D2", "D3")));
			Ship ship5 = new Ship("Patrol Boat", new ArrayList<>(Arrays.asList("E1", "E2")));

			//ADD SHIPS TO GAME
			gp1.addShip(ship1);
			gp1.addShip(ship2);
			gp1.addShip(ship3);

			gp2.addShip(ship4);

			//CREATE SALVOES
			Salvo salvoOne = new Salvo(1, new ArrayList<>(Arrays.asList("H9", "I9", "J9")));
			Salvo salvoOneTwo = new Salvo(2, new ArrayList<>(Arrays.asList("H8", "I8", "J8")));
			Salvo salvoTwo = new Salvo(1, new ArrayList<>(Arrays.asList("F9", "G9", "H9")));
			Salvo salvoTwoTwo = new Salvo(2,new ArrayList<>(Arrays.asList("A5", "B5", "C5")));

			//ADD SALVO TO GAME
			gp1.addSalvo(salvoOne);
			gp1.addSalvo(salvoOneTwo);
			gp2.addSalvo(salvoTwo);
			gp2.addSalvo(salvoTwoTwo);

			//NEW SCORES

			Score scoreOne = new Score(gameOne, pOne, 1);
			Score scoreTwo = new Score(gameTwo, pThree, 2) ;

			//SAVE SCORE
			scoreRepository.save(scoreOne);
			scoreRepository.save(scoreTwo);

			//SAVE GAMEPLAYER
			gamePlayerRepository.save(gp1);
			gamePlayerRepository.save(gp2);
			gamePlayerRepository.save(gp3);

			//SAVE SHIP TO REPOSITORY
			shipRepository.save(ship1);
			shipRepository.save(ship2);
			shipRepository.save(ship3);
			shipRepository.save(ship4);
			shipRepository.save(ship5);

			//SAVE SALVO
			salvoRepository.save(salvoOne);
			salvoRepository.save(salvoTwo);
			salvoRepository.save(salvoOneTwo);
			salvoRepository.save(salvoTwoTwo);

		};
	}


}
