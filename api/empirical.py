import numpy as np
from utils import prep_input_vectors


def get_cdf(y_vector: np.ndarray) -> np.ndarray:
    '''
    Get the CDF from a y vector (assumes interpolated x)

    Args:
        y_vector: The y vector to get the CDF of.
    Returns:
        np.ndarray: The resulting CDF.

    Examples:
        >>> y_vec = np.array([1, 2, 3, 4, 5])
        >>> cdf = get_cdf(y_vector)
    '''
    count_y = len(y_vector)
    list_area = np.zeros(count_y)
    cum_area = 0
    for i in range(count_y - 1):
        cum_area += (y_vector[i+1] + y_vector[i]) / 2 / (count_y - 1)
        list_area[i+1] = cum_area
    return (list_area) / np.max(list_area)

def get_mean(x_vector, y_vector):
    '''
    Calculates the mean of the distribution that the x and y vectors represent. Assumes that the x vector has been interpolated.
    '''
    mean = 0
    count_y = len(y_vector)
    for i in range(count_y - 1):
        mean += (x_vector[i+1] + x_vector[i]) / 2 * (y_vector[i+1] + y_vector[i]) / 2 / (count_y - 1)
    return mean

def get_median(x_vector, cdf):
    return x_vector[np.argmin(np.abs(cdf - 0.5))]

def get_std(x_vector, y_vector):
    return (get_mean(x_vector ** 2, y_vector) - get_mean(x_vector, y_vector) ** 2) ** 0.5

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
    cdf = get_cdf(y_vector)
    mean = get_mean(x_vector, y_vector)
    median = get_median(x_vector, cdf)
    std = get_std(x_vector, y_vector)
    return {
            'mean': mean,
            'median': median,
            'std': std
           }

def get_samples(x_coords, y_coords, x_min, x_max, n_samples):
    '''
    Given a set of x and y coordinates, a minimum and maximum x value and a number of samples,
    this function returns a set of samples from the distribution represented by the x and y coordinates.

    Args:
        x_coords: The x coordinates of the distribution.
        y_coords: The y coordinates of the distribution.
        x_min: The minimum x value of the distribution.
        x_max: The maximum x value of the distribution.
        n_samples: The number of samples to generate.
    Returns:
        np.ndarray: The x and y coordinates of the samples.
    '''
    x_vector, y_vector = prep_input_vectors(x_coords, y_coords, x_min, x_max)
    cdf = get_cdf(y_vector)
    unif_samples = np.random.uniform(0, 1, n_samples)
    samples = np.interp(unif_samples, cdf, x_vector)
    return samples