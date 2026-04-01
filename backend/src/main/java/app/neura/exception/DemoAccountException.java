package app.neura.exception;

public class DemoAccountException extends RuntimeException {
    public DemoAccountException() {
        super("Demo account is read-only");
    }
}
