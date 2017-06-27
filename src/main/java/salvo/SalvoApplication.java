package salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);

	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository, SalvoRepository salvoRepository, ScoreRepository scoreRepository) {
		return (args) -> {

			//CREATE PLAYERS
			Player pOne = new Player("JackBauer", "24");
			Player pTwo = new Player("Chloe", "42");
			Player pThree = new Player("KimBauer", "kb");

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
			GamePlayer gp4 = new GamePlayer(gameThree, pOne);

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

			Score scoreOne = new Score(gp1, 1);
			Score scoreTwo = new Score(gp2, 0.5) ;

			//SAVE SCORE
			scoreRepository.save(scoreOne);
			scoreRepository.save(scoreTwo);

			//SAVE GAMEPLAYER
			gamePlayerRepository.save(gp1);
			gamePlayerRepository.save(gp2);
			gamePlayerRepository.save(gp3);
			gamePlayerRepository.save(gp4);

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
//BELOW DEFINES HOW TO AUTHENTICATE THE USERS GIVEN A USERNAME AND PASSWORD
@Configuration
class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {

    @Autowired
    PlayerRepository playerRepository;

    @Override
    public void init(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService());
    }

    @Bean
    UserDetailsService userDetailsService() {
        return new UserDetailsService(){

            @Override
            public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {

				Player theloggedinplayer = playerRepository.findByUserName(userName);
                if (theloggedinplayer != null) {

                    //Player player = players.get(0);

                    return new User(theloggedinplayer.getUserName(), theloggedinplayer.getPassword(),
                            AuthorityUtils.createAuthorityList("USER"));

                } else {

                    throw new UsernameNotFoundException("Unknown user: " + userName);
                }
            }
        };
    }
}
//BELOW - Having defined how to authenticate users, you now have to tell Spring who is authorized to see what
@Configuration
@EnableWebSecurity
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/thegame.html").permitAll()
				.antMatchers("/scripts/**").permitAll()
				.antMatchers("/Styles/**").permitAll()
				.antMatchers("/api/games").permitAll()
				.antMatchers("/api/players").permitAll()
				.anyRequest().fullyAuthenticated()
                .and()
                .formLogin();


        http.formLogin()
                .usernameParameter("name")
                .passwordParameter("pwd")
                .loginPage("/api/login");

        http.logout().logoutUrl("/api/logout");

        // turn off checking for CSRF tokens
        http.csrf().disable();

        // if user is not authenticated, just send an authentication failure response
        http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

        // if login is successful, just clear the flags asking for authentication
        http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

        // if login fails, just send an authentication failure response
        http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

        // if logout is successful, just send a success response
        http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());

    }

    private void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
        }
    }
}



