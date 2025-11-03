import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import javax.sound.sampled.FloatControl;

public class FlappyBird extends JPanel implements ActionListener, KeyListener {
    private Timer timer;
    private int birdX = 370, birdY = 225, birdVelocity, rotationAngle;
    private List<Rectangle> obstacles = new ArrayList<>();
    private Random random = new Random();
    private float score, gameVol = 0.8f;
    private boolean endGame, startGame = false, Down = true;
    private int Tick, space, distance, velocity, gravity;
    private int Diff, DefaultDiff, prevScore;
    private String playerName;
    private ImageIcon base, deadBird, flappyBirdIcon, backgroundImage, upperPipeIcon, lowerPipeIcon;

    public FlappyBird(String theme, int Difficulty, String playerName) {
        this.playerName = playerName;
        this.Diff = Difficulty;
        DefaultDiff = Diff;
        setDifficulty(Diff);
        flappyBirdIcon = new ImageIcon("themes/" + theme + "/bird.png");
        backgroundImage = new ImageIcon("themes/" + theme + "/background.png");
        upperPipeIcon = new ImageIcon("themes/" + theme + "/obsdown.png");
        lowerPipeIcon = new ImageIcon("themes/" + theme + "/obs.png");
        base = new ImageIcon("themes/" + theme + "/base.png");
        deadBird = new ImageIcon("themes/" + theme + "/dead_bird.png");
        backgroundImage = new ImageIcon(backgroundImage.getImage().getScaledInstance(800, 600, Image.SCALE_DEFAULT));
        flappyBirdIcon = new ImageIcon(flappyBirdIcon.getImage().getScaledInstance(50, 50, Image.SCALE_DEFAULT));
        base = new ImageIcon(base.getImage().getScaledInstance(800, 100, Image.SCALE_DEFAULT));
        addKeyListener(this);
        setFocusable(true);
        timer = new Timer(150, this);
        timer.start();
        generateObstacle();
    }

    public void setDifficulty(int difficulty) {
        int[][] settings = {
            {20, 220, 580, 3, 1},
            {16, 190, 530, 4, 1},
            {12, 150, 470, 6, 1},
            {8, 110, 110, 8, 2}
        };
        if (difficulty >= 0 && difficulty < settings.length) {
            int[] s = settings[difficulty];
            Tick = s[0];
            space = s[1];
            distance = s[2];
            velocity = s[3];
            gravity = s[4];
        }
    }

    public void getLevel(int level) {
        if (level >= prevScore + 4 * (Diff + 1) && Diff < 3) {
            prevScore = level;
            setDifficulty(++Diff);
            timer.setDelay(Tick);
        }
    }

