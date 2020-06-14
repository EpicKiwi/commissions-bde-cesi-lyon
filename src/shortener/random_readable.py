import random

VOWELS = ["a", "i", "u", "e", "o"]
ALPHABET = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "x", "z"]
NUMBERS = ["2", "3", "4", "5", "6", "7", "8", "9"]


def generate_random_string( length=8):
	res = ""
	i = 0
	while len(res) < length:
		if i > length-3:
			res += NUMBERS[random.randrange(0, len(NUMBERS))]
		else:
			if i % 2 != 0:
				res += VOWELS[random.randrange(0, len(VOWELS))]
			else:
				res += ALPHABET[random.randrange(0, len(ALPHABET))]
		i += 1
	return res