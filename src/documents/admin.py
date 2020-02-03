from django.contrib import admin

from documents.models import Document, Upload


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    date_hierarchy = "created_at"
    list_display = ("role", "created_at", "current_version")
    search_fields = ('role',)
    ordering = ('-created_at',)


@admin.register(Upload)
class UploadAdmin(admin.ModelAdmin):
    date_hierarchy = "created_at"
    list_display = ("created_by", "created_at", "file")
    search_fields = ('created_by', "file")
    ordering = ('-created_at',)