    public void playSound(String soundFilePath, float volume) {
        try (AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(getClass().getResourceAsStream(soundFilePath))) {
            Clip clip = AudioSystem.getClip();
            clip.open(audioInputStream);
            if (clip.isControlSupported(FloatControl.Type.MASTER_GAIN)) {
                FloatControl gainControl = (FloatControl) clip.getControl(FloatControl.Type.MASTER_GAIN);
                float gain = gainControl.getMinimum() + (gainControl.getMaximum() - gainControl.getMinimum()) * volume;
                gainControl.setValue(gain);
            }
            clip.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void generateObstacle() {
        int width = 55;
        int height = random.nextInt(300) + 50;
        obstacles.add(new Rectangle(800, 0, width, height));
        obstacles.add(new Rectangle(800, height + space, width, 600 - height - space));
    }

    public void move() {
        if (endGame) {
            if (startGame) {
                birdVelocity += gravity;
                birdY += birdVelocity;
                if (birdY > 475) gameOver();
            }
            obstacles.removeIf(obstacle -> obstacle.x + obstacle.width < 0);
            if (obstacles.get(obstacles.size() - 1).x < distance) generateObstacle();
        } else if (startGame) {
            birdVelocity += gravity;
            birdY += birdVelocity;
            obstacles.forEach(obstacle -> obstacle.x -= velocity);
            Rectangle bird = new Rectangle(birdX, birdY, 50, 40);
            for (Rectangle obstacle : obstacles) {
                if (obstacle.intersects(bird) || birdY < 0 || birdY > 475) {
                    playSound("Sound/bird-hit.wav", gameVol);
                    endGame = true;
                } else if (birdX > obstacle.x && birdX < obstacle.x + velocity) {
                    score += 0.5;
                    playSound("Sound/point.wav", gameVol);
                }
            }
            if (obstacles.get(obstacles.size() - 1).x < distance) generateObstacle();
            obstacles.removeIf(obstacle -> obstacle.x + obstacle.width < 0);
        } else {
            birdY += Down ? 10 : -10;
            Down = !Down;
            obstacles.forEach(obstacle -> obstacle.x -= 0);
        }
    }

    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        backgroundImage.paintIcon(this, g, 0, 0);
        for (Rectangle obstacle : obstacles) {
            int lowerPipeHeight = 600 - obstacle.height - space;
            g.drawImage(lowerPipeIcon.getImage(), obstacle.x, obstacle.y + obstacle.height + space, obstacle.width, lowerPipeHeight, this);
            g.drawImage(upperPipeIcon.getImage(), obstacle.x, obstacle.y, obstacle.width, obstacle.height, this);
        }
        base.paintIcon(this, g, 0, 520);
        Graphics2D g2d = (Graphics2D) g;
        g2d.rotate(Math.toRadians(rotationAngle), birdX + 20, birdY + 22);
        flappyBirdIcon.paintIcon(this, g2d, birdX, birdY);
        g2d.rotate(-Math.toRadians(rotationAngle), birdX + 20, birdY + 22);
        g.setColor(Color.BLACK);
        g.setFont(new Font("Arial", Font.PLAIN, 60));
        String scoreString = Integer.toString((int) score);
        FontMetrics metrics = g.getFontMetrics();
        int x = (getWidth() - metrics.stringWidth(scoreString)) / 2;
        int y = 100;
        int strokeWidth = 2;
        ((Graphics2D) g).setStroke(new BasicStroke(strokeWidth));
        for (int i = -1; i <= 1; i++) {
            for (int j = -1; j <= 1; j++) {
                g.drawString(scoreString, x + i * strokeWidth, y + j * strokeWidth);
            }
        }
        g.setColor(Color.WHITE);
        g.drawString(scoreString, x, y);
        if (!endGame && !startGame) {
            ImageIcon startButton = new ImageIcon("images/start.png");
            startButton = new ImageIcon(startButton.getImage().getScaledInstance(150, 60, Image.SCALE_DEFAULT));
            startButton.paintIcon(this, g, birdX - 55, 400);
        }
        getLevel((int) score);
    }

    public void actionPerformed(ActionEvent e) {
        move();
        repaint();
    }

    public void closeGame() {
        SwingUtilities.getWindowAncestor(this).dispose();
    }

    public void keyPressed(KeyEvent e) {
        int keyCode = e.getKeyCode();
        if ((keyCode == KeyEvent.VK_SPACE || keyCode == KeyEvent.VK_UP) && !endGame) {
            startGame = true;
            timer.setDelay(Tick);
            birdVelocity = -13;
            rotationAngle = -20;
            playSound("Sound/flap.wav", gameVol);
        } else if (keyCode == KeyEvent.VK_ESCAPE) {
            timer.stop();
            ImageIcon pause = new ImageIcon("images/pause.png");
            pause = new ImageIcon(pause.getImage().getScaledInstance(30, 30, Image.SCALE_DEFAULT));
            int choice = JOptionPane.showOptionDialog(
                this,
                "Game Paused",
                "Pause",
                JOptionPane.YES_NO_CANCEL_OPTION,
                JOptionPane.INFORMATION_MESSAGE,
                pause,
                new Object[]{"Continue", "Restart", "Quit"},
                "Continue"
            );
            if (choice == JOptionPane.YES_OPTION) {
                timer.start();
            } else if (choice == JOptionPane.NO_OPTION) {
                restartGame();
            } else {
                closeGame();
                Launcher.restartLauncher();
            }
        }
    }

    public void keyReleased(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_SPACE) {
            rotationAngle = 30;
        }
    }

    public void keyTyped(KeyEvent e) {}

    public void gameOver() {
        timer.stop();
        deadBird = new ImageIcon(deadBird.getImage().getScaledInstance(45, 45, Image.SCALE_DEFAULT));
        int choice = JOptionPane.showOptionDialog(
            this,
            "You Lose",
            "Game Over",
            JOptionPane.YES_NO_OPTION,
            JOptionPane.INFORMATION_MESSAGE,
            deadBird,
            new Object[]{"Retry", "Save Score", "Quit"},
            "Retry"
        );
        if (choice == 0) {
            restartGame();
        } else if (choice == 1) {
            new AddScore(playerName, score * (Diff > 0 ? Math.pow(Diff, Diff - 1) : 1));
        } else {
            closeGame();
            Launcher.restartLauncher();
        }
    }

    public void restartGame() {
        score = 0;
        prevScore = 0;
        birdY = 225;
        birdVelocity = 0;
        rotationAngle = 0;
        startGame = false;
        endGame = false;
        Diff = DefaultDiff;
        setDifficulty(DefaultDiff);
        obstacles.clear();
        generateObstacle();
        timer.setDelay(150);
        timer.start();
    }
}