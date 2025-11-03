package offline;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ScoreCsv {
    private final Path file;

    public ScoreCsv() {
        this(Paths.get("scores.csv"));
    }

    public ScoreCsv(Path file) {
        this.file = file;
    }

    public synchronized void append(String username, int score) throws IOException {
        ensureExists();
        String ts = DateTimeFormatter.ISO_INSTANT.format(Instant.now());
        String row = String.join(",",
                ts,
                escape(username),
                Integer.toString(score)
        ) + System.lineSeparator();
        Files.write(file, row.getBytes(StandardCharsets.UTF_8),
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    }

    public synchronized List<ScoreEntry> readAll() throws IOException {
        if (Files.notExists(file)) return Collections.emptyList();
        List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
        List<ScoreEntry> out = new ArrayList<>();
        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i);
            if (i == 0 && line.toLowerCase().startsWith("timestamp,")) continue; // skip header
            if (line.trim().isEmpty()) continue;
            List<String> cols = splitCsvLine(line);
            if (cols.size() < 3) continue;
            String ts = cols.get(0);
            String user = unescape(cols.get(1));
            int val;
            try {
                val = Integer.parseInt(cols.get(2).trim());
            } catch (NumberFormatException e) {
                continue;
            }
            out.add(new ScoreEntry(ts, user, val));
        }
        return out;
    }

    public synchronized int userHighScore(String username) throws IOException {
        int max = 0;
        for (ScoreEntry e : readAll()) {
            if (e.username.equals(username) && e.score > max) {
                max = e.score;
            }
        }
        return max;
    }

    public synchronized List<ScoreEntry> topN(int n) throws IOException {
        List<ScoreEntry> all = readAll();
        all.sort((a, b) -> Integer.compare(b.score, a.score));
        if (n < 0 || n > all.size()) n = all.size();
        return new ArrayList<>(all.subList(0, n));
    }

    private void ensureExists() throws IOException {
        if (Files.notExists(file)) {
            Files.write(file, "timestamp,username,score\n".getBytes(StandardCharsets.UTF_8),
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        }
    }

    private String escape(String s) {
        if (s == null) return "";
        String t = s.replace("\"", "\"\"");
        if (t.contains(",") || t.contains("\"") || t.contains("\n") || t.contains("\r")) {
            return "\"" + t + "\"";
        }
        return t;
    }

    private String unescape(String s) {
        String t = s.trim();
        if (t.startsWith("\"") && t.endsWith("\"") && t.length() >= 2) {
            t = t.substring(1, t.length() - 1).replace("\"\"", "\"");
        }
        return t;
    }

    private List<String> splitCsvLine(String line) {
        List<String> parts = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    sb.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                parts.add(sb.toString());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        parts.add(sb.toString());
        return parts;
    }
}

