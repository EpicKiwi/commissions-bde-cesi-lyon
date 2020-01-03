from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password is not None:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    """
    Modèle personnalisé d'utilisateurs pour inclure les informations d'authentification CESI
    et les informations relatives à la plateforme
    """

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    "L'adresse Email de l'utilisateur"
    email = models.EmailField(max_length=255, unique=True)

    # Image de profil de l'utilisateur
    profile_picture = models.ImageField(upload_to="user/profile", blank=True, null=True)

    "L'identifiant de l'utilisateur sur l'AD du CESI (None si l'utilisateur n'est pas enregistré via l'AD)"
    viacesi_id = models.CharField(max_length=50, unique=True, null=True, default=None)

    "Un champ boolean définissant si l'utilisateur peut se connecter et doit apparaitre sur le site comme membre actif"
    is_active = models.BooleanField(default=True)

    "L'utlisateur est il un référent pour le support, son nom et adresse email sera affiché sur le site en tant que référent"
    support_member = models.CharField(max_length=50, choices=[("bde", "BDE"), ("bds", "BDS")], null=True, blank=True, default=None)

    "Si l'utilisateur est créé via un utilisateur Viacesi"
    @property
    def is_viacesi(self):
        return self.viacesi_id is not None and self.viacesi_id != ""

    objects = UserManager()

    class Meta(AbstractUser.Meta):

        permissions = [
            ("view_full_profile", "Can view a complete profile of other users")
        ]
