from django.db import models
import random
# Create your models here.
from django.urls import reverse
from django.utils.text import slugify
from shortener.random_readable import generate_random_string


class ShortUrl(models.Model):

	url = models.CharField(max_length=1024, help_text="L'URL à réduire")
	slug = models.CharField(max_length=50, blank=True, help_text="L'identifiant de l'URL (Généré si laissé vide)", unique=True)
	date = models.DateTimeField(auto_now_add=True, help_text="Date de création du lien")

	@property
	def short_url(self):
		return reverse("short_url", args=[self.slug])

	def generate_slug(self, length=8):
		return generate_random_string(length)

	def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
		if self.slug is None or self.slug == "":
			self.slug = self.generate_slug()
		self.slug = slugify(self.slug)
		try:
			return super().save(force_insert, force_update, using, update_fields)
		except ValueError:
			self.slug = None
			return self.save(force_insert, force_update, using, update_fields)

