from django.contrib import admin

# Register your models here.
from index.models import QuickLink


@admin.register(QuickLink)
class QuickLinkAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {'fields': ('text', 'url', 'description')}),
        ("Organisation", {'fields': ('weight', 'page', 'expiration')}),
        ("Apparence", {'fields': ('style', 'icon')})
    )
    list_display = ('text', 'url', 'page', 'weight', 'expiration')
    search_fields = ('text', 'url')
    ordering = ('page', '-weight', '-expiration', 'text')
    list_filter = ("page", )
