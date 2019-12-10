from django.contrib import admin
from shortener.models import ShortUrl

# Register your models here.


@admin.register(ShortUrl)
class ShortUrlAdmin(admin.ModelAdmin):
    date_hierarchy = "date"
    list_display = ("short_url", "url", "date")
    search_fields = ('slug', 'url')
    ordering = ('-date',)