import math, time, random
from tqdm import tqdm, trange

with trange(1000) as t:
    for i in t:
        t.set_description(f"Iteration {i+1}")
        sleeping_time = random.randint(1,100) / 100
        t.set_postfix(sleep=sleeping_time)
        time.sleep(sleeping_time)
        if i % 100 == 0:
            for _ in trange(10):
                time.sleep(0.5)