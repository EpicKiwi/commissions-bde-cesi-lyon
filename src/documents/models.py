from django.db import models
from django.utils import timezone
from rules.contrib.models import RulesModel

from users.models import User
import rules as baseRules


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


class Upload(RulesModel):

    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to="uploads", help_text="Le fichier pouvant être téléchargé")
    created_by = models.ForeignKey(User, related_name="uploads", on_delete=models.CASCADE)

    class Meta:

        rules_permissions = {
            "view":             baseRules.is_authenticated,
            "create":           baseRules.is_authenticated
        }
