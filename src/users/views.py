import logging
import os
from random import randrange

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from bdecesi.keys import AUTH_VIACESI_TENANT_ID, AUTH_VIACESI_APP_ID

logger = logging.getLogger(__name__)


def auth(request):

    state = "/"

    if "next" in request.GET:
        state = request.GET["next"]

    if request.user.is_authenticated:
        return redirect(state)

    if os.getenv("ENVIRONMENT", "production") == "production":
        redirection = request.build_absolute_uri("/auth/viacesi").replace("http://", "https://")
    else:
        redirection = request.build_absolute_uri("/auth/viacesi")

    return redirect(
        "https://login.microsoftonline.com/{}/oauth2/authorize?client_id={}&response_type=code&redirect_uri={}&response_mode=query&state={}".format(
            AUTH_VIACESI_TENANT_ID,
            AUTH_VIACESI_APP_ID,
            redirection,
            state))


def auth_callback(request):

    next = request.GET["state"]

    if "error" in request.GET:
        if request.GET["error"] != "access_denied":
            messages.add_message(request, messages.ERROR,
                                         "Erreur lors de la connexion, veuillez rééssayer ou contacter un administrateur si le problème persiste")
            print("Authentication with viacesi failed : {}".format(request.GET["error_description"]))
        return redirect(next)

    code = request.GET["code"]

    authenticated_user = authenticate(request, code=code)

    if authenticated_user is None:
        messages.add_message(request, messages.ERROR,
                             "Nous n'avons pas pu vous connecter, veuillez rééssayer ou contacter un administrateur si le problème persiste")
        logger.warning("Unauthenticated user")
        return redirect("/")

    login(request, authenticated_user)
    return redirect(next)


@login_required
def logoutView(request):
    messages.add_message(request, messages.SUCCESS, "À bientôt {}".format(request.user.first_name))
    logout(request)
    return redirect("/")
