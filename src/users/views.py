import logging
import os
from random import randrange
from django.db.models import Q

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404

from bdecesi.keys import AUTH_VIACESI_TENANT_ID, AUTH_VIACESI_APP_ID
from users.models import User
from commissions.models import Commission, Post

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


def view_profile(request, slug=None):
    user = request.user if slug is None else get_object_or_404(User, slug=slug)


    allMemberCommissions = Commission.safe_objects.filter(
        is_active=True,
        membres__identification=user).exclude(is_organization=True).distinct()

    memberOrganization = Commission.objects.filter(
        Q(is_active=True) & (
            Q(membres__identification=user) |
            Q(president=user) | 
            Q(treasurer=user) | 
            Q(deputy=user)) &
        Q(is_organization=True)).distinct()

    ownedCommissions = Commission.safe_objects.filter(
        Q(president=user) | 
        Q(treasurer=user) | 
        Q(deputy=user)).filter(
        is_active=True).exclude(is_organization=True).union(allMemberCommissions.exclude(membres__role=None)).distinct()

    memberCommissions = allMemberCommissions.filter(membres__role=None).distinct()

    posts = Post.safe_objects.filter(author=user).order_by("-date")

    return render(request, "view_profile.html", {
        'view_user': user,
        'owned_commissions': ownedCommissions.all(),
        'member_commissions': memberCommissions.all(),
        'commission_count': ownedCommissions.count(),
        'member_organization': memberOrganization.all(),
        'member_count': memberCommissions.count() + ownedCommissions.count(),
        'posts': posts.all()
    })

def view_self(request, slug=None):
    user = request.user

    selfPosts = Post.safe_objects.filter(author=user)
    memberCommissionsPost = Post.safe_objects.filter(commission__membres__identification=user)
    organizationPost = Post.safe_objects.filter(commission__is_organization=True)
    commissionsPost = Post.safe_objects.filter(
        Q(commission__president=user) | 
        Q(commission__treasurer=user) | 
        Q(commission__deputy=user))

    posts = selfPosts.union(memberCommissionsPost).union(commissionsPost).union(organizationPost).order_by("-date")

    return render(request, "self_dashboard.html", {
        'view_user': user,
        'posts': posts.all()[:20]
    })