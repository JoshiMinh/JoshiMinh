package offline;

public class ScoreEntry {
    public final String timestamp;
    public final String username;
    public final int score;

    public ScoreEntry(String timestamp, String username, int score) {
        this.timestamp = timestamp;
        this.username = username;
        this.score = score;
    }
}

