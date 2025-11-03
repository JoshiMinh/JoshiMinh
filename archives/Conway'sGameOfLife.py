import pygame
import random
import time

pygame.init()

WIDTH, HEIGHT = 600, 600
CELL_SIZE = 10
GRID_WIDTH, GRID_HEIGHT = WIDTH // CELL_SIZE, HEIGHT // CELL_SIZE
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Conway's Game of Life")

ALIVE_COLOR, DEAD_COLOR = (255, 255, 255), (0, 0, 0)
grid = [[random.choice([0, 1]) for _ in range(GRID_WIDTH)] for _ in range(GRID_HEIGHT)]

def draw_grid():
    for y in range(GRID_HEIGHT):
        for x in range(GRID_WIDTH):
            color = ALIVE_COLOR if grid[y][x] else DEAD_COLOR
            pygame.draw.rect(screen, color, (x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE))

def count_neighbors(x, y):
    return sum(grid[y + dy][x + dx] for dx in range(-1, 2) for dy in range(-1, 2)
               if 0 <= x + dx < GRID_WIDTH and 0 <= y + dy < GRID_HEIGHT and (dx, dy) != (0, 0))

def update_grid():
    return [[1 if (grid[y][x] == 1 and 2 <= count_neighbors(x, y) <= 3) or (grid[y][x] == 0 and count_neighbors(x, y) == 3) else 0
             for x in range(GRID_WIDTH)] for y in range(GRID_HEIGHT)]

running = True
while running:
    screen.fill(DEAD_COLOR)
    draw_grid()
    grid = update_grid()
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            x, y = pygame.mouse.get_pos()
            grid[y // CELL_SIZE][x // CELL_SIZE] ^= 1
    pygame.display.flip()
    time.sleep(0.1)

pygame.quit()