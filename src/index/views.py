import random

from django.shortcuts import render
from django.utils import timezone

from commissions.models import Commission, Post
from commissions.models import Event

import datetime

from documents.models import Document
from index.models import QuickLink

def index(request):

    upcoming_events = Event.objects.filter(event_date_end__gte=datetime.datetime.now()).order_by("event_date_start")
    highlight_events = upcoming_events[:3]

    commissions = Commission.objects.order_by("-creation_date").filter(is_active=True).filter(is_organization=False)
    random_commissions = random.sample(list(commissions), min(5, len(commissions)))

    curated_commission = random_commissions[0] if len(random_commissions) > 0 else None

    past_events = Event.objects.filter(event_date_end__lt=datetime.datetime.now()).order_by("-event_date_start")[:50]

    quick_links = QuickLink.objects.filter(page="index").exclude(expiration__lte=timezone.now()).order_by("-weight")

    max_posts_date = datetime.datetime.now() - datetime.timedelta(days=30)

    post_list = Post.objects.filter(is_moderated=False, date__gte=max_posts_date).order_by("-date")

    last_news = None
    news_qs = Document.objects.filter(role="gazette").order_by("-created_at")

    if news_qs.count() > 0 and datetime.datetime.now(datetime.timezone.utc) - news_qs[0].created_at < datetime.timedelta(weeks=1):
        last_news = news_qs[0]



    return render(request, "index.html", {
        "random_commissions": random_commissions,
        "commission_count": commissions.count(),
        "upcoming_events": upcoming_events,
        "past_events": past_events,
        "past_events_count": past_events.count(),
        "quick_links": quick_links,
        "post_list": post_list,
        "last_news": last_news,
        "curated_commission": curated_commission,
        "highlight_events":highlight_events
    })



