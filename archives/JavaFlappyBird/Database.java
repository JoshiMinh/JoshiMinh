import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    private static final String URL = "jdbc:mysql://f5-9w.h.filess.io:3307/FlappyBird_everyfive";
    private static final String USERNAME = "FlappyBird_everyfive";
    private static final String PASSWORD = "056275ab3f3cb63acb751f882280ee8b10898612";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }
}