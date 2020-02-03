import random

from django.shortcuts import render

from commissions.models import Commission, Post
from commissions.models import Event

import datetime

from index.models import QuickLink


def index(request):

    upcoming_events = Event.objects.filter(event_date_end__gte=datetime.datetime.now()).order_by("event_date_start")

    commissions = Commission.objects.order_by("-creation_date").filter(is_active=True).filter(is_organization=False)
    random_commissions = random.sample(list(commissions), min(5, len(commissions)))

    past_events = Event.objects.filter(event_date_end__lt=datetime.datetime.now()).order_by("-event_date_start")[:50]

    quick_links = QuickLink.objects.filter(page="index").order_by("-weight")

    max_posts_date = datetime.datetime.now() - datetime.timedelta(days=30)

    post_list = Post.objects.filter(is_moderated=False, date__gte=max_posts_date).order_by("-date")

    return render(request, "index.html", {
        "random_commissions": random_commissions,
        "commission_count": commissions.count(),
        "upcoming_events": upcoming_events,
        "past_events": past_events,
        "past_events_count": past_events.count(),
        "quick_links": quick_links,
        "post_list": post_list
    })



