from django.db import models
import random
# Create your models here.
from django.urls import reverse
from django.utils.text import slugify


class ShortUrl(models.Model):

	url = models.CharField(max_length=1024, help_text="L'URL à réduire")
	slug = models.CharField(max_length=50, blank=True, help_text="L'identifiant de l'URL (Généré si laissé vide)", unique=True)
	date = models.DateTimeField(auto_now_add=True, help_text="Date de création du lien")

	VOWELS = ["a", "i", "u", "e", "o"]
	ALPHABET = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "x", "z"]
	NUMBERS = ["2", "3", "4", "5", "6", "7", "8", "9"]

	@property
	def short_url(self):
		return reverse("short_url", args=[self.slug])

	def generate_slug(self, length=8):
		res = ""
		i = 0
		while len(res) < length:
			if i > length-3:
				res += self.NUMBERS[random.randrange(0, len(self.NUMBERS))]
			else:
				if i % 2 != 0:
					res += self.VOWELS[random.randrange(0, len(self.VOWELS))]
				else:
					res += self.ALPHABET[random.randrange(0, len(self.ALPHABET))]
			i += 1
		return res

	def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
		if self.slug is None or self.slug == "":
			self.slug = self.generate_slug()
		self.slug = slugify(self.slug)
		try:
			return super().save(force_insert, force_update, using, update_fields)
		except ValueError:
			self.slug = None
			return self.save(force_insert, force_update, using, update_fields)

