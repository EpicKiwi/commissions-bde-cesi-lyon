from django.db import models
from django.utils import timezone


class Document(models.Model):

    created_at = models.DateTimeField(default=timezone.now)
    role = models.CharField(max_length=100, choices=[
        ("status", "Status"),
        ("reglement-interieur", "Règlement interieur"),
        ("status-bds", "Status du BDS"),
        ("reglement-interieur-bds", "Règlement interieur du BDS"),
        ("gazette", "Gazette")
    ], help_text="De quel type de document sagit il")
    file = models.FileField(upload_to="documents", help_text="Le fichier du document pouvant être téléchargé")
    current_version = models.BooleanField(default=True, help_text="Le document est il la dernière version qui sera affichée sur le site")

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):

        super().save(force_insert, force_update, using, update_fields)

        conflicting_files = Document.objects.filter(role=self.role, current_version=True).exclude(id=self.id)
        if self.current_version and conflicting_files.count() > 0:
            for file in conflicting_files:
                file.current_version = False
                file.save()
