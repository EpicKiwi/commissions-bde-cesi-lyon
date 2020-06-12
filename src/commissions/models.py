from datetime import timedelta

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from rules.contrib.models import RulesModel

from commissions import rules
import rules as baseRules
from users.models import User


class Tag(models.Model):
    """
    Les tags associable aux commissions pour les trier et les retrouver
    """
    # Le nom du tag
    name = models.CharField(max_length=100, help_text="Displayname du tag")

    # Le nom du tag modifié pour tenir dans une URL
    slug = models.SlugField(unique=True, blank=True, help_text="Le nom du tag modifié pour être utilisé dans une URL (généré automatiquement)")

    # Couleur du tag
    color = models.CharField(max_length=20, help_text="Couleur HTML valide du tag dans le site")

    # Si le champ est en rapport avec le sport pour inciter à prendre une adhésion au BDS
    sport_related = models.BooleanField(default=False, help_text="Si tag est en rapport avec du sport, les utilisateurs seront encouragés à adhèrer au BDS")

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Tag, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Commission(RulesModel):
    """
    Le modèle contant toutes les informations d'une commission
    """

    # La commission est elle active et maintenue ?
    is_active = models.BooleanField(default=True, help_text="La commissions éfféctue elle des activités en ce moment et son conseil d'administration peut il être contacté ?")

    # Le nom de la commission
    name = models.CharField(max_length=30, help_text="Displayname de la commission")

    # Le nom de la commission modifié pour qu'il soit valide dans une URL
    slug = models.SlugField(unique=True, blank=True, help_text="Le nom de la commission modifié pour quil puisse être utilisé dans l'URL (généré automatiquement)")

    # Une courte description de la commission en quelques mots
    short_description = models.CharField(max_length=60, help_text="Une (très) courte déscription de la commission qui viens se blottur sou son nom en tant que tagline")

    # Une longue description formattée en Markdown
    description = models.TextField(help_text="Une loooongue description de la commission pouvant être formaté en Markdown")

    # Le logo de la commission
    logo = models.ImageField(upload_to="commission/logos", help_text="Le logo de la commission pour lui donner une belle image")

    # La banière de la commission
    banner = models.ImageField(upload_to="commission/banners", blank=True, null=True, help_text="Une grande bannière permettant de donner un look d'enfer à la commission")

    # L'utilisateur qui possède le rôle de président de la commission
    president = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='president_commissions', help_text="L'utilisateur définis comme président de cette commissions")

    # L'utilisateur qui possède le rôle de trésorier de la commission
    treasurer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='treasurer_commissions', help_text="L'utilisateur déffinis comme trésorier de la commission, il peut être le même que l'utilisateur ayant le rôle de président")

    # L'utilisateur qui possède le rôle de suppléant de la commission
    deputy = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='deputy_commissions', help_text="L'utilisateur ayant le rôle de suppléant sur cette commission")

    # La date de creation de la commission
    creation_date = models.DateTimeField(auto_now_add=True, help_text="Date de création de la commission")

    # La date de dissolution de la commission
    end_date = models.DateTimeField(default=None, blank=True, null=True, help_text="Date de dissolution de la commission, quand elle passe en `is_active = False`")

    # Les tags de la commission
    tags = models.ManyToManyField(Tag, blank=True, related_name='tags_commissions', help_text="L'ensemble des tags de la commission")

    # L'organisation en charge de la gestion de la commission (BDE ou BDS)
    organization_dependant = models.CharField(max_length=100, choices=[("bde", "BDE"), ("bds", "BDS")], default="bde", help_text="L'organisation à laquelle appartiens la commission")

    # Si la "commission" est un organisation, c'est a dire qu'elle n'apparait pas sur le liste des commission mais peut profiter de toutes les fonctionnalités des commissions comme les events, les hashtags, etc..
    is_organization = models.BooleanField(default=False, help_text="Définie que cet instance est une organisation et non une commission, une organisation n'apparait pas dans la liste des commissions mais dispose de toutes les fonctionnalités associés")

    def save(self, *args, **kwargs):
        if self.slug is None or self.slug == "":
            self.slug = slugify(self.name)

        super(Commission, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

    def has_team_member(self, request):
        return ((
            request.user.get_username() == self.president.get_username()
        ) or (
            request.user.get_username() == self.treasurer.get_username()
        ) or (
            self.deputy is not None and request.user.get_username() == self.deputy.get_username()
        ))

    def has_change_permission(self, request):
        return self.is_active and self.has_team_member(request)

    def has_change_members_permission(self, request):
        return self.is_active and request.user.get_username() == self.president.get_username()

    def in_commission_membre(self, request):
        for membre in MembreCommission.objects.filter(commission = self) :
            if(request.user.get_username() == membre.identification.get_username()):
                return self.is_active
        return False

    def get_membres(self):
        return MembreCommission.objects.filter(commission = self)

    def has_add_event_permission(self, request):
        return self.has_change_permission(request)

    def get_tags_names(self):
        return list(map(lambda x: x.name, self.tags.all()))

    class Meta:

        rules_permissions = {

            "view":             baseRules.always_allow,

            "change":           baseRules.is_active &
                                  baseRules.is_authenticated &
                                  rules.is_active_commission &
                                  rules.is_commission_team_member,

            "change_members":   rules.is_active_commission &
                                  rules.is_commission_president,

        }


class MembreCommission(models.Model):
    """
    Les membre de commission commissions
    """
    # L'ID du membre
    identification = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='membres', help_text="L'utilisateur ayant demandé cette adhesion")
    commission = models.ForeignKey(Commission, on_delete=models.SET_NULL, null=True, related_name='membres', help_text="La commission dans laquelle l'utilisateur a adhèré")
    join_date = models.DateTimeField(auto_now_add=True, help_text="La date de l'adhésion")

    # TODO Les permissions du membre
    role = models.CharField(max_length=50, default=None, null=True, blank=True, help_text="Le nom du rôle que l'utilisateur tiens avec cette adhésion. Si le rôle est définis, le membre est noté comme faisant partie du conseil d'administration mais n'as pas de permissions supplémentaires")

    def __str__(self):
        return self.identification.email + (" ( " + self.role + " )") if self.role is not None else ""


