from django.urls import path

from shortener.views import go_short_url

urlpatterns = [
    path("<slug:slug>", go_short_url, name="short_url")
]