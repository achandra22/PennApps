import numpy as np

def calculate_norm_ham_dist(vector_a, vector_b):
    '''Calculates normalized hamming distance for two vectors'''
    '''Hamming Distance refers to the amount of times the bits differ (i.e. 100110 vs 100000 has a hamming distance of 2)'''

    # XORed (Exclusive Or) two vectors
    vector_c = vector_a ^ vector_b
    hamming_distance = np.sum(vector_c)

    # NORMALIZATION PROCESS
    normalized_hamming_distance = hamming_distance / vector_a.size

    print(normalized_hamming_distance)
    return normalized_hamming_distance


def bundle(random_binary_vector):
    '''Bundles together a list of vectors using a majority function through adding vectors columnwise,
    dividing by dimensions (i.e. items in vector), then rounding, returns one vector'''

    # If number of vectors are even, generate a random vector as a tiebreaker
    if np.shape(random_binary_vector)[0] % 2 == 0:
        # Generate one random vector
        tieBreaker = np.random.randint(2, size=(1,random_binary_vector[0].size))

        # add the tiebreaker
        random_binary_vector = np.concatenate((random_binary_vector, tieBreaker))
    return np.int_(np.round(sum(random_binary_vector / np.shape(random_binary_vector)[0])))


def calculate_index_of_similar_vector(vector,dictionary):
    '''Compares the hamming distances between one given vector and all the vectors in a dictionary, returns the index with the least hamming distance/most "similar"'''

    # lambda function to calculate hamming distance between given vector and all vectors in given dictionary, and goes through each row (column = 0, row = 1).
    # argmin() returns the index with the least value found
    index = np.argmin(np.apply_along_axis(lambda x: calculate_norm_ham_dist(vector, x), 1, dictionary))
    return index