class Event(models.Model):
    """
    Les évènements créés par les commissions
    """
    # Le nom de l'évènement
    name = models.CharField(max_length=100, help_text="Dsiplayname de l'événement")

    # Le nom du tag modifié pour tenir dans une url
    slug = models.SlugField(unique=True, blank=True, help_text="Le nom de l'événement formaté pour être valide dans uen URL (Champ généré automatiquement)")

    # La description de l'évènement
    description = models.TextField(help_text="Une looogue description de l'événement pouvant être formaté en Markdown")

    # Emplacement de l'événement
    location = models.CharField(max_length=255, blank=True, null=True, help_text="L'emplacement de l'événement")

    # Photo de l'évènement
    banner = models.ImageField(upload_to="events/photos", blank=True, null=True, help_text="La bannière de lévénement pour lui donner un look d'enfer. Si elle n'est pas défnini, la bannière de la commission sera utilisée")

    # Commission liée à l'évènement
    commission = models.ForeignKey(Commission, on_delete=models.SET_NULL, null=True, related_name='events', help_text="La commission organisatrice de l'événement")

    # La date de creation de l'évènement
    creation_date = models.DateTimeField(auto_now_add=True, help_text="La date de création de l'événement sur le site")

    # La date de dernière mise à jour de l'évènement
    update_date = models.DateTimeField(auto_now=True, help_text="La date de dernière modification de l'événement")

    # La date de début l'évènement
    event_date_start = models.DateTimeField(help_text="La date à laquelle l'événement commence")

    # La date de fin de l'évènement
    event_date_end = models.DateTimeField(help_text="La date à laquelle l'événement se termine")

    def get_start_utc(self):
        return self.event_date_start - timedelta(hours=1)

    def get_end_utc(self):
        return self.event_date_end - timedelta(hours=1)

    def has_started(self):
        return self.event_date_start < timezone.now() and self.event_date_end > timezone.now()

    def has_ended(self):
        return self.event_date_end < timezone.now()

    def has_change_event_permission(self, request):
        return self.commission.has_change_permission(request)

    def get_commission_name(self):
        return self.commission.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Event, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Post(models.Model):

    date = models.DateTimeField(help_text="Date de publication du post")

    content = models.CharField(max_length=280)

    commission = models.ForeignKey(Commission, on_delete=models.CASCADE, related_name="posts")

    source = models.CharField(max_length=50, choices=[
        ('internal', 'Système interne'),
        ('twitter', 'Twitter')
    ], default="internal", help_text="Provenance du post")

    external_id = models.CharField(max_length=255, null=True, blank=True, help_text="Identifiant du post sur le site externe (Twitter, Instagram, etc...)")

    author = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="posts", null=True, blank=True)

    author_text = models.CharField(max_length=50, help_text="Texte alternatif de l'auteur dans le cas où l'utilisateur soit Null")

    author_image = models.CharField(max_length=255, blank=True, null=True, help_text="URL d'image de profil de l'auteur dans le cas ou l'utilisateur est null")

    is_moderated = models.BooleanField(help_text="Si le poste est modéré et masqué aux utilisateurs", default=False)

    def has_even_medias(self):
        return self.images.all().count() % 2 == 0

    def __str__(self):
        return "Post de {} le {}".format(self.author if self.author is not None else self.author_text, self.date)

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        if self.date is None:
            self.date = timezone.now()
        return super().save(force_insert, force_update, using, update_fields)


class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="posts/images")


def quester_query_validator(value):
    if value[0] != "#" and value[0] != "@":
        raise ValidationError('{} is not a valid query, must begin with # or @'.format(value))
    if " " in value:
        raise ValidationError('{} is not a valid query, must not contain space'.format(value))


class CommissionSocialQuester(models.Model):
    commission = models.ForeignKey(Commission, on_delete=models.CASCADE, related_name="social_questers")
    query = models.CharField(max_length=50, validators=[quester_query_validator])
    since_date = models.DateTimeField()

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        if self.since_date is None:
            self.since_date = timezone.now()
        return super().save(force_insert, force_update, using, update_fields)
