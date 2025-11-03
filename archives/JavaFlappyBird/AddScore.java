import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.swing.*;
import java.awt.*;

public class AddScore {
    private static final String INSERT_QUERY = "INSERT INTO single_player_scores (PlayerName, Score) VALUES (?, ?)";

    public AddScore(String player, double score) {
        if (player.isBlank()) {
            JOptionPane.showMessageDialog(null, "Player Name is empty!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        var star = new ImageIcon(new ImageIcon("images/star.png").getImage().getScaledInstance(45, 45, Image.SCALE_DEFAULT));

        try (Connection connection = Database.getConnection();
             PreparedStatement stmt = connection.prepareStatement(INSERT_QUERY)) {

            stmt.setString(1, player);
            stmt.setInt(2, (int) score);
            stmt.executeUpdate();

            JOptionPane.showMessageDialog(null, "Successfully Added Score: " + (int) score, "Score Added!", JOptionPane.INFORMATION_MESSAGE, star);

        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "Error: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}