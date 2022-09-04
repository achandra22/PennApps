import numpy as np
from hdc_operations import *

# Examples could be...
# FACTOR A: Planet Score > 3
# Factor B: Animal Score > 3
# and add more!! // Factor C: FTI Index > 60%
sustainability_factors = np.array([
                            [0,0],
                            [0,1],
                            [1,0],
                            [1,1]
                            ])

# Decides if the previous factors lead to sustainability (0,0 = NOT sustainable and 1,1 = SUSTAINABLE)
sustainability = np.array([
                            [0,0],
                            [0,0],
                            [1,1],
                            [1,1]
                            ])

# INPUT FACTOR A,B,C OF THE COMPANY (i.e. zara's planet and animal score)
input = [1,1]

dim = 10000 # DIMENSION OF HBVS
num_of_factors = sustainability_factors.shape[1] # COLUMNS OF SUSTAINABILITY FACTORS
num_of_outputs = sustainability.shape[0] # ROWS OF SUSTAINABILITY

# Generates random 0s and 1s within a 3D Array
sustainability_hbvs = np.random.randint(0,2, size=(sustainability_factors.shape[0], num_of_factors, dim))
sustainability_hbvs_dict = {}

# Go through each item in sustainability factors
for column in range(sustainability_factors.shape[1]):
    for row in range(sustainability_factors.shape[0]):
        # Assign a key with location and the actual object at that location
        dict_key = (column, sustainability_factors[row][column])

        # Test if row is in the keys of the sustainability dictionary
        if (dict_key not in sustainability_hbvs_dict.keys()):

            # Value represents the hyperbinary vector of given key
            value = np.random.randint(0,2, size = (dim))

            # Update the sustainability dictionary with the key and value
            sustainability_hbvs_dict.update({dict_key : value})

# Store sensor dictionary values within a list
sustainability_list = []

# Iterate through the rows and binary values in the sustainability factors
for column in range(sustainability_factors.shape[1]):
    for row in range(sustainability_factors.shape[0]):
        # Append the values within the sustainable dictionary as a tuple to the action list
        sustainability_list.append(sustainability_hbvs_dict.get((column,sustainability_factors[row][column])))

# Generates 3D Array where each row is a conclusion of sustainability as a hbv of dimension 10000
outputs = np.random.randint(0,2, size=(num_of_outputs,1,dim))
outputs_dict = {}

# Iterate through the rows of the sustainabilty table
for row in range(sustainability.shape[0]):
    # Test to check if row is in the keys of the output dictionary
    if (tuple(sustainability[row]) not in outputs_dict.keys()):

        # Generates the key for a new output
        key = tuple(sustainability[row])
        # Value represents the hyperbinary vector of given key
        value = np.random.randint(0,2, size = (dim))
        # Update the output dictionary with the key and value
        outputs_dict.update({key : value})

# Store output dictionary values within a list
outputs_list = []
for row in range(sustainability.shape[0]):
    # Append the values within the output dictionary as a tuple to the action list
    outputs_list.append(outputs_dict.get(tuple(sustainability[row])))

# Bundle together the states row-wise in order to create scenes
scenes = []
for row in range(sustainability_hbvs.shape[0]):
    scene = bundle(sustainability_hbvs[row,:])
    scenes.append(scene)

# XOR the scenes and the actions to create scenario, then bundle scenario for Experience
Scenario = np.array(scenes) ^ np.array(outputs_list)
Experience = bundle(Scenario)



save = False
# Goes through each scene
for scene in range(len(scenes)):

    # Compares sensor data to truth table to determine current scene
    if (tuple(input) == tuple(sustainability_factors[scene])):
        scene_to_query = scenes[scene]
        save = True

if (save == False):
    vector_new_scene = []

    for column in range(sustainability_factors.shape[1]):
        hypervector = sustainability_hbvs_dict.get((column, input[column]))
        vector_new_scene.append(hypervector)

    scene_to_query = bundle(np.array(vector_new_scene))

output = ['not sustainable','not sustainable','sustainable', 'sustainable']

# Calculate hamming distance and returns index of action with smallest hamming distance
similar_vector = calculate_index_of_similar_vector(scene_to_query ^ Experience, outputs_list)

print("INPUT:::", input)
print("RESULT:::", output[similar_vector])
