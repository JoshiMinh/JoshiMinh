import numpy as np

def softmax(z):
    exp_z = np.exp(z - np.max(z))
    return exp_z / exp_z.sum()

z = np.array([2.0, 1.0, 0.1])
print(softmax(z))