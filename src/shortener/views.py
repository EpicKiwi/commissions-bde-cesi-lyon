from django.shortcuts import render, get_object_or_404, redirect

# Create your views here.
from shortener.models import ShortUrl


def go_short_url(request, slug):
	short = get_object_or_404(ShortUrl, slug=slug)
	return redirect(short.url)