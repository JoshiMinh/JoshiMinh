import java.awt.Font;
import java.awt.Image;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;

public class ScoreBoard {
    public ScoreBoard() {
        try (Connection connection = Database.getConnection();
             PreparedStatement ps = connection.prepareStatement(
                     "SELECT PlayerName, MAX(Score) AS MaxScore FROM single_player_scores GROUP BY PlayerName ORDER BY MaxScore DESC");
             ResultSet rs = ps.executeQuery()) {

            var model = new DefaultTableModel(new Object[]{"Player", "Max Score"}, 0) {
                @Override
                public boolean isCellEditable(int row, int column) {
                    return false;
                }
            };

            while (rs.next()) {
                model.addRow(new Object[]{rs.getString("PlayerName"), rs.getInt("MaxScore")});
            }

            var table = new JTable(model);
            table.getTableHeader().setFont(table.getTableHeader().getFont().deriveFont(Font.BOLD));
            table.getTableHeader().setReorderingAllowed(false);

            var star = new ImageIcon(new ImageIcon("images/star.png").getImage()
                    .getScaledInstance(45, 45, Image.SCALE_DEFAULT));

            JOptionPane.showMessageDialog(null, new JScrollPane(table), "Player Scores",
                    JOptionPane.INFORMATION_MESSAGE, star);

        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "Database error: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(ScoreBoard::new);
    }
}