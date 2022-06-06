import numpy as np

def initialise_test_matrix():
    #return [1, 1.1, 1.2, 1.6, 2.3, 2.9, 3.9, 7, 7.8, 8.2, 8.3, 8.2, 7.8, 7, 3.9, 2.9, 2.3, 1.6, 1.2, 1.1, 1]
    #return  [0, 1, 0]
    return np.array([1.4867195147343e-06, 2.45106104294233e-06, 3.99989037241663e-06, 6.4611663926488e-06, 1.03310065813217e-05, 1.63509588958253e-05, 2.56160811951383e-05, 3.97238223814148e-05, 6.09759039529897e-05, 9.26476353230142e-05, 0.000139341123134969, 0.000207440308767921, 0.000305686225478055, 0.000445889724807599, 0.000643795497926865, 0.000920104769622966, 0.00130165384164891, 0.00182273109600128, 0.00252649577810393, 0.00346643791897576, 0.00470779076312334, 0.00632877642858276, 0.00842153448411835, 0.0110925548393749, 0.0144624147976342, 0.0186646099340664, 0.0238432745020429, 0.0301496139168006, 0.0377369231406399, 0.0467541424067055, 0.0573380051248129, 0.0696039583923258, 0.0836361772145172, 0.0994771387927487, 0.117117359532744, 0.13648600918747, 0.157443187618844, 0.179774665124813, 0.203189835501224, 0.227323505631361, 0.251741946984239, 0.275953371470115, 0.2994226832711, 0.32159002340941, 0.341892294166129, 0.359786557812623, 0.37477397940639, 0.386422853089569, 0.394389234004919, 0.398433801691346, 0.398433801691346, 0.394389234004919, 0.386422853089569, 0.37477397940639, 0.359786557812623, 0.341892294166129, 0.32159002340941, 0.2994226832711, 0.275953371470116, 0.251741946984239, 0.227323505631361, 0.203189835501224, 0.179774665124813, 0.157443187618844, 0.13648600918747, 0.117117359532744, 0.0994771387927487, 0.0836361772145173, 0.0696039583923258, 0.0573380051248129, 0.0467541424067055, 0.03773692314064, 0.0301496139168007, 0.0238432745020429, 0.0186646099340664, 0.0144624147976342, 0.0110925548393749, 0.00842153448411835, 0.00632877642858276, 0.00470779076312334, 0.00346643791897576, 0.00252649577810393, 0.00182273109600128, 0.00130165384164891, 0.000920104769622967, 0.000643795497926863, 0.000445889724807599, 0.000305686225478057, 0.00020744030876792, 0.000139341123134969, 9.26476353230145e-05, 6.09759039529897e-05, 3.9723822381415e-05, 2.56160811951381e-05, 1.63509588958253e-05, 1.03310065813217e-05, 6.4611663926488e-06, 3.99989037241663e-06, 2.45106104294232e-06, 1.4867195147343e-06])

def deduplicate_vectors(x_vector, y_vector):
    x_vector, y_vector = x_vector[::-1], y_vector[::-1]
    i = 0
    while i < len(x_vector) - 1:
        j = i + 1
        while j < len(x_vector) and x_vector[i] == x_vector[j]:
            x_vector = np.delete(x_vector, j)
            y_vector = np.delete(y_vector, j)
        i += 1
    return x_vector[::-1], y_vector[::-1]

def auc(y_vector: np.ndarray) -> float:
    '''
    Calculates the area under the curve of a given y vector.

    Args:
        y_vector: The y vector to calculate the area under.
    Returns:
        float: The area under the curve of the given y vector.

    Examples:
        >>> y_vec = np.array([1, 2, 3, 4, 5])
        >>> area = auc(y_vec)
    '''
    area = 0
    count_y = len(y_vector)
    for i in range(count_y - 1):
        area += (y_vector[i+1] + y_vector[i]) / 2 / (count_y - 1)
    return area

def normalise_input_y_vector(y_vector: np.ndarray) -> np.ndarray:
    '''
    Normalises a vector by the area under its curve.

    Args:
        y_vector: The y vector to normalise.
    Returns:
        np.ndarray: The normalised y vector.

    Examples:
        >>> y_vec = np.array([1, 2, 3, 4, 5])
        >>> y_vec_norm = normalise_input_y_vector(y_vec)
    '''
    return y_vector / auc(y_vector)

def get_cdf(y_vector: np.ndarray) -> np.ndarray:
    '''
    Get the CDF from a y vector

    Args:
        y_vector: The y vector to get the CDF of.
    Returns:
        np.ndarray: The resulting CDF.

    Examples:
        >>> y_vec = np.array([1, 2, 3, 4, 5])
        >>> cdf = get_cdf(y_vec)
    '''
    count_y = len(y_vector)
    list_area = np.zeros(count_y)
    cum_area = 0
    for i in range(count_y - 1):
        cum_area += (y_vector[i+1] + y_vector[i]) / 2 / (count_y - 1)
        list_area[i] = cum_area
    return ([0] + list_area) / np.max(list_area)

def interp_x_y_vectors(x_vector, y_vector):
    '''
    Interpolates a y vector from x integers between the input minimum and maximum x. Requires the x vector to be integers.

    Args:
        x_vector: The x vector to interpolate from.
        y_vector: The y vector to interpolate to.
    Returns:
        np.ndarray: The interpolated y vector.

    Examples:
        >>> x_vector = np.array([1, 3, 5])
        >>> y_vector = np.array([2, 6, 10])
        >>> interp_x_y_vectors(x_vector, y_vector) = np.array([1, 2, 3, 4, 5]), np.array([2, 4, 6, 8, 10])
    '''
    new_x_vector = np.arange(np.min(x_vector), np.max(x_vector) + 1)
    new_y_vector = np.interp(new_x_vector, x_vector, y_vector)
    return new_x_vector, new_y_vector

def get_mean(x_vector, y_vector, x_range):
    mean = 0
    for i in range(len(y_vector) - 1):
        mean += (x_vector[i+1] + x_vector[i]) / 2 * (y_vector[i+1] + y_vector[i]) / 2 * (x_vector[i+1] - x_vector[i]) / x_range
    return mean

def get_median(x_vector, cdf):
    return x_vector[np.argmin(np.abs(cdf - 0.5))]

# Not correct
def get_std(x_vector, y_vector, mean, x_range):
    std = 0
    for i in range(len(y_vector) - 1):
        std += ((((x_vector[i+1] + x_vector[i]) / 2 - mean) ** 2) * (y_vector[i+1] + y_vector[i]) / 2 * (x_vector[i+1] - x_vector[i]) / x_range) ** 0.5
    return std

def plot(x_vector, y_vector):
    import matplotlib.pyplot as plt
    plt.plot(x_vector, y_vector)
    plt.show()

def get_stats(
              x_vector: np.ndarray,
              y_vector: np.ndarray,
              ) -> dict:
    '''
    Given a y vector, an x vector and a CDF use a provided x vector range to 
    extract the mean, median and standard deviation of the distribution that they represent.

    Args:
        x_vector: The vector of x points.
        y_vector: The vector of y points.
    Returns:
        tuple: The mean, median and standard deviation of the distribution that the x and y vectors represent.
    '''
    x_max = np.max(x_vector)
    x_min = np.min(x_vector)
    x_range = x_max - x_min
    cdf = get_cdf(y_vector)
    mean = get_mean(x_vector, y_vector, x_range)
    median = get_median(x_vector, cdf)
    std = get_std(x_vector, y_vector, mean, x_range)
    return {
            'mean': mean,
            'median': median,
            'std': std
           }