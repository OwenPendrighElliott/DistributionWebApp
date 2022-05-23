import numpy as np

def initialise_test_matrix(length):
    #return np.random.randint(0, np.random.randint(100,1000), length)
    #return [1, 1.1, 1.2, 1.6, 2.3, 2.9, 3.9, 7, 7.8, 8.2, 8.3, 8.2, 7.8, 7, 3.9, 2.9, 2.3, 1.6, 1.2, 1.1, 1]
    return  [0, 1, 0]

def normalise_input_matrix(matrix):
    return matrix / np.max(matrix)

def auc(matrix):
    area = 0
    for i in range(len(matrix) - 1):
        area += (matrix[i+1] + matrix[i]) / 2 / (len(matrix) - 1)
    return area

def get_mean(matrix, x, min_x, max_x):
    mean = 0
    for i in range(len(matrix) - 1):
        mean += (x[i+1] + x[i]) * (matrix[i+1] + matrix[i]) / 2 * (max_x - min_x) / max_x / (len(matrix) - 1) 
    return mean

def get_median(cdf, min_x, max_x):
    return (np.argmin(np.abs(cdf - 0.5)) + 0.5) / len(cdf) * (max_x - min_x) + min_x

def get_std(matrix, x, min_x, max_x):
    std = 0
    mean = get_mean(matrix, x, min_x, max_x)
    for i in range(len(matrix) - 1):
        std += ((((x[i+1] + x[i]) / 2 - mean) ** 2) * (matrix[i+1] + matrix[i]) / 4 / (len(matrix) - 1) * (max_x - min_x) / max_x) ** 0.5
    return std

def cdf(matrix):
    list_area = [0] * (len(matrix) - 1)
    cumu_area = 0
    for i in range(len(matrix) - 1):
        cumu_area += (matrix[i+1] + matrix[i]) / 2 / (len(matrix) - 1)
        list_area[i] = cumu_area
    return ([0] + list_area) / np.max(list_area)

def plot(x, y):
    import matplotlib.pyplot as plt
    plt.plot(x, y)
    plt.show()

def get_stats(matrix, cdf, x, min_x, max_x):
    return {
            'mean': get_mean(matrix, x, min_x, max_x), 
            'median': get_median(cdf, min_x, max_x), 
            'std': get_std(matrix, x, min_x, max_x)
           }

def main():
    y = normalise_input_matrix(initialise_test_matrix(10000))
    min_x, max_x = 0, 1
    x = np.linspace(min_x, max_x, len(y))
    print(cdf(y))
    print(get_stats(y, cdf(y), x, min_x, max_x))
    plot(x, y)

if __name__ == "__main__":
    main()