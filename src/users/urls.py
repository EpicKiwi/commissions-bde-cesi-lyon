from django.urls import path

from users import views

urlpatterns = [
    path("login", views.auth, name="index"),
    path("auth/viacesi", views.auth_callback, name="viacesi-auth"),
    path("logout", views.logoutView, name="logout"),
    path("profile/<slug:slug>", views.view_profile, name="profile"),
    path("profile/<slug:slug>/edit", views.edit_profile, name="profile")
]