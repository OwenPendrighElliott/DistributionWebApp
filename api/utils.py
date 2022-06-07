import numpy as np

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
    Normalises a vector by the area under its curve, using the minimum value as zero.

    Args:
        y_vector: The y vector to normalise.
    Returns:
        np.ndarray: The normalised y vector.

    Examples:
        >>> y_vec = np.array([1, 2, 3, 4, 5])
        >>> y_vec_norm = normalise_input_y_vector(y_vec)
    '''
    y_vector_zero = y_vector - np.min(y_vector)
    scaled_y_vector = y_vector_zero / auc(y_vector_zero)
    return scaled_y_vector

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

def shift_x_vector(x_vector, x_min, x_max):
    x_vector_min, x_vector_max = np.min(x_vector), np.max(x_vector)
    return (x_vector - x_vector_min) / (x_vector_max - x_vector_min) * (x_max - x_min) + x_min

def prep_input_vectors(x_coords, y_coords, x_min, x_max):
    x_vector, y_vector = np.array(x_coords), np.array(y_coords)
    x_vector, y_vector = deduplicate_vectors(x_vector, y_vector)
    y_vector = normalise_input_y_vector(y_vector)
    x_vector, y_vector = interp_x_y_vectors(x_vector, y_vector)
    x_vector = shift_x_vector(x_vector, x_min, x_max)
    return x_vector, y_vector

def plot(x_vector, y_vector):
    import matplotlib.pyplot as plt
    plt.plot(x_vector, y_vector)
    plt.show()

