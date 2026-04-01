package app.neura.exception;

public class WrongLoginCredentialsException extends RuntimeException {
    public WrongLoginCredentialsException() {
        super("Wrong email or password");
    }
}
